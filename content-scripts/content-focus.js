console.log("[Focus] Running content script.")

const matchers = [
    "question",
]

const unless = [

]

whenReady(matchers)
    .then(() => browser.storage.local.get('focus'))
    .then((res) => executeAction(res.focus || '#question'));

function executeAction(focus) {
    console.log("[Content Focus]", "Selector", focus);
    const element = document.querySelector(focus);
    console.log("[Content Focus]", "Execute action on", element);
    enableContextMenu(element);
    pruneBesides(element)
}

function enableContextMenu(element) {
    console.log("[Content Focus]", "Enable ContextMenu on", element);
    element.oncontextmenu = (event) => event.stopImmediatePropagation(); // stop other events from preventing context menu.
    element.onplay = (event) => event.stopImmediatePropagation(); // stop events reacting to play (i.e. ad display).
}

function pruneBesides(element) {
    console.log("[Content Focus]", "Prune besides", element);
    let currentElement = element
    while (currentElement !== document.body) {
        const parent = currentElement.parentNode
        const children = [...parent.children].filter(e => !unless.some(u => e.matches(u)))
        for (const element of children) {
            if (currentElement !== element) {
                parent.removeChild(element)
            }
        }
        currentElement = parent
    }
}

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("[Content Focus]", "Received message", message);
});