import React from "react";
import ReactDOM from "react-dom";
import { getUniqueId } from "../utils/utils";
import { LayoutContext } from "./LayoutContext";
import PropTypes from "prop-types";

export default class Content extends React.Component {
  static contextType = LayoutContext;

  constructor(props) {
    super(props);

    const { width, height, isClosable, title } = props;
    const configProps = { width, height, isClosable, title };
    const id = props.id || getUniqueId();

    this.state = {
      id,
      itemInstance: null,
      config: {
        ...configProps,
        id,
        type: 'react-component',
        component: id,
        content: [],
        onUserClosed: props.onUserClosed || undefined
      }
    };
  }

  componentDidMount() {
    this._setupEventListeners();

    const { layoutManager, registerConfig, index } = this.context;

    layoutManager.registerComponent(this.state.id, () => <></>);
    registerConfig(this.state.config, index);
  }

  componentWillUnmount() {
    // It is important that event listeners are removed first, because it results in an implicit, but
    // important behavior. A component may be removed by multiple means:
    // 1. Removed from React Tree
    // 2. User closes the element by clicking "X"
    // 3. Removed through the GL API
    // In case #1, we don't want to emit to the "onUserClosed" prop, which relies on the GL events.
    // So, if this component is removed from the react tree, remove event listeners first so
    // that event does not call the prop. It is still called in case #3, which is not ideal, but
    // unavoidable at the moment.
    this._removeEventListeners();
    this.context.layoutManager.unregisterComponent(this.state.id);
    this.context.unregister(this.state.id);
  }

  _setupEventListeners() {
    const { layoutManager } = this.context;

    layoutManager.on('itemCreated', this._setGoldenLayoutItemInstance);
  }

  _removeEventListeners() {
    this.context.layoutManager.off('itemCreated', this._setGoldenLayoutItemInstance);
  }

  _setGoldenLayoutItemInstance = (item) => {
    if (item.config.id === this.state.id) {
      this.setState({ itemInstance: item });

      if (this.props.onLayoutItem) {
        this.props.onLayoutItem(item);
      }
    }
  }

  render() {
    const { itemInstance } = this.state;
    const { children } = this.props;

    if (!itemInstance) {
      return null;
    }

    return ReactDOM.createPortal(
      children,
      itemInstance.container._contentElement[0]
    );
  }
}

Content.propTypes = {
  onLayoutItem: PropTypes.func,
  width: PropTypes.number,
  height: PropTypes.number,
  isClosable: PropTypes.bool,
  title: PropTypes.string,
  onUserClosed: PropTypes.func,
  id: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ])
};