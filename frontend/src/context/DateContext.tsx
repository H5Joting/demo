import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchAvailableDates, fetchBusinessSystem } from '@/api';
import { BusinessSystem } from '@/types';

interface DateContextType {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  availableDates: { report_date: string; system_status: string }[];
  loading: boolean;
  businessSystemId: string | null;
  businessSystem: BusinessSystem | null;
  dbError: boolean;
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
  const [loading, setLoading] = useState(true);
  const [businessSystemId, setBusinessSystemId] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('businessSystemId') || DEFAULT_BUSINESS_SYSTEM_ID;
  });
  const [businessSystem, setBusinessSystem] = useState<BusinessSystem | null>(null);
  const [dbError, setDbError] = useState(false);

  useEffect(() => {
    const loadDates = async () => {
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
      } catch (error: any) {
        console.error('Failed to load available dates:', error);
        if (error?.response?.data?.code === 'DATABASE_ERROR') {
          setDbError(true);
        }
      } finally {
        setLoading(false);
      }
    };
    loadDates();
  }, [businessSystemId]);

  useEffect(() => {
    const loadBusinessSystem = async () => {
      if (businessSystemId) {
        try {
          const system = await fetchBusinessSystem(businessSystemId);
          setBusinessSystem(system);
        } catch (error) {
          console.error('Failed to load business system:', error);
        }
      }
    };
    loadBusinessSystem();
  }, [businessSystemId]);

  return (
    <DateContext.Provider value={{ 
      selectedDate, 
      setSelectedDate, 
      availableDates, 
      loading,
      businessSystemId,
      businessSystem,
      dbError
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
