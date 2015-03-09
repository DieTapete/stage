(function(){
  var raf = require('raf'),
      _ = require('underscore');

  var DisplayObject = require('./displayobject');
  var Timeline = require('./timeline');

  var root = this || window;

  var Stage = root.Stage = function(options){
    var t = {width:options.width, height:options.height, fps: options.fps || 25, forceUpdate: true};
    var domElement, context,
        timelines = [], elements = [],
        then = Date.now();

    t.appendTo = function(element) {
      if(_.isElement(element)){
        domElement = element;
        context = domElement.getContext('2d');
      }
      init();
      return t;
    };

    t.createRect = function(properties){
      if (!domElement){
        throw "Stage is not connected to a Canvas element. Use 'appendTo' to connect it, first.";
      }

      var element =  new DisplayObject(context, properties)
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

          t.forceUpdate = false;
          then = now - (delta % interval);

          var cleared = false;
          for (var i = timelines.length-1; i>=0; i--) {
            var timeline = timelines[i]
            if (timeline.playing() || timeline.forceUpdate){
              if (!cleared) {
                context.clearRect ( 0 , 0 , domElement.width, domElement.height );
                cleared = true;
              }
              timeline.update();
            }
          }

          for (i = elements.length-1; i>=0; i--) {
            var element = elements[i]
            if (element.needsUpdate){
              element.render();
            }
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
