import { useEffect, useRef } from 'react';

import { SHAPES, SITE_SHAPES, scatter } from './shapes';

const SETS = { story: SHAPES, sites: SITE_SHAPES };

type ParticleMorphProps = {
	className?: string;
	/** Индекс фигуры (управляемый режим). Если не задан — фигуры меняются сами */
	shape?: number;
	/** Интервал автосмены фигур, мс */
	autoCycle?: number;
	/** Смещение центра фигуры по X на десктопе, доля видимой ширины (-0.5…0.5) */
	offsetX?: number;
	/** Масштаб фигуры */
	scale?: number;
	/** Набор фигур: абстрактные (story) или схемы сайтов (sites) */
	set?: keyof typeof SETS;
	/** Множитель количества частиц */
	density?: number;
	/** spin — непрерывное вращение, sway — покачивание (для плоских фигур) */
	motion?: 'spin' | 'sway';
};

const VERTEX = /* glsl */ `
	attribute float aRandom;
	uniform float uTime;
	uniform float uSize;
	uniform float uPixelRatio;
	varying float vRandom;

	void main() {
		vec3 p = position;
		// Лёгкое «дыхание» каждой частицы
		p += sin(uTime * 0.9 + aRandom * 6.2831 + position.yzx * 3.0) * 0.018;

		vec4 mv = modelViewMatrix * vec4(p, 1.0);
		gl_Position = projectionMatrix * mv;
		gl_PointSize = uSize * uPixelRatio * (0.45 + aRandom) / -mv.z;
		vRandom = aRandom;
	}
`;

const FRAGMENT = /* glsl */ `
	uniform vec3 uColorA;
	uniform vec3 uColorB;
	uniform float uOpacity;
	varying float vRandom;

	void main() {
		float d = length(gl_PointCoord - 0.5);
		float alpha = smoothstep(0.5, 0.0, d);
		vec3 color = mix(uColorA, uColorB, smoothstep(0.55, 1.0, vRandom));
		gl_FragColor = vec4(color, alpha * uOpacity);
	}
`;

/**
 * Облако частиц на WebGL (three.js), которое перетекает из одной
 * фигуры в другую: сфера → узел → куб → галактика.
 * three.js грузится лениво, рендер ставится на паузу вне экрана
 * и в фоновой вкладке. Без WebGL компонент просто ничего не рисует.
 */
