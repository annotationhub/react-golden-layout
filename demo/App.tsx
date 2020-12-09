import React, { useState } from 'react';
import '../src/less/goldenlayout-base.less';
import '../src/less/themes/goldenlayout-dark-theme.less';
import './demo.less';
import { PortalLayoutComponent, PortalContent, Content } from '../src';

export default function GoldenTest() {
  const [layoutManager, setLayoutManager] = useState(null);

  const [ test1, setTest1 ] = useState(true);
  const [ test2, setTest2 ] = useState(true);

  (window as any).layoutManager = layoutManager;

  return (
    <div style= {{ width: '100vw', height: '100vh' }}>
      <PortalLayoutComponent
        // (Optional) Defaults to true. Set up auto-resizing. Layout will resize when the window resizes.
        autoresize={true}
        // (Optional) (Milliseconds) Defaults to 50. Debounce resize to prevent excessive re-renders.
        debounceResize={100}
        // (Optional) Grab the instance of the GoldenLayout Manager. Gives you full access to GL API.
        onLayout={setLayoutManager}
        // (Optional) See http://golden-layout.com/docs/Config.html for all settings.
        settings={{ hasHeaders: true }}
        content={[{
          type: 'row',
          id: 'test',
          content: []
        }]}
        // (Optional) See http://golden-layout.com/docs/Config.html for all dimensions.
        dimensions={{ borderWidth: 2 }}
        // (Optional) See http://golden-layout.com/docs/Config.html for all label options.
        labels={{ close: 'close' }}
      >
        <PortalContent
          containerId={'test'}
        >
          { test1 && (
            <Content onClosed={() => setTest1(false)}>
              <h1>Test Panel 1</h1>
            </Content>
          )}
          { test2 && (
            <Content onClosed={() => setTest2(false)}>
              <h1>Test Panel 2</h1>
            </Content>
          )}
        </PortalContent>
      </PortalLayoutComponent>
    </div>
  );
}