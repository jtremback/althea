// Allows us to use ES6 features like TCO
require('babel/polyfill');

const aStar = require('a-star')

const unknownDestinationRate = 10

const verbose = true

// let network = {
//   A: { id: 'A', peers: ['C'], marginRate: 1, balance: 0 },
//   B: { id: 'B', peers: ['D'], marginRate: 1, balance: 0 },
//   C: { id: 'C', peers: ['A', 'D'], marginRate: 1, balance: 0 },
//   D: { id: 'D', peers: ['B', 'C', 'E', 'F'], marginRate: 1, balance: 0 },
//   E: { id: 'E', peers: ['D', 'F', 'G'], marginRate: 1, balance: 0 },
//   F: { id: 'F', peers: ['D', 'E', 'G'], marginRate: 1, balance: 0 },
//   G: { id: 'G', peers: ['E', 'F'], marginRate: 1, balance: 0 }
// }

let network = {
  A: { id: 'A', peers: ['B'], marginRate: 1, balance: 0 },
  B: { id: 'B', peers: ['A', 'C'], marginRate: 1, balance: 0 },
  C: { id: 'C', peers: ['B', 'D'], marginRate: 1, balance: 0 },
  D: { id: 'D', peers: ['C', 'E'], marginRate: 1, balance: 0 },
  E: { id: 'E', peers: ['D', 'F'], marginRate: 1, balance: 0 },
  F: { id: 'F', peers: ['E', 'G'], marginRate: 1, balance: 0 },
  G: { id: 'G', peers: ['E'], marginRate: 1, balance: 0 }
}



function initNodes (network) {
  for (let nodeId in network) {
    let node = network[nodeId]

    // Add properties which are irrelevant to the network spec, but needed for
    // network operation
    node.receivable = {}
    node.destinationRates = {}
    node.totalMessagesForwarded = 0

    // Replace array of peer ids with object of actual peers
    node.peers = node.peers.reduce((peerMap, peerId) => {
      peerMap[peerId] = network[peerId]
      return peerMap
    }, {})
  }
}



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
    verbose && console.log(`${currentNode.id} received ` + JSON.stringify(message))
    return null
  }

  let downstreamNode = routingAlgorithm(currentNode, destinationId)

  verbose && console.log(`${currentNode.id} -> ${downstreamNode.id} ` + JSON.stringify(message))

  if (upstreamNode) {
    currentNode.totalMessagesForwarded = currentNode.totalMessagesForwarded + 1
    updateOwed(currentNode, upstreamNode, message)
  }

  route(downstreamNode, currentNode, message)
}



function updateOwed (creditor, debtor, { destinationId }) {
  // Create data structure holding amounts owed to creditor per debtor
  creditor.receivable[debtor.id] = creditor.receivable[debtor.id] || {}
  creditor.receivable[debtor.id][destinationId] = creditor.receivable[debtor.id][destinationId] || 0

  // Increment number of unpaid messages
  let numberOfMessages = creditor.receivable[debtor.id][destinationId] + 1

  // Update amounts owed to creditor
  creditor.receivable[debtor.id][destinationId] = numberOfMessages

  // Make payment request if neccesary
  if (numberOfMessages > 5) {
    makePayment(
      debtor,
      creditor,
      {
        destinationId,
        numberOfMessages,
        messageRate: calculateMessageRate(creditor, destinationId)
      }
    )
  }
}



function makePayment (payer, payee, paymentRequest) {
  // Record cost of the destination for future reference
  payer.destinationRates[paymentRequest.destinationId] = paymentRequest.messageRate

  // Calculate txAmount and update balances
  let txAmount = paymentRequest.numberOfMessages * paymentRequest.messageRate
  payer.balance = payer.balance - txAmount
  payee.balance = payee.balance + txAmount

  verbose && console.log(`${payer.id} paid ${payee.id} ${txAmount}`)

  payee.receivable[payer.id][paymentRequest.destinationId] = 0
}



function calculateMessageRate (creditor, destinationId) {
  // If the destination is a peer, charge only the margin rate
  if (creditor.peers[destinationId]) {
    return creditor.marginRate
  }

  // If the destination rate is known, charge margin rate plus destination rate
  if (creditor.destinationRates[destinationId]) {
    return creditor.destinationRates[destinationId] + creditor.marginRate
  }

  // If the destination rate is unknown,
  // charge margin rate plus unknown destination rate
  return unknownDestinationRate + creditor.marginRate
}



// This closes out all receivable accounts
function closeOut (network) {
  for (let nodeId in network) {
    let currentNode = network[nodeId]
    let receivable = currentNode.receivable
    if (receivable) {
      for (let peerId in receivable) {
        for (let destinationId in receivable[peerId]) {
          makePayment(
            currentNode.peers[peerId],
            currentNode,
            {
              destinationId,
              numberOfMessages: receivable[peerId][destinationId],
              messageRate: calculateMessageRate(currentNode, destinationId)
            }
          )
        }
      }
    }
  }
}



function decircularize () {
  for (let nodeId in network) {
    let node = network[nodeId]
    let peerArray = []
    for (let peerId in network[nodeId].peers) {
      peerArray.push(peerId)
    }
    node.peers = peerArray
  }
}



initNodes(network)

for (var i = 0; i < 100; i++) {
  route(network.A, null, {
    messageId: i + '',
    sourceId: 'A',
    destinationId: 'G'
  })
}


// closeOut(network)
decircularize(network)
console.log(JSON.stringify(network, null, 2))
