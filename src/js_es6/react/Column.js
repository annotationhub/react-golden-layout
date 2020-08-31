import React from 'react';
import LayoutItem, { GL_LAYOUT_ITEM_TYPES } from './LayoutItem';

export default function Column({ children, ...props }) {
  return (
    <LayoutItem type={GL_LAYOUT_ITEM_TYPES.COLUMN} {...props}>
      { children }
    </LayoutItem>
  )
}
