const gradients = [
    ['#F75050', '#EECB4F', '#EECB4F', '#FE3D6C'],
    ['#8886FF', '#31C7F7', '#FBF3AC', '#B9FF83'],
    ['#E0D4BD', '#D93B57', '#D9443B', '#E0D4BD'],
    ['#A89C85', '#E8C992', '#F4C46A', '#FFEB83'],
    ['#85F2E5', '#5FCFF2', '#F25089', '#F2CD11'],
    ['#F170F4', '#DA411E', '#CAECE7', '#5CA8BF'],
    ['#ACC3CA', '#EADFE8', '#DDBDBF', '#BCA9B3'],
    ['#FBB198', '#FF4916', '#DC5966', '#815D7D'],
    ['#EEE2C9', '#FFDE69', '#F1E1B9', '#DECDA1'],
    ['#CC14A4', '#F54135', '#F380F7', '#5FCFF2'],
    ['#4FD6C5', '#ACFBBE', '#ACFBF0', '#1BB4E4'],
    ['#B71C49', '#942B6A', '#630066', '#F7314D'],
    ['#FF5B73', '#EA431E', '#A50444', '#083948'],
    ['#271805', '#48250B', '#291C07', '#611207'],
    ['#12240A', '#153605', '#122907', '#4D6B3E'],
    ['#0A1F24', '#052A36', '#071D29', '#074061'],
    ['#DB607D', '#B01974', '#B01974', '#1DBBC5', '#55FADB'],
    ['#9AB5A1', '#EFEFEF', '#E8DEE0', '#7DCBA6', '#617FA4'],
    ['#EE511D', '#B43D37', '#3D526C', '#617FA4', '#3D526C'],
    ['#FFDCFB', '#FFA4A9', '#EA3F49', '#EA746D', '#FF7B51'],
    ['#192526', '#273232', '#000000', '#253838'],
    ['#141126', '#121422', '#000000', '#292929'],
    ['#292929', '#323232', '#000000', '#000000', '#363636'],
    ['#FF7070', '#F7314D', '#FBF3AC', '#ACFBF0', '#65E3EC', '#83FFD2'],
    ['#8EDB5F', '#D2DC5E', '#E3DE5C', '#B8E35C', '#5DF7E5', '#CCFFF8', '#EBFFFD'],
    ['#D15FDB', '#AC5EDC', '#716EEA', '#A85CE3', '#F75D94', '#FFCCF4', '#FFEBFE'],
]


async function makeBG() {
    resetRandom()
    getBG_Gradient()
    noStroke()
    rect(0, 0, canvas.width, canvas.height);

    bgType = random() < 0.3 ? false : choose(['clouds', 'checkerboard', 'jelly', 'umbrellas', 'monstera', 'glasses'])
    const withMirror = bgType == false ? random() < 0.9 : random() < .5

    if (bgType == 'monstera') await bgElements(PS * 75, async pos => await monstera(pos))
    if (bgType == 'clouds') await bgElements(PS * 120, async pos => await cloud(pos.x, -pos.y, random(50, 100 * PS)))
    if (bgType == 'jelly') {
        let jellyBeans = random() < 0.5
        if (drink.name && !findWordInString('cherry', drink.name)) jellyBeans = true
        await bgElements(PS * 80, async pos => await drawCherry(pos, 'cherry', { bg: true, stem: !jellyBeans, jelly: jellyBeans }))
    }
    if (bgType == 'umbrellas') {
        const umbrellaColors = [color(choose(bgColors.bottom)), choose([color(choose(bgColors.top)), color(255)])]
        await bgElements(PS * 100, async pos => await drawUmbrella(pos, PS * random(-30, 30), PS * random(20, 60), umbrellaColors))
    }
    if (bgType == 'glasses') {
        await bgElements(PS * 100, async pos => await drawSmallGlass(pos))
    }
    if (withMirror) await mirror()
    if (bgType == 'checkerboard') checkerboard()
    if (bgType == 'lightning') await lightning()
    addDrinkName()
}

