'use strict';

export function createElement(tag, attributes = {}, classes = []) {
    const element = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
    });
    element.classList.add(...classes);
    return element;
}

export async function setupUI(divId = 'ui') {

    const cssModule = await import('./content.ui.module.css', {assert: {type: 'css'}});

    const ui = createElement("div", {}, ["tabStats"])
    const header = createElement("div", {}, ["header"])
    const headerText = createElement("div", {}, ["headerText"])
    const content = createElement("div", {}, ["content"])
    const host = document.createElement('span');
    host.id = 'ui-host'
    host.appendChild(ui)
    host.attachShadow({mode: 'open'});
    document.body.appendChild(host)
    host.shadowRoot.adoptedStyleSheets = [cssModule.default]

    ui.id = divId

    ui.appendChild(header)
    ui.appendChild(headerText)
    ui.appendChild(content)

    // adding a link back to the ui obj... not really needed but easy syntax sugar
    ui.header = header
    ui.headerText = headerText
    ui.content = content
    host.shadowRoot.appendChild(ui)
    setupUIevents(ui)
//    setDragAndDropEvents(ui)
    return ui
}

async function setupUIevents(ui) {
    document.onclick = (event) => {
        if (event.target === document.querySelector('#ui-host').shadowRoot.querySelector('.tabStats > input')) {
            console.log("You trying to close something???")
        }
    }
}

export function onMinimize(el, tabStats) {
    if (el.content.style.display === "none") {
        el.content.style.display = "block";
        el.header.querySelector('input').value = '⇲'
    } else {
        el.content.style.display = "none";
        el.header.querySelector('input').value = '⇱'
    }
}

function msToTime(ms) {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));

    if (days > 0) {
        if (hours > 0) {
            return `${days} day${days > 1 ? 's' : ''} and ${hours} hr${hours > 1 ? 's' : ''} ago`;
        }
        return `${days} day${days > 1 ? 's' : ''} ago`;
    }

    if (hours > 0) {
        if (minutes > 0) {
            return `${hours} hr${hours > 1 ? 's' : ''} and ${minutes} min${minutes > 1 ? 's' : ''} ago`;
        }
        return `${hours} hr${hours > 1 ? 's' : ''} ago`;
    }

    if (minutes > 0) {
        if (seconds > 0) {
            return `${minutes} min${minutes > 1 ? 's' : ''} and ${seconds} sec${seconds > 1 ? 's' : ''} ago`;
        }
        return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    }

    if (seconds > 0) {
        return `${seconds} sec${seconds > 1 ? 's' : ''} ago`;
    }

    return '...';
}

function trimTimeString(_str) {
    return _str.replaceAll(' ', '')
        .replaceAll('and', '').replaceAll('ago', '')
        .replace('days', 'd ').replace('day', 'd ')
        .replace('hrs', 'h').replace('hr', 'h')
        .replace('mins', 'm').replace('min', 'm')
        .replace('secs', 's').replace('sec', 's')

}

function elapsedTime(lastTime, minimized = false) {
    if (!lastTime){
        return null
    }
    const now = Date.now();
    const elapsed = now - lastTime;
    const timeString = msToTime(elapsed);
    return minimized ? trimTimeString(timeString) : timeString
}

export function updateUI(ui, tabStats, update_container = false) {
//    console.log(`⊛❱ [updateUI]()`)
    const fn = function () {
        return onMinimize(ui, tabStats)
    }
    if (update_container) {
        ui.headerText.innerHTML = `...`
        ui.header.innerHTML = `<input type="button" value="⇲" class="minimize-btn">`
        ui.header.querySelector('input').onclick = fn
        // to start minimized use the 2 lines bellow
        ui.content.style.display = "none";
        ui.header.querySelector('input').value = '⇱'
    }

    if (ui.content.style.display !== "none") {
        ui.headerText.style.display = "none";
        ui.style.display = "block";
    } else {
        ui.headerText.style.display = "block";
        ui.headerText.innerText = elapsedTime(tabStats.timeOnCurrentPage, true) //update the headerText when ext is minified
        ui.style.display = "inline-flex";
        ui.style.flexFlow = "row";
        ui.style.alignItems = "center";
    }

    ui.content.innerHTML = `
        <p>On this browser tab (${tabStats.tabId}), the following activities took place:</p>

        <p>${tabStats.urlCounts} URLs opened so far.</p>
        <p>Total interactions: ${tabStats.interactions}.</p>

        <p>Types of interactions:</p>
        <ul>
            ${Object.entries(tabStats.interactionTypes).map((interactionType) => {
                return `<li>${interactionType[0]}: ${interactionType[1]}</li>`;
            }).join('')}
        </ul>

        <hr>
        <p>Additional Information:</p>
        <p>Tab was first opened: <strong> ${elapsedTime(tabStats.creationTimestamp)}. </strong></p>
        <p>Time elapsed since last interaction: ${elapsedTime(tabStats.lastInteraction)}.</p>
        <p>Time spent on current page: <strong>${elapsedTime(tabStats.timeOnCurrentPage)}.</strong></p>

    `
}