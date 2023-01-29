#  effects.sh  -  add effects to a lyric video

LOGFILE="log"
COOKIES=
OUTFILE="effects.jsx"
CWD=$(pwd)
DURATION=200        # if no duration or audio is specified, assume 200 seconds
TMPINFOFILE="xxqqyyaa"
SRCROOT="/Users/stevemansour/Documents/src/js/aegen/lyricvid"

Usage() {
    cat <<FEOF
effects.sh

DESCRIPTION
    effects.sh is a shell script to create an Adobe After Effects script that
    stylizes a lyric video. It is designed to be used after running the script
    created by gen.sh.

USAGE
    effects.sh [OPTIONS] [lyricfile]

    OPTIONS:
    -h              Display this usage writeup.

Examples
    ./effects.sh
    This will generate a file named effects.jsx.
FEOF
}

#  genAppInfo writes the first part of the .jsx file. It includes the
#  app object initilized.
#------------------------------------------------------------------------------
genAppInfo() {
    cat >"${TMPINFOFILE}" <<FEOF

var effapp = {
    directory: "${CWD}",
    writeFilename: "${CWD}/output.txt",
};
FEOF
}

finishEffectsScript() {

cat >>"${OUTFILE}" <<FEOF

function effectsMain(comp,len) {
    var i;
    var comp = app.project.activeItem;
    if (comp == null || !(comp instanceof CompItem)) {
        alert("Select a composition first");
        return;
    }
    if (comp.numLayers < 1) {
        alert("There are no layers in this comp.  Add at least 1.");
    }

    //---------------------
    // Customize here
    //---------------------
    fadeText(comp,0.25);
    changeTextFonts(comp,fontList[ randomIntInterval(0,fontList.length-1) ]);
    // setAllTextAnchorPoints(comp,"RANDOM"); // a random anchor point for each
    // rotateAllTextFromTo(comp,-35,0,.4);

}

app.beginUndoGroup("addeffects");
effectsMain();
app.endUndoGroup();

FEOF

}
generateEffectsScript() {
    genAppInfo
    cat "${TMPINFOFILE}" ${SRCROOT}/elems/utils.js ${SRCROOT}/elems/fontlist.js ${SRCROOT}/elems/transform.js > "${OUTFILE}"
    rm -f "${TMPINFOFILE}"
    finishEffectsScript
}

###############################################################################
###############################################################################

PWD=$(pwd)
# echo "PWD = ${PWD}"

while getopts "hu" o; do
	# echo "o = ${o}"
	case "${o}" in
    h|u)  Usage
        exit 0
        ;;
    *)  echo "Unrecognized option:  ${o}"
        Usage
        exit 1
        ;;
    esac
done
shift $((OPTIND-1))

generateEffectsScript
echo "generated script: ${OUTFILE}"
