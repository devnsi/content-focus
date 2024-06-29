console.debug("[Content Focus] Running background script.")
browser.runtime.onInstalled.addListener(initStorage);

function initStorage(details) {
    console.debug('[Content Focus] Initialize store.', details);
    browser.storage.local.get().then((stored) => {
        if (stored && Object.keys(stored).length && !details.temporary) {
            console.debug('[Content Focus] Use existing configuration', stored);
        } else {
            const config = defaultConfiguration();
            console.debug('[Content Focus] Initialize configuration', config);
            browser.storage.local.clear();
            browser.storage.local.set(config);
        }
    })
}

function defaultConfiguration() {
    return {
    }
}
