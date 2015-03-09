module.exports = function(context, properties) {
  var t = {
     context:context,
     x:0,y:0,
     regX:50, regY:50,
     rotation:0,
     width: 100, height: 100,
     transform:null,
     a:0, b:0, c:0, d:0, tx:0, ty:0,
     alpha:1, fillColor:'black', strokeColor:'white',
     needsUpdate: true
   };

  //Override this as needed
  t.render = function(){
    var c = t.context;
    c.save();

    c.setTransform(t.a, t.b, t.c, t.d, t.tx, t.ty);
    c.globalAlpha = this.alpha;
    c.fillStyle = this.fillColor;
    c.fillRect(0, 0, this.width, this.height);

    c.restore();
    t.needsUpdate = false;
  };

  t.set = function(properties){
    for (var prop in properties){
      t[prop] = properties[prop];
    }
  };

  t.set(properties);

  return t;

};
