import React, { useRef, useState, useEffect } from 'react';
import randomString from './RandomString';
import { useContentContext } from './ItemContentProvider';

export default function Row({ children }) {
  const [ id, ] = useState(randomString());
  const [ config, setConfig ] = useState({ type: 'row' });
  const { addItemConfig, updateItemConfig } = useContentContext();

  useEffect(() => {
    addItemConfig({ ...config, content: [] })
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