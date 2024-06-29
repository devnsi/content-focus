async function initializeContentFocus() {
    const elements = await opts.focusElements();
    await whenReady(elements)
    await executeActionOnElements(elements, hide)
}

async function executeAction(action) {
    const elements = await opts.focusElements()
    walkPath(elements, action);
}

async function executeActionOnElements(elements, action) {
    walkPath(elements, action);
}

function walkPath(elements, actionOnSiblings) {
    const keepers = elements.map(e => determinePath(e)).flat();
    elements.forEach(e => actionAlongPath(e, keepers, actionOnSiblings));
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

function actionAlongPath(element, unless, actionOnSiblings) {
    let currentElement = element;
    while (currentElement !== document.body) {
        const parent = currentElement.parentNode;
        const children = [...parent.children].filter(e => !unless.find(u => u == e));
        for (const element of children) {
            actionOnSiblings(parent, element);
        }
        currentElement = parent;
    }
}

function hide(_, element) {
    document.body.dataset.contentFocusState = "hidden"
    element.dataset.contentFocusTouched = true;
    element.style.display = "none";
}

function show() {
    document.body.dataset.contentFocusState = ""
    document.querySelectorAll('[data-content-focus-touched="true"]').forEach(e => {
        e.style.display = "revert"
    });
}

function toggle() {
    const isHidden = document.body.dataset.contentFocusState == "hidden"
    if (isHidden) {
        show();
    } else {
        executeAction(hide)
    }
}

async function resetContentFocus() {
    show()
    await initializeContentFocus();
}

initializeContentFocus();
