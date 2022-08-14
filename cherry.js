async function drawToothPick() {
    let startOffset = 0
    for (let i = 0; i < innerPath.length; i += 1) {
        if (abs(innerPath.getPointAt(i).y - toothpickData.startY) < 2) {
            startOffset = i;
            break
        }
    }
    const start = getPointOnRevolved(innerPath, startOffset, toothpickData.startDir)
    const end = getPointOnRevolved(path, path.length, toothpickData.endDir).add(0, 15)
    toothpickPath = new Path.Line(start, end)
    const extra = end.subtract(start).normalize(toothpickData.overboard)
    toothpickPath.add(end.add(extra))

    const liquidTop = liquidPath.bounds.bottom
    for (let i = 0; i < toothpickPath.length; i++) {
        const p = toothpickPath.getPointAt(i)

        stroke(0)
        strokeWeight(3)
        let val = 0
        if (p.y > liquidTop - 60 && p.y < liquidTop) val = map(p.y, liquidTop - 60, liquidTop, 5, 50)
        if (p.y > liquidTop) val = 255

        const normalDir = toothpickPath.getNormalAt(i)
        for (let j = 0; j < 10; j++) {
            const p2 = normalDir.multiply(-j).add(p)
            stroke((i + j) % 30 < 15 ? 0 : 255, val)
            line(p2.x, -p2.y, p2.x, -p2.y)
        }

        await timeout()
    }
}

async function makeCherry() {
    let cherryOrOlive = random() > .5 ? 'cherry' : 'olive'
    if (drink.cherry.includes('cherry')) cherryOrOlive = 'cherry'
    if (drink.cherry.includes('olive')) cherryOrOlive = 'olive'

    if (drink.cherry.includes('floating')) {
        const liquidCorner = liquidPath.segments[liquidPath.segments.length - 2].point
        const cherryPos = P((liquidCorner.x - 30) * random(-1, 1), liquidCorner.y)
        await drawCherry(cherryPos, cherryOrOlive, { stem: true })
    }

    if (drink.cherry.includes('skewed') && drink.toothPick) {
        const numCherries = random(1, 3)
        for (let i = 0; i < numCherries; i++) {
            await drawCherry(toothpickPath.getPointAt(toothpickPath.length * random(.1, .7)), cherryOrOlive)
        }
    }
}

async function drawCherry(pos, cherryOrOlive, data = {}) {
    let pathToDraw
    let lightVals = [0, 0]
    if (cherryOrOlive == 'cherry') {
        pathToDraw = new Path.Circle({ center: pos, radius: 25 }).wonky(.9, 1.1)
        lightVals = [.1, .5]
    } else {
        pathToDraw = new Path.Circle({ center: pos, radius: 15 }).wonky(.9, 1.1)
        pathToDraw.scale(1, 1.5)
        pathToDraw = pathToDraw.rotate(random(90))
        lightVals = [.2, .3]
    }

    let cherryColor = cherryOrOlive == 'cherry' ? color(200, 40, 60) : color(10, 100, 40)
    if (!drink.cherry.includes('floating')) cherryColor = color(40, 14, 20)

    await pointilizePath(pathToDraw, 5, cherryColor, p => {
        const lightCenter = P(pathToDraw.bounds.left + pathToDraw.bounds.width * .7, pathToDraw.bounds.top + pathToDraw.bounds.height * .7)
        const dirToCenter = p.subtract(lightCenter)
        const strength = 1 - dirToCenter.length / (pathToDraw.bounds.width * random() * random(lightVals[0], lightVals[1]))
        stroke(255, strength * 60)
        line(p.x, -p.y, p.x, -p.y)
    })
    if (cherryOrOlive == 'olive') {
        pathToDraw = new Path.Circle({ center: pos.add(pointFromAngle(random(360), 10)), radius: 5 }).wonky(.7, 1.3)
        await pointilizePath(pathToDraw, 5, color(255, 0, 0))
    }

    if (cherryOrOlive == 'cherry' && data.stem) {
        const stemStart = P(pathToDraw.bounds.left + pathToDraw.bounds.width * .3, pathToDraw.bounds.top + pathToDraw.bounds.height * .7)
        const stemEnd = stemStart.add(random(-40, 40), 25)
        const stemEndDir = pointFromAngle(random(360), random(10, 30))
        const stem = new Path(stemStart, new Segment(stemEnd, stemEndDir))
        let nx = 0
        const stemColor = lerpColor(cherryColor, color(0), .5)
        stemColor.setAlpha(100)
        stroke(stemColor)
        for (let i = 0; i < stem.length; i++) {
            const p = stem.getPointAt(i)
            nx += 0.05
            strokeWeight(noise(nx) * 4 + 2)
            line(p.x, -p.y, p.x, -p.y)
            await timeout()
        }
    }
}


async function drawLemon() {
    const lemonPos = path.lastSegment.point.clone()

    let lemonOuter = new Path.Circle({ center: P(0, 0), radius: 70 })
    let lemonInner = new Path.Circle({ center: P(0, 0), radius: 65 })
    let lemonSliceOuter = new Path.Circle({ center: P(0, 0), radius: 60 })

    if (random() < 1) {
        const lemonTrimstart = 20 + random(45)
        const lemonTrimend = 20 + 180 - random(45)
        const lemonTrim = new Path([P(0, 0)])
        for (let a = lemonTrimstart; a < lemonTrimend; a += 5) {
            lemonTrim.add(pointFromAngle(a, 120))
        }
        lemonTrim.closePath()
        lemonOuter = lemonOuter.subtract(lemonTrim)
        lemonInner = lemonInner.subtract(lemonTrim)
        lemonSliceOuter = lemonSliceOuter.subtract(lemonTrim)
    }

    const lemonSlices = []
    for (let i = 0; i < 6; i++) {
        const newSlice = new Path([
            pointFromAngle(-20 + i * 60, 100),
            pointFromAngle(-20 + i * 60, 10),
            pointFromAngle(20 + i * 60, 10),
            pointFromAngle(20 + i * 60, 100)
        ]).intersect(lemonSliceOuter)
        // newSlice.wonky(.9, 1.1)
        newSlice.smooth()
        lemonSlices.push(newSlice)
    }
    push()
    translate(lemonPos.x, -lemonPos.y)
    fillPath(lemonOuter, '#E3E495')
    fillPath(lemonInner, '#FAEED1')
    lemonSlices.forEach(lemonSlice => fillPath(lemonSlice, '#B7BB69'))
    pop()
    // lemonOuter.position = lemonPos
    // await pointilizePath(lemonOuter, 5, color('#E3E495'))
}