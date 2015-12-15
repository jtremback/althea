const ui = require('./ui.js')
const randomGraph = require('randomgraph')
const tm = 1000
const cardLength = 10
const cardDepth = 10
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


// node: {
//   feeTable: {
//     'A/B': {
//       exchangeRate: '2/1',
//       fixedFee: 0.01
//     }
//   },
//   cardTable: {
//     [paymentHash]: {
//       position: 3,
//       value: 2
//     }
//   },
//   pendingRoutes: {
//     [paymentHash/fromChannel]: {
//       fromChannel,
//       amountToReceive,
//       toChannel,
//       amountToSend,
//       paymentHash
//     }
//   },
//   channels: {
//     A: {
//       channelId: A,
//       myBalance: 10,
//       theirBalance: 10,
//       denomination: 'USD'
//     }
//     B: {
//       channelId: B,
//       myBalance: 20,
//       theirBalance: 5,
//       denomination: 'EUR'
//     }
//   }
// }
//
// routingMessage: {
//   amount: 100,
//   denomination: USD,
//   paymentHash: xyz123,
//   channelId: A,
//   markedCard: [
//     ...
//   ]
// }


// $/€:2/1
//   (1) $20-A-$10 (3) $30-D-$10 (4)
//     €5        $40
//      |        /
//      B       C
//       \     /
//       €10 $30
//         (2)
//       €/$:1/1

let basicGraph = {
  nodes: {
    1: {
      ipAddress: 1,
      xchgRates: {
        'B/A': '1/2',
        'A/B': '2/1'
      },
      channels: [
        {
          channelId: 'A',
          ipAddress: 3,
          denomination: 'USD',
          myBalance: 20,
          theirBalance: 10
        },
        {
          channelId: 'B',
          ipAddress: 2,
          denomination: 'EUR',
          myBalance: 5,
          theirBalance: 10
        }
      ]
    },
    2: {
      ipAddress: 2,
      xchgRates: {
        'B/C': '24/23',
        'C/B': '24/23'
      },
      channels: [
        {
          channelId: 'B',
          ipAddress: 1,
          denomination: 'EUR',
          myBalance: 10,
          theirBalance: 5
        },
        {
          channelId: 'C',
          ipAddress: 3,
          denomination: 'USD',
          myBalance: 30,
          theirBalance: 40
        }
      ]
    },
    3: {
      ipAddress: 3,
      xchgRates: {
        'B/A': '24/23',
        'A/B': '24/23'
      },
      channels: [
        {
          channelId: 'A',
          ipAddress: 1,
          denomination: 'USD',
          myBalance: 10,
          theirBalance: 20
        },
        {
          channelId: 'C',
          ipAddress: 2,
          denomination: 'USD',
          myBalance: 40,
          theirBalance: 30
        },
        {
          channelId: 'D',
          ipAddress: 4,
          denomination: 'USD',
          myBalance: 30,
          theirBalance: 10
        }
      ]
    },
    4: {
      ipAddress: 4,
      xchgRates: {},
      channels: [
        {
          channelId: 'D',
          ipAddress: 3,
          denomination: 'USD',
          myBalance: 10,
          theirBalance: 30
        }
      ]
    }
  }
}

function channelChecker (nodes) {
  for (let ipAddress in nodes) {
    let node = nodes[ipAddress]
    for (let myChannel of node.channels) {
      let neighbor = nodes[myChannel.ipAddress]
      if (!neighbor) {
        throw new Error(ipAddress + ' ' + myChannel.channelId + ' ' + '!neighbor')
      }

      let theirChannel = neighbor.channels[myChannel.channelId]
      if (!theirChannel) {
        throw new Error(ipAddress + ' ' + myChannel.channelId + ' ' + '!theirChannel')
      }
      if (node.ipAddress !== theirChannel.ipAddress) {
        throw new Error(ipAddress + ' ' + myChannel.channelId + ' ' + 'node.ipAddress !== theirChannel.ipAddress' + ' ' + node.ipAddress + ' ' + theirChannel.ipAddress)
      }
      if (myChannel.denomination !== theirChannel.denomination) {
        throw new Error(ipAddress + ' ' + myChannel.channelId + ' ' + 'myChannel.denomination !== theirChannel.denomination' + ' ' + myChannel.denomination + ' ' + theirChannel.denomination)
      }
      if (myChannel.myBalance !== theirChannel.theirBalance) {
        throw new Error(ipAddress + ' ' + myChannel.channelId + ' ' + 'myChannel.myBalance !== theirChannel.theirBalance' + ' ' + myChannel.myBalance + ' ' + theirChannel.theirBalance)
      }
      if (myChannel.theirBalance !== theirChannel.myBalance) {
        throw new Error(ipAddress + ' ' + myChannel.channelId + ' ' + 'myChannel.theirBalance !== theirChannel.myBalance' + ' ' + myChannel.theirBalance + ' ' + theirChannel.myBalance)
      }
    }
  }
}

