import React from 'react';
import { getUniqueId } from '../utils/utils';
import { LayoutContext } from "./LayoutContext";
import PropTypes from "prop-types";

export const GL_LAYOUT_ITEM_TYPES = {
  ROOT: 'root',
  ROW: 'row',
  COLUMN: 'column',
  STACK: 'stack',
  COMPONENT: 'react-component'
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
        content: [],
        onUserClosed: props.onUserClosed || undefined
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
    this.validateChildConfig(childConfig);
    if (this.state.registered) {
      this.state.itemInstance.addChild({ ...childConfig }, idx);
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

  validateChildConfig(childConfig) {
    if (this.props.type != GL_LAYOUT_ITEM_TYPES.STACK && childConfig.type === GL_LAYOUT_ITEM_TYPES.COMPONENT) {
      throw new Error(StackValidationError(this.props.type));
    }
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
  onUserClosed: PropTypes.func,
  id: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ])
};

const StackValidationError = (componentType = '') => (
` <Content> component cannot be a direct child of a <${componentType.slice(0, 1).toUpperCase()}${componentType.slice(1)}> component.

All <Content> elements must be wrapped in <Stack> components.
This is required to match the layout hierarchy GoldenLayout implicitly creates and allows react components to stay in sync with GoldenLayout.

Please update your component structure to match the below:
<${componentType.slice(0, 1).toUpperCase()}${componentType.slice(1)}>
  <Stack>
    <Content>
      { /* Content Children */ }
    <Content>
  </Stack>
</${componentType.slice(0, 1).toUpperCase()}${componentType.slice(1)}>
`)