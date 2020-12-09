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
    const configProps = {
      width,
      height,
      isClosable: typeof isClosable === 'boolean' ? isClosable : true,
      title
    };
    const id = props.id || getUniqueId();

    this.state = {
      id,
      itemInstance: null,
      registered: false,
      config: {
        ...configProps,
        id,
        type: 'react-component',
        component: id,
        content: [],
      }
    };
  }

  componentDidMount() {
    this._setupEventListeners();
    this._registerIfRequired();
  }

  componentDidUpdate() {
    this._registerIfRequired();
  }

  componentWillUnmount() {
    this._removeEventListeners();
    this.context.layoutManager.unregisterComponent(this.state.id);
    this.context.unregister(this.state.id);
  }

  _setupEventListeners() {
    this.context.layoutManager.on('itemCreated', this._setGoldenLayoutItemInstance);
    this.context.layoutManager.on('itemDestroyed', this._checkIfDestroyed);
  }

  _removeEventListeners() {
    this.context.layoutManager.off('itemCreated', this._setGoldenLayoutItemInstance);
    this.context.layoutManager.off('itemDestroyed', this._checkIfDestroyed);
  }

  _setGoldenLayoutItemInstance = (item) => {
    if (item.config.id === this.state.id) {
      this.setState({ itemInstance: item });

      if (this.props.onLayoutItem) {
        this.props.onLayoutItem(item);
      }
    }
  }

  _registerIfRequired() {
    if (this.state.registered) {
      return;
    }

    const { layoutManager, registerConfig, index } = this.context;
    layoutManager.registerComponent(this.state.id, () => <></>);
    registerConfig(this.state.config, index);

    this.setState({ registered: true });
  }

  _checkIfDestroyed = (item) => {
    if (item.config.id === this.state.id) {
      this.context.layoutManager.unregisterComponent(this.state.id);
      this.setState({ itemInstance: null, registered: false });
      console.log('here, destroyed', this.state.id);
      this.props.onClosed(this.state.id, this.config, item);
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
  onClosed: PropTypes.func,
  id: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ])
};