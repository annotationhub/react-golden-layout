import React from 'react';
import { LayoutItemNew, GL_LAYOUT_ITEM_TYPES } from './LayoutItem';

export default function Row({ children, ...props }) {
  return (
    <LayoutItemNew type={GL_LAYOUT_ITEM_TYPES.ROW} {...props}>
      { children }
    </LayoutItemNew>
  )
}
