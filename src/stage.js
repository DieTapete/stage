(function(){
  var raf = require('raf'),
      _ = require('underscore');

  var DisplayObject = require('./displayobject'),
      Timeline = require('./timeline');

  var root = this || window;

  var Stage = root.Stage = function(options){
    var t = {width:options.width, height:options.height, fps: options.fps || 25, forceUpdate: true};
    var domElement, context,
        timelines = [], elements = [],
        then = Date.now(),
        renderer;

    t.appendTo = function(element) {
      if(_.isElement(element)){
        domElement = element;
        var tagName = domElement.tagName.toLowerCase(),
            RenderModule;

        if (tagName === 'canvas') {
          RenderModule = require('./renderer/canvasrenderer');
        }
        else if (tagName === 'svg') {
          RenderModule = require('./renderer/svgrenderer');
        }
        else {
          throw "Stage must be appended to either a canvas or a svg element. Element is "+domElement.tagName;
        }

        if (RenderModule) {
          renderer = new RenderModule(domElement, {width:t.width, height:t.height});
        }
      }

      init();
      return t;
    };

    t.createRect = function(properties){
      if (!domElement){
        throw "Stage is not connected to a Canvas element. Use 'appendTo' to connect it, first.";
      }

      var element =  new DisplayObject(renderer, properties)
      elements.push(element)
      return element;
    }

    t.createTimeline = function(animationJSON, elements){
      var timeline = new Timeline(animationJSON, elements);
      timelines.push(timeline);
      return timeline;
    }

    function init(){
      raf(update);

      function update(){
        var now = Date.now();
      	var delta = now - then;
    		var interval = 1000/t.fps;

        if (t.forceUpdate || delta >= interval) {
          then = now - (delta % interval);
          var dirty = t.forceUpdate;
          t.forceUpdate = false;

          for (var i = timelines.length-1; i>=0; i--) {
            var timeline = timelines[i]
            if (timeline.playing() || dirty){
              dirty = true;
              timeline.update();
            }
          }

          if (dirty) {
            renderer.render(elements);
          }
        }

        raf(update);
      }

    }

    return t;
  };


  //exports to multiple environments
  //AMD
  if (typeof define === 'function' && define.amd){
    define(function(){ return Stage; });
  }
  //Node
  else if (typeof module != "undefined" && module.exports) {
    module.exports = Stage;
  }
  else{
    window.Stage = Stage;
  }

})();
