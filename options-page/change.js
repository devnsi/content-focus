document.querySelectorAll("form textarea").forEach(txa => {
    txa.addEventListener("blur", () => changelistener(txa));
})

async function changelistener(element) {
    const type = element.id
    const changed = await isChanged(type, element.value);
    const color = changed ? "var(--accent-hover)" : "var(--border)";
    element.style.borderColor = color;
}

async function isChanged(type, value) {
    const options = await browser.storage.local.get();
    const storedString = text(options, type);
    return storedString != value;
}

function resetChanged() {
    document.querySelectorAll("form textarea").forEach(changelistener)
}
