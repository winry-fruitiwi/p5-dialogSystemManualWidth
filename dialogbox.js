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
            cursor.x += textWidth(letter)
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
}
