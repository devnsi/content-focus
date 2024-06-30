initializeContentFocus();

function initializeContentFocus() {
    show();
    hide();
}

async function hide() {
    const elements = await opts.focusElements();
    hideElements(elements)
}

function hideElements(elements) {
    console.debug("[Content Focus] Hide elements besides", elements);
    document.body.dataset.contentFocusState = "hidden";
    const keep = elements.map(e => determinePath(e)).flat();
    keep.forEach(showElement);
    elements.forEach(e => hideAlongPath(e, keep));
}

function determinePath(element) {
    const path = [element];
    let currentElement = element;
    while (currentElement !== document.body) {
        currentElement = currentElement.parentNode;
        path.push(currentElement);
    }
    return path;
}

function hideAlongPath(element, keep) {
    let currentElement = element;
    while (currentElement !== document.body) {
        const parent = currentElement.parentNode;
        const children = [...parent.children].filter(e => !keep.find(u => u == e));
        for (const element of children) {
            hideElement(element);
        }
        currentElement = parent;
    }
}

function hideElement(element) {
    if (getComputedStyle(element).display != "none") {
        element.dataset.contentFocusTouched = true;
        element.style.display = "none";
    }
}

function show() {
    console.debug("[Content Focus] Show all elements.");
    document.body.dataset.contentFocusState = "";
    document.querySelectorAll('[data-content-focus-touched="true"]').forEach(showElement);
}

function showElement(element) {
    if (element.dataset.contentFocusTouched == "true") {
        element.style.display = "revert";
    }
}

function toggle() {
    const isHidden = document.body.dataset.contentFocusState == "hidden";
    (isHidden ? show : hide)();
}
