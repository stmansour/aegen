// Array of styler functions
var styler_functions = [
    fadeInAllText,
    fadeOutAllText
];

var styler = {
    fontName: "Myriad-Roman",
    fontSize: 78,
    fade_in_time: 0.25,
    fade_out_time: 0.25,
    move_duration: 1,
    move_distance: 50,
    theme: [],
    themeBG: 0,
    themeFG: 0,
    fns: [],
    checkPerf: true,
};

var performanceTimings = [];

// Function to start performance timing
//----------------------------------------------------------------------------
function startPerfTiming(description) {
    if (!styler.checkPerf) {
        return;
    }
    performanceTimings.push({ description: description, startTime: new Date().getTime() });
}

// Function to stop performance timing and add entry to array
//----------------------------------------------------------------------------
function stopPerfTiming(description) {
    if (!styler.checkPerf) {
        return;
    }
    var endTime = new Date().getTime();
    var timing = null;
    var j = -1;
    for (var i = 0; i < performanceTimings.length; i++) {
        if ( performanceTimings[i].description == description ) {
            j = i;
            timing = performanceTimings[j];
            break;
        }
    }
    if (j < 0) {
        alert("Could not find timing for:  " + description);
        return;
    }
    var timeDiff = endTime - timing.startTime;
    performanceTimings[j].time = timeDiff;
}

// write timings in CSV format
//----------------------------------------------------------------------------
function writePerfTimings() {
    if (!styler.checkPerf) {
        return;
    }
    var fw = new File(lyricapp.perfFilename);
    if (fw == null) {
        alert("Could not create new File object for " + lyricapp.perfFilename);
        return null;
    }
    fileOK = fw.open("w");
    if (!fileOK) {
        alert("Could not open " + lyricapp.perfFilename + " for writing.");
        return null;
    }
    fw.writeln("Description, Time (ms)");
    for (var i = 0; i < performanceTimings.length; i++) {
        var timing = performanceTimings[i];
        fw.writeln(timing.description + ", " + timing.time);
    }
    fw.close();
}



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

    startPerfTiming("resetLayers main loop");
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
    stopPerfTiming("resetLayers main loop");
}

// stylerRandomFont - just choose a random font, and update the styler variable.
//                    But don't actually set the fonts yet, that happens later.
//--------------------------------------------------------------------------------
function stylerRandomFont() {
    var randomFont = fontList[Math.floor(Math.random() * fontList.length)];
    styler.fontName = randomFont;
}

function includes(array, element) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] === element) {
            return true;
        }
    }
    return false;
}

function createBackgroundRectangle() {
    var comp = app.project.activeItem;

    // Look for existing BGRect layer and delete it
    var bgRectLayer = comp.layer("BGRect");
    if (bgRectLayer) {
        bgRectLayer.remove();
    }
    var newColor = hexToColor(styler.themeBG);
    var newLayer = comp.layers.addSolid(newColor, "BGRect", comp.width, comp.height, comp.pixelAspect);
    newLayer.moveToEnd();
}

// randomStyler - picks a random number of stylers and calls them
//---------------------------------------------------------------------
function randomStyler() {
    startPerfTiming("randomStyler");
    //--------------------------------------------------------------------
    // Choose a color theme, then a background and foreground color...
    //--------------------------------------------------------------------
    var themeidx = Math.floor(Math.random() * CPallete.length);
    styler.theme = CPallete[themeidx];
    styler.themeBG = styler.theme[Math.floor(Math.random() * styler.theme.length)]
    styler.themeFG = -1;
    for (; styler.themeFG < 0 || styler.themeFG == styler.themeBG;) {
        styler.themeFG = styler.theme[Math.floor(Math.random() * styler.theme.length)];
    }

    createBackgroundRectangle();

    var numFns = Math.floor(Math.random() * styler_functions.length) + 1;  // random number indicating the number of functions we're going to call in this style
    styler.fns = [];
    for (i = 0; i < numFns; i++) {
        var done = false;
        while (!done) {
            var x = Math.floor(Math.random() * styler_functions.length); // random index to one of the stylers
            //-----------------------------------------------------
            // Choose unique stylers... don't include any styler
            // more than once... at least for now.
            //-----------------------------------------------------
            if (!includes(styler.fns, x)) {
                done = true
                styler.fns[i] = x;
            }
        }
    }

    stylerRandomFont();
    changeAllTextFonts(styler.fontName,styler.fontSize, hexToColor(styler.themeFG));

    //------------------------------------------------------------------
    // Now let's call this randomly generated styler...
    //------------------------------------------------------------------
    for (i = 0; i < numFns; i++) {
        styler_functions[styler.fns[i]]();
    }
    stopPerfTiming("randomStyler");

}

function writeStyleFile() {
    var i;
    var fw = new File(lyricapp.styleFilename);
    if (fw == null) {
        alert("Could not create new File object for " + lyricapp.styleFilename);
        return null;
    }
    fileOK = fw.open("w");
    if (!fileOK) {
        alert("Could not open " + lyricapp.styleFilename + " for writing.");
        return null;
    }
    fw.writeln("{");
    fw.writeln('"Font": "' + styler.fontName + '",');
    fw.writeln('"Functions": [');
    var numFns = styler.fns.length;
    for (i = 0; i < numFns; i++) {
        fw.write('        "' + styler_functions[styler.fns[i]].name + '"');
        if (i < numFns - 1) {
            fw.write(',');
        }
        fw.writeln('');
    }
    fw.writeln('        ],');

    fw.write('"Pallet": [');
    for (i = 0; i < styler.theme.length; i++) {
        fw.write("0x" + styler.theme[i].toString(16));
        if (i < styler.theme.length - 1) {
            fw.write(",")
        }
    }
    fw.writeln("]")
    fw.writeln("}");
    fw.close();
}

function stylizeVid() {
    var i, j;
    resetLayers();   // remove all previous stylings
    randomStyler();  // for now, just do a random styling
    writeStyleFile();   // write the current style information
    writePerfTimings(); // writes the file only if we're checking performance
}

if (app.project.activeItem instanceof CompItem) {
    app.beginUndoGroup("Sytlize Lyrics");
    stylizeVid();
    app.endUndoGroup();
} else {
    // active item is not a composition
    alert("Active item is not a composition");
}
