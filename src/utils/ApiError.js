class ApiError extends Error {
    constructor(message = "Default from ApiError : Something went wrong", statusCode, error = [], stack = "") {
        super(message)
        this.statusCode = statusCode;
        this.success = false;
        this.message = message;
        this.errors = error; // array of errors
        this.data = null;
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);  // To
        }
    }
}