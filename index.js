// This simulation consists of a small network of nodes, each node randomly
// pings other nodes in a fixed proportion. So for example, node B may ping
// node E 40% of the time, and node D 60% of the time. Some of the nodes are
// not directly connected, so a naive routing algorithm is used.
//
// The output, for each node, is a list of the node's peers, along with number
// of pings forwarded to other peers. For example, node E might
// have an output like this:
//
// Node E:
//   Peer B: 12 pings to D, 9 pings to G
//   Peer D: 5 pings to B, 9 pings to G
//   Peer G: 0 pings to D, 30 pings to B

let nodes = {
  A: {
    peers: {
      C: { cost: 0 }
    },
    routes: {
      A: null,
      B: 'C',
      C: 'C',
      D: 'C',
      E: 'C',
      F: 'C',
      G: 'C',
    },
    pings: {
      E: 3,
      F: 7
    }
  },
  B: {
    peers: {
      E: { cost: 0 },
      D: { cost: 0 },
    },
    routes: {
      A: 'D',
      B: null,
      C: 'D',
      D: 'D',
      E: 'E',
      F: 'D',
      G: 'E'
    },
    pings: {
      A: 4,
      G: 2
    }
  },
  C: {
    peers: {
      A: { cost: 0 },
      D: { cost: 0 },
    },
    routes: {
      A: 'A',
      B: 'D',
      C: null,
      D: 'D',
      E: 'D',
      F: 'D',
      G: 'G'
    },
    pings: {
      D: 8,
      B: 4
    }
  },
  D: {
    peers: {
      B: { cost: 0 },
      C: { cost: 0 },
      E: { cost: 0 },
      F: { cost: 0 },
    },
    routes: {
      A: 'C',
      B: 'B',
      C: 'C',
      D: null,
      E: 'E',
      F: 'F',
      G: 'F'
    },
    pings: {
      C: 4,
      G: 9
    }
  },
  E: {
    peers: {
      B: { cost: 0 },
      D: { cost: 0 },
      G: { cost: 0 },
    },
    routes: {
      A: 'D',
      B: 'B',
      C: 'D',
      D: 'D',
      E: null,
      F: 'D',
      G: 'G'
    },
    pings: {
      F: 5,
      A: 12
    }
  },
  F: {
    peers: {
      D: { cost: 0 },
      E: { cost: 0 },
      G: { cost: 0 },
    },
    routes: {
      A: 'D',
      B: 'D',
      C: 'D',
      D: 'D',
      E: 'G',
      F: null,
      G: 'G'
    },
    pings: {
      B: 3,
      D: 9
    }
  },
  G: {
    peers: {
      E: { cost: 0 },
      F: { cost: 0 },
    },
    routes: {
      A: 'F',
      B: 'E',
      C: 'F',
      D: 'F',
      E: 'E',
      F: 'F',
      G: null
    },
    pings: {
      B: 4,
      C: 5
    }
  }
}

class Node {
  constructor (id, opts) {
    this.id = id
    this.peers = opts.peers
    this.routes = opts.routes
    this.pings = opts.pings
  }

  recieve (message, peerFrom) {
    if (message.header.destinationAddress === this.id) {
      console.log(this.id, 'recieved', message.body, 'from', message.header.sourceAddress, 'via', peerFrom)
    } else {
      // Forward along
      this.send(message, peerFrom)
    }
  }

  send (message, peerFrom) {
    // Get peer for destinationAddress
    let peerTo = this.routes[message.header.destinationAddress]

    if (peerFrom) {
      console.log('forwarding message from ' + peerFrom + ' to ' + peerTo)
    }

    // Send to peer
    nodes[peerTo].recieve(message, this.id)
  }

  pingPeers () {
    for (let id in this.pings) {
      for (let i = 0; i < this.pings[id]; i++) {
        this.send({
          header: {
            destinationAddress: id,
            sourceAddress: this.id
          },
          body: 'ping'
        })
      }
    }
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
