import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { getUniqueId } from '../utils/utils';
import { useParentItemContext, ParentItemContext } from './ParentItemContext';
import { useLayoutContext, LayoutContext } from "./LayoutContext";

export const GL_LAYOUT_ITEM_TYPES = {
  ROOT: 'root',
  ROW: 'row',
  COLUMN: 'column',
  STACK: 'stack'
};

export class LayoutItemNew extends React.Component {
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
  }

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

  unregisterChild(id) {
    if (this.state.registered) {
      const foundInstance = this.context.layoutManager.root.getItemsById(id)[0];
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

  componentDidUpdate(prevProps, prevState) {
    this._registerIfReady();
  }

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
    this.context.layoutManager.on('itemCreated', this._setItem);
  }

  _removeEventListeners() {
    this.context.layoutManager.off('itemCreated', this._setItem);
  }

  _setItem = (item) => {
    if (item.config.id === this.state.id) {
      this.setState({ itemInstance: item });
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

export default function LayoutItem({
  type,
  children,
  width,
  height,
  id,
  isClosable,
  title
}) {
  const configProps = { width, height, id, isClosable, title };
  const layoutManager = useLayoutContext();
  const [ config, ] = useState(
    { type, id: id || getUniqueId() }
  );
  const { index, registerConfig, unregisterConfig, parent } = useParentItemContext();
  const [ registered, setRegistered ] = useState(false);
  const [ itemInstance, setItemInstance ] = useState(null);
  const [ childConfigs, updateChildConfigs ] = useReducer(
    (state, update) => update(state),
    []
  );

  /**
   * Registers this component's config with its parent once all children have registered.
   */
  useEffect(function registerConfigWithParent() {
    if (type === GL_LAYOUT_ITEM_TYPES.ROOT) {
      return;
    }

    if (!registered) {
      const numChildren = React.Children.toArray(children).length;
      const fullConfig = {
        ...configProps,
        ...config,
        content: childConfigs
      };
      const populatedConfigs = childConfigs.filter(cfg => !!cfg);
      if (populatedConfigs.length === numChildren) {
        registerConfig(index, fullConfig);
        setRegistered(true);
      }
    }
  }, [childConfigs, registered, registerConfig]);

  useEffect(function addNewChildDynamically() {
    if (!registered | !itemInstance) {
      return;
    }

    const newConfigs = childConfigs.filter(
      config => itemInstance.getItemsById(config.id).length <= 0
    );

    newConfigs.forEach(config => itemInstance.addChild(config, childConfigs.indexOf(config)));
  }, [registered, childConfigs, itemInstance]);

  useEffect(() => {
    return () => {
      if (type !== GL_LAYOUT_ITEM_TYPES.ROOT) {
        unregisterConfig(config.id);
        
        setRegistered(false);
      }
    }
  }, [unregisterConfig]);

  /**
   * Initializes the root component.
   * On first render pass, the tree of golden layout components is registered from the bottom up.
   * Each child waits for its children to register, then in turn builds its config and registers
   * itself upwards. When the final child registers with the root component, the entire tree is
   * finally added to golden layout.
   */
  useEffect(function initializeRoot() {
    if (registered || !layoutManager || type !== GL_LAYOUT_ITEM_TYPES.ROOT) {
      return;
    }

    // Root may only have one child. Once that child is registered, it's time to initialize.
    if (childConfigs.length === 1) {
      console.log(childConfigs);
      layoutManager.root.addChild(childConfigs[0]);
      setItemInstance(layoutManager.root);
      setRegistered(true);
    }
  }, [parent, layoutManager, childConfigs]);

  /**
   * Retrieves the instance of itself.
   * First, attempt to grab the instance of itself from the parent as soon
   * as parent instance is available. This will occurs when the component is added
   * during first initialization of the tree.
   * For dynamic adds after first initialization, the component will listen to the "itemCreated"
   * event to grab its instance.
   */
  useEffect(function getItemInstance() {
    if (!parent) {
      return;
    }

    const onParentItemCreated = event => {
      if (!itemInstance && event?.origin?.config.id === id) {
        setItemInstance(event.origin);
      }
    }

    const existingInstance = parent.getItemsById(id)[0];
    if (existingInstance) {
      setItemInstance(existingInstance);
    }

    parent.on('itemCreated', onParentItemCreated);

    return () => parent && parent.off('itemCreated', onParentItemCreated);
  }, [parent, itemInstance, registered]);

  // Config registration function passed to child components.
  const registerChildConfig = useCallback((idx, config) => {
    updateChildConfigs(configs => {
      let updatedConfigs = [ ...configs ];
      updatedConfigs[idx] = config;
      return updatedConfigs;
    });
  }, [children]);

  // Allows a child to unregister itself on unmount.
  // It's important that this callback is only recreated once, when the itemInstance
  // is set. Otherwise it might trigger child cleanup (see the cleanup function above).
  const unregisterChildConfig = useCallback((id) => {
    updateChildConfigs(configs => {
      return [ ...configs.filter(config => config.id !== id) ];
    });

    if (!itemInstance) {
      return;
    }

    const childInstance = itemInstance.getItemsById(id)[0];

    // if (childInstance?.parent && (childInstance.parent === itemInstance || itemInstance.contentItems.indexOf(childInstance.parent) >= 0)) {
    //   childInstance.parent.removeChild(childInstance);
    // }
  }, [itemInstance]);

  return (
    React.Children.toArray(children).map((child, idx) => 
      <ParentItemContext.Provider
        key={idx}
        value={{
          registerConfig: registerChildConfig,
          unregisterConfig: unregisterChildConfig,
          index: idx,
          parent: itemInstance
        }}
      >
        { child }
      </ParentItemContext.Provider>
    )
  );
}