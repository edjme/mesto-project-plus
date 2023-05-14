export default class BadRequest extends Error {
  private statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 400;
  }
}
