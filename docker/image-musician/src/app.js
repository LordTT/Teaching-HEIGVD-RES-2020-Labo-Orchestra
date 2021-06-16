/**
 * @author Fabio da Silva Marques & Théo Ferrari
 */
const uuid = require('uuid')
const dgram = require('dgram')

const INSTRUMENT_SOUNDS = {
    piano: 'ti-ta-ti',
    trumpet: 'pouet',
    flute: 'trulu',
    violin: 'gzi-gzi',
    drum: 'boum-boum'
}
const MULTICAST_PORT = 1234
const MULTICAST_ADDR = '239.0.0.1'
const EXPECTED_PARAMS = 1
// 2 because: node + app.js + ...params
const EXPECTED_PARAMS_REAL = 2 + EXPECTED_PARAMS

const argv = process.argv
// check nb of params
if (argv.length != EXPECTED_PARAMS_REAL) {
    console.log(`Wrong number of params given ${EXPECTED_PARAMS_REAL-argv.length} but ${argv.length - 2} given`)
    return
}

// check if instrument exists
if (!(argv[2] in INSTRUMENT_SOUNDS)) {
    console.log(`Unknown instrument ${argv[2]}`)
    return
}

// create a musician object and converting it to string
const message = JSON.stringify({
    uuid: uuid.v4(),
    instrument: argv[2],
    sound: INSTRUMENT_SOUNDS[argv[2]]
})

const s = dgram.createSocket('udp4')
// send sound each second
setInterval(() => {
    console.log("Sending message:", message)
    s.send(message, MULTICAST_PORT, MULTICAST_ADDR, (error, bytes) => {
        if (error) {
            console.log("error: ", error)
        } else {
            console.log("OK")
        }
    })
}, 1000)
