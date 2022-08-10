let pencil = '#444'
const pencilMultiplier = random(1, 2)
const pencilThickness = random(1, 1.3)
let penColor

let PERSPECTIVE = 1 / 8

async function makeImage() {
    initDrink()
    initPaths()

    drawbg()
    translate(width / 2, height / 2 + 200)
    // await glassShadow_curtain()
    await glassShadow()


    await drawGlass(path, 'back')
    if (path.bubble) {
        await drawGlass(path.bubble, 'back')
        await drawGlass(path.bubble, 'front')
    }

    await drawLiquid()
    if (drink.bubbles) bubbles()
    if (drink.ice) ice()
    if (drink.mint) leaves()
    await drawDrinkElements()

    if (drink.foam) await foam()
    if (drink.foamBubbles) await drawFoamBubbles()

    if (drink.toothPick) await drawToothPick()
    if (drink.cherry) await makeCherry()
    if (drink.lemon) await drawLemon()

    await drawGlass(path, 'front')
    await sun()

    // await makeDropletsGraphics()
    // await applyDroplets()

    fxpreview()
}


async function revolve(path, drawFunc, translationFunc = (p) => P(0, p.y)) {
    for (let i = 0; i < path.length; i += 1) {
        const pos = path.getPointAt(i)
        if (pos.x < 2) continue
        const ellipse = new Path.Ellipse({ center: P(0, 0), size: P(pos.x * 2, pos.x * 2) })
        if (drink.glassRidges > 0) {
            ellipse.rebuild(drink.glassRidges)
            ellipse.segments.forEach((seg, segI) => {
                if (segI % 2 == 0) seg.point = seg.point.multiply(0.9)
            })
        }
        push()
        translate(translationFunc(pos).x, -translationFunc(pos).y)
        PERSPECTIVE = getPerspective(pos.y)
        await drawFunc(ellipse, i)
        pop()
        ellipse.remove()
    }
}

function getPerspective(y) {
    return map(y, 0, 350, 0.2, 0)
}

function getPointOnRevolved(path, offset, angle) {
    const pos = path.getPointAt(offset)
    const rx = pos.x * 1
    const ry = pos.x * getPerspective(pos.y)
    const p = new Point(cos(angle) * rx, sin(angle) * ry + pos.y)
    return p
}




async function pointilizePath(path, multiplyer = 1, clr = color(255), func = (p) => p) {
    const topLiquidPerspective = getPerspective(liquidPath.segments[0].point.y)
    for (let h = path.bounds.top; h < path.bounds.bottom; h += .5) {
        const l = new Path.Line(P(-width, h), P(width, h))
        const pathintersections = path.getIntersections(l)
        if (pathintersections.length > 1) {
            for (let i = 0; i < pathintersections.length - 1; i += 2) {
                const p1 = pathintersections[i].point
                const p2 = pathintersections[i + 1].point
                const startX = min(p1.x, p2.x)
                const endX = max(p1.x, p2.x)
                for (let t = startX; t < endX; t += .2) {
                    const p = P(t, h)

                    const tAngle = map(t, startX, endX, 0, 180)
                    const inLiquid = h < liquidPath.bounds.bottom - sin(tAngle) * (endX - startX) * topLiquidPerspective / 2
                    const liquidMultiplier = inLiquid ? 1 : 10
                    const noiseScale = inLiquid ? 80 : 300

                    const n = noise(p.x / noiseScale, p.y / noiseScale)
                    const n2 = noise(p.x / noiseScale / 2, p.y / noiseScale * 5)
                    strokeWeight(4 * n)
                    clr.setAlpha(n2 * (1 - (h - path.bounds.top) / (path.bounds.height)) * liquidMultiplier * multiplyer)
                    stroke(clr)
                    line(p.x, -p.y, p.x, -p.y)
                    func(p)
                }
            }
            await timeout()
        }
    }
}


// ------------------------------------------------------------
// ------------------------------------------------------------
// ------------------------------------------------------------

function makeDropletsGraphics() {
    dropsGraphics = createGraphics(width, height)
    dropsGraphics.translate(width / 2, height / 2 + 200)
    activeGraphics = dropsGraphics
    for (let i = 0; i < 20; i++) {
        const h = random(20, 100)
        const index = round(random(path.length - h))
        const a = random(30, 150)
        let r = random(3, 20)
        let dropPath = new Path()
        for (let t = 0; t < h; t++) {
            const pos = path.getPointAt(index + t)
            const p = P(cos(a) * pos.x, pos.y + sin(a) * pos.x * 0.2)
            const c = new Path.Circle({ center: p, radius: r }).wonky()
            c.scale(1, -1)
            c.position.y *= -1
            dropPath = dropPath.unite(c)
            r *= 0.99
            c.remove()
        }
        dropPath.simplify(4)
        stroke(255, 2)
        fillPath(dropPath, '#fff')
        for (let j = 0; j < dropPath.length; j++) {
            const p = dropPath.getPointAt(j)
            line(p.x - random(), p.y - random(), p.x + random(), p.y + random())
        }
    }
    activeGraphics = this
}

function applyDroplets() {
    const img = get()
    shaderGraphics.resizeCanvas(width, height)
    shaderGraphics.shader(blurShader)
    blurShader.setUniform('resolution', [width, height])
    blurShader.setUniform('tex0', img)
    blurShader.setUniform('mask', dropsGraphics)
    blurShader.setUniform('radius', 5.0)
    shaderGraphics.rect(-width / 2, -height / 2, width, height)

    resetMatrix()
    image(shaderGraphics, 0, 0)
}
