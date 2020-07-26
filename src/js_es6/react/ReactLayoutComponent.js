import React, { useRef, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import LayoutManager from "../LayoutManager";
import { ContentProvider } from './ItemContentProvider';

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
  const [layoutManager, setLayoutManager] = useState(null);

  // Default to filling parent container.
  let { style, ...restHtmlAttrs } = htmlAttrs || {};
  style = {
    width: '100%',
    height: '100%',
    ...(style || {})
  };

  useEffect(() => {
    setLayoutManager(new LayoutManager(
      { settings, dimensions, labels },
      containerRef.current
    ));
  }, [containerRef]);

  return (
    <LayoutContext.Provider value={layoutManager}>
      <ContentProvider onConfigUpdate={console.log}>
        <div ref={containerRef} {...restHtmlAttrs} style={style}>
          { children }
        </div>
      </ContentProvider>
    </LayoutContext.Provider>
  );
}
