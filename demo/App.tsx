import React, { useState } from 'react';
import '../src/less/goldenlayout-base.less';
import '../src/less/themes/goldenlayout-dark-theme.less';
import './demo.less';
import { ReactGoldenLayout } from '../src';

const { Row, Column, Stack, Content } = ReactGoldenLayout;

export default function GoldenTest() {
  const [layoutManager, setLayoutManager] = useState(null);

  return (
    <div style= {{ width: '100vw', height: '100vh' }}>
      <ReactGoldenLayout
        // (Optional) Defaults to true. Set up auto-resizing. Layout will resize when the window resizes.
        autoresize={true}
        // (Optional) (Milliseconds) Defaults to 50. Debounce resize to prevent excessive re-renders.
        debounceResize={100}
        // (Optional) Grab the instance of the GoldenLayout Manager. Gives you full access to GL API.
        onLayout={setLayoutManager}
        // (Optional) See http://golden-layout.com/docs/Config.html for all settings.
        settings={{ hasHeaders: true }}
        // (Optional) See http://golden-layout.com/docs/Config.html for all dimensions.
        dimensions={{ borderWidth: 2 }}
        // (Optional) See http://golden-layout.com/docs/Config.html for all label options.
        labels={{ close: 'close' }}
      >
        <Row
          // (Optional) Grab the corresponding Golden Layout RowOrColumn instance.
          onLayoutItem={item => {}}
          // Any other General config property documented at http://golden-layout.com/docs/ItemConfig.html is valid.
        >
           {/* Always wrap all <Content> components in <Stack> components. */}
          <Stack>
            {/* Be sure to your custom components in a <Content> component. */}
            <Content
              title='Panel 1'
              width={20}
            >
              <h1>Panel 1</h1>
            </Content>
          </Stack>
          <Column width={80}>
            <Stack height={35}>
              <Content title='Panel 2'>
                <h1>Stack Panel 2</h1>
              </Content>
              <Content title='Panel 3'>
                <h1>Stack Panel 2</h1>
              </Content>
            </Stack>
            <Stack>
              <Content height={65} title='Panel 4'>
                <h1>Panel 4</h1>
              </Content>
            </Stack>
          </Column>
        </Row>
      </ReactGoldenLayout>
    </div>
  );
}