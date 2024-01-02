// loader.js
import {Highway} from "../shared/messaging.mjs"
console.log({Highway})
console.log(`❱❱ [loader.js]`)
const event = () => {

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

}

export {
    event
}