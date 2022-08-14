class glassPath extends Path {
    constructor(args) {
        super(args)
        this.segmentsData = []
    }
    init(scl = 1){
        this.scl = scl
        this.add(P(0, 0))

        if (drink.glassType === 'highball' || drink.glassType === 'old fashioned') {
            const radius = drink.glassType === 'highball' ? random(70, 140) : random(110, 180)
            const height = drink.glassType === 'highball' ? random(300, 500) : random(150, 350)
            const baseThickness = random(10, 50)
            const topOffset = random(0, baseThickness)
            this.addPoint(P(radius, 0), { fillet: random(35) })
            this.addPoint(P(radius, baseThickness), { thickness: 10 })

            this.addPoint(P(radius + topOffset, height), { thickness: 5 })
            if (random() < 0.5) this.lastSegment.handleIn = pointFromAngle(random(-170, -30), random(radius))

            if (random() < 0.8) this.makeBubble(baseThickness * 1.5, radius)

            this.patternStart = 10
            this.patternEnd = height

        } else if (drink.glassType === 'martini') {
            const stemWidth = random(3, 10)
            const stemHeight = random(70, 150)
            const glassWidth = random(100, 200)
            const glassHeight = random(100, 250)
            const baseWidth = random(stemWidth + 10, glassWidth * .75)
            this.addPoint(P(0, 0))
            this.addPoint(P(baseWidth, 0))
            this.addPoint(P(baseWidth, 10), { fillet: 5 })
            this.addPoint(P(stemWidth, 20), { fillet: 5 })
            this.addPoint(P(stemWidth, stemHeight), { thickness: 15, fillet: 15 })
            this.addPoint(P(glassWidth, stemHeight + glassHeight), { thickness: 10 })
            if (random() < .5) this.lastSegment.handleIn = pointFromAngle(random(-170, -30), random(min(glassHeight, glassWidth)))

            this.patternStart = stemHeight + 10
            this.patternEnd = stemHeight + glassHeight

        } else if (drink.glassType === 'wine') {
            const stemWidth = random(3, 10)
            const stemHeight = 150
            const glassWidth = 100
            const glassHeight = random(100, 250)
            const baseWidth = random(stemWidth + 10, glassWidth * .75)
            this.addPoint(P(0, 0))
            this.addPoint(P(baseWidth, 0))
            this.addPoint(P(baseWidth, 10), { fillet: 5 })
            this.addPoint(P(stemWidth, 20), { fillet: 5 })
            this.addPoint(P(stemWidth, stemHeight), { thickness: 15, fillet: 15 })
            this.addPoint(P(glassWidth * random(1, 1.4), stemHeight + glassHeight * random(.3, .7)), { thickness: 10, fillet: 50 })
            this.addPoint(P(glassWidth, stemHeight + glassHeight), { thickness: 10 })
            this.lastSegment.handleIn = pointFromAngle(random(-170, -30), random(min(glassHeight, glassWidth)))

            this.patternStart = stemHeight + 10
            this.patternEnd = stemHeight + glassHeight
        } else if (drink.glassType === 'margarita') {
            const stemWidth = random(3, 10)
            const stemHeight = 150
            const glassWidth = 100
            const glassHeight = random(100, 250)
            const baseWidth = random(stemWidth + 10, glassWidth * .75)
            this.addPoint(P(0, 0))
            this.addPoint(P(baseWidth, 0))
            this.addPoint(P(baseWidth, 10), { fillet: 5 })
            this.addPoint(P(stemWidth, 20), { fillet: 5 })
            this.addPoint(P(stemWidth, stemHeight), { thickness: 15, fillet: 15 })
            this.addPoint(P(glassWidth * random(1, 1.4), stemHeight + glassHeight * random(.3, .7)), {
                thickness: 10, fillet: 50,
                handleIn: pointFromAngle(-90, 100),
                handleOut: pointFromAngle(0, 100)
            })
            this.addPoint(P(glassWidth, stemHeight + glassHeight), { thickness: 10 })
            this.lastSegment.handleIn = pointFromAngle(random(-170, -30), random(min(glassHeight, glassWidth)))

            this.patternStart = stemHeight + 10
            this.patternEnd = stemHeight + glassHeight
        }
        this.add(this.lastSegment.point.add(-3, 0))

        this.segments.forEach(seg=>seg.point = seg.point.multiply(this.scl))
    }
    addPoint(point, data = {}) {
        let seg
        if (data.fillet) {
            const lastPoint = this.lastSegment.point
            const dir = lastPoint.subtract(point).normalize(data.fillet)
            seg = this.add(point.add(dir))
            seg.handleOut = dir.multiply(-1)
            this.filletData = { point, size: data.fillet }
        } else if (this.filletData) {
            const dir = point.subtract(this.filletData.point).normalize(this.filletData.size)
            seg = this.add(point.add(dir))
            seg.handleIn = dir.multiply(-1)
            this.filletData = null
        } else {
            seg = this.add(point)
        }

        if (data.handleIn) seg.handleIn = data.handleIn
        if (data.handleOut) seg.handleOut = data.handleOut

        const segmentData = { seg }
        if (data.thickness) segmentData.thickness = data.thickness
        this.segmentsData.push(segmentData)
    }

    getInnerPath() {
        const innerPathData = this.segmentsData.filter(segData => segData.thickness >= 0)
        const innerCenter = innerPathData.map(segData => segData.seg.point).reduce((a, b) => a.add(b), P(0, 0)).divide(innerPathData.length)

        innerCenter.x = 0
        const innerSegments = innerPathData.map(segData => {
            const dir = innerCenter.subtract(segData.seg.point).normalize(segData.thickness)
            const newSegment = segData.seg.clone()
            newSegment.point = segData.seg.point.add(dir)
            return newSegment
        })
        const firstSegment = innerSegments.shift()
        const newFirstPoint = firstSegment.point.clone().add(-10, 0)
        const newFirstSegment = new Segment(newFirstPoint, null, P(20, 0))
        innerSegments.unshift(newFirstSegment)

        // if (newFirstPoint.x > 0) {
        firstSegment.point.x = 0
        innerSegments.unshift(firstSegment)
        // }
        const innerPath = new Path(innerSegments)
        return innerPath
    }

    makeBubble(tall, wide) {
        const bubble = new Path()
        const offset = random(.2)
        bubble.add(new Segment(P(0, tall * offset),0,P(wide, 0)))
        bubble.add(P(wide * random(.7), tall * .5))
        bubble.add(P(0, tall * (1 - offset)))
        bubble.smooth()
        bubble.segments.forEach(seg=>seg.point = seg.point.multiply(this.scl))
        this.bubble = bubble
    }
}

