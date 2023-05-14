export default class Unauthorized extends Error {
  private statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 401;
  }
}
