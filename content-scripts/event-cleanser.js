async function initializeEventCleanser() {
    const elements = await opts.eventElements()
    await whenReady(elements)
    enableCleanser(elements)
}

function enableCleanser(elements) {
    console.debug("[Content Focus]", "Enable event cleanser on", elements);
    const overridenEvents = ['click', 'contextmenu', 'mouseup', 'play']
    elements.forEach(element => {
        reset(element)
        overridenEvents.forEach(e => element.addEventListener(e, stop, true))
    });
}

function stop(event) {
    return event.stopImmediatePropagation()
}

function reset(element) {
    const clone = element.cloneNode(true);
    // replace the object without losing the reference.
    // otherwise other events and caches contain detached node.
    Object.keys(element).forEach(k => delete k);
    Object.keys(clone).forEach(k => element[k] = clone[k])
}

initializeEventCleanser();
