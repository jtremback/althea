require('babel/polyfill');
const aStar = require('a-star')

let network = {
  A: { id: 'A', peers: ['C'], balance: 10 },
  B: { id: 'B', peers: ['D'], balance: 10 },
  C: { id: 'C', peers: ['A', 'D'], balance: 10 },
  D: { id: 'D', peers: ['B', 'C', 'E', 'F'], balance: 10 },
  E: { id: 'E', peers: ['D', 'F', 'G'], balance: 10 },
  F: { id: 'F', peers: ['D', 'E', 'G'], balance: 10 },
  G: { id: 'G', peers: ['E', 'F'], balance: 10 }
}

function addPeers (network) {
  for (let node in network) {
    node = network[node]
    let peersMap = node.peers.reduce((acc, peer) => {
      peer = network[peer]
      acc[peer.id] = peer
      return acc
    }, {})
    node.peers = peersMap
  }

  return network
}

network = addPeers(network)

function routingAlgorithm (node, destinationId) {
  return aStar({
    start: node,
    isEnd (node) { return node.id === destinationId },
    neighbor (node) {
      let peers = []
      for (let peer in node.peers) {
        peers.push(network[peer])
      }
      return peers
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

  console.log(`${currentNode.id} forwarded ${messageId} to ${downstreamNode} for ${upstreamNode.id}`)
  updateOwed(currentNode, upstreamNode, message)
}



function updateOwed (currentNode, lastHop, message) {
  let { messageId, sourceId, destinationId } = message

  currentNode.owed = currentNode.owed || {}
  currentNode.owed[lastHop.id] = currentNode.owed[lastHop.id] || {}
  currentNode.owed[lastHop.id][destinationId] = currentNode.owed[lastHop.id][destinationId] || {}
  currentNode.owed[lastHop.id][destinationId].messages = currentNode.owed[lastHop.id][destinationId].messages || 0

  let numberOfMessages = currentNode.owed[lastHop.id][destinationId].messages + 1

  currentNode.owed[lastHop.id][destinationId] = {
    messages: numberOfMessages,
    messagePrice: 1
  }

  if (numberOfMessages > 2) {
    requestPayment(
      lastHop,
      currentNode,
      { destinationId, messages: numberOfMessages, messagePrice: 1 }
    )
  }
}



function requestPayment (currentNode, from, paymentRequest) {
  currentNode.destinationPrices = currentNode.destinationPrices || {}

  currentNode.destinationPrices[paymentRequest.destinationId] =
    paymentRequest.messagePrice

  let cost = paymentRequest.messages * paymentRequest.messagePrice

  currentNode.balance - cost
  from.balance + cost

  from.owed[currentNode][paymentRequest.destinationId].messages = 0
}



route(network.A, null, {
  messageId: 'foo',
  sourceId: 'A',
  destinationId: 'G'
})
route(network.A, null, {
  messageId: 'foo',
  sourceId: 'A',
  destinationId: 'G'
})
route(network.A, null, {
  messageId: 'foo',
  sourceId: 'A',
  destinationId: 'G'
})
route(network.A, null, {
  messageId: 'foo',
  sourceId: 'A',
  destinationId: 'G'
})
route(network.A, null, {
  messageId: 'foo',
  sourceId: 'A',
  destinationId: 'G'
})
route(network.A, null, {
  messageId: 'foo',
  sourceId: 'A',
  destinationId: 'G'
})
route(network.A, null, {
  messageId: 'foo',
  sourceId: 'A',
  destinationId: 'G'
})


for (let key in network) {
  let node = network[key]
  node.peers = node.peers.map(peer => peer.id)
}

console.log(JSON.stringify(network, null, 2))