// let network = smallRandomGraph
let network = basicGraph

function initNodes (network) {
  for (let ipAddress in network.nodes) {
    let node = network.nodes[ipAddress]

    node.ipAddress = ipAddress
    node.pendingRoutes = {}
    node.cardTable = {}
  }
}

function findRoute (self, amount, denomination) {
  for (let channel of self.channels) {
    if (channel.denomination === denomination &&
      channel.theirBalance > amount) {



      let routingMessage = {
        amount,
        denomination,
        markedCard: makeMarkedCard(cardLength, cardDepth, self.cardTable)
      }

      forwardRoutingMessage(
        network.nodes[channel.channelId],
        routingMessage
      )
    }
  }
}



function forwardRoutingMessage (self, routingMessage) {
  // Check for existing route in pending routes table
  let existingRoute = self.pendingRoutes[
    routingMessage.paymentHash + '/' + routingMessage.channelId
  ]

  if (
    // If no route exists
    !existingRoute
    // Or the new amount to send is lower
    || (existingRoute.amountToSend > routingMessage.amount)) {

    // Initialize pending route entry
    let pendingRoute = {
      paymentHash: routingMessage.paymentHash,

      toChannel: routingMessage.channelId,
      amountToSend: routingMessage.amount,

      fromChannels: {}
    }

    // And broadcast to eligible neighbors
    for (let fromChannel of self.channels) {
      // Remember that the routingMessage comes *from* the node that the payment
      // will be going *to*
      let newAmount = getNewAmount(
        self,
        fromChannel.channelId,
        routingMessage.channelId,
        routingMessage.amount
      )

      // If denomination matches
      if (fromChannel.denomination === routingMessage.denomination
        // And they have enough in their side of the channel
        && fromChannel.theirBalance > newAmount
        // And we have not marked the card yet
        && checkMarkedCard(routingMessage.card, routingMessage.paymentHash, self.cardTable)) {

        // Add amount to be payed into fromChannels list
        pendingRoute.fromChannels[fromChannel.channelId] = newAmount

        // Forward to neighbor
        forwardRoutingMessage(
          network.nodes[fromChannel.channelId],
          routingMessage
        )
      }
    }

    // Save in the pending routes table
    self.pendingRoutes[routingMessage.paymentHash + '/' + routingMessage.channelId] = pendingRoute
  }
}

function getNewAmount (self, from, to, oldAmount) {
  // convert channel combo into string format, get from/to from table
  // split result into numerator and denominator
  let [numerator, denominator] = self.xchgRates[from + '/' + to].split('/')
  return oldAmount * (numerator / denominator)
}

// function transmit (neighbor, self, sources) {
//   // Check if edge cost is infinity
//   if (network.edges[self.id + '->' + neighbor.id].cost === Infinity) {
//     throw new Error()
//   }

//   setTimeout(() => {
//     receiveUpdate(neighbor, self, infinityJSON.stringify(sources))
//   }, Math.random() * 0.1 * tm)
// }



function makeMarkedCard (cardLength, cardDepth, cardTable) {
  return new Array(cardLength).map((item) => {
    return Math.floor(Math.random() * cardDepth)
  })
}

function checkMarkedCard (card, paymentHash, cardTable) {
  let { position, value } = cardTable[paymentHash]
  return card[position] === value
}

function markMarkedCard (card, paymentHash, cardTable) {
  let position = Math.floor(Math.random() * card.length)
  let value = Math.floor(Math.random() * cardDepth)
  cardTable[paymentHash] = {
    position,
    value
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
    return forwardDataPacket(network.nodes[source.nextHop], packet)
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
      return forwardDataPacket(network.nodes[source.nextHop], packet)
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

channelChecker(basicGraph.nodes)

// ui.drawNetwork(network)

initNodes(network)

// for (let nodeId in network.nodes) {
//   setInterval(() => {
//     setTimeout(() => {
//       sendPeriodicUpdate(network.nodes[nodeId])
//     }, Math.random() * tm)
//   }, tm)
// }

// setInterval(() => {
//   randomPing(network)
// }, tm / 10)

// setInterval(() => {
//   console.log(calculateLastStats(packetStatsArray, 10))
// }, tm)

// function f (i) {
//   let n = 1
//   for (; i >= 2; i--) {
//     n = n * 2
//   }
//   return n
// }


