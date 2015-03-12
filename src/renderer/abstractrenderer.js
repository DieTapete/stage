module.exports = function(domElement, properties){
  var t = {
    width: properties.width || 100,
    height: properties.height || 100
  },
  uid = 0;

  t.render = function(elements){

  }

  t.clear = function(){

  }

  t.getUID = function(){
    return uid++;
  }

  return t;
};
