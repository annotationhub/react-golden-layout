import React from 'react';
import { LayoutItemNew, GL_LAYOUT_ITEM_TYPES } from './LayoutItem';

export default function Column({ children, ...props }) {
  console.log('rendering new');
  return (
    <LayoutItemNew type={GL_LAYOUT_ITEM_TYPES.COLUMN} {...props}>
      { children }
    </LayoutItemNew>
  )
}
