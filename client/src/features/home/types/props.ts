export interface SummaryCardsProps {
  currentMonth: Date;
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface CalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  dailyTransactions: {
    date: string;
    income: number;
    expense: number;
  }[];
  onMonthChange: (date: Date) => void;
}

export interface DetailPanelProps {
  selectedDate: Date | null;
  dailyTotal: {
    income: number;
    expense: number;
    balance: number;
  };
  transactions: {
    id: number;
    type: '収入' | '支出';
    category: string;
    amount: number;
    paymentMethod?: string;
    description?: string;
  }[];
  onTransactionAdd: () => void;
}