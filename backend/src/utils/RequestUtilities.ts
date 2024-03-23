import { NextFunction, Request, Response } from "express";
import { ValidationError, validationResult } from "express-validator";


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

export abstract class CustomError extends Error {
    abstract statusCode: number;
  
    constructor(message: string) {
      super(message);
  
      Object.setPrototypeOf(this, CustomError.prototype);
    }
  
    abstract serializeErrors(): { message: string; field?: string }[];
}

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