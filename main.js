let pencil = '#444'
const pencilMultiplier = random(1, 2)
const pencilThickness = random(1, 1.3)
let penColor

let PERSPECTIVE = 1 / 8

async function makeImage() {
    initDrink()
    initPaths()
    noSmooth()
    drawbg()
    // clouds()

    // if (drink.name) {
    //     let textPos = height*.2
    //     for (word of drink.name){
    //         blendMode(SUBTRACT)
    //         fill(255)
    //         textFont(myFont)
    //         textSize(15)
    //         textAlign(CENTER,TOP)
    //         while (textWidth(word) < width*.9) {
    //             textSize(textSize() + 1)
    //         }
    //         text(word, width*.5, textPos)
    //         textPos += textSize()*.7
    //         blendMode(BLEND)
    //     }
    // }

    translate(width / 2, height / 2 + 200)

    // drink.cherry = 'floating cherry'
    // for (let x=-width/2;x<width/2;x+=width/6){
    //     for (let y=-height*.3;y<height;y+=height/10){
    //         await drawCherry(P(x+ random(-30,30),y + random(-30,30)),'cherry',{stem:true})
    //     }
    // }
    // await glassShadow_curtain()
    await glassShadow()


    // if (drink.rim) await rim('back')
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

    // if (drink.foam) await foam()
    // if (drink.foamBubbles) await drawFoamBubbles()

    // if (drink.lemon) await drawLemon()
    // if (drink.toothPick) await drawToothPick()
    // if (drink.cherry) await makeCherry()

    await drawGlass(path, 'front')
    await sun()
    // if (drink.rim) await rim('front')

    resetMatrix()


    // await makeDropletsGraphics()
    // await applyDroplets()

    // noSmooth()
    // shaderGraphics.resizeCanvas(width/2, height)
    // shaderGraphics.shader(flareShader)
    // flareShader.setUniform('tex0', get(0,0,width/2,height))
    // flareShader.setUniform('resolution', [width/2, height])
    // flareShader.setUniform('radius', 50.0)
    // shaderGraphics.rect(0,0, width/2, height)
    // image(shaderGraphics, 0, 0)


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
    return map(y, 0, 350, 0.18, 0)
}

function getPointOnRevolved(path, offset, angle) {
    const pos = path.getPointAt(offset)
    const rx = pos.x * 1
    const ry = pos.x * getPerspective(pos.y)
    const p = new Point(cos(angle) * rx, sin(angle) * ry + pos.y)
    return p
}




async function pointilizePath_old(path, multiplyer = 1, clr = color(255), func = (p) => p) {
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
                    const liquidMultiplier = inLiquid ? .5 : 10
                    const noiseScale = inLiquid ? 120 : 300

                    const n = noise(p.x / noiseScale, p.y / noiseScale)
                    strokeWeight(4 * n)
                    // const n2 = noise(p.x / noiseScale / 2, p.y / noiseScale * 5)
                    // clr.setAlpha(n2 * (1 - (h - path.bounds.top) / (path.bounds.height)) * liquidMultiplier * multiplyer + liquidMultiplier)
                    clr.setAlpha(inLiquid ? n * n * multiplyer * 3 : multiplyer * 6)
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









async function pointilizePath(path, func = () => { }) {
    for (let h = path.bounds.top; h < path.bounds.bottom; h += .5) {
        const l = new Path.Line(P(-width, h), P(width, h))
        const pathintersections = path.getIntersections(l)
        if (pathintersections.length > 1) {
            for (let i = 0; i < pathintersections.length - 1; i += 2) {
                const sliceStart = pathintersections[i].point
                const sliceEnd = pathintersections[i + 1].point
                const slicePath = new Path([sliceStart, sliceEnd])
                func(slicePath)
                slicePath.remove()
            }
            await timeout()
        }
        l.remove()
    }
}

let topLiquidPerspective, topLiquidHeight
function through(path, objectOffset = .5, func = () => { }) {
    if (!topLiquidPerspective) topLiquidPerspective = getPerspective(liquidPath.segments[0].point.y)
    if (!topLiquidHeight) topLiquidHeight = topLiquidPerspective * liquidPath.segments[liquidPath.segments.length - 2].point.x

    for (let i = 0; i < path.length; i += .2) {
        const p = path.getPointAt(i)
        const iAngle = map(i, 0, path.length, 0, 180)
        const inLiquid = p.y < liquidPath.bounds.bottom + objectOffset * topLiquidHeight - sin(iAngle) * (path.length) * topLiquidPerspective / 2
        func({ point: p, inLiquid, index: i, perc: i / path.length })
    }
}