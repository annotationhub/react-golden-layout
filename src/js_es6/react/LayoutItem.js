import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { getUniqueId } from '../utils/utils';
import { useParentItemContext, ParentItemContext } from './ParentItemContext';
import Stack from '../items/Stack';
import RowOrColumn from '../items/RowOrColumn';
import { useLayoutContext } from "./ReactLayoutComponent";

export const GL_LAYOUT_ITEM_TYPES = {
  ROOT: 'root',
  ROW: 'row',
  COLUMN: 'column',
  STACK: 'stack'
};

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
  const { index, registerConfig, parent } = useParentItemContext();
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
    if (registered || type === GL_LAYOUT_ITEM_TYPES.ROOT) {
      return;
    }

    const numChildren = React.Children.toArray(children).length;
    if (childConfigs.length === numChildren) {
      registerConfig(
        index,
        {
          ...configProps,
          ...config,
          content: childConfigs
        }
      );
      setRegistered(true);
    }

  }, [childConfigs, registered]);

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

    const onParentItemCreated = () => {
      if (!itemInstance) {
        setItemInstance(parent.getItemsById(config.id)[0]);
      }
    }

    onParentItemCreated();
    parent.on('itemCreated', onParentItemCreated);

    return () => parent && parent.off('itemCreated', onParentItemCreated);
  }, [parent, itemInstance]);

  // Config registration function passed to child components.
  const registerChildConfig = useCallback((idx, config) => {
    updateChildConfigs(configs => {
      let updatedConfigs = [ ...configs ];
      updatedConfigs[idx] = config;
      return updatedConfigs;
    });
  }, [children]);

  return (
    React.Children.toArray(children).map((child, idx) => 
      <ParentItemContext.Provider
        key={idx}
        value={{
          registerConfig: registerChildConfig,
          index: idx,
          parent: itemInstance
        }}
      >
        { child }
      </ParentItemContext.Provider>
    )
  );
}