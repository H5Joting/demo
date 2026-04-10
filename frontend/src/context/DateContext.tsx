import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { fetchAvailableDates } from '@/api';

interface DateContextType {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  availableDates: { report_date: string; system_status: string }[];
  loading: boolean;
  businessSystemId: string | null;
  dbError: boolean;
  loadAvailableDates: () => Promise<void>;
}

const DateContext = createContext<DateContextType | undefined>(undefined);

const DEFAULT_BUSINESS_SYSTEM_ID = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

const getYesterday = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
};

export const DateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState<string>(getYesterday);
  const [availableDates, setAvailableDates] = useState<{ report_date: string; system_status: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [businessSystemId] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('businessSystemId') || DEFAULT_BUSINESS_SYSTEM_ID;
  });
  const [dbError, setDbError] = useState(false);

  const hasLoadedDatesRef = useRef(false);

  const loadAvailableDates = useCallback(async () => {
    if (hasLoadedDatesRef.current) return;
    
    try {
      setLoading(true);
      setDbError(false);
      const dates = await fetchAvailableDates(businessSystemId || undefined);
      setAvailableDates(dates);
      const yesterday = getYesterday();
      const hasYesterday = dates.some(d => d.report_date === yesterday);
      if (hasYesterday) {
        setSelectedDate(yesterday);
      } else if (dates.length > 0) {
        setSelectedDate(dates[0].report_date);
      }
      hasLoadedDatesRef.current = true;
    } catch (error: any) {
      console.error('Failed to load available dates:', error);
      if (error?.response?.data?.code === 'DATABASE_ERROR') {
        setDbError(true);
      }
    } finally {
      setLoading(false);
    }
  }, [businessSystemId]);

  useEffect(() => {
    const path = window.location.pathname;
    const shouldLoadDates = path.includes('/dashboard') || path.includes('/overview/');
    
    if (shouldLoadDates) {
      loadAvailableDates();
    }
  }, [loadAvailableDates]);

  return (
    <DateContext.Provider value={{ 
      selectedDate, 
      setSelectedDate, 
      availableDates, 
      loading,
      businessSystemId,
      dbError,
      loadAvailableDates
    }}>
      {children}
    </DateContext.Provider>
  );
};

export const useDate = () => {
  const context = useContext(DateContext);
  if (!context) {
    throw new Error('useDate must be used within a DateProvider');
  }
  return context;
};
