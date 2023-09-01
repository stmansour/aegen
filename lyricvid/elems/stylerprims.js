// Define global constants for origin positions
//
//      var textProp = myTextLayer.property("Source Text");
//      var textDocument = textProp.value;
//      myString = "Happy holidays!";
//      textDocument.resetCharStyle();
//      textDocument.fontSize = 60;
//      textDocument.fillColor = [1, 0, 0];
//      textDocument.strokeColor = [0, 1, 0];
//      textDocument.strokeWidth = 2;
//      textDocument.font = "Times New Roman PSMT";
//      textDocument.strokeOverFill = true;
//      textDocument.applyStroke = true;
//      textDocument.applyFill = true;
//      textDocument.text = myString;
//      textDocument.justification = ParagraphJustification.CENTER_JUSTIFY;
//      textDocument.tracking = 50;
//      textProp.setValue(textDocument);
//--------------------------------------------------------------------------

/*jshint esversion: 6 */

// "use strict";

var ORIGINHZ = {
    LEFT: 'left',
    CENTER: 'center',
    RIGHT: 'right'
};

var ORIGINVT = {
    TOP: 'top',
    CENTER: 'center',
    BOTTOM: 'bottom'
};

// changeTextOrigin - Moves the anchor point based on hOrigin and vOrigin.
// You can move the horizontal origin to the left, center, or right side of the
// string.  You can move the vertical origin to the top, center, or bottom.
// Since After Effects does not provide a way to get the basline and descent
// values for a font, the textLayer may move slightly because these values
// must be approximated.
//
// INPUTS
//  textLayer - the textlayer in question
//
// RETURNS
//  0 = no problems
//  1 = invalid hOrigin
//  2 = invalid vOrigin
//-------------------------------------------------------------------------
function changeTextOrigin(textLayer, hOrigin, vOrigin) {
    if (!textLayer) {
        return 0;  // just bail
    }

    if (hOrigin !== ORIGINHZ.LEFT && hOrigin !== ORIGINHZ.CENTER && hOrigin !== ORIGINHZ.RIGHT) {
        alert("invalid: hOrigin = " + hOrigin);
        return 1;
    }

    if (vOrigin !== ORIGINVT.TOP && vOrigin !== ORIGINVT.CENTER && vOrigin !== ORIGINVT.BOTTOM) {
        alert("invalid: vOrigin = " + vOrigin);
        return 2;
    }
    var position = textLayer.position;
    var posx = textLayer.property("Position").value[0];
    var posy = textLayer.property("Position").value[1];
    var bbox = textLayer.sourceRectAtTime(0, true);

    //----------------------------------------------------------------------------------------
    // The bounding box is an object with properties "top", "left", "width", and "height"
    // You can access these properties to get the values of the bounding box
    // For example, to get the width of the bounding box:
    //----------------------------------------------------------------------------------------
    var width = bbox.width;
    var height = bbox.height;
    var x = bbox.left;
    var y = bbox.top;
    var anchorPoint = textLayer.anchorPoint;
    var apx = anchorPoint.value[0];
    var apy = anchorPoint.value[1];
    var dx = 0, dy = 0;     // the amount to move the position of the text so that it stays in its original location

    var baseline = 0.9 * height;
    var descent = 0.1 * height;

    // var s = "text info:\n" +
    //     "Position: " + posx + "," + posy + "\n" +
    //     "Bounds:   left = " + x + " top = " + y + " width = " + width + " height = " + height + "\n" +
    //     "Anchor:   " +  apx + "," + apy;
    // alert(s);

    //---------------------------------------------------------------
    // first get the  anchor point back to 0,0 --> CENTER BOTTOM
    //---------------------------------------------------------------
    if (apx != 0 || apy != 0) {
        if (apx != 0) {
            dx = -apx;
            apx = 0;
        }
        if (apy != 0) {
            dy = -apy;
            apy = 0;
        }
        posx += dx;
        posy += dy;
        textLayer.anchorPoint.setValue([apx, apy]);
        textLayer.position.setValue([posx, posy]);
    }

    //---------------------------------------------------------------
    // Now move the anchor point as requested...
    //---------------------------------------------------------------
    dx = 0;
    dy = 0;
    apx = 0;
    apy = 0;   // the amount to move the anchor point

    if (hOrigin === ORIGINHZ.LEFT) {
        apx = -width / 2;
        dx = -width / 2;
    } else if (hOrigin === ORIGINHZ.RIGHT) {
        apx = width / 2;
        dx = width / 2;
    }

    if (vOrigin === ORIGINVT.TOP) {
        apy = -height;
        dy = -height;
    } else if (vOrigin === ORIGINVT.CENTER) {
        apy = -height / 2;
        dy = -height / 2;
    }
    textLayer.anchorPoint.setValue([apx, apy]);
    textLayer.position.setValue([posx + dx, posy + dy]);

    return 0;
}

