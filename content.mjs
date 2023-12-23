'use strict';
console.log(`❱❱ [content.js]`)

const importedModulePromises = [
    import('./loader.mjs'),
    import('./tracking.mjs'),
];


Promise.all(importedModulePromises).then(
    async (modules) =>{
        console.log("All modules imported.")

        const [loaderModule, trackingModule ] = modules

        const blueishGray = '#9ba6d1'
        const kindaNicePink = '#fb8990'

        const logStyle = [
            `background: ${blueishGray}`,
            'border-radius: 3px',
            'color: white',
            'font-weight: bold',
            'padding: 2px 5px',
            'margin: 1px'
        ].join(';')

        console.log(`%c❱❱ Hello World!`, logStyle)

        console.log({loaderModule})

        const {event} = loaderModule
        const {setupEvents} = trackingModule
        console.log(event())
        setupEvents()

        // getCurrentTab().then(console.log)
        // displayTabOpenedTime().then(console.log)
        // modules.forEach((result) => console.log(result.status))
    }
);
