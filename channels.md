# Universal Payment Channels

Jehan Tremback

Zackary Hess

## Introduction

In this paper, we lay out a specification for Universal Payment Channels. UPC is a type of payment network that can handle any type of fiat or crypto currency, as well as physical or virtual goods, as long as these goods can be owned "on paper" and kept in escrow. Furthermore, UPC routes payments across currencies, with the network automatically arriving at the best exchange rate.

The vast majority of UPC payments are made without ever interfacing with any bank or blockchain. This means that there can be an almost unlimited amount of payments that do not put any strain on bank servers, or add anything to the blockchain. The only time that the bank or the blockchain is involved is when a network participant wants to take money out of the network, or put money into it.

This also makes it very easy for application developers to interface with UPC. The only thing that an application needs to do is to send cryptographically signed messages on behalf of the user. For example, there is software in development using UPC to allow internet backbone routers to pay one another per-packet, many times each second. These payments can happen in dollars, dogecoins, or any other currency. Even though the volume of payments created by this type of software is oceanic, the banks and blockchains backing up the network are rarely contacted.

UPC consists of a series of "channels" between network participants. A channel is an escrow arrangement between two parties and a cryptocurrency, a bank, or some other kind of institution. It allows the parties to exchange payment trustlessly, by sending signed, updated escrow balances to one another (not to the bank). At any time, each of the participants can be confident that they will be able to retrieve every cent (or satoshi!) that they are owed.

UPC's key innovation is a routing protocol inspired by the protocols that power the internet. It uses this routing protocol to route payments across interconnected channels, finding the cheapest path.

The internet is a **packet-switched network**. Any computer on the internet knows it can reach any other computer, and the network grows organically and routes around damage. Routing protocols ensure that each packet takes the fastest path through the network.

UPC is a **payment-switched network**. Any network participant can pay any other, and UPC grows organically and routes around damage. UPC ensures that each payment takes the cheapest path through the network.

## Basic Channel

A channel is created when two parties put money in escrow with an entity such as a bank or a blockchain. The money is put into escrow with the understanding that at some point in the future it will be released upon receipt of a transaction signed by both parties. This transaction has a special number on it called a "nonce", and specifies two additional actions to take before transferring the funds back to the participants.

1. Transfer a certain amount of money from one participant to another.
2. Wait for a certain hold period before transferring the funds back. If someone gives you another transaction signed by both parties, and this transaction's nonce is higher, throw the current transaction out and use the new one, restarting the hold period.

Alice and Bob exchange transactions back and forth, changing the transfer amount to make payments to one another. Each time they change the transfer number, they increment the nonce. To accept a payment, both of them sign it.

- If Bob disappears, Alice can post the last signed transaction and collect the money owed her without Bob's involvement, after the hold period is over.

- If Bob tries to cheat by posting an old transaction where he's doing better than he is currently, Alice can post the latest transaction which will override the old one. As long as Alice checks whether Bob has cheated at least once every hold period, she can stop him from cheating.


### Opening transaction

----

- **Opening Transaction**:
  - **Party 1**: Public key or other signature verification information for one of the participants.
  - **Party 2**: Public key or other signature verification information for the other participant.
  - **Amount 1**: The amount of money that **Party 1** has placed in the channel
  - **Amount 2**: The amount of money that **Party 2** has placed in the channel
- **Signature 1**: **Party 1**'s signature.
- **Signature 2**: **Party 2**'s signature.

----

The opening transaction serves mostly to identify the channel and the parties, and place the money in escrow.


### Update transaction:

----

- **Update Transaction**:
  - **Nonce**: A number which is incremented with each new update transaction.
  - **Transfer**: The amount of money to transfer from **Party 1** to **Party 2** (can be negative).
  - **Hold Period**: An amount of time (or number of blocks) to wait before closing the channel and transferring funds, after a update transaction has been published
- **Signature 1**: **Party 1**'s signature.
- **Signature 2**: **Party 2**'s signature.

----

The update transaction is sent from **Party 1** to **Party 2** and serves to transfer the money. The vast majority of these are never posted to the bank or blockchain.

### Making payments:

To make payments to one another, Alice and Bob pass signed update transactions back and forth.

