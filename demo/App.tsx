import React, { useState, useEffect } from 'react';
import '../src/less/goldenlayout-base.less';
import '../src/less/themes/goldenlayout-dark-theme.less';
import './demo.less';
import { ReactGoldenLayout } from '../src';

const { Row, Column, Stack, Content } = ReactGoldenLayout;

export default function GoldenTest() {
  return (
    <ReactGoldenLayout htmlAttrs={{ style: { width: '100vw', height: '100vh' } }}>
      <Row>
        <Content width={20} title='Panel 1'>
          <h1>Panel 1</h1>
        </Content>
        <Column width={80}>
          <Row>
            <Content width={25} title='Panel 2'>
              <h1>Panel 2</h1>
            </Content>
            <Content height={75} title='Panel 3'>
              <h1>Panel 3</h1>
            </Content>
          </Row>
          <Content width={25} title='Panel 4'>
            <h1>Panel 4</h1>
          </Content>
        </Column>
      </Row>
    </ReactGoldenLayout>
  );
}