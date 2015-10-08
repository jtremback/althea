// Allows us to use ES6 features like TCO
// require('babel/polyfill');

const verbose = true
const updateInterval = 1000
const ui = require('./ui.js')

const tm = 1000

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



//       C 1
// 1 1 1/ \
// S-A-B   E 1
//      \ /
//       D 1

//       C 1
// 1 ∞ 1/ \
// S-A-B   E 1
//      \ /
//       D 1

// let network = {
//   S: { neighbors: ['A'], cost: 1 },
//   A: { neighbors: ['S', 'B'], cost: 1 },
//   B: { neighbors: ['A', 'C', 'D'], cost: 1 },
//   C: { neighbors: ['B', 'E'], cost: 1 },
//   D: { neighbors: ['B', 'E'], cost: 1 },
//   E: { neighbors: ['C', 'D'], cost: 1 }
// }

// setTimeout(() => {
//   network.L.cost = Infinity
//   ui.updateNetwork(network)
// }, 4 * tm)



//      B 1
// 1  1/|
// S--A |
//     \|
//      C 1

//      B 1
// ∞  1/|
// S--A |
//     \|
//      C 1

// let network = {
//   S: { neighbors: ['A'], cost: 1 },
//   A: { neighbors: ['S', 'B', 'C'], cost: 1 },
//   B: { neighbors: ['A', 'C'], cost: 1 },
//   C: { neighbors: ['A', 'B'], cost: 1 }
// }

// setTimeout(() => {
//   network.S.cost = Infinity
//   ui.updateNetwork(network)
// }, 4 * tm)



//       B 1
// 1 1 1/|
// S-L-A |
//      \|
//       C 1

//       B 1
// 1 ∞ 1/|
// S-L-A |
//      \|
//       C 1

// let network = {
//   S: { neighbors: ['L'], cost: 1 },
//   L: { neighbors: ['S', 'A'], cost: 1 },
//   A: { neighbors: ['L', 'B', 'C'], cost: 1 },
//   B: { neighbors: ['A', 'C'], cost: 1 },
//   C: { neighbors: ['A', 'B'], cost: 1 }
// }

// setTimeout(() => {
//   network.L.cost = Infinity
//   ui.updateNetwork(network)
// }, 4 * tm)



//      B 1
// 1  1/|
// S--A D 1
//     \|
//      C 1

//      B 1
// ∞  1/|
// S--A D 1
//     \|
//      C 1

// let network = {
//   S: { neighbors: ['A'], cost: 1 },
//   A: { neighbors: ['S', 'B', 'C'], cost: 1 },
//   B: { neighbors: ['A', 'D'], cost: 1 },
//   C: { neighbors: ['A', 'D'], cost: 1 },
//   D: { neighbors: ['B', 'C'], cost: 1 },
// }

// setTimeout(() => {
//   network.S.cost = Infinity
//   ui.updateNetwork(network)
// }, 4 * tm)



// 1 A--B 1
//  /    \
// S 1    D 1
//  \    /
// 5 C--/

// 1 A--B 1
//  /    \
// S 1    D 1
//  \    /
// 1 C--/

// let network = {
//   S: { neighbors: ['A', 'C'], cost: 1 },
//   A: { neighbors: ['S', 'B'], cost: 1 },
//   B: { neighbors: ['A', 'D'], cost: 1 },
//   C: { neighbors: ['S', 'D'], cost: 5 },
//   D: { neighbors: ['B', 'C'], cost: 1 }
// }

// setTimeout(() => {
//   network.C.cost = 1
//   ui.updateNetwork(network)
// }, 4 * tm)



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

let network = {
  nodes: {
    S: {},
    A: {},
    B: {}
  },
  edges: {
    'S,A': { cost: 1 },
    'A,S': { cost: 1 },
    'B,A': { cost: 1 },
    'A,B': { cost: 1 },
    'S,B': { cost: 1 },
    'B,S': { cost: 1 },
  }
}



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
    let [nodeIdA, nodeIdB] = edgeId.split(',')

    network.nodes[nodeIdA].neighbors[nodeIdB] = network.nodes[nodeIdB]
  }
}


function receiveUpdate (self, from, newSources) {
  newSources = infinityJSON.parse(newSources)
  for (let newSource of newSources) {
    // if (newSource.cost === Infinity) { debugger }
    let existingSource = self.sources[newSource.id]

    // If a route for this destination does not yet exist, accept it.
    if (!existingSource) {
      accept(newSource)

    // If the new route is from the same neighbor as the existing route, accept it.
    } else if (existingSource.nextHop === from.id) {
      accept(newSource)

    // If the new route has a lower cost than the existing route, accept it.
    } else if (newSource.cost < existingSource.cost) {
      accept(newSource)

    } else {
      reject(newSource)
    }
  }

  function accept (newSource) {
    self.sources[newSource.id] = { cost: newSource.cost, nextHop: from.id }

    ui.log(`${self.id} accepted update ${infinityJSON.stringify(newSource)} from ${from.id}`)
    ui.updateNetwork(network)
  }

  function reject (newSource) {
    ui.log(`${self.id} rejected update ${infinityJSON.stringify(newSource)} from ${from.id}`)
  }
}

function transmit (callback) {
  setTimeout(callback, Math.random() * 0.1 * tm)
}

function sendPeriodicUpdate (self) {
  let sources = []

  for (let sourceId in self.sources) {
    let source = self.sources[sourceId]
    sources.push({ id: sourceId, cost: source.cost + self.cost })
  }

  for (let neighborId in self.neighbors) {
    let neighbor = self.neighbors[neighborId]
    transmit(() => {
      receiveUpdate(neighbor, self, infinityJSON.stringify(sources))
    })
  }
}

initNodes(network)

ui.drawNetwork(network)

for (let nodeId in network.nodes) {
  let interval = setInterval(() => {
    setTimeout(() => {
      sendPeriodicUpdate(network.nodes[nodeId])
    }, Math.random() * tm)
  }, tm)
}
