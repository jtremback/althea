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

//          fromChannel
//       $receiveAmount
//            \
//      fromChannel-$receiveAmount-(node)-$sendAmount--> toChannel
//            /
//       $receiveAmount
//          fromChannel
//   // toChannel has a one-to-many relationship with fromChannels
//   // Another routing message that is received with the same hash and a lower
//   // sendAmount will override this one.
//   routingTable: {
//     [hash]: {
//       hash,
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

//   exchangeRates: {
//     ['asset' + '/' + 'asset']: 'numerator' + '/' + 'denominator',
//   },

//   fee: {
//     amount,
//     denomination
//   }

//   // Source has these
//   // These are created by initializeRoute and checked by forwardRoutingMessage
//   pendingRoutes: {
//     [hash]: {
//       secret,
//     }
//   },

//   // Destination has these
//   // These are created by sendRoutingMessage and checked by receivePayment
//   pendingPayments: {
//     [hash]: {
//       secret,
//     }
//   },

//   channels: {
//     [channelId]: {
//       channelId,
//       ipAddress,
//       denomination,
//       myBalance,
//       theirBalance
//     }
//   }

// }

// routingMessage: {
//   hash: xyz123,
//   amount: 100,
//   channelId: A
// }

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
        'USD/EUR': '1/1',
        'EUR/USD': '1/1'
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
      exchangeRates: {},
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
      exchangeRates: {},
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

function calculateLastStats (packetStatsArray, n) {
  let lastPacketStats = packetStatsArray.slice(packetStatsArray.length - n)
  let reducedStats = lastPacketStats.reduce((acc, item) => {
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
