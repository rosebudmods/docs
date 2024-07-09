---
title: advanced usage
---

this page has information on how to manually modify skin or cape overrides, rather than using the ui.

skin overrides are stored in `.minecraft/skin_overrides`, and cape overrides are stored in `.minecraft/cape_overrides`.

## overrides format

todo

## library format

the `library.json` file in either the skin or cape overrides folders contains a list of library objects:

| key       | type     | description                                                                     | required          |
| --------- | -------- | ------------------------------------------------------------------------------- | ----------------- |
| `name`    | `string` | the name of the library entry. will be shown in the ui.                         | yes               |
| `id`      | `string` | the id of the library entry. should be any unique string.                       | yes               |
| `file`    | `string` | the name of a file in the library folder. either this or `texture` is required. | yes, or `texture` |
| `texture` | `string` | the namespaced id of a texture.                                                 | yes, or `file`    |
| `model`   | `string` | for skins. either `wide` or `slim`.                                             | for skins         |

the images used in the library (for the `file` key) are stored in the `library` folder, under the respective overrides folder.

the library file is reloaded every time the library screen is opened, or every 2 seconds.
