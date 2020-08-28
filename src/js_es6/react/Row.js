import React, { useRef, useState, useEffect } from 'react';
import { useContentContext } from './ItemContentProvider';
import { useLayoutContext } from './ReactLayoutComponent';
import { getUniqueId } from '../utils/utils';
import { useParentItemContext, ParentItemContext } from './ParentItemContext';

export default function Row({ children }) {
  const [ config, setConfig ] = useState(
    { type: 'row', id: getUniqueId() }
  );
  const [ item, setItem ] = useState();
  const { parent } = useParentItemContext();

  useEffect(() => {
    // TODO: Provide these lifecycle actions from parent instead.
    if (parent) {
      parent.addChild(config);
      console.log(parent.getItemsById(config.id));
      setItem(parent.getItemsById(config.id)[0]);
    }
  }, [parent]);

  return (
    <ParentItemContext.Provider value={{ parent: item }}>
      { children }
    </ParentItemContext.Provider>
  );
}

Row.$$_GL_TYPE = 'row';