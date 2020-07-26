import React, {useContext} from 'react';

export const ParentItemContext = React.createContext({});
export const useParentItemContext = () => useContext(ParentItemContext);