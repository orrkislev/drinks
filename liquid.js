
async function drawLiquid() {
    colorMode(HSB)
    const liquidLayers = [
        { perc: 0, color: drink.liquid[0] },
        { perc: 1, color: drink.liquid[1] },
        { perc: 2, color: color(choose(bgColors.top)) },
    ]
    liquidLayers[2].color = color(255)
    colorMode(RGB)

    const mixNoiseScale = random(30, 100)
    const mixNoiseStrength = .5
    await revolve(liquidPath, async (ellipsePath, pathIndex) => {
        let heightPerc = (liquidPath.getPointAt(pathIndex).y - liquidPath.bounds.top) / (liquidPath.bounds.height)

        for (let i = 0; i < ellipsePath.length; i++) {
            const loc = ellipsePath.getLocationAt(i)
            const p = loc.point
            const n = noise(heightPerc * 3, i / 200)

            const currHeight = heightPerc + (noise(p.x / mixNoiseScale - 100, p.y / mixNoiseScale - 100, heightPerc * 9)) * mixNoiseStrength
            let clr = color(0, 0)
            for (let i = 1; i < liquidLayers.length; i++) {
                if (currHeight > liquidLayers[i].perc) continue
                if (i == liquidLayers.length - 1 || currHeight < liquidLayers[i].perc) {
                    const clr1 = liquidLayers[i - 1].color
                    const clr2 = liquidLayers[i].color
                    mixPerc = (currHeight - liquidLayers[i - 1].perc) / (liquidLayers[i].perc - liquidLayers[i - 1].perc)
                    clr = lerpColor(clr1, clr2, mixPerc * 0.7 + n * 0.3)
                    break;
                }
            }


            strokeWeight(4)
            const i2 = i % round(ellipsePath.length / 2)
            const distFromEdges = abs(i2 - ellipsePath.length / 4) / (ellipsePath.length / 4)
            clr = lerpColor(clr, color(0), distFromEdges * (1 - heightPerc))
            clr.setAlpha((1 - heightPerc) * 25 + 25)
            stroke(clr)
            drawDot(p)

            // stroke(255, 10 * noise(heightPerc * 10, i / 50))
            // drawDot(p)
        }
        await timeout()
    })

    if (drink.frost) {
        await revolve(liquidPath, async (ellipsePath, pathIndex) => {
            const posY = liquidPath.getPointAt(pathIndex).y
            if (posY.y < liquidPath.bounds.top + 1 || posY > liquidPath.bounds.bottom - 1) return
            const heightPerc = (posY - liquidPath.bounds.top) / (liquidPath.bounds.height)

            ellipsePath.splitAt(ellipsePath.length * .5)
            const frontPath = ellipsePath.splitAt(ellipsePath.length * .5)
            ellipsePath.remove()

            for (let i = 0; i < frontPath.length; i++) {
                for (let t = 0; t < 1; t++) {
                    const pos = frontPath.getPointAt(i)
                    const p = pos.add(pos.normalize(random() * random() * 5)).add(0, random(-15, 15))
                    const n = noise(heightPerc * 3, i / 200)
                    strokeWeight(4 * n)
                    stroke(255, random(5))
                    drawDot(p)
                }
            }
            await timeout()
        })
    }
}

async function foam() {

    const foamPath = innerPath.clone()
    foamPath.splitAt(min(foamPath.length * (liquidLevel + random(.1)), foamPath.length - 1))
    foamPath.lastSegment.handleOut.set(0, -30)
    foamPath.add(P(0, foamPath.lastSegment.point.y))
    await revolve(foamPath, async (ellipsePath, pathIndex) => {
        const posY = foamPath.getPointAt(pathIndex).y
        if (posY < liquidPath.bounds.bottom) return

        for (let i = 0; i < ellipsePath.length; i++) {
            for (let t = 0; t < 1; t++) {
                const pos = ellipsePath.getPointAt(i)
                strokeWeight(random(4))
                stroke(220 + noise(i / 30, posY / 80) * 35, random(50, 200))
                drawDot(pos)
            }
        }
        await timeout()
    })
}

