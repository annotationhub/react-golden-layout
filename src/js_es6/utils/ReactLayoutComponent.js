import React from 'react';
import ReactDOM from 'react-dom';
import LayoutManager from '../LayoutManager';

export default class ReactLayoutComponent extends React.Component {
  state = {};
  containerRef = React.createRef();

  render() {
    let panels = Array.from(this.state.renderPanels || []);

    return (
      <div ref={this.containerRef} {...this.props.htmlAttrs}>
        {panels.map((panel, index) => {
          return ReactDOM.createPortal(
            panel._getReactComponent(),
            panel._container.getElement()[0]
          );
        })}
      </div>
    );
  }

  componentRender(reactComponentHandler) {
    this.setState(state => {
      let newRenderPanels = new Set(state.renderPanels);
      newRenderPanels.add(reactComponentHandler);
      return { renderPanels: newRenderPanels };
    });
  }

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
      this.props.config || {},
      this.containerRef.current
    );

    if (this.props.registerComponents instanceof Function) {
      this.props.registerComponents(this.goldenLayoutInstance);
    }

    this.goldenLayoutInstance.reactContainer = this;
    this.goldenLayoutInstance.init();
  }
}
