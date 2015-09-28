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

let network = {
  S: { id: 'S', neighbors: ['A'], marginRate: 1 },
  A: { id: 'A', neighbors: ['S', 'B'], marginRate: 1 },
  B: { id: 'B', neighbors: ['A', 'C'], marginRate: 1 },
  C: { id: 'C', neighbors: ['B', 'D'], marginRate: 1 },
  D: { id: 'D', neighbors: ['C', 'E'], marginRate: 1 },
  E: { id: 'E', neighbors: ['D', 'F'], marginRate: 1 },
  F: { id: 'F', neighbors: ['E', 'G'], marginRate: 1 },
  G: { id: 'G', neighbors: ['E'], marginRate: 1 }
}

// let network = {
//   S: { id: 'S', neighbors: ['A'], marginRate: 1 },
//   A: { id: 'A', neighbors: ['B', 'C'], marginRate: 1 },
//   B: { id: 'B', neighbors: ['A', 'C'], marginRate: 1 },
//   C: { id: 'C', neighbors: ['A', 'B'], marginRate: 1 }
// }


function initNodes (network) {
  for (let nodeId in network) {
    let node = network[nodeId]
    // initialize route table with self
    node.sources = {
      // [node.id]: {
      //   rate: 0,
      //   nextHop: node.id
      // }
    }

    node.helloSequence = 0

    // Replace array of neighbor ids with object of actual neighbors
    node.neighbors = node.neighbors.reduce((neighborMap, neighborId) => {
      neighborMap[neighborId] = network[neighborId]
      return neighborMap
    }, {})
  }
}


// function flood (currentNode, message) {
//   let { messageId, sourceId, destinationId } = message

//   if (!currentNode.messagesReceived) {
//     currentNode.messagesReceived = {}
//   }

//   if (currentNode.messagesReceived[messageId]) {
//     return null
//   }

//   currentNode.messagesReceived[messageId] = true

//   if (currentNode.id === destinationId) {
//     console.log(`${currentNode.id} recieved ${messageId} from ${sourceId}`)
//     return null
//   }

//   for (let peer of currentNode.peers) {
//     console.log(`${currentNode.id} forwarded ${messageId}`)
//     flood(peer, message)
//   }
// }


function update (currentNode, from, message) {
  debugger
  let { helloSequence, source, rate } = message
  if (
    // source is not in table
    !currentNode.sources[source]
    || // Or
    (
      // New rate is smaller
      currentNode.sources[source].rate > rate
      && // And
      // helloSequence is bigger
      currentNode.sources[source].helloSequence < helloSequence
    )
  ) {
    console.log(`${currentNode.id} accepted update ${JSON.stringify(message)} from ${from.id}`)
    currentNode.sources[source] = { helloSequence, rate, nextHop: from.id }

    for (let neighborId in currentNode.neighbors) {
      let neighbor = currentNode.neighbors[neighborId]
      console.log(`${currentNode.id} sent update ${JSON.stringify(message)} to ${neighbor.id}`)
      let message = {
        rate: rate + currentNode.marginRate,
        helloSequence,
        source
      }

      update(neighbor, currentNode, message)
    }
  } else {
    console.log(`${currentNode.id} rejected update ${JSON.stringify(message)} from ${from.id}`)
  }
}


function hello (currentNode) {
  currentNode.helloSequence = currentNode.helloSequence + 1
  for (let neighborId in currentNode.neighbors) {
    let neighbor = currentNode.neighbors[neighborId]
    return update(neighbor, currentNode, {
      rate: currentNode.marginRate,
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

hello(network.S)

// for (var i = 0; i < 100; i++) {
//   route(network.A, null, {
//     messageId: i + '',
//     sourceId: 'A',
//     sourceId: 'G'
//   })
// }


// closeOut(network)
decircularize(network)
console.log(JSON.stringify(network, null, 2))
