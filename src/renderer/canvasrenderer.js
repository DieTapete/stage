module.exports = function(domElement, properties){
  var t = new (require('./abstractrenderer'))(domElement, properties);

  t.context = domElement.getContext('2d')

  t.render = function(elements){
    var c = t.context,
        cleared = false;

    for (var i = 0, len = elements.length; i<len; i++) {
      var e = elements[i]

      if (!cleared) {
        t.clear();
        cleared = true;
      }

      if (e.needsUpdate){
        c.save();
        var p = e.properties;
        c.setTransform(p.a, p.b, p.c, p.d, p.tx, p.ty);
        c.globalAlpha = p.alpha;
        c.fillStyle = p.fillColor;
        c.fillRect(0, 0, p.width, p.height);

        c.restore();
      }
    }
  }

  t.clear = function(){
    t.context.clearRect ( 0 , 0 , domElement.width, domElement.height );
  }

  return t;
};
