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
    gen.sh [OPTIONS] [lyricfile]

    OPTIONS:
    -l lyricfile

    -u  Display this usage writeup.

Examples
    ./gen.sh
    This will generate an error as the lyric file is required.

    ./gen.sh -l lyrics.txt
    Creates a lyric video for the lyrics in lyrics.txt

    ./gen.sh lyrics.txt
    Same as ./gen.sh -l lyrics.txt

FEOF
}



GenAppInfo() {

cat >"${OUTFILE}" <<FEOF

var lyricapp = {
    directory: "${CWD}",
    lyricsfilename: "${LYRICFILE}",
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

LYRICFILE=""

while getopts "l:u" o; do
	# echo "o = ${o}"
	case "${o}" in
    l)  LYRICFILE="${OPTARG}"
        ;;
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
    LYRICFILE="${1}"
fi

if [ "${LYRICFILE}x" == "x" ]; then
    echo "You must supply the lyric file"
    exit 1;
fi

if [ ! -f "${LYRICFILE}" ]; then
    echo "${LYRICFILE} is not a file that can be processed as lyrics"
    exit 1
fi
#------------------------------------------------------
# make the path to the lyric file absolute...
#------------------------------------------------------
case "${LYRICFILE}" in
    /*) # absolute path
        echo "Lyric file: ${LYRICFILE}"
        ;;
    *)  # some sort of relative path...
        LYRICFILE="${CWD}/${LYRICFILE}"
        echo "Lyric file: ${LYRICFILE}"
        ;;
esac

makeVid
