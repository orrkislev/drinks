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

// ['#141915', '#2A2C44', '#4271A5', '#5286B8', '#844C38', '#D1BD70', '#C92F33']


bgColors = {
    bottom: choose(bottomOptions).sort((a, b) => random() > .5 ? -1 : 1),
    top: choose(topOptions).sort((a, b) => random() > .5 ? -1 : 1).slice(0, 2)
}
// bgColors.bottom = ['#4271A5','#2A2C44','#141915',]
// bgColors.top = ['#2A2C44','#141915']

function drawbg() {
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

    noStroke()
    rect(0, 0, canvas.width, canvas.height);

    // shaderGraphics.resizeCanvas(width, height)
    // shaderGraphics.shader(cloudsShader)
    // cloudsShader.setUniform('time', random(1000))
    // cloudsShader.setUniform('color1', [red(color(bgColors.bottom[0]))/255, green(color(bgColors.bottom[0]))/255, blue(color(bgColors.bottom[0]))/255])
    // cloudsShader.setUniform('color2', [red(color(bgColors.bottom[2]))/255, green(color(bgColors.bottom[2]))/255, blue(color(bgColors.bottom[2]))/255])
    // cloudsShader.setUniform('tex0', get())
    // cloudsShader.setUniform('resolution', [width, height])
    // resetMatrix()
    // shaderGraphics.rect(-width / 2, -height / 2, width, height)
    // image(shaderGraphics, 0, 0)
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
    let color2 = color(bgColors.bottom[2])

    const brghtnessOffset = brightness(bgColors.bottom[0]) < 50 ? 50 : -50;

    colorMode(HSB)
    color1 = color(hue(color1), saturation(color1), brightness(color1) + brghtnessOffset)
    color2 = color(hue(color2), saturation(color2), brightness(color2) + brghtnessOffset)
    colorMode(RGB)

    await revolve(path, async (ellipse, pathIndex) => {
        const perc = pathIndex / (path.length - 1)
        ellipse.position.y *= -1
        if (ellipse.position.y < -10) ellipse.position.y = min(ellipse.position.y + 30, -10)

        for (let i = 0; i < ellipse.length; i += 1) {
            const loc = ellipse.getLocationAt(i)
            const p = loc.point
            const clr = lerpColor(color1, color2, perc)
            clr.setAlpha(3 * (1 - perc) + 1)
            stroke(clr)
            const ll = 2 * perc
            drawDot(p, P(-random(ll), -random(ll)), P(random(ll), random(ll)))
        }
        await timeout()
    }, (p) => P(0, -p.y))

    await revolve(path, async (ellipse, pathIndex) => {
        const perc = pathIndex / (path.length - 1)
        ellipse.position.y *= -1
        if (ellipse.position.y < -10) ellipse.position.y = min(ellipse.position.y + 30, -10)

        for (let i = 0; i < ellipse.length; i += 1) {
            const loc = ellipse.getLocationAt(i)
            const p = loc.point
            const clr = lerpColor(color1, color2, perc)
            clr.setAlpha(4 * (1 - perc))
            stroke(clr)
            const ll = 2 * perc
            drawDot(p, P(-random(ll * 5), -random(ll)), P(random(ll * 5), random(ll)))
        }
        await timeout()
    }, (p) => P(p.y / 3, 0))

}


function checkerboard(){
    let yStep = 5
    const xStep = 150
    let rowCounter = 0
    for (let y = height * .65; y < height; y += yStep) {
        yStep += 2
        const pers = map(y, height * .65, height, .2, 3)
        const nextPers = map(y + yStep, height * .65, height, .2,3)
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

function clouds(){
    for (let i=0;i<10;i++){
        cloud(random(width),random(height))
    }
}

function cloud(cloudx,cloudy){
    noiseDetail(6, 0.65);
  
  cloudNoiseStartVal = noise(500,1000);

  const clousAngle = random(360)
  for (let t = 0; t < 3000; t++) {
    resetMatrix()
    translate(cloudx,cloudy)
    const posAngle = random(360)
    const posR = random(100)
    const posX = cos(posAngle) * posR
    let posY = sin(posAngle) * posR/2
    if (posY > 0) posY *= .5
    const cloudNoiseVal = noise(500+posX/50, 600+posY/50)
    const cloudThresh = 1 - posR / 100;
    if (abs(cloudNoiseVal - cloudNoiseStartVal) > cloudThresh) continue
    translate(posX,posY)
    
    const angleVal =  1-abs((posAngle-clousAngle)%360) / 200
    const RVal = posR/100
    
    // ---- FASTER BUT LESS NICE
    // ---- SET THE LOOP TO 10K
    // fill(255,10*angleVal*RVal)
    // circle(0,0,random(20))
    // continue
    
    // ---- SLOWER BUT NICER
    // ---- SET THE LOOP TO 3K
    const noiseStartX = random(2000,10000)
    const noiseStartY = random(2000,10000) 
    startVal = noise(noiseStartX, noiseStartY);

    const maxR = random(10);
    for (let r = 1; r < maxR; r++) {
      const circum = r * 2 * PI;
      for (let i = 0; i < circum; i++) {
        const a = (i * 360) / circum;
        const x = cos(a) * r;
        const y = sin(a) * r;
        const val = noise(noiseStartX + (x/20) / maxR, noiseStartY + y / maxR);
        const thresh = 1 - r / maxR;
        if (abs(val - startVal) < thresh) {
          // stroke(255, val*255*t/100*posAngle*posR);
          stroke(255, (thresh+0.1) * 255 * angleVal * RVal);
          line(x, y, x, y);
        }
      }
    }
  }
  resetMatrix()
}