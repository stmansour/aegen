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

function changeTextFill(layer,r,g,b) {
    var textProp = layer.property("Source Text");
    var textDocument = textProp.value;
    textDocument.fillColor = [r,g,b];
    textProp.setValue(textDocument);
}

// changeTextFillColor - changeAll text fonts to the supplied
//  INPUTS
//  comp - the composition
//  c    - rrggbb = hex string value for rgb, example "bb88cc"
//------------------------------------------------------------------------------
function changeAllTextFillColor(comp,c) {
    if (typeof c != "string" & c.length != 6) {
        alert("The color string value for changeTextFillColor is wrong: " + c + "\n" +
            "It must be a 6 character hexadecimal string. For example:  FF45B7 or bb88cc");
        return;
    }
    var r = parseInt(c.substr(0,2),16)/255.0;
    var g = parseInt(c.substr(2,2),16)/255.0;
    var b = parseInt(c.substr(4,2),16)/255.0;

    for (var i = 1; i <= comp.numLayers; i++ ) {
        layer = comp.layers[i];
        if (layer instanceof TextLayer == false ) {
            continue; // skip it
        }
        changeTextFill(layer,r,g,b);
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

// rotateAllTextFromTo - changeAll text fonts to the supplied.
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

// setALLTextYCoord - changeAll text locations to the specified height
//  INPUTS
//  comp = composition
//  y - the new y location
//------------------------------------------------------------------------------
function setALLTextYCoord(comp,y) {
    var newpos = [];
    var layer = null;
    for (var i = 1; i <= comp.numLayers; i++ ) {
        layer = comp.layers[i];
        if (layer instanceof TextLayer == false ) {
            continue; // skip it
        }
        newpos = layer.position.value;  // [0] = x, [1] = y
        newpos[1] = y;
        layer.position.setValue(newpos);
    }
}

// setEffectOnAllText - add the supplied effect to all text layers
//  INPUTS
//  comp = composition
//  eff - the effect name
//------------------------------------------------------------------------------
function setEffectOnAllText(comp,eff) {
    var newpos = [];
    var layer = null;
    for (var i = 1; i <= comp.numLayers; i++ ) {
        layer = comp.layers[i];
        if (layer instanceof TextLayer == false ) {
            continue; // skip it
        }
        var e = layer.Effects.addProperty(eff);

    }
}

// setDropShadowOnAllText - add the supplied effect to all text layers
//  INPUTS
//  comp = composition
//  eff - the effect name
//------------------------------------------------------------------------------
function setDropShadowOnAllText(comp) {
    var newpos = [];
    var layer = null;
    for (var i = 1; i <= comp.numLayers; i++ ) {
        layer = comp.layers[i];
        if (layer instanceof TextLayer == false ) {
            continue; // skip it
        }
        var e = layer.Effects.addProperty("ADBE Drop Shadow");
        // tweak a couple of properties...
        e("Opacity").setValue(255);
        e("Softness").setValue(14);
    }
}

// setAnchorPoint sets the anchor point of a layer according to the following:
//
//                     UL  UC  UR
//                     CL  CC  CR
//                     LL  LC  LR
//
//  The default anchor point is CC.  If ap is not supplied or it is not a
//  string of length 2, or it does not match any of the two letter strings
//  in the diagram above it will set the anchorPoint to CC (centered, vertically
//  and horizontally). Otherwise it will set the centerpoint as shown in the
//  diagram above.
//
//  The position of the text when the anchor is (0,0) is at the LC position.
//
//  INPUTS:
//      lyr = layer to adjust anchorPoint
//      ap    = "UL", "UC", ... "LR"
//-----------------------------------------------------------------------------
function setAnchorPoint(lyr,ap) {
    var bounds = lyr.sourceRectAtTime(0,false);
    var cap = lyr.anchorPoint.value;
    var anchor;
    var w = bounds.width;
    var h = bounds.height;
    var pos = lyr.position.value;
    var x = pos[0] - cap[0];
    var y = pos[1] - cap[1];  // the "normalized x,y" ... at the LC position for (0,0) anchor
    var anchor = [];
    var newpos = [];

    if ( (typeof ap == "undefined") || (typeof ap != "string")){
        ap = "CC";
    }
    ap = ap.toUpperCase();
    switch (ap) {
        case "UL":
            anchor = [-w/2, -h];
            newpos = [x-w/2, y-h];
            break;
        case "UC":
            anchor = [ 0, -h];
            newpos = [ x, y-h];
            break;
        case "UR":
            anchor = [ w/2, -h];
            newpos = [ x+w/2, y-h];
            break;
        case "CL":
            anchor = [-w/2, -h/2];
            newpos = [x-w/2, y-h/2];
            break;
        case "CR":
            anchor = [ w/2, -h/2];
            newpos = [ x+w/2, y-h/2];
            break;
        case "LL":
            anchor = [-w/2, 0];
            newpos = [x-w/2, y];
            break;
        case "LC":
            anchor = [0, 0];
            newpos = [x, y];
            break;
        case "LR":
            anchor = [w/2, 0];
            newpos = [x+w/2, y];
            break;
        default:
            anchor = [0, -h/2];
            newpos = [x, y-h/2];
    }

    // alert(
    //     "top,left: " + bounds.left.toFixed(1) +  ", " + bounds.top.toFixed(1) + "\n" +
    //     "w,h:  " + bounds.width.toFixed(1) + ", " + bounds.height.toFixed(1) + "\n" +
    //     "\n" +
    //     "normalized xy = " + x.toFixed(1) + ", " + y.toFixed(1) + "\n" +
    //     "\n" +
    //     "current anchor point: " + cap[0] + ", " + cap[1] + "\n" +
    //     "current position: " + pos[0] + ", " + pos[1] + "\n" +
    //     "\n" +
    //     "new anchor point: " + anchor[0] + ", " + anchor[1] + "\n" +
    //     "new position: " + newpos[0] + ", " + newpos[1] + "\n" +
    //     "--"
    // );

    lyr.anchorPoint.setValue(anchor);
    lyr.position.setValue(newpos);
}

// setAllTextAnchorPoints - changeAll text anchor points based on the supplied
//         composition and new origin.
//
//  INPUTS
//  comp - the composition
//  ap   - anchor point code as defined in setAnchorPoint.  Additionally, one
//         other value is accepted: "RANDOM" which will cause a random anchor
//         point to be selected for each text layer.
//------------------------------------------------------------------------------
function setAllTextAnchorPoints(comp,ap) {
    var anchors = ["UL","UC","UR","CL","CC","CR","LL","LC","LR"];
    var max = anchors.length-1;
    var random = false;
    ap = ap.toUpperCase();
    if (ap == "RANDOM") {
        random = true;
    }
    for (var i = 1; i <= comp.numLayers; i++ ) {
        var lyr = comp.layers[i];
        if (lyr instanceof TextLayer == false ) {
            continue; // skip it
        }
        if (random) {
            ap = anchors[randomIntInterval(0,max)];
        }
        setAnchorPoint(lyr,ap);
    }
}

// set3D sets the layer's 3d flag to the value tf
//
//  INPUTS:
//      layer = layer to adjust anchorPoint
//      tf    = true if you want it to be a 3d layer, false otherwise.  If
//              tf is not provide, or not boolean, then it will be set to true.
//-----------------------------------------------------------------------------
function set3D(lyr,tf) {
    if (typeof tf == "undefined") {
        tf = true;
    }
    if (typeof tf != "boolean") {
        tf = true;
    }
    lyr.threeDLayer = tf;
}
