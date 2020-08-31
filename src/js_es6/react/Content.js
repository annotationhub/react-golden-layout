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
  const [ id, ] = useState(idProp || `${getUniqueId()}`);

  const [ itemInstance, setItemInstance ] = useState();
  const { registerConfig, unregisterConfig,  index, parent } = useParentItemContext();
  const [ registered, setRegistered ] = useState(false);
  const layoutManager = useLayoutContext();

  const configProps = { width, height, id, isClosable, title };

  useEffect(() => {
    if (registered) {
      return;
    }

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

    setRegistered(true);
  }, [registerConfig, registered]);

  useEffect(() => {
    return () => unregisterConfig(id);
  }, [unregisterConfig]);

  useEffect(() => {
    if (!parent) {
      return;
    }

    const onParentItemCreated = event => {
      if (!itemInstance && event?.origin?.config.id === id) {
        setItemInstance(event.origin);
      }
    }

    const existingInstance = parent.getItemsById(id)[0];
    if (existingInstance) {
      setItemInstance(existingInstance);
    }

    parent.on('itemCreated', onParentItemCreated);

    return () => parent && parent.off('itemCreated', onParentItemCreated);
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