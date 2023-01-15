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

    var fw = new File(lyricapp.writeFilename);
    if (fw == null) {
        alert("No text file selected.");
        return null;
    }
    // fileOK = fw.open("w", "TEXT");
    fileOK = fw.open("w");
    if (!fileOK) {
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
    //  Iterate through the layers in the composition
    //------------------------------------------------------------------------------
    var textLayers = []; // an array to store the text layers in the order that they appear on the timeline

    for (var i = 1; i <= comp.numLayers; i++) {
        var layer = comp.layer(i);
        // Check if the layer is a text layer
        if (layer.matchName == "ADBE Text Layer") {
            // Add the text layer to the array
            textLayers.push({ 
                index: layer.index,
                inPoint: layer.inPoint,
                outPoint: layer.outPoint,
                text: layer.text.sourceText.value });
        }
    }

    // Sort the text layers array by the index property
    textLayers.sort(function (a, b) {
        return b.index - a.index;
    });

    // Write the text of the text layers to the file
    var s;
    for (var i = 0; i < textLayers.length; i++) {
        var layer = textLayers[i];
        s = "#(" +
            layer.inPoint + "," +
            layer.outPoint + "):" +
            layer.text.text;
        fw.writeln(s);
    }
    fw.close();
}

RebuildLyricFile();
