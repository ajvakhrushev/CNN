export function getRandomTill(value: number) {
  return Math.floor(Math.random() * value);
}

export function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
