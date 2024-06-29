document.addEventListener('DOMContentLoaded', displayOptions);
document.querySelector("form").addEventListener("reset", displayOptions);
document.querySelector("form").addEventListener("submit", saveOptions);

async function displayOptions() {
    const options = await browser.storage.local.get();
    display(options);
    resetChanged();
}

async function display(options) {
    console.debug("[Content Focus] Display options.", options);
    document.querySelector("#focus").value = text(options, "focus");
    document.querySelector("#click").value = text(options, "click");
    document.querySelector("#event").value = text(options, "event");
}

function text(config, field) {
    return Object
        .entries(config)
        .map(([k, v]) => textConfig(k, v, field))
        .filter(line => line.length)
        .join('\n')
}

function textConfig(k, v, field) {
    const website = k
    const selectors = v[field]
    return selectors ? [website, ...selectors].join(';') : '';
}

async function saveOptions(e) {
    console.debug("[Content Focus] Save options.");
    resetChanged();
    e.preventDefault();
    const config = parseConfig();
    await browser.storage.local.clear();
    await browser.storage.local.set(config);
    displayOptions();
}

function parseConfig() {
    const config = {};
    parse(document.querySelector("#focus").value).forEach(c => insert(config, c, "focus"));
    parse(document.querySelector("#click").value).forEach(c => insert(config, c, "click"));
    parse(document.querySelector("#event").value).forEach(c => insert(config, c, "event"));
    return config;
}

function parse(string) {
    return string
        .split(/\r?\n/)
        .filter(line => line.length)
        .map(parseLine)
}

function parseLine(line) {
    const split = line.split(";")
    const website = split[0];
    const selectors = split.slice(1);
    return ({ website: website, selectors: selectors });
}

function insert(config, parsed, field) {
    config[parsed.website] = config[parsed.website] ??= {};
    config[parsed.website][field] = parsed.selectors
}
