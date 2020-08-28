import React, { useState } from 'react';
import '../src/less/goldenlayout-base.less';
import '../src/less/themes/goldenlayout-dark-theme.less';
import './demo.less';
import { GoldenLayoutComponent } from '../src';
import { ReactGoldenLayout } from '../src';

const { Row, Content } = ReactGoldenLayout;

export default function GoldenTest() {
  return (
    <ReactGoldenLayout htmlAttrs={{ style: { width: '100vw', height: '100vh' } }}>
      <Row>
        <Content>
          <h1>Test</h1>
        </Content>
        <Row>
          <Content>
            <h1>Test2</h1>
          </Content>
        </Row>
      </Row>
    </ReactGoldenLayout>
  );
}