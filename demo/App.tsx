import React from 'react';
import '../src/less/goldenlayout-base.less';
import '../src/less/themes/goldenlayout-dark-theme.less';
import './demo.less';
import { ReactGoldenLayout } from '../src';

const { Row, Column, Stack, Content } = ReactGoldenLayout;

export default function GoldenTest() {
  return (
    <div style= {{ width: '100vw', height: '100vh' }}>
      <ReactGoldenLayout>
        <Row>
          <Content width={20} title='Panel 1'>
            <h1>Panel 1</h1>
          </Content>
          <Column width={80}>
            <Stack height={35}>
              <Content title='Panel 2'>
                <h1>Stack Panel 2</h1>
              </Content>
              <Content title='Panel 3'>
                <h1>Stack Panel 2</h1>
              </Content>
            </Stack>
            <Content height={65} title='Panel 4'>
              <h1>Panel 4</h1>
            </Content>
          </Column>
        </Row>
      </ReactGoldenLayout>
    </div>
  );
}