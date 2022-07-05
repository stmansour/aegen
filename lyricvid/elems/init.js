
var lapp = {
    songTitle: "Living Life",
    introDuration: 5,           // seconds
    songDuration: 3*60 + 47,    // seconds
    lyricStart: 7,              // seconds
    lyricStop: 3*60 + 40,       // seconds
    comp: app.project.activeItem,
};

function initapp() {
    if (!(lapp.comp instanceof CompItem)) {
        for (var i = 0; i < app.items.numItems; i++) {
            if (app.items[i] instanceof CompItem) {
                lapp.comp = app.items[i];
                break;
            }
        }
    }
}
