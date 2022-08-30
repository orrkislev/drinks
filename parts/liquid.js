
async function drawLiquid() {
    // colorMode(HSB)
    // const liquidLayers = [
    //     { perc: 0, color: drink.liquid[0] },
    //     { perc: 1, color: drink.liquid[1] },
    //     { perc: 2, color: color(choose(bgColors.top)) },
    // ]

    const liquidLayers = []
    drink.liquid.forEach((drinkColor, i) => {
        liquidLayers.push({ perc: i / drink.liquid.length, color: drinkColor })
    })
    const topColor = color(choose(bgColors.top))
    topColor.setAlpha(alpha(drink.liquid[0]))
    liquidLayers.push({ perc: 2, color: topColor })

    // const liquidLayers = [
    //     { perc: 0, color: color('brown') },
    //     { perc: .4, color: color('brown') },
    //     { perc: .5, color: color('white') },
    //     { perc: 1, color: color('white') },
    //     { perc: 2, color: color(choose(bgColors.top)) },
    // ]

    // liquidLayers[liquidLayers.length-1].color = color(255)
    // colorMode(RGB)

    const mixNoiseScale = random(30, 100) * PS
    const mixNoiseStrength = .4
    await revolve(liquidPath, async (ellipsePath, pathIndex) => {
        let heightPerc = (liquidPath.getPointAt(pathIndex).y - liquidPath.bounds.top) / (liquidPath.bounds.height)

        for (let i = 0; i < ellipsePath.length; i++) {
            const loc = ellipsePath.getLocationAt(i)
            const p = loc.point
            const n = noise(heightPerc * 3, i / 200)

            const currHeight = heightPerc + (noise(p.x / mixNoiseScale - 100, p.y / mixNoiseScale - 100, heightPerc * 9) - 0.5) * mixNoiseStrength
            // const currHeight = heightPerc
            let clr = color(0, 0)
            for (let j = 1; j < liquidLayers.length; j++) {
                if (currHeight > liquidLayers[j].perc) continue
                if (j == liquidLayers.length - 1 || currHeight < liquidLayers[j].perc) {
                    const clr1 = liquidLayers[j - 1].color
                    const clr2 = liquidLayers[j].color
                    mixPerc = (currHeight - liquidLayers[j - 1].perc) / (liquidLayers[j].perc - liquidLayers[j - 1].perc)
                    clr = lerpColor(clr1, clr2, mixPerc * 0.7 + n * 0.3)
                    break;
                }
            }


            strokeWeight(2 * PS)
            const i2 = i % round(ellipsePath.length / 2)
            const distFromEdges = abs(i2 - ellipsePath.length / 4) / (ellipsePath.length / 4)
            clr = lerpColor(clr, color(0, alpha(clr)), distFromEdges * (1 - heightPerc))
            clr.setAlpha(min((1 - heightPerc) * 75 + 75, alpha(clr)))
            stroke(clr)
            drawDot(p)

            stroke(255, 10 * noise(heightPerc * 10, i / 50))
            drawDot(p)
        }
        await timeout()
    })

    await revolve(liquidPath, async (ellipsePath, pathIndex) => {
        const posY = liquidPath.getPointAt(pathIndex).y
        if (posY.y < liquidPath.bounds.top + 1 || posY > liquidPath.bounds.bottom - 1) return
        const heightPerc = (posY - liquidPath.bounds.top) / (liquidPath.bounds.height)

        ellipsePath.splitAt(ellipsePath.length * .5)
        const frontPath = ellipsePath.splitAt(ellipsePath.length * .5)
        ellipsePath.remove()

        for (let i = 0; i < frontPath.length; i++) {
            for (let t = 0; t < 1; t++) {
                const pos = frontPath.getPointAt(i)
                const p = pos.add(pos.normalize(random() * random() * 5)).add(0, random(-15, 15))
                const n = noise(heightPerc * 3, i / 200)
                strokeWeight(2 * n * PS)
                stroke(255, random(8))
                drawDot(p)
            }
        }
        await timeout()
    })
}
