async function initializeAutoClicker() {
    const click = await opts.click()
    await whenReady(click)
    await autoClick(click)
}

async function autoClick(click) {
    console.log("[Content Focus]", "Click on elements", click);
    click
        .map(e => document.querySelector(e))
        .filter(e => e)
        .forEach(e => {
            console.log("[Content Focus]", "Click on", e);
            e.click()
        });
}

initializeAutoClicker();
