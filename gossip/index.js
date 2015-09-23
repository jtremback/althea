// Allows us to use ES6 features like TCO
require('babel/polyfill');

const aStar = require('a-star')

let network = {
  A: { id: 'A', peers: ['C'], cost: 1, balance: 100 },
  B: { id: 'B', peers: ['D'], cost: 1, balance: 100 },
  C: { id: 'C', peers: ['A', 'D'], cost: 1, balance: 100 },
  D: { id: 'D', peers: ['B', 'C', 'E', 'F'], cost: 1, balance: 100 },
  E: { id: 'E', peers: ['D', 'F', 'G'], cost: 1, balance: 100 },
  F: { id: 'F', peers: ['D', 'E', 'G'], cost: 1, balance: 100 },
  G: { id: 'G', peers: ['E', 'F'], cost: 1, balance: 100 }
}

function addPeers (network) {
  for (let nodeId in network) {
    let node = network[nodeId]
    node.peers = node.peers.reduce((acc, peerId) => {
      acc[peerId] = network[peerId]
      return acc
    }, {})
  }

  return network
}

network = addPeers(network)

function routingAlgorithm (node, destinationId) {
  return aStar({
    start: node,
    isEnd (node) { return node.id === destinationId },
    neighbor (node) {
      let peerArray = []
      for (let peerId in node.peers) {
        peerArray.push(node.peers[peerId])
      }
      return peerArray
    },
    distance () { return 1 },
    heuristic () { return 1 },
    hash (node) { return node.id }
  }).path[1]
}



function route (currentNode, upstreamNode, message) {
  let { destinationId } = message

  if (currentNode.id === destinationId) {
    console.log(`${currentNode.id} received ` + JSON.stringify(message))
    return null
  }

  let downstreamNode = routingAlgorithm(currentNode, destinationId)

  console.log(`${currentNode.id} -> ${downstreamNode.id} ` + JSON.stringify(message))
  if (upstreamNode) {
    updateOwed(currentNode, upstreamNode, message)
  }

  route(downstreamNode, currentNode, message)
}



function updateOwed (creditor, debtor, { destinationId }) {
  // Create data structure holding amounts owed to creditor per debtor
  // Example:
  // owed: {
  //   D: {
  //     G: {
  //       messages: 2,
  //       messageRate: 1
  //     }
  //   }
  // }
  creditor.receivable = creditor.receivable || {}
  creditor.receivable[debtor.id] = creditor.receivable[debtor.id] || {}
  creditor.receivable[debtor.id][destinationId] = creditor.receivable[debtor.id][destinationId] || {}
  creditor.receivable[debtor.id][destinationId].numberOfMessages = creditor.receivable[debtor.id][destinationId].numberOfMessages || 0

  // Increment number of unpaid messages
  let numberOfMessages = creditor.receivable[debtor.id][destinationId].numberOfMessages + 1
  // Get destination rate or use unknown destination rate of 10
  let messageRate = (creditor.destinationRates &&
    creditor.destinationRates[destinationId] || 10) + creditor.cost

  // Update amounts owed to creditor
  creditor.receivable[debtor.id][destinationId] = { numberOfMessages, messageRate }

  // Make payment request if neccesary
  if (numberOfMessages > 2) {
    getPayment(
      debtor,
      creditor,
      { destinationId, numberOfMessages, messageRate }
    )
  }
}



function getPayment (payer, payee, paymentRequest) {
  payer.destinationRates = payer.destinationRates || {}
  payer.destinationRates[paymentRequest.destinationId] = paymentRequest.messageRate

  let cost = paymentRequest.numberOfMessages * paymentRequest.messageRate
  payer.balance = payer.balance - cost
  payee.balance = payee.balance + cost
  console.log(`${payer.id} paid ${payee.id} ${cost}`)

  payee.receivable[payer.id][paymentRequest.destinationId].numberOfMessages = 0
}



// This closes out all receivable accounts
function closeOut (network) {
  for (let nodeId in network) {
    let currentNode = network[nodeId]
    let receivable = currentNode.receivable
    if (receivable) {
      for (let peerId in receivable) {
        for (let destinationId in receivable[peerId]) {
          let { numberOfMessages, messageRate } = receivable[peerId][destinationId]
          getPayment(currentNode.peers[peerId], currentNode, { destinationId, numberOfMessages, messageRate })
        }
      }
    }
  }
}



route(network.A, null, {
  messageId: '1',
  sourceId: 'A',
  destinationId: 'G'
})
route(network.A, null, {
  messageId: '2',
  sourceId: 'A',
  destinationId: 'G'
})
route(network.A, null, {
  messageId: '3',
  sourceId: 'A',
  destinationId: 'G'
})
route(network.A, null, {
  messageId: '4',
  sourceId: 'A',
  destinationId: 'G'
})
route(network.A, null, {
  messageId: '5',
  sourceId: 'A',
  destinationId: 'G'
})
route(network.A, null, {
  messageId: '6',
  sourceId: 'A',
  destinationId: 'G'
})
route(network.A, null, {
  messageId: '7',
  sourceId: 'A',
  destinationId: 'G'
})

closeOut(network)

for (let nodeId in network) {
  let node = network[nodeId]
  let peerArray = []
  for (let peerId in network[nodeId].peers) {
    peerArray.push(peerId)
  }
  node.peers = peerArray
}

console.log(JSON.stringify(network, null, 2))