async function drawFoamBubbles() {
    for (let t = 0; t < 50; t++) {
        const bubblePos = P(
            random(-liquidPath.bounds.right, liquidPath.bounds.right),
            liquidPath.bounds.bottom + random(-5, 5))
        const bubblePath = new Path.Circle(bubblePos, random(10, 40)).wonky().intersect(fullInnerPath)
        await pointilizePath(bubblePath, 1.5, color(255), p => {
            const xperc = (p.x - bubblePath.bounds.left) / bubblePath.bounds.width
            const yperc = (p.y - bubblePath.bounds.top) / bubblePath.bounds.height
            stroke(255, xperc * xperc * yperc * yperc * 8)
            line(p.x, -p.y, p.x, -p.y)
        })
    }
}

function bubbles() {
    let sumBubbles = typeof drink.bubbles == 'number' ? drink.bubbles : 200
    const isSeeds = typeof drink.bubbles == 'string' && drink.bubbles.includes('seeds')
    let bubbleShape = isSeeds ? 'seeds' : 'circle'
    const bubbleColor = isSeeds ? color(30) : color(255)

    for (let t = 0; t < sumBubbles / 10; t++) {
        for (let i = 0; i < 10; i++) {
            const bubblePos = P(
                random(-liquidPath.bounds.right, liquidPath.bounds.right),
                liquidPath.bounds.bottom - random(liquidPath.bounds.height) * (t / 10))
            let bubblePath = new Path.Circle(bubblePos, random(1, 4)).wonky()
            if (bubbleShape == 'seeds') bubblePath.segments[2].point.y -= 3
            bubblePath = bubblePath.rotate(random(-40, 40)).intersect(fullInnerPath)
            new DrinkElement(bubblePath, throughData => {
                const p = throughData.point
                let val = (noise(p.x / 70 + 400, p.y / 70 + 400) + .2) * (p.getDistance(bubblePath.position) / 2) * 35
                if (throughData.inLiquid) val *= .1
                bubbleColor.setAlpha(val)
                stroke(bubbleColor)
                line(p.x, -p.y, p.x, -p.y)
            })
        }
    }

    if (typeof drink.bubbles == 'number') {
        for (let t = 0; t < drink.bubbles / 10; t++) {
            const bubblePos = P(
                random(-liquidPath.bounds.right, liquidPath.bounds.right),
                liquidPath.bounds.bottom + random() * random(300))
            const bubblePath = new Path.Circle(bubblePos, random(1, 4)).wonky().intersect(fullInnerPath)
            new DrinkElement(bubblePath, throughData => {
                const p = throughData.point
                let val = (noise(p.x / 70 + 400, p.y / 70 + 400) + .2) * (p.getDistance(bubblePath.position) / 2) * 35
                if (throughData.inLiquid) val *= .1
                bubbleColor.setAlpha(val)
                stroke(bubbleColor)
                line(p.x, -p.y, p.x, -p.y)
            })
        }
    }
}

