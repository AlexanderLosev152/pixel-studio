import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ru" data-scroll-behavior="smooth">
      <Head>
        <link rel="icon" href="/images/free-icon-man-working.png" />
        <meta name="theme-color" content="#16181d" />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){var d=document.documentElement;d.classList.add('js');var skip=true;try{skip=!!sessionStorage.getItem('px-preloaded')||matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){}d.classList.add(skip?'is-loaded':'is-loading')})()"
          }}
        />
        <noscript>
          <style>{`[data-reveal], [data-reveal-stagger] > * { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>
        {/* Коды подтверждения — вставьте после регистрации сайта:
        <meta name="yandex-verification" content="..." />
        <meta name="google-site-verification" content="..." /> */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
