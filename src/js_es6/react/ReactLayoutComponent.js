import React, { useRef, useState, useEffect, useContext, useCallback } from "react";
import LayoutManager from "../LayoutManager";
import { ParentItemContext } from './ParentItemContext';
import LayoutItem from './LayoutItem';

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

    console.log(manager.root);

    return () => {
      manager && manager.destroy();
      setLayoutManager(undefined);
      setRootItem(undefined);
    }
  }, [containerRef]);


  return (
    <LayoutContext.Provider value={layoutManager}>
      <div ref={containerRef} {...restHtmlAttrs} style={style}>
        {
          rootItem &&
          <ParentItemContext.Provider value={{ index: 0, glItemInstance: rootItem }}>
            <LayoutRoot type='root'>
              { children }
            </LayoutRoot>
          </ParentItemContext.Provider>
        }
      </div>
    </LayoutContext.Provider>
  );
}

function LayoutRoot({ children, ...props }) {
  return (
    <LayoutItem type='root' {...props}>
      { children }
    </LayoutItem>
  )
}
