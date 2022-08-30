async function fruit() {
    if (findWordInString(drink.fruit, 'beach ball')) await beach_ball()
    if (findWordInString(drink.fruit, 'cherry') || findWordInString(drink.fruit, 'olive')) await cherries()
    if (findWordInString(drink.fruit, 'slice')) await fruit_slice()
    if (findWordInString(drink.fruit, 'shrimp')) await shrimp()
    if (findWordInString(drink.fruit, 'wedge')) await fruit_wedge()
}

async function cherries() {
    if (!drink.fruit) return
    let cherryOrOlive = random() > .5 ? 'cherry' : 'olive'
    if (drink.fruit.includes('cherry')) cherryOrOlive = 'cherry'
    if (drink.fruit.includes('olive')) cherryOrOlive = 'olive'

    cherryPos = P(0, 0)
    if (drink.fruit.includes('floating')) {
        const liquidCorner = liquidPath.segments[liquidPath.segments.length - 2].point
        cherryPos = P((liquidCorner.x - 30 * PS) * random(-1, 1), liquidCorner.y)
        await drawCherry(cherryPos, cherryOrOlive, { stem: true })
    }
    if (drink.fruit.includes('sinking')) {
        const liquidCorner = innerPath.segments[1].point
        cherryPos = P((liquidCorner.x - 30 * PS) * random(-1, 1), liquidCorner.y + random(30, 50) * PS)
        await drawCherry(cherryPos, cherryOrOlive, { stem: true })
    }
    if (drink.fruit.includes('skewed') && drink.stick) {
        const numCherries = random(1, 3)
        for (let i = 0; i < numCherries; i++) {
            await drawCherry(stickSpine.getPointAt(stickSpine.length * random(.1, .7)), cherryOrOlive)
        }
    }
    if (drink.fruit.includes('rim')) {
        const cherryPos = getPointOnRevolved(path, path.length, random(360))
        await drawCherry(cherryPos, cherryOrOlive, { stem: true })
    }
}

async function drawCherry(pos, cherryOrOlive, data = {}) {
    let pathToDraw
    let lightVals = [0, 0]
    if (cherryOrOlive == 'cherry') {
        pathToDraw = new Path.Circle({ center: pos, radius: 20 }).wonky(.85, 1.15)
        lightVals = [.1, .5]
    } else {
        pathToDraw = new Path.Circle({ center: pos, radius: 20 }).wonky(.9, 1.1)
        pathToDraw.scale(1, 1.5)
        pathToDraw = pathToDraw.rotate(random(90))
        lightVals = [.2, .3]
    }

    let cherryColor = cherryOrOlive == 'cherry' ? color(200, 40, 60) : color(10, 100, 40)
    // cherries choose([color(40, 14, 20),color(200, 40, 60)])

    await pointilizePath(pathToDraw, (slicePath, sliceData) => {
        through(slicePath, 0, throughData => {
            const p = throughData.point
            let val = (noise(p.x / 70 * PS + 400, p.y / 70 * PS + 400) + .2) * (sin(180 * throughData.perc) + .3) * 150
            if (!data.bg && throughData.inLiquid) val *= noise(p.x / 50 * PS + 800, p.y / 50 * PS + 800) * .1
            cherryColor.setAlpha(val)
            stroke(cherryColor)
            line(p.x, -p.y, p.x, -p.y)

            const lightCenter = P(pathToDraw.bounds.left + pathToDraw.bounds.width * .7, pathToDraw.bounds.top + pathToDraw.bounds.height * .7)
            const dirToCenter = p.subtract(lightCenter)
            const strength = 1 - dirToCenter.length / (pathToDraw.bounds.width * random() * random(lightVals[0], lightVals[1]))
            stroke(255, strength * 60)
            line(p.x, -p.y, p.x, -p.y)
        })
    })

    if (cherryOrOlive == 'olive') {
        pathToDraw = new Path.Circle({ center: pos.add(pointFromAngle(random(360), 10*PS)), radius: 8*PS }).wonky(.7, 1.3)
        const oliveRed = color(255, 0, 0)
        await pointilizePath(pathToDraw, (slicePath, sliceData) => {
            through(slicePath, 0, throughData => {
                const p = throughData.point
                let val = (noise(p.x / 70*PS + 400, p.y / 70*PS + 400) + .2) * (sin(180 * throughData.perc) + .3) * 150
                if (!data.bg && throughData.inLiquid) val *= noise(p.x / 50*PS + 800, p.y / 50*PS + 800) * .1
                oliveRed.setAlpha(val)
                stroke(oliveRed)
                line(p.x, -p.y, p.x, -p.y)
            })
        })
    }

    if (cherryOrOlive == 'cherry' && data.stem) {
        // const stemStart = P(pathToDraw.bounds.left + pathToDraw.bounds.width * .3, pathToDraw.bounds.top + pathToDraw.bounds.height * .7)
        const stemStart = pathToDraw.position.add(pointFromAngle(random(30, 150*PS), PS*pathToDraw.bounds.height / 4))
        const stemDir = pointFromAngle(random(30, 150), random(20)*PS)
        const stemEnd = stemStart.add(pointFromAngle(random(30, 150), random(30, 70)*PS))
        const stem = new Path(new Segment(stemStart, null, stemDir), stemEnd)
        const stemColor = lerpColor(cherryColor, color(0), .5)
        stemColor.setAlpha(100)
        stroke(stemColor)
        for (let i = 0; i < stem.length; i++) {
            const p = stem.getPointAt(i)
            strokeWeight(map(i, 0, stem.length, 1.5, 3)*PS)
            line(p.x, -p.y, p.x, -p.y)
            await timeout()
        }
    }
}


