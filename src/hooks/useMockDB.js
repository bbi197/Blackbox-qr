import { useState, useEffect } from 'react';

const initialState = {
  businesses: [],
  platformBalance: 0
};

export const useMockDB = () => {
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem('mockDB');
    return saved ? JSON.parse(saved) : initialState;
  });

  useEffect(() => {
    localStorage.setItem('mockDB', JSON.stringify(state));
  }, [state]);

  const updateState = (newState) => {
    setState(newState);
  };

  return [state, updateState];
};