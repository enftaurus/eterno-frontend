import React, { useMemo } from 'react';

/**
 * UnifiedHeatmap
 * --------------
 * Renders a full-year contribution heatmap where each cell is proportionally
 * split by platform color:
 *   GitHub   → green  (#22c55e)
 *   LeetCode → yellow (#eab308)
 *   Codeforces → blue (#3b82f6)
 *
 * Props:
 *   data  — { "YYYY-MM-DD": { github: N, leetcode: N, codeforces: N } }
 */

const PLATFORM_COLORS = {
  github: '#22c55e',
  leetcode: '#eab308',
  codeforces: '#3b82f6',
};

const PLATFORM_LABELS = {
  github: 'GitHub',
  leetcode: 'LeetCode',
  codeforces: 'Codeforces',
};

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function buildWeeks(data) {
  // Build a 53-week grid ending today
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 364); // ~1 year back
  // Align to Sunday
  startDate.setDate(startDate.getDate() - startDate.getDay());

  const weeks = [];
  let current = new Date(startDate);

  while (current <= today) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const iso = current.toISOString().slice(0, 10);
      week.push({ date: iso, dayData: data[iso] || null });
      current.setDate(current.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

function getIntensityAlpha(total) {
  if (total === 0) return 0;
  if (total <= 2)  return 0.3;
  if (total <= 5)  return 0.55;
  if (total <= 10) return 0.75;
  return 1;
}

function CellTooltip({ date, dayData }) {
  if (!dayData) return null;
  const d = new Date(date + 'T00:00:00');
  const label = d.toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' });
  const total = Object.values(dayData).reduce((a, b) => a + b, 0);
  return (
    <div className="heatmap-tooltip">
      <div className="heatmap-tooltip-date">{label}</div>
      {Object.entries(dayData).map(([p, c]) => (
        <div key={p} className="heatmap-tooltip-row">
          <span className="heatmap-tooltip-dot" style={{ background: PLATFORM_COLORS[p] }} />
          <span>{PLATFORM_LABELS[p]}: <strong>{c}</strong></span>
        </div>
      ))}
      <div className="heatmap-tooltip-total">Total: <strong>{total}</strong></div>
    </div>
  );
}

function HeatCell({ cell }) {
  const { date, dayData } = cell;
  const [hovered, setHovered] = React.useState(false);

  if (!dayData) {
    return (
      <div
        className="heatmap-cell heatmap-cell-empty"
        data-date={date}
      />
    );
  }

  const platforms = Object.entries(dayData).filter(([, c]) => c > 0);
  const total = platforms.reduce((a, [, c]) => a + c, 0);
  const alpha = getIntensityAlpha(total);

  // Build proportional gradient
  let gradient;
  if (platforms.length === 1) {
    const [p] = platforms[0];
    gradient = PLATFORM_COLORS[p];
  } else {
    let pct = 0;
    const stops = [];
    platforms.forEach(([p, c]) => {
      const share = (c / total) * 100;
      stops.push(`${PLATFORM_COLORS[p]} ${pct.toFixed(1)}% ${(pct + share).toFixed(1)}%`);
      pct += share;
    });
    gradient = `conic-gradient(from 0deg, ${stops.join(', ')})`;
  }

  return (
    <div
      className="heatmap-cell heatmap-cell-active"
      data-date={date}
      style={{
        background: platforms.length === 1 ? gradient : undefined,
        backgroundImage: platforms.length > 1 ? gradient : undefined,
        opacity: alpha,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered && <CellTooltip date={date} dayData={dayData} />}
    </div>
  );
}

export default function UnifiedHeatmap({ data = {} }) {
  const weeks = useMemo(() => buildWeeks(data), [data]);

  // Month labels
  const monthLabels = useMemo(() => {
    const labels = [];
    let lastMonth = -1;
    weeks.forEach((week, wi) => {
      const month = new Date(week[0].date + 'T00:00:00').getMonth();
      if (month !== lastMonth) {
        labels.push({ month, weekIndex: wi });
        lastMonth = month;
      }
    });
    return labels;
  }, [weeks]);

  const totalActivity = useMemo(() => {
    return Object.values(data).reduce((sum, dayData) => {
      return sum + Object.values(dayData).reduce((a, b) => a + b, 0);
    }, 0);
  }, [data]);

  return (
    <div className="heatmap-wrapper">
      {/* Legend */}
      <div className="heatmap-header">
        <span className="heatmap-title">
          Activity Heatmap — <strong>{totalActivity.toLocaleString()}</strong> total contributions
        </span>
        <div className="heatmap-legend">
          {Object.entries(PLATFORM_COLORS).map(([p, color]) => (
            <span key={p} className="heatmap-legend-item">
              <span className="heatmap-legend-dot" style={{ background: color }} />
              {PLATFORM_LABELS[p]}
            </span>
          ))}
        </div>
      </div>

      <div className="heatmap-scroll-area">
        {/* Day-of-week labels */}
        <div className="heatmap-day-labels">
          {DAYS.map((d, i) => (
            <div key={d} className="heatmap-day-label">{i % 2 === 1 ? d : ''}</div>
          ))}
        </div>

        <div className="heatmap-grid-area">
          {/* Month labels */}
          <div className="heatmap-month-row">
            {weeks.map((_, wi) => {
              const lbl = monthLabels.find(m => m.weekIndex === wi);
              return (
                <div key={wi} className="heatmap-month-cell">
                  {lbl ? MONTHS[lbl.month] : ''}
                </div>
              );
            })}
          </div>

          {/* Cell grid */}
          <div className="heatmap-grid">
            {weeks.map((week, wi) => (
              <div key={wi} className="heatmap-week">
                {week.map((cell) => (
                  <HeatCell key={cell.date} cell={cell} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
