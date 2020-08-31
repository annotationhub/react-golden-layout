import React from 'react';
import LayoutItem, { GL_LAYOUT_ITEM_TYPES } from './LayoutItem';

export default function Row({ children, ...props }) {
  return (
    <LayoutItem type={GL_LAYOUT_ITEM_TYPES.ROW} {...props}>
      { children }
    </LayoutItem>
  )
}
