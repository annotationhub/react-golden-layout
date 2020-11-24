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
        content: []
      }
    };
  }

  componentDidMount() {
    const { layoutManager, registerConfig, index } = this.context;

    layoutManager.registerComponent(this.state.id, () => <></>);
    registerConfig(this.state.config, index);

    this._setupEventListeners();
  }

  componentWillUnmount() {
    this._removeEventListeners();
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

    return (<>
      {
        itemInstance && ReactDOM.createPortal(
          <>{children}</>,
          itemInstance.container._contentElement[0]
        )
      }
    </>);
  }
}

Content.propTypes = {
  onLayoutItem: PropTypes.func,
  width: PropTypes.number,
  height: PropTypes.number,
  isClosable: PropTypes.bool,
  title: PropTypes.string,
  id: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ])
};