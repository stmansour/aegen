// Array of styler functions
var styler_functions = [
    stylerRandomFont,
    fadeInAllText,
    fadeOutAllText
];

var styler = {
    fade_in_time: 0.25,
    fade_out_time: 0.25,
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
function resetProperty(layer, pName) {
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
                resetProperty(layer, propList[j]);
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

function includes(array, element) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] === element) {
            return true;
        }
    }
    return false;
}

// randomStyler - picks a random number of stylers and calls them
//---------------------------------------------------------------------
function randomStyler() {
    var numFns = Math.floor(Math.random() * styler_functions.length) + 1;  // random number indicating the number of functions we're going to call in this style
    var fns = [];
    for (i = 0; i < numFns; i++) {
        var done = false;
        while (!done) {
            var x = Math.floor(Math.random() * styler_functions.length); // random index to one of the stylers
            // don't include any styler more than once... at least for now
            if (!includes(fns, x)) {
                done = true
                fns[i] = x;
            }
        }
    }

    //------------------------------------------------------------------
    // The styler is defined by the indeces of the individual stylers.
    // We could dump this out if we want to save the style.
    //------------------------------------------------------------------
    var s = "";
    for (i = 0; i < numFns; i++) {
        s += styler_functions[fns[i]].name + "\n";
    }
    alert("Random Style:\n" + s);

    //------------------------------------------------------------------
    // Now let's call this reandomly generated styler...
    //------------------------------------------------------------------
    for (i = 0; i < numFns; i++) {
        styler_functions[fns[i]]();
    }
}

function stylizeVid() {
    var i, j;
    resetLayers();   // remove all previous stylings
    randomStyler();  // for now, just do a random styling
}

app.beginUndoGroup("Sytlize Lyrics");
stylizeVid();
app.endUndoGroup();
