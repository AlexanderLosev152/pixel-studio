// Генераторы облаков точек. Каждая фигура — Float32Array длиной count * 3,
// все примерно в радиусе 1, чтобы морфинг между ними выглядел ровно.

type Generator = (count: number) => Float32Array;

const rand = (min: number, max: number) => min + Math.random() * (max - min);

/** Идея — сфера (равномерно по поверхности, спираль Фибоначчи) */
const sphere: Generator = (count) => {
	const out = new Float32Array(count * 3);
	const golden = Math.PI * (3 - Math.sqrt(5));

	for (let i = 0; i < count; i++) {
		const y = 1 - (i / (count - 1)) * 2;
		const r = Math.sqrt(1 - y * y);
		const theta = golden * i;
		const jitter = rand(0.97, 1.03);
		out[i * 3] = Math.cos(theta) * r * jitter;
		out[i * 3 + 1] = y * jitter;
		out[i * 3 + 2] = Math.sin(theta) * r * jitter;
	}
	return out;
};

/** Дизайн — торический узел (2,3) */
const torusKnot: Generator = (count) => {
	const out = new Float32Array(count * 3);
	const p = 2;
	const q = 3;
	const tube = 0.16;

	const point = (t: number) => {
		const r = 0.55 + 0.25 * Math.cos(q * t);
		return [r * Math.cos(p * t), r * Math.sin(p * t), 0.25 * Math.sin(q * t)];
	};

	for (let i = 0; i < count; i++) {
		const t = (i / count) * Math.PI * 2;
		const [x, y, z] = point(t);
		const [nx, ny, nz] = point(t + 0.001);

		// Касательная и перпендикуляры к ней — чтобы раскидать точки по трубке
		let tx = nx - x;
		let ty = ny - y;
		let tz = nz - z;
		const tl = Math.hypot(tx, ty, tz);
		tx /= tl;
		ty /= tl;
		tz /= tl;

		// b = t × (0, 0, 1)
		const bl = Math.hypot(ty, tx) || 1;
		const bx = ty / bl;
		const by = -tx / bl;
		const bz = 0;

		const cx = ty * bz - tz * by;
		const cy = tz * bx - tx * bz;
		const cz = tx * by - ty * bx;

		const a = Math.random() * Math.PI * 2;
		const rr = tube * Math.sqrt(Math.random());
		out[i * 3] = (x + (Math.cos(a) * bx + Math.sin(a) * cx) * rr) * 1.25;
		out[i * 3 + 1] = (y + (Math.cos(a) * by + Math.sin(a) * cy) * rr) * 1.25;
		out[i * 3 + 2] = (z + (Math.cos(a) * bz + Math.sin(a) * cz) * rr) * 1.25;
	}
	return out;
};

/** Код — куб: точки по граням, с подсветкой рёбер */
const cube: Generator = (count) => {
	const out = new Float32Array(count * 3);
	const s = 0.72;

	for (let i = 0; i < count; i++) {
		const coords = [rand(-s, s), rand(-s, s), rand(-s, s)];
		const axis = Math.floor(Math.random() * 3);
		coords[axis] = Math.random() < 0.5 ? -s : s;

		// Часть точек прижимаем к рёбрам — так грани читаются лучше
		if (Math.random() < 0.35) {
			const other = (axis + 1 + Math.floor(Math.random() * 2)) % 3;
			coords[other] = Math.random() < 0.5 ? -s : s;
		}

		out[i * 3] = coords[0];
		out[i * 3 + 1] = coords[1];
		out[i * 3 + 2] = coords[2];
	}
	return out;
};

/** Запуск — спиральная галактика */
const galaxy: Generator = (count) => {
	const out = new Float32Array(count * 3);
	const arms = 3;

	for (let i = 0; i < count; i++) {
		const radius = Math.pow(Math.random(), 0.7) * 1.25;
		const arm = ((i % arms) / arms) * Math.PI * 2;
		const spin = radius * 3.2;
		const spread = 0.18 * (1.2 - radius * 0.5);

		out[i * 3] = Math.cos(arm + spin) * radius + rand(-spread, spread);
		out[i * 3 + 1] = rand(-spread, spread) * 0.6;
		out[i * 3 + 2] = Math.sin(arm + spin) * radius + rand(-spread, spread);
	}
	return out;
};

export const SHAPES: Generator[] = [sphere, torusKnot, cube, galaxy];

/** Случайный «рассыпанный» вариант — стартовое состояние */
export const scatter: Generator = (count) => {
	const out = new Float32Array(count * 3);
	for (let i = 0; i < count * 3; i++) out[i] = rand(-3, 3);
	return out;
};

// --- Схемы сайтов (блок «Разработка сайтов под ключ») ---

type Primitive =
	| { kind: 'outline'; x: number; y: number; w: number; h: number; z?: number; weight?: number }
	| { kind: 'fill'; x: number; y: number; w: number; h: number; z?: number; weight?: number };

