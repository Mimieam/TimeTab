'use strict';

console.log(`❱❱ [messaging.mjs]`)

const Highway = {} // messaging wrapper
//--------------------------------------------------------------------------------------------------------------------//
// ContentScript methods.
//--------------------------------------------------------------------------------------------------------------------//

Highway.client = {}
Highway.client.what_is_my_name=async() => {
    return await chrome.runtime.sendMessage({what_is_my_name: true});
}

Highway.client.what_is_my_color = async ()=>{
    return await chrome.runtime.sendMessage({what_is_my_color: true});
}

//--------------------------------------------------------------------------------------------------------------------//
// SW methods
//--------------------------------------------------------------------------------------------------------------------//
Highway.serviceWorker = {}
Highway.serviceWorker.start_listening_for_events = async () => {
    chrome.runtime.onMessage.addListener(
        (request, sender, sendResponse) => {
            if (request.what_is_my_tab_id) sendResponse({tabId: sender?.tab?.id ?? sender?.id});
        }
    );
}

export {
    Highway
}