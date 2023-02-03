// Array of styler functions
var styler_functions = [
  stylerRandomFont,
];

var styler = {
    fade_in_time: 0.5,
    fade_out_time: 0.5,
    move_duration: 1,
    move_distance: 50
};

// resetProperty removes any keyframes from the supplied property and sets
// a default value for some properties.
//
// INPUTS
//   layer - the layer to be reset
//   pName - name of the property to reset
//
// RETURNS
//   nothing at this time
//------------------------------------------------------------------------------
function resetProperty(layer,pName) {
    var prop = layer.property(pName);

    var nk = prop.numKeys;
    if (nk > 0) {
        for (var i = nk; i > 0; i--) {
            prop.removeKey(i);
        }
    }
    switch (pName) {
        case "Opacity":
            prop.setValue(100);
            break;
        case "Rotation":
            prop.setValue(0);
            break;
        default:
    }
}

// resetLayers  -  resets all text layers back to their state when they were
//                 created by vidmaker.jsx
//
// INPUTS
//   nothing at this time
//
// RETURNS
//   nothing at this time
//------------------------------------------------------------------------------
function resetLayers() {
    var propList = ["Position", "Opacity", "Rotation"];
    var comp = app.project.activeItem;
    var x = comp.width / 2;
    var y = comp.height / 2;

    for (var i = 1; i <= comp.numLayers; i++) {
        var layer = comp.layer(i);

        if (layer instanceof TextLayer) {

            for (var j = 0; j < propList.length; j++) {
                resetProperty(layer,propList[j]);
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
    changeAllTextFonts("Myriad-Roman");
}

function stylerRandomFont() {
    var randomFont = fontList[Math.floor(Math.random() * fontList.length)];
    changeAllTextFonts(randomFont);
}

function stylizeVid() {
    resetLayers(); // remove all previous stylings
    var fn = styler_functions[Math.floor(Math.random() * styler_functions.length)];
    fn();
}

app.beginUndoGroup("Sytlize Lyrics");
stylizeVid();
app.endUndoGroup();
