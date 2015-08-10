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



// Probably uneccesary thanks anthony
// Maybe actually neccesary
#### Peer ranking algorithm
This is an algorithm that ranks peers based on their past reliability and the amount they are willing to pay per packet. It is a part of the system, however, it is not specified here. It is in a node's direct financial interest to use the best peer ranking algorithm possible. We expect that there will be an active ecosystem of different algorithms. We model it as:

`f(address) -> `

### High level overview
Nodes maintain edges with other nodes. An edge consists of a wired or wireless connection, over which there is a payment channel between the nodes. Each node stores information about the other nodes it is connected to. When a node wishes to send a packet to some destination it generates a hashlock secret and the corresponding hash. It encrypts the hashlock secret with the destination's public key and places it in the packet header along with the hashlock hash. It then consults its routing protocol to find the node most likely to


# Draft 3

Incentived routing.

We want to design a system that will allow transmitters of data to be compensated in a decentralized manner. The goal is for paries who want to to send data to pay into the system, while parties that are providing the service of transmitting pull money out.

Currently the internet consists of two seperate systems- the network that moves data around with wires and radio, and the collection of contracts and agreements that pay for it. The fact that it is generally only possible to pay for internet access with contracts and service agreements greatly favors large monopolies.


mini-isp

The existing internet works because ISPs have agreements with one another to route data. The end user has an agreement with their ISP that they will pay an amount of money to send packets to, and recieve packets from the entire internet.

The ISP has agreements with other ISPs to route traffic to the entire internet. The functioning and traffic of the network is continually monitored by employees of the ISP and disputes are resolved between people and in court.

A decentralized system will not have the benefit of network adminstrators and lawyers in each node.


per-packet

I will start with a simple protocol with serious shortcomings, and correct vulnerabilities and flaws in it iteratively.

v1
Each node maintains a channel between it and every one of its peers. When sending or forwarding a packet to a peer, the node attaches a payment transaction to it. The channel between the nodes is updated with this transaction. If a node is dropping packets, the routing algorithm will not route through it.

v0
Each node maintains a channel between it and every one of its peers, and meters the amount of data sent and recieved from it. periodically


### Mini ISP

- maybe a connection based protocol is better
- the channel is essentially a connection
- both nodes meter traffic sent
- payments must not be per packet
- if they disagree on the amount of traffic sent, the channel can just deal with that disagreement
- payments can be for whole KBs
- there can be a margin of fuzziness
- node must have a way to assess the reliability of each peer
- client node must have reliable peers for a good UX/use case etc
- intermediary node must have reliable peers, or its peers will not forward packets to it.
- as long as nodes can reasonably rank peers on reliability, and do not forward to unreliable nodes, the network should be good.
- Granular, per packet routing is done by the routing algorithm, but our algorithm can still blacklist unreliable peers to avoid wasting money.
- rating can happen with random sampling etc
- sender and receiver coordinate via a somewhat seperate protocol to assess the quality of the connection.
- the difficulty lies in associating a low-quality connection to any specific peer in order to blacklist them.
- wait... isn't that what the routing protocol does?


### Pay to receive

- nodes pay to receive data
- isnt this vulnerable to DOS?
- a node can refuse to pay for junk packets
- this seems inferior
- pay to send is not vulnerable to DOS, unlike the internet. cool.


### Node chains

- Nodes publish state on their personal blockchains
- The merklelized state of everything they've been doing and everything their peers have been doing.
-