If Alice wants to pay Bob, she adjusts **Transfer**, signs the update transaction, then passes it to Bob. None of this involves the transaction being given to anyone else, and can happen instantly. Alice and Bob can do this as many times as they want.

To actually claim the funds, either party posts the latest update transaction. After **Hold Period** is over, the channel closes: **Transfer** is subtracted from **Amount 1** and added to **Amount 2**, and the amounts are transfered back to the accounts of the participants.

This means that if Alice disappears or becomes uncooperative, Bob can still get his money out by waiting for the **Hold Period** to end.


### Stopping cheaters:

If a update transaction with a higher **Nonce** is published before a transaction closes, it overrides the older transaction.

If Bob tries to cheat by publishing an old update transaction where he has a higher amount than he does currently, Alice can simply publish the update transaction with a higher **Nonce**.

Another option is to "slash" Bob by transferring all his funds to Alice if she is able to post a higher-nonced transaction after him. This makes a cheating attempt riskier and may be beneficial in some situations.


## Payment Conditions

----

- **Conditions**:
  - **1**:
    - **Transfer**: Add this to the channel's total **Transfer** if **Function** returns true.
    - **Condition(argument)**: Takes an argument and returns either true or false

----

Update transactions can have a list of **Conditions**. A **Condition** consists of **Transfer**, a number to add to the **Channel**'s total **Transfer**, and the **Condition** which takes an argument and returns either true or false. The **Function** does not have any side effects, it is a pure function.

Pieces of data called **Fulfillments** can be posted during the **Hold Period**. They only need to be signed by one of the channel participants.

----

- **Fulfillment**:
  - **Condition**: Which condition does this fulfill?
  - **Argument**: Data to evaluate **Condition** with.

----

When a **Fulfillment** is posted, it is evaluated by its **Condition**. If the **Condition** evaluates to true, the **Condition**'s **Transfer** is added to the channel's total **Transfer**, and the **Condition** is removed from the list.

Conditions can be used to implement complex logic over channels to give them enhanced capabilities.

For instance, here is how Alice and Bob would implement a 'hashlock' transaction. Specifically, Alice wants to guarantee that she will transfer 32 coins to Bob if he can supply the secret that hashes to "59A1904325CCB". Alice is **Party 1** and Bob is **Party 2**.


### Establishing a condition

----

*Alice to Bob*

- **Update Transaction**:
  - **Nonce**: 12
  - **Transfer**: -34
  - **Hold Period**: 8
  - **Conditions**:
    - **1**:
      - **Transfer**: 32
      - **Condition(secret)**: `if sha3(secret) is equal to "59A1904325CCB", return true; else return false`
- **Signature 1**: Alice's signature

----

### Closing the channel

If Bob wants to close the channel at this point, he posts the **Update Transaction**, along with the signatures. He also posts a **Fulfillment** containing the secret for **Condition 1**.

----

*Bob posts*

- **Update Transaction**:
  - **Nonce**: 12
  - **Transfer**: -34
  - **Hold Period**: 8
  - **Conditions**:
    - **1**:
      - **Transfer**: 32
      - **Condition(secret)**: `if sha3(secret) is equal to "59A1904325CCB", return true; else return false`
- **Signature 1**: Alice's signature
- **Signature 2**: Bob's signature

----

*Bob also posts*

- **Fulfillment**:
  - **Condition**: 1
  - **Argument**: "theSecret"

----

### Fulfilling the condition without closing

Of course, most of the time Bob doesn't want to close the channel right away. Bob can now prove that he could unlock the money if he wanted, so Alice might as well adjust the **Transfer** as specified by the **Condition**. Bob sends the secret to Alice, who adjusts the channel's **Transfer**, increments the **Nonce**, removes condition **1**, and signs a new **Update Transaction**.

----

*Bob to Alice*

- **Fulfillment**:
  - **Condition**: 1
  - **Argument**: "theSecret"

----

*Both sign*

- **Update Transaction**:
  - **Nonce**: 13
  - **Transfer**: -2
  - **Hold Period**: 8
- **Signature 1**: Alice's signature
- **Signature 2**: Bob's signature

----

### Cancelling the condition

Similarly, Bob can inform Alice that he will never be able to find the hashlock secret. In this case there is no reason for them to keep passing a condition that will never be fulfilled back and forth.

