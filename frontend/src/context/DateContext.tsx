import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchAvailableDates } from '@/api';

interface DateContextType {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  availableDates: { report_date: string; system_status: string }[];
  loading: boolean;
}

const DateContext = createContext<DateContextType | undefined>(undefined);

const getYesterdayDate = (): string => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
};

export const DateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState<string>(getYesterdayDate());
  const [availableDates, setAvailableDates] = useState<{ report_date: string; system_status: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDates = async () => {
      try {
        const dates = await fetchAvailableDates();
        setAvailableDates(dates);
        if (dates.length > 0) {
          setSelectedDate(dates[0].report_date);
        }
      } catch (error) {
        console.error('Failed to load available dates:', error);
      } finally {
        setLoading(false);
      }
    };
    loadDates();
  }, []);

  return (
    <DateContext.Provider value={{ selectedDate, setSelectedDate, availableDates, loading }}>
      {children}
    </DateContext.Provider>
  );
};

export const useDate = (): DateContextType => {
  const context = useContext(DateContext);
  if (!context) {
    throw new Error('useDate must be used within a DateProvider');
  }
  return context;
};
