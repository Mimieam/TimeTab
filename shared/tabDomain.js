import {hashThis} from "./utils.js";

export class DomainStats {
    constructor(url) {
        this.domainHash = new Map() 
        this.frequency = 0
    }
    save = async ()=>{
        await chrome.storage.local.set({
            [this.domainHash]: this,
        })
    }
    reHydrate = async  (hash)=>{
        const hashKey = `${hash}`
        const stats = (await chrome.storage.local.get(hashKey))[hashKey] || {}
    }
    recordMatchingDomain = ()=>{
    }
}