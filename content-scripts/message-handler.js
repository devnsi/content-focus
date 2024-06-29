browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("[Content Focus]", "Received message", message);
    switch (message.command) {
        case "toggle":
            executeAction(toggle())
            break;
        default:
            throw Error("message not handled: " + message.command)
    }
});
