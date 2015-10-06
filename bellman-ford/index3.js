// Allows us to use ES6 features like TCO
// require('babel/polyfill');

const verbose = true
const updateInterval = 1000

let network = {
  A: { id: 'A', neighbors: ['C'], cost: 1 },
  B: { id: 'B', neighbors: ['D'], cost: 1 },
  C: { id: 'C', neighbors: ['A', 'D'], cost: 1 },
  D: { id: 'D', neighbors: ['B', 'C', 'E', 'F'], cost: 1 },
  E: { id: 'E', neighbors: ['D', 'F', 'G'], cost: 1 },
  F: { id: 'F', neighbors: ['D', 'E', 'G'], cost: 1 },
  G: { id: 'G', neighbors: ['E', 'F'], cost: 1 }
}

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

// let network = {
//   S: { id: 'S', neighbors: ['A'], cost: 1 },
//   A: { id: 'A', neighbors: ['B', 'C'], cost: 1 },
//   B: { id: 'B', neighbors: ['A', 'C'], cost: 1 },
//   C: { id: 'C', neighbors: ['A', 'B'], cost: 1 }
// }

//   A--B
// 1/  1 \1
// S      D
// 1\  5 /
//   C--/

// let network = {
//   S: { neighbors: ['A', 'C'], cost: 1 },
//   A: { neighbors: ['S', 'B'], cost: 1 },
//   B: { neighbors: ['A', 'D'], cost: 1 },
//   C: { neighbors: ['S', 'D'], cost: 10 },
//   D: { neighbors: ['B', 'C'], cost: 1 }
// }

function initNodes (network) {
  for (let nodeId in network) {
    let node = network[nodeId]

    node.id = nodeId
    node.sources = {
      [nodeId]: {
        helloSequence: 1,
        cost: 0,
        nextHop: nodeId
      }
    }
    node.helloSequence = 0

    // Replace array of neighbor ids with object of actual neighbors
    node.neighbors = node.neighbors.reduce((neighborMap, neighborId) => {
      neighborMap[neighborId] = network[neighborId]
      return neighborMap
    }, {})
  }
}


function update (currentNode, from, { helloSequence, source, cost }) {
  if (
    // source is not in table
    !currentNode.sources[source]
    || // Or
    // New cost is smaller
    currentNode.sources[source].cost > cost
    || // Or
    // helloSequence is larger
    currentNode.sources[source].helloSequence < helloSequence
  ) {
    console.log(`${currentNode.id} accepted update ${JSON.stringify({ helloSequence, source, cost })} from ${from.id}`)
    currentNode.sources[source] = { helloSequence, cost, nextHop: from.id }

    for (let neighborId in currentNode.neighbors) {
      let message = {
        cost: cost + currentNode.cost,
        helloSequence,
        source
      }

      if (neighborId !== from.id) {
        console.log(`${currentNode.id} sent update ${JSON.stringify(message)} to ${neighborId}`)
        update(currentNode.neighbors[neighborId], currentNode, message)
      }
    }
  } else {
    console.log(`${currentNode.id} rejected update ${JSON.stringify({ helloSequence, source, cost })} from ${from.id}`)
  }
}


function hello (currentNode) {
  currentNode.helloSequence = currentNode.helloSequence + 1

  for (let neighborId in currentNode.neighbors) {
    let neighbor = currentNode.neighbors[neighborId]
    update(neighbor, currentNode, {
      cost: currentNode.cost,
      helloSequence: currentNode.helloSequence,
      source: currentNode.id
    })
  }
}


function decircularize () {
  for (let nodeId in network) {
    let node = network[nodeId]
    let neighborArray = []
    for (let neighborId in network[nodeId].neighbors) {
      neighborArray.push(neighborId)
    }
    node.neighbors = neighborArray
  }
}


initNodes(network)

hello(network.A)
// hello(network.A)
// hello(network.B)
// hello(network.C)
// hello(network.D)

network.C.cost = 10

hello(network.A)

network.C.cost = 1

hello(network.A)
// hello(network.A)
// hello(network.B)
// hello(network.C)
// hello(network.D)

decircularize(network)

console.log(JSON.stringify(network, null, 2))
