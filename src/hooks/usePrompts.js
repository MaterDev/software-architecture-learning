import { useContext } from 'react';
import PromptContext from '../context/PromptContext';

// Custom hook to use the context
export const usePrompts = () => {
  const context = useContext(PromptContext);
  
  if (!context) {
    throw new Error('usePrompts must be used within a PromptProvider');
  }
  
  return context;
};
