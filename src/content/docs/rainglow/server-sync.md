---
title: server sync
description: information about rainglow's server sync feature!
sidebar:
  order: 3
---

## what is it?

Server sync is rainglow's solution to making sure that everyone on your server has a consistent experience. When enabled, the server will inform clients about the colours of entities, meaning everyone sees the same things! While connected to a server, players won't be able to use the config screen.

## how does that work?

When a player joins the server that has server sync enabled, it sends three packets: one with the server's configuration, one with a list of custom modes on the server, and a map from entity UUIDs to their colours. First, the client parses the list of custom modes and configures and adds any that do not exist on its side. The client takes the config and sets all its internal values to that of the server's config.

When a colour packet is sent, the client stores which entities have which colour. More of these packets may be sent later; for example, if an entity spawns in, or an entity's colour changes.

When the player leaves the server, the overrides are removed, and the config is reloaded from its file. The player's config will not be changed while playing on a server that forces sync.
