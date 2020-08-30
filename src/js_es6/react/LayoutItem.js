import React, { useState, useEffect, useCallback } from 'react';
import { getUniqueId } from '../utils/utils';
import { useParentItemContext, ParentItemContext } from './ParentItemContext';

export default function LayoutItem({
  type,
  children,
  width,
  height,
  id,
  isClosable,
  title,
}) {
  const [ config, ] = useState(
    { type, id: id || getUniqueId() }
  );
  const [ item, setItem ] = useState();
  const { index, addToLayout } = useParentItemContext();
  const [ initialized, setInitialized ] = useState(false);

  const configProps = { width, height, id, isClosable, title };

  useEffect(() => {
    const layoutItem = addToLayout(index, { ...configProps, ...config });
    setItem(layoutItem);

    return () => console.log('destroyed');
  }, []);

  const addChild = useCallback((idx, config) => {
    const isLastChild = idx >= (children.length - 1);

    const suspendResize = !initialized && !isLastChild;
    item.addChild(config, idx, suspendResize);

    if (!initialized && isLastChild) {
      setInitialized(true);
    }

    return item.getItemsById(config.id)[0];
  }, [children, item]);

  if (!item) {
    return null;
  }

  return (
    React.Children.toArray(children).map((child, idx) => 
      <ParentItemContext.Provider key={idx} value={{ addToLayout: addChild, index: idx }}>
        { child }
      </ParentItemContext.Provider>
    )
  );
}