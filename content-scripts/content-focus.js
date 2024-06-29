async function initializeContentFocus() {
    const reqs = await opts.matchers()
    await whenReady(reqs)
    await executeAction(hide)
}

async function executeAction(action) {
    const element = await match()
    const unless = await opts.unless()
    walkToRoot(element, unless, action);
}

function walkToRoot(element, unless, actionOnSiblings) {
    let currentElement = element
    while (currentElement !== document.body) {
        const parent = currentElement.parentNode;
        const children = [...parent.children].filter(e => !unless.some(u => e.matches(u)));
        for (const element of children) {
            if (currentElement !== element) {
                actionOnSiblings(parent, element);
            }
        }
        currentElement = parent;
    }
    return currentElement;
}

function remove(parent, element) {
    parent.removeChild(element)
}

function hide(_, element) {
    document.body.dataset.contentFocusState = "hidden"
    element.dataset.contentFocusTouched = true;
    element.style.display = "none";
}

function show(_, element) {
    document.body.dataset.contentFocusState = ""
    if (element.dataset.contentFocusTouched) {
        element.style.display = "revert";
    }
}

function toggle(_, element) {
    const isHidden = document.body.dataset.contentFocusState == "hidden"
    return isHidden ? show : hide
}

initializeContentFocus();
