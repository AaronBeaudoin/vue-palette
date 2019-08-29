# vue-palette

`vue-palette` is a Vue plugin for dynamically generating color palettes from JSON on the fly for an application using CSS custom properties.

## Dependencies

Function were written using `lodash@4.17` and `hsluv@0.0.3`.

## JSON Palette Example

```json
{
  "shadow-color": "black",
  "shadow-f50": ["hsluv", "shadow-color", 60],
  "shadow-f60": ["hsluv", "shadow-color", 40],
  "shadow-f70": ["hsluv", "shadow-color", 20],

  "global-tone": [0, 0],
  "global-f50": ["hsluv", "global-tone", 90],
  "global-f40": ["hsluv", "global-tone", 80],
  "global-f30": ["hsluv", "global-tone", 70],

  "layer-f50": ["hsluv", "global-tone", 75, 85],
  "layer-f60": ["hsluv", "global-tone", 95, 90],
  "layer-f40": ["hsluv", "global-tone", 65, 95],

  "overlay-f50": ["hsluv", "shadow-color", 30],
  "overlay-f40": ["hsluv", "shadow-color", 40],
  "overlay-t50": ["hsl", "white"],
  "overlay-s50": ["use", "shadow-f50"],

  "title-bar-f50": ["hsluv", [0, 0], 50],
  "title-bar-f60": ["hsluv", [0, 0], 60],
  "title-bar-t50": ["hsl", "white"],
  "title-bar green": [120, 100],
  "title-bar blue": [260, 100]
}
```

Properties like the last two which include a space are treated specially. The generator will look for any other properties that begin with the text before the space and then create versions of them where arrays in the values of those properties are substituted with the value of the special property. The text after the space is added as a prefix to these created properties.

In the example above, the `title-bar green` property causes the following colors to be generated:

```
green-title-bar-f50: ["hsluv", 120, 100, 50]
green-title-bar-f60: ["hsluv", 120, 100, 60]
green-title-bar-t50: ["hsl", 0, 0, 100]
```
