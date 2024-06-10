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
    <div className="content bg-radial-gradient flex flex-col">
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
