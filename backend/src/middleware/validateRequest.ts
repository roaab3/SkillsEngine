import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../utils/errors';
import Joi from 'joi';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));
      throw new ValidationError('Validation failed', details);
    }

    req.body = value;
    next();
  };
};

