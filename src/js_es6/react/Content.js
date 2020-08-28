import React, { useRef, useState, useEffect } from 'react';
import { getUniqueId } from '../utils/utils';
import { useContentContext } from './ItemContentProvider';
import { useLayoutContext } from './ReactLayoutComponent';
import { useParentItemContext } from './ParentItemContext';

export default function Content({ children, key, name }) {
  const [ id, ] = useState(`${key}_${name}_${getUniqueId()}`);

  const [ config, setConfig ] = useState({ type: 'react-component' });
  const { parent } = useParentItemContext();
  const layoutManager = useLayoutContext();

  useEffect(() => {
    console.log('running', parent);
    if (!layoutManager || !parent) {
      return;
    }

    layoutManager.registerComponent(id, () => <>{children}</>);
    console.log('adding child');
    parent.addChild({
      type: 'react-component',
      component: id
    });
  }, [layoutManager, parent]);

  return null;
}

Content.$$_GL_TYPE = 'content';