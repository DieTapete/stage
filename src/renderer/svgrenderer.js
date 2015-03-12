module.exports = function(domElement, properties){
  var t = new (require('./abstractrenderer'))(domElement, properties),
      children = {},
      ns = "http://www.w3.org/2000/svg";

  //set viewbox if not already set
  if (domElement.getAttribute('viewBox') === null) {
    domElement.setAttributeNS(null, 'viewBox', '0 0 '+t.width+' '+t.height);
  }

  t.render = function(elements){
    for (var i = 0, len = elements.length; i<len; i++) {
      var e = elements[i];
      if (!children[e.uid]){
        t.addElement(e);
      }

      if (e.needsUpdate) {
        var properties = mapProperties(e.properties);
        for (var prop in properties) {
          e.domElement.setAttributeNS(null, prop, properties[prop])
        }
        e.needsUpdate = false;
      }
    }
  }

  t.addElement = function(element){
    var childDOMElement = document.createElementNS(ns, 'rect');
    domElement.appendChild(childDOMElement);
    element.domElement = childDOMElement;
    element.needsUpdate = true;
    children[element.uid] = element;
  }

  function mapProperties(properties){
    var p = properties,
        mappedProps = {},
        style = {};

    for (var prop in properties){
      var value = properties[prop];

      switch(prop){
        case 'alpha':
            style['fill-opacity'] = value;
            style['stroke-opacity'] = value;
          break;
        case 'fillColor':
            style.fill = value;
          break;
        case 'transform':
            mappedProps[prop] = 'matrix('+p.a+' '+p.b+' '+p.c+' '+p.d+' '+p.tx+' '+p.ty+')';
          break;
        /*case 'regX':
            mappedProps.rx = value;
          break;
        case 'regY':
            mappedProps.ry = value;
          break;*/
        default:
          mappedProps[prop] = value;
          break;
      }
    }

    var styleString = '';
    for (var styleProp in style) {
      styleString += styleProp+':'+style[styleProp]+';';
    }

    mappedProps.style = styleString;
    return mappedProps;
  }

  return t;
};
