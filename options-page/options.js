document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("reset", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);

async function restoreOptions() {
    console.log("[Content Focus] Restore options.");
    const options = await browser.storage.local.get();

    document.querySelector("#focus").value = options.focus || '';
    document.querySelector("#matchers").value = options.matchers || '';
    document.querySelector("#exclusions").value = options.unless || '';
    document.querySelector("#click").value = options.click || '';
}

async function saveOptions(e) {
    console.log("[Content Focus] Save options.");
    e.preventDefault();
    await browser.storage.local.set({
        focus: document.querySelector("#focus").value,
        matchers: document.querySelector("#matchers").value.split(/\r?\n/),
        exclusions: document.querySelector("#exclusions").value.split(/\r?\n/),
        click: document.querySelector("#click").value.split(/\r?\n/)
    });
}
