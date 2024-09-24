---
title: config
description: information about rainglow's config!
sidebar:
  order: 2
---

The rainglow config file is stored in `.minecraft/config/rainglow.toml` by default. Here is how it looks by default:

```toml
// rainglow.toml
# The currently active rainglow mode, which determines the possible colours for entities to spawn with.
# If custom, will be reset to the default mode if you join a server that does not have the mode.
# default: rainbow
default_mode = "rainbow"
# The custom colours to use when the mode is set to custom.
custom_colours = ["blue", "white", "pink"]
# Whether to allow recolouring entities via dyes.
# default: false
allow_dyeing = false

# The rarity of coloured entities, with 0 making all entities vanilla and 100 making all entities coloured.
[rarities]
	allay = 100
	glow_squid = 100
	slime = 100

# Toggles for disabling colours for each entity.
[toggles]
	allay = true
	glow_squid = true
	slime = true
```

<details>
<summary>Click for versions before 1.3.0!</summary>

The rainglow configuration is stored in `.minecraft/config/rainglow.toml` by default. If you have changed your Minecraft/config folder it may be elsewhere.

### example configuration

```toml
mode = "genderfluid_pride"
custom = ["blue", "red", "green", "pink", "yellow", "orange", "indigo", "purple", "white", "gray", "black"]
enable_server_sync = true
rarity = 100

enable_glow_squid = true
enable_slime = true
enable_allay = false
```

### what are those things?

- `mode`: the mode declares which colours are currently shown in your game. Rainglow comes with a set of default modes, and you can [define your own](/rainglow/creating-custom-modes/) using data packs. When you change this, all squids with now-invalid colours will have their colours re-rolled. A list of default modes can be found [here](/rainglow/reference/#default-modes).
- `custom`: this defines all the colours available in the "custom" mode. Information on which colours can be added can be found [here](/rainglow/reference/#available-colours).
- `enable_server_sync`: if this is set to `true` on a server, connecting clients will use the mode you have set in your configuration, and also send the client any custom modes you've made. More information on what this does and how it works can be found [here](/rainglow/server-sync/).
- `rarity`: the percentage likelihood of any entity having a custom colour. This defaults to 100, meaning 100% of entities have rainglow colours.
- `enable_[entity]`: rainglow provides granular control over whether to use custom colour for each supported entity. If `false`, the entity will use its vanilla colours. Information on which entities can be added can be found [here](/rainglow/reference/#available-entities).

</details>
