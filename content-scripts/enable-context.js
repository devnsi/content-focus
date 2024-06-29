async function initializeEventModifications() {
    const elements = await opts.eventElements()
    enableEventModifications(elements)
}

function enableEventModifications(elements) {
    console.debug("[Content Focus]", "Modify events on", elements);
    elements.forEach(element => {
        element.addEventListener('contextmenu', stop, true);
    });
}

function stop(event) {
    return event.stopImmediatePropagation()
}

initializeEventModifications();
