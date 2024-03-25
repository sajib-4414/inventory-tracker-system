import { NextFunction, Request, Response } from "express";
import { ValidationError, validationResult } from "express-validator";


//global error handler
export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (err instanceof CustomError) {
      return res.status(err.statusCode).send({ errors: err.serializeErrors() });
    }
    console.error(err);
    res.status(400).send({
      errors: [{ message: 'Something went wrong' }]
    });
};

//to format the error in a standard format of error and message
export abstract class CustomError extends Error {
    abstract statusCode: number;
  
    constructor(message: string) {
      super(message);
  
      Object.setPrototypeOf(this, CustomError.prototype);
    }
  
    abstract serializeErrors(): { message: string; field?: string }[];
}

// a generic bad request 400 error for easy error handling
export class BadRequestError extends CustomError {
    statusCode = 400;
  
    constructor(public message: string) {
      super(message);
  
      Object.setPrototypeOf(this, BadRequestError.prototype);
    }
  
    serializeErrors() {
      return [{ message: this.message }];
    }
}

// a generic bad request 404 error for easy error handling
export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor(public message: string='Route not found') {
    super(message);

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}

// to show express validator errors in a neat format
export class RequestValidationError extends CustomError {
  statusCode = 400;

  constructor(public errors: ValidationError[]) {
    super('Invalid request parameters');

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map((err) => {
      if (err.type === 'field') {
        return { message: err.msg, field: err.path };
      }
      return { message: err.msg };
    });
  }
}

// to execture the express validators
export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }

  next();
};


// a generic bad request 401 error for easy error handling
export class NotAuthorizedError extends CustomError {
  statusCode = 401;

  constructor() {
    super('Not Authorized');

    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors() {
    return [{ message: 'Not authorized' }];
  }
}

// a generic bad request 401 error for easy error handling
export class NotPermittedError extends CustomError {
  statusCode = 403;

  constructor() {
    super('You do not have permission to this route');

    Object.setPrototypeOf(this, NotPermittedError.prototype);
  }

  serializeErrors() {
    return [{ message: 'Do not have permission to this route' }];
  }
}

// a generic bad request 500 error for undefined errors
export class UnhandledError extends CustomError {
  statusCode = 500;

  constructor() {
    super('Unknown error occurred');

    Object.setPrototypeOf(this, UnhandledError.prototype);
  }

  serializeErrors() {
    return [{ message: "Unknown Error Occurred" }];
  }
}