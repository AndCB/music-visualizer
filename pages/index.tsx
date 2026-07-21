import Head from "next/head";
import Script from "next/script";
import { useEffect, useState } from "react";
import HeaderComponent from "@/components/HeaderComponent";
import AudioPlayer from "@/components/AudioPlayer";
import { AudioCanvas } from "@/components/AudioCanvas";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="content bg-gradient-to-br from-[#c850c0] via-[#da6fc7] to-[#7c3aed] dark:from-[#1a0533] dark:via-[#2d1060] dark:to-[#0d0d2b] flex flex-col relative">
      {/* Ambient blobs */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden -z-10"
        aria-hidden
      >
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] opacity-40 bg-pink-300 dark:bg-purple-700" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] opacity-30 bg-violet-400 dark:bg-indigo-800" />
      </div>
      <Head>
        <title>Music Visualizer</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
      </Head>
      <HeaderComponent />
      <AudioCanvas />
      <AudioPlayer />
    </div>
  );
}