async function fruit_slice() {
    const lemonPos = path.lastSegment.point.clone()

    let lemonOuter = new Path.Circle({ center: P(0, 0), radius: 70*PS }).wonky(.9, 1.1)
    let lemonInner = lemonOuter.offset(-5*PS)
    let lemonSliceOuter = lemonInner.offset(-5*PS)

    if (random() < 1) {
        const lemonTrimstart = 135
        const lemonTrimend = -90
        const lemonTrim = new Path([P(0, 0)])
        for (let a = lemonTrimstart; a < lemonTrimend; a += 5) {
            lemonTrim.add(pointFromAngle(a, 120*PS))
        }
        lemonTrim.closePath()
        lemonOuter = lemonOuter.subtract(lemonTrim)
        lemonInner = lemonInner.subtract(lemonTrim)
        lemonSliceOuter = lemonSliceOuter.subtract(lemonTrim)
    }

    const lemonSlices = []
    for (let i = 0; i < 6; i++) {
        const newSlice = new Path([
            pointFromAngle(-20 + i * 60, 100*PS),
            pointFromAngle(-20 + i * 60, 10*PS),
            pointFromAngle(20 + i * 60, 10*PS),
            pointFromAngle(20 + i * 60, 100*PS)
        ]).intersect(lemonSliceOuter)
        // newSlice.wonky(.9, 1.1)
        newSlice.smooth()
        lemonSlices.push(newSlice)
    }
    lemonOuter.translate(lemonPos.x, lemonPos.y)
    lemonInner.translate(lemonPos.x, lemonPos.y)
    lemonSlices.forEach(lemonSlice => lemonSlice.translate(lemonPos.x, lemonPos.y))

    const fruitColors = getFruitColors()

    const clr1 = fruitColors.peel
    await pointilizeDraw(lemonOuter, (throughData, val, valLiquid) => {
        return color(red(clr1), green(clr1), blue(clr1), valLiquid * 150)
    })
    const clr2 = fruitColors.flesh
    await pointilizeDraw(lemonOuter, (throughData, val, valLiquid) => {
        return color(red(clr2), green(clr2), blue(clr2), valLiquid * 150)
    })
    for (let i = 0; i < lemonSlices.length; i++) {
        const clr3 = fruitColors.food
        await pointilizeDraw(lemonSlices[i], (throughData, val, valLiquid) => {
            const offset = throughData.point.subtract(lemonPos)
            const clr = lerpColor(clr3, color(0), noise(offset.angle / 5, offset.length / 30) > .8 ? 0.2 : 0)
            return color(red(clr), green(clr), blue(clr), valLiquid * 150)
        })
    }
}

