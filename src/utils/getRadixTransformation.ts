export const getRadixTransformation = (char: string, interval: number) => parseInt(char, 36) % interval;
