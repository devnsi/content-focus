browser.commands.onCommand.addListener((command) => {
    console.log(`[Content Focus] Received command '${command}'.`);
    switch (command) {
        case "toggle":
            sendToContent({ command: "toggle" })
            break;
        default:
            throw Error("command not handled: " + command)
    }
});

function sendToContent(message) {
    browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        browser.tabs.sendMessage(tabs[0].id, message);
    });
}
