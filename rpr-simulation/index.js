const ui = require('./ui.js')
const randomGraph = require('randomgraph')
const tm = 1000
let packetStats = {}
let packetStatsArray = []

function graph2network (graph) {
  let nodes = graph.nodes.reduce((acc, node, index) => {
    acc[index + ''] = {}
    return acc
  }, {})

  let edges = graph.edges.reduce((acc, edge, index) => {
    acc[edge.source + '->' + edge.target] = { cost: 1 }
    acc[edge.target + '->' + edge.source] = { cost: 1 }
    return acc
  }, {})

  return { nodes, edges }
}

let smallRandomGraph = graph2network(randomGraph.BarabasiAlbert(200, 1, 1))


let infinityJSON = {
  parse (json, _) {
    return JSON.parse(
      json,
      function (key, value) {
        if (value === 'Infinity') {
          return Infinity;
        }
        return value;
      }
    )
  },
  stringify (json, _, spacing) {
    return JSON.stringify(
      json,
      function (key, value) {
        if (value === Infinity) {
          return 'Infinity';
        }
        return value;
      },
      spacing
    )
  }
}

function randomProperty (obj) {
  var keys = Object.keys(obj)
  return obj[keys[ keys.length * Math.random() << 0]]
}

// $/€:2/1
//    A $20--$10 C $30--$10 D
//     €5     $40
//      |     /
//      €10 $30
//         B
//       €/$:1/1

let basicGraph = {
  nodes: {
    A: {
      fees: {
        'B/C': {
          exchange: '2/1',
          fee: 0.01
        },
        'C/B': {
          exchange: '1/2',
          fee: 0.01
        }
      },
      channels: {
        B: {
          channelId: 'B',
          denomination: 'EUR',
          myBalance: 5,
          theirBalance: 10
        },
        C: {
          channelId: 'C',
          denomination: 'USD',
          myBalance: 20,
          theirBalance: 10
        }
      }
    },
    B: {
      fees: {
        'A/C': {
          exchange: '1/1',
          fee: 0.01
        },
        'C/A': {
          exchange: '1/1',
          fee: 0.01
        }
      },
      channels: {
        A: {
          channelId: 'A',
          denomination: 'EUR',
          myBalance: 10,
          theirBalance: 5
        },
        C: {
          channelId: 'C',
          denomination: 'USD',
          myBalance: 30,
          theirBalance: 40
        }
      }
    },
    C: {
      fees: {
        'B/A': {
          exchange: '1/1',
          fee: 0.01
        },
        'A/B': {
          exchange: '1/1',
          fee: 0.01
        }
      },
      channels: {
        B: {
          channelId: 'B',
          denomination: 'USD',
          myBalance: 40,
          theirBalance: 30
        },
        A: {
          channelId: 'A',
          denomination: 'USD',
          myBalance: 10,
          theirBalance: 20
        }
      }
    },
    D: {
      fees: {},
      channels: {
        C: {
          channelId: 'C',
          denomination: 'USD',
          myBalance: 10,
          theirBalance: 30
        }
      }
    }
  }
}


// node: {
//   feeTable: {
//     'A/B': {
//       exchangeRate: '2/1',
//       marginalFee: 0.09,
//       fixedFee: 0.01
//     }
//   },
//   channels: {
//     A: {
//       channelId: A,
//       myBalance: 10,
//       theirBalance: 10,
//       denomination: 'USD'
//     }
//     B: {
//       channelId: B,
//       myBalance: 20,
//       theirBalance: 5,
//       denomination: 'EUR'
//     }
//   }
// }
//
// routingMessage: {
//   amount: 100,
//   denomination: USD,
//   hash: xyz123,
//   path: [
//     abc456,
//     ...
//   ]
// }

let network = smallRandomGraph
// let network = basicGraph

function initNodes (network) {
  for (let nodeId in network.nodes) {
    let node = network.nodes[nodeId]

    node.id = nodeId
    node.sources = {
      [nodeId]: {
        cost: 0,
        nextHop: nodeId
      }
    }

    node.neighbors = {}
  }

  for (let edgeId in network.edges) {
    let [nodeIdA, nodeIdB] = edgeId.split('->')

    network.nodes[nodeIdA].neighbors[nodeIdB] = network.nodes[nodeIdB]
  }
}



function transmit (neighbor, self, sources) {
  // Check if edge cost is infinity
  if (network.edges[self.id + '->' + neighbor.id].cost === Infinity) {
    throw new Error()
  }

  setTimeout(() => {
    receiveUpdate(neighbor, self, infinityJSON.stringify(sources))
  }, Math.random() * 0.1 * tm)
}


function randomPing (network) {
  let source = randomProperty(network.nodes)
  let destination = randomProperty(network.nodes)
  if (source !== destination) {
    return sendDataPacket(source, destination.id)
  }
}

function sendDataPacket (self, destinationId) {
  let id = String(Math.random()).slice(2)
  let packet = { id, destinationId }
  packetStats[id] = {
    source: self.id,
    sent: Date.now(),
    packet,
    hops: [self.id]
  }

  let source = self.sources[destinationId]
  if (source) {
    return forwardDataPacket(self.neighbors[source.nextHop], packet)
  }
}

function forwardDataPacket (self, packet) {
  if (packet.destinationId === self.id) {
    packetStats[packet.id].completed = true
    packetStats[packet.id].received = Date.now()
    packetStatsArray.push(packetStats[packet.id])
  } else {
    packetStats[packet.id].hops.push(self.id)
    let source = self.sources[packet.destinationId]
    if (source) {
      return forwardDataPacket(self.neighbors[source.nextHop], packet)
    }
  }
}

function calculateLastStats (packetStatsArray, n) {
  let lastPacketStats = packetStatsArray.slice(packetStatsArray.length - n)
  let reducedStats = lastPacketStats.reduce((acc, item, index) => {
    if (item.completed) {
      acc.completed = acc.completed + 1

      if (acc.hops === null) {
        acc.hops = item.hops.length
      } else {
        acc.hops = acc.hops + item.hops.length
      }
    }
    return acc
  }, { completed: 0, hops: null })

  return {
    completed: reducedStats.completed,
    hops: reducedStats.hops,
    completedRatio: reducedStats.completed / n,
    averageHops: reducedStats.hops && reducedStats.hops / reducedStats.completed
  }
}

ui.drawNetwork(network)

initNodes(network)

for (let nodeId in network.nodes) {
  setInterval(() => {
    setTimeout(() => {
      sendPeriodicUpdate(network.nodes[nodeId])
    }, Math.random() * tm)
  }, tm)
}

setInterval(() => {
  randomPing(network)
}, tm / 10)

setInterval(() => {
  console.log(calculateLastStats(packetStatsArray, 10))
}, tm)
