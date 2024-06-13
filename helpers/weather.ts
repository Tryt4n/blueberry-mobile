export function findExtremeValue(valuesList: Record<string, string>, find: "min" | "max") {
  const extremeValue =
    find === "max"
      ? Math.max(...Object.values(valuesList).map(Number))
      : Math.min(...Object.values(valuesList).map(Number));

  const extremeValueTime = Object.entries(valuesList).find(
    ([key, value]) => Number(value) === extremeValue
  )?.[0];

  return { extremeValue, extremeValueTime };
}
