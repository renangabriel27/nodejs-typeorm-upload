import { Request, Response, NextFunction } from 'express';
import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

export default async function ensureOutcomeIsValid(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  const { type, value } = request.body;

  const transactionsRepository = getCustomRepository(TransactionsRepository);

  const total = await transactionsRepository.getTotal();

  const outcomeIsInvalid = type === 'outcome' && value > total;

  if (outcomeIsInvalid) {
    throw new AppError('The outcome cannot be greater than total');
  }

  return next();
}
