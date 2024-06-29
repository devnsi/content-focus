initializeAutoClicker();

async function initializeAutoClicker() {
    const elements = await opts.clickElements()
    await autoClick(elements)
}

async function autoClick(elements) {
    console.debug("[Content Focus]", "Click on", elements);
    elements.forEach(e => e.click());
}
