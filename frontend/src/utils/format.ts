export const formatValue = (value: unknown): string => {
  if (value === null || value === undefined || value === '') {
    return '-';
  }
  if (typeof value === 'number' && isNaN(value)) {
    return '-';
  }
  return String(value);
};

export const formatNumber = (value: unknown): string => {
  if (value === null || value === undefined) {
    return '-';
  }
  if (typeof value === 'number') {
    if (isNaN(value)) {
      return '-';
    }
    return value.toLocaleString();
  }
  const num = Number(value);
  if (isNaN(num)) {
    return '-';
  }
  return num.toLocaleString();
};

export const formatPercent = (value: unknown): string => {
  if (value === null || value === undefined) {
    return '-';
  }
  if (typeof value === 'number') {
    if (isNaN(value)) {
      return '-';
    }
    return `${value.toFixed(1)}%`;
  }
  const num = Number(value);
  if (isNaN(num)) {
    return '-';
  }
  return `${num.toFixed(1)}%`;
};
