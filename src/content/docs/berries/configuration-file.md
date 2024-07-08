---
title: Configuration File
---

#### Introduction
The bodacious berries configuration file can be used to modify the rarities of each tier of berry bush. When modifying rarities, higher is more rare and lower is more common.
The configuration file is located in `[installation directory, most often .minecraft]/config/bodacious_berries.toml`.

#### Fields
- `common_rarity`: the rarity of common berry bushes such as strawberries and saskatoons
- `medium_rarity`: the rarity of somewhat rare berry bushes such as raspberries and lingonberries
- `rare_rarity`: the rarity of rare berry bushes such as chorus berries and goji berries
- `ultra_rare_rarity`: the rarity of ultra rare berry bushes such as the rainberry bush

#### Notes
- Currently, all changed values will only apply after the game is restarted.

#### Example Configuration
```toml
# bodacious berries configuration file - higher is more rare, lower is more common
# values only apply on game restart

common_rarity = 150
medium_rarity = 250
rare_rarity = 325
ultra_rare_rarity = 400
```