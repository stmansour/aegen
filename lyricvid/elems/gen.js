// After Effects script
//=============================================================================

function createSong() {
    var song = {
        lyrics: [],
        title: "",
        solos: [
            // { start: 0*60 + 55, stop: 1*60 +  4 },
            // { start: 1*60 + 21, stop: 1*60 + 28 },
            // { start: 2*60 + 19, stop: 2*60 + 22 },
            // { start: 2*60 + 38, stop: 2*60 + 40 },
            // { start: 2*60 + 45, stop: 3*60 +  6 },
        ],
    };
    var Debug=false;

    lyricFile = File(lyricapp.lyricsFilename);
    if (lyricFile == null) {
         alert("No text file selected.");
         return null;
     }
    var fileOK = lyricFile.open("r");
    if (!fileOK){
        alert("File open failed!");
        return null;
    }
    var text;
    var sinfo;

    while (!lyricFile.eof) {
        sinfo = "";
        text = lyricFile.readln();
        if (text == "") {
            text = "\r";
        }
        if (text[0] == '#') {
            var as = text.split(":");   // #title:Song Title
            if (as.length < 2) {
                alert("Invalid directive in lyrics file: " + text);
                return null;
            }
            var cmd = as[0];            // #title
            var val = as[1];            // Song Title
            if (text[1] == '(') {
                sinfo = cmd.substr(2,cmd.length-3);
                cmd = "#place"
            }
            var pts;
            switch(cmd) {
                case "#title":
                    song.title = val;
                    break;
                case "#compName":
                    lyricapp.compName = val;
                    break;
                case "#compWidth":
                    lyricapp.compWidth = parseInt(val);
                    break;
                case "#compHeight":
                    lyricapp.compHeight = parseInt(val);
                    break;
                case "#place":
                    pts = sinfo.split(",");
                    var info = {
                        inPoint: parseFloat(pts[0]),
                        outPoint: parseFloat(pts[1]),
                        text: val,
                    };
                    song.lyrics.push(info);
                    //alert("inPoint: " + info.inPoint + "\noutPoint: " + info.outPoint + "\nlyric: "+val);
                    break;
                default:
                    alert("unknown directive in lyrics file: " + cmd);
                    break;
            }
        } else {
            song.lyrics.push({inPoint: -1, outPoint: -1, text: text});
        }
    }

    // DEBUG
    if (Debug) {
        var s="";
        for (var i = 0; i < song.lyrics.length; i++) {
            s += "in: " + song.lyrics[i].inPoint + ", out: " + song.lyrics[i].outPoint + ", " + song.lyrics[i].text + "\n";
        }
        alert(s);
    }

    lyricFile.close();
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
    return song.solos[n].start;
}

// INPUT
//   n = index of the solo
//
// RETURNS
//   the video time for where this solo ends...
//-----------------------------------------------------------------------------
function soloStopTime(song,n) {
    return song.solos[n].stop;
}

function buildLyricVid() {
    var i;
    var song = createSong();   // load lyrics, set times where lyrics are excluded
    if (song == null) {
        return;
    }

    //-----------------------------------------------------------------------
    // Step 1.  When does first vocal start, when does the last vocal stop.
    //          This forms the initial lyric time.
    //-----------------------------------------------------------------------
    if (song.lyrics.length > 0) {
        lyricapp.lyricStop = lyricapp.songDuration -  lyricapp.songDuration/song.lyrics.length;
    }
    var lyricDuration = lyricapp.lyricStop - lyricapp.lyricStart;

    //-----------------------------------------------------------------------
    // Next, how much time is taken is taken up by solos...
    // The idea is to space the lines out evenly and dodge the solo areas
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

    var inTime = lyricapp.lyricStart;  // First lyric line goes here
    var layer, tprop, tdoc;

    var proj = app.project;
    if(!proj) {
        proj = app.newProject();
    }

    // create new comp
    var compW = 1920;                   // comp width
    var compH = 1080;                   // comp height
    var compL = lyricapp.songDuration;      // comp length (seconds)
    var compRate = 30;                  // comp frame rate
    var compBG = [48/255,63/255,84/255] // comp background color

    var myItemCollection = app.project.items;
    var comp = myItemCollection.addComp(lyricapp.compName,compW,compH,1,compL,compRate);
    comp.bgColor = compBG;

    //-----------------------------------------------------------------------
    // Compute how long is each lyric is visible.  This is approximated as the
    // total time lyrics are sung divided by the number of lines of lyrics.
    // This is certainly not perfect, but it's a reasonable starting point.
    //-----------------------------------------------------------------------
    var dt = lyricDuration / song.lyrics.length;

    //-----------------------------------------------------------------------
    // If title is present, show inspect at the beginning for 2 seconds
    //-----------------------------------------------------------------------
    if (song.title.length > 0) {
        layer = comp.layers.addText(song.title);
        tprop = layer.property("Source Text");
        tdoc = setupTextDocument(tprop.value);
        tprop.setValue(tdoc);
        layer.inPoint = 0;
        layer.outPoint = 2;
    }

    // alert(
    //     "lyricDuration = " + lyricDuration + "\n" +
    //     "inTime = " + inTime + "\n" +
    //     "dt = " + dt + "\n"
    // );

    //-----------------------------------------------------------------------
    // Now spin through each line of the song and add it
    //-----------------------------------------------------------------------
    for (i = 0; i < song.lyrics.length; i++) {
        layer = comp.layers.addText(song.lyrics[i].text);
        tprop = layer.property("Source Text");
        tdoc = setupTextDocument(tprop.value);
        tprop.setValue(tdoc);
        //-------------------------------------------------------------------
        // If the lyric has placement information, use it. Otherwise use
        // the current inTime
        //-------------------------------------------------------------------
        if (song.lyrics[i].inPoint >= 0) {
            //---------------------------------------------------------
            // The lyric's time was set in the lyric file
            //---------------------------------------------------------
            layer.inPoint = song.lyrics[i].inPoint;
            layer.outPoint = song.lyrics[i].outPoint;
            inTime += dt;
        } else {
            //---------------------------------------------------------
            // No time info for lyric, just use even distribution time
            //---------------------------------------------------------
            layer.inPoint = inTime;
            inTime += dt;
            layer.outPoint = inTime;
        }

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

    //--------------------------------------------------------------------------
    // Now add the song file if we have it...
    // in the viewer while it's being built.
    //--------------------------------------------------------------------------
    if (lyricapp.audioFilename.length > 0) {
        var importOpts = new ImportOptions(File(lyricapp.audioFilename));
        var importMedia = app.project.importFile(importOpts);
        var myMedia = comp.layers.add(importMedia);
    }

    //--------------------------------------------------------------------------
    // Now we can open the video in the viewer. It works faster if it's not
    // in the viewer while it's being built.
    //--------------------------------------------------------------------------
    comp.openInViewer();
}

function mainscript() {
    buildLyricVid();
}

app.beginUndoGroup("Regenerate Lyrics");
    mainscript();
app.endUndoGroup();