export const ParticleMorph = ({
	className,
	shape,
	autoCycle = 4000,
	offsetX = 0,
	scale = 1,
	set = 'story',
	density = 1,
	motion = 'spin'
}: ParticleMorphProps) => {
	const hostRef = useRef<HTMLDivElement>(null);
	const shapeRef = useRef(shape ?? 0);
	const controlled = shape !== undefined;

	useEffect(() => {
		if (shape !== undefined) shapeRef.current = shape;
	}, [shape]);

	useEffect(() => {
		const host = hostRef.current;
		if (!host) return;

		let disposed = false;
		let cleanup = () => {};

		const init = async () => {
			const THREE = await import('three');
			if (disposed) return;

			const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
			const isSmall = window.innerWidth < 768;
			const count = Math.round((isSmall ? 1800 : 3600) * density);

			let renderer: InstanceType<typeof THREE.WebGLRenderer>;
			try {
				renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'high-performance' });
			} catch {
				return; // WebGL недоступен — остаётся обычная вёрстка
			}

			const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
			renderer.setPixelRatio(pixelRatio);
			renderer.setClearColor(0x000000, 0);
			host.appendChild(renderer.domElement);

			const scene = new THREE.Scene();
			const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
			camera.position.z = 4.2;

			// --- Геометрия ---
			const shapes = SETS[set].map((generate) => generate(count));
			const current = reducedMotion ? shapes[shapeRef.current % shapes.length].slice() : scatter(count);
			const randoms = new Float32Array(count);
			const speeds = new Float32Array(count);
			for (let i = 0; i < count; i++) {
				randoms[i] = Math.random();
				speeds[i] = 0.025 + Math.random() * 0.05;
			}

			const geometry = new THREE.BufferGeometry();
			const positionAttr = new THREE.BufferAttribute(current, 3);
			positionAttr.setUsage(THREE.DynamicDrawUsage);
			geometry.setAttribute('position', positionAttr);
			geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

			const material = new THREE.ShaderMaterial({
				vertexShader: VERTEX,
				fragmentShader: FRAGMENT,
				transparent: true,
				depthWrite: false,
				blending: THREE.AdditiveBlending,
				uniforms: {
					uTime: { value: 0 },
					uSize: { value: isSmall ? 18 : 22 },
					uPixelRatio: { value: pixelRatio },
					uOpacity: { value: 0.7 },
					uColorA: { value: new THREE.Color('#2f4bff') },
					uColorB: { value: new THREE.Color('#f6f7f9') }
				}
			});

			const points = new THREE.Points(geometry, material);
			const group = new THREE.Group();
			group.add(points);
			group.scale.setScalar(scale);
			scene.add(group);

			// --- Размеры ---
			const resize = () => {
				const { clientWidth: w, clientHeight: h } = host;
				if (!w || !h) return;
				renderer.setSize(w, h, false);
				camera.aspect = w / h;
				camera.updateProjectionMatrix();

				const visibleH = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
				const visibleW = visibleH * camera.aspect;
				group.position.x = window.innerWidth > 1024 ? visibleW * offsetX : 0;
			};
			resize();
			const resizeObserver = new ResizeObserver(resize);
			resizeObserver.observe(host);

			// --- Мышь ---
			const pointer = { x: 0, y: 0 };
			const onPointerMove = (event: PointerEvent) => {
				pointer.x = event.clientX / window.innerWidth - 0.5;
				pointer.y = event.clientY / window.innerHeight - 0.5;
			};
			if (!reducedMotion) window.addEventListener('pointermove', onPointerMove, { passive: true });

			// --- Автосмена фигур ---
			let cycleTimer = 0;
			if (!controlled && !reducedMotion && autoCycle > 0) {
				cycleTimer = window.setInterval(() => {
					shapeRef.current = (shapeRef.current + 1) % shapes.length;
				}, autoCycle);
			}

			// --- Видимость ---
			let visible = true;
			const io = new IntersectionObserver(([entry]) => {
				visible = entry.isIntersecting;
				if (visible) start();
			});
			io.observe(host);
			const onVisibility = () => {
				if (!document.hidden) start();
			};
			document.addEventListener('visibilitychange', onVisibility);

			// --- Цикл ---
			const timer = new THREE.Timer();
			let frame = 0;
			let spin = 0;
			let rotX = 0;
			let rotY = 0;

			const tick = (timestamp: number) => {
				frame = 0;
				if (disposed || !visible || document.hidden) return;

				timer.update(timestamp);
				const delta = Math.min(timer.getDelta(), 0.05);
				const elapsed = timer.getElapsed();
				const target = shapes[shapeRef.current % shapes.length];

				if (reducedMotion) {
					current.set(target);
				} else {
					for (let i = 0; i < count; i++) {
						const k = speeds[i];
						const j = i * 3;
						current[j] += (target[j] - current[j]) * k;
						current[j + 1] += (target[j + 1] - current[j + 1]) * k;
						current[j + 2] += (target[j + 2] - current[j + 2]) * k;
					}
					spin += delta * 0.18;
				}
				positionAttr.needsUpdate = true;

				rotX += (pointer.y * 0.5 - rotX) * 0.05;
				rotY += (pointer.x * 0.8 - rotY) * 0.05;
				if (motion === 'sway') {
					group.rotation.set(0.12 + rotX, -0.35 + Math.sin(spin * 2) * 0.35 + rotY, 0);
				} else {
					group.rotation.set(0.35 + rotX, spin + rotY, 0);
				}

				material.uniforms.uTime.value = elapsed;
				renderer.render(scene, camera);
				frame = requestAnimationFrame(tick);
			};

			const start = () => {
				if (!frame && !disposed) {
					// Сбрасываем дельту, чтобы после паузы фигура не «прыгала»
					timer.reset();
					frame = requestAnimationFrame(tick);
				}
			};

			start();
			host.classList.add('is-ready');

			cleanup = () => {
				cancelAnimationFrame(frame);
				window.clearInterval(cycleTimer);
				window.removeEventListener('pointermove', onPointerMove);
				document.removeEventListener('visibilitychange', onVisibility);
				resizeObserver.disconnect();
				io.disconnect();
				timer.dispose();
				geometry.dispose();
				material.dispose();
				renderer.dispose();
				renderer.domElement.remove();
			};
		};

		init();

		return () => {
			disposed = true;
			cleanup();
		};
	}, [autoCycle, controlled, offsetX, scale, set, density, motion]);

	return <div ref={hostRef} className={`particle-morph${className ? ` ${className}` : ''}`} aria-hidden='true' />;
};
