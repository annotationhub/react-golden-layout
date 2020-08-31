import React from 'react';
import LayoutItem, { GL_LAYOUT_ITEM_TYPES } from './LayoutItem';

export default function Stack({ children, ...props }) {
  return (
    <LayoutItem type={GL_LAYOUT_ITEM_TYPES.STACK} {...props}>
      { children }
    </LayoutItem>
  )
}
