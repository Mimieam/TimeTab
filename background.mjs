// ES6 import works because SW manifest is defined as a native module.
import {Highway} from "./messaging.mjs"

// new Worker(new URL('messaging.mjs', import.meta.url), { type: 'module' })
console.log({Highway})
const TAB_NAVIGATION_EVENTS = [
    // 'onTabReplaced', 'onHistoryStateUpdated',
    // 'onCreatedNavigationTarget',
    // 'onBeforeNavigate',
    'onTabReplaced',
    'onCommitted',
]

const TAB_EVENTS = [
    'onCreated', 'onRemoved', 'onUpdated', 'onAttached', 'onDetached', 'onMoved'
]

async function webNavigationEventHandler(event, eventType) {
    const {frameType, tabId, processId, timeStamp, transitionType, transitionQualifiers} = event
    if (frameType === 'outermost_frame') {
        console.log(`\t⊛❱ ${transitionType} ❱❱ [eventHandler(${eventType})] ⇒`, event)
    }
}

async function tabEventHandler(event, eventType) {
    console.log(`\t⊛❱  ❱❱ [eventHandler(${eventType})] ⇒`, event)
}


// chrome.webNavigation['onCommitted'].addListener(console.log);

[...TAB_NAVIGATION_EVENTS].forEach(
    (eventType) => {
        chrome.webNavigation[eventType].addListener((event)=>webNavigationEventHandler(event, eventType))
    }
);

[...TAB_EVENTS].forEach(
    (eventType) => {
        chrome.tabs[eventType].addListener((event)=>tabEventHandler(event, eventType))
    }
)
