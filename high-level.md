// Draft 1
# Althea

All nodes are connected in a network. To send a piece of data from one node to another, a route must be found through the network. At any given time, a node participating in the network is either an receiver (the ultimate destination of the packet), a sender (the originator of the packet), or an intermediary node.


## Customer satisfaction (Jae)

Nodes connect to the nodes around them, they pay upstream nodes to route packets. They are payed to route packets from downstream. The routing algorithm tells the node where to send the packet. The node either loses money or profits based on how expensive the chosen upstream node is vs how much it recieved from the downstream node. Nodes can then adjust the prices they charge specific downstream nodes based on prior profitability of that downstream.


## Connecting the circuit (Zack)

The sender sends a packet like this to the peer that the routing algo tells it to:

header:
address of receiver
hash of hashlock secret

encrypted box:
hashlock secret
payload

Each peer along the route takes note of the hashlock secret's hash. It uses the hashlock secret's hash to update a channel with its upstream peer, placing payment for the route in escrow. When the receiver receives the packet, it decrypts the packet and passes the hashlock secret back downstream. The downstream nodes can use the hashlock secret to open the hashlock and get their payment. This way, if a packet is dropped, the sender does not pay for the route. Nodes evaluate peers based on their price and reliability. A node is incentivized to route packets to the lowest priced, most reliable node in order to get payed.


// Draft 2
## Combination

Nodes maintain **edges** with other nodes. An edge consists of a wired or wireless connection, over which there is a payment channel[1] between the nodes. A node connected to another node by an edge is referred to as a **peer** of that node. Each node stores information about the other nodes it is connected to.  The channel can be updated