import React from "react";
import ReactDOM from "react-dom";
import { getUniqueId } from "../utils/utils";
import { LayoutContext } from "./LayoutContext";
import { GL_LAYOUT_ITEM_TYPES } from "./LayoutItem";
import PropTypes from "prop-types";
import Content from "./Content";

export default class PortalContent extends React.Component {
  static contextType = LayoutContext;

  constructor(props) {
    super(props);

    this.state = {
      itemInstance: null,
      childConfigs: []
    };
  }

  componentDidMount() {
    this._setupEventListeners();

    const itemInstance = this.findLayoutItem(this.props.containerId);
    if (itemInstance) {
      this.setState({ itemInstance: itemInstance });
    }
  }

  componentWillUnmount() {
    this._removeEventListeners();
  }

  registerChild(childConfig, idx) {
    console.log('here, registered', childConfig.id, childConfig.type);
    this.state.itemInstance.addChild(childConfig, idx);
  }

  unregisterChild(id) {
    const foundInstance = this.findLayoutItem(id);
    if (foundInstance && !foundInstance.isDestroyed) {
      console.log('removing child');
      foundInstance.parent.removeChild(foundInstance);
    }
  }

  _setupEventListeners() {
    this.context.layoutManager.on('itemCreated', this._setGoldenLayoutItemInstance);
    // this.context.layoutManager.on('itemDestroyed', this._checkIfDestroyed);
  }

  _removeEventListeners() {
    this.context.layoutManager.off('itemCreated', this._setGoldenLayoutItemInstance);
    // this.context.layoutManager.off('itemDestroyed', this._checkIfDestroyed);
  }

  /**
   * Sets the GL instance of this component using the containerId, first checking the passed
   * item's id to verify it is the correct one.
   * 
   * @param {*} item 
   */
  _setGoldenLayoutItemInstance = (item) => {
    if (item.config.id === this.state.id) {
      this.setState({ itemInstance: item });

      if (this.props.onLayoutItem) {
        this.props.onLayoutItem(item);
      }
    }
  }

  _checkIfDestroyed = (item) => {
    if (item.config.id === this.state.id) {
      this.setState({ itemInstance: null, registered: false });
    }
  }

  /**
   * Returns a content item with the passed id from the layout manager, if it exists.
   * @param {*} id
   */
  findLayoutItem(id) {
    return this.context.layoutManager.root.getItemsById(id)[0];
  }

  render() {
    const { children } = this.props;

    if (!this.state.itemInstance) {
      return null;
    }

    return (
      React.Children.toArray(children).map((child, idx) => 
        <LayoutContext.Provider
          key={idx}
          value={{
            layoutManager: this.context.layoutManager,
            registerConfig: this.registerChild.bind(this),
            unregister: this.unregisterChild.bind(this),
            index: idx
          }}
        >
          { child }
        </LayoutContext.Provider>
      )
    );
  }
}

PortalContent.propTypes = {
  containerId: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ])
};