/** Раскидывает точки по набору прямоугольников (контуры и заливки), пропорционально весу */
const fromPrimitives = (primitives: Primitive[], count: number) => {
	const out = new Float32Array(count * 3);
	const weights = primitives.map((p) => {
		const base = p.kind === 'outline' ? (p.w + p.h) * 2 : p.w * p.h * 6;
		return base * (p.weight ?? 1);
	});
	const total = weights.reduce((sum, w) => sum + w, 0);

	let index = 0;
	primitives.forEach((p, i) => {
		const share = i === primitives.length - 1 ? count - index : Math.round((weights[i] / total) * count);
		for (let n = 0; n < share && index < count; n++, index++) {
			let x: number;
			let y: number;

			if (p.kind === 'outline') {
				// Точка на периметре
				let t = Math.random() * (p.w + p.h) * 2;
				if (t < p.w) {
					x = p.x + t;
					y = p.y;
				} else if ((t -= p.w) < p.h) {
					x = p.x + p.w;
					y = p.y + t;
				} else if ((t -= p.h) < p.w) {
					x = p.x + p.w - t;
					y = p.y + p.h;
				} else {
					t -= p.w;
					x = p.x;
					y = p.y + p.h - t;
				}
			} else {
				x = p.x + Math.random() * p.w;
				y = p.y + Math.random() * p.h;
			}

			out[index * 3] = x + rand(-0.008, 0.008);
			out[index * 3 + 1] = y + rand(-0.008, 0.008);
			out[index * 3 + 2] = (p.z ?? 0) + rand(-0.015, 0.015);
		}
	});
	return out;
};

/** Одна страница: шапка, первый экран, строки текста, блоки */
const pagePrimitives = (ox: number, oy: number, oz: number, w: number, h: number, sections = 3): Primitive[] => {
	const top = oy + h / 2;
	const left = ox - w / 2;
	const pad = w * 0.08;
	const inner = w - pad * 2;
	const list: Primitive[] = [
		{ kind: 'outline', x: left, y: oy - h / 2, w, h, z: oz, weight: 1.4 },
		// шапка
		{ kind: 'fill', x: left + pad, y: top - pad - 0.03, w: inner * 0.25, h: 0.03, z: oz },
		{ kind: 'fill', x: left + pad + inner * 0.55, y: top - pad - 0.03, w: inner * 0.45, h: 0.03, z: oz, weight: 0.6 },
		// первый экран
		{ kind: 'fill', x: left + pad, y: top - pad - 0.1 - h * 0.22, w: inner, h: h * 0.22, z: oz, weight: 0.5 }
	];

	let y = top - pad - 0.16 - h * 0.22;
	const step = (y - (oy - h / 2 + pad)) / sections;
	for (let s = 0; s < sections; s++) {
		list.push({ kind: 'fill', x: left + pad, y: y - 0.03, w: inner * 0.7, h: 0.025, z: oz, weight: 0.9 });
		list.push({ kind: 'fill', x: left + pad, y: y - 0.08, w: inner * 0.5, h: 0.02, z: oz, weight: 0.6 });
		list.push({ kind: 'outline', x: left + pad, y: y - step + 0.03, w: inner, h: step - 0.15, z: oz, weight: 0.7 });
		y -= step;
	}
	return list;
};

/** Лендинг — одна длинная страница */
const landing: Generator = (count) => fromPrimitives(pagePrimitives(0, 0, 0, 0.95, 1.9, 3), count);

/** Сайт-визитка — веер из нескольких страниц */
const pages: Generator = (count) =>
	fromPrimitives(
		[
			...pagePrimitives(-0.5, 0.18, -0.35, 0.8, 1.15, 1),
			...pagePrimitives(0, 0, 0, 0.8, 1.15, 1),
			...pagePrimitives(0.5, -0.18, 0.35, 0.8, 1.15, 1)
		],
		count
	);

/** Интернет-магазин — сетка карточек товаров */
const catalog: Generator = (count) => {
	const list: Primitive[] = [];
	const cols = 3;
	const rows = 2;
	const cw = 0.52;
	const ch = 0.72;
	const gap = 0.1;
	const width = cols * cw + (cols - 1) * gap;
	const height = rows * ch + (rows - 1) * gap;

	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < cols; c++) {
			const x = -width / 2 + c * (cw + gap);
			const y = height / 2 - (r + 1) * ch - r * gap;
			const z = (c - 1) * 0.12;
			list.push({ kind: 'outline', x, y, w: cw, h: ch, z, weight: 1.2 });
			// фото товара
			list.push({ kind: 'fill', x: x + 0.05, y: y + ch * 0.42, w: cw - 0.1, h: ch * 0.5, z, weight: 0.35 });
			// название и цена
			list.push({ kind: 'fill', x: x + 0.05, y: y + ch * 0.27, w: cw * 0.7, h: 0.025, z });
			list.push({ kind: 'fill', x: x + 0.05, y: y + 0.07, w: cw * 0.35, h: 0.05, z, weight: 0.8 });
		}
	}
	return fromPrimitives(list, count);
};

export const SITE_SHAPES: Generator[] = [landing, pages, catalog];
