module.exports = function(renderer, properties) {
  var t = {
     renderer:renderer,
     needsUpdate: true,
     uid: renderer.getUID(),
     properties:{ x:0, y:0,
                  width: 100, height: 100,
                  regX:50, regY:50,
                  rotation:0,
                  transform:null,
                  a:0, b:0, c:0, d:0, tx:0, ty:0,
                  alpha:1, fillColor:'black', strokeColor:'white'}
   };

  //Override this as needed
  t.render = function(){
    renderer.render(t);
    t.needsUpdate = false;
  };

  t.set = function(properties){
    var needsUpdate = t.needsUpdate;

    for (var prop in properties){
      var value = properties[prop];

      if (t.properties[prop] != value) {
        t.properties[prop] = value;
        needsUpdate = true;
      }
    }
    t.needsUpdate = needsUpdate;
  };

  t.set(properties);

  return t;

};
