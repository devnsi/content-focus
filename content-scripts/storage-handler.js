browser.storage.onChanged.addListener((changes, _) => {
    const changeWebsites = Object.keys(changes)
    const changeMatching = changeWebsites.filter(matchesUrl);
    const currentChanged = changeMatching.length > 0
    const relevantChanged = currentChanged && changes[changeMatching[0]].newValue
    if (relevantChanged) {
        console.debug("[Content Focus] Reset due to updated configuration!")
        opts.reset()
        initializeContentFocus();
        initializeAutoClicker();
        initializeEventModifications();
    }
});
