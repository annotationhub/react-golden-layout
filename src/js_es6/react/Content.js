import React, { useRef, useState, useEffect } from 'react';
import { getUniqueId } from '../utils/utils';
import { useContentContext } from './ItemContentProvider';
import { useLayoutContext } from './ReactLayoutComponent';
import { useParentItemContext } from './ParentItemContext';

export default function Content({
  children,
  key,
  name,
  width,
  height,
  id: idProp,
  isClosable,
  title
}) {
  const [ id, ] = useState(idProp || `${key}_${name}_${getUniqueId()}`);

  const [ config, setConfig ] = useState({ type: 'react-component' });
  const [ item, setItem ] = useState();
  const { parent } = useParentItemContext();
  const layoutManager = useLayoutContext();

  const configProps = { width, height, id, isClosable, title };

  useEffect(() => {
    let createdLayoutItem;
    if (!layoutManager || !parent) {
      return;
    }

    layoutManager.registerComponent(id, () => <>{children}</>);
    parent.addChild({
      ...configProps,
      type: 'react-component',
      component: id
    });
    createdLayoutItem = parent.getItemsById(config.id)[0];
    setItem(createdLayoutItem);

    return () => {
      if (layoutManager && parent) {
        parent.removeChild(createdLayoutItem);
        layoutManager.unregisterComponent(id);
      }
    }
  }, [layoutManager, parent]);

  return null;
}

Content.$$_GL_TYPE = 'content';