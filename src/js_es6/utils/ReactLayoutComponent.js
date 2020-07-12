import React, { useRef, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import LayoutManager from "../LayoutManager";

/**
 * Far from cryptographically secure, but good enough to avoid component naming collisions.
 */
function randomString() {
    return (
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15)
    );
}

function translateConfig(config, componentMap) {
    if (config.component) {
        const componentName = `${
            config.component.key || config.component.name
        }_${randomString()}`;
        componentMap[componentName] = config.component;

        return {
            ...config,
            type: "react-component",
            component: componentName,
        };
    }

    return {
        ...config,
        content: config.content.map((item) =>
            translateConfig(item, componentMap)
        ),
    };
}

export default function ReactLayoutComponent({
    // TODO: discuss inbuilt layout change debouncing with @annotationhub
    // to hide underlying goldenlayout object
    config,
    onLayoutChange,
    htmlAttrs,
}) {
    const containerRef = useRef();
    const [panels, setPanels] = useState(new Set());

    useEffect(() => {
        const componentMap = {};

        const layoutManager = new LayoutManager(
            translateConfig(config, componentMap),
            containerRef.current
        );

        setPanels(new Set());

        // these callbacks are used by ReactComponentHandler to bind
        // the goldenlayout component lifecycle to react
        layoutManager.reactContainer = {
            componentRender: (panel) => {
                setPanels((panels) => panels.add(panel));
            },
            componentDestroy: (panel) => {
                setPanels((panels) => {
                    const newPanels = new Set(panels);
                    newPanels.delete(panel);
                    return newPanels;
                });
            },
        };

        for (const component in componentMap) {
            layoutManager.registerComponent(component, componentMap[component]);
        }

        if (onLayoutChange) {
            layoutManager.on("stateChanged", onLayoutChange);
        }

        layoutManager.init();

        return () => layoutManager.destroy();
    }, [config]);

    return (
        <div ref={containerRef} {...htmlAttrs}>
            {Array.from(panels).map((panel) =>
                ReactDOM.createPortal(
                    panel._getReactComponent(),
                    panel._container.getElement()[0]
                )
            )}
        </div>
    );
}
