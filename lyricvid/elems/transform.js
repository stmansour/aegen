// code that works on layer transform properties

// removeOpacityKeyframes - remove any opacity keyframes from the supplied layer.
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

// changeTextFont - changeAll text fonts to the supplied
//  INPUTS
//  comp - the composition
//  fstr  - font name string
//------------------------------------------------------------------------------
function changeTextFont(layer,fstr) {
    var textProp = layer.property("Source Text");
    var textDocument = textProp.value;
    textDocument.font = fstr;
    textProp.setValue(textDocument);
}

// changeTextFonts - changeAll text fonts to the supplied
//  INPUTS
//  comp - the composition
//  fstr  - font name string
//------------------------------------------------------------------------------
function changeTextFonts(comp,fstr) {
    for (var i = 1; i <= comp.numLayers; i++ ) {
        layer = comp.layers[i];
        if (layer instanceof TextLayer == false ) {
            continue; // skip it
        }
        changeTextFont(layer,fstr);
    }
}

// removeRotationKeyframes - remove any opacity keyframes from the supplied
//      layer.
//------------------------------------------------------------------------------
function removeRotationKeyframes(layer) {
    var rotation = layer.rotation;
    for (var i = rotation.numKeys; i > 0; i--) {
        rotation.removeKey(i);
    }
}

// rotateTextFromTo - rotate text from ang1 to ang2 in dur time.  It starts the
//      rotation at time 0, and ends at dur.  It will remove all rotation
//      keyframes before making its changes.
//
//  INPUTS
//  layer - the text layer to modify
//  ang1  - start angle in degrees
//  ang2  - ending angle in degrees
//  dur   - amount of time to rotate from ang1 to ang2
//------------------------------------------------------------------------------
function rotateTextFromTo(layer,ang1,ang2,dur) {
    removeRotationKeyframes(layer);
    layer.rotation.setValueAtTime(layer.inPoint,ang1);
    layer.rotation.setValueAtTime(layer.inPoint+dur,ang2);
}

// rotateAllTextFromTo - changeAll text fonts to the supplied
//  INPUTS
//  comp - the composition
//  fstr  - font name string
//------------------------------------------------------------------------------
function rotateAllTextFromTo(comp,ang1,ang2,dur) {
    for (var i = 1; i <= comp.numLayers; i++ ) {
        layer = comp.layers[i];
        if (layer instanceof TextLayer == false ) {
            continue; // skip it
        }
        rotateTextFromTo(layer,ang1,ang2,dur);
    }
}
