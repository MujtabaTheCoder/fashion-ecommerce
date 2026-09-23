export class NotImplementedError extends Error {
  constructor(feature: string) {
    super(`${feature} is not implemented in the foundation phase.`);
    this.name = "NotImplementedError";
  }
}
