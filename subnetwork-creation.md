Nodes send out grouping messages containing their address.
When they recieve one, they append {
  their address
  prev_hash
  signature
}
Nodes propagate all grouping messages with source chains under a certain length.
Of these, they choose the one with the highest source chain length.
A hash of the originating node's address is used as the subnet prefix.
When a node's subnet prefix changes, it updates its neighbors.
