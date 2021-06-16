/**
 * @author Fabio da Silva Marques & Théo Ferrari
 */

const dgram = require('dgram')
const moment = require('moment')
const net = require('net')

const MULTICAST_PORT = 1234
const MULTICAST_ADDR = '239.0.0.1'
const TCP_PORT = 2205
// time in seconds
const MUSICIAN_TIMEOUT = 5

const s = dgram.createSocket('udp4')
// todo: vérifier fonctionnement
s.bind(MULTICAST_PORT, MULTICAST_ADDR, () => {
    console.log('Listening the orchestra')
    s.addMembership(MULTICAST_ADDR)
})

var musicians = new Map()

s.on('message', (msg, rinfo) => {
    const data = JSON.parse(msg.toString())

    const last_active = moment().toISOString()
    const active_since = musicians.has(data.uuid) ? musicians.get(data.uuid).active_since : last_active
    
    musicians.set(data.uuid, {
        instrument: data.instrument,
        last_active: last_active,
        active_since: active_since
    })

    console.log(data.sound)
})

function removeInactiveInstruments() {
    musicians.forEach((val, key) => {
        if (moment().diff(val.last_active, 's') > MUSICIAN_TIMEOUT) {
            console.log(`Musician left: ${key}`)
            musicians.delete(key)
        }
    })
}

net.createServer((s) => {
    removeInactiveInstruments()

    var response = []

    musicians.forEach((val, key) => {
        response.push({
            uuid: key,
            ...val
        })
    })

    s.write(JSON.stringify(response))
    s.end()
}).listen(TCP_PORT)