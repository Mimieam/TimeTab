'use strict';
console.log(`❱❱ [content.js]`)

const importedModulePromises = [
    import('./content.main.mjs'),
];

Promise.all(importedModulePromises).then(
    async (modules) =>{
        console.log("ES6 modules imported.", modules)
    }
);
