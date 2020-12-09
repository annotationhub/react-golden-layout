import React, { useRef, useState, useEffect } from "react";
import LayoutManager from "../LayoutManager";
import { LayoutContext } from "./LayoutContext";
import LayoutItem from "./LayoutItem";
import PropTypes from "prop-types";

export default function PortalLayoutComponent({
  htmlAttrs,
  settings,
  dimensions,
  labels,
  children,
  onLayout,
  content,
  autoresize = true,
  debounceResize = 50,
}) {
  const containerRef = useRef();
  const [ layoutManager, setLayoutManager ] = useState();

  // Default to filling parent container.
  let { style, ...restHtmlAttrs } = htmlAttrs || {};
  style = {
    width: '100%',
    height: '100%',
    ...(style || {})
  };

  // Initialize layout
  useEffect(() => {
    const manager = new LayoutManager(
      { settings, dimensions, labels, content },
      containerRef.current
    );

    manager.init();
    setLayoutManager(manager);

    return () => {
      manager.destroy();
      setLayoutManager(undefined);
    }
  }, [containerRef]);

  // Call onLayout when layout has been created
  useEffect(() => {
    if (onLayout && layoutManager) {
      onLayout(layoutManager)
    }
  }, [layoutManager]);

  // Autoresize
  useEffect(() => {
    if (!autoresize) {
      return;
    }

    let resizeTimer;
    const resize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (layoutManager) {
          layoutManager.updateSize();
        }
      }, debounceResize);
    }

    window.addEventListener('resize', resize);

    return () => window.removeEventListener('resize', resize);
  }, [autoresize, debounceResize, layoutManager]);

  return (
    <LayoutContext.Provider value={{
      index: 0,
      layoutManager,
      registerConfig: () => {},
      unregister: () => {}
    }}>
      <div ref={containerRef} {...restHtmlAttrs} style={style}>
        { layoutManager && children }
      </div>
    </LayoutContext.Provider>
  );
}

PortalLayoutComponent.propTypes = {
  // Custom Props
  onLayoutReady: PropTypes.func,
  autosize: PropTypes.bool,

  // GL props
  settings: PropTypes.shape({
    hasHeaders: PropTypes.bool,
    constrainDragToContainer: PropTypes.bool,
    reorderEnabled: PropTypes.bool,
    selectionEnabled: PropTypes.bool,
    popoutWholeStack: PropTypes.bool,
    blockedPopoutsThrowError: PropTypes.bool,
    closePopoutsOnUnload: PropTypes.bool,
    showPopoutIcon: PropTypes.bool,
    showMaximiseIcon: PropTypes.bool,
    showCloseIcon: PropTypes.bool
  }),
  dimensions: PropTypes.shape({
    borderWidth: PropTypes.number,
    minItemHeight: PropTypes.number,
    minItemWidth: PropTypes.number,
    headerHeight: PropTypes.number,
    dragProxyWidth: PropTypes.number,
    dragProxyHeight: PropTypes.number,
  }),
  labels: PropTypes.shape({
    close: PropTypes.string,
    maximise: PropTypes.string,
    minimise: PropTypes.string,
    popout: PropTypes.string,
  }),
  content: PropTypes.any
};