#!/usr/bin/env bash

LOGFILE="log"
COOKIES=
OUTFILE="vidmaker.jsx"
CWD=$(pwd)
DURATION=200        # if no duration or audio is specified, assume 200 seconds

Usage() {
    cat <<FEOF
gen.sh

DESCRIPTION
    gen.sh is a shell script to create an Adobe Illustrator script that
    produces a lyric video based on a song file (currently of type MP3)
    and a text file containing the lyrics. It creates a file named
    ${OUTFILE}. Open Illustrator, then select File->Scripts->Other Script...
    then select ${OUTFILE}.  This will create a new video called LyricVid.
    No audio file is required to create the video. If the audio file is
    available it is best to supply it using the -a option. This will allow
    the correct duration of the video to be set. If the audio file is not
    available but you know the duration of the song, you can supply it with
    the -d option. If the duration is not set and no audio file is specified,
    then a default duration of 200 seconds is used.

    The lyric file should be a pure text file. Each line should be a line of
    the lyrics.  Special directives can be made by making the first character
    of the line a hash sign (#). Supported directives are listed below along
    with the default values:

        #title:Lyric Video
        #compName:(Official Lyric Video)
        #compWidth:1920
        #compHeight:1080


USAGE
    gen.sh [OPTIONS] [lyricfile]

    OPTIONS:
    -a audiofile    The audio file to use in the video
    -d duration     The duration of the audio in seconds
    -l lyricfile    The lyrics for this song
    -u              Display this usage writeup.

Examples
    ./gen.sh
    This will generate an error as the lyric file is required.

    ./gen.sh -l lyrics.txt
    Creates a lyric video for the lyrics in lyrics.txt using the default time
    of 200 seconds.

    ./gen.sh lyrics.txt
    Same as ./gen.sh -l lyrics.txt

    ./gen.sh -l lyrics.txt -a LivingLife.mp3
    Creates a lyric video for the lyrics in lyrics.txt and uses the duration of
    the supplied video file rather than the default time of 200 sec.

FEOF
}

GenAppInfo() {
    cat >"${OUTFILE}" <<FEOF

var lyricapp = {
    directory: "${CWD}",
    lyricsfilename: "${LYRICFILE}",
    compName: "(Official Lyric Video)",
    compWidth: 1920,
    compHeight: 1080,
    introDuration: 5,               // seconds
    songDuration: "${DURATION}",    // seconds
    lyricStart: 7,                  // seconds
    lyricStop: 3*60 + 40,           // seconds
};
FEOF

}

makeVid() {
    GenAppInfo
    cat ${SCRIPTPATH}/elems/fontlist.js ${SCRIPTPATH}/elems/gen.js >> "${OUTFILE}"
}

###############################################################################
###############################################################################

LYRICFILE=""
AUDIOFILE=""
PWD=$(pwd)
echo "PWD = ${PWD}"
SCRIPTPATH="$0"

while getopts "a:d:l:u" o; do
	# echo "o = ${o}"
	case "${o}" in
    a)  AUDIOFILE="${OPTARG}"
        if [ ! -f "${AUDIOFILE}" ]; then
            echo "file ${AUDIOFILE} does not exist"
            exit 1;
        fi
        DURATION=$(afinfo "${AUDIOFILE}" | grep duration | sed 's/^[^:][^:]*://' | sed 's/ sec//' | sed 's/ //g')
        echo "Audio file: ${AUDIOFILE}"
        echo "Duration: ${DURATION} sec"
        ;;
    d)  DURATION="${OPTARG}"
        echo "Duration: ${DURATION} sec"
        ;;
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

case "${SCRIPTPATH}" in
    /*) echo "SCRIPTPATH = ${SCRIPTPATH}"
        ;;
    *)  SCRIPTPATH="${CWD}/${SCRIPTPATH}"
        SCRIPTPATH=$(dirname "${SCRIPTPATH}")
        echo "SCRIPTPATH = ${SCRIPTPATH}"
        ;;
esac

makeVid
