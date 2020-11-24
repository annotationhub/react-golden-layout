# React Golden Layout
[![NPM version](https://img.shields.io/npm/v/@annotationhub/react-golden-layout)](https://www.npmjs.com/package/@annotationhub/react-golden-layout) [![License](https://img.shields.io/github/license/golden-layout/golden-layout)](https://img.shields.io/github/license/golden-layout/golden-layout)

Original project credit goes to: https://github.com/golden-layout/golden-layout.

## Overview
This project was forked from the original golden layout project, which unfortunately appears to have been abandoned. This is a forked & updated version of that original project to add compatability with React. This updated version now exports a `GoldenLayoutComponent` for easy integration into a React project.

Example usage:
```typescript
import React, { useState } from 'react';
import '@annotationhub/react-golden-layout/dist/css/goldenlayout-base.css';
import '@annotationhub/react-golden-layout/dist/css/themes/goldenlayout-dark-theme.css';
import { ReactGoldenLayout } from '@annotationhub/react-golden-layout';

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
          <Stack onUserClosed={stack => window.alert('User wants to close this Stack!')}>
            {/* Be sure to your custom components in a <Content> component. */}
            <Content
              title='Panel 1'
              width={20}
              // Passing a function to "onUserClosed()" allows you to control of closing components.
              // When a user clicks
              onUserClosed={content => window.alert('User wants to close Panel 1!')}
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
```



## Features

* Full touch support
* Native popup windows
* Completely themeable
* Comprehensive API
* Powerful persistence
* Works in IE8+, Firefox, Chrome
* Reponsive design


## Installation / Usage

To install, run: `npm i -S @annotationhub/react-golden-layout`.

If you are using webpack or another module bundler, you may wish to install it as dev-dep instead. 
We are shipping an UMD version, an ES5 + ES-Module version and an ES2015+ES-Module version of the library within the package.
Modern bundlers such as webpack should pick up the ES2015 version and transpile the code according to your applications configuration.

## Demo App

We have a demo application embedded within this repository, to run it, run:

```sh
git clone github.com/golden-layout/golden-layout
cd golden-layout
npm ci # (or npm i, if you use an old npm version)
npm run start-jquery
# the app is served at localhost:3000 and uses hot-reload, so you can hack right away within the library and the application.
```

## Development

Internally, we are using webpack and babel to have a build process. 
To get started, follow the steps described in demo-app. 
You can get a complete build by running `npm run build`, which will compile all versions of the app into the `dist` folder.

