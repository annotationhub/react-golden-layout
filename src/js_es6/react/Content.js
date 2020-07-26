import React, { useRef, useState, useEffect } from 'react';
import randomString from './RandomString';
import { useContentContext } from './ItemContentProvider';
import { useLayoutContext } from './ReactLayoutComponent';

export default function Content({ children, key, name }) {
  const [ id, ] = useState(`${key}_${name}_${randomString()}`);

  const [ config, setConfig ] = useState({ type: 'react-component' });
  const { addItemConfig, updateItemConfig } = useContentContext();
  const { layoutManager } = useLayoutContext();

  useEffect(() => {
    addItemConfig({ ...config, content: [] })
    console.log(layoutManager);
  }, []);

  useEffect(() => {
    console.log('ran');
    // addItemConfig({
    //   type: 'row',
    //   content: []
    // })
  }, []);

  return (
    <>
      { children }
    </>
  );
}

Row.$$_GL_TYPE = 'row';