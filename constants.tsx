
import React from 'react';
import { OpeningType } from './types';

const NSS = "non-scaling-stroke";

const svgProps = {
  viewBox: "0 0 100 100",
  className: "w-full h-full",
  fill: "none",
  preserveAspectRatio: "none"
};

const GlassDef = () => (
  <defs>
    <linearGradient id="glassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#f8fafc" />
      <stop offset="100%" stopColor="#eff6ff" />
    </linearGradient>
  </defs>
);

const CiegaDef = () => (
  <defs>
    <linearGradient id="ciegaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#e2e8f0" />
      <stop offset="100%" stopColor="#cbd5e1" />
    </linearGradient>
  </defs>
);

const MirrorDef = () => (
  <defs>
    <linearGradient id="mirrorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#e2e8f0" />
      <stop offset="50%" stopColor="#f8fafc" />
      <stop offset="100%" stopColor="#cbd5e1" />
    </linearGradient>
  </defs>
);

export const OPENING_TYPES: OpeningType[] = [
  {
    id: 'pano_fijo',
    name: 'PAÑO FIJO',
    icon: (
      <svg {...svgProps}>
        <GlassDef />
        <rect x="0" y="0" width="100" height="100" fill="url(#glassGrad)" />
        <rect x="8" y="8" width="84" height="84" stroke="#cbd5e1" strokeWidth="1" vectorEffect={NSS} />
      </svg>
    )
  },
  {
    id: 'sliding_2',
    name: 'CORREDIZA 2 HOJAS',
    icon: (
      <svg {...svgProps}>
        <GlassDef />
        <rect x="0" y="0" width="100" height="100" fill="url(#glassGrad)" />
        <line x1="50" y1="0" x2="50" y2="100" stroke="#1e293b" strokeWidth="2" vectorEffect={NSS} />
        <path d="M30 50 L45 50 M40 45 L45 50 L40 55" stroke="#3b82f6" strokeWidth="2.5" vectorEffect={NSS} />
        <path d="M70 50 L55 50 M60 45 L55 50 L60 55" stroke="#3b82f6" strokeWidth="2.5" vectorEffect={NSS} />
      </svg>
    )
  },
  {
    id: 'sliding_3',
    name: 'CORREDIZA 3 HOJAS',
    icon: (
      <svg {...svgProps}>
        <GlassDef />
        <rect x="0" y="0" width="100" height="100" fill="url(#glassGrad)" />
        <line x1="33.3" y1="0" x2="33.3" y2="100" stroke="#1e293b" strokeWidth="2" vectorEffect={NSS} />
        <line x1="66.6" y1="0" x2="66.6" y2="100" stroke="#1e293b" strokeWidth="2" vectorEffect={NSS} />
        <path d="M20 50 L28 50 M25 45 L28 50 L25 55" stroke="#3b82f6" strokeWidth="2" vectorEffect={NSS} />
        <path d="M80 50 L72 50 M75 45 L72 50 L75 55" stroke="#3b82f6" strokeWidth="2" vectorEffect={NSS} />
      </svg>
    )
  },
  {
    id: 'sliding_4',
    name: 'CORREDIZA 4 HOJAS',
    icon: (
      <svg {...svgProps}>
        <GlassDef />
        <rect x="0" y="0" width="100" height="100" fill="url(#glassGrad)" />
        <line x1="25" y1="0" x2="25" y2="100" stroke="#1e293b" strokeWidth="1.5" vectorEffect={NSS} />
        <line x1="50" y1="0" x2="50" y2="100" stroke="#1e293b" strokeWidth="2" vectorEffect={NSS} />
        <line x1="75" y1="0" x2="75" y2="100" stroke="#1e293b" strokeWidth="1.5" vectorEffect={NSS} />
        <path d="M40 50 L48 50 M45 45 L48 50 L45 55" stroke="#3b82f6" strokeWidth="2" vectorEffect={NSS} />
        <path d="M60 50 L52 50 M55 45 L52 50 L55 55" stroke="#3b82f6" strokeWidth="2" vectorEffect={NSS} />
      </svg>
    )
  },
  {
    id: 'desplazable',
    name: 'DESPLAZABLE',
    icon: (
      <svg {...svgProps}>
        <GlassDef />
        <rect x="0" y="0" width="100" height="100" fill="url(#glassGrad)" />
        <path d="M0 0 L50 90 L100 0" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4,2" vectorEffect={NSS} />
        <path d="M0 100 L50 10 L100 100" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4,2" vectorEffect={NSS} />
      </svg>
    )
  },
  {
    id: 'oscilobatiente',
    name: 'OSCILOBATIENTE',
    icon: (
      <svg {...svgProps}>
        <GlassDef />
        <rect x="0" y="0" width="100" height="100" fill="url(#glassGrad)" />
        <path d="M0 100 L100 50 L0 0" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4,4" vectorEffect={NSS} opacity="0.5" />
        <path d="M0 100 L50 10 L100 100" stroke="#3b82f6" strokeWidth="2" strokeDasharray="6,4" vectorEffect={NSS} />
      </svg>
    )
  },
  {
    id: 'puerta_pivot_izq',
    name: 'PT PIVOT (IZQ)',
    icon: (
      <svg {...svgProps}>
        <GlassDef />
        <rect x="0" y="0" width="100" height="100" fill="url(#glassGrad)" />
        <line x1="20" y1="0" x2="20" y2="100" stroke="#1e293b" strokeWidth="3" vectorEffect={NSS} />
        <path d="M20 50 Q60 50 60 10" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4,2" vectorEffect={NSS} />
        <circle cx="20" cy="50" r="3" fill="#1e293b" />
      </svg>
    )
  },
  {
    id: 'puerta_pivot_der',
    name: 'PT PIVOT (DER)',
    icon: (
      <svg {...svgProps}>
        <GlassDef />
        <rect x="0" y="0" width="100" height="100" fill="url(#glassGrad)" />
        <line x1="80" y1="0" x2="80" y2="100" stroke="#1e293b" strokeWidth="3" vectorEffect={NSS} />
        <path d="M80 50 Q40 50 40 10" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4,2" vectorEffect={NSS} />
        <circle cx="80" cy="50" r="3" fill="#1e293b" />
      </svg>
    )
  },
  {
    id: 'ventana_rebatir_1_izq',
    name: 'VT REBATIR 1H (IZQ)',
    icon: (
      <svg {...svgProps}>
        <GlassDef />
        <rect x="0" y="0" width="100" height="100" fill="url(#glassGrad)" />
        <path d="M100 0 L0 50 L100 100" stroke="#3b82f6" strokeWidth="2" strokeDasharray="6,4" vectorEffect={NSS} />
      </svg>
    )
  },
  {
    id: 'ventana_rebatir_1_der',
    name: 'VT REBATIR 1H (DER)',
    icon: (
      <svg {...svgProps}>
        <GlassDef />
        <rect x="0" y="0" width="100" height="100" fill="url(#glassGrad)" />
        <path d="M0 0 L100 50 L0 100" stroke="#3b82f6" strokeWidth="2" strokeDasharray="6,4" vectorEffect={NSS} />
      </svg>
    )
  },
  {
    id: 'ventana_rebatir_2_izq',
    name: 'VT REBATIR 2H (IZQ ACT)',
    icon: (
      <svg {...svgProps}>
        <GlassDef />
        <rect x="0" y="0" width="100" height="100" fill="url(#glassGrad)" />
        <line x1="50" y1="0" x2="50" y2="100" stroke="#1e293b" strokeWidth="1.5" vectorEffect={NSS} />
        <path d="M0 0 L50 50 L0 100" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4,2" vectorEffect={NSS} />
        <path d="M100 0 L50 50 L100 100" stroke="#3b82f6" strokeWidth="1" strokeDasharray="2,2" vectorEffect={NSS} />
      </svg>
    )
  },
  {
    id: 'ventana_rebatir_2_der',
    name: 'VT REBATIR 2H (DER ACT)',
    icon: (
      <svg {...svgProps}>
        <GlassDef />
        <rect x="0" y="0" width="100" height="100" fill="url(#glassGrad)" />
        <line x1="50" y1="0" x2="50" y2="100" stroke="#1e293b" strokeWidth="1.5" vectorEffect={NSS} />
        <path d="M100 0 L50 50 L100 100" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4,2" vectorEffect={NSS} />
        <path d="M0 0 L50 50 L0 100" stroke="#3b82f6" strokeWidth="1" strokeDasharray="2,2" vectorEffect={NSS} />
      </svg>
    )
  },
  {
    id: 'puerta_rebatir_1_izq',
    name: 'PT REBATIR 1H (IZQ)',
    icon: (
      <svg {...svgProps}>
        <GlassDef />
        <rect x="0" y="0" width="100" height="100" fill="url(#glassGrad)" />
        <path d="M100 0 L0 50 L100 100" stroke="#3b82f6" strokeWidth="2" strokeDasharray="6,4" vectorEffect={NSS} />
        <rect x="85" y="45" width="4" height="15" fill="#94a3b8" rx="1" />
      </svg>
    )
  },
  {
    id: 'puerta_rebatir_1_der',
    name: 'PT REBATIR 1H (DER)',
    icon: (
      <svg {...svgProps}>
        <GlassDef />
        <rect x="0" y="0" width="100" height="100" fill="url(#glassGrad)" />
        <path d="M0 0 L100 50 L0 100" stroke="#3b82f6" strokeWidth="2" strokeDasharray="6,4" vectorEffect={NSS} />
        <rect x="11" y="45" width="4" height="15" fill="#94a3b8" rx="1" />
      </svg>
    )
  },
  {
    id: 'puerta_rebatir_1_media_izq',
    name: 'PT 1H MEDIA (IZQ)',
    icon: (
      <svg {...svgProps}>
        <GlassDef /> <CiegaDef />
        <rect x="0" y="0" width="100" height="50" fill="url(#glassGrad)" />
        <rect x="0" y="50" width="100" height="50" fill="url(#ciegaGrad)" />
        <path d="M100 0 L0 50 L100 100" stroke="#3b82f6" strokeWidth="2" strokeDasharray="6,4" vectorEffect={NSS} />
      </svg>
    )
  },
  {
    id: 'puerta_rebatir_1_media_der',
    name: 'PT 1H MEDIA (DER)',
    icon: (
      <svg {...svgProps}>
        <GlassDef /> <CiegaDef />
        <rect x="0" y="0" width="100" height="50" fill="url(#glassGrad)" />
        <rect x="0" y="50" width="100" height="50" fill="url(#ciegaGrad)" />
        <path d="M0 0 L100 50 L0 100" stroke="#3b82f6" strokeWidth="2" strokeDasharray="6,4" vectorEffect={NSS} />
      </svg>
    )
  },
  {
    id: 'puerta_rebatir_1_ciega_izq',
    name: 'PT 1H CIEGA (IZQ)',
    icon: (
      <svg {...svgProps}>
        <CiegaDef />
        <rect x="0" y="0" width="100" height="100" fill="url(#ciegaGrad)" />
        <path d="M100 0 L0 50 L100 100" stroke="#3b82f6" strokeWidth="2" strokeDasharray="6,4" vectorEffect={NSS} />
      </svg>
    )
  },
  {
    id: 'puerta_rebatir_1_ciega_der',
    name: 'PT 1H CIEGA (DER)',
    icon: (
      <svg {...svgProps}>
        <CiegaDef />
        <rect x="0" y="0" width="100" height="100" fill="url(#ciegaGrad)" />
        <path d="M0 0 L100 50 L0 100" stroke="#3b82f6" strokeWidth="2" strokeDasharray="6,4" vectorEffect={NSS} />
      </svg>
    )
  },
  {
    id: 'puerta_rebatir_2_izq',
    name: 'PT 2H (IZQ ACT)',
    icon: (
      <svg {...svgProps}>
        <GlassDef />
        <rect x="0" y="0" width="100" height="100" fill="url(#glassGrad)" />
        <line x1="50" y1="0" x2="50" y2="100" stroke="#1e293b" strokeWidth="2" vectorEffect={NSS} />
        <path d="M0 0 L50 50 L0 100" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4,2" vectorEffect={NSS} />
        <path d="M100 0 L50 50 L100 100" stroke="#3b82f6" strokeWidth="1" strokeDasharray="2,2" vectorEffect={NSS} />
      </svg>
    )
  },
  {
    id: 'puerta_rebatir_2_der',
    name: 'PT 2H (DER ACT)',
    icon: (
      <svg {...svgProps}>
        <GlassDef />
        <rect x="0" y="0" width="100" height="100" fill="url(#glassGrad)" />
        <line x1="50" y1="0" x2="50" y2="100" stroke="#1e293b" strokeWidth="2" vectorEffect={NSS} />
        <path d="M100 0 L50 50 L100 100" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4,2" vectorEffect={NSS} />
        <path d="M0 0 L50 50 L0 100" stroke="#3b82f6" strokeWidth="1" strokeDasharray="2,2" vectorEffect={NSS} />
      </svg>
    )
  },
  {
    id: 'puerta_rebatir_2_media_izq',
    name: 'PT 2H MEDIA (IZQ ACT)',
    icon: (
      <svg {...svgProps}>
        <GlassDef /> <CiegaDef />
        <rect x="0" y="0" width="100" height="50" fill="url(#glassGrad)" />
        <rect x="0" y="50" width="100" height="50" fill="url(#ciegaGrad)" />
        <line x1="50" y1="0" x2="50" y2="100" stroke="#1e293b" strokeWidth="2" vectorEffect={NSS} />
        <path d="M0 0 L50 50 L0 100" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4,2" vectorEffect={NSS} />
      </svg>
    )
  },
  {
    id: 'puerta_rebatir_2_media_der',
    name: 'PT 2H MEDIA (DER ACT)',
    icon: (
      <svg {...svgProps}>
        <GlassDef /> <CiegaDef />
        <rect x="0" y="0" width="100" height="50" fill="url(#glassGrad)" />
        <rect x="0" y="50" width="100" height="50" fill="url(#ciegaGrad)" />
        <line x1="50" y1="0" x2="50" y2="100" stroke="#1e293b" strokeWidth="2" vectorEffect={NSS} />
        <path d="M100 0 L50 50 L100 100" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4,2" vectorEffect={NSS} />
      </svg>
    )
  },
  {
    id: 'puerta_rebatir_2_ciega_izq',
    name: 'PT 2H CIEGA (IZQ ACT)',
    icon: (
      <svg {...svgProps}>
        <CiegaDef />
        <rect x="0" y="0" width="100" height="100" fill="url(#ciegaGrad)" />
        <line x1="50" y1="0" x2="50" y2="100" stroke="#fff" strokeWidth="2" vectorEffect={NSS} opacity="0.3" />
        <path d="M0 0 L50 50 L0 100" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4,2" vectorEffect={NSS} />
      </svg>
    )
  },
  {
    id: 'puerta_rebatir_2_ciega_der',
    name: 'PT 2H CIEGA (DER ACT)',
    icon: (
      <svg {...svgProps}>
        <CiegaDef />
        <rect x="0" y="0" width="100" height="100" fill="url(#ciegaGrad)" />
        <line x1="50" y1="0" x2="50" y2="100" stroke="#fff" strokeWidth="2" vectorEffect={NSS} opacity="0.3" />
        <path d="M100 0 L50 50 L100 100" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4,2" vectorEffect={NSS} />
      </svg>
    )
  },
  {
    id: 'ventiluz',
    name: 'VENTILUZ',
    icon: (
      <svg {...svgProps}>
        <GlassDef />
        <rect x="0" y="0" width="100" height="100" fill="url(#glassGrad)" />
        <path d="M0 0 L50 90 L100 0" stroke="#3b82f6" strokeWidth="2" strokeDasharray="6,4" vectorEffect={NSS} />
      </svg>
    )
  },
  {
    id: 'banderola',
    name: 'BANDEROLA',
    icon: (
      <svg {...svgProps}>
        <GlassDef />
        <rect x="0" y="0" width="100" height="100" fill="url(#glassGrad)" />
        <path d="M0 100 L50 10 L100 100" stroke="#3b82f6" strokeWidth="2" strokeDasharray="6,4" vectorEffect={NSS} />
      </svg>
    )
  },
  {
    id: 'espejo_redondo',
    name: 'ESPEJO REDONDO',
    icon: (
      <svg {...svgProps}>
        <MirrorDef />
        <circle cx="50" cy="50" r="45" fill="url(#mirrorGrad)" stroke="#94a3b8" strokeWidth="1" vectorEffect={NSS} />
      </svg>
    )
  },
  {
    id: 'espejo_recto',
    name: 'ESPEJO RECTO',
    icon: (
      <svg {...svgProps}>
        <MirrorDef />
        <rect x="5" y="5" width="90" height="90" fill="url(#mirrorGrad)" stroke="#94a3b8" strokeWidth="1" vectorEffect={NSS} />
      </svg>
    )
  },
  {
    id: 'mampara_fija',
    name: 'MAMPARA FIJA',
    icon: (
      <svg {...svgProps}>
        <GlassDef />
        <rect x="0" y="0" width="100" height="100" fill="url(#glassGrad)" opacity="0.6" />
        <line x1="5" y1="0" x2="5" y2="100" stroke="#475569" strokeWidth="3" vectorEffect={NSS} />
      </svg>
    )
  },
  {
    id: 'mampara_abrir_izq',
    name: 'MAMPARA ABRIR (IZQ)',
    icon: (
      <svg {...svgProps}>
        <GlassDef />
        <rect x="0" y="0" width="100" height="100" fill="url(#glassGrad)" opacity="0.6" />
        <path d="M100 0 L0 50 L100 100" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="6,4" vectorEffect={NSS} />
        <line x1="0" y1="0" x2="0" y2="100" stroke="#475569" strokeWidth="2" vectorEffect={NSS} />
      </svg>
    )
  },
  {
    id: 'mampara_abrir_der',
    name: 'MAMPARA ABRIR (DER)',
    icon: (
      <svg {...svgProps}>
        <GlassDef />
        <rect x="0" y="0" width="100" height="100" fill="url(#glassGrad)" opacity="0.6" />
        <path d="M0 0 L100 50 L0 100" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="6,4" vectorEffect={NSS} />
        <line x1="100" y1="0" x2="100" y2="100" stroke="#475569" strokeWidth="2" vectorEffect={NSS} />
      </svg>
    )
  },
  {
    id: 'mampara_corrediza',
    name: 'MAMPARA CORREDIZA',
    icon: (
      <svg {...svgProps}>
        <GlassDef />
        <rect x="0" y="0" width="100" height="100" fill="url(#glassGrad)" opacity="0.6" />
        <line x1="50" y1="0" x2="50" y2="100" stroke="#1e293b" strokeWidth="1" vectorEffect={NSS} />
        <path d="M20 50 L40 50 M35 45 L40 50 L35 55" stroke="#3b82f6" strokeWidth="2" vectorEffect={NSS} />
      </svg>
    )
  },
  {
    id: 'vidriera_fija',
    name: 'VIDRIERA FIJA',
    icon: (
      <svg {...svgProps}>
        <GlassDef />
        <rect x="0" y="0" width="100" height="100" fill="url(#glassGrad)" />
        <rect x="2" y="2" width="96" height="96" stroke="#1e293b" strokeWidth="1" vectorEffect={NSS} />
      </svg>
    )
  },
  {
    id: 'puerta_vidrio_zocalon_izq',
    name: 'PT VIDRIO ZOCALON (IZQ)',
    icon: (
      <svg {...svgProps}>
        <GlassDef />
        <rect x="0" y="0" width="100" height="100" fill="url(#glassGrad)" />
        <rect x="0" y="85" width="100" height="15" fill="#475569" />
        <path d="M100 0 L0 50 L100 85" stroke="#3b82f6" strokeWidth="2" strokeDasharray="6,4" vectorEffect={NSS} />
      </svg>
    )
  },
  {
    id: 'puerta_vidrio_zocalon_der',
    name: 'PT VIDRIO ZOCALON (DER)',
    icon: (
      <svg {...svgProps}>
        <GlassDef />
        <rect x="0" y="0" width="100" height="100" fill="url(#glassGrad)" />
        <rect x="0" y="85" width="100" height="15" fill="#475569" />
        <path d="M0 0 L100 50 L0 85" stroke="#3b82f6" strokeWidth="2" strokeDasharray="6,4" vectorEffect={NSS} />
      </svg>
    )
  }
];

export const COLORS = {
  primary: '#0078D4',
  secondary: '#1e293b',
  accent: '#3b82f6',
  danger: '#ef4444',
  success: '#10b981',
};
