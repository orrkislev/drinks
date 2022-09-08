async function stick() {
    resetRandom()
    if (!drink.stick) return
    let startOffset = 0
    for (let i = 0; i < innerPath.length; i += 1) {
        if (abs(innerPath.getPointAt(i).y - stickData.startY) < 2) {
            startOffset = i;
            break
        }
    }
    const start = getPointOnRevolved(innerPath, startOffset, stickData.startDir).add(0, 10*PS)
    const end = getPointOnRevolved(path, path.length, stickData.endDir).add(0, 25*PS)
    end.x *= 0.9
    stickSpine = new Path.Line(start, end)

    const intersections = getOrderedIntersections(stickSpine, [innerPath])
    if (intersections && intersections.find(inter=>inter.point.y > path.bounds.top)) stickSpine.lastSegment.point.x *= 0.6


    const extra = end.subtract(start).normalize(stickData.overboard)
    stickSpine.add(end.add(extra))

    elmnt = new DrinkElement(null, _ = {})
    const stickWidth = drink.stick.includes('straw') ? 10*PS : 2*PS
    const strawColors = [color(choose(bgColors.bottom)), color(choose(bgColors.top))]
    elmnt.draw = async () => {
        for (i = 0; i < stickSpine.length; i += .2) {
            const loc = stickSpine.getLocationAt(i)
            const p1 = loc.point.add(loc.normal.multiply(stickWidth))
            const p2 = loc.point.add(loc.normal.multiply(-stickWidth))
            const l = new Path.Line(p1, p2)
            through(l, 0, throughData => {
                const p = throughData.point

                let clr
                if (drink.stick.includes('straw'))
                    clr = round((sin(throughData.perc * 90) * 25 + i) / 25) % 2 == 0 ? strawColors[0] : strawColors[1]
                else
                    clr = color('gray')
                clr = lerpColor(clr, color(0), throughData.perc / 2)
                clr = lerpColor(clr, color(255), .1 - abs(throughData.perc - 0.4) / 6)

                if (throughData.inLiquid) clr.setAlpha(noise(p.x / 70 + 400, p.y / 70 + 400) * 5)
                if (throughData.inLiquid) {
                    const angle = noise(p.x / 300, p.y / 300) * 360
                    const dir = pointFromAngle(angle, noise(p.x / 250, p.y / 250) * 10)
                    p.x += dir.x
                    p.y += dir.y
                }
                stroke(clr)
                line(p.x, -p.y, p.x, -p.y)
            })
        }
    }
}

async function umbrella() {
    resetRandom()
    if (!findWordInString(drink.stick, 'umbrella')) return
    const umbrellaColors = [color(choose(bgColors.bottom)), choose([color(choose(bgColors.top)), color(255)])]
    const rotation = -stickSpine.lastSegment.location.normal.angle
    const pos = stickSpine.lastSegment.point.add(0, 5*PS)
    await drawUmbrella(pos,rotation,random(100,150)*PS,umbrellaColors)
}

async function drawUmbrella(pos,rotation, size, umbrellaColors){
    push()
    translate(pos.x,-pos.y)
    rotate(rotation)
    const umbrellaPath = new glassPath([P(size, -random(size*.3,size*.7)), P(0, 0)])
    umbrellaPath.ridgeEnd = 1000
    umbrellaPath.ridgeSmoothStart = 0
    const originalRidges = drink.glassRidges
    drink.glassRidges = 12
    await revolve(umbrellaPath, async (ellipse, pathIndex) => {
        ellipse.smooth()
        const perc = pathIndex / (path.length - 1)
        for (let i = 0; i < ellipse.length; i += .5) {
            const loc = ellipse.getLocationAt(i)
            const p = loc.point
            const angle = (loc.normal.angle + 720 - 180) % 180
            let clr = i % (ellipse.length / 6) > ellipse.length / 12 ? umbrellaColors[0] : umbrellaColors[1]
            clr = lerpColor(clr, color(0), abs(i - (ellipse.length / 2)) / (ellipse.length))
            clr = lerpColor(clr, color(0), noise(i/10) / 10, pathIndex / 30)
            clr = lerpColor(clr, color(255), angle/360)
            stroke(clr)
            drawDot(p)
        }
        await timeout()
    })
    drink.glassRidges = originalRidges
    pop()
}