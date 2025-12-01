const nonEmptyStringValue = (val?: string | null | undefined) =>
  val && val.length > 0 ? val : null;

export { nonEmptyStringValue };
