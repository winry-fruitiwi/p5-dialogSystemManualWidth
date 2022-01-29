/*
@author
@date 2022.01.25


 */
let font, textFrame, voice, p5amp
let passages // our json file input

function preload() {
    font = loadFont('data/giga.ttf')
    passages = loadJSON("test.json")
    textFrame = loadImage('data/textFrame.png')
    voice = loadSound('data/artaria.mp3', 0, 0)
}

/* populate an array of passage text */
let textList = []
/* grab other information: ms spent on each passage, highlights */
let highlightList = [] // a list of tuples specifying highlights and indexes
let msPerPassage = [] // how long to wait before advancing a passage
// there's a period of no dialog box before the text starts. This represents
// how long that is.
let jumpMillis = 16000
let dialogBox, cam

function setup() {
    createCanvas(640, 360, WEBGL)
    colorMode(HSB, 360, 100, 100, 100)
    textFont(font, 14)
    cam = new Dw.EasyCam(this._renderer, {distance: 240});

    voice.play()
    p5amp = new p5.Amplitude()

    for (let i = 0; i < Object.keys(passages).length; i++) {
        textList.push(passages[i].text)
        highlightList.push(passages[i].highlightIndices)
        msPerPassage.push(passages[i].ms)
    }

    // console.log(textList)
    // console.log(highlightList)
    // console.log(msPerPassage)

    dialogBox = new DialogBox(textList, highlightList, textFrame, msPerPassage, jumpMillis)
}

const SATURATION = 100
const P_BRIGHTNESS = 100
const N_BRIGHTNESS = 40

// draws a set of axes similar to those in Blender
function drawBlenderAxes() {
    // x-axis
    stroke(0, SATURATION, P_BRIGHTNESS)
    line(0, 0, 4000, 0)

    stroke(0, SATURATION, N_BRIGHTNESS)
    line(-4000, 0, 0, 0)

    // y-axis (Webstorm has the values inverted!)
    stroke(120, SATURATION, P_BRIGHTNESS)
    line(0, 0, 0, 4000)

    stroke(120, SATURATION, N_BRIGHTNESS)
    line(0, -4000, 0, 0)

    // z-axis
    stroke(240, SATURATION, P_BRIGHTNESS)
    line(0, 0, 0, 0, 0, 4000)

    stroke(240, SATURATION, N_BRIGHTNESS)
    line(0, 0, -4000, 0, 0, 0)
}

function draw() {
    background(234, 34, 24)

    drawBlenderAxes()

    // text("Not just groovy!", width/2, height/2) // just seeing the font :)
    // render the dialog
    dialogBox.render()
}

// prevent the context menu from showing up :3 nya~
document.oncontextmenu = function () {
    return false;
}

function touchStarted() {
    if (getAudioContext().state !== 'running') {
        getAudioContext().resume().then(r => {});
    }
}
