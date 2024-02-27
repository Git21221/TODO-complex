class apiError extends Error{
  constructor(code, message){
    super();
    this.statusCode = code;
    this.message = message;
    this.name = this.constructor.name;
  }
}

export {apiError};