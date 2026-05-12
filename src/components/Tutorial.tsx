import React, { useEffect, useRef } from "react";
import { Player, PlayerRef } from "@remotion/player";
import { TutorialComposition } from "./TutorialComposition";
import { ArrowLeft } from "lucide-react";

export function Tutorial({ onBack }: { onBack: () => void }) {
  const playerRef = useRef<PlayerRef>(null);

  useEffect(() => {
    // Attempt to manually trigger play once mounted
    const timeout = setTimeout(() => {
      if (playerRef.current) {
        playerRef.current.play();
      }
    }, 50);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center">
      <div className="absolute top-6 left-6 z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-md transition-colors"
        >
          <ArrowLeft size={20} />
          Back
        </button>
      </div>
      
      <div className="w-full max-w-sm sm:max-w-md aspect-[9/16] shadow-2xl rounded-3xl overflow-hidden border border-white/10">
        <Player
          ref={playerRef}
          component={TutorialComposition}
          durationInFrames={380}
          compositionWidth={720}
          compositionHeight={1280}
          fps={45}
          style={{
            width: "100%",
            height: "100%",
          }}
          controls={false}
          autoPlay={false}
          loop={true}
        />
      </div>
    </div>
  );
}
