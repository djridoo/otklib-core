export class NotFoundException extends Error {
  public errors: any[] = []

  constructor(message: string = '', errors: any[] = []) {
    super(message)
    this.errors = errors
  }
}
