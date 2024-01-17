import { updateUI, isMinimized, toggleExtDisplay } from "./content.ui.mjs"

const SW_MESSAGE_EVENTS = {
    maximize_embedded_ui: "maximize_embedded_ui",
    minimize_embedded_ui: "minimize_embedded_ui",
    toggle_embedded_ui: "toggle_embedded_ui",
}

export const setupMessagingEvents = (uiDiv, tabStats)=>{
    chrome.runtime.onMessage.addListener((message, sender, sendResponse)=>{
        console.log({message, sender, uiDiv, tabStats})
        const [event_name, ..._] = Object.keys(message)
        switch(event_name){
            case SW_MESSAGE_EVENTS.toggle_embedded_ui:
                console.log("toggle_embedded_ui")
                toggleExtDisplay(uiDiv, tabStats)
                // updateUI(uiDiv, tabStats, {type: 'msgEvent'}, !isMinimized(uiDiv))
                break;
        }
    })
}