async function fruit_wedge() {
    let fullSlicePath = new Path([
        P(0, 0),
        P(random(75, 100), 0),
        new Segment(P(0, 100), P(random(40, 100), 0), P(random(-100, -50), 0)),
        P(random(-100, -75), 0),
        P(0, 0)])
    let sliceInner = fullSlicePath.clone()
    sliceInner.segments[1].point.x -= random(10, 20)
    sliceInner.segments[2].point.y -= random(10)
    fullSlicePath.divideAt(fullSlicePath.getNearestLocation(sliceInner.segments[1].point).offset)
    fullSlicePath.segments[2].point.y += random(5, 15)

    const sliceCenter = sliceInner.segments[1].point.add(sliceInner.segments[3].point).divide(2).multiply(1, 0)
    let sliceSlices = []
    for (let a = 0; a <= 180; a += random(30, 35)) {
        const offset = random(70, 100)
        const sliceSlice = new Path([
            new Segment(P(5, 0), null, P(random(10, 25), 5)),
            new Segment(P(offset, 0), P(0, 25), P(0, -25)),
            new Segment(P(0, 0), P(random(10, 25), -5))])

        sliceSlice.rotate(a, sliceCenter)
        sliceSlices.push(sliceSlice.intersect(sliceInner))
    }

    let sliceGroup = [fullSlicePath, sliceInner, ...sliceSlices]
    let pos = P(0, 0)

    let placing = choose(['rim', 'floating', 'sinking'])
    if (findWordInString(drink.fruit, 'rim')) placing = 'rim'
    if (findWordInString(drink.fruit, 'floawing')) placing = 'floating'
    if (findWordInString(drink.fruit, 'sinking')) placing = 'sinking'
    if (placing == 'rim')
        pos = getPointOnRevolved(path, path.length, random(360))
    if (placing == 'floating') {
        const liquidCorner = liquidPath.segments[liquidPath.segments.length - 2].point
        pos = P((liquidCorner.x - 30) * random(-1, 1), liquidCorner.y)
    } else if (placing == 'sinking')
        pos = P(liquidPath.bounds.right * random(-1, 1), liquidPath.bounds.top + random(liquidPath.bounds.height))
    sliceGroup.forEach(sp => sp.position = sp.position.add(pos).add(0,-50))
    const rotation = random(360)
    sliceGroup.forEach(sp => sp = sp.rotate(rotation, pos))

    if (['floating', 'sinking'].includes(placing)) {
        fullSlicePath = fullSlicePath.intersect(fullInnerPath)
        sliceInner = sliceInner.intersect(fullInnerPath)
        sliceSlices = sliceSlices.map(sp => sp.intersect(fullInnerPath))
    }

    const fruitColors = getFruitColors()

    const clr = fruitColors.peel
    await pointilizeDraw(fullSlicePath, (throughData, val, valLiquid) => {
        return color(red(clr), green(clr), blue(clr), valLiquid * 150)
    })
    const clr2 = fruitColors.flesh
    await pointilizeDraw(sliceInner, (throughData, val, valLiquid) => {
        return color(red(clr2), green(clr2), blue(clr2), valLiquid * 150)
    })
    const clr3 = fruitColors.food
    for (const sliceSlice of sliceSlices) {
        await pointilizeDraw(sliceSlice, (throughData, val, valLiquid) => {
            return color(red(clr3), green(clr3), blue(clr3), valLiquid * 150)
        })
    }
}

