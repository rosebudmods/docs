---
title: config
---

## for versions below `1.3.0`

### general information
- The rainglow configuration is stored in `[your_instance_folder (usually .minecraft)/[your_config_directory (usually config)]/rainglow.toml`.
If you have not edited anything this means it is in `.minecraft/config/rainglow.toml`.

### example configuration
```toml
mode = "genderfluid_pride"
custom = ["blue", "red", "green", "pink", "yellow", "orange", "indigo", "purple", "white", "gray", "black"]
enable_server_sync = true

enable_glow_squid=true
enable_slime=true
enable_allay=false
```

### what are those things?
- `mode`: the mode declares which colours are currently shown in your game. Rainglow comes with a set of default modes, and as a server owner you can [define your own](https://github.com/ix0rai/rainglow/wiki/creating-custom-modes). When you change this, all squids with now-invalid colours will have their colours re-rolled. Information on which modes can be used by default can be found [here](https://github.com/ix0rai/rainglow/wiki/reference#available-modes).
- `custom`: this defines all the colours available in the "custom" mode. Information on which colours can be added can be found [here](https://github.com/ix0rai/rainglow/wiki/reference#available-colours).
- `enable_server_sync`: this option only changes anything if you're a server owner. If `true`, it will force the client to use the mode you have set in your configuration, and also send the client any custom modes you've made. More information on what this does and how it works can be found [here](https://github.com/ix0rai/rainglow/wiki/server-sync).
- `enable_[entity]`: rainglow provides granular control over whether to use custom colour for each supported entity. If `false`, the entity will use its vanilla colours. Information on which entities can be added can be found [here](https://github.com/ix0rai/rainglow/wiki/reference#available-entities).