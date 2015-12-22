const ui = require('./ui.js')
const randomGraph = require('randomgraph')
const sha3 = require('js-sha3')

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

function hashFn (secret) {
  return sha3.keccak_224(secret)
}

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
//          fromChannel
//       $receiveAmount
//            \
//      fromChannel-$receiveAmount-(node)-$sendAmount--> toChannel
//            /
//       $receiveAmount
//          fromChannel
//
//  // toChannel has a one-to-many relationship with fromChannels
//  // Another routing message that is received with the same hash and a lower
//  // sendAmount will override this one.
//
//   routingTable: {
//     [hash]: {
//       hash,
//       isSource,
//       isDestination,
//       toChannel,
//       sendAmount, // This is how much the next step must recieve to
//                   // convey the payment further. Non-negotiable.
//       fromChannels: {
//         [channelId]: {
//           receiveAmount // We determine this
//         }
//       },
//     }
//   },

                // // Source has these
                // // These are created by initializeRoute and checked by forwardRoutingMessage
                // pendingRoutes: {
                //   [hash]: {
                //     hash,
                //     amount,
                //     secret,
                //   }
                // },

                // // Destination has these
                // // These are created by sendRoutingMessage and checked by receivePayment
                // pendingPayments: {
                //   [hash]: {
                //     hash,
                //     amount,
                //     secret,
                //   }
                // },

//   lockedPayments:??????

//   channels: {
//     A: {
//       channelId: A,
//       myBalance: 10,
//       theirBalance: 10,
//     }
//     B: {
//       channelId: B,
//       myBalance: 20,
//       theirBalance: 5,
//     }
//   }
// }
//
// routingMessage: {
//   hash: xyz123,
//   amount: 100,
//   channelId: A
// }
//
// hashlockedPayment: {
//   hash: xyz123,
//   amount: 100,
//   channelId: A
// }
//


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
      exchangeRates: {
        'USD/EUR': '1/2',
        'EUR/USD': '2/1'
      },
      fee: {
        amount: 0.01,
        denomination: 'USD'
      },
      channels: {
        A: {
          channelId: 'A',
          ipAddress: 3,
          denomination: 'USD',
          myBalance: 20,
          theirBalance: 10
        },
        B: {
          channelId: 'B',
          ipAddress: 2,
          denomination: 'EUR',
          myBalance: 5,
          theirBalance: 10
        }
      }
    },
    2: {
      ipAddress: 2,
      exchangeRates: {
        'USD/USD': {
          rate: '1/1',
          fee: 0.01
        },
        'USD/EUR': {
          rate: '1/1',
          fee: 0.01
        },
        'EUR/USD': {
          rate: '1/1',
          fee: 0.01
        }
      },
      channels: {
        B: {
          channelId: 'B',
          ipAddress: 1,
          denomination: 'EUR',
          myBalance: 10,
          theirBalance: 5
        },
        C: {
          channelId: 'C',
          ipAddress: 3,
          denomination: 'USD',
          myBalance: 30,
          theirBalance: 40
        }
      }
    },
    3: {
      ipAddress: 3,
      exchangeRates: {
        'USD/USD': {
          rate: '1/1',
          fee: 0.01
        },
      },
      channels: {
        A: {
          channelId: 'A',
          ipAddress: 1,
          denomination: 'USD',
          myBalance: 10,
          theirBalance: 20
        },
        C: {
          channelId: 'C',
          ipAddress: 2,
          denomination: 'USD',
          myBalance: 40,
          theirBalance: 30
        },
        D: {
          channelId: 'D',
          ipAddress: 4,
          denomination: 'USD',
          myBalance: 30,
          theirBalance: 10
        }
      }
    },
    4: {
      ipAddress: 4,
      exchangeRates: {
        'USD/USD': {
          rate: '1/1',
          fee: 0.01
        },
      },
      channels: {
        D: {
          channelId: 'D',
          ipAddress: 3,
          denomination: 'USD',
          myBalance: 10,
          theirBalance: 30
        }
      }
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
    node.routingTable = {}
    node.cardTable = {}
  }
}

function initializePayment (self, to, amount, secret) {
  let hash = hashFn(secret)
  // Create routing table entry
  self.pendingRoutes[hash] = {
    hash,
    secret,
    amount
  }
}

function sendRoutingMessage (self, amount, secret) {
  let hash = hashFn(secret)
  // Create routing table entry
  self.pendingPayments[hash] = {
    hash,
    secret,
    amount,
  }

  let routingMessage = {
    amount,
    hash: hash(secret)
  }

  forwardRoutingMessage(
    self,
    routingMessage,
    { isDestination: true }
  )
}

// function forwardRoutingMessage (self, routingMessage, { isSource, isDestination }) {
//   // Choose the right table to save in
//   if (isSource) {
//     let table = self.pendingRoutes
//   } else if (isDestination) {
//     let table = self.pendingPayments
//   } else {
//     let table = self.routingTable
//   }

