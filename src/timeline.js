module.exports = function(timelineData, elements){
	var stopped = true;

	var t = {
		animations:timelineData.animations,
		labels : timelineData.labels || {},
		code : timelineData.code || {},
		settings:timelineData.settings || {fps:24},
		elements: elements,
		currentFrame : 0,
    forceUpdate: true
	};

	t.playing = function(){
		return !stopped;
	}
  t.stop = function(){
		console.log('stop called');
  	stopped = true;
  };
  t.play = function(){
  	stopped = false;
  };
  t.gotoAndPlay = function(frameOrLabel){
  	if (!frameOrLabel.length){
			stopped = false;
  		t.currentFrame = frameOrLabel;
  	}else{
  		for (var frame in t.labels){
  			if (frameOrLabel === frame){
  				t.currentFrame = t.labels[frame];
					stopped = false;
  				break;
  			}
  		}
  	}

		if (stopped){
			console.log('frame or label '+frameOrLabel+' couldnt be found.');
		}
  };
  t.gotoAndStop = function(frameOrLabel){
      if (!frameOrLabel.length){
					stopped = true;
          t.currentFrame = frameOrLabel;
      }else{
          for (var frame in t.labels){
              if (frameOrLabel === frame){
									stopped = true;
                  t.currentFrame = t.labels[frame];
                  break;
              }
          }
      }

			if (!stopped){
				console.log('frame or label '+frameOrLabel+' couldnt be found.');
			}
  };

  t.update = function(){

  	if (t.labels[t.currentFrame]){
  		if ($ !== undefined){
  			$(t).trigger('label', t.labels[t.currentFrame]);
  		}
  	}

		if (t.code[t.currentFrame]) {
			var code = 't.'+t.code[t.currentFrame];
			eval(code);
		}

    //update every element
  	for (var clipName in elements) {
          var element = t.elements[clipName];
          if (t.animations[clipName] === undefined) {
          	console.log('Warning: Element '+clipName+ ' is undefined.');
            continue;
          }

          var frames = t.animations[clipName].frames;
          var properties;
          for (var i=0; i<frames.length; i++) {
          	var nextFrame = frames[i];
          	if (nextFrame.frame >= t.currentFrame){
	          		if (i>0) {
									var lastFrame = frames[i-1];

									if (t.currentFrame.interpolation === 'none') {
										properties = lastFrame.properties;
									}
									else {
		            		var lastProperties = lastFrame.properties;
		            		var nextProperties = nextFrame.properties;
		            		var position = t.currentFrame - lastFrame.frame;
		            		var end = nextFrame.frame - lastFrame.frame;
		            		position /= end;
		            		properties = interpolateValues(lastProperties, nextProperties, position);
									}
	          		} else {
	          			properties = nextFrame.properties;
          		}
          		break;
          	}
          }

          if (properties) {
          	properties.visible = !(t.currentFrame < frames[0].frame || t.currentFrame >= frames[frames.length-1].frame);
          	t.setProperties(element, properties);
          }
      }//end for

      if (stopped) {
          return;
      }

      if (t.currentFrame >= t.settings.numFrames) {
					if (!t.settings.loop) {
          	stopped = true;
					}else{
						t.currentFrame = -1;
					}
          if ($ !== undefined) {
              $(t).trigger('complete');
          }
      }

  		t.currentFrame++;
  };

  t.setProperties = function(element, properties){
  	for (var prop in properties){
  		element[prop] = properties[prop];
  	}
    element.needsUpdate = true;
  };

  t.frameToMillis = function(frame, fps){
      return (frame/fps)*1000;
  };

  function interpolateValues(lastProperties, nextProperties, position){
  	var properties = {};
  	for (var prop in nextProperties){
  		var lastProp = lastProperties[prop];
  		if (lastProp !== undefined){
  			properties[prop] = lerp(position, lastProp, nextProperties[prop]);
  		}
  		else{
  			properties[prop] = nextProperties[prop];
  		}
  	}

  	return properties;
  }

  function lerp(amount, start, end)
	{
	return start === end ? start : ( ( 1 - amount ) * start ) + ( amount * end ) ;
  }

  return t;

};
