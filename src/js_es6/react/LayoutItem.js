import React from 'react';
import { getUniqueId } from '../utils/utils';
import { LayoutContext } from "./LayoutContext";
import PropTypes from "prop-types";

export const GL_LAYOUT_ITEM_TYPES = {
  ROOT: 'root',
  ROW: 'row',
  COLUMN: 'column',
  STACK: 'stack'
};

export default class LayoutItem extends React.Component {
  static contextType = LayoutContext;

  constructor(props) {
    super(props);

    const { width, height, isClosable, title, type } = props;
    const configProps = { width, height, isClosable, title };
    const id = props.id || getUniqueId();

    this.state = {
      id,
      itemInstance: null,
      registered: false,
      config: {
        ...configProps,
        id,
        type,
        content: []
      }
    };
  }

  componentDidMount() {
    this._setupEventListeners();

    if (this.props.type === GL_LAYOUT_ITEM_TYPES.ROOT && !this.state.itemInstance) {
      this.setState({ itemInstance: this.context.layoutManager.root });
    }
  }

  componentWillUnmount() {
    this._removeEventListeners();
    this.context.unregister(this.state.id);
    this.setState({ itemInstance: null, registered: false });
  }

  /**
   * Returns a content item with the passed id from the layout manager, if it exists.
   * @param {*} id
   */
  findLayoutItem(id) {
    return this.context.layoutManager.root.getItemsById(id)[0];
  }

  /**
   * Registers a single child GL config by adding it to the content array in this component's GL config.
   * In addition, if this component is registered, adds the child to our GL instance.
   * 
   * A child registers itself once all its children have registered their configs (completing the content array).
   * 
   * On first render:
   * Registrations "bubble" upwards until reaching the either root component, a which time the root
   * adds the entire config to golden layout, or a component that is already registered and has a
   * corresponding instance in the instantiated Golden Layout, at which time it adds the child config
   * to itself (itemInstance.addChild()).
   * 
   * @param {*} childConfig 
   * @param {*} idx 
   */
  registerChild(childConfig, idx) {
    if (this.state.registered) {
      this.state.itemInstance.addChild(childConfig, idx);
    }

    this.setState(prev => {
      let childConfigs = [ ...prev.config.content ];
      childConfigs[idx] = childConfig;

      return {
        ...prev,
        config: {
          ...prev.config,
          content: childConfigs
        }
      }
    });
  }

  /**
   * Unregisters a single child.
   * If this component is registered, removes the child from the GL instance.
   * @param {*} id 
   */
  unregisterChild(id) {
    if (this.state.registered) {
      const foundInstance = this.findLayoutItem(id);
      if (foundInstance) {
        foundInstance.parent.removeChild(foundInstance);
      }
    }

    this.setState(prev => {
      const prevContent = prev.config.content;
      // This may alter indices of other children, but after registration, config
      // state is purely managed by GL. This update (should) mirror GL's after child removal.
      const childConfigs = prevContent.filter(config => config.id !== id);

      return {
        ...prev,
        config: {
          ...prev.config,
          content: childConfigs
        }
      }
    });
  }

  componentDidUpdate() {
    this._registerIfReady();
  }

  /**
   * Performs a check to see if all children have registered.
   * If they have, and this component has not already registered, registers
   * itself with its parent.
   */
  _registerIfReady() {
    if (this.state.registered) {
      return;
    }

    const { config } = this.state;
    const { children } = this.props;
    const { index } = this.context;

    const numChildren = React.Children.toArray(children).length;

    // Children register at their proper index, so may leave unset array indices.
    const registeredChildren = config.content.filter(config => !!config);
    if (registeredChildren.length === numChildren) {
      this.context.registerConfig(config, index);
      this.setState({ registered: true });
    }
  }

  _setupEventListeners() {
    this.context.layoutManager.on('itemCreated', this._setGoldenLayoutItemInstance);
  }

  _removeEventListeners() {
    this.context.layoutManager.off('itemCreated', this._setGoldenLayoutItemInstance);
  }

  /**
   * Sets the GL instance of this component (column, row, etc), first checking the passed
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

  render() {
    const { children } = this.props;

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

LayoutItem.propTypes = {
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