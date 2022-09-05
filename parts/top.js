async function liquidTop() {
    if (findWordInString(drink.top, 'foam')) await foam()
    // if (findWordInString(drink.top,'bubbles')) await drawFoamBubbles()
    if (findWordInString(drink.top, 'smoke')) await smoke()
}

async function foam() {
    resetRandom()
    const foamPath = innerPath.clone()
    foamPath.splitAt(min(foamPath.length * (liquidLevel + random(.1)), foamPath.length - 1))
    foamPath.add(P(0, foamPath.lastSegment.point.y + random(30)))
    await revolve(foamPath, async (ellipsePath, pathIndex) => {
        const posY = foamPath.getPointAt(pathIndex).y
        if (posY < liquidPath.bounds.bottom) return

        for (let i = 0; i < ellipsePath.length; i++) {
            for (let t = 0; t < 1; t++) {
                const pos = ellipsePath.getPointAt(i)
                strokeWeight(random(4) * PS)
                stroke(220 + noise(i / 30 * PS, posY / 80 * PS) * 35, random(50, 200))
                drawDot(pos)
            }
        }
        await timeout()
    })
}

async function drawFoamBubbles() {
    resetRandom()
    for (let t = 0; t < 70; t++) {
        const bubblePos = P(
            random(-liquidPath.bounds.right, liquidPath.bounds.right),
            liquidPath.bounds.bottom + random(-10, 15) * PS)
        const bubblePath = new Path.Circle(bubblePos, random(10, 30) * PS).wonky().intersect(fullInnerPath)
        new DrinkElement(bubblePath, throughData => {
            const p = throughData.point
            let val = (noise(p.x / 70 * PS + 400, p.y / 70 * PS + 400) + .2) * (p.getDistance(bubblePath.position) / 2) * 20
            if (throughData.inLiquid) val *= .1
            bubbleColor.setAlpha(val)
            stroke(bubbleColor)
            line(p.x, -p.y, p.x, -p.y)
        })
        const bubbleOffset = random(-1, 1)
        let clr = lerpColor(color(255), drink.liquid[1], random())
        await pointilizePath(bubblePath, slicePath => {
            clr = lerpColor(clr, color(255), .01)
            through(slicePath, bubbleOffset, throughData => {
                if (throughData.inLiquid) return
                const p = throughData.point
                let val = (noise(p.x / 70 * PS + 400, p.y / 70 * PS + 400) + .2) * (p.getDistance(bubblePath.position) / bubblePath.bounds.width) * 50
                clr.setAlpha(val)
                stroke(clr)
                line(p.x, -p.y, p.x, -p.y)
            })
        })
    }
}

async function rim(frontOrBack) {
    resetRandom()
    if (!drink.rim) return
    const rimPath = path.clone().splitAt(path.length - random(10, 20))
    await revolve(rimPath, async (ellipsePath, pathIndex) => {
        const sum = pathIndex
        for (let i = 0; i < sum; i++) {
            const offset = frontOrBack == 'front' ? random(0, 0.5) : random(0.5, 1)
            const p = ellipsePath.getPointAt(ellipsePath.length * offset)
            strokeWeight(2 * PS)
            stroke(0, 30)
            for (let j = 0; j < 3; j++) {
                drawDot(p.add(random(-3, 3) * PS, random(-3, 3) * PS))
            }
            stroke(255, 50)
            for (let j = 0; j < 5; j++) {
                drawDot(p.multiply(random(1, 1.01)).add(random(-3, 3) * PS, random(-3, 3) * PS))
            }
        }
        await timeout()
    })
}

async function smoke() {
    resetRandom()
    const liquidTop = liquidPath.segments[liquidPath.segments.length - 2].point
    for (let i = 0; i < 500; i++) {
        const p = P(liquidTop.x * random(-.6, .6), -liquidTop.y - random(100)*PS)
        let dir = P(0, -.5)
        const l = random(100, 1000) * PS
        for (let t = 0; t < l; t++) {
            const dirChange = noise(p.x / 100 * PS + 5000, p.y / 100 * PS)
            // dir.angle = lerp(dir.angle, 240 + 60 * dirChange, .01)
            dir.angle = lerp(dir.angle, -60 - 60 * dirChange, 0.1)
            p.x += dir.x
            p.y += dir.y
            stroke(255, sin(180 * t / l) * dirChange * 10)
            line(p.x, p.y, p.x, p.y)
        }
        if (i % 10 == 0) await timeout()
    }
}