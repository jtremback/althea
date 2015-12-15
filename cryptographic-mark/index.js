let nacl = require('tweetnacl')

class CryptoMark {
  constructor(length) {
    // this.list = nacl.randomBytes(length)
    this.list = ['h', 'e', 'l', 'l']
  }

  serialize () {
    return this.list.reduce((acc, item) => {
      console.log(item.toString(8))
      return acc + btoa(item)
    }, '')
  }
}

let l = 109

let cm = new CryptoMark(l)

console.log(cm.serialize())
