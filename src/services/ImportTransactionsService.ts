import path from 'path';
import fs from 'fs';
import csv from 'csvtojson';
import uploadConfig from '../config/upload';
import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

interface TransactionCSV {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}
class ImportTransactionsService {
  async execute(filename: string): Promise<any> {
    const csvFilePath = path.join(uploadConfig.directory, filename);
    const createService = new CreateTransactionService();

    const csvTransactions = await csv({ checkType: true }).fromFile(
      csvFilePath,
    );

    csvTransactions.map(async item => {
      const { title, type, value, category } = item;
      await createService.execute({
        title,
        type,
        value,
        categoryTitle: category,
      });
    });

    const csvFileExists = await fs.promises.stat(csvFilePath);

    if (csvFileExists) {
      await fs.promises.unlink(csvFilePath);
    }

    return csvTransactions;
  }
}

export default ImportTransactionsService;
