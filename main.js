// Written by Aaron Beaudoin at Union College

let mixin = { computed: {}, methods: {} };
export default mixin;

mixin.methods.stringifyColor = function(color) {
  let model = color[0], [h, s, l, a] = color.slice(1);
  if (a === undefined) a = 100;
  if (model === "hsl") return `hsla(${h}, ${s}%, ${l}%, ${a / 100})`;
  
  let decimalChannels = hsluv[`${model}ToRgb`]([h, s, l]);
  let rescaleChannel = channel => Math.round(channel * 255);
  let [r, g, b] = map(decimalChannels, rescaleChannel);
  return `rgba(${r}, ${g}, ${b}, ${a / 100})`;
};

mixin.methods.buildPalette = function(palette) {
  palette = globalPalette;
  defaults(palette, {
    "default-hue": 0,
    "default-sat": 0,
    "default-light": 0,
    "default-tint": [0, 0],
    "default-tone": [0, 0],
    "default-color": [0, 0, 0],
    "black": [0, 0, 0],
    "white": [0, 0, 100]
  });

  let models = ["hsl", "hsluv", "hpluv", "use"];
  let hasModel = resolvable => models.includes(resolvable[0]);
  let canExtend = name => name.split(" ").length > 1;

  let resolve = (resolvable, palette, ignoreModel) => {
    let recurse = resolvable => resolve(resolvable, palette, true);
    let resolvableType = typeof resolvable;

    if (resolvableType === "number") return resolvable;
    if (resolvableType === "string") return recurse(palette[resolvable]);

    let resolvables = resolvable.slice(hasModel(resolvable) ? 1 : 0);
    let resolved = map(resolvables, resolvable => recurse(resolvable));

    if (!hasModel(resolvable)) return flatten(resolved);
    else if (resolvable[0] === "use") return flatten(resolved);
    else return concat(resolvable[0], flatten(resolved));
  };

  let extend = (resolvable, extensions) => {
    let indexIsArray = index => isArray(resolvable[index]);
    let extendIndexes = filter(keys(resolvable), indexIsArray);

    let extendResolvableIndex = (extendIndex, extensionIndex) => {
      if (extensionIndex >= extensions.length) return;
      extendedResolvable[extendIndex] = extensions[extensionIndex];
    };

    let extendedResolvable = clone(resolvable);
    forEach(extendIndexes, extendResolvableIndex);
    return extendedResolvable;
  };

  return reduce(palette, (accum, resolvable, name) => {
    if (hasModel(resolvable)) {
      accum[name] = resolve(resolvable, palette);
    } else if (canExtend(name)) {
      let [pattern, extendName] = name.split(" ");
      let startsWithPattern = name => startsWith(name, `${pattern}-`);

      let matching = filter(keys(palette), startsWithPattern);
      forEach(matching, name => {
        let color = resolve(extend(palette[name], resolvable), palette);
        accum[`${extendName}-${name}`] = color;
      });
    }

    return accum;
  }, {});
};

mixin.methods.definePaletteVariables = function(colors) {
  let root = document.documentElement;
  
  forEach(colors, (color, name) => {
    let propertyName = `--${name}`;
    let colorText = this.stringifyColor(color);
    root.style.setProperty(propertyName, colorText);
  });
};
