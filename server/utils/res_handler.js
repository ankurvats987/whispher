class APIResponse {
  constructor({ success = true, status = 200, message = "", data = null }) {
    this.success = success;
    this.status = status;
    this.message = message;
    this.data = data;
  }

  send(res) {
    return res.status(this.status).json({
      success: this.success,
      message: this.message,
      data: this.data,
    });
  }

  static success(message = "Success", data = null, status = 200) {
    return new APIResponse({ success: true, message, data, status });
  }

  static error(message = "Something went wrong", data = null, status = 500) {
    return new APIResponse({ success: false, message, data, status });
  }
}

export { APIResponse };
