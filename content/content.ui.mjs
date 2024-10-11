'use strict';

import { elapsedTime, msToTime, trimTimeString } from '../shared/utils.js';
// import cssModule from './content.ui.module.css';

export function createElement(tag, attributes = {}, classes = []) {
    const element = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
    });
    element.classList.add(...classes);
    return element;
}

export async function setupUI(divId = 'ui', tabStats) {

    // const cssModule = await import('./content.ui.module.css', {assert: {type: 'css'}});  // this is now deprecated... 
    const cssModule = await import('./content.ui.module.css', {with: {type: 'css'}});

    const sheet = new CSSStyleSheet();
    await sheet.replace('@import url("myStyle.css")')
    // .then(sheet => {
    //     console.log('Styles loaded successfully');
    // })
    // .catch(err => {
    //     console.error('Failed to load:', err);
    // });

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
    // host.shadowRoot.adoptedStyleSheets = [sheet]

    ui.id = divId

    ui.appendChild(header)
    ui.appendChild(headerText)
    ui.appendChild(content)

    // adding a link back to the ui obj... not really needed but easy syntax sugar
    ui.header = header
    ui.header.innerHTML = `<input type="button" value="⇲" class="">`
    ui.header.querySelector('input').onclick = function () {
        // console.log('onClick')
        // return onMinimize(ui, tabStats)
    }
    renderHeader(ui, tabStats)

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
    // if (el.content.style.display === "none") {
        // el.content.style.display = "block";
        // el.header.querySelector('input').value = '⇲'
    // } else {
        el.content.style.display = "none";
        el.header.querySelector('input').value = '⇱'
    // }
}

export function onMaximize(ui, tabStats) {
        ui.content.style.display = "block";
        ui.header.querySelector('input').value = '⇲'
}
export function isMinimized(ui){
    const _isMinimized = ui.header.querySelector('input').value === '⇱'
    // console.log(`⊛❱ [isMinimized] = ${_isMinimized}`)
    return _isMinimized
}

export function renderContent(ui, tabStats, minimized=null){
    // console.log(`⊛❱ - [renderContent](minimized=${minimized} && ${tabStats.isUIMinimized})`)

    if (minimized == null) {
        minimized = isMinimized(ui) // get current state
    }

    if (minimized) {
        ui.content.style.display = "none";
        ui.header.querySelector('input').value = '⇱'
        ui.headerText.style.display = "block";
        ui.headerText.innerText = elapsedTime(tabStats?.timeOnCurrentPage, true) //update the headerText when ext is minified
        ui.style.display = "inline-flex";
        ui.style.flexFlow = "row";
        ui.style.alignItems = "center";
    } else {
        ui.style.display = "block";
        ui.content.style.display = "block";
        ui.headerText.style.display = "none";
        ui.header.querySelector('input').value = '⇲'

        ui.content.innerHTML = `
            <p class='yellowMe'>Tab #[${tabStats.tabId}]:</p>
            So far on this tab we've...
            <ul>
                <li>visited ${tabStats.urlCounts} unique urls</li>
                <li>had ${tabStats.interactions} page interactions</li>
            </ul>

            <p class='yellowMe'>Types of interactions:</p>
            <ul>
                ${Object.entries(tabStats.interactionTypes).sort((a,b)=> b[1] - a[1]).map((interactionType) => {
                    return `<li>${interactionType[0]}: ${interactionType[1]}</li>`
                }).join('')}
            </ul>

            <hr class='gradient'>
            <p class='yellowMe'>Time stats:</p>
            <p>Tab opened: <strong> ${elapsedTime(tabStats.creationTimestamp)}. </strong></p>
            <p>Last interaction: ${elapsedTime(tabStats.lastInteraction)}.</p>
            <p>Time on current page: <strong>${elapsedTime(tabStats.timeOnCurrentPage)}.</strong></p>
            <p>Idle Time: <strong>${trimTimeString(msToTime(tabStats.totalIdleTime))}.</strong></p>
        `
    }
}

export function renderHeader(ui, tabStats){
    ui.header.innerHTML = `<input type="button" value="⇲">`
    ui.header.toggleBtn = ui.header.querySelector('input')
    // console.log(ui.header.toggleBtn)
    ui.header.toggleBtn.onclick = function () {
        // console.log(`⊛❱ - [renderHeader] - toggleBtn.onclick`)
        return toggleExtDisplay(ui, tabStats)
    }
}

export function toggleExtDisplay(ui, tabStats){
    const _minimize = !isMinimized(ui)
    tabStats.recordUIState(_minimize)
    renderContent(ui, tabStats, _minimize)
    return _minimize
}

export async function updateUI(ui, tabStats, event, minimized=null) {
//    console.log(`⊛❱ - [updateUI](event=${event.type}, minimized=${minimized})`)

    // ui.headerText.innerHTML = `...`
    renderContent(ui, tabStats, minimized)


}