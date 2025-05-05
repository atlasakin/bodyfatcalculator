import { useState } from 'react';

export const useNavigation = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  
  const toggleNav = () => {
    setIsOpen(prev => !prev);
  };
  
  return {
    isOpen,
    toggleNav
  };
};