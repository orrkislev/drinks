function initDrink() {
    drink = {
        glassType: 'old fashioned', frost: 0,
        glassRidges: random() < .7 ? 0 : round_random(15, 30),
        bubbles: false, ice: 0, mint: false, fruit: false,
        stick: false,
        top: false,
        rim: false,
        liquid: [color('red'), color('white')],
    }
    const base = {
        glassType: choose(['highball', 'old fashioned', 'martini', 'wine', 'margarita', 'cocktail']),
        frost: random() ** 2,
        bubbles: random() < 0.5 ? false : random(30, 500),
        ice: random() < 0.5 ? 0 : round_random(1, 4),
        top: random() < 0.5 ? false : choose(['foam', 'bubbles', 'smoke']),
        mint: choose([false, 'floating ']) + (random() < 0.5 ? 0 : round_random(1, 4)),
        stick: random() < 0.5 ? false : choose(['straw', 'stirrer', 'umbrella']),  // spoon?
        fruit: random() < .5 ? false : gerRandomFruit(),
        rim: random() < 0.2,
        liquid: getRandomColors(),
    }
    drinks = {
        manhattan: {
            glassType: 'old fashioned',
            ice: 1, bubbles: 30,
            stick: 'stirrer', fruit: 'skewed cherry',
            liquid: [color('#c8691c'), color('#dc5713')],
            top: random() < 0.5 ? false : 'smoke',
            name: ['Manhattan']
        },
        old_fashioned: {
            glassType: 'old fashioned',
            frost: random(.5), ice: choose([1, 2]), bubbles: 30, fruit: 'floating olive',
            liquid: [color('#c8691c'), color('#dc5713')],
            name: ['Old Fashioned']
        }, cosmopolitan: {
            glassType: 'martini',
            frost: random(.2), ice: 3, mint: 3,
            fruit: 'lemon',
            liquid: [color('#dd2d4a'), color('#ff99ac')],
            name: ['COSMOPOLITAN'],
        }, watermelon_margarita: {
            glassType: 'margarita',
            frost: random(.2), ice: '30 crushed', mint: 3, bubbles: '50 seeds',
            rim: true,
            fruit: 'lemon',
            liquid: [color('#dd2d4a'), color('#ff99ac')],
            stick: 'straw',
            name: ['watermelon', 'margarita'],
        }, tequila_sunrise: {
            glassType: choose(['highball', 'cocktail']),
            frost: random(.2), ice: 3,
            fruit: 'floating cherry & lemon',
            liquid: getColors(['red', 'yellow', 'orange']),
            stick: 'umbrella',
            name: ['tequila', 'sunrise'],
        }, mojito: {
            glassType: 'highball',
            frost: random(.5, 1), ice: 15, mint: 10,
            fruit: 'lemon',
            liquid: [color('#befc0355'), color('#B7BB6955'), color('#fffd8a22')],
            stick: 'straw',
            name: ['mojito'],
        },

        irish_coffee: {
            glassType: choose(['highball', 'cocktail']),
            name: ['Irish Coffee'],
            stick: choose([false, 'stirrer']),
            fruit: choose([false, 'rim cherry']),
            top: 'foam',
            liquid: getColors(['black', 'brown', 'brown', 'brown', 'brown', 'brown', 'white']),
        },
        negroni: {
            glassType: 'old fashioned',
            name: ['Negroni'],
            frost: random(),
            fruit: choose(['orange peel', 'orange slice', 'orange wedge']),
            ice: choose(['1 large', 3]),
            liquid: getColors(['red', 'amber', 'amber'], 255)
        },
        martini: {
            glassType: 'martini',
            name: ['Martini'],
            frost: random(),
            liquid: getColors(['white', 'yellow'], 50),
            stick: 'stirrer',
            fruit: choose(['lemon peel', 'skewed olive', 'sinking olive'])
        },
        gin_tonic: {
            glassType: choose(['highball', 'old fashioned']),
            name: ['Gin & Tonic'],
            frost: random(), bubbles: 150,
            ice: 5, fruit: 'lemon wedge',
            liquid: getColors(['white', 'white'], 50)
        },
        painkiller: {
            glassType: 'cocktail',
            name: ['Painkiller'],
            ice: '10 small',
            fruit: choose('orange slice', 'orange wedge'),
            mint: 5,
            top: 'foam',
            liquid: getColors(['orange', 'yellow'])
        },
        rum_punch: {
            glassType: 'cocktail', name: ['Rum Punch'], frost: random(),
            ice: 3, stick: 'straw', fruit: choose(['floating cherry', 'rim cherry', 'sinking cherry'])
        },
        scotch: {
            glassType: 'old fashioned', name: ['Scotch Whiskey', 'Neat'], frost: random(),
            liquid: getColors(['amber', 'amber'], 100)
        },
        shirly_temple: {
            glassType: 'highball', name: ['Shirly Temple'], frost: random(),
            liquid: getColors(['pink', 'red', 'pink'], 50),
            ice: "10 small", mint: 3, fruit: choose(['rim cherry', 'floating cherry']),
            stick: choose(['stirrer', 'umbrella', 'straw']),
        },
        hot_toddy: {
            glassType: 'highball', name: ['Hot Toddy'], top: 'smoke',
            fruit: 'lemon slice',
            liquid: getColors(['amber', 'yellow']),
            stick: choose([false, 'stirrer']),
        },
        pickleback: {
            glassType: choose(['old fashioned', 'highball']), name: ['Pickleback'], frost: random(),
            liquid: getColors(['green', 'green'], 50),
            fruit: 'pickle slice',
        },
        jalapeno_margarita: {
            name: ['Jalapeño', 'Margarita'], glassType: 'old fashioned',
            ice: 3, mint: 10, rim: true, fruit: choose(['lemon slice', 'lemon wedge']),
            liquid: getColors(['green', 'yellow'], 100)
        },
        gin_fizz: {
            glassType: 'highball', name: ['Gin Fizz'], frost: random(.5, 1),
            foam: true, fruit: choose([false, 'lemon wedge']), bubbles: 200,
            liquid: getColors(['white', 'yellow'], 50)
        },
        kir_royale: {
            name: ['Kir Royale'], glassType: 'wine', fruit: 'floating cherry',
            liquid: getColors(['red', 'amber', 'amber'], 100)
        },
        campari_spritz: {
            name: ['Campari', 'Spritz'], glassType: 'margarita',
            ice: 3, mint: 3, rim: true, fruit: choose(['orange wedge', 'orange slice']),
            liquid: getColors(['red', 'pink'], 100)
        },
        penicillin: {
            name: ['Penicillin'], glassType: 'old fashioned',
            ice: "2 large", fruit: 'lemon peel', bubbles: 100,
            liquid: getColors(['white', 'yellow'], 100)
        },
        espresso_tonic: {
            name: ['Espresso & Tonic'], glassType: 'highball',
            liquid: getColors(['white', 'brown'], 120),
            fruit: 'lemon wedge', ice: '10 small', stick: 'straw'
        },
        whiskey_sour: {
            name: ['Whiskey Sour'], glassType: 'old fashioned',
            ice: 3, mint: 2, liquid: getColors(['yellow', 'orange']), bubbles: 100,
            fruit: choose(['floating cherry & orange slice', 'rim cherry & orange wedge'])
        },
        pisco_sour: {
            name: ['Pisco Sour'], glassType: choose(['wine', 'martini']), foam: true,
            frost: random(), liquid: getColors(['yellow', 'white'], 100), bubbles: 100,
        },
        tom_collins: {
            name: ['Tom Collins'], glassType: 'highball', ice: 6,
            liquid: getColors(['white', 'white'], 60), bubbles: 100, stick: 'stirrer',
            fruit: 'orange slice & skewed cherry'
        },
        french_75: {
            name: ['French 75'], glassType: choose(['wine', 'martini']),
            fruit: 'lemon peel', liquid: getColors(['yellow', 'yellow', 'yellow'], 50),
            bubbles: 200,
        },
        paloma: {
            name: ['Paloma'], glassType: 'highball',
            ice: '15 crushed', liquid: getColors(['pink', 'orange'], 50),
            fruit: 'orange slice', bubbles: 100, rim: true
        },
        gold_rush: {
            name: ['Gold Rush'], glassType: 'old fashioned',
            ice: '1 large', liquid: getColors(['yellow', 'orange', 'yellow'], 120),
            fruit: 'lemon peel & wedge', rim: true
        },
        caipirinha: {
            name: ['Caïpirinha'], glassType: 'old fashioned',
            ice: 4, liquid: getColors(['white', 'green'], 50), mint: 10,
            fruit: 'lemon wedge'
        },
        pina_colada: {
            name: ['Piña Colada'], glassType: 'cocktail',
            ice: '15 crushed', liquid: getColors(['white', 'yellow', 'yellow']),
            stick: 'umbrella', fruit: 'floating cherry', rim: true
        },
        hemmingway: {
            name: ['Hemmingway', 'Dacquiri'], glassType: 'martini',
            fruit: 'lemon slice', bubbles: 100, liquid: getColors(['pink', 'yellow', 'pink']),
        },
        vieux_carre: {
            name: ['Vieux Carré'], glassType: 'old fashioned',
            ice: 3, liquid: getColors(['amber', 'yellow'], 100),
            fruit: 'lemon peel slice'
        },
        fjellbekk: {
            name: ['Fjellbekk'], glassType: 'highball',
            ice: '10 small', liquid: getColors(['white', 'yellow'], 50),
            fruit: 'lemon wedge', bubbles: 100, rim: random() < 0.5
        },
        mimosa: {
            name: ['Mimosa'], glassType: 'wine',
            ice: '3 crushed', liquid: getColors(['orange', 'yellow'], 255),
            fruit: 'orange slice && rim cherry', bubbles: 100,
        },
        moscow_mule: {
            name: ['Moscow Mule'], glassType: 'highball',
            ice: '10 small', liquid: getColors(['white', 'yellow', 'yellow'], 100),
            fruit: 'lime wedge', mint: 10, stick: 'straw'
        },
        merlot: {
            name: ['Merlot'], glassType: 'wine', liquid: getColors(['purple', 'red'], 255),
        },
        aperol_spritz: {
            name: ['Aperol Spritz'], glassType: 'margarita',
            ice: 3, mint: 3, rim: true, fruit: choose(['orange wedge', 'orange slice']),
            liquid: getColors(['red', 'pink'], 150), stick: 'straw'
        },
        mai_tai: {
            name: ['Mai Tai'], glassType: choose(['old fashioned', 'cocktail']),
            ice: '10 crushed', mint: 10, fruit: choose(['lemon slice', 'lemon wedge']) + " & cherry",
            liquid: getColors(['yellow', 'yellow', 'yellow', 'red'], 150), stick: 'umbrella'
        },
        gimlet: {
            name: ['Gimlet'], glassType: 'martini',
            ice: 3, mint: 3, rim: true, fruit: choose(['rim lemon wedge', 'lemon slice']),
            liquid: getColors(['green', 'yellow'], 100)
        },
        corpse_reviver: {
            name: ['Corpse', 'Reviver'], glassType: 'martini', ice: '3 small',
            fruit: 'lemon wedge & sinking olive', bubbles: 30, liquid: getColors(['green', 'yellow', 'yellow'], 150),
        },
        bloody_mary: {
            name: ['Bloody Mary'], glassType: 'highball',
            ice: '10 small', liquid: getColors(['red', 'red', 'red'], 255),
            fruit: 'lemon wedge', stick: 'straw', rim: true
        },
        creme_de_menthe: {
            name: ['Creme de Menthe'], glassType: 'martini',
            ice: 3, mint: 3, rim: true, fruit: choose(['lemon wedge', 'lemon slice']),
            liquid: getColors(['green', 'green', 'green'], 255)
        },

    }

    if (random() < .2) drink = { ...drink, ...choose(Object.values(drinks)) }
    // drink = { ...drink, ...drinks.mimosa }
    if (!drink.name) drink = { ...drink, ...base }
}


