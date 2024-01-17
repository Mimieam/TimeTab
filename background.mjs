// ES6 import works because SW manifest is defined as a native module.
import { Highway } from "./shared/messaging.mjs"
import { TabStats } from "./shared/tabStats.js"
import { elapsedTime } from "./shared/utils.js"

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
   switch (eventType) {
    case 'onBeforeNavigate':
        const oldUrl = window.location.href
        console.log(`\t⊛❱ ${transitionType} ❱❱ [eventHandler(${eventType})] ⇒`, event)
        console.log({oldUrl})
        break;

    default:
        break;
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

const update_icon = async (tabId)=>{
    await CURRENT_TAB_STATS.reHydrate(tabId)
    chrome.action.setBadgeText({
        text: `${ elapsedTime(CURRENT_TAB_STATS.creationTimestamp, true, true)}`,
        // tabId: activeTab.id
    })
}
const CURRENT_TAB_STATS = new TabStats()
chrome.action.onClicked.addListener(async (tab) => {
    console.log('clicked', tab)
    await update_icon(tab.id)
    await Highway.serviceWorker.toggle_embedded_ui()
});

chrome.tabs.onActivated.addListener(async (tab)=>{
    console.log({tab})
    await update_icon(tab.tabId)
})


// while deving.. add declarativeNetRequest and uncomment bellow - kill all subframe when testing this with 500 pages rotating
// const RULEID = 999;
// chrome.declarativeNetRequest.updateSessionRules(
//   {
//     addRules: [{
//       "id": RULEID,
//       "priority": 1,
//       "action": {
//         "type": "block"
//       },
//       "condition": {
//         // "urlFilter": "<all_urls>",
//         "resourceTypes": [
//             "sub_frame",
//             "ping",
//         ]
//       }
//     }
//     ],
//     removeRuleIds: [RULEID]
//   },
// );