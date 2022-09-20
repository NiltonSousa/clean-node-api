export class InvalidParamError extends Error {
  constructor(paramName: string) {
    super(`Invalid ${paramName} param`);
    this.name = "InvalidParamError";
  }
}
