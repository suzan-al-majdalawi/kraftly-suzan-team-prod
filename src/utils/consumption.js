export function peakMonth(months, values) {
  if (!values || values.length === 0) {
    return null;
  }

  const maxValue = Math.max(...values);
  const index = values.indexOf(maxValue);

  return {
    month: months[index],
    value: maxValue,
  };
}

export function yearlyTotal(values) {
  if (!values || values.length === 0) {
    return 0;
  }

  return values.reduce((total, value) => total + value, 0);
}

export function vsAverage(values) {
  if (!values || values.length === 0) {
    return 0;
  }

  const average = yearlyTotal(values) / values.length;
  const latest = values[values.length - 1];

  return ((latest - average) / average) * 100;
}
