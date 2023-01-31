// Define global constants for origin positions
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

/**
 * Removes all keyframes and other information added by a previous run of the program.
 */
function resetLayers() {
    var comp = app.project.activeItem;
    var x = comp.width / 2;
    var y = comp.height / 2;

    for (var i = 1; i <= comp.numLayers; i++) {
        var layer = comp.layer(i);
        if (layer instanceof TextLayer) {
            // check if the position property has keyframes
            if (layer.property("Position") != null) {
                if (layer.property("Position").numKeys > 0) {
                    layer.property("Position").removeAllKeyframes();
                }
            }

            // check if the rotation property has keyframes
            if (layer.property("Rotation") != null) {
                if (layer.property("Rotation").numKeys > 0) {
                    layer.property("Rotation").removeAllKeyframes();
                }
            }

            // check if the color property has keyframes
            if (layer.property("Text Document") != null) {
                if (layer.property("Text Document").color.numKeys > 0) {
                    layer.property("Text Document").color.setValue(layer.property("Text Document").color.valueAtTime(0, false));
                }
            }
            var err = changeTextOrigin(layer, ORIGINHZ.CENTER, ORIGINVT.BOTTOM);
            if (err != 0) {
                alert("changeTextOrigin returned: " + err);
            }
            // force it back to the center...
            layer.position.setValue([x, y]);
        }
    }
}

function stylizeVid() {
    resetLayers(); // remove all previous stylings

    //---------------------------------
    // Set the origin of each text
    //---------------------------------
    var comp = app.project.activeItem;
    for (var i = 1; i <= comp.numLayers; i++) {
        var layer = comp.layer(i);
        if (layer instanceof TextLayer) {
            var err = changeTextOrigin(layer, ORIGINHZ.RIGHT, ORIGINVT.TOP);
            if (err != 0) {
                alert("changeTextOrigin returned " + err);
                break;
            }
        }
    }
}

app.beginUndoGroup("Sytlize Lyrics");
stylizeVid();
app.endUndoGroup();
