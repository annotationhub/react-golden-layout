import React from "react";

import { GoldenLayoutComponent } from "../src/index";
import "../src/less/goldenlayout-base.less";
import "../src/less/themes/goldenlayout-dark-theme.less";

function ComponentA() {
    return <h2>A</h2>;
}

function ComponentB() {
    return <h2>B</h2>;
}

function ComponentC(props: any) {
    return <h2>{props.myText}</h2>;
}

export default function GoldenTest() {
    return (
        <GoldenLayoutComponent
            htmlAttrs={{ style: { width: "100vw", height: "100vh" } }}
            config={{
                content: [
                    {
                        type: "row",
                        content: [
                            {
                                component: ComponentA,
                                title: "A Component",
                            },
                            {
                                type: "column",
                                content: [
                                    {
                                        component: ComponentB,
                                        title: "B Component",
                                    },
                                    {
                                        component: () => (
                                            <ComponentC myText="Component with Props" />
                                        ),
                                        title: "C Component",
                                    },
                                ],
                            },
                        ],
                    },
                ],
            }}
        />
    );
}
