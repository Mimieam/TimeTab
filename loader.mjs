// loader.js
console.log(`❱❱ [loader.js]`)
const event = () => {
    console.log(`   ❱ [event.js]`)
    return "test"
}

export {
    event
}