
async function drawLiquid() {
    colorMode(HSB)
    const liquidLayers = [
        { perc: 0, color: color(drink.liquid[0]) },
        { perc: 1, color: color(drink.liquid[1]) },
        { perc: 1.5, color: color(choose(bgColors.top)) },
    ]
    liquidLayers[2].color = color(255)
    colorMode(RGB)

    const mixNoiseScale = random(30, 100)
    const mixNoiseStrength = random(.5)
    await revolve(liquidPath, async (ellipsePath, pathIndex) => {
        let heightPerc = (liquidPath.getPointAt(pathIndex).y - liquidPath.bounds.top) / (liquidPath.bounds.height)

        for (let i = 0; i < ellipsePath.length; i++) {
            const loc = ellipsePath.getLocationAt(i)
            const p = loc.point

            const currHeight = heightPerc + (noise(p.x / mixNoiseScale - 100, p.y / mixNoiseScale - 100, heightPerc * 9)) * mixNoiseStrength
            let clr1 = liquidLayers[0].color
            let clr2 = liquidLayers[1].color
            let mixPerc = 0
            for (let i = 1; i < liquidLayers.length; i++) {
                if (currHeight > liquidLayers[i].perc) continue
                if (i == liquidLayers.length - 1 || currHeight < liquidLayers[i].perc) {
                    clr1 = liquidLayers[i - 1].color
                    clr2 = liquidLayers[i].color
                    mixPerc = (currHeight - liquidLayers[i - 1].perc) / (liquidLayers[i].perc - liquidLayers[i - 1].perc)
                    break;
                }
            }

            const n = noise(heightPerc * 3, i / 200)
            strokeWeight(4)
            let clr = lerpColor(clr1, clr2, mixPerc * 0.7 + n * 0.3)
            const i2 = i % round(ellipsePath.length / 2)
            const distFromEdges = abs(i2 - ellipsePath.length / 4) / (ellipsePath.length / 4)
            clr = lerpColor(clr, color(0), distFromEdges * (1 - heightPerc))
            clr.setAlpha((1 - heightPerc) * 25 + 25)
            stroke(clr)
            drawDot(p)
        }
        await timeout()
    })

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
            liquidPath.bounds.bottom + random(-5,5))
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
    for (let t = 0; t < drink.bubbles / 10; t++) {
        for (let i = 0; i < 10; i++) {
            const bubblePos = P(
                random(-liquidPath.bounds.right, liquidPath.bounds.right),
                liquidPath.bounds.top + random(liquidPath.bounds.height) * (t / 10))
            const bubblePath = new Path.Circle(bubblePos, random(1, 4)).wonky().intersect(fullInnerPath)
            new DrinkElement(bubblePath, color('white'), 1)
        }
    }
}

function ice() {
    for (let t = 0; t < drink.ice; t++) {
        const icePos = P(random(-liquidPath.bounds.right, liquidPath.bounds.right), random(liquidPath.bounds.top, liquidPath.bounds.bottom))
        const icePath = new Path.Circle(icePos, random(30, 80)).deform().intersect(fullInnerPath)
        if (!icePath || icePath.length == 0) continue
        new DrinkElement(icePath, color('white'), random(2, 3))
    }
}


function leaves() {
    for (let t = 0; t < 4; t++) {
        const leafPos = P(random(-liquidPath.bounds.right, liquidPath.bounds.right), random(liquidPath.bounds.top, liquidPath.bounds.bottom))
        const leafDirection = pointFromAngle(random(360)).multiply(random(30, 100))

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
            const l = ((counter++) % 2 == 0 ? 40 : 38)
            rightSidePath.add(loc.point.add(loc.normal.multiply(l * d)))
            leftSidePath.add(loc.point.subtract(loc.normal.multiply(l * d)))
        }
        leftSidePath.reverse()

        leafPath = rightSidePath.join(leftSidePath)
        leafPath.smooth()
        leafPath = leafPath.intersect(fullInnerPath)
        if (!leafPath || leafPath.length == 0) continue
        new DrinkElement(leafPath, color('green'), 2)
    }
}

let drinkElements = []
class DrinkElement {
    constructor(path, color, intensity) {
        this.path = path
        this.color = color
        this.intensity = intensity
        drinkElements.push(this)
    }

    async draw() {
        await pointilizePath(this.path, this.intensity, this.color)
    }
}

async function drawDrinkElements() {
    drinkElements.sort((a, b) => random(-1, 1))
    for (let i = 0; i < drinkElements.length; i++) {
        await drinkElements[i].draw()
    }
}