import React from 'react';
import LayoutItem from './LayoutItem';

export default function Column({ children, ...props }) {
  return (
    <LayoutItem type='column' {...props}>
      { children }
    </LayoutItem>
  )
}
