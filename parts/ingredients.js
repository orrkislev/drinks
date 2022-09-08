function bubbles() {
    if (!drink.bubbles) return
    resetRandom()

    let sumBubbles = 0
    if (typeof drink.bubbles == 'number') sumBubbles = drink.bubbles
    else {
        const num = findNumberInString(drink.bubbles)
        if (num) sumBubbles = num
    }

    const isSeeds = typeof drink.bubbles == 'string' && drink.bubbles.includes('seeds')
    let bubbleShape = isSeeds ? 'seeds' : 'circle'
    const bubbleColor = isSeeds ? color(30) : color(255)

    for (let t = 0; t < sumBubbles / 10; t++) {
        for (let i = 0; i < 10; i++) {
            const bubblePos = P(
                random(-liquidPath.bounds.right, liquidPath.bounds.right),
                liquidPath.bounds.bottom - random(liquidPath.bounds.height) * (t / 10))
            let bubblePath = new Path.Circle(bubblePos, random(1, 4) * PS).wonky()
            if (bubbleShape == 'seeds') bubblePath.segments[2].point.y -= 3
            bubblePath = bubblePath.rotate(random(-40, 40)).intersect(fullInnerPath)
            new DrinkElement(bubblePath, throughData => {
                const p = throughData.point

                let val = (noise(p.x / 70 * PS + 400, p.y / 70 * PS + 400) + .2) * (p.getDistance(bubblePath.position) / (2 * PS)) * 35
                if (throughData.inLiquid) val *= .15
                if (bubbleShape == 'seeds') val = random(10, 25)

                bubbleColor.setAlpha(val)
                stroke(bubbleColor)
                line(p.x, -p.y, p.x, -p.y)
            })
        }
    }

    if (typeof drink.bubbles == 'number') {
        for (let t = 0; t < drink.bubbles / 10; t++) {
            const offsetUp = random(600)
            const bubblePos = P(
                random(-liquidPath.bounds.right, liquidPath.bounds.right),
                liquidPath.bounds.bottom + random() * random(offsetUp))
            let bubblePath = new Path.Circle(bubblePos, random(1, 4) * PS).wonky()
            if (bubblePos.y < path.bounds.bottom) bubblePath = bubblePath.intersect(fullInnerPath)
            new DrinkElement(bubblePath, throughData => {
                const p = throughData.point
                const distVal = (p.getDistance(bubblePath.position) / (bubblePath.bounds.width))
                let val = (noise(p.x / 70 * PS + 400, p.y / 70 * PS + 400) + .2) * distVal * distVal * 35
                if (throughData.inLiquid) val *= .15
                bubbleColor.setAlpha(val)
                stroke(bubbleColor)
                line(p.x, -p.y, p.x, -p.y)
            })
        }
    }
}

async function ice() {
    if (!drink.ice) return
    resetRandom()
    const sumIce = findNumberInString(drink.ice)
    let iceSize = 35
    if (findWordInString(drink.ice, 'large')) iceSize = 60 * PS
    else if (findWordInString(drink.ice, 'small')) iceSize = 25 * PS
    else if (findWordInString(drink.ice, 'crushed')) iceSize = 5 * PS
    else iceSize = random(5, 60) * PS
    for (let t = 0; t < sumIce; t++) {
        const icePos = P(random(-liquidPath.bounds.right, liquidPath.bounds.right), random(liquidPath.bounds.top, liquidPath.bounds.bottom))
        const icePath = new Path.Circle(icePos, iceSize * random(.7, 1.3)).deform().intersect(fullInnerPath)
        if (!icePath || icePath.length == 0) continue
        new DrinkElement(icePath, throughData => {
            const p = throughData.point
            let val = (noise(p.x / 70 * PS + 400, p.y / 70 * PS + 400) + .2) * (sin(180 * throughData.perc) + .3) * 150
            if (throughData.inLiquid) val *= noise(p.x / 50 * PS + 800, p.y / 50 * PS + 800) * .25
            stroke(255, val)
            line(p.x, -p.y, p.x, -p.y)
        })
    }
}


