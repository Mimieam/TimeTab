import { Highway } from "./messaging.mjs"
import { TabStats } from "./tabStats.js"
import { setupUI, updateUI } from "./content.ui.mjs"
//import {MiniReactivityFramework} from "./content.ui.helper.js";

// https://developer.chrome.com/docs/web-platform/page-lifecycle-api
console.log(`❱❱ [feature-tab-tracker]`)

const { tabId } = await Highway.client.what_is_my_tab_id()
const tabStats = new TabStats(tabId);
await tabStats.reHydrate(tabId)
tabStats.recordTabNavigation()  // initial load/reload
const uiDiv = await setupUI()
//const mrf= new MiniReactivityFramework(tabStats)
updateUI(uiDiv, tabStats, true)
//console.log({mrf})

const INTERACTIVE_EVENTS = [
    'click', //'mousedown', 'mouseup',
    'contextmenu',
    'scroll',
    'scrollend', 'keypress',
     'mouseover'
]

const PAGE_EVENTS = [
    'beforeunload', 'pagehide', 'pageshow',
    'focus', 'blur', 'visibilitychange', 'resume',
    'load', 'unload', 'DOMContentLoaded', 'onreadystatechange'
]

const getCurrentDOMState = () => {
    if (document.visibilityState === 'hidden') return 'hidden';
    if (document.hasFocus()) return 'active';
    return 'passive';
  };

let state = getCurrentDOMState();

// ⇝⇒֎⊛
let prevEvent = chrome.storage.local.get('prevEvent')['prevEvent'] || ''
let navigationType = chrome.storage.local.get('navigationType')['navigationType'] || ''
let interaction = await chrome.storage.local.get('interaction')['interaction'] || 0


// document.onreadystatechange  = () => {
//     console.log(`⊛❱ [onreadystatechange] ⇒`, document.readyState)
// }

async function eventHandler(event) {
    if (!chrome.runtime?.id) {
        return console.warn(`⊛❱ [eventHandler] ⇒`, 'no runtime id')
    }
    let {type, timeStamp} = event

    if (prevEvent !== event.type){
        console.log(`\t⊛❱ [eventHandler(${event.type})] ⇒`, timeStamp, prevEvent, interaction)
    }

    switch (type) {
        case 'click':
        case 'contextmenu':
        case 'keypress':
        case 'scroll':
        case 'scrollend':
            tabStats.recordInteraction(type)
            break;

        case "beforeunload":
            break;

        case "pageshow":
            tabStats.recordTabNavigation()
            await tabStats.save() // navigated back or forward
            if (event.persisted) {
                console.log('This page *might* be entering the bfcache..');
            } else {
                console.log('This page will unload normally and be discarded.');
            }
            break;

        case 'visibilitychange':
            tabStats.recordTabIsActive()
            break;

        case 'pagehide':
            if (event.persisted) {
                console.log('frozen');
                } else {
                console.log('terminated');
            }
            break;
        default:
            break;
    }

    prevEvent = event.type
    await chrome.storage.local.set({prevEvent})
    await chrome.storage.local.set({interaction})
    await tabStats.save()
    updateUI(uiDiv, tabStats)
}

async function setupEvents () {
    [...INTERACTIVE_EVENTS, ...PAGE_EVENTS].forEach(
        (eventType) => window.addEventListener(eventType, eventHandler, true)
    );
    return true;
}

  export {
    setupEvents,
}