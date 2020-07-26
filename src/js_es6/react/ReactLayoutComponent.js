import React, { useRef, useState, useEffect, useContext } from "react";
import ReactDOM from "react-dom";
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
  const [layoutManager, setLayoutManager] = useState();
  const [ rootItem, setRootItem ] = useState();

  // Default to filling parent container.
  let { style, ...restHtmlAttrs } = htmlAttrs || {};
  style = {
    width: '100%',
    height: '100%',
    ...(style || {})
  };

  useEffect(() => {
    console.log(containerRef.current);
    let manager = new LayoutManager(
      { settings, dimensions, labels, content: [] },
      containerRef.current
    );

    manager.registerComponent( 'testComponent', function( container, componentState ){
      container.getElement().html( '<h2>' + componentState.label + '</h2>' );
    });

    manager.init();
    setRootItem(manager.root);
    console.log(manager);

    setLayoutManager(manager);

    return () => {
      manager && manager.destroy();
      setLayoutManager(undefined);
      setRootItem(undefined);
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
