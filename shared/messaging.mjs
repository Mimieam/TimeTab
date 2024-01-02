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


export {
    Highway
}