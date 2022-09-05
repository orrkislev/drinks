let finalImage
function finishImage() {
    finalImage = get()
    // windowResized()
}

// function windowResized() {
//     if (!finalImage) finalImage = get()
//     resizeCanvas(min(windowWidth, windowHeight), min(windowWidth, windowHeight));
//     resetMatrix()
//     image(finalImage, 0, 0, width, height)
// }

function preload() {
    if (typeof preloadShader === "function") preloadShader()
    if (typeof preloadFont === "function") preloadFont()
    if (typeof preloadImage === "function") preloadImage()
}


const v = (x, y) => createVector(x, y)

const resetRandomPlaces = [500,1000,1500,2000,2500]
const resetRandom = () => {
    const t = resetRandomPlaces.shift()
    resetFxRand(t)
    resetRandomPlaces.push(t)
}
const random = (a = 1, b = 0) => fxrand() * (b - a) + a
const randomRange = (range) => random(range[0], range[1])
const round_random = (a = 1, b = 0) => Math.floor(random(a, b + 1))
const choose = (arr) => arr[Math.floor(random(arr.length))]

Array.prototype.pushArray = function pushArray(arr) {
    arr.forEach(element => this.push(element));
}
Array.prototype.get = function get(i) {
    return this[i % this.length]
}
Array.prototype.rotateShape = function rotateShape(a) {
    const sumToRotate = this.length * a / 360
    for (let i = 0; i < sumToRotate; i++) this.push(this.shift())
    return this
}
function applyRemove(func) {
    push()
    noStroke()
    fill(0)
    blendMode(REMOVE)
    func()
    pop()
}

function findNumberInString(txt) {
    if (typeof txt == 'number') return txt
    const r = /\d+/;
    const regx = txt.match(r)
    return regx ? parseInt(regx[0]) : false
}
function findWordInString(txt, word) {
    if (word instanceof Array) return word.reduce((a, b) => a || findWordInString(txt, b), false)
    if (!(typeof txt == 'string')) return false
    return txt.includes(word)
}


class Chance {
    constructor(options) {
        this.options = []
        Object.entries(options).forEach(([option, chance]) => this.add(option, chance))
    }
    add(option, chance) {
        for (let i = 0; i < chance; i++) this.options.push(option)
    }
    get() {
        return choose(this.options)
    }
}