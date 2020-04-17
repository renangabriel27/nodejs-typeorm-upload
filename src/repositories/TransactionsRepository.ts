import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface All {
  transactions: Transaction[];
  balance: Balance;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async all(): Promise<All> {
    const transactions = await this.find();
    const balance = await this.getBalance();

    return { transactions, balance };
  }

  public async getOutcomeTotal(): Promise<number> {
    const outcome = await this.getTotalByType('outcome');

    return outcome;
  }

  public async getIncomeTotal(): Promise<number> {
    const income = await this.getTotalByType('income');

    return income;
  }

  public async getTotal(): Promise<number> {
    const income = await this.getIncomeTotal();
    const outcome = await this.getOutcomeTotal();

    const total = income - outcome;

    return total;
  }

  public async getBalance(): Promise<Balance> {
    const income = await this.getIncomeTotal();
    const outcome = await this.getOutcomeTotal();
    const total = await this.getTotal();

    return { income, outcome, total };
  }

  private async getTotalByType(type: string): Promise<number> {
    const transactionByType = await this.find({ where: { type } });

    const total = transactionByType.reduce((sum, transaction) => {
      return sum + transaction.value;
    }, 0);

    return total;
  }
}

export default TransactionsRepository;