// changeTextFont - changeAll text fonts to the supplied
//  INPUTS
//  comp - the composition
//  fstr  - font name string, 
//  size  - (optional) sets font size if >= 4, otherwise no change
//  color - (optional) sets the color 
//------------------------------------------------------------------------------
function changeTextFont(layer, fstr, size, color) {
    var textProp = layer.property("Source Text");
    var textDocument = textProp.value;
    textDocument.font = fstr;
    if (typeof size != "undefined" && size > 4) {
        textDocument.fontSize = size;
    }
    if (typeof color != "undefined" ) {
        textDocument.fillColor = color;
    }
    textProp.setValue(textDocument);
}

// changeAllTextFonts - changeAll text fonts to the supplied
//  INPUTS
//  fstr  - font name string
//  size  = point size for the font
//  color = the 3 component normalized text color. Ex:  [1, .5, .3]
//------------------------------------------------------------------------------
function changeAllTextFonts(fstr,size,color) {
    var comp = app.project.activeItem;
    for (var i = 1; i <= comp.numLayers; i++) {
        layer = comp.layers[i];
        if (layer instanceof TextLayer) {
            changeTextFont(layer, fstr, size, color);
        }
    }
}

// setTextAnchors - change all text anchors as follows
//  INPUTS
//  h - horizontal anchor {"left" | "center" "right"}
//  v - vertical anchor {"top" | "center" | "bottom"}
//------------------------------------------------------------------------------
function setTextAnchors(h, v) {
    var comp = app.project.activeItem;
    for (var i = 1; i <= comp.numLayers; i++) {
        var layer = comp.layer(i);
        if (layer instanceof TextLayer) {
            var err = changeTextOrigin(layer, h, v);
            if (err != 0) {
                alert("changeTextOrigin returned " + err);
                break;
            }
        }
    }
}

function fadeOutText(textLayer, t) {
    textLayer.opacity.setValueAtTime(textLayer.outPoint - t, 100);
    textLayer.opacity.setValueAtTime(textLayer.outPoint, 0);
}

function fadeInText(textLayer, t) {
    textLayer.opacity.setValueAtTime(textLayer.inPoint, 0);
    textLayer.opacity.setValueAtTime(textLayer.inPoint + t, 100);
}

// fadeOutAllText - fades out each textLayer in the current comp
//------------------------------------------------------------------------------
function fadeOutAllText() {
    var comp = app.project.activeItem;
    for (var i = 1; i <= comp.numLayers; i++) {
        var layer = comp.layer(i);
        if (layer instanceof TextLayer) {
            fadeOutText(layer,styler.fade_out_time);
        }
    }
}

// fadeInAllText - fades in each textLayer in the current comp
//------------------------------------------------------------------------------
function fadeInAllText() {
    var comp = app.project.activeItem;
    for (var i = 1; i <= comp.numLayers; i++) {
        var layer = comp.layer(i);
        if (layer instanceof TextLayer) {
            fadeOutText(layer,styler.fade_in_time);
        }
    }
}

// hexToColor - change an integer hex encoded color into a color array that
//      AE can use.  The color is assumed to be encoded as follows:
//
//          0xRRGGBB
//          0xff00ff   will produce a magenta purple
//
//  RETURNS
//      the color array of normalized rgb values
//------------------------------------------------------------------------------
function hexToColor(color) {
    var red = (color >> 16) & 0xFF;
    var green = (color >> 8) & 0xFF;
    var blue = color & 0xFF;

    return [red / 255, green / 255, blue / 255];
}

