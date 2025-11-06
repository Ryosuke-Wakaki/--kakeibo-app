export interface SummaryCardsProps {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface CalendarProps {
  onMonthChange: (month: string) => void;
  onDateClick: (date: string) => void;
  dailySummaries: Record<string, { income: number; expense: number }>;
}

export interface DetailPanelProps {
  selectedDate: string;
  dailyTotal: {
    income: number;
    expense: number;
    balance: number;
  };
  transactions: {
    id: number;
    type: '収入' | '支出';
    categoryCode: string;
    category: string;
    amount: number;
    paymentMethod?: string;
    description?: string;
  }[];
  onTransactionAdd: () => void;
}