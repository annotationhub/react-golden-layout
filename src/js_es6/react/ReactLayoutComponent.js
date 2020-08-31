import React, { useRef, useState, useEffect, useContext, useCallback } from "react";
import LayoutManager from "../LayoutManager";
import { ParentItemContext } from './ParentItemContext';
import LayoutItem, { LayoutItemNew } from './LayoutItem';
import { LayoutContext } from './LayoutContext';

export default function ReactLayoutComponent({
  htmlAttrs,
  settings,
  dimensions,
  labels,
  children
}) {
  const containerRef = useRef();
  const [ layoutManager, setLayoutManager ] = useState();
  const [ rootItem, setRootItem ] = useState();
  const [ initialized, setInitialized ] = useState(true);

  // Default to filling parent container.
  let { style, ...restHtmlAttrs } = htmlAttrs || {};
  style = {
    width: '100%',
    height: '100%',
    ...(style || {})
  };

  useEffect(() => {
    let manager = new LayoutManager(
      { settings, dimensions, labels, content: [] },
      containerRef.current
    );

    manager.init();
    setRootItem(manager.root);
    setLayoutManager(manager);

    return () => {
      manager && manager.destroy();
      setLayoutManager(undefined);
      setRootItem(undefined);
    }
  }, [containerRef]);

  function initializeRoot(rootConfig) {
    // Root config may only have one child item.
    console.log(rootConfig.content);
    rootItem.addChild(rootConfig.content[0]);
  }

  return (
    <LayoutContext.Provider value={{
      index: 0,
      glItemInstance: rootItem,
      layoutManager,
      registerConfig: initializeRoot
    }}>
      <div ref={containerRef} {...restHtmlAttrs} style={style}>
        {
          rootItem &&
            <LayoutRoot type='root'>
              { children }
            </LayoutRoot>
        }
      </div>
    </LayoutContext.Provider>
  );
}

function LayoutRoot({ children, ...props }) {
  return (
    <LayoutItemNew type='root' {...props}>
      { children }
    </LayoutItemNew>
  )
}
