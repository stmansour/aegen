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
    dx  = 0;
    dy  = 0;
    apx = 0;
    apy = 0;   // the amount to move the anchor point

    if (hOrigin === ORIGINHZ.LEFT) {
        apx = -width/2;
        dx = -width/2;
    } else if (hOrigin === ORIGINHZ.RIGHT) {
        apx = width/2;
        dx = width/2;
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
