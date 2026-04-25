// generateReport.js
// Generates a scouting report based on player position, age, and stats.
// Strengths: stat > 80 | Weaknesses: stat < 65

const STAT_LABELS = {
  pace:       'pace',
  shooting:   'shooting',
  passing:    'passing',
  dribbling:  'dribbling',
  defending:  'defending',
  physical:   'physicality',
};

const STRENGTH_PHRASES = {
  pace:       'exceptional pace to beat defenders in behind',
  shooting:   'clinical finishing and strong shooting ability',
  passing:    'excellent passing range and vision in tight spaces',
  dribbling:  'outstanding dribbling and close control under pressure',
  defending:  'dominant defensive instincts and strong in the tackle',
  physical:   'impressive physical presence and strength in duels',
};

const WEAKNESS_PHRASES = {
  pace:       'limited pace which restricts effective pressing',
  shooting:   'poor finishing - needs significant work in front of goal',
  passing:    'below-par passing accuracy - struggles to retain possession',
  dribbling:  'weak dribbling - often dispossessed in tight areas',
  defending:  'poor defensive positioning and weak in the challenge',
  physical:   'lack of physicality - can be bullied off the ball',
};

const REQUIRED_STATS = Object.keys(STAT_LABELS);

const normalizeStats = (stats) => {
  if (!stats || typeof stats !== 'object') return null;

  const missing = REQUIRED_STATS.filter((key) => stats[key] === undefined || stats[key] === null || stats[key] === '');
  if (missing.length > 0) return { missing };

  const values = {};
  for (const key of REQUIRED_STATS) {
    const value = Number(stats[key]);
    if (!Number.isFinite(value)) return { invalid: key };
    values[key] = Math.min(100, Math.max(0, value));
  }

  return { values };
};

export const generateReport = (player) => {
  const { position, age, stats } = player;
  const normalized = normalizeStats(stats);

  if (!normalized) {
    return `A ${age}-year-old ${position} with no recorded stats yet. More data needed for a detailed scouting report.`;
  }

  if (normalized.missing) {
    const missingLabels = normalized.missing.map((key) => STAT_LABELS[key]).join(', ');
    return `A ${age}-year-old ${position} with incomplete stats. Missing ${missingLabels}; more data is needed for a detailed scouting report.`;
  }

  if (normalized.invalid) {
    return `A ${age}-year-old ${position} has invalid ${STAT_LABELS[normalized.invalid]} data. More reliable stats are needed for a detailed scouting report.`;
  }

  const strengths = Object.entries(normalized.values)
    .filter(([, val]) => val > 80)
    .map(([key]) => STRENGTH_PHRASES[key])
    .filter(Boolean);

  const weaknesses = Object.entries(normalized.values)
    .filter(([, val]) => val < 65)
    .map(([key]) => WEAKNESS_PHRASES[key])
    .filter(Boolean);

  let report = `This ${age}-year-old ${position}`;

  if (strengths.length > 0) {
    report += ` stands out for ${strengths.slice(0, 2).join(' and ')}.`;
  } else {
    report += ` shows average attributes across the board.`;
  }

  if (weaknesses.length > 0) {
    report += ` However, there are clear areas to address: ${weaknesses.slice(0, 2).join(' and ')}.`;
  }

  if (strengths.length === 0 && weaknesses.length === 0) {
    report += ` All stats fall within a mid-range band - consistent but not outstanding in any single area.`;
  }

  return report;
};
