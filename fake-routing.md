# Fake Routing

This is a specification for a naive routing algorithm. This is to stand in for routing algorithms that could be used with Althea. Having a naive implementation will allow us to experiment with other aspects of the system.

There are a number of nodes, connected to one or more other nodes. Each node has an 'edge list' of the other nodes it is connected to. Additionally, it stores the edge lists of the nodes on its edge list.