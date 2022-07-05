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

function createBackground() {
    var c = new RGBColor();
    c.red = 255;
    c.green = 255;
    c.blue = 127;

    var r = tapp.doc.pathItems.add();
    r.filled = true;
    r.stroked = false;
    r.fillColor = c;
    var x1 = tapp.abb.left;
    var x2 = tapp.abb.right;
    var y1 = tapp.abb.bottom;
    var y2 = tapp.abb.top;
    r.setEntirePath([[x1,y1],[x2,y1],[x2,y2],[x1,y2]]);
}

function randomRect() {
    var c = new RGBColor();
    c.red = irand(256);
    c.green = irand(256);
    c.blue = irand(256);

    var r = tapp.doc.pathItems.add();
    r.filled = true;
    r.stroked = false;
    r.fillColor = c;

    var t;
    var x1 = irand(1920);
    var x2 = irand(1920);
    var y1 = irand(1080);
    var y2 = irand(1080);
    if (x1 > x2) {
        t = x2;
        x2 = x1;
        x1 = t;
    }
    if (y1 > y2) {
        t = y2;
        y2 = y1;
        y1 = t;
    }
    r.setEntirePath([[x1,y1],[x2,y1],[x2,y2],[x1,y2]]);
}

function makeTitle() {
    var t = tapp.layer.textFrames.add();
    var x = tapp.abb.left + tapp.abb.width * 0.5;
    var y = tapp.abb.bottom + tapp.abb.height * 0.5;
    var fonts = app.textFonts;

    var chattr = t.textRange.characterAttributes;
    var l = fonts.length;
    var i = irand(l);

    chattr.textFont = fonts[i];
    chattr.size = 75 + irand(75);

    t.contents = "The Mayor Of Simpleton";

    x -= t.width * 0.5;
    y += t.height * 0.5;

    // alert("x,y = " + x + ', ' + y);
    t.textRange.justification = Justification.CENTER;
    t.position = [x,y];
}

// -------------------------------------------------------------------------

if (!app.homeScreenVisible) {
    app.activeDocument.close(SaveOptions.PROMPTTOSAVECHANGES);
}

init();
createBackground();
randomRect();
makeTitle();
