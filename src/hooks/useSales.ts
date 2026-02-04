'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'fast-sales-counter-data';
const HISTORY_STORAGE_KEY = 'fast-sales-counter-history';

export interface SalesData {
  [productId: number]: number;
}

interface UseSalesReturn {
  sales: SalesData;
  addSale: (productId: number) => void;
  undoLastSale: () => number | null; // Returns the product ID that was undone, or null
  resetSales: () => void;
  getSalesData: () => SalesData;
  isLoaded: boolean;
  canUndo: boolean;
}

export function useSales(): UseSalesReturn {
  const [sales, setSales] = useState<SalesData>({});
  const [history, setHistory] = useState<number[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const storedSales = localStorage.getItem(STORAGE_KEY);
      const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      
      if (storedSales) {
        setSales(JSON.parse(storedSales));
      }
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save to LocalStorage whenever sales change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sales));
      } catch (error) {
        console.error('Error saving sales to localStorage:', error);
      }
    }
  }, [sales, isLoaded]);

  // Save history to LocalStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
      } catch (error) {
        console.error('Error saving history to localStorage:', error);
      }
    }
  }, [history, isLoaded]);

  const addSale = useCallback((productId: number) => {
    setSales((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
    setHistory((prev) => [...prev, productId]);
  }, []);

  const undoLastSale = useCallback(() => {
    if (history.length === 0) return null;

    const newHistory = [...history];
    const lastProductId = newHistory.pop();
    
    if (lastProductId !== undefined) {
      setSales((prev) => {
        const currentCount = prev[lastProductId] || 0;
        if (currentCount <= 0) return prev; // Should not happen if logic is correct
        
        return {
          ...prev,
          [lastProductId]: currentCount - 1,
        };
      });
      setHistory(newHistory);
      return lastProductId;
    }
    return null;
  }, [history]);

  const resetSales = useCallback(() => {
    setSales({});
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }, []);

  const getSalesData = useCallback(() => {
    return { ...sales };
  }, [sales]);

  return {
    sales,
    addSale,
    undoLastSale,
    resetSales,
    getSalesData,
    isLoaded,
    canUndo: history.length > 0,
  };
}
