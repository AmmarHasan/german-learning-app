import React from "react";
import { AbsoluteFill, useVideoConfig, useCurrentFrame, interpolate, spring, Sequence, Img } from "remotion";
import { Check, X, ArrowUp } from "lucide-react";

export const SwipeAnimation: React.FC<{ type: "left" | "right" | "up", title: string, subtitle: string, scorePopup?: string }> = ({ type, title, subtitle, scorePopup }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animation values
  const entrance = spring({ frame, fps, config: { damping: 10 } });
  
  // Starting at frame 30, we begin the swipe
  const swipeProgress = spring({
    frame: frame - 40,
    fps,
    config: { damping: 14 }
  });

  const cardX = interpolate(swipeProgress, [0, 1], [0, type === "left" ? -400 : type === "right" ? 400 : 0]);
  const cardY = interpolate(swipeProgress, [0, 1], [0, type === "up" ? -400 : type === "left" ? 50 : type === "right" ? 50 : 0]);
  const rotation = interpolate(swipeProgress, [0, 1], [0, type === "left" ? -20 : type === "right" ? 20 : 0]);

  // Score popup timing
  const scoreProgress = spring({
    frame: frame - 55,
    fps,
    config: { damping: 12 }
  });
  
  const scoreY = interpolate(scoreProgress, [0, 1], [0, -100]);
  const scoreOpacity = interpolate(scoreProgress, [0, 0.8, 1], [0, 1, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0f172a", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
      {/* Title */}
      <div style={{ position: "absolute", top: 80, display: "flex", flexDirection: "column", alignItems: "center", opacity: entrance }}>
        <h1 style={{ color: "white", fontSize: 48, fontWeight: "bold", margin: 0 }}>{title}</h1>
        <p style={{ color: "#94a3b8", fontSize: 24, marginTop: 16 }}>{subtitle}</p>
      </div>

      {/* Score Popup */}
      {scorePopup && (
        <div style={{
          position: "absolute",
          top: 300,
          zIndex: 50,
          opacity: scoreOpacity,
          transform: `translateY(${scoreY}px) scale(${scoreProgress * 1.5})`,
          fontSize: 64,
          fontWeight: 900,
          fontStyle: "italic",
          color: type === "right" ? "#10b981" : "#f43f5e",
          textShadow: "2px 2px 0px white"
        }}>
          {scorePopup}
        </div>
      )}

      {/* Card */}
      <div style={{
        width: 320,
        height: 480,
        backgroundColor: "white",
        borderRadius: 24,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transform: `translate(${cardX}px, ${cardY}px) rotate(${rotation}deg) scale(${entrance})`,
        padding: 32,
        position: "relative",
      }}>
        <div style={{ fontSize: 42, fontWeight: "bold", color: "#0f172a", marginBottom: 16 }}>
          Vocabulary
        </div>
        <div style={{ fontSize: 24, color: "#64748b" }}>
          Wortschatz
        </div>

        {/* Indicators */}
        {swipeProgress > 0 && type === "right" && (
           <div style={{ position: "absolute", border: "4px solid #22c55e", color: "#22c55e", padding: "8px 16px", borderRadius: 8, fontSize: 32, fontWeight: "bold", top: 40, left: 40, transform: "rotate(-15deg)", opacity: swipeProgress }}>
             KNOWN
           </div>
        )}
        {swipeProgress > 0 && type === "left" && (
           <div style={{ position: "absolute", border: "4px solid #ef4444", color: "#ef4444", padding: "8px 16px", borderRadius: 8, fontSize: 32, fontWeight: "bold", top: 40, right: 40, transform: "rotate(15deg)", opacity: swipeProgress }}>
             LEARN
           </div>
        )}
        {swipeProgress > 0 && type === "up" && (
           <div style={{ position: "absolute", border: "4px solid #3b82f6", color: "#3b82f6", padding: "8px 16px", borderRadius: 8, fontSize: 32, fontWeight: "bold", bottom: 80, left: "50%", marginLeft: -60, opacity: swipeProgress }}>
             SKIP
           </div>
        )}
      </div>

      {/* Icons at bottom */}
      <div style={{ position: "absolute", bottom: 80, display: "flex", gap: 64, opacity: entrance }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", color: type === "left" && swipeProgress > 0 ? "#ef4444" : "#64748b", transform: `scale(${type === "left" ? 1 + swipeProgress * 0.2 : 1})` }}>
           <X size={48} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", color: type === "up" && swipeProgress > 0 ? "#3b82f6" : "#64748b", transform: `scale(${type === "up" ? 1 + swipeProgress * 0.2 : 1})` }}>
           <ArrowUp size={48} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", color: type === "right" && swipeProgress > 0 ? "#22c55e" : "#64748b", transform: `scale(${type === "right" ? 1 + swipeProgress * 0.2 : 1})` }}>
           <Check size={48} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const TutorialComposition: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: "#0f172a" }}>
            <Sequence from={0} durationInFrames={120}>
                <SwipeAnimation type="left" title="Swipe Left" subtitle="If you don't know the word" scorePopup="-20" />
            </Sequence>
            <Sequence from={120} durationInFrames={120}>
                <SwipeAnimation type="right" title="Swipe Right" subtitle="If you already know the word" scorePopup="+20" />
            </Sequence>
            <Sequence from={240} durationInFrames={120}>
                <SwipeAnimation type="up" title="Swipe Up" subtitle="To skip the word entirely" />
            </Sequence>
        </AbsoluteFill>
    )
}
