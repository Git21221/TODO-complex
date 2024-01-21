class apiError extends Error{
  constructor(code, message){
    super(message);
    this.statusCode = code;
    this.message = message;
  }
}

export {apiError};