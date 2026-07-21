import React, { useMemo } from 'react';

/**
 * DeveloperRadar
 * --------------
 * SVG radar / spider chart showing relative developer strength across
 * GitHub, LeetCode, and Codeforces dimensions.
 * No external chart library — pure SVG math.
 */

const DIMENSIONS = [
  { key: 'commits',        label: 'Commits',       platform: 'github',      max: 1000 },
  { key: 'stars',          label: 'Stars',          platform: 'github',      max: 200  },
  { key: 'lc_solved',      label: 'LC Problems',    platform: 'leetcode',    max: 500  },
  { key: 'lc_rating',      label: 'LC Rating',      platform: 'leetcode',    max: 3000 },
  { key: 'cf_rating',      label: 'CF Rating',      platform: 'codeforces',  max: 3000 },
  { key: 'active_days',    label: 'Active Days',    platform: 'all',         max: 365  },
];

const PLATFORM_COLOR = {
  github:     '#22c55e',
  leetcode:   '#eab308',
  codeforces: '#3b82f6',
  all:        '#a78bfa',
};

function polarToCart(angle, r, cx, cy) {
  const rad = (angle - 90) * (Math.PI / 180);
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

export default function DeveloperRadar({ githubProfile, leetcodeProfile, codeforcesProfile, totalActiveDays }) {
  const size = 260;
  const cx = size / 2;
  const cy = size / 2;
  const R  = size * 0.38;

  const values = useMemo(() => ({
    commits:     Math.min((githubProfile?.total_commits   || 0), DIMENSIONS[0].max),
    stars:       Math.min((githubProfile?.total_stars     || 0), DIMENSIONS[1].max),
    lc_solved:   Math.min((leetcodeProfile?.total_solved  || 0), DIMENSIONS[2].max),
    lc_rating:   Math.min((leetcodeProfile?.contest_rating || 0), DIMENSIONS[3].max),
    cf_rating:   Math.min((codeforcesProfile?.current_rating || 0), DIMENSIONS[4].max),
    active_days: Math.min((totalActiveDays                || 0), DIMENSIONS[5].max),
  }), [githubProfile, leetcodeProfile, codeforcesProfile, totalActiveDays]);

  const n = DIMENSIONS.length;
  const angleStep = 360 / n;

  // Points for the data polygon
  const dataPoints = DIMENSIONS.map((d, i) => {
    const ratio = values[d.key] / d.max;
    const { x, y } = polarToCart(i * angleStep, ratio * R, cx, cy);
    return { x, y };
  });
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') + ' Z';

  // Grid rings
  const rings = [0.25, 0.5, 0.75, 1.0];

  // Axis endpoints
  const axisPoints = DIMENSIONS.map((_, i) => polarToCart(i * angleStep, R, cx, cy));

  return (
    <div className="card radar-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span className="card-label">SKILL RADAR</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <svg width={size} height={size} style={{ overflow: 'visible' }}>
          {/* Grid rings */}
          {rings.map((r, ri) => {
            const ringPts = DIMENSIONS.map((_, i) => {
              const { x, y } = polarToCart(i * angleStep, r * R, cx, cy);
              return `${x.toFixed(1)},${y.toFixed(1)}`;
            }).join(' ');
            return (
              <polygon
                key={ri}
                points={ringPts}
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
              />
            );
          })}

          {/* Axes */}
          {axisPoints.map((pt, i) => (
            <line
              key={i}
              x1={cx} y1={cy}
              x2={pt.x.toFixed(1)} y2={pt.y.toFixed(1)}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
            />
          ))}

          {/* Data polygon */}
          <path
            d={dataPath}
            fill="rgba(167,139,250,0.18)"
            stroke="#a78bfa"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Data dots */}
          {dataPoints.map((pt, i) => (
            <circle
              key={i}
              cx={pt.x.toFixed(1)}
              cy={pt.y.toFixed(1)}
              r="3.5"
              fill={PLATFORM_COLOR[DIMENSIONS[i].platform]}
              stroke="var(--bg-surface)"
              strokeWidth="1.5"
            />
          ))}

          {/* Labels */}
          {axisPoints.map((pt, i) => {
            const dim = DIMENSIONS[i];
            const labelR = R + 20;
            const { x, y } = polarToCart(i * angleStep, labelR, cx, cy);
            return (
              <text
                key={i}
                x={x.toFixed(1)}
                y={y.toFixed(1)}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="9.5"
                fill={PLATFORM_COLOR[dim.platform]}
                style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}
              >
                {dim.label}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