async function ice() {
    for (let t = 0; t < 10; t++) {
        const angle1 = 180 + random(45, 135)
        const r = random(30, 80)
        const p1 = pointFromAngle(angle1, r)
        const p2 = pointFromAngle(angle1 - 90, r)
        const p3 = pointFromAngle(angle1 + 90, r)

        const liquidCenter = liquidPath.bounds.center
        const h1 = liquidCenter.y + r / 2
        const h2 = liquidCenter.y - r / 2
        const p1_h1 = p1.clone().multiply(1, getPerspective(h1)).add(0, h1)
        const p2_h1 = p2.clone().multiply(1, getPerspective(h1)).add(0, h1)
        const p3_h1 = p3.clone().multiply(1, getPerspective(h1)).add(0, h1)
        const p2_h2 = p2.clone().multiply(1, getPerspective(h2)).add(0, h2)
        const p3_h2 = p3.clone().multiply(1, getPerspective(h2)).add(0, h2)
        let icePath = new Path([p3_h1, p1_h1, p2_h1, p2_h2, p3_h2])
        icePath.closePath()
        icePath.rebuild(15)
        icePath.wonky(0.99, 1.01)
        icePath.smooth()
        icePath.rotate(random(-10, 10))

        icePath.position = P(-liquidPath.bounds.right + random(liquidPath.bounds.width * 2), liquidPath.bounds.bottom - random(liquidPath.bounds.height))
        // if (icePath.bounds.top > liquidPath.bounds.top) icePath.translate(0, -icePath.bounds.top + liquidPath.bounds.top)
        icePath = icePath.intersect(fullInnerPath)

        new DrinkElement(icePath, throughData => {
            const p = throughData.point
            let val = (noise(p.x / 70 + 400, p.y / 70 + 400) + .2) * (.5 - abs(throughData.perc - .5)) * 200
            if (throughData.inLiquid) val *= .1
            stroke(255, val)
            line(p.x, -p.y, p.x, -p.y)
        })
    }


    // for (let t = 0; t < drink.ice; t++) {
    // const icePos = P(random(-liquidPath.bounds.right, liquidPath.bounds.right), random(liquidPath.bounds.top, liquidPath.bounds.bottom))
    // const icePath = new Path.Circle(icePos, random(30, 80)).deform().intersect(fullInnerPath)
    // if (!icePath || icePath.length == 0) continue
    // new DrinkElement(icePath, color('white'), random(2, 3))
    // }
}


function leaves() {
    for (let t = 0; t < drink.ice; t++) {
        const leafLength = random(50, 100)
        const leafWidth = map(leafLength, 50, 100, 10, 20)
        const leafPos = P(random(-liquidPath.bounds.right, liquidPath.bounds.right), random(liquidPath.bounds.top, liquidPath.bounds.bottom))
        const leafDirection = pointFromAngle(random(360)).multiply(leafLength / 2)

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
            const l = ((counter++) % 2 == 0 ? leafWidth : leafWidth - 5)
            rightSidePath.add(loc.point.add(loc.normal.multiply(l * d)))
            leftSidePath.add(loc.point.subtract(loc.normal.multiply(l * d)))
        }
        leftSidePath.reverse()

        leafPath = rightSidePath.join(leftSidePath)
        leafPath.smooth()
        leafPath = leafPath.intersect(fullInnerPath)
        if (!leafPath || leafPath.length == 0) continue
        new DrinkElement(leafPath, throughData => {
            const p = throughData.point
            const clr = lerpColor(color('#007f00'), color('#005200'),throughData.perc) 
            if (throughData.inLiquid) {
                const val = (noise(p.x / 70 + 400, p.y / 70 + 400) + .2) * (.5 - abs(throughData.perc - .5)) * 200
                clr.setAlpha(val * .1)
            }
            stroke(clr)
            line(p.x, -p.y, p.x, -p.y)
        })
    }
}

let drinkElements = []
class DrinkElement {
    constructor(path, func) {
        this.path = path
        this.func = func
        drinkElements.push(this)
        this.offsetPos = random(-1, 1)
    }

    async draw() {
        await pointilizePath(this.path, slicePath => {
            through(slicePath, this.offsetPot, throughData => {
                this.func(throughData)
            })
        })
    }
}

async function drawDrinkElements() {
    drinkElements.sort((a, b) => random(-1, 1))
    for (let i = 0; i < drinkElements.length; i++) {
        await drinkElements[i].draw()
    }
}

function drawInLiquid(clr) {
    return slicePath => {
        through(slicePath, throughData => {
            const p = throughData.point
            let val = (noise(p.x / 70 + 400, p.y / 70 + 400) + .2) * (.5 - abs(throughData.perc - .5)) * 200
            if (throughData.inLiquid) val *= .1
            clr.setAlpha(val)
            stroke(clr)
            line(p.x, -p.y, p.x, -p.y)
        })
    }
}