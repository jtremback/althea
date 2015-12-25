const sha3 = require('js-sha3')

function hashFn (x) {
  return sha3.keccak_224(x).slice(0, 10) // truncate for ease of reading
}

function rand () {
  return hashFn(String(Math.random()))
}

let arr = []

for (let i = 0; i < 100000; i++) {
  arr.push(Number('0x' + hashFn(String(i))))
}

function makeBuckets (range, division) {
  let step = range / division

  let buckets = {}
  for (let i = 0; i <= division; i++) {
    buckets[step * i] = []
  }

  // let buckets = steps.reduce((acc, item) => {
  //   w
  // }, {})

  return buckets
}

function distribute (data, buckets) {
  let histogram = data.reduce((buckets, item) => {
    for (let bucketKey in buckets) {
      if (item < bucketKey) {
        buckets[bucketKey].push(item)
        return buckets
      }
    }
  }, buckets)
  return buckets
}

let histogram = distribute(arr, makeBuckets(0xffffffffff, 10))
console.log(histogram)
debugger

let network = {
  nodes: {
    1: {
      ipAddress: 1
    },
    2: {
      ipAddress: 2
    },
    3: {
      ipAddress: 3
    },
    4: {
      ipAddress: 4
    },
    5: {
      ipAddress: 5
    },
    6: {
      ipAddress: 6
    },
  }
}


