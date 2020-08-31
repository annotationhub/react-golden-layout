import React, { useState, useEffect } from 'react';
import '../src/less/goldenlayout-base.less';
import '../src/less/themes/goldenlayout-dark-theme.less';
import './demo.less';
import { GoldenLayoutComponent } from '../src';
import { ReactGoldenLayout } from '../src';

const { Row, Column, Stack, Content } = ReactGoldenLayout;

export default function GoldenTest() {
  const Render1 = (
    <Column id='column_1'>
      <Content height={25} title='column_content_1'>
        <h1>Column Test 1</h1>
      </Content>
      <Content height={75}>
        <h1>Column Test 2</h1>
      </Content>
    </Column>
  );

  // const Render1 = (
  //   <Stack>
  //     <Content height={25} title='column_content_1'>
  //       <h1>Column Test 1</h1>
  //     </Content>
  //   </Stack>
  // );

  const Render2 = (
    <Row id='row_1'>
      <Content width={25} title='row_content_1'>
        <h1>Row Test 1</h1>
      </Content>
      <Content width={25}>
        <h1>Row Test 2</h1>
      </Content>
      <Content width={25}>
        <h1>Row Test 3</h1>
      </Content>
      <Content width={25}>
        <h1>Row Test 4</h1>
      </Content>
    </Row>
  );

  const Render3 = (
    <Row id='row_1'>
      <Content width={20} title='Directory Manager'>
        <h1>Directory Manager</h1>
      </Content>
      <Column width={80}>
        <Row>
          <Content width={25} title='Schema Manager'>
            <h1>Schema Manager</h1>
          </Content>
          <Content height={75}>
            <h1>Source Viewer</h1>
          </Content>
        </Row>
        <Content width={25} title='Annotation Table'>
          <h1>Annotation Table</h1>
        </Content>
      </Column>
    </Row>
  );

  const [ render, setRender ] = useState(1);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setRender(render + 1);
  //   }, 2000);
  // }, [render]);

  return (
    <ReactGoldenLayout htmlAttrs={{ style: { width: '100vw', height: '100vh' } }}>
      <Column id='column_1'>
        <Content height={25} title='column_content_1'>
          <h1>Column Test 1</h1>
        </Content>
        <Content height={75}>
          <h1>Column Test 2</h1>
        </Content>
      </Column>
    </ReactGoldenLayout>
  );
}