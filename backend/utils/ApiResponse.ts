export class ApiRes<T> {
  public statusCode: number
  public message: string
  public success: boolean
  public data: T
  constructor(statusCode: number = 200, message: string = "success", data: T) {
    this.statusCode = statusCode,
      this.message = message,
      this.data = data,
      this.success = true
  }
}
