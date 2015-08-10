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
      C: { pings: 100}
    }
  },
  B: {
    peers: {
      E: { pings: 40 },
      D: { pings: 26 },
    }
  },
  C: {
    peers: {
      A: { pings: 12 },
      D: { pings: 23 },
    }
  },
  D: {
    peers: {
      B: { pings: 1 },
      C: { pings: 3 },
      E: { pings: 39 },
      F: { pings: 8 },
    }
  },
  E: {
    peers: {
      B: { pings: 49 },
      D: { pings: 32 },
      G: { pings: 40 },
    }
  },
  F: {
    peers: {
      D: { pings: 33 },
      E: { pings: 11 },
      G: { pings: 22 },
    }
  },
  G: {
    peers: {
      E: { pings: 87 },
      F: { pings: 1 },
    }
  }
}

class Node {
  constructor (id, nodes) {
    this.id = id
    this.peers = nodes[id].peers
    this.nodes = nodes
  }

  recieve (message, senderId) {
    console.log(`${this.id} recieved ${message} from ${senderId}`)
  }

  send (message, recieverId) {
    this.nodes[recieverId].recieve(message, this.id)
  }

  pingPeers () {
    for (let key in this.peers) {
      for (let i = 0; i < this.peers[key].pings; i++) {
        this.send('ping', key)
      }
    }
  }
}

function makeNodes (nodes) {
  for (let key in nodes) {
    nodes[key] = new Node(key, nodes)
  }
}

makeNodes(nodes)

for (let key in nodes) {
  nodes[key].pingPeers()
}
