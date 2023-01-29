var tapp = {
    doc: null, // current document
    art: null, // current artboard
    abb: null, // object with artboard bounds
    layer: null,
    cwd: "/Users/sman/Documents/src/js/aigen/titler"
};

// -------------------------------------------------------------------------

if (!app.homeScreenVisible) {
    app.activeDocument.close(SaveOptions.PROMPTTOSAVECHANGES);
}

function makeList() {
    var myDocument = app.documents.add();
    //Make a new text frame and assign it to the variable “myTextFrame”
    var myTextFrame = myDocument.textFrames.add();
    var chattr = myTextFrame.textRange.characterAttributes;
    chattr.size = 3;
    // Install the text in the frame and its location
    myTextFrame.position = [10, 760];
    var s = "fontList = [\n";

    var fonts = app.textFonts;
    var l = fonts.length;
    for (var i = 0; i < l; i++) {
        s += "\t\"" + fonts[i].name + "\",\n";
    }
    s += "];\n";
    myTextFrame.contents = s;
}


makeList();
