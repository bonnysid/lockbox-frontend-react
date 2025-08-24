export const isValueInEnum = <T extends string>(value: string, enumValues: string[]): value is T => {
  return enumValues.includes(value);
};
