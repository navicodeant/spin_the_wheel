import React, { createContext, useContext, useState } from 'react';

interface ConfigContextType {
  config: null;
  loading: boolean;
  error: string | null;
}

const ConfigContext = createContext<ConfigContextType>({
  config: null,
  loading: false,
  error: null,
});

export const useConfig = () => useContext(ConfigContext);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  return (
    <ConfigContext.Provider value={{ config: null, loading, error }}>
      {children}
    </ConfigContext.Provider>
  );
};