//   // Check for existing route in routing table
//   let existingRoute = self.routingTable[routingMessage.hash]

//   if (
//     (
//       // If no route exists
//       !existingRoute
//       // Or the new amount to send is lower
//       || (existingRoute.sendAmount > routingMessage.amount)
//     )
//     // And we are not the destination
//     && !existingRoute.isDestination
//   ) {
//     // Check if we are the source of the payment
//     if (existingRoute.isSource) {
//       receivedRoute(self, routingMessage)
//     } else {

//       // Initialize route
//       let route = {
//         hash: routingMessage.hash,

//         toChannel: routingMessage.channelId,
//         sendAmount: routingMessage.amount,

//         fromChannels: {}
//       }

//       // And broadcast to eligible neighbors
//       for (let fromChannel of self.channels) {
//         let fromChannel = self.channels
//         // Remember that the routingMessage comes *from* the
//         // node that the payment will be going *to*
//         let newAmount = getNewAmount(
//           self,
//           fromChannel.channelId,
//           routingMessage.channelId,
//           routingMessage.amount
//         )

//         // If they have enough in their side of the channel
//         if (fromChannel.theirBalance > newAmount
//           // And we have not marked the card yet
//           // && checkMarkedCard(routingMessage.card, routingMessage.hash, self.cardTable)
//         ) {

//           // Add amount to be payed into fromChannel list
//           route.fromChannels[fromChannel.channelId] = {
//             receiveAmount: newAmount
//           }

//           // Forward to neighbor
//           forwardRoutingMessage(
//             network.nodes[fromChannel.channelId],
//             self,
//             {
//               amount: newAmount,
//               hash: routingMessage.hash,
//               // markedCard: markMarkedCard(routingMessage.card, routingMessage.hash, self.cardTable)
//             }
//           )
//         }
//       }

//       // Save in the routing table
//       self.routingTable[routingMessage.hash] = route
//     }
//   }
// }

function exchange () {}

// Steps when initializing payment:
// 1. Send payment initialization to destination
// 2. Record details in pendingRoutes.
//    - hash
function initializePayment (self, destination, { amount, denomination }) {
  let secret = String(Math.random()).slice(2)
  let hash = hashFn(secret)

  self.pendingRoutes[hash] = {
    secret
  }

  // This is what the destination does when it gets the payment initialization
  sendRoutingMessage(destination, { secret, amount, denomination })
}

// Steps when sending a routing message:
// 1. Record details in pendingPayments.
//    - secret
// 2. Determine prices for neighbors
// 3. Send to neighbors with enough money
// 4. Record details in routingTable
//    - hash
//    - fromChannels
//      - channelId
//      - receiveAmount
function sendRoutingMessage (self, { secret, amount, denomination }) {
  let hash = hashFn(secret)

  // Create pendingPayments entry
  self.pendingPayments[hash] = {
    secret
  }

  // Create routingTable entry
  let route = {
    hash,
    fromChannels: {}
  }

  // Iterate through channels
  for (let fromChannelId in self.channels) {
    let fromChannel = self.channels[fromChannelId]

    // Convert to fromChannel's denomination
    let newAmount = exchange(amount, denomination, fromChannel.denomination)

    // If they have enough in their side of the channel
    if (fromChannel.theirBalance > amount) {
      receiveRoutingMessage(network.nodes[fromChannel.ipAddress], {
        hash,
        amount: newAmount,
        denomination: fromChannel.denomination,
        channelId: fromChannelId
      })

      // Save fromChannel details
      route.fromChannels[fromChannelId] = {
        channelId: fromChannelId,
        receiveAmount: newAmount
      }
    }
  }

  // Save in routing table
  self.routingTable[hash] = route
}

// Steps when sending a routing message:
// 1. Determine prices for neighbors
// 2. Send to neighbors with enough money
// 3. Record details in routingTable
//    - hash
//    - toChannel
//    - sendAmount
//    - fromChannels
//      - channelId
//      - receiveAmount
function forwardRoutingMessage (self, { hash, amount, channelId }) {
  let toChannel = self.channels[channelId]

  // Create routingTable entry
  // Remember that the payment goes *to* the neighbor that the routing message is *from*
  let route = {
    hash,
    toChannel: channelId,
    sendAmount: amount,
    fromChannels: {},
  }

  // Iterate through channels
  for (let fromChannelId in self.channels) {
    let fromChannel = self.channels[fromChannelId]

    // Convert to fromChannel's denomination
    let newAmount = exchange(amount, toChannel.denomination, fromChannel.denomination)
      // Convert fee and add that as well
      + exchange(self.fee.amount, self.fee.denomination, fromChannel.denomination)

    // If they have enough in their side of the channel
    if (fromChannel.theirBalance > newAmount) {
      receiveRoutingMessage(network.nodes[fromChannel.ipAddress], {
        hash,
        amount: newAmount,
        denomination: fromChannel.denomination,
        channelId: fromChannelId
      })

      // Save fromChannel details
      route.fromChannels[fromChannelId] = {
        channelId: fromChannelId,
        receiveAmount: newAmount
      }
    }
  }

  // Save in routing table
  self.routingTable[hash] = route
}

