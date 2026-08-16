interface AgentAvatarProps {
  skin: string;
  hair: string;
  outfit: string;
  scale?: number;
}

const hairStyles: Record<string, { width: number; height: number; left: number; radius: string }> = {
  coils: { width: 120, height: 82, left: 55, radius: "58px 58px 30px 30px" },
  bob: { width: 128, height: 115, left: 51, radius: "58px 58px 18px 18px" },
  buzz: { width: 98, height: 54, left: 66, radius: "50px 50px 22px 22px" },
};

export function AgentAvatar({ skin, hair, outfit, scale = 1 }: AgentAvatarProps) {
  const h = hairStyles[hair] ?? hairStyles["coils"]!;

  return (
    <div
      className="relative"
      style={{ width: 230 * scale, height: 410 * scale }}
      aria-hidden="true"
    >
      <div style={{ transform: `scale(${scale})`, transformOrigin: "top left", width: 230, height: 410, position: "absolute" }}>
        <div
          className="absolute z-[4]"
          style={{
            left: h.left,
            top: 18,
            width: h.width,
            height: h.height,
            borderRadius: h.radius,
            background: "#17120f",
          }}
        />
        <div
          className="absolute z-[3]"
          style={{
            left: 68,
            top: 35,
            width: 95,
            height: 105,
            borderRadius: "48% 48% 44% 44%",
            background: skin,
          }}
        />
        <div
          className="absolute border"
          style={{
            left: 38,
            top: 125,
            width: 155,
            height: 210,
            borderRadius: "66px 66px 25px 25px",
            background: outfit,
            borderColor: "#51617a",
          }}
        />
        <div
          className="absolute"
          style={{ left: 47, top: 315, width: 62, height: 92, background: "#1b2330", borderRadius: "0 0 25px 25px" }}
        />
        <div
          className="absolute"
          style={{ right: 47, top: 315, width: 62, height: 92, background: "#1b2330", borderRadius: "0 0 25px 25px" }}
        />
        <div
          className="absolute z-[6] border-2"
          style={{
            right: 10,
            top: 183,
            width: 48,
            height: 90,
            borderRadius: 13,
            background: "#06080c",
            borderColor: "#627187",
            transform: "rotate(-8deg)",
            boxShadow: "0 0 25px rgba(105,231,255,.24)",
          }}
        />
      </div>
    </div>
  );
}
