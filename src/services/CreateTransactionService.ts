import { getRepository, getCustomRepository } from 'typeorm';

import CategoriesRepository from '../repositories/CategoriesRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  categoryTitle: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    categoryTitle,
  }: Request): Promise<Transaction> {
    const categoriesRepository = getCustomRepository(CategoriesRepository);
    const category = await categoriesRepository.findOrCreate(categoryTitle);

    const transactionsRepository = getRepository(Transaction);
    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: category.id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
