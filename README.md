#stage.js

##TODO
- support easing in timeline interpolation
- make frame codes really work instead of workaround

###KNOWN BUGS
- Only one line of code works in code frames. No comments are supported.

###OPTIMIZATIONS
- optimize timeline update method to not run through each frame every time
- Optimize string concatenation in ``mapProperties`` in ``SVGRenderer``