----

*Bob to Alice*

- **Cancellation**
  - **Condition**: 1

----

*Both sign*

- **Update Transaction**:
  - **Nonce**: 13
  - **Transfer**: -34
  - **Hold Period**: 8
- **Signature 1**: Alice's signature
- **Signature 2**: Bob's signature

----

## Multihop channels

With the help of a hashlock condition, it is possible to trustlessly route payments across multiple hops. Let's say that Alice would like to transfer some coins to Charlie, but she does not have a channel open with him. If she has a channel with Bob, and Bob has a channel with Charlie, the coins can be transferred.

First, Alice sends a secret to Charlie:

----

*Alice to Charlie*

- **Secret**: "theSecret"

----

Then, Alice sends a hashlocked payment to Bob:

----

*Alice to Bob*

- **Update Transaction**:
  - **Nonce**: 13
  - **Transfer**: -2
  - **Hold Period**: 8
  - **Conditions**:
    - **1**:
      - **Transfer**: -101
      - **Condition(secret)**: `if sha3(secret) is equal to "73B88F8C24EAA", return true; else return false`
- **Signature 1**: Alice's signature

----

Notice that Alice has sent Bob 101 coins instead of 100, as Bob charges her a 1% fee for routing payments.

Now, Bob sends the payment along to Charlie (Bob is **Party 1** and Charlie is **Party 2** in their channel):

----

*Bob to Charlie*

- **Update Transaction**:
  - **Nonce**: 42
  - **Transfer**: 56
  - **Hold Period**: 10
  - **Conditions**:
    - **1**:
      - **Transfer**: 100
      - **Condition(secret)**: `if sha3(secret) is equal to "73B88F8C24EAA", return true; else return false`
- **Signature 1**: Bob's signature

----

To claim the payment, Charlie can post this agreement, along with the secret that Alice sent him.

----

*Charlie posts*

- **Update Transaction**:
  - **Nonce**: 42
  - **Transfer**: 56
  - **Hold Period**: 10
  - **Conditions**:
    - **1**:
      - **Transfer**: 100
      - **Condition(secret)**: `if sha3(secret) is equal to "73B88F8C24EAA", return true; else return false`
- **Signature 1**: Bob's signature
- **Signature 2**: Charlie's signature

----

*Charlie also posts*

- **Fulfillment**:
  - **Condition**: 1
  - **Argument**: "theSecret"

----

Once Charlie has posted the update transaction, Bob is able to see the secret and unlock his hashlocked funds from Alice. In this way, a network of nodes are able to exchange payment trustlessly with one another. One interesting aspect of this system is that while Alice and Bob both need to have channels open on the same blockchain or bank, and Bob and Charlie need to have channels open with the same blockchain or bank, Alice and Charlie do not. As long as banks are willing to put money in escrow and honor channel update transactions for their customers, a payment network can be created that spans banks and countries.


## Multihop payments across currencies

In the multihop payment example above, it is not neccesary for Alice and Bob's channel to be with the same bank or blockchain as Bob and Charlie's channel. It's actually not even neccesary for the channels to be holding the same currency.

If Alice wants to send Charlie some Euros, and Charlie and Bob have a Euro channel open, it can be done:

```
  $   €
 / \ / \
A   B   C
```

