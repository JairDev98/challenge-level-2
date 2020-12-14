import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

interface Todo {
  transactions: Array<Transaction>;
  balance: Balance;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Todo {
    const income = this.transactions
      .filter(transaction => transaction.type === 'income')
      .map(transactionIncome => transactionIncome.value)
      .reduce((total, value) => total + value, 0);

    const outcome = this.transactions
      .filter(transaction => transaction.type === 'outcome')
      .map(transactionOutcome => transactionOutcome.value)
      .reduce((total, value) => total + value, 0);

    const total = income + outcome;

    const balance = { income, outcome, total };
    const { transactions } = this;

    const nTodo: Todo = { transactions, balance };
    return nTodo;
  }

  public getIncome(
    value: number,
    type: string,
  ): Omit<Balance, 'outcome' | 'total'> | boolean {
    const income = this.transactions
      .filter(transaction => transaction.type === 'income')
      .map(transactionIncome => transactionIncome.value)
      .reduce((total, ivalue) => total + ivalue, 0);

    if (value > income && type === 'outcome') {
      return false;
    }
    const nBalance = { income };
    return nBalance;
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });
    this.transactions.push(transaction);
    return transaction;
  }
}

export default TransactionsRepository;
