
// zoomer - zooms in at the layer inPoint and zooms out at the outPoint
//
// INPUTS
//    l = layer to zoom
// mode = 1 = zoomin only, 2 = zoomout only, 3 = zoomin and zoomout
function zoomer(comp,l,mode) {
    var prop = l.scale;
    var t = l.inPoint;
    var tout = l.outPoint;
    var fr = comp.frameRate;
    if ( mode & 0x01 != 0 ) {
        prop.setValueAtTime(t, [0,0]);
        prop.setValueAtTime(t + 10/fr, [100,100]);
    }
    if ( mode & 0x2 != 0) {
        prop.setValueAtTime(tout, [0,0]);
        prop.setValueAtTime(tout - 10/fr, [100,100]);
    }
    var easeIn = new KeyframeEase(0.85, 85);
    var easeOut = new KeyframeEase(0.25, 25);
    for (var i = 1; i <= prop.numKeys; i++) {
        prop.setTemporalEaseAtKey(i, [easeIn,easeIn,easeIn], [easeOut,easeOut,easeOut]);
    }
}

// fader - fades in and fades out
//
// INPUTS
//    l = layer to fade
// mode = 1 = fade in only, 2 = fade out only, 3 = fade in and fade out
function fader(comp,l,mode) {
    var prop = l.opacity;
    var t = l.inPoint;
    var tout = l.outPoint;
    var fr = comp.frameRate;
    if ( mode & 0x01 != 0 ) {
        prop.setValueAtTime(t, 0);
        prop.setValueAtTime(t + 10/fr, 100);
    }
    if ( mode & 0x2 != 0) {
        prop.setValueAtTime(tout, 0);
        prop.setValueAtTime(tout - 10/fr, 100);
    }
    var easeIn = new KeyframeEase(0.85, 85);
    var easeOut = new KeyframeEase(0.25, 25);
    for (var i = 1; i <= prop.numKeys; i++) {
        prop.setTemporalEaseAtKey(i, [easeIn], [easeOut]);
    }
}



function stylizeLyrics() {
    var comp = lapp.comp;

    for (var i = 1; i <= comp.numLayers; i++) {
        var l = comp.layers[i];
        // zoomer(comp,l,3);
        fader(comp,l,3);
    }

}

function main() {
    initapp();
    app.beginUndoGroup("Stylize Lyrics");
    stylizeLyrics();
    app.endUndoGroup();
}

main();