function addDrinkName() {
    if (drink.name) {
        let textPos = PS * 10
        textAlign(CENTER, TOP)
        textFont(myFont)

        const topGradColor = bgColors.top[bgColors.top.length - 1]
        const offset = brightness(topGradColor) > 127 ? -70 : 70
        let textColor = color(red(drink.liquid[0]) + offset, green(drink.liquid[0]) + offset, blue(drink.liquid[0]) + offset)
        textColor = neighborColor(textColor, random(-20, 20), random(-10, 10), random(-10, 10))
        textColor.setAlpha(150)
        fill(textColor)
        if (drink.ingredients.length > 1) {
            const txt = drink.ingredients.join(' · ')
            textSize(PS * 2)
            while (textWidth(txt) < width * .90) {
                textSize(textSize() + PS * .5)
            }
            text(txt, width * .5, textPos)
            textPos += textSize() * .85
        }
        textColor.setAlpha(255)
        fill(textColor)
        for (word of drink.name) {
            noStroke()
            // textLeading(0);
            textSize(PS * 15)
            while (textWidth(word) < width * .92) {
                textSize(textSize() + PS * .5)
            }
            text(word, width * .5, textPos)
            textPos += textSize() * .85
        }
        // blendMode(BLEND)
    }
}


function getBG_Gradient(remix = false) {
    if (remix) {
        if (random() < 0.3) {
            const temp = [...bgColors.top]
            bgColors.top = [...bgColors.bottom]
            bgColors.bottom = [...temp]
        }
        bgColors.bottom.sort((a, b) => random() > .5 ? -1 : 1)
        bgColors.top.sort((a, b) => random() > .5 ? -1 : 1)
    } else {
        const grad = choose(gradients)
        if (random() < 0.3) grad.sort((a, b) => random() > .5 ? -1 : 1)
        bgColors = {
            bottom: grad.slice(0, floor(grad.length / 2)),
            top: grad.slice(floor(grad.length / 2))
            // bottom: [...choose(gradients)].sort((a, b) => random() > .5 ? -1 : 1).slice(0, 3),
            // top: [...choose(gradients)].sort((a, b) => random() > .5 ? -1 : 1).slice(0, 3)
        }
    }
    const gradHorOff = random() < .2 ? width * random(.5, .8) : width * .5
    const gradient = drawingContext.createLinearGradient(gradHorOff, height, width - gradHorOff, 0)
    const horizonPos = .4
    const horizonThickness = .3
    for (let i = 0; i < bgColors.bottom.length; i++) {
        gradient.addColorStop(horizonPos * i / (bgColors.bottom.length - 1), bgColors.bottom[i]);
    }
    for (let i = 0; i < bgColors.top.length; i++) {
        gradient.addColorStop(horizonPos + horizonThickness + (1 - horizonPos - horizonThickness) * i / (bgColors.top.length - 1), bgColors.top[i]);
    }
    drawingContext.fillStyle = gradient;
}

async function glassShadow() {
    resetRandom()
    let color1 = color(bgColors.bottom[0])
    let color2 = color(bgColors.bottom[1])

    const brghtnessOffset = brightness(bgColors.bottom[0]) < 50 ? 50 : -50;

    colorMode(HSB)
    color1 = color(hue(color1), max(saturation(color1), 50), brightness(color1) + brghtnessOffset)
    color2 = color(hue(color2), max(saturation(color2), 50), brightness(color2) + brghtnessOffset)
    colorMode(RGB)

    strokeWeight(1)
    await revolve(path, async (ellipse, pathIndex) => {
        const perc = pathIndex / (path.length - 1)
        const h = path.getPointAt(pathIndex).y
        ellipse.position.y *= -1 * PS
        if (ellipse.position.y < -10 * PS) ellipse.position.y = min(ellipse.position.y + PS * 30, -10 * PS)
        const alfa = map(h, 0, height / 2 - 200 * PS, 1, 0)
        for (let i = 0; i < ellipse.length; i += 1) {
            const loc = ellipse.getLocationAt(i)
            const p = loc.point
            const clr = lerpColor(color1, color2, perc)
            // clr.setAlpha(10 * random(1 - perc * perc))
            clr.setAlpha(10 * random(alfa))
            stroke(clr)
            const ll = 0//2 * perc
            drawDot(p, P(-random(ll), -random(ll)), P(random(ll), random(ll)))
        }
        await timeout()
    }, (p) => P(0, -p.y))

    await revolve(path, async (ellipse, pathIndex) => {
        const perc = pathIndex / (path.length - 1)
        ellipse.position.y *= -1 * PS
        if (ellipse.position.y < -10 * PS) ellipse.position.y = min(ellipse.position.y + 30 * PS, -10 * PS)

        for (let i = 0; i < ellipse.length; i += 1) {
            const loc = ellipse.getLocationAt(i)
            const p = loc.point
            const clr = lerpColor(color1, color2, perc)
            clr.setAlpha(4 * (1 - perc))
            stroke(clr)
            const ll = 2 * PS * perc
            drawDot(p, P(-random(ll * 5 * PS), -random(ll)), P(random(ll * 5 * PS), random(ll)))
        }
        await timeout()
    }, (p) => P(p.y / 3, 0))

    await revolve(liquidPath, async (ellipse, pathIndex) => {
        const perc = pathIndex / (path.length - 1)
        ellipse.scale(.5 * (1 - perc), .5 * (1 - perc))
        ellipse.position.y *= -1
        if (ellipse.position.y < -10) ellipse.position.y = min(ellipse.position.y + 30, -10)

        for (let i = 0; i < ellipse.length; i += 1) {
            const loc = ellipse.getLocationAt(i)
            const p = loc.point
            const clr = lerpColor(drink.liquid[0], drink.liquid[1], perc)
            clr.setAlpha(2 * (1 - perc) * random())
            stroke(clr)
            const ll = 2 * perc
            drawDot(p, P(-random(ll * 5), -random(ll)), P(random(ll * 5), random(ll)))
        }
        await timeout()
    }, (p) => P(p.y / 2.2, 0))

}


