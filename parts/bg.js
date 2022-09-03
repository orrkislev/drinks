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
    ['#192526', '#273232', '#000000', '#000000', '#253838'],
    ['#292929', '#323232', '#000000', '#000000', '#363636'],
    ['#FF7070', '#F7314D', '#FBF3AC', '#ACFBF0', '#65E3EC', '#83FFD2'],
    ['#8EDB5F', '#D2DC5E', '#E3DE5C', '#B8E35C', '#5DF7E5', '#CCFFF8', '#EBFFFD'],
    ['#D15FDB', '#AC5EDC', '#716EEA', '#A85CE3', '#F75D94', '#FFCCF4', '#FFEBFE'],
]


bottomOptions = [
    ['#ADA2FE', '#F3CBFD', '#FFDBFF', '#FC99DA'],
    ['#EA1E27', '#FE9069', '#F6AC79'],
    ['#03373F', '#046A55', '#03373F']
]
topOptions = [
    ['#FF6E62', '#FF8A61', '#FFAA31'],
    ['#C58DBE', '#B9C6F3', '#27C5F5'],
    ['#00D96B', '#095F56', '#36CBE1']
]



async function makeBG() {
    drawbg()

    const bgType = random() < 0.5 ? false : choose(['clouds', 'checkerboard', 'jelly', 'umbrellas', 'monstera'])
    const withMirror = random() < .8

    if (bgType == 'monstera') await bgElements(PS * 100, async pos => await monstera(pos))
    if (bgType == 'clouds') await clouds()
    if (bgType == 'jelly') await bgElements(PS * 100, async pos => await drawCherry(pos, 'cherry', { bg: true }))
    if (bgType == 'umbrellas') {
        const umbrellaColors = [color(choose(bgColors.bottom)), choose([color(choose(bgColors.top)), color(255)])]
        await bgElements(PS * 100, async pos => await drawUmbrella(pos, PS * random(-30, 30), PS * 35, umbrellaColors))
    }
    if (withMirror) await mirror()
    if (bgType == 'checkerboard') checkerboard()
    addDrinkName()
}

function addDrinkName() {
    if (drink.name) {
        let textPos = PS * 25
        // let textPos = height / 2
        // blendMode(DODGE)
        // const topColor = bgColors.top[bgColors.top.length-2]
        // colorMode(HSB)
        // const textColor = color(hue(drink.liquid[0]), saturation(drink.liquid[0]), (brightness(topColor)+50)%100)
        // colorMode(RGB)
        const textColor = color(red(drink.liquid[0]), green(drink.liquid[0]), blue(drink.liquid[0]))
        fill(textColor)
        for (word of drink.name) {
            noStroke()
            // textLeading(0);
            textFont(myFont)
            textSize(PS * 15)
            textAlign(CENTER, TOP)
            while (textWidth(word) < width * .92) {
                textSize(textSize() + PS * 1)
            }
            print(textSize())
            text(word, width * .5, textPos)
            textPos += textSize()
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
    const horizonThickness = random(.2, .5)
    for (let i = 0; i < bgColors.bottom.length; i++) {
        gradient.addColorStop(horizonPos * i / (bgColors.bottom.length - 1), bgColors.bottom[i]);
    }
    for (let i = 0; i < bgColors.top.length; i++) {
        gradient.addColorStop(horizonPos + horizonThickness + (1 - horizonPos - horizonThickness) * i / (bgColors.top.length - 1), bgColors.top[i]);
    }
    drawingContext.fillStyle = gradient;
}



function drawbg() {
    getBG_Gradient()

    noStroke()
    rect(0, 0, canvas.width, canvas.height);
}

async function glassShadow_curtain() {
    await revolve(path, async (ellipse, pathIndex) => {
        const perc = pathIndex / (path.length - 1)
        ellipse.position.y *= -1
        if (ellipse.position.y < -10) ellipse.position.y = min(ellipse.position.y + 30, -10)

        for (let i = 0; i < ellipse.length; i += 1) {
            const loc = ellipse.getLocationAt(i)
            const p = loc.point
            stroke(0)
            const ll = 2 * perc
            drawDot(p, P(-random(ll), -random(ll)), P(random(ll), random(ll)))
        }
        await timeout()
    }, (p) => P(-80, -30 + p.y))

    let color1 = color(bgColors.bottom[0])
    let color2 = color(bgColors.bottom[2])

    shaderGraphics.resizeCanvas(width, height)
    shaderGraphics.shader(bgShader)
    bgShader.setUniform('time', random(1000))
    bgShader.setUniform('color1', [red(color1) / 255, green(color1) / 255, blue(color1) / 255])
    bgShader.setUniform('color1', [red(color2) / 255, green(color2) / 255, blue(color2) / 255])
    bgShader.setUniform('resolution', [width, height])
    push()
    resetMatrix()
    bgShader.setUniform('tex0', get())
    shaderGraphics.rect(-width / 2, -height / 2, width, height)
    image(shaderGraphics, 0, 0)
    pop()
    return
}

async function glassShadow() {
    let color1 = color(bgColors.bottom[0])
    let color2 = color(bgColors.bottom[1])

    const brghtnessOffset = brightness(bgColors.bottom[0]) < 50 ? 50 : -50;

    colorMode(HSB)
    color1 = color(hue(color1), saturation(color1), brightness(color1) + brghtnessOffset)
    color2 = color(hue(color2), saturation(color2), brightness(color2) + brghtnessOffset)
    colorMode(RGB)

    await revolve(path, async (ellipse, pathIndex) => {
        const perc = pathIndex / (path.length - 1)
        ellipse.position.y *= -1 * PS
        if (ellipse.position.y < -10 * PS) ellipse.position.y = min(ellipse.position.y + PS * 30, -10 * PS)

        for (let i = 0; i < ellipse.length; i += 1) {
            const loc = ellipse.getLocationAt(i)
            const p = loc.point
            const clr = lerpColor(color1, color2, perc)
            clr.setAlpha(10 * random(1 - perc * perc))
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
    }, (p) => P(p.y / 2.5, 0))

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

async function clouds() {
    cloudPaths = []
    for (let i = 0; i < 100; i++) {
        let tries = 0
        let newPath = null
        while (tries < 100) {
            tries++
            const s = random(50, 100) * PS
            newPath = new Path.Ellipse({ point: P(random(width), random(height)), size: P(s * 2, s) })
            for (let j = 0; j < cloudPaths.length; j++) {
                const cp = cloudPaths[j]
                if (cp.intersects(newPath)) {
                    newPath.remove()
                    newPath = null
                }
            }
        }
        if (newPath) cloudPaths.push(newPath)
    }
    for (let i = 0; i < cloudPaths.length; i++) {
        const cp = cloudPaths[i]
        cloud(cp.position.x, cp.position.y, cp.bounds.width / 2)
        cp.remove()
        await timeout()
    }
}

function cloud(cloudx, cloudy, cloudSize) {
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
}

function mirror() {
    getBG_Gradient(true)
    let mirrorRect = null
    const mirrorShape = choose(['center', 'panel'])

    if (mirrorShape == 'center') {
        const border = random(50, 150) * PS
        mirrorRect = new Path.Rectangle({ point: P(border, border), size: P(width - border * 2, height - border * 2) })
    } else {
        mirrorRect = new Path.Rectangle({ point: P(100 * PS, 100 * PS), size: P(300 * PS, 500 * PS) })
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
            const p = P(random(width), random(-height))
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
    fillPath(leafShape, color(choose(drinkColors.green)))
    await timeout()

}