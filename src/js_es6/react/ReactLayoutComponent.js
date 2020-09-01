import React, { useRef, useState, useEffect } from "react";
import LayoutManager from "../LayoutManager";
import { LayoutContext } from "./LayoutContext";
import LayoutItem from "./LayoutItem";
import PropTypes from "prop-types";

export default function ReactLayoutComponent({
  htmlAttrs,
  settings,
  dimensions,
  labels,
  children,
  onLayout,
  autoresize = true,
  debounceResize = 50,
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

  // Initialize layout
  useEffect(() => {
    const manager = new LayoutManager(
      { settings, dimensions, labels, content: [] },
      containerRef.current
    );

    manager.init();
    setRootItem(manager.root);
    setLayoutManager(manager);

    return () => {
      manager.destroy();
      setLayoutManager(undefined);
      setRootItem(undefined);
    }
  }, [containerRef]);

  // Call onLayout when layout has been created
  useEffect(() => {
    if (onLayout && layoutManager) {
      onLayout(layoutManager)
    }
  }, [layoutManager, onLayout]);

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

  /**
   * Registers the root config by adding the root content to the root.
   * This is the final step in initialization, which results in first render of all layout children.
   * @param {*} rootConfig
   */
  function registerRootConfig(rootConfig) {
    // Root config may only have one child item.
    rootItem.addChild(rootConfig.content[0]);
  }

  return (
    <LayoutContext.Provider value={{
      index: 0,
      layoutManager,
      registerConfig: registerRootConfig
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
    <LayoutItem type='root' {...props}>
      { children }
    </LayoutItem>
  )
}

ReactLayoutComponent.propTypes = {
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
  })
};