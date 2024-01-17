'use strict';
/* global chrome  */
console.log(`❱❱ [messaging.mjs]`)

const Highway = {} // messaging wrapper
//--------------------------------------------------------------------------------------------------------------------//
// ContentScript methods.
//--------------------------------------------------------------------------------------------------------------------//

Highway.client = {}
Highway.client.what_is_my_tab_id=async() => {
    return await chrome.runtime.sendMessage({what_is_my_tab_id: true});
}

Highway.client.what_is_my_color = async ()=>{
    return await chrome.runtime.sendMessage({what_is_my_color: true});
}


//--------------------------------------------------------------------------------------------------------------------//
// SW methods
//--------------------------------------------------------------------------------------------------------------------//
// little
Highway.serviceWorker = {}
Highway.serviceWorker.start_listening_for_events = async () => {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        console.log("on Message Received ", request, sender)
        if (request.what_is_my_tab_id) {
            console.log(`what_is_my_tab_id:`, sender?.tab?.id ?? sender?.id)
            return sendResponse({tabId: sender?.tab?.id ?? sender?.id})
        }
    });

    console.log(`❱❱ ❱❱ [messaging.mjs] ֎ listening for events...`)
}


// check content/content.ui.event.mjs for corresponding handler of what comes next
Highway.serviceWorker.request_maximize_embedded_ui = async()=>{
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    console.log({tab})
    return await chrome.tabs.sendMessage(tab.id, {maximize_embedded_ui: true});
}

Highway.serviceWorker.request_minimize_embedded_ui = async()=>{
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    console.log({tab})
    return await chrome.tabs.sendMessage(tab.id, {minimize_embedded_ui: true});
}

Highway.serviceWorker.toggle_embedded_ui = async()=>{
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    console.log({tab})
    return await chrome.tabs.sendMessage(tab.id, {toggle_embedded_ui: true});
}

export {
    Highway
}