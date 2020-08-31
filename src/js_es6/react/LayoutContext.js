import React, { useContext } from "react";

export const LayoutContext = React.createContext({});
export const useLayoutContext = () => useContext(LayoutContext);