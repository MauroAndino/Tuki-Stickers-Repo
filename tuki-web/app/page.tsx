"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

export const dynamic = "force-dynamic";

export default function Home() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [shellReady, setShellReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadShell() {
      const response = await fetch("/legacy-shell.html");
      const html = await response.text();
      if (!cancelled && mountRef.current) {
        mountRef.current.innerHTML = html;
        setShellReady(true);
      }
    }

    loadShell().catch(console.error);

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <main className="min-h-screen">
        <div ref={mountRef} />
      </main>
      {shellReady ? (
        <>
          <Script src="/config.js" strategy="afterInteractive" />
          <Script src="/qrcode.js" strategy="afterInteractive" />
          <Script src="/jsqr.min.js" strategy="afterInteractive" />
          <Script src="/legacy-app.js" strategy="afterInteractive" />
        </>
      ) : null}
    </>
  );
}
