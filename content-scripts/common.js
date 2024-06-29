function whenReady(reqs) {
    return new Promise(observeUntilReady);

    function observeUntilReady(resolve) {
        var isAlreadyReady = checkIfReady(reqs);
        if (isAlreadyReady) {
            resolve();
            return;
        }
    
        var config = { attributes: false, childList: true, characterData: false, subtree: false };
        var callback = () => {
            if (checkIfReady(reqs)) {
                observer.disconnect();
                resolve();
            }
        };
        var observer = new MutationObserver(callback);
        observer.observe(document.body, config);
    }
    
    function checkIfReady(reqs) {
        console.log("[Content Focus] Check if ready.");
        var requiredElementsPresent = reqs.every(req => document.body.contains(document.getElementById(req)));
        var isReady = requiredElementsPresent;
        return isReady;
    }
}
