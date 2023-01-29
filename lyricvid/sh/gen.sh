#!/usr/bin/env bash

LOGFILE="log"
COOKIES=
OUTFILE="vidmaker.jsx"
REGENFILE="rebuild-lyrics.jsx"
TMPINFOFILE="qqzzff"
CWD=$(pwd)
DURATION=200        # if no duration or audio is specified, assume 200 seconds
SRCROOT=$(cd "$(dirname "$0")" && pwd)

Usage() {
    cat <<FEOF
gen.sh

DESCRIPTION
    gen.sh is a shell script that creates an Adobe After Effects script to
    produce a lyric video based on a song file (currently of type MP3)
    and a text file containing the lyrics. It creates two files:
    ${OUTFILE} and ${REGENFILE}. Open After Effects, then select

    File->Scripts->Other Script...

    then select ${OUTFILE}.  This will create a new video called LyricVid.
    No audio file is required to create the video. If the audio file is
    available it is best to supply it using the -a option. This will allow
    the correct duration of the video to be set. It will also add the audio
    file to the composition. If the audio file is not available but you know
    the duration of the song, you can supply it with the -d option. If the
    duration is not set and no audio file is specified, then a default duration
    of 200 seconds is used. At this point you can move the text layers in the
    timeline as needed to match the audio.  You save a file with the updated
    timeline positions by executing ${REGENFILE}, described in more detail
    below.

    The lyric file should be a pure text file. Each line should be a line of
    the lyrics.  Special directives can be made by making the first character
    of the line a hash sign (#). Supported directives are listed below along
    with the default values:

        #title:Lyric Video
        #compName:(Official Lyric Video)
        #compWidth:1920
        #compHeight:1080

    The following are also valid directives that do not have defaults:

        #(inPoint,outPoint):lyric

    This script ${REGENFILE} can write a new lyric file with all the
    directives including the inpoint and outpoint for each text layer.
    Essentially, it regenerates the lyric file with all the lyric lines
    using the directive "#(inPoint,outPoint)".
    This is a huge timesaver if you want to start over or change some effects.
    The file it creates is named "output.txt".
    In order for AE to write to the filesystem you will need to set the
    preference for Scripting & Expressions:  Allow Scripts to Write Files and
    Access the Network.  Also, on Mac OX X, it writes carriage returns (\r) at
    the end of lines rather than the normal linefeed (\n). I was not able to
    find a way to overwrite this behavior. In order to use the file it
    generates in a standard text editor you can use the command like this:

        tr '\r' '\n' <output.txt >newlyrics.txt

    Some files have proven to be problematic for tr.  I have written a
    go program called "fixnl" that performs the same function.  It works when
    tr fails. If it's available on your system you can use this commant
    to fix things:

    	fixnl output.txt >newlyrics.txt


USAGE
    gen.sh [OPTIONS] [lyricfile]

    OPTIONS:
    -a audiofile    The audio file to use in the video
    -d duration     The duration of the audio in seconds
    -l lyricfile    The lyrics for this song
    -s lyricstart   When the lyrics begin (seconds)
    -u              Display this usage writeup.

Examples
    ./gen.sh
    This will generate an error as the lyric file is required.

    ./gen.sh -l lyrics.txt
    Creates a lyric video for the lyrics in lyrics.txt using the default time
    of 200 seconds.

    ./gen.sh lyrics.txt
    Same as ./gen.sh -l lyrics.txt

    ./gen.sh -l lyrics.txt -a LivingLife.mp3 -s 7
    Creates a lyric video for the lyrics in lyrics.txt and uses the duration of
    the supplied video file rather than the default time of 200 sec. The lyrics
    begin 7 seconds into the song.

FEOF
}

#  GenAppInfo writes the first part of the .jsx file. It includes the
#  app object initilized.
#------------------------------------------------------------------------------
GenAppInfo() {
    cat >"${TMPINFOFILE}" <<FEOF

var lyricapp = {
    directory: "${CWD}",
    lyricsFilename: "${LYRICFILE}",
    audioFilename: "${AUDIOFILE}",
    writeFilename: "${CWD}/output.txt",
    compName: "(Official Lyric Video)",
    compWidth: 1920,
    compHeight: 1080,
    songDuration: ${DURATION},    // seconds
    lyricStart: ${LYRICSTART},    // seconds
    lyricStop: ${DURATION},       // first guess, will be modified after lyric load
};
FEOF

}

generateVideoMakerScripts() {
    GenAppInfo
    cat "${TMPINFOFILE}" "${SRCROOT}/fontlist.js" "${SRCROOT}/gen.js" > "${OUTFILE}"
    cat "${TMPINFOFILE}" "${SRCROOT}/regen.js" > "${REGENFILE}"
    rm "${TMPINFOFILE}"
}

###############################################################################
###############################################################################

LYRICFILE=""
AUDIOFILE=""
LYRICSTART="0"
PWD=$(pwd)
echo "PWD = ${PWD}"
SCRIPTPATH="$0"

while getopts "a:d:l:s:uh" o; do
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
    s)  LYRICSTART="${OPTARG}"
        echo "Lyrics start at: ${LYRICSTART} sec"
        ;;
    l)  LYRICFILE="${OPTARG}"
        ;;
    u|h)  Usage
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
# make the paths absolute...
#------------------------------------------------------
if [ "${LYRICFILE:0,1}" != "/" ]; then
        LYRICFILE="${CWD}/${LYRICFILE}"
fi

if [ "${AUDIOFILE}" != "" ]; then
    if [ "${AUDIOFILE:0,1}" != "/" ]; then
        AUDIOFILE="${CWD}/${AUDIOFILE}"
    fi
fi

generateVideoMakerScripts
