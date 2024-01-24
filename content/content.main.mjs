'use strict';
import { Highway } from "../shared/messaging.mjs"
import { TabStats } from "../shared/tabStats.js"
import { setupUI, updateUI } from "./content.ui.mjs"
import { setupEvents as setupTrackingEvents} from './tracking.mjs'
import { setupMessagingEvents } from './content.ui.event.mjs'

async function initialize() {
    // let fontRegular = new FontFace("GlacialIndifference", `url('chrome-extension://${chrome.runtime.id}/assets/fonts/GlacialIndifference-regular-webfont.woff')`, {
    //     style: "normal",
    //     weight: "normal",
    // });
    // let fontBold = new FontFace("GlacialIndifference", `url('chrome-extension://${chrome.runtime.id}/assets/fonts/GlacialIndifference-bold-webfont.woff')`, {
    //     style: "normal",
    //     weight: "bold",
    // });

    // document.fonts.add(fontRegular);
    // document.fonts.add(fontBold);


    const { tabId } = await Highway.client.what_is_my_tab_id()
    const tabStats = new TabStats(tabId);
    await tabStats.reHydrate(tabId)
    console.log(`Initializing TabStats[${tabId}]`)
    tabStats.recordTabNavigation()  // initial load/reload
    const uiDiv = await setupUI('ui', tabStats)
    console.log('setupUI() called')
    updateUI(uiDiv, tabStats, {}, tabStats.isUIMinimized)
    console.log('updateUI() called')
    //const mrf= new MiniReactivityFramework(tabStats)
    // console.log({mrf})
    await setupTrackingEvents(uiDiv, tabStats)
    console.log('setupTrackingEvents() called')
    await setupMessagingEvents(uiDiv, tabStats)
    console.log('setupMessagingEvents() called')
}

await initialize();