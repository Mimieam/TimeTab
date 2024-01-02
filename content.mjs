'use strict'; // redundant in mjs but old habits die hard

const importedModulePromises = [
    import('./content/content.main.mjs'),
];

Promise.all(importedModulePromises).then(
    async (modules) =>{
        console.log("ES6 modules imported.", modules)
    }
);
