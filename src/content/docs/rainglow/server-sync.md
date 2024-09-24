---
title: server sync
description: information about rainglow's server sync feature!
sidebar:
  order: 3
---

## what is it?

Server sync is rainglow's solution to making sure that everyone on your server has a consistent experience. When enabled, everyone must use the same mode and the same configuration, ensuring that they all see the same things. The config screen is locked from editing, and it is not reloaded from the file until the player leaves the server locking it.

Server sync also sends any custom modes you may have created to the client!

## how does that work?

When a player joins the server that has server sync enabled, it sends two packets: one with the server's configuration, and one with a list of custom modes on the server. First, the client parses the list of custom modes and configures and adds any that do not exist on its side. The client takes the config and sets all its internal values to that of the server's config.

When the player leaves the server, the modes are removed and the config is reloaded from its file. Nothing is written permanently to disk when playing on a server that forces sync.
