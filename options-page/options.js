document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);

async function restoreOptions() {
    console.log("[Content Focus] Restore options.");
    let res = await browser.storage.local.get('focus');
    document.querySelector("#focus").value = res.focus || '';
}

async function saveOptions(e) {
    console.log("[Content Focus] Save options.");
    e.preventDefault();
    await browser.storage.local.set({
        focus: document.querySelector("#focus").value
    });
}
