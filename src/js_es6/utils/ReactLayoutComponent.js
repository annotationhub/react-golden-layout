import React from 'react';
import ReactDOM from 'react-dom';
import LayoutManager from '../LayoutManager';

/**
 * Far from cryptographically secure, but good enough to avoid component naming collisions.
 */
function randomString() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function translateConfig(config, configMap) {
  if (config.component) {
    const componentName = `${(config.component.key || config.component.name)}_${randomString()}`;
    configMap[componentName] = config.component;

    return {
      ...config,
      type: 'react-component',
      component: componentName,
    };
  }

  return {
    ...config,
    content: config.content.map(item => translateConfig(item, configMap))
  };
}

export default class ReactLayoutComponent extends React.Component {
  containerRef = React.createRef();
  defaultContainerStyle = {
    width: '100%',
    height: '100%'
  };

  windowResizeListener = null;
  containerResizer = this.resizeOnDelay.bind(this);
  resizeTimer = null;
  defaultDebounceResize = 0;

  constructor(props) {
    super(props);

    const componentMap = {};
    const glConfig = translateConfig(this.props.config || {}, componentMap);

    this.state = {
      renderPanels: new Set(),
      config: this.props.config,
      glConfig,
      componentMap
    };
  }

  /**
   * Called by ReactComponentHandler on GoldenLayout's render component call.
   * @param {ReactComponentHandler} reactComponentHandler 
   */
  componentRender(reactComponentHandler) {
    this.setState(state => {
      let newRenderPanels = new Set(state.renderPanels);
      newRenderPanels.add(reactComponentHandler);
      return { renderPanels: newRenderPanels };
    });
  }

  /**
   * Called by ReactComponentHandler on GoldenLayout's destroy component call.
   * @param {ReactComponentHandler} reactComponentHandler 
   */
  componentDestroy(reactComponentHandler) {
    this.setState(state => {
      let newRenderPanels = new Set(state.renderPanels);
      newRenderPanels.delete(reactComponentHandler);
      return { renderPanels: newRenderPanels };
    });
  }

  goldenLayoutInstance = undefined;

  componentDidMount() {
    this.goldenLayoutInstance = new LayoutManager(
      this.state.glConfig || {},
      this.containerRef.current
    );

    for (let component in this.state.componentMap) {
      this.goldenLayoutInstance.registerComponent(component, this.state.componentMap[component]);
    }

    this.goldenLayoutInstance.reactContainer = this;
    this.goldenLayoutInstance.init();

    if (this.props.layoutManager) {
      this.props.layoutManager(this.goldenLayoutInstance);
    }

    if (this.props.autoresize) {
      this.enableAutoResize();
    }
  }

  enableAutoResize() {
    const div = this.containerRef.current;
    if (div) {
      div.addEventListener('resize', this.containerResizer);
    }

    window.addEventListener('resize', this.containerResizer);
  }

  disableAutoResize() {
    const div = this.containerRef.current;
    window.removeEventListener('resize', this.containerResizer);
    if (div) {
    div.removeEventListener('resize', this.containerResizer);
    }

    this.containerResizer = null;
  }

  resizeOnDelay() {
    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer);
    }

    const debounceTime = (typeof this.props.debounceResize === 'number') ?
      this.props.debounceResize :
      this.defaultDebounceResize;

    this.resizeTimer = setTimeout(() => {
      this.goldenLayoutInstance && this.goldenLayoutInstance.updateSize();
    }, debounceTime);
  }

  render() {
    let panels = Array.from(this.state.renderPanels || []);
    let { style, ...htmlAttrs } = this.props.htmlAttrs || {};
    style = {
      ...this.defaultContainerStyle,
      ...(style || {})
    };

    return (
      <div
        ref={this.containerRef}
        {...htmlAttrs}
        style={style}
      >
        {panels.map((panel, index) => {
          return ReactDOM.createPortal(
            panel._getReactComponent(),
            panel._container.getElement()[0]
          );
        })}
      </div>
    );
  }
}
