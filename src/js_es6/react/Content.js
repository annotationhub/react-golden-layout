import React, { useRef, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { getUniqueId } from "../utils/utils";
import { useContentContext } from "./ItemContentProvider";
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

  const [ config, setConfig ] = useState({ type: 'react-component' });
  const [ item, setItem ] = useState();
  const { addToLayout, index } = useParentItemContext();
  const layoutManager = useLayoutContext();

  const configProps = { width, height, id, isClosable, title };

  useEffect(() => {
    // React component is a no-op. Everything is rendered through a react portal.
    layoutManager.registerComponent(id, () => <></>);
    const item = addToLayout(
      index,
      {
        ...configProps,
        type: 'react-component',
        component: id
      }
    );

    setItem(item);

    return () => console.log('cleanup');
  }, [addToLayout]);

  return (<>
    {
      item && ReactDOM.createPortal(
        <>{children}</>,
        item.container._contentElement[0]
      )
    }
  </>);
}

Content.$$_GL_TYPE = 'content';