function initPaths() {
    path = new glassPath()
    path.init(1)
    innerPath = path.getInnerPath()

    liquidPath = innerPath.clone()
    liquidLevel = random(.5, .9)
    liquidPath.splitAt(liquidPath.length * liquidLevel)
    liquidPath.lastSegment.handleOut.set(0, 0)
    liquidPath.add(P(0, liquidPath.lastSegment.point.y))

    fullInnerPath = innerPath.clone()
    fullInnerPath.add(fullInnerPath.lastSegment.point.add(0, 1000))
    const fullInnerPath2 = fullInnerPath.clone()
    fullInnerPath2.scale(-1, 1)
    fullInnerPath2.position.x *= -1
    fullInnerPath2.reverse()
    fullInnerPath = fullInnerPath.join(fullInnerPath2)
    fullInnerPath.closePath()
    const innerFirst = innerPath.segments[1].point
    innerBaseEllipse = new Path.Circle(P(0, innerFirst.y), innerFirst.x)
    innerBaseEllipse.scale(1, getPerspective(innerFirst.y))
    fullInnerPath = fullInnerPath.join(innerBaseEllipse)

    specialPatterns = [
        // patternFlower((path.patternStart+path.patternEnd)/2, 25),
        // patternCrissCross(path.patternStart, path.patternEnd, 30),
    ]

    toothpickData = {
        startY: 50,
        overboard: random(50, 200),
        startDir: random(180),
    }
    toothpickData.endDir = toothpickData.startDir + 180
}








const highlights = [
    { pos: random(10, 80), width: random(10, 50), strength: .5, noiseSize: 100, noiseOffset: random(100) },
    // { pos: random(90, 170), width: random(50, 100), strength: .4, noiseSize: 100, noiseOffset: random(100) },
    { pos: 0, width: 50, strength: .3, noiseSize: 25, noiseOffset: random(100) },
    { pos: 180, width: 50, strength: .3, noiseSize: 25, noiseOffset: random(100) }
]


