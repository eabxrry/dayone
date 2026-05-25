export function getBacDateForYear(year, config) {
  return new Date(
    year,
    config.monthIndex,
    config.day,
    config.hour,
    config.minute,
    config.second,
  );
}

export function getNextBacDate(now, config) {
  const currentYearBac = getBacDateForYear(now.getFullYear(), config);
  if (now > currentYearBac) {
    return getBacDateForYear(now.getFullYear() + 1, config);
  }
  return currentYearBac;
}

export function getTimeLeft(targetDate, currentTimeMs = Date.now()) {
  const diff = targetDate.getTime() - currentTimeMs;
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function getCountdownStatus(targetDate, currentTimeMs = Date.now()) {
  const diff = targetDate.getTime() - currentTimeMs;
  const bacDurationMs = 6 * 60 * 60 * 1000;
  if (diff < -bacDurationMs) return 'termine';
  if (diff <= 0) return 'en_cours';
  return 'avant';
}
