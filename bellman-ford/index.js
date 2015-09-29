// Allows us to use ES6 features like TCO
// require('babel/polyfill');

const verbose = true
const updateInterval = 1000

// let network = {
//   A: { id: 'A', neighbors: ['C'] },
//   B: { id: 'B', neighbors: ['D'] },
//   C: { id: 'C', neighbors: ['A', 'D'] },
//   D: { id: 'D', neighbors: ['B', 'C', 'E', 'F'] },
//   E: { id: 'E', neighbors: ['D', 'F', 'G'] },
//   F: { id: 'F', neighbors: ['D', 'E', 'G'] },
//   G: { id: 'G', neighbors: ['E', 'F'] }
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

let network = {
  S: { neighbors: ['A', 'C'], cost: 1 },
  A: { neighbors: ['S', 'B'], cost: 1 },
  B: { neighbors: ['A', 'D'], cost: 1 },
  C: { neighbors: ['S', 'D'], cost: 5 },
  D: { neighbors: ['B', 'C'], cost: 1 }
}

function initNodes (network) {
  for (let nodeId in network) {
    let node = network[nodeId]

    node.id = nodeId
    node.sources = {}
    node.helloSequence = 0

    // Replace array of neighbor ids with object of actual neighbors
    node.neighbors = node.neighbors.reduce((neighborMap, neighborId) => {
      neighborMap[neighborId] = network[neighborId]
      return neighborMap
    }, {})
  }
}


function update (currentNode, from, message) {
  let { helloSequence, source, cost } = message

  if (
    // source is not in table
    !currentNode.sources[source]
    || // Or
    (
      // New cost is smaller
      currentNode.sources[source].cost > cost
      && // And
      // helloSequence is bigger
      currentNode.sources[source].helloSequence < helloSequence
    )
  ) {
    console.log(`${currentNode.id} accepted update ${JSON.stringify(message)} from ${from.id}`)
    currentNode.sources[source] = { helloSequence, cost, nextHop: from.id }

    for (let neighborId in currentNode.neighbors) {
      let neighbor = currentNode.neighbors[neighborId]
      console.log(`${currentNode.id} sent update ${JSON.stringify(message)} to ${neighbor.id}`)
      let message = {
        cost: cost + currentNode.cost,
        helloSequence,
        source
      }

      update(neighbor, currentNode, message)
    }
    pushHistory(history, network)
  } else {
    console.log(`${currentNode.id} rejected update ${JSON.stringify(message)} from ${from.id}`)
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

var history = []

function pushHistory (history, network) {
  let state = {}
  for (let nodeId in network) {
    state[nodeId] = JSON.parse(JSON.stringify(network[nodeId].sources))
  }
  history.push(state)
}

pushHistory(history, network)
hello(network.S)

decircularize(network)

function printTable (history, sourceId) {
  let strings = {}

  for (let state of history) {
    for (let nodeId in state) {
      let source = state[nodeId][sourceId]
      if (source) {
        strings[nodeId] = (strings[nodeId] || '') + ` nh=${source.nextHop}, c=${source.cost} |`
      } else {
        strings[nodeId] = (strings[nodeId] || '') + '| --------- |'
      }
    }
  }

  let string = ''

  for (let nodeId in strings) {
    string = string + ` ${nodeId} ` + strings[nodeId] + '\n'
  }

  console.log(string)
  // let nodeIds = []
  // let lines = []
  // let string = ''

  // for (let nodeId in history[(history.length - 1)]) {
  //   nodeIds.push(nodeId)
  // }

  // for (var i = 0; i < nodeIds.length; i++) {
  //   let nodeId = nodeIds[i]
  //   lines[i] = lines[i] +
  // }


  // for (let state of history) {
  //   for (nodeId in nodeIds) {
  //     string = string +
  //   }
  // }
}

console.log(JSON.stringify(network, null, 2))
console.log(JSON.stringify(history, null, 2))
printTable(history, 'S')

