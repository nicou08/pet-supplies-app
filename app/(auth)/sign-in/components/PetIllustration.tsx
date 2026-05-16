export function PetIllustration() {
  return (
    <svg
      viewBox="0 0 520 620"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full max-h-[80vh]"
      aria-hidden="true"
    >
      {/* Background tick-mark accents (like the mockup) */}
      <g stroke="#FFB89A" strokeWidth="3" strokeLinecap="round" opacity="0.85">
        <line x1="40" y1="180" x2="70" y2="180" />
        <line x1="100" y1="140" x2="125" y2="140" />
        <line x1="60" y1="260" x2="95" y2="260" />
        <line x1="420" y1="120" x2="450" y2="120" />
        <line x1="460" y1="180" x2="490" y2="180" />
        <line x1="30" y1="360" x2="65" y2="360" />
        <line x1="440" y1="280" x2="475" y2="280" />
        <line x1="400" y1="340" x2="430" y2="340" />
        <line x1="60" y1="440" x2="100" y2="440" />
        <line x1="380" y1="430" x2="415" y2="430" />
      </g>

      {/* Ground shadow */}
      <ellipse cx="260" cy="555" rx="220" ry="14" fill="#FFD2B8" opacity="0.7" />

      {/* ===== DOG (left, sitting, orange/coral) ===== */}
      <g>
        {/* Body */}
        <path
          d="M120 540 C 95 540 80 510 90 470 C 100 430 130 410 165 410 C 200 410 230 430 240 470 C 250 510 235 540 210 540 Z"
          fill="#FF7461"
        />
        {/* Front legs */}
        <rect x="125" y="500" width="28" height="55" rx="12" fill="#FF7461" />
        <rect x="180" y="500" width="28" height="55" rx="12" fill="#FF7461" />
        {/* Paws */}
        <ellipse cx="139" cy="558" rx="18" ry="8" fill="#2B2B2B" />
        <ellipse cx="194" cy="558" rx="18" ry="8" fill="#2B2B2B" />
        {/* Tail */}
        <path
          d="M232 470 C 260 455 275 470 268 495 C 263 510 248 510 240 500"
          fill="#FF7461"
        />
        {/* Head */}
        <circle cx="165" cy="370" r="62" fill="#FF7461" />
        {/* Ears */}
        <path
          d="M108 340 C 95 305 105 285 125 285 C 138 285 145 305 138 340 Z"
          fill="#D9543E"
        />
        <path
          d="M222 340 C 235 305 225 285 205 285 C 192 285 185 305 192 340 Z"
          fill="#D9543E"
        />
        {/* Snout patch */}
        <ellipse cx="165" cy="395" rx="32" ry="22" fill="#FFD9CB" />
        {/* Nose */}
        <ellipse cx="165" cy="380" rx="9" ry="7" fill="#1F1F1F" />
        {/* Mouth */}
        <path
          d="M165 390 L 165 402 M 165 402 C 158 410 150 408 148 402 M 165 402 C 172 410 180 408 182 402"
          stroke="#1F1F1F"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Eyes */}
        <circle cx="143" cy="358" r="5" fill="#1F1F1F" />
        <circle cx="187" cy="358" r="5" fill="#1F1F1F" />
        {/* Eye highlights */}
        <circle cx="144.5" cy="356" r="1.6" fill="#FFF" />
        <circle cx="188.5" cy="356" r="1.6" fill="#FFF" />
      </g>

      {/* ===== CAT (right, standing/sitting, teal-black) ===== */}
      <g>
        {/* Tail (behind body) */}
        <path
          d="M430 470 C 470 460 480 420 460 400 C 445 388 432 405 440 425"
          fill="none"
          stroke="#1F2933"
          strokeWidth="14"
          strokeLinecap="round"
        />
        {/* Body */}
        <path
          d="M325 545 C 305 545 295 515 305 480 C 315 445 345 425 380 425 C 415 425 440 445 445 480 C 450 515 435 545 415 545 Z"
          fill="#2C3E50"
        />
        {/* Chest patch */}
        <path
          d="M355 470 C 360 510 380 525 395 510 C 405 495 400 470 390 460 Z"
          fill="#5BC0BE"
        />
        {/* Front legs */}
        <rect x="335" y="510" width="22" height="42" rx="9" fill="#2C3E50" />
        <rect x="395" y="510" width="22" height="42" rx="9" fill="#2C3E50" />
        {/* Head */}
        <circle cx="378" cy="390" r="52" fill="#2C3E50" />
        {/* Ears */}
        <path d="M338 360 L 326 305 L 360 340 Z" fill="#2C3E50" />
        <path d="M418 360 L 430 305 L 396 340 Z" fill="#2C3E50" />
        {/* Inner ears */}
        <path d="M342 348 L 338 320 L 354 338 Z" fill="#F58E7C" />
        <path d="M414 348 L 418 320 L 402 338 Z" fill="#F58E7C" />
        {/* Eyes */}
        <ellipse cx="360" cy="385" rx="6" ry="8" fill="#F4C430" />
        <ellipse cx="396" cy="385" rx="6" ry="8" fill="#F4C430" />
        <ellipse cx="360" cy="386" rx="2" ry="6" fill="#1F1F1F" />
        <ellipse cx="396" cy="386" rx="2" ry="6" fill="#1F1F1F" />
        {/* Nose */}
        <path d="M374 405 L 382 405 L 378 411 Z" fill="#F58E7C" />
        {/* Mouth */}
        <path
          d="M378 411 L 378 418 M 378 418 C 372 423 367 422 365 418 M 378 418 C 384 423 389 422 391 418"
          stroke="#1F1F1F"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Whiskers */}
        <g stroke="#1F1F1F" strokeWidth="1.5" strokeLinecap="round">
          <line x1="350" y1="412" x2="325" y2="408" />
          <line x1="350" y1="418" x2="325" y2="420" />
          <line x1="406" y1="412" x2="431" y2="408" />
          <line x1="406" y1="418" x2="431" y2="420" />
        </g>
      </g>

      {/* ===== GUINEA PIG (front center, oval, mustard) ===== */}
      <g>
        {/* Body */}
        <ellipse cx="270" cy="525" rx="78" ry="48" fill="#F4C430" />
        {/* White patch on side */}
        <path
          d="M250 510 C 270 495 295 500 305 520 C 295 540 270 545 250 535 Z"
          fill="#FFF5E0"
        />
        {/* Ears */}
        <ellipse
          cx="218"
          cy="498"
          rx="11"
          ry="9"
          fill="#F4C430"
          transform="rotate(-25 218 498)"
        />
        <ellipse
          cx="218"
          cy="498"
          rx="6"
          ry="5"
          fill="#F58E7C"
          transform="rotate(-25 218 498)"
        />
        {/* Nose */}
        <ellipse cx="200" cy="525" rx="6" ry="5" fill="#1F1F1F" />
        {/* Eye */}
        <circle cx="215" cy="515" r="4" fill="#1F1F1F" />
        <circle cx="216" cy="513.5" r="1.2" fill="#FFF" />
        {/* Mouth */}
        <path
          d="M200 530 C 203 535 208 535 210 532"
          stroke="#1F1F1F"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
        {/* Feet */}
        <ellipse cx="245" cy="568" rx="10" ry="5" fill="#D99A1F" />
        <ellipse cx="290" cy="568" rx="10" ry="5" fill="#D99A1F" />
      </g>

      {/* Leaf decoration (like mockup) */}
      <g>
        <path
          d="M150 595 C 130 585 130 565 150 558 C 170 565 170 585 150 595 Z"
          fill="#FF7461"
        />
        <path
          d="M165 600 C 175 588 195 588 200 600 C 195 610 175 610 165 600 Z"
          fill="#1F2933"
        />
      </g>
    </svg>
  );
}
