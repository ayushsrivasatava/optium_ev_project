import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Dimensions } from 'react-native';

interface LayoutContextType {
  isTablet: boolean;
  screenWidth: number;
  screenHeight: number;
  activeInspectorPanel: string | null;
  setActiveInspectorPanel: (panelId: string | null) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider = ({ children }: { children: ReactNode }) => {
  const [screenData, setScreenData] = useState(() => {
    const dim = Dimensions.get('window');
    return {
      width: dim.width,
      height: dim.height,
      isTablet: dim.width >= 768,
    };
  });

  const [activeInspectorPanel, setActiveInspectorPanel] = useState<string | null>(null);

  React.useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenData({
        width: window.width,
        height: window.height,
        isTablet: window.width >= 768,
      });
    });
    return () => subscription?.remove();
  }, []);

  return (
    <LayoutContext.Provider
      value={{
        isTablet: screenData.isTablet,
        screenWidth: screenData.width,
        screenHeight: screenData.height,
        activeInspectorPanel,
        setActiveInspectorPanel,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};