// Steps when receiving a routing message:
// 1. Check if we are the source in pendingRoutes.
//    - If we are, output.
//    - If not, forward.
function receiveRoutingMessage (self, { hash, amount, channelId }) {
  if (self.pendingRoutes[hash]) {
    console.log('received pending route')
  } else {
    forwardRoutingMessage(self, { hash, amount, channelId })
  }
}

// Steps when sending a payment:
// 1. Look up in routing table
// 2. Send correct amount to the channel
function sendPayment (self, { hash, channelId }) {
  let route = self.routingTable[hash]
  let fromChannel = route.fromChannels[channelId]

  forwardPayment(network.nodes[fromChannel.ipAddress], {
    hash,
    amount: route.sendAmount,
    channelId: route.toChannel
  })
}

// Steps when receiving a payment
// 1. Check if amount is correct in routing table
// 2. Check if we are the destination by checking pendingPayments
//    - If we are, delete from pendingPayments and output.
//    - If not, forward.
function forwardPayment (self, { hash, amount, channelId }) {
  let route = self.routingTable[hash]
  let fromChannel = route.fromChannels[channelId]

  if (fromChannel.amount === amount) {
    // Are we the destination?
    if (self.pendingPayments[hash]) {
      console.log('received payment')
    } else {
      forwardPayment(network.nodes[fromChannel.ipAddress], {
        hash,
        amount: route.sendAmount,
        channelId: route.toChannel
      })
    }
  }
}



function forwardRoutingMessage (self, routingMessage) {
  // Initialize route
  let route = {
    hash: routingMessage.hash,

    toChannel: routingMessage.channelId,
    sendAmount: routingMessage.amount,

    fromChannels: {}
  }

  // And broadcast to eligible neighbors
  for (let fromChannel of self.channels) {
    let fromChannel = self.channels
    // Remember that the routingMessage comes *from* the
    // node that the payment will be going *to*
    let newAmount = getNewAmount(
      self,
      fromChannel.channelId,
      routingMessage.channelId,
      routingMessage.amount
    )

    // If they have enough in their side of the channel
    if (fromChannel.theirBalance > newAmount
      // And we have not marked the card yet
      // && checkMarkedCard(routingMessage.card, routingMessage.hash, self.cardTable)
    ) {

      // Add amount to be payed into fromChannel list
      route.fromChannels[fromChannel.channelId] = {
        receiveAmount: newAmount
      }

      // Forward to neighbor
      forwardRoutingMessage(
        network.nodes[fromChannel.channelId],
        self,
        {
          amount: newAmount,
          hash: routingMessage.hash,
          // markedCard: markMarkedCard(routingMessage.card, routingMessage.hash, self.cardTable)
        }
      )
    }
  }

  // Save in the routing table
  self.routingTable[routingMessage.hash] = route
}

// When a route is received, the node receiving the route must decide whether
// or not to accept the route. If the node wants to accept the route, it sends
// payment locked with that hash to the node that sent it the routing message.
// At first, let's just have the node accept the first route it gets.

function receivedRoute (self, from, routingMessage) {
  sendPayment(self, routingMessage)
}

function sendPayment (self, routingMessage) {
  forwardPayment(
    network.nodes[self.channels[routingMessage.channelId].ipAddress],
    { hash: routingMessage.hash,
      amount: routingMessage.amount,
      channel: routingMessage.channelId,
    }
  )
}

function forwardPayment (self, payment) {
  let route = self.routingTable[payment.hash]
  // Check if we are the destination
  if (route.toChannel) {
    receivedPayment(self, payment)
  } else {
    // If the amount is correct
    if (payment.amount === route.fromChannels[payment.channel].receiveAmount) {
      // Send a payment to the correct neighbor
      forwardPayment(
        // Check in channels list for the ip address, send to it
        network.nodes[self.channels[route.toChannel].ipAddress],
        { hash: route.hash,
          amount: route.sendAmount,
          channel: route.toChannel,
        }
      )
    }
  }
}

function receivedPayment (self, payment) {
  console.log('receivedPayment', self, payment)
}

function getNewAmount (self, from, to, oldAmount) {
  // convert channel combo into string format, get from/to from table
  // split result into numerator and denominator, convert from strings to numbers
  let [numerator, denominator] = self.exchangeRates[from + '/' + to].split('/').map(n => Number(n))
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
  card[position] = value
  return card
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


