import Graph from './djikstra.js'

let nodes = {
  A: {
    peers: {
      C: { distance: 20 }
    },
    pings: {
      E: 3,
      F: 7
    }
  },
  B: {
    peers: {
      E: { distance: 25 },
      D: { distance: 8 },
    },
    pings: {
      A: 4,
      G: 2
    }
  },
  C: {
    peers: {
      A: { distance: 20 },
      D: { distance: 15 },
    },
    pings: {
      D: 8,
      B: 4
    }
  },
  D: {
    peers: {
      B: { distance: 8 },
      C: { distance: 15 },
      E: { distance: 13 },
      F: { distance: 11 },
    },
    pings: {
      C: 4,
      G: 9
    }
  },
  E: {
    peers: {
      B: { distance: 25 },
      D: { distance: 13 },
      F: { distance: 20 },
      G: { distance: 10 },
    },
    pings: {
      F: 5,
      A: 12
    }
  },
  F: {
    peers: {
      D: { distance: 11 },
      E: { distance: 20 },
      G: { distance: 6 },
    },
    pings: {
      B: 3,
      D: 9
    }
  },
  G: {
    peers: {
      E: { distance: 10 },
      F: { distance: 6 },
    },
    pings: {
      B: 4,
      C: 5
    }
  }
}

function prepMap (nodes) {
  let newNodes = {}
  for (let nodeName in nodes){
    let node = nodes[nodeName]
    let newNode = newNodes[nodeName] = {}
    for (let peerName in node.peers) {
      newNode[peerName] = node.peers[peerName].distance
    }
  }

  return newNodes
}

function checkDistances (map) {
  for (let nodeName in map) {
    let node = map[nodeName]
    for (let peerName in node) {
      let distance = node[peerName]
      if (distance !== map[peerName][nodeName]) {
        throw new Error(`mismatched node distances ${peerName}, ${nodeName}`)
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
    if (message.header.destinationAddress === this.id) {
      console.log(this.id, 'recieved', message, 'via', peerFrom)
    } else {
      // Forward along
      this._send(message, peerFrom)
    }
  }

  _send (message, peerFrom) {
    // Get peer for destinationAddress
    let peerTo = graph.findShortestPath(this.id, message.header.destinationAddress)[1]

    if (peerFrom) { // Then this is being forwarded for another node.
      console.log('forwarding message from ' + peerFrom + ' to ' + peerTo)
      this._logForward(peerFrom, peerTo)
    }

    // Send to peer
    nodes[peerTo].recieve(message, this.id)
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
            sourceAddress: this.id
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
