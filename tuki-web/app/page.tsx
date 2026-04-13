"use client";

import { useEffect, useRef, useState } from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import Script from "next/script";

export const dynamic = "force-dynamic";

declare global {
  interface Window {
    TUKI_REMOTE_CONFIG?: {
      enabled?: boolean;
      supabaseUrl?: string;
      supabaseAnonKey?: string;
      stateRowId?: string;
    };
    TUKI_SUPABASE_CLIENT?: SupabaseClient;
  }
}

export default function Home() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [shellReady, setShellReady] = useState(false);
  const [configReady, setConfigReady] = useState(false);
  const [bootReady, setBootReady] = useState(false);

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

  useEffect(() => {
    if (!shellReady || !configReady) {
      return;
    }

    const config = window.TUKI_REMOTE_CONFIG;
    if (
      config?.enabled &&
      config.supabaseUrl &&
      config.supabaseAnonKey &&
      !window.TUKI_SUPABASE_CLIENT
    ) {
      window.TUKI_SUPABASE_CLIENT = createClient(
        config.supabaseUrl,
        config.supabaseAnonKey,
        {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
          },
        },
      );
    }

    setBootReady(true);
  }, [configReady, shellReady]);

  return (
    <>
      <main className="min-h-screen">
        <div ref={mountRef} />
      </main>
      {shellReady ? (
        <>
          <Script
            src="/config.js"
            strategy="afterInteractive"
            onLoad={() => setConfigReady(true)}
          />
          {bootReady ? (
            <>
              <Script src="/qrcode.js" strategy="afterInteractive" />
              <Script src="/jsqr.min.js" strategy="afterInteractive" />
              <Script src="/legacy-app.js" strategy="afterInteractive" />
            </>
          ) : null}
        </>
      ) : null}
    </>
  );
}
