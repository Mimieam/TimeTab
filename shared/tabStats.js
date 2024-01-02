import {hashThis} from "./utils.js";

export class TabStats {
    constructor(tabId){
        this.tabId = tabId
        this.interactions = 0
        this.interactionTypes = {}
        this.urlCounts = 0
        this.creationTimestamp = null // set by the SW directly in localStorage on Tab creation.
        this.timeOnCurrentPage = null
        this.idleTime = null
        this.foregroundCount = null
        this.lastInteraction = null
        this.hashList = new Set()
    }

    async save() {
        // TODO: improve this by saving all under 1 key and not one for each tab
        await chrome.storage.local.set({
            [this.tabId]: {...this, hashList: Array.from(this.hashList)},
        })
//        console.log(this)
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
        this.hashList = new Set(Array.from(stats?.hashList || []))
//        console.log(this)
        this.tabId = tabId
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

    recordTabNavigation = function() {
//        this.urlCounts += 1
        this._hasNavigatedToNewLocation()
//        window.location.origin + window.location.pathname
        this.timeOnCurrentPage = performance.timeOrigin
        const [navigationEntry] = performance.getEntriesByType('navigation') ;
        const navigationType = navigationEntry.type;
        this.recordInteraction(navigationType)
    }

    recordTabIsActive = function() {
        this.foregroundCount += 1
        this.recordInteraction('foreground')
    }

    _hasNavigatedToNewLocation = function() {
        const url = window.location.origin + window.location.pathname
        const hash = hashThis(url)
        if (!this.hashList.has(hash)){
            this.hashList.add(hash)
            this.urlCounts += 1
        }
    }
}

class TimeStatsManager {
}

globalThis.TabStats = TabStats

export default {
    TabStats,
}