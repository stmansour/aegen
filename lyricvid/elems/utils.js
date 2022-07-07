function number_format(number, decimals, dec_point, thousands_sep) {
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        toFixedFix = function (n, prec) {
            // Fix for IE parseFloat(0.55).toFixed(0) = 0;
            var k = Math.pow(10, prec);
            return Math.round(n * k) / k;
        },
        s = (prec ? toFixedFix(n, prec) : Math.round(n)).toString().split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}

// var file = "C:/Users/jamesc/video.mp4";
function importFootage(file) {
    var myComp = app.project.activeItem; // your opened composition
    if (!myComp || !(myComp instanceof CompItem)) {
        alert("Please, open composition");
        return false;
    }
    app.beginUndoGroup("Import file");
    var importOpts = new ImportOptions(File(file));
    var importFootage = app.project.importFile(importOpts);
    var myFootage = myComp.layers.add(importFootage); // add footage to your composition
    app.endUndoGroup();
};