const drinkColors = {
    'orange': ['#EC7206', '#7B130D', '#7B130D', '#7B130D', '#F4B050'],
    'red': ['#AF260D', '#9A221B', '#D34012', '#AE4745'],
    'yellow': ['#D1A105', '#CCBB99', '#D09C02', '#F1D624',],
    'amber': ['#AE4745', '#C24B23', '#782601', '#A70603', '#C21E03',],
    'pink': ['#F58256', '#F3251A', '#D26E51', '#A74E55', '#CC6274',],
    'white': ['#AFAFA8', '#E9E9E3', '#D7D7D6', '#E9E9D7'],
    'green': ['#898E36', '#9DBC2F', '#546735', '#546735'],
    'beer': ['#E9AB0F', '#9B5B0F', '#632E00', '#160B09', '#111012'],
    'brown': ['#825228', '#784A2F', '#422519', '#BA946C'],
    'blue': ['#05B6EE', '#0257BD', '#4AC7E1', '#0257C7'],
    'purple': ['#95395C', '#967D9D', '#49487E', '#661D6D'],
    'black': ['#000000', '#000000', '#000000', '#000000'],
}

const hues = {
    'blue' : [199,253],
    'orange' : [9, 33],
    'red' : [354, 360],
    'yellow' : [41, 64],
    'amber' : [15, 30],
    'pink' : [311, 330],
    'green' : [86, 142],
    'purple' : [267, 288],
}

