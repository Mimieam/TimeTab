import {hashThis} from "./utils.js";

export class TabStats {
    constructor(tabId){
        this.tabId = tabId
        this.interactions = 0
        this.interactionTypes = {}
        this.urlCounts = 0
        this.creationTimestamp = null // set by the SW directly in localStorage on Tab creation.
        this.timeOnCurrentPage = null
        this.totalIdleTime = null
        this.idleStartTime = null
        this.foregroundCount = null
        this.lastInteraction = null
        this.hashList = new Set()
        this.pages = []
        this.pageHistory = []
        this.navigationPreviousEntry = 0
        // this.navigationStack = {
        //     pageHistory:[],
        //     forwardStack: [],
        //     backStack: [],
        // }
        this.isUIMinimized = null
    }

    async save() {
        // TODO: improve this by saving all under 1 key and not one for each tab
        await chrome.storage.local.set({
            [this.tabId]: {
                ...this,
                hashList: Array.from(this.hashList),
                navigationPreviousEntry: {
                    id: this.navigationPreviousEntry?.id,
                    index: this.navigationPreviousEntry?.index,
                    key: this.navigationPreviousEntry?.key,
                    ondispose: this.navigationPreviousEntry?.ondispose,
                    sameDocument: this.navigationPreviousEntry?.sameDocument,
                    url: this.navigationPreviousEntry?.url,
                }
            },
        })
    }

    async reHydrate(tabId) {
        const tabIdKey = `${tabId}`
        const stats = (await chrome.storage.local.get(tabIdKey))[tabIdKey] || {}
        this.interactions = stats?.interactions || 0
        this.creationTimestamp = stats?.creationTimestamp || performance.timeOrigin // fallback if for whatever reason SW didn't set it.
        this.urlCounts = stats?.urlCounts ||0
        this.timeOnCurrentPage = stats?.timeOnCurrentPage || 0
        this.foregroundCount = stats?.foregroundCount || 0
        this.lastInteraction = stats?.lastInteraction || null
        this.interactionTypes = stats?.interactionTypes || {}
        this.totalIdleTime = stats?.totalIdleTime || 0
        this.idleStartTime = stats?.idleStartTime || 0
        this.hashList = new Set(Array.from(stats?.hashList || []))
    //    console.log({stats})
        this.tabId = tabId
        this.pages = stats?.pages || []
        this.pageHistory = stats?.pageHistory || []
        this.navigationPreviousEntry = stats?.navigationPreviousEntry || {}
        // this.navigationStack = stats?.navigationStack || {
        //     pageHistory:[],
        //     forwardStack: [],
        //     backStack: [],
        // }
        this.isUIMinimized = stats?.isUIMinimized !==(null||undefined) ? stats.isUIMinimized : true
        // console.log('isUIMinimized = ',stats?.isUIMinimized, this.isUIMinimized)
        return this
    }

    recordInteraction = function(typeName){
        this.interactions += 1
        this.lastInteraction = Date.now()

        if (this.interactionTypes[typeName]) {
            this.interactionTypes[typeName] += 1
        } else {
            this.interactionTypes[typeName] = 1
        }
    }

    recordCurrentURL = function(url){
        this.pageHistory = url
        this.navigationPreviousEntry = navigation.currentEntry
    }

    recordTabNavigation = function() {
        this._hasNavigatedToNewLocation()

        this.timeOnCurrentPage = performance.timeOrigin
        const [navigationEntry] = performance.getEntriesByType('navigation') ;
        const navigationType = navigationEntry.type;

        if (navigationType === 'back_forward') {
            this.recordInteraction('back/forward')
            this._handleNavigation()
        } else {
            this.recordInteraction(navigationType)
        }
    }

    recordTabIsActive = function() {
        this.foregroundCount += 1
        this.recordInteraction('foreground')

        this.totalIdleTime += (Date.now() - this.idleStartTime)
        this.idleStartTime = null
    }
    recordTabIsIdled = function() {
        this.idleStartTime = Date.now()
    }

    recordUIState = function(isMinimied) {
        this.isUIMinimized = isMinimied
        this.save()  // the exception, not the rule - avoid doing this here
    }

    _hasNavigatedToNewLocation = function() {
        const url = window.location.origin + window.location.pathname
        const hash = hashThis(url)
        if (!this.hashList.has(hash)){
            this.hashList.add(hash)
            this.urlCounts += 1
        }
    }

    _handleNavigation = function() {
    // giving up on this after 4th attemps... figuring out a consistent way
    // to distinguish between back and forth navigation is kinda insane
    // navigation.canGoBack and canGoForward are not always consistent IMO
    // nagivation.entries() doesn't always have the full history stack of a page.
    if (!navigation.canGoBack){
        //chrome blank page... the script can''t run on this so we mock that and assume it did before moving to the current page..
        this.navigationPreviousEntry = {
            id: -1,
            index: -1,
            key: -1,
            url: ''
        }
        // console.log("<<<< Comming from BLANK PAGE >>>>");
    }
    if (!navigation.canGoForward || navigation.currentEntry.index > this.navigationPreviousEntry?.index) {
    //   console.log("===>>>> FORWARD BUTTON");
    } else if (!navigation.canGoBack || navigation.currentEntry.index < this.navigationPreviousEntry?.index) {
    //   console.log("===<<<< BACK BUTTON");
    }

    this.navigationPreviousEntry = navigation.currentEntry
    }
}

// TODO: add reporting by domain accross all session in a popup maybe?
class TimeStatsManager {
}

globalThis.TabStats = TabStats

export default {
    TabStats,
}

