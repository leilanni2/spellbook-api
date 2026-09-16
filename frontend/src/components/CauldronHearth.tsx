const FLAMES = [
  { x: 30, scale: 1.15, hue: "url(#flameRed)", duration: 1.6, delay: 0 },
  { x: 100, scale: 1.3, hue: "url(#flameOrange)", duration: 1.3, delay: 0.15 },
  { x: 155, scale: 1.1, hue: "url(#flameRed)", duration: 1.5, delay: 0.35 },
  { x: 70, scale: 0.9, hue: "url(#flameYellow)", duration: 1.1, delay: 0.5 },
  { x: 125, scale: 0.85, hue: "url(#flameYellow)", duration: 1.2, delay: 0.05 },
];

export default function CauldronHearth() {
  return (
    <div className="relative mx-auto h-64 w-64 select-none">
      {/* warm glow cast upward from the fire */}
      <div
        className="animate-hearth-glow absolute bottom-2 left-1/2 h-40 w-56 -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,150,60,0.55) 0%, rgba(255,110,40,0.28) 40%, rgba(255,110,40,0) 72%)",
          filter: "blur(14px)",
        }}
      />

      {/* fire */}
      <svg
        viewBox="0 0 200 110"
        className="absolute bottom-4 left-1/2 h-28 w-52 -translate-x-1/2"
      >
        <defs>
          <radialGradient id="flameRed" cx="50%" cy="85%" r="70%">
            <stop offset="0%" stopColor="#ffb14d" />
            <stop offset="45%" stopColor="#e8562a" />
            <stop offset="100%" stopColor="#8a1f10" />
          </radialGradient>
          <radialGradient id="flameOrange" cx="50%" cy="85%" r="70%">
            <stop offset="0%" stopColor="#fff3a0" />
            <stop offset="45%" stopColor="#ff9a34" />
            <stop offset="100%" stopColor="#c8480f" />
          </radialGradient>
          <radialGradient id="flameYellow" cx="50%" cy="85%" r="70%">
            <stop offset="0%" stopColor="#fffce0" />
            <stop offset="50%" stopColor="#ffd76a" />
            <stop offset="100%" stopColor="#ff8a2e" />
          </radialGradient>
        </defs>
        {FLAMES.map((f, i) => (
          <path
            key={i}
            className="animate-flame"
            d="M50,100 C18,88 12,58 28,34 C22,48 38,26 50,6 C62,26 78,48 72,34 C88,58 82,88 50,100 Z"
            fill={f.hue}
            opacity={0.9}
            transform={`translate(${f.x - 50},0) scale(${f.scale})`}
            style={{
              transformOrigin: `${f.x}px 100px`,
              animationDuration: `${f.duration}s`,
              animationDelay: `${f.delay}s`,
            }}
          />
        ))}
      </svg>

      {/* cauldron */}
      <svg viewBox="0 0 240 220" className="absolute inset-x-0 top-0 h-56 w-64">
        <defs>
          <radialGradient id="potBase" cx="38%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#4a3628" />
            <stop offset="45%" stopColor="#2b1c12" />
            <stop offset="100%" stopColor="#130b06" />
          </radialGradient>
          <radialGradient id="rustPatch1" cx="28%" cy="62%" r="42%">
            <stop offset="0%" stopColor="#a85a2e" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#a85a2e" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="rustPatch2" cx="76%" cy="42%" r="38%">
            <stop offset="0%" stopColor="#8a4420" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#8a4420" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="wornPatch" cx="56%" cy="22%" r="30%">
            <stop offset="0%" stopColor="#c98f52" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#c98f52" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="underGlow" cx="50%" cy="92%" r="45%">
            <stop offset="0%" stopColor="#ff9d42" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#ff9d42" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="dripGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#c9702f" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#c9702f" stopOpacity="0" />
          </linearGradient>
          <clipPath id="potClip">
            <use href="#potOutline" />
          </clipPath>
          <filter id="potShadow" x="-40%" y="-20%" width="180%" height="180%">
            <feDropShadow dx="0" dy="10" stdDeviation="8" floodColor="#000" floodOpacity="0.55" />
          </filter>
        </defs>

        <g filter="url(#potShadow)">
          {/* legs (behind body) */}
          <g stroke="#0d0805" strokeWidth="2">
            <rect
              x="68" y="172" width="20" height="34" rx="6"
              fill="url(#potBase)"
              transform="rotate(-10 78 172)"
            />
            <rect
              x="110" y="176" width="20" height="38" rx="6"
              fill="url(#potBase)"
            />
            <rect
              x="152" y="172" width="20" height="34" rx="6"
              fill="url(#potBase)"
              transform="rotate(10 162 172)"
            />
          </g>

          {/* body */}
          <path
            id="potOutline"
            d="M58,38 C20,55 10,95 22,125 C10,150 30,172 62,178 C90,184 150,184 178,178 C210,172 230,150 218,125 C230,95 220,55 182,38 C170,30 150,26 120,27 C90,26 70,30 58,38 Z"
            fill="url(#potBase)"
            stroke="#0a0603"
            strokeWidth="3"
          />

          <g clipPath="url(#potClip)">
            <ellipse cx="70" cy="120" rx="55" ry="60" fill="url(#rustPatch1)" style={{ mixBlendMode: "multiply" }} />
            <ellipse cx="182" cy="90" rx="50" ry="55" fill="url(#rustPatch2)" style={{ mixBlendMode: "multiply" }} />
            <ellipse cx="134" cy="45" rx="42" ry="35" fill="url(#wornPatch)" style={{ mixBlendMode: "screen" }} />
            <ellipse cx="120" cy="185" rx="85" ry="42" fill="url(#underGlow)" style={{ mixBlendMode: "screen" }} opacity={0.6} />

            <path d="M72,45 C68,90 64,140 70,178" stroke="url(#dripGrad)" strokeWidth="5" fill="none" />
            <path d="M158,50 C164,95 168,145 160,178" stroke="url(#dripGrad)" strokeWidth="4" fill="none" />
            <path d="M120,40 C118,80 122,130 118,175" stroke="url(#dripGrad)" strokeWidth="3" fill="none" opacity={0.6} />
          </g>

          {/* rim */}
          <ellipse cx="120" cy="38" rx="64" ry="14" fill="#150d08" stroke="#6b4a2c" strokeWidth="2" strokeOpacity="0.6" />

          {/* handles */}
          <path d="M40,58 C24,64 24,84 42,88" fill="none" stroke="#0d0805" strokeWidth="5" strokeLinecap="round" />
          <path d="M200,58 C216,64 216,84 198,88" fill="none" stroke="#0d0805" strokeWidth="5" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}
