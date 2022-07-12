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

// fadeInOut - for the supplied layer, do a fadein and fadeout for len seconds
//------------------------------------------------------------------------------
function fadeInOut(layer,len) {
    removeOpacityKeyframes(layer);
    fadeIn(layer,len);
    fadeOut(layer,len);
}

// fadeText - fade all text layers in and out by the amount specified.
//  INPUTS
//  comp - the composition
//  len  - length of time in seconds for the fades.  Example: 0.25
//
//------------------------------------------------------------------------------
function fadeText(comp,len) {
    for (var i = 1; i <= comp.numLayers; i++ ) {
        layer = comp.layers[i];
        if (layer instanceof TextLayer == false ) {
            continue; // skip it
        }
        fadeInOut(layer,len);
    }
}
