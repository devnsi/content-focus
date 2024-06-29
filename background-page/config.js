console.log("[Content Focus] Running background script.")
browser.runtime.onInstalled.addListener(initStorage);

function initStorage(details) {
    console.log('[Content Focus] Initialize store.', details);
    browser.storage.local.get().then((stored) => {
        if (stored && Object.keys(stored).length && !details.temporary) {
            console.log('[Content Focus] Use existing configuration', stored);
        } else {
            const config = defaultConfiguration();
            console.log('[Content Focus] Initialize configuration', config);
            browser.storage.local.clear();
            browser.storage.local.set(config);
        }
    })
}

function defaultConfiguration() {
    return {
        ".*stackoverflow.*": {
            focus: ["#question", "#answers"],
            click: undefined,
            context: ['#close']
        },
        "https://accounts.google.com/gsi/iframe/select": {
            click: ['#close']
        }
    }
}
