A channel consists of two transactions on the blockchain.

#### Opening Transaction:

```
{
  channelId: String,
  pub1: Pubkey,
  pub2: Pubkey,
  amount1: Integer,
  amount2: Integer,
  delay: Integer
}
```

When an opening transaction is published to the blockchain, it must be signed by both pub1 and pub2 to be valid.

`amount1` is how much money `pub1` has deposited into the channel. `amount2` is how much money `pub2` has deposited into the channel. These amounts are removed from the accounts of `pub1` and `pub2`, and kept in the channel.


#### Channel Transaction:

```
{
  channelId: String,
  nonce: Integer,
  amount1: Integer,
  amount2: Integer
}
```

The channel transaction updates `amount1`, `amount2`, and the `nonce`. It is only considered valid if the total of `amount1` and `amount2` stays the same. This allows both parties to make payments to one another.

If Bob wants to request payment from Alice, he adjusts the amounts to transfer the desired funds and signs the transaction. To make the payment, she signs the transaction as well. None of this involves publishing anything to the blockchain, and can happen instantly.

To actually claim the funds, either party publishes the latest channel transaction to the blockchain. After `delay` blocks, `amount1` and `amount2` are transfered to `pub1` and `pub2`. If a transaction with a higher `nonce` is published to the blockchain before then, it overrides the older transaction.

This means that if Alice disappears or becomes uncooperative, Bob can still get his money out by waiting `delay` blocks.

If Bob tries to cheat by publishing an old channel transaction where he has a higher amount than he does currently, Alice can simply publish the latest transaction with a higher `nonce`.



# Channels

It is possible to create secure channels with all these features:

1. You can spend money in them without publishing anything to the blockchain.
2. The money can be spent in either direction.
3. Each additional hash-locked transaction or bet increases the memory requirements linearly.
4. No expiration date requiring the channel be closed by any particular date.
5. You don't trust your partner.
6. No fee for spending funds through the channel.
7. Spend money as fast as sending a message, you don't have to wait for any confirmations.
8. Payments and bets inside of a channel can be secret from everyone except your partner.
9. Channel block can be OTR encrypted, so that the participants can have deniability for non-final channel blocks, allowing betting and trading in secret.

Bitcoin channels will eventually be able to do everything except #9 and #3. For #3 in bitcoin, each additional hash-lock in a channel doubles the time and space requirements. `O(N^2)`

#### Limitations that channels have, compared with on-blockchain tx:

1. There is a finite amount of money in the channel. Taking money in or out of the channel requires posting to the blockchain.
2. Each channel has a number written on it called delay. If your partner disappears, it takes this long to get your money out.
3. You need to log on once every delay, or else your partner could take the money.

#### Example of the part of a channel that lives in the blockchain consensus state:

```
{
  pub1: Pubkey,
  pub2: Pubkey,
  amount1: Integer,
  amount2: Integer,
  delay: Integer
}
```

`amount1` is how much money `pub1` has deposited into the channel. `amount2` is how much money `pub2` has deposited into the channel.

#### Example of a channel contract that lives in channel state:

```
{
  nonce: Integer,
  pub1: Pubkey,
  pub2: Pubkey,
  amount1: Integer,
  amount2: Integer,
  fast: Bool,
  amount: Integer
}
```

`amount` is how much money is moved from the `amount1` pile to the `amount2` pile on the blockchain. Note that this could be negative if

`nonce` increases when new payments are made. Only the highest-nonced contract that was signed by both participants is valid.

#### Closing a channel normally:
Create a new channel block with `fast` set to `True`, have both parties sign the channel contract, and publish to the blockchain.

#### Closing a channel when your partner is gone:
Take the most recent channel contract that your partner paid you with, sign it, and publish it to the blockchain. After `delay` blocks,

#### Stopping your partner when they try to cheat:
Your partner has to wait at least delay amount of time before they can take the money, which gives you time to publish the highest-nonced channel block.