let glassColor1, glassColor2
async function drawGlass(path, frontOrBack) {

    glassColor1 = glassColor1 ?? color(choose(bgColors.bottom))
    glassColor2 = glassColor2 ?? color(choose(bgColors.top))

    funcTime = 0

    await revolve(path, async (ellipsePath, pathIndex) => {
        const startTime = performance.now()
        if (ellipsePath.length < 2) return
        const perc = pathIndex / (path.length - 1)


        ellipsePath.splitAt(ellipsePath.length * .5)
        const frontPath = ellipsePath.splitAt(ellipsePath.length * .5)
        const pathToDraw = frontOrBack == 'front' ? frontPath : ellipsePath
        if (frontOrBack == 'front') ellipsePath.remove()
        else frontPath.remove()

        const pathY = path.getPointAt(pathIndex).y
        const innerReflection = pathY < innerPath.bounds.top ? pathY / innerPath.bounds.top : 1
        for (let i = 0; i < pathToDraw.length; i += .2) {
            const loc = pathToDraw.getLocationAt(i)
            const p = loc.point
            const angle = (loc.normal.angle + 720 - 180 + drink.frost * random(-15, 15)) % 180

            const n = noise(loc.normal.angle / 30, perc * 8)
            let clr = lerpColor(glassColor1, glassColor2, n)
            clr.setAlpha(frontOrBack == 'front' ? 2 : 6)

            strokeWeight(2)
            stroke(clr)
            drawDot(p)

            if (innerReflection < 1) {
                const i2 = constrain(i + noise(p.x / 30, p.y / 30) * 150 - 75, 0, pathToDraw.length)
                const distFromEdges = abs(i2 - ellipsePath.length / 4) / (ellipsePath.length / 4)
                stroke(0, (1 - innerReflection) * 2 * distFromEdges)
                drawDot(p)
                if (distFromEdges < .9) {
                    const liquidColor = drink.liquid[1]
                    liquidColor.setAlpha(random(10) * (.5 - abs(innerReflection - 0.5)))
                    stroke(liquidColor)
                    drawDot(p)
                }
            }

            highlights.forEach(h => {
                if (angle > h.pos - h.width && angle < h.pos + h.width) {
                    const d = abs(angle - h.pos)
                    const s = h.strength * (1 - d / h.width)
                    const n2 = noise(p.x / h.noiseSize + h.noiseOffset, p.y / h.noiseSize + h.noiseOffset) + .5
                    strokeWeight(n2 * 6 * s)

                    stroke(255, map(innerReflection, 0, 1, 6, 15) * s)
                    drawDot(p)
                }
            })

            strokeWeight(2)
            specialPatterns.forEach(specialPattern => {
                specialPattern(pathToDraw, i, pathIndex, p)
            })
        }
        await timeout()
        funcTime += performance.now() - startTime
    })
    funcTime /= path.length
    print(`${frontOrBack} glass time: ${funcTime.toFixed(2)}ms`)
}

function patternCrissCross(start, end, density) {
    return (pathToDraw, i, pathIndex, p) => {
        const pathY = path.getPointAt(pathIndex).y
        const inPattern = pathY > start && pathY < end
        if (inPattern) {
            const midPattern = (start + end) / 2
            const distToMid = abs(pathY - midPattern)
            const percToMid = distToMid / (end - start)
            let patternVal = (i + pathY - start) % density < percToMid * 5 ? 15 : 0
            stroke(255, patternVal)
            drawDot(p)
        }
    }
}

function patternFlower(y, density) {
    return (pathToDraw, i, pathIndex, p) => {
        const pathY = path.getPointAt(pathIndex).y
        const cenPattern = pathToDraw.length / density
        const offset = P(pathY - y, i % cenPattern - cenPattern / 2)
        if (offset.length < cenPattern && abs(offset.angle) % 45 < 5) {
            stroke(255, 20)
            drawDot(p)
        }
    }
}

function patternFull(start, end, density) {
    return (pathToDraw, i, pathIndex, p) => {
        const pathY = path.getPointAt(pathIndex).y
        const inPattern = pathY > start && pathY < end
        if (inPattern) {
            const midPattern = (start + end) / 2
            const distToMid = abs(pathY - midPattern)
            const percToMid = distToMid / (end - start)
            const patternVal = (1 - percToMid) * density
            stroke(255, patternVal)
            drawDot(p)
        }
    }
}


const sunHorizontal = random()
const sunHeight = random(.5, 1)
async function sun() {
    const target = path.bounds.height * sunHeight
    await revolve(path, async (ellipsePath, pathIndex) => {
        ellipsePath.splitAt(ellipsePath.length * .5)
        const frontPath = ellipsePath.splitAt(ellipsePath.length * .5)
        ellipsePath.remove()

        const posY = path.getPointAt(pathIndex).y - path.bounds.top

        const pos = frontPath.length * sunHorizontal
        for (let i = 0; i < frontPath.length; i++) {
            const p = frontPath.getPointAt(i)
            const offset = P(posY - target, i - pos)
            strokeWeight(2 * noise(offset.lengh / 30, posY / 50))
            stroke(255, (60 * noise(offset.angle / 30 + 1000, offset.length / 10 + 500) / offset.length) ** 2)
            drawDot(p)
        }
        await timeout()
    })
}

async function rim(frontOrBack) {
    const rimPath = path.clone().splitAt(path.length - 35)
    await revolve(rimPath, async (ellipsePath, pathIndex) => {
        const sum = random(10, 30)
        for (let i = 0; i < sum; i++) {
            const offset = frontOrBack == 'front' ? random(0, 0.5) : random(0.5, 1)
            const p = ellipsePath.getPointAt(ellipsePath.length * offset)
            strokeWeight(2)
            stroke(0, 30)
            for (let j = 0; j < 3; j++) {
                drawDot(p.add(random(-3, 3), random(-3, 3)))
            }
            stroke(255, 50)
            for (let j = 0; j < 5; j++) {
                drawDot(p.multiply(random(1, 1.01)).add(random(-3, 3), random(-3, 3)))
            }
        }
        await timeout()
    })
}