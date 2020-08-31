import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { getUniqueId } from "../utils/utils";
import { LayoutContext, useLayoutContext } from "./LayoutContext";
import { useParentItemContext } from "./ParentItemContext";

export default class ContentNew extends React.Component {
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
  }

  _setupEventListeners() {
    const { layoutManager } = this.context;

    layoutManager.on('itemCreated', this._setItem);
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

export function Content({
  children,
  key,
  name,
  width,
  height,
  id: idProp,
  isClosable,
  title
}) {
  const [ id, ] = useState(idProp || `${getUniqueId()}`);

  const [ itemInstance, setItemInstance ] = useState();
  const { registerConfig, unregisterConfig,  index, parent } = useParentItemContext();
  const [ registered, setRegistered ] = useState(false);
  const layoutManager = useLayoutContext();

  const configProps = { width, height, id, isClosable, title };

  useEffect(() => {
    if (registered) {
      return;
    }

    // React component is a no-op. Everything is rendered through a react portal.
    layoutManager.registerComponent(id, () => <></>);

    registerConfig(
      index,
      {
        ...configProps,
        type: 'react-component',
        component: id
      }
    );

    setRegistered(true);
  }, [registerConfig, registered]);

  useEffect(() => {
    return () => {
      unregisterConfig(id);
    }
  }, [unregisterConfig]);

  useEffect(() => {
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
  }, [parent, itemInstance]);

  return (<>
    {
      itemInstance && ReactDOM.createPortal(
        <>{children}</>,
        itemInstance.container._contentElement[0]
      )
    }
  </>);
}

Content.$$_GL_TYPE = 'content';