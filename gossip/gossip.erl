% Run gossip:start()

-module(gossip).
-export([start/0, node/3]).

node(NodeId, Peers, MessagesForwarded) ->
  receive
    {add_peers, From, NewPeers} ->
      From ! add_peers_done,
      node(NodeId, NewPeers, MessagesForwarded);

    {ping, DestinationId} ->
      lists:foreach(fun (Peer) ->
        Peer ! {gossip, {round(random:uniform() * 100000), NodeId, DestinationId}}
      end, Peers),
      % Recurse
      node(NodeId, Peers, MessagesForwarded);

    {gossip, {MessageId, SourceId, DestinationId}} ->
      case {
        % Is the message for me?
        DestinationId == NodeId,
        % Has the message been forwarded already?
        apply(fun CheckMessagesForwarded ([MessageForwardedId | Tail]) ->
          case MessageForwardedId == MessageId of
            false -> CheckMessagesForwarded(Tail);
            % MessageId is in list
            true -> true
          end;
        CheckMessagesForwarded ([]) -> false
        end, [MessagesForwarded])
      } of
        % If the message is for me
        {true, _} ->
          io:format("~p~n", [{NodeId, "received ping from", SourceId}]),
          % Recurse
          node(NodeId, Peers, [MessageId | MessagesForwarded]);

        % If the message has already been forwarded
        {false, true} -> io:format("~p~n", [{NodeId, "already forwarded", {gossip, {MessageId, SourceId, DestinationId}}}]);

        % If the message has not already been forwarded
        {false, false} ->
          % Send to each peer
          lists:foreach(fun (Peer) ->
            io:format("~p~n", [{NodeId, "forwarding ping", {gossip, {MessageId, SourceId, DestinationId}}}]),
            Peer ! {gossip, {MessageId, SourceId, DestinationId}}
          end, Peers),
          % Recurse
          node(NodeId, Peers, [MessageId | MessagesForwarded])
      end
  end.

create_nodes(NodeSpecs) ->
  lists:map(fun ({NodeId, _}) ->
    {NodeId, spawn(gossip, node, [NodeId, [], []])}
  end, NodeSpecs).

add_node_peers(From, NodeSpecs, Nodes) ->
  lists:foreach(fun ({NodeId, PeerIds}) ->
    Peers = lists:map(fun (PeerId) ->
      proplists:get_value(PeerId, Nodes)
    end, PeerIds),
    proplists:get_value(NodeId, Nodes) ! {add_peers, From, Peers}
  end, NodeSpecs).

ping_nodes(PingSpecs, Nodes) ->
  lists:foreach(fun ({NodeId, PeerIds}) ->
    lists:foreach(fun (PeerId) ->
      proplists:get_value(NodeId, Nodes) ! {ping, PeerId}
    end, PeerIds)
  end, PingSpecs).

start() ->
  NodeSpecs = [
    {a, [c]},
    {b, [d]},
    {c, [a, d]},
    {d, [b, c, e, f]},
    {e, [d, f, g]},
    {f, [d, e, g]},
    {g, [e, f]}
  ],

  Nodes = create_nodes(NodeSpecs),
  add_node_peers(self(), NodeSpecs, Nodes),
  start(1, Nodes).

start(NodesReady, Nodes) ->
  PingSpecs = [
    {a, [g]},
    {b, []},
    {c, []},
    {d, []},
    {e, []},
    {f, []},
    {g, []}
  ],

  receive
    add_peers_done ->
      case NodesReady == length(Nodes) of
        true -> ping_nodes(PingSpecs, Nodes);
        false -> start(NodesReady + 1, Nodes)
      end
  end.
