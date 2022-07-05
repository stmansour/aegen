#!/usr/bin/env bash

LOGFILE="log"
COOKIES=
OUTFILE="vidmaker.jsx"
CWD=$(pwd)

Usage() {
    cat <<FEOF
gen.sh

DESCRIPTION
    gen.sh is a shell script to create an Adobe Illustrator script that
    produces a lyric video based on a song file (currently of type MP3)
    and a text file containing the lyrics. It creates a file named
    ${OUTFILE}. Open Illustrator, then select File->Scripts->Other Script...
    then select ${OUTFILE}.  This will create a new video called LyricVid.

USAGE
    gen.sh [OPTIONS]

    OPTIONS:

    -u  Display this usage writeup.

Examples
    ./gen.sh

FEOF
}


GenAppInfo() {

cat >"${OUTFILE}" <<FEOF
var lyricapp = {
    directory: "${CWD}",
    songTitle: "Living Life",
    introDuration: 5,           // seconds
    songDuration: 3*60 + 47,    // seconds
    lyricStart: 7,              // seconds
    lyricStop: 3*60 + 40,       // seconds
};
FEOF

}

makeVid() {
    GenAppInfo
    cat elems/fontlist.js elems/gen.js >> "${OUTFILE}"
}

###############################################################################
###############################################################################

while getopts "csp:u" o; do
	# echo "o = ${o}"
	case "${o}" in
    u)  Usage
        exit 0
        ;;
    *)  echo "Unrecognized option:  ${o}"
        Usage
        exit 1
        ;;
    esac
done
shift $((OPTIND-1))

if [ "${1}x" != "x" ]; then
    Usage
    exit 1
fi

makeVid
