/** Handle messages from the tabs. */
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("[Content Focus]", "Received message in background", message);
    switch (message.action) {
        case "settings":
            browser.runtime.openOptionsPage();
            break;
        default:
            throw Error("message not handled: " + message.action);
    }
});

/** Handle commands from the browser (e.g. shortcuts). */
browser.commands.onCommand.addListener((command) => {
    console.log(`[Content Focus] Received command '${command}'.`);
    switch (command) {
        case "toggle":
            sendMessageToTab("toggle");
            break;
        case "settings":
            browser.runtime.openOptionsPage();
            break;
        default:
            throw Error("command not handled: " + command);
    }
});

function sendMessageToTab(action) {
    const message = { action: action };
    const queryInfo = { active: true, currentWindow: true };
    browser.tabs.query(queryInfo, (tabs) => browser.tabs.sendMessage(tabs[0].id, message));
}
