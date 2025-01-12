"use client";
import { useState, useEffect } from 'react';

export const usePageState = (key, initialValue = 1) => {
  const [page, setPage] = useState(initialValue);

  useEffect(() => {
    // Check if window (client-side) is available
    if (typeof window !== "undefined") {
      const savedPage = localStorage.getItem(key);
      if (savedPage) {
        setPage(Number(savedPage));
      }
    }
  }, [key]);

  const handlePageChange = (newPage) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, newPage);
      setPage(newPage);
    }
  };

  return [page, handlePageChange];
};

