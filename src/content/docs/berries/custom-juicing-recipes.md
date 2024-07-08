---
title: Custom Juicing Recipes
---

#### Introduction
The juicer supports custom recipes, created via datapacks. This is useful for situations such as adding support for making juice from another mod using the juicer from bodacious berries in a custom modpack. While bodacious berries supports a few mods out of the box, it can never be compatible with absolutely everything.

The juicer's recipe type is `bodacious_berries:juicing`.

#### Parameters in a juicing recipe
- `"ingredients"`: a list of ingredients in the recipe, as well as the receptacle
   - `"0"`: the first ingredient in the recipe
      - `"item"`: the id of the ingredient
   - `"1"`: the second ingredient in the recipe
      - `"item"`: the id of the ingredient
   - `"2"`: the third ingredient in the recipe
      - `"item"`: the id of the ingredient
   - `"receptacle"`: the container for your juice; for example if you wanted the final product to be a bucket of juice you'd specify `minecraft:bucket`. is most often `minecraft:glass_bottle`
      - `"item"`: the id of the receptacle
   - `"all"`: an optional property. if this is specified, it will override ingredients 0, 1, and 2, becoming the only ingredient used in the recipe. this is useful if you are making juice from purely one type of fruit
- `"result"`: the id of the result

#### Examples
An example recipe for grape juice:
```json
{
  "type": "bodacious_berries:juicing",
  "ingredients": {
    "0": {
      "item": "bodacious_berries:grapes"
    },
    "1": {
      "item": "bodacious_berries:grapes"
    },
    "2": {
      "item": "bodacious_berries:grapes"
    },
    "receptacle": {
      "item": "minecraft:glass_bottle"
    }
  },
  "result": "bodacious_berries:grape_juice"
}
```

An alternative to the above, using the `all` parameter to shorten the JSON:
```json
{
  "type": "bodacious_berries:juicing",
  "ingredients": {
    "all": {
      "item": "bodacious_berries:grapes"
    },
    "receptacle": {
      "item": "minecraft:glass_bottle"
    }
  },
  "result": "bodacious_berries:grape_juice"
}
```