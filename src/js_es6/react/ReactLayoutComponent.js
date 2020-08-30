import React, { useRef, useState, useEffect, useContext, useCallback } from "react";
import LayoutManager from "../LayoutManager";
import { ParentItemContext } from './ParentItemContext';

const LayoutContext = React.createContext({});
export const useLayoutContext = () => useContext(LayoutContext);

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

    const updateSize = () => {};
    manager.on('itemCreated', updateSize);

    console.log(manager);

    return () => {
      manager && manager.destroy();
      setLayoutManager(undefined);
      setRootItem(undefined);
      manager.off('itemCreated', updateSize);
    }
  }, [containerRef]);

  const addChild = useCallback((idx, config) => {
    const isLastChild = idx >= (children.length - 1);

    const suspendResize = !initialized && !isLastChild;
    rootItem.addChild(config, idx, suspendResize);

    if (!initialized && isLastChild) {
      setInitialized(true);
    }

    return rootItem.getItemsById(config.id)[0];
  }, [children, rootItem]);

  return (
    <LayoutContext.Provider value={layoutManager}>
      <div ref={containerRef} {...restHtmlAttrs} style={style}>
        { rootItem && React.Children.toArray(children).map((child, idx) => 
          <ParentItemContext.Provider key={idx} value={{ addToLayout: addChild, index: idx }}>
            { child }
          </ParentItemContext.Provider>
        ) }
      </div>
    </LayoutContext.Provider>
  );
}
