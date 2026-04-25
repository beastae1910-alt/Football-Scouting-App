export const AGE_FILTERS = ['All', 'Under 16', 'Under 18', 'Under 21'];

const AGE_LIMITS = {
  'Under 16': 16,
  'Under 18': 18,
  'Under 21': 21,
};

export const matchesAgeFilter = (age, filterAge) => {
  if (filterAge === 'All') return true;

  const numericAge = Number(age);
  const limit = AGE_LIMITS[filterAge];

  return Number.isFinite(numericAge) && limit !== undefined && numericAge <= limit;
};
