import path from 'path';
import fs from 'fs';
import csv from 'csvtojson';
import uploadConfig from '../config/upload';
import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

class ImportTransactionsService {
  async execute(filename: string): Promise<Transaction[]> {
    const csvFilePath = path.join(uploadConfig.directory, filename);
    const createService = new CreateTransactionService();

    const csvTransactions = await csv().fromFile(csvFilePath);

    for (let index = 0; index < csvTransactions.length; index++) {
      const { title, type, value, category } = csvTransactions[index];
      await createService.execute({
        title,
        type,
        value,
        categoryTitle: category,
      });
    }

    const csvFileExists = await fs.promises.stat(csvFilePath);

    if (csvFileExists) {
      await fs.promises.unlink(csvFilePath);
    }

    return csvTransactions;
  }
}

export default ImportTransactionsService;
