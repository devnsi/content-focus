document.querySelector("#export").addEventListener("click", exportOptions);
document.querySelector("#import").addEventListener("click", importOptions);

async function exportOptions(e) {
    console.debug("[Content Focus] Export options.");
    e.preventDefault();
    const options = await browser.storage.local.get();
    const json = JSON.stringify(options, null, 2);
    navigator.clipboard.writeText(json);
    document.querySelector("#export").textContent = "Saved to clipboard!"
    setTimeout(() => document.querySelector("#export").textContent = "Export", 2000);
}

async function importOptions(e) {
    console.debug("[Content Focus] Import options.");
    e.preventDefault();
    const config = window.prompt("Enter configuration", "");
    if (!config) return;
    const json = JSON.parse(config);
    display(json);
    resetChanged();
    document.querySelector("#import").textContent = "Imported, check and save!"
    setTimeout(() => document.querySelector("#import").textContent = "Import", 4000);
}
