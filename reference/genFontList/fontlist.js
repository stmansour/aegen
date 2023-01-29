var tapp = {
    doc: null,    // current document
    art: null,    // current artboard
    abb: null,    // object with artboard bounds
    layer: null,
};

function init() {
    tapp.doc = app.documents.add(DocumentColorSpace.RGB,1920,1080);
    tapp.art = tapp.doc.artboards[ tapp.doc.artboards.getActiveArtboardIndex() ];
    tapp.abb = getArtboardBounds(tapp.art);
    tapp.layer = tapp.doc.layers.add();
}

function irand(max) {
  return Math.floor(Math.random() * max);
}

function getArtboardBounds(artboard) {
    var bounds = artboard.artboardRect;
    var b = {
        left: bounds[0],
        top: bounds[1],
        right: bounds[2],
        bottom: bounds[3],
        width: bounds[2] - bounds[0],
        height: bounds[1] - bounds[3],
    };
    // alert('artboard bounds:  top=' + b.top + ' left=' + b.left + ' bottom=' + b.bottom + ' right=' + b.right + ' width=' + b.width + ' height=' + b.height );
    return b;
}

function makeList() {
    var fonts = app.textFonts;
    var l = fonts.length;
    var ytop = tapp.abb.top - 30;
    var xleft = tapp.abb.left + 30;
    var dx = 15;
    var dy = 15;

    var x = xleft;
    var y = ytop;
    var wmax = 0;
    for (var i = 0; i < l; i++) {
        var f = fonts[i];
        var t = tapp.layer.textFrames.add();
        var chattr = t.textRange.characterAttributes;
        // chattr.size = 75 + irand(75);
        t.contents = f.name;
        t.textRange.justification = Justification.LEFT;
        t.position = [x,y];

        if (t.width > wmax) {
            wmax = t.width;
        }

        y -= dy;
        if (y < 35) {
            x += wmax + dx; // widest text in column + offset
            y = ytop;       // reset to top of page
            wmax = 0;       // reset max width
        }
    }

}

// -------------------------------------------------------------------------

if (!app.homeScreenVisible) {
    app.activeDocument.close(SaveOptions.PROMPTTOSAVECHANGES);
}

init();
makeList();
