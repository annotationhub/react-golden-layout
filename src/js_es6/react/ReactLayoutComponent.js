import React, { useRef, useState, useEffect, useContext } from "react";
import LayoutManager from "../LayoutManager";
import { ContentProvider } from './ItemContentProvider';
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

  return (
    <LayoutContext.Provider value={layoutManager}>
      <ParentItemContext.Provider value={{ parent: rootItem }}>
        <ContentProvider onConfigUpdate={console.log}>
          <div ref={containerRef} {...restHtmlAttrs} style={style}>
            { children }
          </div>
        </ContentProvider>
      </ParentItemContext.Provider>
    </LayoutContext.Provider>
  );
}
