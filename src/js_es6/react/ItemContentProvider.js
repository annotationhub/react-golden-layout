import React, { useReducer, useEffect, useContext, useCallback } from "react";

const ContentContext = React.createContext({});
export const useContentContext = () => useContext(ContentContext);

function contentReducer(state, action) {
  switch (action.type) {
  case 'addContentItem': {
    let { itemConfig } = action.payload;
    // eslint-disable-next-line no-param-reassign
    return [ ...state, itemConfig];
  }
  case 'updateContentItem': {
    let { index, itemConfig } = action.payload;
    // eslint-disable-next-line no-param-reassign
    state[index] = itemConfig;
    return state;
  }
  default:
    throw Error(`Content Reducer error: ${action.type} is not a valid action`);
  }
}

export function ContentProvider({ children, onConfigUpdate }) {
  const [ contentConfig, dispatch ] = useReducer(contentReducer, []);

  useEffect(() => {
    onConfigUpdate(contentConfig);
  }, [contentConfig]);

  const addItemConfig = useCallback(
    (itemConfig) => {
      dispatch({ type: 'addContentItem', payload: { itemConfig }});
    },
    []
  );

  const updateItemConfig = useCallback(
    (itemConfig, index) => {
      dispatch({ type: 'updateContentItem', payload: { index, itemConfig }});
    },
    []
  );

  return (
    <ContentContext.Provider value={{ contentConfig, addItemConfig, updateItemConfig }}>
      { children }
    </ContentContext.Provider>
  )
}