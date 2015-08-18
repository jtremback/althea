// import * as ABC from './ABC.js'
// import EventEmitter from 'EventEmitter'

// Nodes can transmit data over frequencies (simulated by events)
// One mode of transmission uses 1s and 0s that are encoded and decoded into a value
// Another encodes data into a time interval and then decodes it

// let end = '11000000'.split().map(x => Number(x))

// let airwaves = new EventEmitter()

// let buffer = []

// airwaves.on('550', addToBuffer)
// airwaves.on('550', new SequenceRecognizer().checkBit)

class SequenceRecognizer {
  constructor (sequence) {
    this.counter = 0
    this.sequence = sequence
  }
  checkBit (bit) {
    if (bit !== this.sequence[this.counter]) {
      // The bit received is not what it should be for the sequence. Reset the
      // counter.
      this.counter = 0
    } else {
      // The bit matches the sequence, increment counter.
      this.counter = this.counter + 1
      if (this.counter === this.sequence.length) {
        // The sequence has been successfully recognized. Do something.
        console.log(`recognized ${this.sequence}!`)
        return true
      }
    }
  }
}

let end = '11000000'.split('').map(x => Number(x))
let stream = '00001110100010010100010101100000001001000101010010101010110000000'.split('').map(x => Number(x))

let sequenceRecognizer = new SequenceRecognizer(end)

stream.forEach(bit => {
  sequenceRecognizer.checkBit(bit)
})

// function addToBuffer (bit) {
//   buffer.push(bit)
// }