function checkerboard() {
    let yStep = 5 * PS
    const xStep = 150 * PS
    let rowCounter = 0
    for (let y = height * .65; y < height; y += yStep) {
        yStep += 2 * PS
        const pers = map(y, height * .65, height, .2, 3)
        const nextPers = map(y + yStep, height * .65, height, .2, 3)
        let colCounter = rowCounter % 2
        for (let x = -width * 2; x < width * 3; x += xStep) {
            colCounter++
            const c = colCounter % 2 == 0 ? color(bgColors.bottom[0]) : color(bgColors.top[0])
            c.setAlpha(rowCounter * 10)
            fill(c)
            const p1 = P((x - width / 2) * pers + width / 2, y)
            const p2 = P((x + xStep - width / 2) * pers + width / 2, y)
            const p3 = P((x + xStep - width / 2) * nextPers + width / 2, y + yStep)
            const p4 = P((x - width / 2) * nextPers + width / 2, y + yStep)
            beginShape()
            vertex(p1.x, p1.y)
            vertex(p2.x, p2.y)
            vertex(p3.x, p3.y)
            vertex(p4.x, p4.y)
            endShape(CLOSE)
        }
        rowCounter++
    }
}

async function cloud(cloudx, cloudy, cloudSize) {
    noiseDetail(6, 0.65);

    cloudNoiseScale = random(30, 100)
    cloudNoiseStartVal = noise(500, 1000);

    const cloudAngle = random(160, 200)
    for (let t = 0; t < cloudSize * 30; t++) {
        resetMatrix()
        translate(cloudx, cloudy)
        const posAngle = random(360)
        const posR = random(cloudSize)
        const posX = cos(posAngle) * posR
        let posY = sin(posAngle) * posR / 2
        if (posY > 0) posY *= .5
        const cloudNoiseVal = noise(500 + posX / cloudNoiseScale, 600 + posY / cloudNoiseScale)
        const cloudThresh = 1 - posR / cloudSize;
        if (abs(cloudNoiseVal - cloudNoiseStartVal) > cloudThresh) continue
        translate(posX, posY)

        const angleVal = 1 - abs((posAngle + cloudAngle) % 360) / 180
        const RVal = posR / cloudSize

        const noiseStartX = random(2000, 10000)
        const noiseStartY = random(2000, 10000)
        startVal = noise(noiseStartX, noiseStartY);
        strokeWeight(2)

        const maxR = random(cloudSize) / 10;
        for (let r = 1; r < maxR; r++) {
            const circum = r * 2 * PI;
            for (let i = 0; i < circum; i++) {
                const a = (i * 360) / circum;
                const x = cos(a) * r;
                const y = sin(a) * r;
                const val = noise(noiseStartX + (x / 20) / maxR, noiseStartY + y / maxR);
                const thresh = 1 - r / maxR;
                if (abs(val - startVal) < thresh) {
                    // stroke(255, val*255*t/100*posAngle*posR);
                    stroke(255, (thresh + 0.1) * 150 * angleVal * RVal);
                    line(x, y, x, y);
                }
            }
        }
    }
    resetMatrix()
    await timeout()
}