function getFruitColors() {
    return {
        'peel': findWordInString(drink.fruit, 'orange') ? color('orange') : color('green'),
        'flesh': color('#FAEED1'),
        'food': findWordInString(drink.fruit, 'orange') ? color('orange') : color('#B7BB69'),
    }
}

async function beach_ball() {
    const liquidCorner = liquidPath.segments[liquidPath.segments.length - 2].point
    const pos = P((liquidCorner.x - 30) * random(-1, 1), liquidCorner.y)
    const r = 50*PS
    const ballPath = new Path.Circle(pos, r*PS).intersect(fullInnerPath)
    const beachBallColors = [color('red'), color('yellow'), color('blue'), color('white')]
    beachBallColors.sort((a, b) => random() - 0.5)

    const rotation = random(90)
    await pointilizeDraw(ballPath, (throughData, val, valLiquid, sliceData) => {
        const offsetedPoint = throughData.point.rotate(rotation, ballPath.position)
        const offsetedfromCenter = pos.subtract(offsetedPoint)
        const placeCircleWidth = sqrt(r ** 2 - offsetedfromCenter.y ** 2)
        const perc = (offsetedfromCenter.x / placeCircleWidth) / 2


        let clr = beachBallColors[round(abs(perc) * 4) % 4] ?? color('white')
        const dirToCenter = pos.subtract(throughData.point)
        clr = lerpColor(clr, color('black'), (dirToCenter.length / 25) * (dirToCenter.angle / 360))

        clr.setAlpha(valLiquid * 150)
        return clr
    })
}

async function shrimp() {
    const shrimpAngle = 0
    const shrimpPath = new Path([
        new Segment(getPointOnRevolved(path, path.length - 30, shrimpAngle).add(-30, 0), null, P(0, -20)),
        new Segment(getPointOnRevolved(path, path.length - 0, shrimpAngle).add(0, 10), P(-30, 0), P(30, 0)),
        new Segment(getPointOnRevolved(path, path.length - 70, shrimpAngle).add(50, 0), P(0, -50))
    ])
    for (let i = 0; i < shrimpPath.length; i += .1) {
        const loc = shrimpPath.getLocationAt(i)
        let r = map(i, 0, shrimpPath.length * .8, 25, 15)
        if (i > shrimpPath.length * .8) r = map(i, shrimpPath.length * .8, shrimpPath.length, 18, 0)
        r *= 1 + sin((i % 35) / 35 * 180) / 2
        const crcl = new Path.Circle(loc.point, r).blocky().scale(1, .8).rotate(loc.tangent.angle)
        through(crcl, 0, throughData => {
            const p = throughData.point
            let clr = lerpColor(color('#fab5aa'), color('#fce0dc'), noise(i / 10, throughData.perc * 5))
            clr = lerpColor(clr, color('red'), .5 * (round(i * 10) / 10) / shrimpPath.length)
            stroke(clr)
            line(p.x, -p.y, p.x, -p.y)
        })
        await timeout()
    }

    const tailPath = new Path([
        new Segment(shrimpPath.lastSegment.point, null, shrimpPath.lastSegment.location.tangent.multiply(-30)),
        shrimpPath.lastSegment.point.add(shrimpPath.lastSegment.location.tangent.multiply(-40).rotate(random(-20, 20)))
    ])
    for (let i = 0; i < tailPath.length; i += .1) {
        const loc = tailPath.getLocationAt(i)
        let r = map(i, 0, tailPath.length, 8, 3)
        const crcl = new Path.Circle(loc.point, r).blocky().scale(1, .8).rotate(loc.tangent.angle)
        through(crcl, 0, throughData => {
            const p = throughData.point
            const clr = lerpColor(color('red'), color('#fce0dc'), noise(i / 10, throughData.perc * 5))
            stroke(clr)
            line(p.x, -p.y, p.x, -p.y)
        })
        await timeout()
    }
}