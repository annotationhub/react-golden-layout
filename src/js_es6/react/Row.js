import React, { useRef, useState, useEffect } from 'react';
import randomString from './RandomString';
import { useContentContext } from './ItemContentProvider';
import { useLayoutContext } from './ReactLayoutComponent';
import { useParentItemContext, ParentItemContext } from './ParentItemContext';

export default function Row({ children }) {
  const [ config, setConfig ] = useState(
    { type: 'row' }
  );
  const [ item, setItem ] = useState();

  const { parent } = useParentItemContext();

  useEffect(() => {
    // TODO: Provide these lifecycle actions from parent instead.
    if (parent) {
      setItem(parent.addChild(config));
    }
  }, [parent]);

  return (
    <ParentItemContext.Provider value={{ parent: item }}>
      { children }
    </ParentItemContext.Provider>
  );
}

Row.$$_GL_TYPE = 'row';