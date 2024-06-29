console.log("[Content Focus] Running content script in", document.URL);

/** Options caching resolved elements. */
const opts = {
    self: async () => (await browser.storage.local.get()),
    focusElements: async () => opts.focusElementsStored ??= resolveSelectors((await opts.current())?.focus ?? []),
    clickElements: async () => opts.clickSelectorsStored ??= resolveSelectors((await opts.current())?.click ?? []),
    contextElements: async () => opts.contextSelectorsStored ??= resolveSelectors((await opts.current())?.context ?? []),
    current: async () => {
        return opts.currentStored ??= new Promise(async resolve => {
            const current = await opts.self();
            const matches = Object.keys(current).filter(key => document.URL.match(key))
            console.log("[Content Focus] Website has defined option keys", matches)
            resolve(matches.length ? current[matches[0]] : {})
        });
    },
    reset: () => {
        opts.focusElementsStored = undefined;
        opts.clickSelectorsStored = undefined;
        opts.contextSelectorsStored = undefined;
        opts.currentStored = undefined;
    }
};

async function resolveSelectors(selectors) {
    return new Promise(async resolve => {
        const elements = selectors.map(selector => {
            const match = document.querySelector(selector);
            if (!match) console.warn("[Content Focus]", selector, "could not be resolved!");
            return match;
        }).filter(e => e);
        console.log("[Content Focus]", "Resolve", selectors, "to", elements);
        resolve(elements)
    });
}

const readyRequests = {}
async function whenReady(elements) {
    const key = toKey(elements)
    if (!readyRequests[key]) {
        console.log('[Content Focus] Wait for all', elements);
        readyRequests[key] = new Promise(observeUntilReady);
    }
    return readyRequests[key]

    function toKey(elements) {
        elements
            .map(e => e.outerHTML)
            .map(html => JSON.stringify(html))
            .map(s => s.replaceAll(/\W/g, ''))
            .join(";")
    }

    function observeUntilReady(resolve) {
        var isAlreadyReady = checkIfReady();
        if (isAlreadyReady) {
            resolve();
            return;
        }

        var config = { attributes: false, childList: true, characterData: false, subtree: false };
        var callback = () => {
            if (checkIfReady()) {
                observer.disconnect();
                resolve();
            }
        };
        var observer = new MutationObserver(callback);
        observer.observe(document.body, config);
    }

    function checkIfReady() {
        const isPresent = (e) => document.body.contains(e);
        const isReady = elements.every(isPresent);
        console.log("[Content Focus] Check if", elements, "is ready:", isReady);
        return isReady
    }
}

(async () => {
    const current = await opts.self()
    console.log("[Content Focus] Options:", current)
})();

browser.storage.onChanged.addListener((changes, area) => {
    console.log("[Content Focus] On Storage Changed:", changes, area)
    console.log("[Content Focus] Reset!")
    opts.reset()
    initializeAutoClicker();
    initializeContentFocus(); // TODO but does not unhide!
    initializeContextMenu();
});
