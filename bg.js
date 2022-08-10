bottomOptions = [
    ['#ADA2FE', '#F3CBFD', '#FFDBFF', '#FC99DA'],
    ['#EA1E27', '#FE9069', '#F6AC79'] ,
    ['#03373F', '#046A55', '#03373F']
]
topOptions = [
    ['#FF6E62', '#FF8A61', '#FFAA31'],
    ['#C58DBE', '#B9C6F3', '#27C5F5'],
    ['#00D96B', '#095F56', '#36CBE1']
]   

    


bgColors = {
    bottom: choose(bottomOptions).sort((a,b)=>random()>.5?-1:1),
    top: choose(topOptions).sort((a,b)=>random()>.5?-1:1).slice(0,2)
}

function drawbg(){
    const gradHorOff = random()<.2 ? width * random(.5,.8) : width * .5
    const gradient = drawingContext.createLinearGradient(gradHorOff, height, width-gradHorOff,0)
    const horizonPos = .4
    const horizonThickness = random()<.3 ? .001 : random(.1) 
    for (let i=0;i<bgColors.bottom.length;i++){
        gradient.addColorStop(horizonPos * i/(bgColors.bottom.length-1), bgColors.bottom[i]);
    }
    for (let i=0;i<bgColors.top.length;i++){
        gradient.addColorStop(horizonPos + horizonThickness + (1-horizonPos - horizonThickness) * i/(bgColors.top.length-1), bgColors.top[i]);
    }
    drawingContext.fillStyle = gradient;

    noStroke()
    rect(0, 0, canvas.width, canvas.height);
}

async function glassShadow_curtain(){
    await revolve(path, async (ellipse,pathIndex)=>{
        const perc = pathIndex / (path.length - 1)
        ellipse.position.y *= -1
        if (ellipse.position.y < -10) ellipse.position.y = min(ellipse.position.y+30,-10)

        for (let i = 0; i < ellipse.length; i+=1) {
            const loc = ellipse.getLocationAt(i)
            const p = loc.point
            stroke(0)
            const ll = 2 * perc
            drawDot(p,P(-random(ll), -random(ll)), P(random(ll), random(ll)))
        }
        await timeout()
    }, (p)=>P(-80,-30 + p.y))

    let color1 = color(bgColors.bottom[0])
    let color2 = color(bgColors.bottom[2])

    shaderGraphics.resizeCanvas(width, height)
    shaderGraphics.shader(bgShader)
    bgShader.setUniform('time', random(1000))
    bgShader.setUniform('color1', [red(color1)/255, green(color1)/255, blue(color1)/255])
    bgShader.setUniform('color1', [red(color2)/255, green(color2)/255, blue(color2)/255])
    bgShader.setUniform('resolution', [width, height])
    push()
    resetMatrix()
    bgShader.setUniform('tex0', get())
    shaderGraphics.rect(-width / 2, -height / 2, width, height)
    image(shaderGraphics, 0, 0)
    pop()
    return
}

async function glassShadow(){
    let color1 = color(bgColors.bottom[0])
    let color2 = color(bgColors.bottom[2])

    const brghtnessOffset = brightness(bgColors.bottom[0]) < 50 ? 50 : -50;

    colorMode(HSB)
    color1 = color(hue(color1), saturation(color1), brightness(color1) + brghtnessOffset)
    color2 = color(hue(color2), saturation(color2), brightness(color2) + brghtnessOffset)
    colorMode(RGB)

    await revolve(path, async (ellipse,pathIndex)=>{
        const perc = pathIndex / (path.length - 1)
        ellipse.position.y *= -1
        if (ellipse.position.y < -10) ellipse.position.y = min(ellipse.position.y+30,-10)

        for (let i = 0; i < ellipse.length; i+=1) {
            const loc = ellipse.getLocationAt(i)
            const p = loc.point
            const clr = lerpColor(color1, color2, perc)
            clr.setAlpha(3*(1-perc)+1)
            stroke(clr)
            const ll = 2 * perc
            drawDot(p,P(-random(ll), -random(ll)), P(random(ll), random(ll)))
        }
        await timeout()
    }, (p)=>P(0,-p.y))

    await revolve(path, async (ellipse,pathIndex)=>{
        const perc = pathIndex / (path.length - 1)
        ellipse.position.y *= -1
        if (ellipse.position.y < -10) ellipse.position.y = min(ellipse.position.y+30,-10)

        for (let i = 0; i < ellipse.length; i+=1) {
            const loc = ellipse.getLocationAt(i)
            const p = loc.point
            const clr = lerpColor(color1, color2, perc)
            clr.setAlpha(4*(1-perc))
            stroke(clr)
            const ll = 2 * perc
            drawDot(p,P(-random(ll*5), -random(ll)), P(random(ll*5), random(ll)))
        }
        await timeout()
    }, (p)=>P(p.y/3,0))

}