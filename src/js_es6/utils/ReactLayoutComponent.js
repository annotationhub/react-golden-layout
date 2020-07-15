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

/**
 * Quick and dirty hash function for determining quickly determining config file changes.
 * https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
 */
function hash(s) {
    return s.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
}

export default function ReactLayoutComponent({
    config,
    htmlAttrs,
    onLayoutReady,
    autoresize = false,
    debounceResize = 0,
}) {
    const containerRef = useRef();
    const [panels, setPanels] = useState(new Set());
    const [layoutManager, setLayoutManager] = useState(null);

    // Equality almost never pass when passing in config object. Usually a new object is created.
    // This hash is a quick method of detecting actual config changes before heavy recreation of the layout.
    // TODO: This may not be optimal or most performant method to check for config changes.
    const [configHash, setConfigHash] = useState(hash(JSON.stringify(config)));
    useEffect(() => {
        const newHash = hash(JSON.stringify(config));
        if (newHash !== configHash) {
            setConfigHash(newHash);
        }
    }, [config]);

    useEffect(() => {
        const componentMap = {};

        const layoutManager = new LayoutManager(
            translateConfig(config, componentMap),
            containerRef.current
        );

        setLayoutManager(layoutManager);
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

        layoutManager.init();

        if (onLayoutReady) {
            onLayoutReady(layoutManager);
        }

        return () => layoutManager.destroy();
    }, [configHash]);

    // Autoresize
    useEffect(() => {
        if (!autoresize) {
            return;
        }

        let resizeTimer;
        const resize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (layoutManager) {
                    layoutManager.updateSize();
                }
            }, debounceResize);
        }

        window.addEventListener('resize', resize);

        return () => window.removeEventListener('resize', resize);
    }, [autoresize, debounceResize, layoutManager]);

    // Default to filling parent container.
    let { style, ...restHtmlAttrs } = htmlAttrs || {};
    style = {
        width: '100%',
        height: '100%',
        ...(style || {})
    };

    return (
        <div ref={containerRef} {...restHtmlAttrs} style={style}>
            {Array.from(panels).map((panel) =>
                ReactDOM.createPortal(
                    panel._getReactComponent(),
                    panel._container.getElement()[0]
                )
            )}
        </div>
    );
}
