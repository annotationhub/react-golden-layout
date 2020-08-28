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
      <Row width={100} height={100}>
        <Column width={80} height={80}>
          <Content>
            <h1>Test</h1>
          </Content>
        </Column>
        <Column width={20}>
          <Content height={25}>
            <h1>Test2</h1>
          </Content>
          <Content height={75}>
            <h1>Test3</h1>
          </Content>
        </Column>
      </Row>
    </ReactGoldenLayout>
  );
}