function leaves() {
    if (!drink.mint) return
    resetRandom()
    const sumLeaves = findNumberInString(drink.mint) ?? 4
    if (findWordInString(drink.mint, 'floating')) {
        const liquidCorner = liquidPath.segments[liquidPath.segments.length - 2].point
        const pos = P((liquidCorner.x - 30 * PS) * random(-1, 1), liquidCorner.y)
        for (let t = 0; t < sumLeaves; t++) {
            const leafLength = 50 * PS
            const leafWidth = 10 * PS
            const leafDirection = pointFromAngle(random(45, 135), leafLength / 2)
            addLeaf(pos, leafDirection, leafWidth)
        }
    } else {
        for (let t = 0; t < sumLeaves; t++) {
            const leafLength = random(20, 50) * PS
            const leafWidth = map(leafLength, 20, 50, 5, 10) * PS
            const leafPos = P(random(-liquidPath.bounds.right, liquidPath.bounds.right), random(liquidPath.bounds.top, liquidPath.bounds.bottom))
            const leafDirection = pointFromAngle(random(360)).multiply(leafLength / 2)

            addLeaf(leafPos, leafDirection, leafWidth)
        }
    }
}

async function addLeaf(leafPos, leafDirection, leafWidth, bg=false) {
    let leafPath = makeLeafPath(leafPos, leafDirection, leafWidth)

    if (!bg) leafPath = leafPath.intersect(fullInnerPath)
    if (!leafPath || leafPath.length == 0) return
    new DrinkElement(leafPath, throughData => {
        const p = throughData.point
        const clr = lerpColor(color('#007f00'), color('#005200'), throughData.perc)
        if (throughData.inLiquid && !bg) {
            const val = (noise(p.x / 70 * PS + 400, p.y / 70 * PS + 400) + .2) * (.5 - abs(throughData.perc - .5)) * 200
            clr.setAlpha(val * .15)
        }
        stroke(clr)
        line(p.x, -p.y, p.x, -p.y)
    })
}

function makeLeafPath(leafPos, leafDirection, leafWidth){
    const leafCenterPath = new Path([
        leafPos, leafPos.add(leafDirection), leafPos.add(leafDirection).add(leafDirection.rotate(-30))
    ])
    leafCenterPath.smooth()

    const rightSidePath = new Path()
    const leftSidePath = new Path()
    let counter = 0
    for (let i = 0; i < leafCenterPath.length; i += 5) {
        const loc = leafCenterPath.getLocationAt(i)
        const d = 1 - abs(i - leafCenterPath.length / 2) / (leafCenterPath.length / 2)
        const l = ((counter++) % 2 == 0 ? leafWidth : leafWidth - 5 * PS)
        rightSidePath.add(loc.point.add(loc.normal.multiply(l * d)))
        leftSidePath.add(loc.point.subtract(loc.normal.multiply(l * d)))
    }
    leftSidePath.reverse()

    leafPath = rightSidePath.join(leftSidePath)
    leafPath.smooth()
    return leafPath
}



let drinkElements = []
class DrinkElement {
    constructor(path, func) {
        this.path = path
        this.func = func
        drinkElements.push(this)
        this.offsetPos = random(-0.3, 0.3)
    }

    async draw() {
        // this.path = this.path.intersect(fullInnerPath)
        await pointilizePath(this.path, (slicePath, sliceData) => {
            through(slicePath, this.offsetPos, throughData => {
                this.func(throughData, sliceData)
            })
        })
    }
}

async function drawDrinkElements() {
    drinkElements.sort((a, b) => random(-1, 1))
    for (let i = 0; i < drinkElements.length; i++) {
        await drinkElements[i].draw()
    }
    drinkElements = []
}

function drawInLiquid(clr) {
    return slicePath => {
        through(slicePath, throughData => {
            const p = throughData.point
            let val = (noise(p.x / 70 * PS + 400, p.y / 70 * PS + 400) + .2) * (.5 - abs(throughData.perc - .5)) * 200
            if (throughData.inLiquid) val *= .1
            clr.setAlpha(val)
            stroke(clr)
            line(p.x, -p.y, p.x, -p.y)
        })
    }
}