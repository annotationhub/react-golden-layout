import React, { useState, useEffect } from 'react';

import { GoldenLayoutComponent } from '../src/index';
import '../src/less/goldenlayout-base.less';
import '../src/less/themes/goldenlayout-dark-theme.less';
import './demo.less';
import GoldenLayout from '@annotationhub/react-golden-layout';

function ComponentA() {
  return <h2>A</h2>;
}

function ComponentB() {
  return <h2>B</h2>;
}

function ComponentC(props: any) {
  return <h2>{props.myText}</h2>;
}

export default function GoldenTest() {
  // TODO: import the GoldenLayout.ItemConfigType typings here, not sure how with local demo
  const [content, setContent] = useState<GoldenLayout.ItemConfigType[]>([
    {
      component: ComponentA,
      title: 'A Component',
    },
  ]);

  useEffect(() => {
    const id = setTimeout(() => {
      setContent((content) => [
        ...content,

        {
          type: 'column',
          content: [
            {
              component: ComponentB,
              title: 'B Component',
            },
            {
              component: () => (
                <ComponentC myText='Component with Props' />
              ),
              title: 'C Component',
            },
          ],
        },
      ]);
    }, 2000);

    return () => clearTimeout(id);
  }, [setContent]);

  return (
    <GoldenLayoutComponent
      htmlAttrs={{ style: { width: '100vw', height: '100vh' } }}
      onLayoutChange={(...args) => {
        console.log('layoutchange', args);
      }}
      config={{
        content: [
          {
            type: 'row',
            content: content,
          },
        ],
      }}
    />
  );
}
