import Graph from './djikstra.js'

let nodes = {
  A: {
    peers: {
      C: { distance: 20 }
    },
    pings: {
      E: 3,
      G: 7
    }
  },
  B: {
    peers: {
      E: { distance: 25 },
      D: { distance: 8 },
    },
    // pings: {
    //   A: 4,
    //   G: 2
    // }
  },
  C: {
    peers: {
      A: { distance: 20 },
      D: { distance: 15 },
    },
    // pings: {
    //   D: 8,
    //   B: 4
    // }
  },
  D: {
    peers: {
      B: { distance: 8 },
      C: { distance: 15 },
      E: { distance: 13 },
      F: { distance: 11 },
    },
    // pings: {
    //   C: 4,
    //   G: 9
    // }
  },
  E: {
    peers: {
      B: { distance: 25 },
      D: { distance: 13 },
      F: { distance: 20 },
      G: { distance: 10 },
    },
    // pings: {
    //   F: 5,
    //   A: 12
    // }
  },
  F: {
    peers: {
      D: { distance: 11 },
      E: { distance: 20 },
      G: { distance: 6 },
    },
    // pings: {
    //   B: 3,
    //   D: 9
    // }
  },
  G: {
    peers: {
      E: { distance: 10 },
      F: { distance: 6 },
    },
    // pings: {
    //   B: 4,
    //   C: 5
    // }
  }
}

let blockchain = [
  {
    to: 'A',
    amount: 100
  }
]

function prepMap (nodes) {
  let newNodes = {}
  for (let nodeId in nodes){
    let node = nodes[nodeId]
    let newNode = newNodes[nodeId] = {}
    for (let peerId in node.peers) {
      newNode[peerId] = node.peers[peerId].distance
    }
  }

  return newNodes
}

function checkDistances (map) {
  for (let nodeId in map) {
    let node = map[nodeId]
    for (let peerId in node) {
      let distance = node[peerId]
      if (distance !== map[peerId][nodeId]) {
        throw new Error(`mismatched node distances ${peerId}, ${nodeId}`)
      }
    }
  }

  return map
}

let graph = new Graph(checkDistances(prepMap(nodes)))

class Node {
  constructor (id, opts) {
    this.id = id
    this.peers = opts.peers
    this.routes = opts.routes
    this.pings = opts.pings
    this.baseRate = opts.baseRate

    this.stats = {
      forwardedTo: {
      //   A: {
      //     B: 10
      //   }
      }
    }
  }

  recieve (message, peerFrom) {
    message = JSON.parse(message)
    if (message.header.destinationAddress === this.id) {
      console.log(this.id, 'recieved', message, 'via', peerFrom)
      this._pay(message)
    } else {
      // Forward along
      this._send(message, peerFrom)
    }
  }

  _pay (message) {
    blockchain.push(message.header.payment)
    for (let forwarderId of message.header.forwarders) {
      blockchain.push({
        from: this.id,
        to: forwarderId,
        amount: message.header.payment.amount / message.header.forwarders.length
      })
    }
  }

  _send (message, peerFrom) {
    // Get peer for destinationAddress
    let peerTo = graph.findShortestPath(this.id, message.header.destinationAddress)[1]

    if (peerFrom) { // Then this is being forwarded for another node.
      console.log('forwarding message from ' + peerFrom + ' to ' + peerTo)
      this._logForward(peerFrom, peerTo)
      message.header.forwarders.push(this.id)
    }

    // Send to peer
    nodes[peerTo].recieve(JSON.stringify(message), this.id)
  }

  _logForward (peerFrom, peerTo) {
    // Log forwarding stats
    if (!this.stats.forwardedTo[peerTo]) {
      this.stats.forwardedTo[peerTo] = {}
    }
    if (!this.stats.forwardedTo[peerTo][peerFrom]) {
      this.stats.forwardedTo[peerTo][peerFrom] = 0
    }
    this.stats.forwardedTo[peerTo][peerFrom] = this.stats.forwardedTo[peerTo][peerFrom] + 1
  }

  pingPeers () {
    for (let id in this.pings) {
      for (let i = 0; i < this.pings[id]; i++) {
        this._send({
          header: {
            destinationAddress: id,
            sourceAddress: this.id,
            forwarders: [],
            payment: {
              from: this.id,
              to: id,
              amount: 20
            }
          },
          body: 'ping'
        })
      }
    }
  }

  getStats () {
    return this.stats
  }
}


function makeNodes (nodes) {
  for (let id in nodes) {
    nodes[id] = new Node(id, nodes[id])
  }
}

makeNodes(nodes)

for (let key in nodes) {
  nodes[key].pingPeers()
}

for (let key in nodes) {
  console.log(nodes[key].getStats())
}

console.log(blockchain)
