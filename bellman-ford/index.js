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


// Example from section 2.4
// No routing loop should form after 4 seconds

//       B
//   1 1/|
// S---A |1
//     1\|
//       C

//       B
//   ∞ 1/|
// S---A |1
//     1\|
//       C

// let network = {
//   nodes: {
//     S: {},
//     A: {},
//     B: {},
//     C: {}
//   },
//   edges: {
//     'S->A': { cost: 1 },
//     'A->S': { cost: 1 },

//     'B->A': { cost: 1 },
//     'A->B': { cost: 1 },

//     'B->C': { cost: 1 },
//     'C->B': { cost: 1 },

//     'C->A': { cost: 1 },
//     'A->C': { cost: 1 },
//   }
// }

// setTimeout(() => {
//   network.edges['S->A'].cost = Infinity
//   network.edges['A->S'].cost = Infinity
//   ui.updateNetwork(network)
// }, 4 * tm)


// Can we select the better route?

//   A--B
// 1/  1 \1
// S      D
// 1\   5/
//   C--/

//   A--B
// 1/  1 \1
// S      D
// 1\   1/
//   C--/

let basicGraph = {
  nodes: {
    0: {},
    1: {},
    2: {},
    3: {},
    4: {}
  },
  edges: {
    '0->1': { cost: 1 },
    '1->0': { cost: 1 },

    '1->2': { cost: 1 },
    '2->1': { cost: 1 },

    '2->4': { cost: 1 },
    '4->2': { cost: 1 },

    '0->3': { cost: 1 },
    '3->0': { cost: 1 },

    '3->4': { cost: Infinity },
    '4->3': { cost: Infinity },
  }
}

// setTimeout(() => {
//   console.log('changed cost of c-d')
//   network.edges['C->D'].cost = 1
//   network.edges['D->C'].cost = 1
//   ui.updateNetwork(network)
// }, 4 * tm)



// Section 2.5: spurious starvation

// 1 --A
//  /  |
// S   | 1
//  \  |
// 1 --B

// ∞ --A
//  /  |
// S   | 1
//  \  |
// 1 --B

// let network = {
//   nodes: {
//     S: {},
//     A: {},
//     B: {}
//   },
//   edges: {
//     'S->A': { cost: 1 },
//     'A->S': { cost: 1 },

//     'B->A': { cost: 1 },
//     'A->B': { cost: 1 },

//     'S->B': { cost: 2 },
//     'B->S': { cost: 2 },
//   }
// }

// setTimeout(() => {
//   network.edges['S->A'].cost = Infinity
//   network.edges['A->S'].cost = Infinity
//   ui.updateNetwork(network)
// }, 4 * tm)

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


function receiveUpdate (self, from, newSources) {
  newSources = infinityJSON.parse(newSources)

  // Get cost of edge from network spec
  // (Simulates hello and IHU from section 3.4.3)
  let edge = network.edges[self.id + '->' + from.id]
  let edgeCost = (edge && edge.cost) || 0

  for (let newSource of newSources) {
    let existingSource = self.sources[newSource.id]

    // Don't accept updates for yourself
    if (newSource.id === self.id) {
      reject(newSource, existingSource.fd)

    // If a route for this destination does not yet exist, accept it.
    } else if (!existingSource) {
      // console.log('!existingSource')
      accept(newSource)

    // If the edge to the neighbor is lower cost than the smallest metric that
    // we have ever advertised to our neighbors
    // (D(B) < FD(A) from section 2.4)
    } else if (newSource.cost < existingSource.fd) {
      // console.log('newSource.cost < existingSource.fd')
      accept(newSource, existingSource.fd)

    } else {
      reject(newSource, existingSource.fd)
    }
  }

  function accept (newSource, fd) {
    if (!self.sources[newSource.id]) {
      self.sources[newSource.id] = { cost: newSource.cost + edgeCost, nextHop: from.id, fd: Infinity }
    } else {
      self.sources[newSource.id].cost = newSource.cost + edgeCost
      self.sources[newSource.id].nextHop = from.id
    }

    // ui.log(`${self.id} accepted update ${infinityJSON.stringify(newSource)} from ${from.id}, with fd ${fd}`)
    ui.updateNetwork(network)
  }

  function reject (newSource, fd) {
    // ui.log(`${self.id} rejected update ${infinityJSON.stringify(newSource)} from ${from.id}`)
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

function sendPeriodicUpdate (self) {
  let sources = []

  for (let sourceId in self.sources) {
    let source = self.sources[sourceId]

    // Stores feasibility condition
    // (FD(A) from section 2.4)
    if (source.cost < source.fd) {
      source.fd = source.cost
    }

    // Add source to message going out
    sources.push({ id: sourceId, cost: source.cost })
  }

  for (let neighborId in self.neighbors) {
    let neighbor = self.neighbors[neighborId]
    try {
      transmit(neighbor, self, sources)
    } catch (e) {
      // If the cost is infinity, update the source table
      if (self.sources[neighborId]) { self.sources[neighborId].cost = Infinity }
    }
  }
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
