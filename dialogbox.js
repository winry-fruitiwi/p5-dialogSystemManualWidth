class DialogBox {
    constructor(passages, highlightIndices, textFrame) {
        // this is the old hard-coded passage
        //this.passage = "So, you've accessed a network station. Well done," +
        //   " Samus. I have reviewed your vital signs and video log from the" +
        //   " data you uploaded. My readings indicate" +
        //   " dramatic physical changes in you. Whatever caused these" +
        //   " changes seems to have stripped you of most abilities. That" +
        //   " brings me to your assailant. I am checking the Federation" +
        //   " database against your" +
        //   " video log. It appears to have been a Chozo. The attacker's" +
        //   " identity is not yet clear." +
        //   " Return to your ship on the surface. "
        // "It appears to have been a Chozo" had "be" instead of "have"!
        // old: "It appears to be been a Chozo"

        // my collection of passages
        this.passages = passages
        // passageIndex keeps track of what passage I'm on
        this.passageIndex = 0
        // this.index is the key ingredient to advancing letters.
        this.index = 0

        // we use this to determine which indices to highlight. Also
        // controlled by this.passageIndex.
        this.highlightIndices = highlightIndices

        // the frame for the text
        this.textFrame = textFrame
    }

    // I looked for this function online, so we can use it as a coding sprint.
    sleep(milliseconds) {
        const date = Date.now()
        let currentDate = null
        do {
            currentDate = Date.now()
        } while (currentDate - date < milliseconds)
    }

    // loads the saved box texture with transparency
    renderTextFrame(cam) {
        cam.beginHUD(p5._renderer, width, height)
        image(this.textFrame, 0, 0, width, height)
        cam.endHUD()
    }

    render() {
        this.renderTextFrame(cam)

        cam.beginHUD(p5._renderer, width, height)
        // the margin for all sides
        let margin = 72
        // our current position. since text coordinates start at bottom
        // left, we have to modify the height so that even the largest font
        // won't be clipped at the top.
        let cursor = new p5.Vector(margin, 270 + textAscent())
        textSize(18)
        text("ADAM", 62, 260)
        textSize(14)

        // the current sets of highlight indices
        let highlightIndexSet = this.highlightIndices[this.passageIndex]

        // our current passage
        let passage = this.passages[this.passageIndex]

        // loop through every letter in our passage
        for (let i = 0; i < this.index; i++) {
            let letter = passage[i]

            // draw the letter
            try { // try to retrieve a set of highlight indices
                if (
                    i >= highlightIndexSet[0].start &&
                    i <= highlightIndexSet[0].end
                )
                    fill(60, 100, 100)
                else if (
                    i >= highlightIndexSet[1].start &&
                    i <= highlightIndexSet[1].end
                )
                    fill(60, 100, 100)
                else
                    fill(0, 0, 100)
            } catch { // if there's no index or too many indices, fill white
                fill(0, 0, 100)
            }
            text(letter, cursor.x, cursor.y)

            // // if the width of our letter and our x position are greater
            // // than width-margin, we start a new line by modifying the
            // // current cursor we have.
            // if (cursor.x + textWidth(letter) > width - margin) {
            //     cursor.x = margin
            //     cursor.y += textAscent() + textDescent() + 2
            //     continue
            // } old letter wrap

            // more advanced word wrap
            if (letter === " ") {
                let currentDelimiter = i
                let nextDelimiter = passage.indexOf(" ", i+1)
                let nextWord = passage.substring(
                    currentDelimiter,
                    nextDelimiter + 1 // add one to include the space
                )

                if (textWidth(nextWord) + cursor.x >= width-margin) {
                    cursor.x = margin
                    cursor.y += textAscent() + textDescent() + 2
                    continue
                }
            }

            // advance the text
            cursor.x += this.wordWidth(letter)
        }

        if (frameCount % 1 === 0) {
            this.index += 1
            this.index = constrain(this.index, 0, passage.length-1)
            if (this.index >= passage.length-1) {

                if (this.passageIndex < this.passages.length-1) {
                    this.index = 0
                    this.passageIndex += 1
                }
            }
        }
        cam.endHUD()
    }

    /**
     * this can't be large because our charWidth graphics buffer is of finite
     * size! note that we must also take into account our webpage scaling in
     * chrome; I have it set at 125%, a significant bump up from default.
     * @type {number}
     */
    // const FONT_SIZE = 18
    // const LETTER_SPACING = 1.25
    // const SPACE_WIDTH = FONT_SIZE / 2


    preload() {
        font = loadFont('data/giga.ttf')
        // font = loadFont("data/meiryo.ttf")
    }


    setup() {
        // createCanvas(640, 360) // , WEBGL) // we don't need WEBGL yet
        createCanvas(640, 360);
        colorMode(HSB, 360, 100, 100, 100)
        textFont(font, 18)
        // textAlign(CENTER, CENTER)
        background(0, 0, 0)

        fill(0, 0, 100)
        noStroke()

        // codyCharWidth("d")
        // charWidth("d")
        // wordWidth("d")

        // displayPassage("This is our test statement: 'Test test! Can you hear" +
        //     " me?' I'm now testing character wrap! Oh, I need to introduce" +
        //     " myself... or the normal person would. I'm too secure! But you can" +
        //     " hack my secret 100-word password full of junk words and bad" +
        //     " words and weirdos and all the words you could name. Then you'll" +
        //     " get a proper introduction - in person!")

        let input = "I couldn't even get one pixel working because my" +
            " generatePixel function didn't work. I need four nested loops to" +
            " be able to complete my task because I don't know how to do this" +
            " otherwise. It seems like I'm loading just fine."

        // displayPassage(input)
    }

    displayPassage(passage) {
        let cursor = new p5.Vector(0, 100)
        let EXTRA_SPACING = 1
        // loop through every character in passage
        for (let char of passage) {
            // in the giga.ttf font, spaces are actually displayed as ☒s without
            // as much width. That's why we need a special case and a continue
            // statement. This is also the case in charWidth.
            if (char === ' ') {
                cursor.x += charWidth(' ')
                // now we can continue this loop; there's nothing to draw.
                continue
            }

            text(char, cursor.x, cursor.y)

            if (charWidth(char) * 2 + cursor.x > width) {
                cursor.y += textAscent() + textDescent() * 2
                cursor.x = 0
            } else {
                cursor.x += charWidth(char) + EXTRA_SPACING
            }
        }
    }


    /**
     * use charWidth to find the width of more than one character
     *
     * "Hello" → word
     *
     * for letter of word:
     *     call charWidth, add to sum
     * at the end of program, return the sum
     */
    wordWidth(word) {
        let sum = 0

        for (let letter of word) {
            sum += this.charWidth(letter)
        }

        return sum
    }



    /*  return the width in pixels of char using the pixels array
     */
    charWidth(char) {
        if (char === ' ') {
            // console.log("letterWidth: " + 7/18 * FONT_SIZE)
            return 7/18 * 18 // size of the character m divided by 2
        } else {
            let g = createGraphics(18, 18 * 1.5)
            g.colorMode(HSB, 360, 100, 100, 100)
            g.textFont(font, 18)
            g.background(0, 0, 0)
            g.fill(0, 0, 100)

            let d = g.pixelDensity()
            g.text(char, 0, textAscent())
            // text(char, 0, textAscent())
            g.loadPixels()
            loadPixels()

            let endX = 0

            // loop through every pixel (column-major)
            for (let x = 0; x < g.width; x++) {
                for (let y = 0; y < g.height; y++) {
                    // I need to derive this formula.
                    let off = (y * g.width + x) * d * 4
                    if (g.pixels[off] !== 0 || g.pixels[off+1] !== 0 ||
                        g.pixels[off+2] !== 0) {
                        // print("?")
                        // endX = max(x, endX)
                        endX = x
                        // stroke(100, 100, 100)
                        // point(x, y)
                        // we don't need to search for any more white pixels: break!
                        break
                    }
                }
            }

            // console.log("endX: " + endX)
            return endX
        }
    }

}
