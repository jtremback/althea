// Allows us to use ES6 features like TCO
// require('babel/polyfill');

const verbose = true
const updateInterval = 1000
const ui = require('./ui.js')

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

// let network = {
//   A: { id: 'A', neighbors: ['C'], cost: 1 },
//   B: { id: 'B', neighbors: ['D'], cost: 1 },
//   C: { id: 'C', neighbors: ['A', 'D'], cost: 1 },
//   D: { id: 'D', neighbors: ['B', 'C', 'E', 'F'], cost: 1 },
//   E: { id: 'E', neighbors: ['D', 'F', 'G'], cost: 1 },
//   F: { id: 'F', neighbors: ['D', 'E', 'G'], cost: 1 },
//   G: { id: 'G', neighbors: ['E', 'F'], cost: 1 }
// }

// let network = {
//   S: { id: 'S', neighbors: ['A'], cost: 1 },
//   A: { id: 'A', neighbors: ['S', 'B'], cost: 1 },
//   B: { id: 'B', neighbors: ['A', 'C'], cost: 1 },
//   C: { id: 'C', neighbors: ['B', 'D'], cost: 1 },
//   D: { id: 'D', neighbors: ['C', 'E'], cost: 1 },
//   E: { id: 'E', neighbors: ['D', 'F'], cost: 1 },
//   F: { id: 'F', neighbors: ['E', 'G'], cost: 1 },
//   G: { id: 'G', neighbors: ['E'], cost: 1 }
// }

//       C 1
// 1 1 1/|
// S-A-B |
//      \|
//       D 1

//       C 1
// 1 ∞ 1/ \
// S-A-B   E 1
//      \ /
//       D 1


let network = {
  S: { id: 'S', neighbors: ['A'], cost: 1 },
  A: { id: 'A', neighbors: ['S', 'B'], cost: 1 },
  B: { id: 'B', neighbors: ['A', 'C', 'D'], cost: 1 },
  C: { id: 'C', neighbors: ['B', 'E'], cost: 1 },
  D: { id: 'D', neighbors: ['B', 'E'], cost: 1 },
  E: { id: 'D', neighbors: ['C', 'D'], cost: 1 }
}


//   A--B
// 1/  1 \1
// S      D
// 1\  5 /
//   C--/

// let network = {
//   S: { neighbors: ['A', 'C'], cost: 1 },
//   A: { neighbors: ['S', 'B'], cost: 1 },
//   B: { neighbors: ['A', 'D'], cost: 1 },
//   C: { neighbors: ['S', 'D'], cost: 500 },
//   D: { neighbors: ['B', 'C'], cost: 1 }
// }

function initNodes (network) {
  for (let nodeId in network) {
    let node = network[nodeId]

    node.id = nodeId
    node.sources = {
      [nodeId]: {
        cost: 0,
        nextHop: nodeId
      }
    }

    // Create ports
    node.ports = node.neighbors.reduce((ports, neighborId) => {
      ports[neighborId] = network[neighborId]
      return ports
    }, {})
  }
}


function receiveUpdate (self, from, newSources) {
  newSources = infinityJSON.parse(newSources)
  for (let newSource of newSources) {
    // if (newSource.cost === Infinity) { debugger }
    let existingSource = self.sources[newSource.id]

    // If a route for this destination does not yet exist, add it.
    if (!existingSource) {
      accept(newSource)

    // If the existing entry is from the same neighbor as the new entry, replace it.
    } else if (existingSource.nextHop === from.id) {
      accept(newSource)

    // If the existing entry has a higher cost than the new entry, replace it.
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


function sendPeriodicUpdate (self) {
  let sources = []

  for (let sourceId in self.sources) {
    let source = self.sources[sourceId]
    sources.push({ id: sourceId, cost: source.cost + self.cost })
  }

  for (let portId in self.ports) {
    let port = self.ports[portId]
    receiveUpdate(port, self, infinityJSON.stringify(sources))
  }
}




initNodes(network)

for (let nodeId in network) {
  let interval = setInterval(() => {
    setTimeout(() => {
      sendPeriodicUpdate(network[nodeId])
    }, Math.random() * 1000)
  }, 1000)
}

setTimeout(() => {
  network.A = undefined
  ui.updateNetwork(network)
}, 4000)
