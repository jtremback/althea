# Draft 1

All nodes are connected in a network. To send a piece of data from one node to another, a route must be found through the network. At any given time, a node participating in the network is either an receiver (the ultimate destination of the packet), a sender (the originator of the packet), or an intermediary node.


### Customer satisfaction (Jae)

Nodes connect to the nodes around them, they pay upstream nodes to route packets. They are payed to route packets from downstream. The routing algorithm tells the node where to send the packet. The node either loses money or profits based on how expensive the chosen upstream node is vs how much it recieved from the downstream node. Nodes can then adjust the prices they charge specific downstream nodes based on prior profitability of that downstream.


### Connecting the circuit (Zack)

The sender sends a packet like this to the peer that the routing algo tells it to:

header:
address of receiver
hash of hashlock secret

encrypted box:
hashlock secret
payload

Each peer along the route takes note of the hashlock secret's hash. It uses the hashlock secret's hash to update a channel with its upstream peer, placing payment for the route in escrow. When the receiver receives the packet, it decrypts the packet and passes the hashlock secret back downstream. The downstream nodes can use the hashlock secret to open the hashlock and get their payment. This way, if a packet is dropped, the sender does not pay for the route. Nodes evaluate peers based on their price and reliability. A node is incentivized to route packets to the lowest priced, most reliable node in order to get payed.


# Draft 2

### Terms

#### Routing protocol
In this paper we refer to ad-hoc "mesh" routing protocols. This type of protocol manages connections with peers and exchanges information enabling nodes to find the best routes. Routing has been an area of extensive and ongoing research for many decades, and this paper does not deal with improvements to routing. The system described in this paper could concievably work with many different routing protocols. For simplicity, we will model the underlying routing protocol as:

`f(address) -> nextHop`

where `f` is the routing protocol, `address` is the address of the destination, and `nextHop` is the optimal peer to route a packet with a given address to.

#### Payment channel
Payment channels are a cryptocurrency technology which allow nodes to exchange funds without putting all transactions on the blockchain. Transactions take the form of IOUs which are updated with the current account balance between two nodes. These IOUs are only put on the global blockchain if there is a dispute or one of the nodes disappears. This allows a network of channels to process an almost unlimited number of transactions.

#### Hashlock
A hashlock transaction is a type of channel transaction that uses the hash of a secret to lock a transaction. The transaction is created with the hash, and can only be unlocked with the corresponding secret.

#### Peer ranking algorithm
This is an algorithm that ranks peers based on their past reliability and the amount they are willing to pay per packet. It is a part of the system, however, it is not specified here. It is in a node's direct financial interest to use the best peer ranking algorithm possible. We expect that there will be an active ecosystem of different algorithms. We model it as:

`f(address) -> `

### High level overview
Nodes maintain edges with other nodes. An edge consists of a wired or wireless connection, over which there is a payment channel between the nodes. Each node stores information about the other nodes it is connected to. When a node wishes to send a packet to some destination it generates a hashlock secret and the corresponding hash. It encrypts the hashlock secret with the destination's public key and places it in the packet header along with the hashlock hash. It then consults its routing protocol to find the node most likely to