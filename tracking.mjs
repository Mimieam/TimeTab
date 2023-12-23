// loader.js
// https://developer.chrome.com/docs/web-platform/page-lifecycle-api
console.log(`❱❱ ❱❱ [featureTracking.mjs]`)
console.log(`❱❱ - Page Time Tracker Loaded`)


const INTERACTIVE_EVENTS = [
    'click',
    // 'mousedown', 'mouseup',
    'contextmenu',
    'scroll', 'keypress',
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

// Accepts a next state and, if there's been a state change, logs the
// change to the console. It also updates the `state` value defined above.
let prevState = ''
const logStateChange = (nextState) => {
  const prevState = state;
  if (nextState !== prevState) {
    console.log(`State change: ${prevState} >>> ${nextState}`);
    state = nextState;
  }
};

// ⇝⇒֎⊛
let prevEvent = chrome.storage.local.get('prevEvent')['prevEvent'] || ''
let navigationType = chrome.storage.local.get('navigationType')['navigationType'] || ''
let interaction = await chrome.storage.local.get('interaction')['interaction'] || 0


// document.onreadystatechange  = () => {
//     console.log(`⊛❱ [onreadystatechange] ⇒`, document.readyState)
// }

async function eventHandler(event) {

    let {type, timeStamp} = event

    if (prevEvent !== event.type){
        console.log(`\t⊛❱ [eventHandler(${event.type})] ⇒`, timeStamp, prevEvent, interaction)
    }

    switch (type) {
        case 'click':
        case 'contextmenu':
        case 'keypress':
        case 'scroll':
            interaction += 1
            break;

        case "beforeunload":
            break;

        case "pageshow":
            if (event.persisted) {
                console.log('This page *might* be entering the bfcache..');
                } else {
                console.log('This page will unload normally and be discarded.');
            }
            break;

        case 'visibilitychange':
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
}




async function setupEvents () {
    [...INTERACTIVE_EVENTS, ...PAGE_EVENTS].forEach(
        (eventType) => window.addEventListener(eventType, eventHandler, {capture: true})
    );
    return true;
}

async function displayTabOpenedTime() {
    const currentTime = new Date().getTime();
    const tabId = window.performance.timing.navigationStart;
    const timeSinceLoad = currentTime - tabId;

    alert(`This tab was opened ${timeSinceLoad} milliseconds ago.`);
    document.addEventListener('DOMContentLoaded', onPageLoad, false);
    return true
}


// // Options used for all event listeners.
// const opts = {capture: true};


// // `${performance.now()} - ${Date.now() - performance.timing.navigationStart}`
// //   chrome.runtime.onSuspend.addListener(()=>{
// //     console.log('❰❰ ❰❰ Suspended')
// //   })

// // window.addEventListener('locationchange', function () {
// //     console.log('location changed!');
// // }, opts);

// // window.addEventListener('beforeunload', function () {
// //     // delete sessionStorage[Highway.client_port_name]
// //     console.log("beforeunload")
// //     // sessionStorage['recoScriptCounter'] -= 1
// // }, opts)

// // window.addEventListener('unload', function () {
// //     // delete sessionStorage[Highway.client_port_name]
// //     console.log("unload")
// //     // sessionStorage['recoScriptCounter'] -= 1
// // })

// // window.addEventListener('navigate', function () {
// //     // delete sessionStorage[Highway.client_port_name]
// //     console.log("navigate")
// //     // sessionStorage['recoScriptCounter'] -= 1
// // })

// // window.addEventListener('popstate', function (event) {
// // 	// Log the state data to the console
// // 	console.log('popstate', event.state);
// // }, opts);

// // window.onload = (ev => {
// //     console.log('page loading event = ', ev)
// //     // const [navigationEntry] = window.performance.getEntriesByType('navigation') ;
// //     // const navigationType = navigationEntry.type;
// //     // console.log({navigationType})
// //     const navigationEntry = window.performance.getEntriesByType('navigation')[0];
// //     const navigationType = navigationEntry.type;

// //     const isPageReload = navigationType === 'reload';
// //     const isNavigation = navigationType === 'navigate';
// //     const isBackForwarad = navigationType === 'back_forward';
// //     const isPrerender = navigationType === 'prerender';
// //     console.log({navigationType})
// // }, opts)

// window.addEventListener('pageshow', (event) => {
//     if (event.persisted) {
//         console.log('This page *might* be entering the bfcache..');
//         } else {
//         console.log('This page will unload normally and be discarded.');
//         }
// }, opts)






// //   // Stores the initial state using the `getState()` function (defined above).
// // let state = getState();

// // // Accepts a next state and, if there's been a state change, logs the
// // // change to the console. It also updates the `state` value defined above.
// // const logStateChange = (nextState) => {
// //   const prevState = state;
// //   if (nextState !== prevState) {
// //     console.log(`State change: ${prevState} >>> ${nextState}`);
// //     state = nextState;
// //   }
// // };


// // These lifecycle events can all use the same listener to observe state
// // changes (they call the `getState()` function to determine the next state).
// ['pageshow', 'focus', 'blur', 'visibilitychange', 'resume'].forEach((type) => {
//   window.addEventListener(type, () => logStateChange(getState(), opts))
// });

// // The next two listeners, on the other hand, can determine the next
// // state from the event itself.
// window.addEventListener('freeze', () => {
//   // In the freeze event, the next state is always frozen.
//   logStateChange('frozen');
// }, opts);

// window.addEventListener('pagehide', (event) => {
//   // If the event's persisted property is `true` the page is about
//   // to enter the back/forward cache, which is also in the frozen state.
//   // If the event's persisted property is not `true` the page is
//   // about to be unloaded.
//   logStateChange(event.persisted ? 'frozen' : 'terminated');
//   if (!event.persisted){
//     console.log('>>> Unloading page')
//   }
// }, opts);




  console.log(`❰❰ [featureTracking.mjs]`)
  export {
    setupEvents,
    displayTabOpenedTime
}