function mirror() {
    getBG_Gradient(true)
    let mirrorRect = null
    const mirrorShape = choose(['center', 'panel'])

    if (mirrorShape == 'center') {
        const border = random(50, 150) * PS
        mirrorRect = new Path.Rectangle({ point: P(border, border), size: P(width - border * 2, height - border * 2) })
    } else {
        const h = height * random(.6, .9)
        mirrorRect = new Path.Rectangle({ point: P(100 * PS, (height - h) / 2), size: P(300 * PS, h) })
    }

    noStroke()

    rect(0, 0, width, mirrorRect.bounds.top)
    rect(0, mirrorRect.bounds.bottom, width, height)
    rect(0, 0, mirrorRect.bounds.left, height)
    rect(mirrorRect.bounds.right, 0, width, height)
}

async function bgElements(dist, func) {
    const elementPlaces = []
    for (let i = 0; i < 1000; i++) {
        let tries = 0
        while (tries < 100) {
            tries++
            const p = P(width * random(-0.1, 1.1), height * random(-1.1, 0.1))
            if (elementPlaces.length > 0)
                if (elementPlaces.map(a => a.getDistance(p)).sort((a, b) => a - b)[0] < dist) continue
            elementPlaces.push(p)
            break
        }
    }
    for (let i = 0; i < elementPlaces.length; i++) {
        await func(elementPlaces[i])
    }
}

async function monstera(pos) {
    let leafShape = new Path([
        P(0, 0), P(50, -50), P(100, 50), P(0, random(150, 200)), P(-100, 50), P(-50, -50)
    ])
    leafShape.closePath()
    leafShape.smooth()
    leafShape.segments[3].handleOut = leafShape.segments[3].handleOut.multiply(random(2))
    leafShape.segments[3].handleIn = leafShape.segments[3].handleIn.multiply(random(2))

    const spines = []
    for (let a = 0; a < 90; a += 20) spines.push(new Path([pointFromAngle(a, 0), pointFromAngle(a - 40, random(30)), pointFromAngle(a, 100)]))
    for (let a = 90; a < 180; a += 20) spines.push(new Path([pointFromAngle(a, 0), pointFromAngle(a + 40, random(30)), pointFromAngle(a, 100)]))

    const stemDir = random(-10, 10)
    const stemSpine = new Path([P(0, 0), pointFromAngle(-90 + stemDir / 2, random(30)), pointFromAngle(-90 + stemDir, 150)])
    spines.push(stemSpine)

    spines.forEach((spine, spineI) => {
        spine.translate(leafShape.position)
        const fstLoc = spine.firstSegment.location
        const midLoc = spine.getLocationAt(0.5 * spine.length)
        const endLoc = spine.lastSegment.location
        const newPath = new Path([
            fstLoc.point.add(fstLoc.tangent.multiply(2)),
            fstLoc.point.add(fstLoc.tangent.multiply(-2)),
            midLoc.point.add(midLoc.tangent.multiply(-3)),
            endLoc.point.add(endLoc.normal.multiply(6)),
            endLoc.point.add(endLoc.normal.multiply(-6)),
            midLoc.point.add(midLoc.tangent.multiply(-3)),
        ])
        newPath.closePath()
        newPath.smooth()
        if (spineI != spines.length - 1) leafShape = leafShape.subtract(newPath)
        else leafShape = leafShape.unite(newPath)
    })

    leafShape.translate(pos.x, -pos.y)
    leafShape.rotate(random(360))
    leafShape = leafShape.scale(random(.45, .55) * PS)
    const grad = drawingContext.createLinearGradient(leafShape.bounds.left, leafShape.bounds.top, leafShape.bounds.right, leafShape.bounds.bottom)
    const clr = color(choose(drinkColors.green))
    grad.addColorStop(0, clr.toString())
    const clr2 = color(red(clr) - 50, green(clr) - 50, blue(clr) - 50)
    grad.addColorStop(1, clr2.toString())
    drawingContext.fillStyle = grad
    // fillPath(leafShape, color(choose(drinkColors.green)))
    fillPath(leafShape)
    await timeout()

}

