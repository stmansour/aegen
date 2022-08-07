var lapp = {
    songTitle: "Living Life",
    lyricStart: 5,           // seconds
    songDuration: 3*60 + 47,    // seconds
    lyricStart: 7,              // seconds
    lyricStop: 3*60 + 40,       // seconds
    comp: app.project.activeItem,
};

function initapp() {
    if (!(lapp.comp instanceof CompItem)) {
        for (var i = 0; i < app.items.numItems; i++) {
            if (app.items[i] instanceof CompItem) {
                lapp.comp = app.items[i];
                break;
            }
        }
    }
}

function listProperties(obj) {
   var propList = "";
   for(var propName in obj) {
      if(typeof(obj[propName]) != "undefined") {
         propList += (propName + ", ");
      }
   }
   return propList;
}
function maintest() {
    initapp();
    var comp = lapp.comp;
    var l = comp.layers[1];
    var prop = l.scale;
    var t = l.inPoint;
    var key1 = prop.keyValue(1);
    var key2 = prop.keyValue(2);

    // var s = "properties of key1: " + listProperties(key1) + "\n";
    // s += "properties of prop: " + listProperties(prop) + "\n";
    //
    // // if (prop.isInterpolationTypeValid(1)) {
    //     s += "InterpolationType = " + key1.keyInInterpolationType(1) + " ";
    //     switch (key1.keyInInterpolationType(1)) {
    //         case KeyframeInterpolationType.LINEAR: s += "LINEAR"; break;
    //         case KeyframeInterpolationType.BEZIER: s += "BEZIER"; break;
    //         case KeyframeInterpolationType.HOLD: s += "HOLD"; break;
    //         default: s += "?unknown"; break;
    //     }
    // }
    // alert(s);
}

maintest();
