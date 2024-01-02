'use strict';

import { setupEvents } from './tracking.mjs'

async function initialize() {
    console.log('Initializing TabStats')
    await setupEvents()
    console.log('Initialized')
}

await initialize();