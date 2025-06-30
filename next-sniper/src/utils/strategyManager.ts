import { UserStrategy } from '@/context/BotLogicContext';

const LOCAL_STORAGE_KEY = 'userTradingStrategies';

export const loadStrategiesFromLocalStorage = (): UserStrategy[] => {
  if (typeof window === 'undefined') return [];
  try {
    const savedStrategies = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    return savedStrategies ? JSON.parse(savedStrategies) : [];
  } catch (error) {
    console.error('Failed to load strategies from LocalStorage', error);
    return [];
  }
};

export const saveStrategiesToLocalStorage = (strategies: UserStrategy[]) => {
  try {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(strategies));
  } catch (error) {
    console.error('Failed to save strategies to LocalStorage', error);
  }
};