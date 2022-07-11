// code that works on layer transform properties

// fadeIn - for the supplied layer, do a fade in for len seconds by varying its
//          opacity from 0 at its inPoint to 100 at inPoint + len
//------------------------------------------------------------------------------
function removeOpacityKeyframes(layer) {
    var opacity = layer.opacity;
    for (var i = opacity.numKeys; i > 0; i--) {
        opacity.removeKey(i);
    }
}

// fadeIn - for the supplied layer, do a fade in for len seconds by varying its
//          opacity from 0 at its inPoint to 100 at inPoint + len
//------------------------------------------------------------------------------
function fadeIn(layer,len) {
    layer.opacity.setValueAtTime(layer.inPoint,0);
    layer.opacity.setValueAtTime(layer.inPoint + len,100);
}

// fadeOut - for the supplied layer, do a fade out for len seconds by varying its
//          opacity from 100 at its outPoint-len to 0 at outPoint
//------------------------------------------------------------------------------
function fadeOut(layer,len) {
    layer.opacity.setValueAtTime(layer.outPoint,0);
    layer.opacity.setValueAtTime(layer.outPoint - len,100);
}
