import React from 'react';
import LayoutItem from './LayoutItem';

export default function Stack({ children, ...props }) {
  return (
    <LayoutItem type='stack' {...props}>
      { children }
    </LayoutItem>
  )
}
