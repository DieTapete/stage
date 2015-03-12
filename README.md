#stage.js
Export animations from Flash to JSON and render them with the Canvas- or SVG-Renderer.

**Warning: The library is in an early state and not really usable to anyone else than me right now.**

##TODO
- documentation
- support easing in timeline interpolation
- make frame codes really work instead of workaround
- tests

###KNOWN BUGS
- Only one line of code works in code frames. No comments are supported.

###OPTIMIZATIONS
- optimize timeline update method to not run through each frame every time
- Optimize string concatenation in function `mapProperties` in `SVGRenderer`
