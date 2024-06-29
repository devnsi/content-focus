document
    .getElementById("toggle")
    .addEventListener("click", _ => {
        console.debug("[Content Focus] Listening for clicks on toggle.")
        sendMessageToTab("toggle")
    });

document
    .getElementById("settings")
    .addEventListener("click", _ => {
        console.debug("[Content Focus] Listening for clicks on settings.")
        sendMessageToBackground("settings")
    });


function sendMessageToTab(action) {
    const message = { action: action }
    const queryInfo = { active: true, currentWindow: true }
    browser.tabs.query(queryInfo, (tabs) => browser.tabs.sendMessage(tabs[0].id, message));
}

function sendMessageToBackground(action) {
    const message = { action: action }
    browser.runtime.sendMessage(message);
}
