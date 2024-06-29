async function initializeAutoClicker() {
    const elements = await opts.clickElements()
    await whenReady(elements)
    await autoClick(elements)
}

async function autoClick(elements) {
    console.debug("[Content Focus]", "Click on", elements);
    elements.forEach(e => e.click());
}

initializeAutoClicker();
