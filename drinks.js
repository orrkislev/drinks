function initDrink() {
    drink = {
        glassType: choose(['highball', 'old fashioned', 'martini', 'wine']),
        frost: 0, //Math.floor(random(3)) / 2,
        glassRidges: 0, //random() < 0.5 ? 0 : round_random(15, 30),
        bubbles: random() < 0.5 ? false : random(30, 200),
        ice: random() < 0.5 ? 0 : round_random(1, 4),
        foam: random() < 0.5,
        mint: random() < 0.5,
        toothPick: false, //random() < 0.5,
        cherry: false, //random()<.5 ? false : choose(['floating','skewed']),
        lemon: false, //random()<.5,
        rim: false, //random()<0.5,
        liquid: [color(random(255), random(255), random(255) ), color(random(255), random(255), random(255))],
            // HSBColor(random(360), 360, 360),
            // HSBColor(random(360), 360, 360)]
    }
    drinks = {
        manhattan: {
            glassType: 'old fashioned',
            glassRidges: 0,
            frost: 0, ice: 1, mint: false, foam: false, bubbles: 30,
            lemon:false,
            toothPick: true, cherry: 'skewed cherry',
            liquid: [color('#c8691c'), color('#dc5713')],
            name: ['Manhattan']
        },
        old_fashioned: {
            glassType: 'old fashioned',
            glassRidges: 0,
            frost: 0, ice: 1, mint: false, foam: false, bubbles: 30,
            lemon:false,
            toothPick: false, cherry: 'floating olive',
            liquid: ['#c8691c', '#dc5713'],
            name: ['Old','Fashioned']
        },cosmopolitan: {
            glassType: 'martini',
            glassRidges: 0,
            frost: random(.2), ice: 3, mint: true, foam: false, bubbles: 0,
            toothPick: false, cherry: false,
            lemon: true,
            liquid: ['#dd2d4a', '#ff99ac'],
            name:['COSMOPOLITAN'],
        }, margarita: {
            glassType: 'margarita',
            glassRidges: 0,
            frost: random(.2), ice: 3, mint: true, foam: false, bubbles: 'watermelon seeds',
            toothPick: true, cherry: false, rim: true,
            lemon: true,
            liquid: ['#dd2d4a', '#ff99ac'],
            name:['watermelon','margarita'],
        }
    }



    // drink = { ...drink, ...drinks.manhattan }
}

function HSBColor(h, s, b) {
    colorMode(HSB)
    const clr = color(h, s, b)
    colorMode(RGB)
    return clr
}