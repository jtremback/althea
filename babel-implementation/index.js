let seqno = 0

// [deviceId]: {
//   deviceId: String,
//   helloSeqno: Number
// }
let interfaceTable = new Map()

// [interface + address]: {
//   interface: String,
//   address: String,
//   helloHistory: [Boolean],
//   cost: Number
// }
let neighborTable = new Map()

// [prefix + routerId]: {
//    prefix: String,
//    routerId: String,
//    seqno: Number,
//    metric: Number
// }
let sourceTable = new Map()

// {
//   source: (prefix + routerId),
//   neighbor: (interface + address),
//   metric: Number,
//   seqno: Number
// }
let routeTable = new Map()

// [prefix]: {
//   prefix: String,
//   routerId: String,
//   seqno: Number,
//   neighbor: (interface + address),
//   resend: Number
// }
let pendingRequestsTable = new Map()
