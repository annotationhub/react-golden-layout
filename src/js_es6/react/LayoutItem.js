import React, { useState, useEffect } from 'react';
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
  const { parent } = useParentItemContext();

  const configProps = { width, height, id, isClosable, title };

  useEffect(() => {
    let createdLayoutItem;
    if (!parent) {
      return;
    }

    parent.addChild({ ...configProps, ...config});
    createdLayoutItem = parent.getItemsById(config.id)[0];
    setItem(createdLayoutItem);

    console.log(createdLayoutItem);

    // const resize = () => createdLayoutItem.setSize();
    // createdLayoutItem.on('itemCreated', resize)

    return () => {
      if (parent && createdLayoutItem) {
        parent.removeChild(createdLayoutItem);
        // createdLayoutItem.off('itemCreated', resize)
      }
    }
  }, [parent]);

  return (
    <ParentItemContext.Provider value={{ parent: item }}>
      { children }
    </ParentItemContext.Provider>
  );
}