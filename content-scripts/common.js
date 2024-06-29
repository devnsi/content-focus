console.debug("[Content Focus] Running content script in", document.URL);

/** Options caching resolved elements. */
const opts = {
    self: async () => (await browser.storage.local.get()),
    focusElements: async () => opts.focusElementsStored ??= whenReady((await opts.current())?.focus ?? []),
    clickElements: async () => opts.clickSelectorsStored ??= whenReady((await opts.current())?.click ?? []),
    eventElements: async () => opts.eventSelectorsStored ??= whenReady((await opts.current())?.event ?? []),
    current: async () => {
        return opts.currentStored ??= new Promise(async resolve => {
            const current = await opts.self();
            const matches = Object.keys(current).filter(matchesUrl)
            console.debug("[Content Focus] Matching option keys", matches)
            resolve(matches.length ? current[matches[0]] : {})
        });
    },
    reset: () => {
        opts.focusElementsStored = undefined;
        opts.clickSelectorsStored = undefined;
        opts.eventSelectorsStored = undefined;
        opts.currentStored = undefined;
    }
};

function matchesUrl(key) {
    return document.URL.split("?")[0].match(key) // ignore query parameters to allow simpler url specs.
}

const readyRequests = {}
async function whenReady(selectors) {
    const key = selectors.join(";") ?? ''
    if (!readyRequests[key]) {
        if (!selectors.length) {
            readyRequests[key] = new Promise(_ => { });
        } else {
            console.debug('[Content Focus] Wait for all', selectors);
            readyRequests[key] = new Promise(observeUntilReady);
        }
    }
    return readyRequests[key]

    function observeUntilReady(resolve) {
        var elements = resolveSelectors();
        var isAlreadyReady = allPresent(elements);
        if (isAlreadyReady) {
            resolve(elements);
            return;
        }

        var config = { attributes: false, childList: true, characterData: false, subtree: false };
        var callback = () => {
            var elements = resolveSelectors()
            if (allPresent(elements)) {
                observer.disconnect();
                resolve(elements);
            }
        };
        var observer = new MutationObserver(callback);
        observer.observe(document.body, config);
    }

    function resolveSelectors() {
        return selectors.map(s => document.querySelector(s)).filter(e => e);
    }

    function allPresent(elements) {
        const allPresent = elements.length == selectors.length
        if (allPresent) console.debug("[Content Focus] Resolved", selectors, "to", elements);
        else console.debug("[Content Focus] Resolving", selectors, "to", elements, "still incomplete...");
        return allPresent
    }
}

(async () => {
    const current = await opts.self()
    console.debug("[Content Focus] Options:", current)
})();

browser.storage.onChanged.addListener((changes, _) => {
    const changeWebsites = Object.keys(changes)
    const changeMatching = changeWebsites.filter(matchesUrl);
    const currentChanged = changeMatching.length > 0
    const relevantChanged = currentChanged && changes[changeMatching[0]].newValue
    if (relevantChanged) {
        console.debug("[Content Focus] Reset!", changes)
        opts.reset()
        initializeContentFocus();
        initializeAutoClicker();
        initializeEventCleanser();
    }
});
