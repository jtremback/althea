

# Draft 1

Goals:

- Nodes are able to collect payment to incentivize the creation of links
- Nodes sending packets pay for what they send
- Cheaper nodes for a given route are prioritized, ensuring a competitive market and avoiding exploits
- (optional) Nodes can pay more for prioritization over other traffic

All nodes are connected in a network. To send a piece of data from one node to another, a route must be found through the network. At any given time, a node participating in the network is either an receiver (the ultimate destination of the packet), a sender (the originator of the packet), or an intermediary node.


### Customer satisfaction (Jae)

Nodes connect to the nodes around them, they pay downstream nodes to route packets. They are payed to route packets from upstream. The routing algorithm tells the node where to send the packet. The node either loses money or profits based on how expensive the chosen downstream node is vs how much it recieved from the upstream node. Nodes can then adjust the prices they charge specific upstream nodes based on prior profitability of that upstream.


### Connecting the circuit (Zack)

The sender sends a packet like this to the peer that the routing algo tells it to:

header:
address of receiver
hash of hashlock secret

encrypted box:
hashlock secret
payload

Each peer along the route takes note of the hashlock secret's hash. It uses the hashlock secret's hash to update a channel with its downstream peer, placing payment for the route in escrow. When the receiver receives the packet, it decrypts the packet and passes the hashlock secret back upstream. The upstream nodes can use the hashlock secret to open the hashlock and get their payment. This way, if a packet is dropped, the sender does not pay for the route. Nodes evaluate peers based on their price and reliability. A node is incentivized to route packets to the lowest priced, most reliable node in order to get payed.


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


### Shopkeeper

- Nodes pay downstream nodes for for forwarding
- They charge their upstream nodes in proportion to the downstream nodes that they are forwarding to.
- For example:

```
A   D
 \ / D100
  C
 / \ D10
B   E
```

C is forwarding data for A and B, to D and E.
D charges D100 per kb. E charges D10 per kb. C wants to make D20 profit per kb.
A is sending 10 kb on a route going through D, and 90 kb on a route going through E.
B is sending 90 kb on a route going through D, and 10 kb on a route going through E.
C is forwarding 100kb to D at a cost of D10000, and 100kb through E at a cost of D1000
C charges A D1000 + D900
C charges B D9000 + D100
Corresponding to their usage of various downstream costs

### Mordor problem

```
A       D
 \     / D100
  C---F
 /     \ D10
B       E
```
Now there are additional nodes in the path, and the information about who is using what cost of link is lost. A now subsidizes B's expensive link. This attribute can be used to exploit the network by sending traffic to expensive links that you control. "Source cost" information must be backpropagated somehow. Any lag in backpropagation can result in other nodes temporarily subsidizing expensive links as the cost information propagates back.

There must be some way to propagate back source (or destination?) cost information, and stop the period where it is lagging from allowing nodes to subsidize link costs that they did not incur.


Model fully working system:
- Nodes have a table (Ta) of prices that they must pay downstream peers for packets from given sources.
- Nodes have a table (Tb) of prices that they are charging upstream peers for packets from given sources. This is derived from the table above by adding a markup.
- Packets coming from sources not in Tb will be charged at a fixed rate
- As soon as one packet from a source has passed through a node, the price payed for it is entered in Ta, updating Tb.

Destination?
- Nodes have a table (Ta) of prices that they must pay downstream peers for packets going to given destinations.
- Nodes have a table (Tb) of prices that they are charging upstream peers for packets going to given destinations. This is derived from the Ta above by adding a markup.
- Packets coming from sources not in Ta will be charged at a fixed rate. This may vary between nodes.
- As soon as one packet from a source has passed through a node, the price payed for it is entered in Ta, updating Tb.



### Talk with Anthony

- Come up with backpropagation of source cost data
- System is basically lagging feedback
- Think of it as a fully running system and model a change

- Solve exploits with blockchain/staking techniques

- Exploit: Switch routes quickly, routing to expensive nodes to force "subsidies", before the system can adjust
  - Possible solution: Staking, and punishment for cheating?

- Exploit: Fool routing algorithm to look better than you are
  - Have to figure out what the exploits are.
  - Possible solution: Not sure, although it seems relatively easy to detect... how to avoid writing own routing algorithm?

### Talk with Marc

- Is into the communitarian vision of the internet and everything sudo.
- Outlook is admirable.
- Finds technical challenge of incentivized routing interesting.
- Told me that even Babel has to store all addresses in memory and will not scale to internet size
- Subnets must be used to do that.
- Babel also has no security on route updates
- Could really use some help with cryptocurrency type consensus stuff- have Jae talk to him.


### Split the fee

In split the fee, nodes append their address to any packets they forward.
The receiver of the packet then pays the forwarding nodes, dividing the fee
among them equally.

Pros:
- Simple
- Easy to make it work in a basic sense

Cons:
- Several gaping security holes
  - Nodes could append sybil addresses or route unesecarily
  - Destination node could just not pay
  - These issues could possibly be mitigated
- Since fee is split evenly, expensive links may not be rewarded sufficiently
- Needs to be some kind of natural renegotiation thing

### Shopkeeper

A market-like system where nodes pay their downstream peers to forward a packet.
Naive system where upstream peers are charged according to average downstream expense of forwarding their packets leads to a situation where some source nodes end up subsidizing the packets of others. There needs to be some kind of system to pay by source or destination to make sure that source nodes are paying the appropriate amount.

### Shopkeeper modification

Each node keeps a table of the prices it charges to forward packets to certain destinations. A packet comes to a node with payment attached in the form of a channel transaction. The node checks the routing algorithm to determine which peer to send it to. It then checks the price table to determine whether the payment is enough. If the payment is not sufficient, the packet is dropped and refund is sent to the upstream peer with a notice of the appropriate payment.

When a node receives such a notice, it adjusts its price to a destination accordingly, and sends more money with the next packet.

If a given peer's cost to a certain destination is too much more than what other peers are charging, it is no longer forwarded packets to there.

An alternate system in the same vein is to keep a table prices for destinations via peer. This could be odd because upstream peers could see sudden price shifts etc. Not entirely sure what the benefit is. Worth exploration.
