async function initializeContextMenu() {
    const reqs = await opts.matchers()
    await whenReady(reqs)
    const element = await match()
    enableContextMenu(element)
}

function enableContextMenu(element) {
    console.log("[Content Focus]", "Enable ContextMenu on", element);
    element.oncontextmenu = (event) => event.stopImmediatePropagation(); // stop other events from preventing context menu.
    element.onplay = (event) => event.stopImmediatePropagation(); // stop events reacting to play (i.e. ad display).
}

initializeContextMenu();
