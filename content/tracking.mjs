import { debounce } from "../shared/utils.js"
import { isMinimized, updateUI } from "./content.ui.mjs"
//import {MiniReactivityFramework} from "./content.ui.helper.js";

// https://developer.chrome.com/docs/web-platform/page-lifecycle-api
console.log(`❱❱ [feature-tab-tracker]`)

const INTERACTIVE_EVENTS = [
    'click', //'mousedown', 'mouseup',
    'contextmenu',
    'scroll',
    'scrollend',
    'keypress',
    'mouseover'
]

const PAGE_EVENTS = [
    'beforeunload', 'pagehide', 'pageshow',
    'focus', 'blur', 'visibilitychange', 'resume',
    'load', 'unload', 'DOMContentLoaded', 'onreadystatechange'
]

// ⇝⇒֎⊛
let prevEvent = chrome.storage.local.get('prevEvent')['prevEvent'] || ''
let navigationType = chrome.storage.local.get('navigationType')['navigationType'] || ''
let interaction = await chrome.storage.local.get('interaction')['interaction'] || 0


// Create a debounced version of the mouseover handler
const debouncedMouseOver = debounce(async function (event, uiDiv, tabStats) {
    await updateUI(uiDiv, tabStats, event, tabStats.isUIMinimized)
}, 100); // Adjust the delay (in milliseconds) as needed

async function eventHandler(event, uiDiv, tabStats) {
    if (!chrome.runtime?.id) {
        return console.warn(`⊛❱ [eventHandler] ⇒`, 'no runtime id')
    }
   if (event.target?.id === 'ui-host'){ // to enable user-select in view
       return
   }
    let {type, timeStamp} = event

    // if (prevEvent !== event.type){
    //     console.log(`\t⊛❱ [eventHandler(${event.type})] ⇒`, timeStamp, prevEvent, interaction)
    // }

    switch (type) {
        case 'click':
        case 'contextmenu':
        case 'keypress':
        // case 'scroll':
        case 'scrollend':
            if (type === 'scrollend'){
                tabStats.recordInteraction('scroll')
            }else {
                tabStats.recordInteraction(type)
            }
            break;

        case "beforeunload":
            console.log('beforeunload 0=>', location.href, event)
            tabStats.recordCurrentURL(location.href)
            break;

        case "pageshow":
            tabStats.recordTabNavigation()
            await tabStats.save() // navigated back or forward
            if (event.persisted) {
                tabStats.recordInteraction('back')
                // console.log('This page *might* be entering the bfcache..');
            }
            // else {
            //     console.log('This page will unload normally and be discarded.');
            // }
            break;

        case 'visibilitychange':

            console.log('visibilitychange =>', document.visibilityState, event)
            if (document.visibilityState === 'hidden'){
                console.log("HIDDEN")
                tabStats.recordTabIsIdled()
            } else if (document.visibilityState === 'visible'){
                console.log("VISIBLE")
                tabStats.recordTabIsActive()
            }
            // navigator.sendBeacon - JS and its neverending surprising APIs :D
            break;

        // case 'pagehide':
        //     if (event.persisted) {
        //         console.log('frozen');
        //         // tabStats.recordInteraction('back')
        //         } else {
        //         console.log('terminated');
        //     }
        //     break;
        case 'resume':
            console.log('resume =>', event)
            break;

        // case 'mouseover':
        //     // Debounce the mouseover event with a delay of 500 milliseconds (adjust as needed)

        //     break;
        default:
            break;
    }

    prevEvent = event.type
    await chrome.storage.local.set({prevEvent})
    await chrome.storage.local.set({interaction})
    await tabStats.save()

    // console.log(`\t⊛❱ [eventHandler(${event.type})]`)
    if (type === 'mouseover') {
        debouncedMouseOver(event, uiDiv, tabStats);
        // debounce(updateUI, 500); // Adjust the delay (in milliseconds) as needed
    } else {
        updateUI(uiDiv, tabStats, event, tabStats.isUIMinimized);
    }
    // updateUI(uiDiv, tabStats, isMinimized(uiDiv))
}


async function setupEvents (uiDiv, tabStats) {
    window.activeEventHandler = (event) => eventHandler(event, uiDiv, tabStats);

    [...INTERACTIVE_EVENTS, ...PAGE_EVENTS].forEach(
        (eventType) => window.addEventListener(eventType, window.activeEventHandler, true)
    );
    return true;
}

  export {
    setupEvents,
}