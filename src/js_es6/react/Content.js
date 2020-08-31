import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { getUniqueId } from "../utils/utils";
import { useLayoutContext } from "./ReactLayoutComponent";
import { useParentItemContext } from "./ParentItemContext";

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

  const [ itemInstance, setItemInstance ] = useState();
  const { registerConfig, index, parent } = useParentItemContext();
  const layoutManager = useLayoutContext();

  const configProps = { width, height, id, isClosable, title };

  useEffect(() => {
    // React component is a no-op. Everything is rendered through a react portal.
    layoutManager.registerComponent(id, () => <></>);
    registerConfig(
      index,
      {
        ...configProps,
        type: 'react-component',
        component: id
      }
    );

    return () => console.log('cleanup');
  }, [registerConfig]);

  useEffect(() => {
    if (!parent) {
      return;
    }

    const findItemInstance = () => {
      if (!itemInstance) {
        setItemInstance(parent.getItemsById(id)[0]);
      }
    }

    findItemInstance();
    parent.on('itemCreated', findItemInstance);

    return () => parent && parent.off('itemCreated', findItemInstance);
  }, [parent, itemInstance]);

  return (<>
    {
      itemInstance && ReactDOM.createPortal(
        <>{children}</>,
        itemInstance.container._contentElement[0]
      )
    }
  </>);
}

Content.$$_GL_TYPE = 'content';