console.log("[Content Focus] Running content script.", document.URL)

const opts = {
    self: async () => (await browser.storage.local.get()),
    matchers: async () => (await browser.storage.local.get('matchers')).matchers,
    focus: async () => (await browser.storage.local.get('focus')).focus,
    unless: async () => (await browser.storage.local.get('unless')).unless,
    click: async () => (await browser.storage.local.get('click')).click,
};

(async () => {
    const current = await opts.self()
    console.log("[Content Focus] Options:", current)
})();

const readyRequests = {}
async function whenReady(reqs) {
    const key = reqs.join(';')
    if (!readyRequests[key]) {
        console.log('[Content Focus] Wait for any', reqs);
        readyRequests[key] = new Promise(observeUntilReady);
    }
    return readyRequests[key]

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
        const isPresentInDocument = (req, doc) => doc.body.contains(doc.querySelector(req))
        const isPresentAnyDocument = (req, docs) => docs.some(doc => isPresentInDocument(req, doc))
        const isReady = reqs.some(req => isPresentAnyDocument(req, [document]))
        console.log("[Content Focus] Check if", reqs, "is ready:", isReady);
        return isReady
    }
}

var storedMatch = null;
async function match() {
    if (!storedMatch) {
        storedMatch = new Promise(async resolve => {
            const focus = await opts.focus()
            const element = document.querySelector(focus);
            console.log("[Content Focus]", "Selected", element, "due to", focus);
            resolve(element)
        });
    }
    return storedMatch
}
