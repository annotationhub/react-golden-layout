import React, { useState } from 'react';
import '../src/less/goldenlayout-base.less';
import '../src/less/themes/goldenlayout-dark-theme.less';
import './demo.less';
import { GoldenLayoutComponent } from '../src';
import { ReactGoldenLayout } from '../src';

const { Row, Column, Stack, Content } = ReactGoldenLayout;

export default function GoldenTest() {
  return (
    <ReactGoldenLayout htmlAttrs={{ style: { width: '100vw', height: '100vh' } }}>
      <Column>
        <Content height={25}>
          <h1>Test2</h1>
        </Content>
        <Content height={75}>
          <h1>Test3</h1>
        </Content>
      </Column>
    </ReactGoldenLayout>
  );
}