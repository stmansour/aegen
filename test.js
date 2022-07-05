var MyComp = app.project.activeItem;
if (MyComp && MyComp.selectedLayers.length > 0) {
    for (var i = 0; i < MyComp.selectedLayers.length; i++) {
        var currentLayer = MyComp.selectedLayers[i];
        currentLayer.property(myProperty = “rotation”).setValueAtTime(MyComp.time, myValue = 5);
    };
} else {
    alert(“At least one layer must be selected”);
};


var MyComp = app.project.activeItem;
if (MyComp && MyComp.selectedLayers.length > 0) {
    for (var i = 0; i < MyComp.selectedLayers.length; i++) {
        var currentLayer = MyComp.selectedLayers[i];
        currentLayer.effect("HandShape")("Slider").setValueAtTime(MyComp.time, myValue = 5);
    }
} else {
    alert("At least one layer must be selected");
}
