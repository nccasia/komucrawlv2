function setTime(date, hours, minute, second, msValue) {
  return date.setHours(hours, minute, second, msValue);
}

export function checkTime(date: any) {
  const currentDate = new Date();
  if (date.getDay() === 6 || date.getDay() === 0) {
    return false;
  }
  const timezone = date.getTimezoneOffset() / -60;
  const firstTimeMorning = new Date(
    setTime(currentDate, 1 + timezone, 30, 0, 0)
  ).getTime();
  const lastTimeMorning = new Date(
    setTime(currentDate, 4 + timezone, 59, 59, 59)
  ).getTime();
  const firstTimeAfternoon = new Date(
    setTime(currentDate, 6 + timezone, 0, 0, 0)
  ).getTime();
  const lastTimeAfternoon = new Date(
    setTime(currentDate, 10 + timezone, 29, 59, 59)
  ).getTime();

  if (
    (date.getTime() >= firstTimeMorning && date.getTime() <= lastTimeMorning) ||
    (date.getTime() >= firstTimeAfternoon &&
      date.getTime() <= lastTimeAfternoon)
  ) {
    return true;
  }

  return false;
}
