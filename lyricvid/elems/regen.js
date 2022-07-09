//  rebuild.jsx writes a file called ouptput.txt that can be used to
//  create a new video from scratch, but it retains the inPoint and outPoint
//  for each lyric line (for each TextLayer).
//
//  Just run this script with the lyric video composition as the open comp.
//------------------------------------------------------------------------------

function RebuildLyricFile() {
    var comp = app.project.activeItem;
    if (comp instanceof CompItem == false) {
        alert("You must select the composition to work on.");
        return;
    }

    var fw = File(lyricapp.writeFilename);
    if (fw == null) {
         alert("No text file selected.");
         return null;
     }
    fileOK = fw.open("w", "TEXT");
    if (!fileOK){
        alert("File open for write failed!");
        return null;
    }
    // #compName:Gray - Living Life (Official Lyric Video)
    // #compWidth:1920
    // #compHeight:1080

    fw.writeln("#compName:" + lyricapp.compName);
    fw.writeln("#compWidth:" + lyricapp.compWidth);
    fw.writeln("#compHeight:" + lyricapp.compHeight);
    //------------------------------------------------------------------------------
    //  Process all TEXT in a composition...
    //------------------------------------------------------------------------------
    // var s = "#(inPoint,outPoint):text\n";
    var s;
    for (var j = 1; j <= comp.numLayers; j++) {
        var layer = comp.layers[j];
        if (layer instanceof TextLayer == false ) {
            continue; // skip it
        }
        var textDoc = layer.text.sourceText.value;
        var lyric = textDoc.text;
        s = "#(" +
            layer.inPoint + "," +
            layer.outPoint + "):" +
            lyric + "\n";
        fw.write(s);
    }
    fw.close();
}

RebuildLyricFile();
