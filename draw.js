let activeGraphics = null
allDots = 0
function drawDot(p,offset1 = P(0,0),offset2 = P(0,0)) {
    line(p.x + offset1.x, -p.y*PERSPECTIVE + offset1.y, p.x + offset2.x, -p.y*PERSPECTIVE + offset2.y)
}

function fillShape(ps, x = 0, y = 0) {
    activeGraphics.beginShape()
    ps.forEach(p => activeGraphics.vertex(p.x + x, p.y + y))
    activeGraphics.endShape()
}

function drawShape(ps, x = 0, y = 0) {
    ps.forEach(p => drawDotXY(p.x + x, p.y + y))
}

lastTimeoutTime = 0
function timeout(ms) {
    // return waitForKey(32).then(() => new Promise(resolve => setTimeout(resolve, max(ms, 100))))
    if (performance.now() - lastTimeoutTime < 10) return
    lastTimeoutTime = performance.now()
    return new Promise(resolve => setTimeout(resolve, ms));
}

function waitForKey(key) {
    return new Promise(resolve => {
        if (keyIsDown(key)) resolve()
        else window.addEventListener('keydown', e => {
            if (e.keyCode == key) resolve()
        })
    })
}
function addEffect() {
    filter(ERODE)
    filter(DILATE)
}

function pathToPoints(path) {
    const ps = []
    for (let i = 0; i < path.length; i++) ps.push(path.getPointAt(i))
    return ps
}

function drawPath(path, opacity = 1, clr = 'black') {
    penColor = color(clr)
    strokeWeight(1)
    if (path.children) {
        path.children.forEach(drawPath)
        return 
    }
    const ps = pathToPoints(path)
    // ps.forEach(p => drawDotXY(p.x, p.y, opacity))
    ps.forEach(p => line(p.x,-p.y,p.x,-p.y))
}
function fillPath(path,clr) {
    if (clr) activeGraphics.fill(clr)
    activeGraphics.noStroke()
    if (path.children) {
        // fillPath(path.children[0],clr)/
        path.children.forEach(child=>fillPath(child,clr))
        return 
    }
    const ps = pathToPoints(path)
    fillShape(ps)
}