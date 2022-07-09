//  Sample code to help figure out the document model.
//------------------------------------------------------------------------------

//----------------------------------
// LIST PROPERTIES OF AN OBJECT...
//----------------------------------
// var obj = WHATEVER;
// var s = "";
// for (var key in obj) {
//     s += key + "\n";
// }
// alert(s);

//------------------------------------------------------------------------------
//  PROJECT...
//  A project has a list of items.  The numerical indexing begins at 1 rather
//  than 0.
//------------------------------------------------------------------------------
// var proj = app.project;
// var items = proj.items;
// var s = "";
// for (var i = 1; i <= proj.numItems; i++) {
//     //--------------------------------------------------------------------------
//     // Items have several identifiers that can be useful when looking for a
//     // specific item:  Name, id, and type
//     //--------------------------------------------------------------------------
//     s += "[" + i + "] id = " +  items[i].id + "   typeName = " + items[i].typeName + "\n";
//     s += "     name = " + items[i].name + "\n\n";
// }
// alert("proj.numItems = " + proj.numItems + "\nitems:\n" + s);

//------------------------------------------------------------------------------
//  Process all TEXT in a composition...
//------------------------------------------------------------------------------
var texts = 0;
for (var i = 1; i <= proj.numItems; i++) {
    if (items[i].typeName == "Composition") {
        var comp = items[i];
        // alert("Found comp: " + comp.name + "\nnumber of layers: " + comp.numLayers);
        var s = "#(inPoint,outPoint):text\n";
        for (var j = 1; j <= comp.numLayers; j++) {
            var layer = comp.layers[j];
            //------------------------------------------------------------------
            // Only process a TextLayer
            //------------------------------------------------------------------
            if (layer instanceof TextLayer == false ) {
                continue; // skip it
            }
            texts += 1;
            //------------------------------------------------------------------
            // You have to go to the text document to get properties for any
            // text layer.  Even the text itself.
            //------------------------------------------------------------------
            var textDoc = layer.text.sourceText.value;
            var lyric = textDoc.text;
            s += "#(" +
                layer.inPoint + ", " +
                layer.outPoint + "):" +
                lyric + "\n";
        }
        alert(s);
    }
}