async function lightning() {
    for (let i = 0; i < 3; i++) await lightningBolt()
}

async function lightningBolt() {
    const startPos = P(width / 2, -height)
    const liquidCorner = liquidPath.segments[liquidPath.segments.length - 2].point
    const endPos = P(0, -liquidCorner.y)
    const lightningPath = new Path([startPos, endPos])

    for (let t = 0; t < 4; t++) {
        for (let segI = 0; segI < lightningPath.segments.length - 1; segI++) {
            const seg1 = lightningPath.segments[segI]
            const seg2 = lightningPath.segments[segI + 1]
            const d = seg1.point.getDistance(seg2.point)
            if (d < 10) continue
            const offset1 = seg1.location.offset
            const offset2 = seg2.location.offset
            for (let i = 0; i < 3; i++) {
                const newSeg = lightningPath.divideAt(random(offset1, offset2))
                const norm = newSeg.location.normal
                newSeg.point = newSeg.point.add(norm.multiply(d * random(-.2, .2)))
            }
        }
    }

    const side1Points = []
    const side2Points = []

    let n1 = 0, n2 = 58
    for (let i = 0; i < lightningPath.length; i += 5) {
        n1 += .01
        n2 += .01
        const v1 = noise(n1) ** 2 * map(i, 0, lightningPath.length, 20, 10)
        const v2 = noise(n2) ** 2 * map(i, 0, lightningPath.length, 20, 10)
        const loc = lightningPath.getLocationAt(i)
        side1Points.push(loc.point.add(loc.normal.multiply(v1)))
        side2Points.push(loc.point.subtract(loc.normal.multiply(v2)))
    }

    side2Points.reverse()
    noStroke()
    fill(red(drink.liquid[0]), green(drink.liquid[0]), blue(drink.liquid[0]))
    drawingContext.filter = 'blur(12px)'
    beginShape()
    side1Points.forEach(p => vertex(p.x, p.y))
    side2Points.forEach(p => vertex(p.x, p.y))
    endShape(CLOSE)

    fill(255, 200)
    drawingContext.filter = 'blur(2px)'
    beginShape()
    side1Points.forEach(p => vertex(p.x, p.y))
    side2Points.forEach(p => vertex(p.x, p.y))
    endShape(CLOSE)

    noFill()
    drawingContext.filter = 'none'
}

async function sideLeaf() {
    if (random() < 0.95 || bgType) return
    translate(width / 5, height / 10)
    const sideLeaves = []
    for (let i = 0; i < 2; i++) {
        const leafWidth = random(10, 20) * PS
        const leafDirection = pointFromAngle(random(60)).multiply(random(25, 50) * PS)
        const leafPath = makeLeafPath(P(0, 0), leafDirection, leafWidth)
        sideLeaves.push(leafPath)
    }
    strokeWeight(1)
    for (let i = 0; i < sideLeaves.length; i++) {
        await pointilizeDraw(sideLeaves[i], (throughData, val, valLiquid, sliceData) => {
            stroke(0, abs(.5 - throughData.perc) * 10)
            const p = throughData.point
            line(p.x, p.y, p.x, p.y)
            return false
        })
    }
    for (let i = 0; i < sideLeaves.length; i++) {
        await pointilizeDraw(sideLeaves[i], (throughData, val, valLiquid, sliceData) => {
            stroke(0, abs(.5 - throughData.perc) * 10)
            const p = throughData.point
            line(p.y, p.x / 5, p.y, p.x / 5)
            return false
        })
    }
    for (let i = 0; i < sideLeaves.length; i++) {
        const green1 = getColorFromHueName('green')
        const green2 = getColorFromHueName('green')
        await pointilizeDraw(sideLeaves[i], (throughData, val, valLiquid, sliceData) => {
            let clr = lerpColor(green1, green2, abs(0.5 - throughData.perc) * 2)
            clr = lerpColor(clr, color(0), noise(throughData.point.x / 10, throughData.perc * 5) * .5)
            return clr
        })
    }
}