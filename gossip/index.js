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
  for (let key in network) {
    let node = network[key]
    node.peers = node.peers.map(peerId => network[peerId])
  }

  return network
}

network = addPeers(network)

function routingAlgorithm (node, destinationId) {
  return aStar({
    start: node,
    isEnd (node) { return node.id === destinationId },
    neighbor (node) {
      return node.peers
    },
    distance () { return 1 },
    heuristic () { return 1 },
    hash (node) { return node.id }
  }).path[1]
}



function flood (currentNode, message) {
  let { messageId, sourceId, destinationId } = message

  if (!currentNode.messagesReceived) {
    currentNode.messagesReceived = {}
  }

  if (currentNode.messagesReceived[messageId]) {
    return null
  }

  currentNode.messagesReceived[messageId] = true

  if (currentNode.id === destinationId) {
    console.log(`${currentNode.id} recieved ${messageId} from ${sourceId}`)
    return null
  }

  for (let peer of currentNode.peers) {
    console.log(`${currentNode.id} forwarded ${messageId}`)
    flood(peer, message)
  }
}



function route (currentNode, upstreamNode, message) {
  let { messageId, sourceId, destinationId } = message

  if (currentNode.id === destinationId) {
    console.log(`${currentNode.id} recieved ${messageId} from ${sourceId}`)
    return null
  }

  let downstreamNode = routingAlgorithm(currentNode, destinationId)
  route(downstreamNode, currentNode, message)

  if (upstreamNode) {
    console.log(`${currentNode.id} forwarded ${messageId} to ${downstreamNode.id} for ${upstreamNode && upstreamNode.id}`)
    updateOwed(currentNode, upstreamNode, message)
  }
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
  creditor.receivable[debtor.id][destinationId].messages = creditor.receivable[debtor.id][destinationId].messages || 0

  // Increment number of unpaid messages
  let numberOfMessages = creditor.receivable[debtor.id][destinationId].messages + 1
  // Get destination rate or use unknown destination rate of 10
  let messageRate = (creditor.destinationRates &&
    creditor.destinationRates[destinationId] || 10) + creditor.cost

  // Update amounts owed to creditor
  creditor.receivable[debtor.id][destinationId] = { numberOfMessages, messageRate }

  // Make payment request if neccesary
  if (numberOfMessages > 2) {
    makePayment(
      debtor,
      creditor,
      { destinationId, numberOfMessages, messageRate }
    )
  }
}



function makePayment (payer, payee, paymentRequest) {
  payer.destinationRates = payer.destinationRates || {}
  payer.destinationRates[paymentRequest.destinationId] = paymentRequest.messageRate

  let cost = paymentRequest.numberOfMessages * paymentRequest.messageRate
  payer.balance = payer.balance - cost
  payee.balance = payee.balance + cost
  console.log(`${payer.id} paid ${payee.id} ${cost}`)

  payee.receivable[payer.id][paymentRequest.destinationId].numberOfMessages = 0
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


for (let key in network) {
  let node = network[key]
  node.peers = node.peers.map(peer => peer.id)
}

console.log(JSON.stringify(network, null, 2))
