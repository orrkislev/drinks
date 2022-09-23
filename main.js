let PERSPECTIVE = 1 / 8
const usePerespective = true//random() < 0.5

let anomaly = null

async function makeImage() {
    initDrink()
    if (!drink.name && random()<0.033) anomaly = 'upsideDown'
    if (!anomaly && random()<0.05) anomaly = 'lightning'
    initPaths()

    await makeBG()
    translate(width / 2, height / 2 + 200 * PS)

    await glassShadow()

    anomaly != 'upsideDown' && await rim('back')
    await drawGlass(path, 'back')
    await glassBubble()

    anomaly != 'upsideDown' && await drawLiquid()
    anomaly != 'upsideDown' && await liquidTop()

    bubbles()
    ice()
    leaves()
    stick()
    anomaly != 'upsideDown' && await drawDrinkElements()

    anomaly == 'lightning' && await lightning()
    anomaly != 'upsideDown' && await fruit()

    await drawGlass(path, 'front')
    await sun()
    anomaly != 'upsideDown' && await rim('front')

    anomaly != 'upsideDown' && await umbrella()

    await sideLeaf()

    resetMatrix()

    // noSmooth()
    // shaderGraphics.resizeCanvas(width, height)
    // shaderGraphics.shader(flareShader)
    // flareShader.setUniform('tex0', get(0, 0, width, height))
    // flareShader.setUniform('resolution', [width, height])
    // flareShader.setUniform('radius', 50.0)
    // shaderGraphics.rect(0, 0, width, height)
    // image(shaderGraphics, 0, 0)

    fxpreview()
    // save(fxhash+'.png');
    // setTimeout(()=>{ window.location.reload() } , 300)
}


async function revolve(rev_path, drawFunc, translationFunc = (p) => P(0, p.y)) {
    for (let i = 0; i < rev_path.length; i += .5 * PS) {
        const pos = rev_path.getPointAt(i)
        if (pos.x < 2) continue
        const ellipse = new Path.Ellipse({ center: P(0, 0), size: P(pos.x * 2, pos.x * 2) })
        if (drink.glassRidges > 0 && i < rev_path.ridgeEnd) {
            ellipse.rebuild(drink.glassRidges * 2)
            ellipse.segments.forEach((seg, segI) => {
                const val = constrain(map(i, rev_path.ridgeSmoothStart, rev_path.ridgeEnd, .8, 1), .8, 1)
                if (segI % 2 == 0) seg.point = seg.point.multiply(val)
                // if (segI % 2 == 0) seg.point = seg.point.multiply(constrain(map(i, 0, path.length/5, .8, 1),0,1))
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
    return usePerespective ? map(y, 0, 350 * PS, 0.18, 0) : 0
}

function getPointOnRevolved(path, offset, angle) {
    const pos = path.getPointAt(offset)
    const rx = pos.x * 1
    const ry = pos.x * getPerspective(pos.y)
    const p = new Point(cos(angle) * rx, sin(angle) * ry + pos.y)
    return p
}






//------------------------------------------------------
//------------------------------------------------------
//------------------------------------------------------
async function pointilizePath(path, func = () => { }) {
    for (let h = path.bounds.top; h < path.bounds.bottom; h += .5) {
        const l = new Path.Line(P(-width * 2, h), P(width * 2, h))
        const pathintersections = path.getIntersections(l)
        if (pathintersections.length > 1) {
            for (let i = 0; i < pathintersections.length - 1; i += 2) {
                const sliceStart = pathintersections[i].point
                const sliceEnd = pathintersections[i + 1].point
                const slicePath = new Path([sliceStart, sliceEnd])
                func(slicePath, { h, i })
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

async function pointilizeDraw(path, colorFunc = () => { }) {
    const noiseScale = random(50, 100)
    const noiseOffset = random(1000, 5000)

    await pointilizePath(path, (slicePath, sliceData) => {
        through(slicePath, 0, throughData => {
            const p = throughData.point
            let val = (noise(p.x / noiseScale + noiseOffset, p.y / noiseScale + noiseOffset) + .2) * (sin(180 * throughData.perc) + .3)
            let valLiquid = val
            if (throughData.inLiquid && fullInnerPath.contains(p)) valLiquid *= .1
            const clr = colorFunc(throughData, val, valLiquid, sliceData)
            if (clr) {
                stroke(clr)
                line(p.x, -p.y, p.x, -p.y)
            }
        })
    })
}