// setTextStroke - sets the strokewidth and color of the text to the values supplied.
// 
// INPUTS
//   layer = the text layer
//   color = strokeColor rgb values encoded into an integer:  0xRRGGBB
//           example:  0xff00ff
//   strokewidth = strokewidth for the font.
//------------------------------------------------------------------------------
function setTextStroke(layer, color, strokeWidth) {
    var newColor = hexToColor(color);
    var textProp = layer.property("Source Text");
    var textDocument = textProp.value;
	textDocument.strokeColor = newColor;
	textDocument.strokeWidth = strokeWidth;
    textProp.setValue(textDocument);
}

// setAllTextStroke - sets all text to the styler's FG color
//------------------------------------------------------------------------------
function setAllTextStroke(color, strokeWidth) {
    var comp = app.project.activeItem;
    for (var i = 1; i <= comp.numLayers; i++) {
        var layer = comp.layer(i);
        if (layer instanceof TextLayer) {
            setTextStroke(layer, color, strokeWidth);
        }
    }
}


// setTextColor - sets the supplied text to the supplied color.
// 
// INPUTS
//   layer = the text layer
//   color = rgb values encoded into an integer:  0xRRGGBB
//           example:  0xff00ff
//------------------------------------------------------------------------------
function setTextColor(layer, color) {
    var newColor = hexToColor(color);
    var textProp = layer.property("Source Text");
    var textDocument = textProp.value;
    textDocument.fillColor = newColor;
    textProp.setValue(textDocument);
}

// setAllTextColor - sets all text to the styler's FG color
//------------------------------------------------------------------------------
function setAllTextColor() {
    var comp = app.project.activeItem;
    for (var i = 1; i <= comp.numLayers; i++) {
        var layer = comp.layer(i);
        if (layer instanceof TextLayer) {
            setTextColor(layer, styler.themeFG)
        }
    }
}

// setTextSize - sets the supplied text to the supplied font size.
// 
// INPUTS
//   layer = the text layer
//   size = font size for all text
//------------------------------------------------------------------------------
function setTextSize(layer, size) {
    var textProp = layer.property("Source Text");
    var textDocument = textProp.value;
    textDocument.fontSize = size;
    textProp.setValue(textDocument);
}

// setAllTextSize - sets all text to the styler's FG Size
//------------------------------------------------------------------------------
function setAllTextSize(size) {
    var comp = app.project.activeItem;
    for (var i = 1; i <= comp.numLayers; i++) {
        var layer = comp.layer(i);
        if (layer instanceof TextLayer) {
            setTextSize(layer, size)
        }
    }
}

// rotateText3D - rotates the text from the first vector of angles to the
//                second over the supplied duration.
// 
// INPUTS
//   layer = the text layer
//   size = font size for all text
//------------------------------------------------------------------------------
function rotateText3D(textLayer, duration, angles1, angles2) {
    var inPoint = textLayer.inPoint;
   var outPoint = inPoint + duration;
   textLayer.property("X Rotation").addKey(inPoint);
   textLayer.property("X Rotation").setValueAtTime(inPoint, angles1[0]);
   textLayer.property("Y Rotation").addKey(inPoint);
   textLayer.property("Y Rotation").setValueAtTime(inPoint, angles1[1]);
   textLayer.property("Z Rotation").addKey(inPoint);
   textLayer.property("Z Rotation").setValueAtTime(inPoint, angles1[2]);
   textLayer.property("X Rotation").addKey(outPoint);
   textLayer.property("X Rotation").setValueAtTime(outPoint, angles2[0]);
   textLayer.property("Y Rotation").addKey(outPoint);
   textLayer.property("Y Rotation").setValueAtTime(outPoint, angles2[1]);
   textLayer.property("Z Rotation").addKey(outPoint);
   textLayer.property("Z Rotation").setValueAtTime(outPoint, angles2[2]);
 }