Alice needs to know how many dollars she needs to send Bob to have him send Charlie the right number of Euros (this can also be calculated from Bob's exchange rate and fee). Alice sends the hashlocked dollars to Bob, and Bob sends hashlocked Euros to Charlie. If Charlie is happy with the number of Euros he will receive, he reveals the secret to Bob as usual.

This can also be used to connect two parties transacting in the same currency, across hops of another currency. Let's say that Alice wants to send dollars to Doris, but her only connection to Doris is through Bart and Conrad, who have a channel open on the Dogecoin blockchain:

```
  $   Ð   $
 / \ / \ / \
A   B   C   D
```

If Alice knows Bob's fee and exchange rate, and Conrad's fee and exchange rate, she can calculate whether it would be worth it to send Doris payment across Bob and Conrad's Dogecoin channel. This technique could be very powerful for providing payment connectivity between seperate groups of people using non-crypto currency channels, as it will probably be a lot quicker to open a channel on a blockchain vs with a bank. Enterprising individuals can identify parts of the network lacking connectivity and supply it, earning transaction fees for their efforts.


## Routing multihop payments

If you're going to have a multihop payment network, you need some way to route payments. How does Alice know that Bob is the best person to go through to reach Charlie? Perhaps Benjamin also has channels open with Alice and Charlie but he charges a lower fee. There needs to be some way to find the lowest-priced route to a payment's destination. This problem is very similar to the problem of routing packets on the internet, so we will look at some possible solutions from that domain.

There are two main categories of ad-hoc routing protocols- proactive and reactive.

Proactive protocols work by exchanging messages to build up routing tables listing the next hop for each address on the network. When a node receives a packet, it is immediately able to forward it along to the best peer to get it closer to its destination. However, every node needs to have an entry in its routing tables for every other node. On a large network, this becomes infeasible.

In reactive protocols, nodes request a route from the network when they need to send packets to a new destination. This means that it is not necessary for every node to store information on every destination, and it is not necessary to update every node on the network when a connection changes. Of course, the downside is that the initial route discovery process adds some unavoidable latency when sending to new destinations.

For most paymsents, a few hundred milliseconds to establish a route is not a huge deal. Needing to store a routing table entry for every address in the network is far worse. For this reason we'll use a variation of AODV (citation), a reactive routing protocol.

In AODV, when nodes need to send a packet to a destination they have never sent packets to, they send out a **Route Request Message**, which is flooded through the network (with some optimizations). When the destination recieves this message, it sends a **Route Reply Message**. Intermediary nodes along the path cache the next hops for the source and the destination, thereby storing only the routing information they are likely to need often.

### Anonymous Payment Routing

Since our nodes are presumed to already have connectivity, we can skip the **Route Request Message**. Our protocol has only one type of message, which we'll call the **Routing Message**. A node's neighbors are those nodes that it has payment channels open with.

When a node wishes to send a multihop payment, it first sends a **Payment Initialization** to the recipient.

----

*Sender to recipient*

- **Payment Initialization**
  - **Secret**: Payment secret.
  - **Amount**: Amount of payment.

----

The recipient then constructs a **Routing Message**. The routing message includes the hash of the payment secret, and the amount of the payment. It sends the **Routing Message** to all of its neighbors who have enough in their channels to cover the payment (if Dolores is trying to receive $100, she won't send the **Routing Message** to Clark, who only has $20 in his side of the channel).

If the recipient is OK with receiving the equivalent value in some other currency, and it has a channel open in that currency, it can do a conversion using whatever exchange rate it wants, and send that **Amount** instead.

----

*Recipient to neighbors*

- **Routing Message**:
  - **Hash**: Hash of payment secret.
  - **Amount**: Amount of payment.

----

When a node receives a **Routing Message**, it makes a new **Routing Table Entry**.

----

- **Routing Table Entry**:
  - **Hash**: Hash of payment secret.
  - **Amount**: Amount of payment.
  - **Neighbor**: The neighbor that the **Routing Message** came from.

----

It also sends the **Routing Message** along to neighbors with enough to cover the payment, but not before adjusting the **Amount**. To adjust the **Amount**, it adds the fee that it would like to recieve for routing the payment. Also, if it sending the **Routing Message** to a neighbor with whom it has a channel open in a different currency, the **Amount** is converted to that currency.

----

- **Routing Message**:
  - **Hash**: Hash of payment secret.
  - **Amount**: (Amount of payment + fee) * optional exchange rate

----

The **Routing Message** can be thought of as asking one implicit question:

> How much would someone have to send you for you to send me **Amount**?

By adjusting the amount, a node is informing the network how much it charges to transfer money, and consequently, how good the route that it is on is.

The **Routing Table Entry** makes sure the node routes the actual payment correctly, if it is on the winning route.

If a node receives a **Routing Message** with the same **Hash** again, it will compare the **Amount** of the new **Routing Message** with the **Amount** that it has stored in its **Routing Table**. If the **Amount** of the new **Routing Message** is lower than what is in the **Routing Table**, it will update the **Routing Table** and send out a new **Routing Message**.

The **Routing Messages** propagate until they reach the sender of the payment. At this point, the sender can continue to wait, because it may receive another **Routing Message** with a lower **Amount**. If the sender is satisfied with the **Amount**, it then uses the **Hash** to make a hashlocked payment to the neighbor that sent it the routing message. This neighbor then checks their routing table and makes a payment to their corresponding neighbor. The hashlocked payments continue until they reach the destination, at which point it unlocks the payment with the secret, letting the rest of the chain unlock their transactions as well (as explained in "Multiphop Channels" above).

### Implementation notes
- Routing peer
  - speaks routing protocol
  -
- Bank server
-

INCOMPLETE SECTION

### Anonymity and Network Congestion

This protocol has good anonymity properties. When a node recieves a **Routing Message**, or an actual hashlocked payment, it does not know if the node it was recieved from is the destination of the payment, or just another intermediary node. Similarly, it does not know if the node it is sending a **Routing Message**, or a hashlocked payment to is the destination.

Maybe this information could be found through statistical means. For instance, if a **Routing Message** is sent to a node which immediately responds with the hashlocked payment, one could assume from the lack of latency that it is the source. Still, this is easy to avoid. As different schemes evolve to infer the origin and destination of payments, new techniques will be developed to obfuscate this information.

An area in which this protocol could be optimized is network traffic. **Routing Messages** will be sent along many paths, and only one of those paths will actually be chosen. The only thing that will stop a **Routing Message** from being propagated to every node in the network is when it encounters channels that are in the wrong currency or do not have enough liquidity to do the transfer. This means that **Routing Messages** for small payments will actually be propagated further and waste more bandwidth than **Routing Messages** for large payments.











#### Time To Live
**Routing Messages** could have an integer attached that is decremented by each succesive node that forwards the message. When it reaches 0, the message is dropped. This would curb the worst wastefulness, but would have some impact on anonymity. If a message's **TTL** is large, one could assume that it is close to the payment's destination. This can, of course, be obfuscated, but it is another data point for an adversary trying to deanonymize payments. Another weakness of a **TTL** is that **Routing Messages** to nodes that are far away on the network may run out of **TTL** and be dropped before they even reach the destination. When a **Routing Message** does not make it, the payment destination could try resending it with a higher **TTL** to see if it will work. However, this means that there is little incentive beyond altruism to send it with a low **TTL** in the first place. Other nodes could decline to forward messages with an excessively high **TTL**, but again, they have little incentive to do this besides altruism. If they drop a message with a high **TTL** which does not make it to its destination, but which would have made it had they not dropped it, they have then missed out on a fee that they could have charged.

#### Target Amount
When Alice sends Charlie the **Payment Initialization** message, she includes the **Amount** that Charlie is supposed to receive. Charlie could include this in a seperate **Target Amount** field in the **Routing Message**. This field would not be modified by nodes forwarding the **Routing Message**, and would indicate . By comparing the **Amount** and the **Target Amount**, nodes could see how much of a fee had already been added by the route. If the fee was excessive, nodes could infer that the payment had a low likelyhood of being completed, and that it might be a good idea to drop it. However, this completely deanonymizes the payment recipient. If a node sees that the **Amount** and the **Target Amount** are the same, it can conclude that the node sending the **Routing Message** is the payment recipient. This can of course be obfuscated by the payment recipient sending the **Routing Message** with a **Target Amount** that is lower than the **Amount**. However, the more it is obfuscated, the less likely the payment is to make it without being dropped. One issue here is that intermediary nodes may be incentivized to decrease the **Target Amount** to make it less likely that the **Routing Message** will be dropped. Since the node has already done the work of processing the packet, this strategy could result in more profits for it.

#### Successful Payment Ratio
Nodes can keep track of their neighbor's successful payment ratio. That is, the number of payments actually completed for routing messages forwarded from that neighbor. If a neighbor's successful payment ratio gets too low, maybe its routing messages start getting dropped. This would incentivize nodes not to set unrealistically high **TTL**'s, and it would also incentivize them not to mess with the **Target Amount**. In this way it enhances both of the above ideas and makes them practical. In any case, it is probably a good basic spam prevention measure.

#### Pay For Routing
Another way to accomplish the above is for each node to charge a tiny amount to forward a routing message. This amount would be

#### Meta-conditions
It's also possible for a smart condition to be

END INCOMPLETE SECTION
