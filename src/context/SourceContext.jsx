import React, { createContext, useState } from "react";

export const SourceContext = createContext();

export const SourceProvider = ({ children }) => {
  // По умолчанию habr
  const [source, setSource] = useState("habr");

  return (
    <SourceContext.Provider value={{ source, setSource }}>
      {children}
    </SourceContext.Provider>
  );
};
