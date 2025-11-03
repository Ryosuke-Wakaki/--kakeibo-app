import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Category, PaymentMethod } from '../types/models';
import { MasterDataApi } from '../api/MasterDataApi';

interface MasterDataContextType {
  categories: Category[];
  paymentMethods: PaymentMethod[];
  isLoading: boolean;
  error: Error | null;
}

const MasterDataContext = createContext<MasterDataContextType | undefined>(undefined);

interface MasterDataProviderProps {
  children: ReactNode;
}

export const MasterDataProvider = ({ children }: MasterDataProviderProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        setIsLoading(true);
        const [categoriesData, paymentMethodsData] = await Promise.all([
          MasterDataApi.getCategories(),
          MasterDataApi.getPaymentMethods()
        ]);
        
        setCategories(categoriesData);
        setPaymentMethods(paymentMethodsData);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch master data:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchMasterData();
  }, []);

  return (
    <MasterDataContext.Provider value={{ categories, paymentMethods, isLoading, error }}>
      {children}
    </MasterDataContext.Provider>
  );
};

export const useMasterData = () => {
  const context = useContext(MasterDataContext);
  if (context === undefined) {
    throw new Error('useMasterData must be used within a MasterDataProvider');
  }
  return context;
};