const colorPresets = {
    'sunrise': ['red', 'orange', 'yellow'],
    'ramzor': ['green', 'green', 'amber', 'red'],
}

function getColorFromHue(hueName) {
    return choose(drinkColors[hueName])
}

function getColors(hues, alpha = 255) {
    colors = hues.map(hue => choose(drinkColors[hue]))
    colors = colors.map(clr => color(clr))
    colors.forEach(clr => clr.setAlpha(alpha))
    return colors
}

function getRandomColors(preset) {
    let colors = []
    if (preset) {
        colors = preset.map(hueName => getColorFromHue(hueName))
    } else {
        const sumColors = new Chance({ 1: 3, 2: 2, 3: 1, 4: 1 }).get()
        const hueNames = Object.keys(drinkColors)
        hueNames.sort(() => random() - 0.5)
        colors = hueNames.slice(0, sumColors)
        colors = colors.map(hue => {
            if (hue in hues) {
                const res = []
                for (let i = 0; i < 5; i++) {
                    const h = random(hues[hue][0], hues[hue][1])
                    res.push(makeHSBColor(h, 100, 100))
                }
                return res
            } else return drinkColors[hue]
        })
        colors = colors.flat()
        colors.sort(() => random() - 0.5)
        colors = colors.slice(0, 3)
    }

    colors = colors.map(clr => color(clr))
    const alpha = random(50, 255)
    colors.forEach(clr => clr.setAlpha(alpha))
    return colors
}

function gerRandomFruit() {
    let result = choose(['cherry', 'olive', 'lemon', 'orange', 'beach ball'])

    if (['orange', 'lemon'].includes(result)) {
        result += " " + choose(['floating', 'rim', 'sinking'])
        result += " " + choose(['slice', 'wedge'])
    } else {
        result += " " + choose(['floating', 'skewed', 'sinking'])
    }
    return result
}

function makeHSBColor(h,s,b) {
    colorMode(HSB)
    const clr = color(h, s, b)
    colorMode(RGB)
    return clr
}

function setHSB(clr, h, s, b) {
    colorMode(HSB)
    const clr2 = color(h ?? hue(clr), s ?? saturation(clr), b ?? brightness(clr))
    colorMode(RGB)
    return clr2
}