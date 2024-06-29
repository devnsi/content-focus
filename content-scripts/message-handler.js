browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("[Content Focus]", "Received message", message);
    switch (message.action) {
        case "toggle":
            toggle();
            break;
        default:
            throw Error("message not handled: " + message.action)
    }
});
