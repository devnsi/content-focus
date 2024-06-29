const toggle = document.getElementById("toggle");
toggle.addEventListener("click", function (e) {
    console.log("[Content Focus] Listening for clicks on toggle.")
    browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        browser.tabs.sendMessage(tabs[0].id, { action: "toggle" });
    });
});
