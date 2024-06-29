document.querySelectorAll("form textarea").forEach(txa => {
    txa.addEventListener("blur", () => changelistener(txa));
})

async function changelistener(element) {
    const type = element.id
    const changed = await isChanged(type, element.value);
    const error = validate(element.value)
    element.title = error ?? '';
    element.style.borderColor = error ? "red" : (changed ? "var(--accent-hover)" : "var(--border)");
    element.style.borderStyle = error ? "dashed" : "solid";
}

async function isChanged(type, value) {
    const options = await browser.storage.local.get();
    const storedString = text(options, type);
    return storedString != value;
}

function validate(config) {
    const parsed = parse(config);
    const regexs = parsed.map(o => o.website);
    const errors = regexs.map(isRegex).filter(v => v);
    const message = "Errors\n" + errors.map(e => `${e.key} - ${e.message}`).join("\n")
    return errors.length ? message : undefined
}

function isRegex(regex) {
    try {
        "".match(regex)
        return undefined
    } catch (error) {
        return { key: regex, message: error?.message ?? "syntax error" }
    }
}

function resetChanged() {
    document.querySelectorAll("form textarea").forEach(changelistener)
}
