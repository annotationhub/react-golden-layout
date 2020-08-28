import React from 'react';
import LayoutItem from './LayoutItem';

export default function Row({ children, ...props }) {
  return (
    <LayoutItem type='row' {...props}>
      { children }
    </LayoutItem>
  )
}
