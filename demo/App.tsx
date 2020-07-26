import React, { useState } from 'react';
import '../src/less/goldenlayout-base.less';
import '../src/less/themes/goldenlayout-dark-theme.less';
import './demo.less';
import { GoldenLayoutComponent } from '../src';
import { ReactGoldenLayout } from '../src';

function ComponentA() {
  return <h2>A</h2>;
}

function ComponentB() {
  return <h2>B</h2>;
}

function ComponentC(props: any) {
  return <h2>{props.myText}</h2>;
}

// export default function GoldenTest() {
//   const [content, setContent] = useState<GoldenLayout.ItemConfigType[]>([
//       {
//         type: 'row',
//         content: [
//           {
//             component: ComponentA,
//             title: 'A Component',
//           },
//           {
//             type: 'column',
//             content: [
//               {
//                 component: ComponentB,
//                 title: 'B Component',
//               },
//               {
//                 component: () => (
//                   <ComponentC myText='Component with Props' />
//                 ),
//                 title: 'C Component',
//               },
//             ],
//           },
//         ]
//       },
//   ]);

//   return (
//     <GoldenLayoutComponent
//       htmlAttrs={{ style: { width: '100vw', height: '100vh' } }}
//       config={{ content }}
//     />
//   );
// }

export default function GoldenTest() {
  // TODO: import the GoldenLayout.ItemConfigType typings here, not sure how with local demo
  return (
    <ReactGoldenLayout htmlAttrs={{ style: { width: '100vw', height: '100vh' } }}>
      <ReactGoldenLayout.Row>
        <h1>Test</h1>
      </ReactGoldenLayout.Row>
    </ReactGoldenLayout>
    // <ReactGoldenLayout
    //   htmlAttrs={{
    //     style: { width: '100vw', height: '100vh' }
    //   }}
    // >
    //   <ReactGoldenLayout.Row>

    //   </ReactGoldenLayout.Row>
    // <ReactGoldenLayout />
  );
}