const shade_round = [[0, 50], [20, 0], [50, 0], [75, 50], [100, 100]]
const shade_round_shiny = [[0, 50], [10, 0], [11, 30], [30, 0], [40, 0], [60, 100], [80, 30], [90, 0], [100, 100]]

function getShadeAtAngle(shadeStyle, angle, shadeSteps = false) {
    angle = angle%360
    if (angle < 0) angle += 360
    if (angle > 180) angle = 360 - angle
    const t = map(angle, 180, 0, 0, 100)
    let v = getShadeAtVal(shadeStyle, t)
    if (shadeSteps) v = round(v*shadeSteps)/shadeSteps
    return v
}
function getShadeAtVal(shadeStyle, t) {
    for (let i = 0; i < shadeStyle.length - 1; i++) {
        const posS = shadeStyle[i][0]
        const posE = shadeStyle[i + 1][0]
        const valS = shadeStyle[i][1]
        const valE = shadeStyle[i + 1][1]

        if (t >= posS && t <= posE) {
            return lerp(valS, valE, (t - posS) / (posE - posS)) / 100
        }
    }
    return -1
}