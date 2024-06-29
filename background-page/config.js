console.log("[Content Focus] Running background script.")
browser.runtime.onInstalled.addListener(initStore);

function initStore(details) {
    console.log('[Content Focus] Initialize store.', details);
    browser.storage.local.get().then((stored) => {
        if (stored && Object.keys(stored).length && !details.temporary) {
            console.log('[Content Focus] Use existing options', stored);
        } else {
            const opts = defaultOptions();
            console.log('[Content Focus] Initialize options', opts);
            browser.storage.local.set(opts);
        }
    })
}

function defaultOptions() {
    return {
        matchers: ["#question"],
        focus: '#question',
        unless: ['#answers'],
        click: ['#close']
    }
}
