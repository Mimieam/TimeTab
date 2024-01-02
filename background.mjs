// ES6 import works because SW manifest is defined as a native module.
import { Highway } from "./shared/messaging.mjs"
import { TabStats } from "./shared/tabStats.js"

// new Worker(new URL('messaging.mjs', import.meta.url), { type: 'module' })
console.log({Highway})
Highway.serviceWorker.start_listening_for_events()

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
    switch (event.type) {
        case 'onCreated':
            const clientTab = new TabStats(event.id)
            clientTab.creationTimestamp = Date.now()
            await clientTab.save()
            break;
        case 'onRemoved':
            break;
        default:
            break;

    }
}

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


chrome.action.onClicked.addListener((tab) => {
    console.log('clicked', tab)
});

