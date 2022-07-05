// After Effects script
//=============================================================================

function createSong() {
    var song = {
        lyrics: [
            "and I'm thinking",
            "'bout this caged-in life",
            "can't help feeling",
            "life has passed me by",
            "I just don't understand",
            "the point of it all sometimes",
            "or the mouse in the trap",
            "that struggles before it dies",
            "so I'm calling",
            "up my boys tonight",
            "night is falling",
            "so just one more time",
            "I said Hey",
            "gonna play tonight",
            "Have a round, drink it down",
            "and the next one's mine",
            "Let's go out with a blast",
            "and let's do it right",
            "One more time",
            "Livin' Life",
            "Too much drinking",
            "I hear nature's call",
            "counting cracks in",
            "this grimy bathroom wall",
            "seeing double",
            "don't think I should drive",
            "I should stop now",
            "while I can still count to five",
            "But it's Hey, Hey, Hey",
            "life's okay tonight",
            "While we're here commandeer",
            "all the hootch in sight",
            "Let's go out with a blast",
            "and let's do it right",
            "One more time",
            "Livin' Life",
            "We're not as young as we used to be",
            "but we're taking this chance",
            "We're gonna make us some history",
            "while there's still time to dance",
            "d d d d d d dance!",
            "I said Hey, Hey, Hey",
            "and we play tonight",
            "Coke and Crown, all around",
            "but the bottom line",
            "Is we're out with a blast",
            "so let's do it right",
            "One more time",
            "Livin' Life",
            "I said Hey tonight",
            "Singing cheers while we're here",
            "for just one more time",
            "Let's go out with a blast",
            "and let's do it right",
            "One more time",
            "Livin' Life",
        ],
        solos: [
            { start: 0*60 + 55, stop: 1*60 +  4 },
            // { start: 1*60 + 21, stop: 1*60 + 28 },
            // { start: 2*60 + 19, stop: 2*60 + 22 },
            // { start: 2*60 + 38, stop: 2*60 + 40 },
            { start: 2*60 + 45, stop: 3*60 +  6 },
        ],
};
    return song;
}

function setupTextDocument(tdoc) {
    tdoc.resetCharStyle();
    tdoc.resetParagraphStyle();
    tdoc.font = "Calibri";
    tdoc.fontSize = 100;
    tdoc.fillColor = [1,1,1];
    tdoc.strokeColor = [0,1,0];
    tdoc.strokeWidth = 2;
    tdoc.strokeOverFill = true;
    tdoc.applyStroke = false;
    tdoc.applyFill = true;
    tdoc.justification = ParagraphJustification.CENTER_JUSTIFY;
    tdoc.tracking = 50;
    tdoc.leading = 25;
    return tdoc;
}

// INPUT
//   n = index of the solo
//
// RETURNS
//   the video time for where this solo begins...
//-----------------------------------------------------------------------------
function soloStartTime(song,n) {
    return lapp.introDuration + song.solos[n].start;
}

// INPUT
//   n = index of the solo
//
// RETURNS
//   the video time for where this solo ends...
//-----------------------------------------------------------------------------
function soloStopTime(song,n) {
    return lapp.introDuration + song.solos[n].stop;
}

function buildLyricVid() {
    var comp = lapp.comp;
    var song = createSong();
    var i;

    //-----------------------------------------------------------------------
    // Step 1.  When does first vocal start, when does the last vocal stop.
    //          This forms the initial lyric time.
    //-----------------------------------------------------------------------
    var lyricDuration = lapp.lyricStop - lapp.lyricStart;

    //-----------------------------------------------------------------------
    // Next, how much time is taken is taken up by solos...
    //-----------------------------------------------------------------------
    var solotime = 0;
    var soloidx = -1;  // assume no solos
    var solostart = 0; // assume no solo
    if (song.solos.length > 0) {
        soloidx = 0;   // if there are solos, this is the first one
        soloStart = soloStartTime(song,soloidx);
    }
    for (i = 0; i < song.solos.length; i++) {
        lyricDuration -= song.solos[i].stop - song.solos[i].start;  // duration of this solo
    }

    var inTime = lapp.introDuration + lapp.lyricStart;
    var layer, tprop, tdoc;
    var proj = app.project;
    var item = proj.item(1);

    //-----------------------------------------------------------------------
    // For how long is each lyric is visible?  This is certainly not perfect,
    // but it's a reasonable starting point.
    //-----------------------------------------------------------------------
    var dt = lyricDuration / song.lyrics.length;

    for (i = 0; i < song.lyrics.length; i++) {
        layer = item.layers.addText(song.lyrics[i]);
        tprop = layer.property("Source Text");
        tdoc = setupTextDocument(tprop.value);
        tprop.setValue(tdoc);
        layer.inPoint = inTime;
        inTime += dt;
        layer.outPoint = inTime;

        //------------------------------------------------------------------
        // Quck check to see if we've moved into any of the solo spaces.
        // if so, jump around it.
        //------------------------------------------------------------------
        if (soloidx >= 0) {     // is a solo coming up?
            if (inTime >= soloStart) {      // have we reached the solo time?
                inTime = soloStopTime(song,soloidx);    // yes: move past the solo
                soloidx += 1;
                if (soloidx >= song.solos.length) {
                    soloidx = -1;   // no more solos
                } else {
                    soloStart = soloStartTime(song,soloidx);   // next solo starts here
                }
            }
        }
    }
}

function mainscript() {
    buildLyricVid();
}

app.beginUndoGroup("Add Lyrics");
    initapp();
    mainscript();
app.endUndoGroup();
