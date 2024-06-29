async function initializeContextMenu() {
    const elements = await opts.contextElements()
    await whenReady(elements)
    enableContextMenu(elements)
}

function enableContextMenu(elements) {
    elements.forEach(element => {
        console.log("[Content Focus]", "Enable ContextMenu on", element);
        element.oncontextmenu = (event) => event.stopImmediatePropagation(); // stop other events from preventing context menu.
        element.onplay = (event) => event.stopImmediatePropagation(); // stop events reacting to play (i.e. ad display).
    });
}

initializeContextMenu();
