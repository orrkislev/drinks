function initDrink() {
    resetRandom()
    drink = {
        glassType: 'old fashioned', frost: 0,
        glassRidges: random() < .7 ? 0 : round_random(15, 30),
        bubbles: false, ice: 0, mint: false, fruit: false,
        stick: false,
        top: false,
        rim: false,
    }
    const base = {
        glassType: choose(['highball', 'old fashioned', 'martini', 'wine', 'margarita', 'cocktail']),
        frost: random() ** 2,
        bubbles: random() < 0.5 ? false : random(30, 500),
        ice:   random() < 0.5 ? 0 : round_random(1, 4),
        top:   random() < 0.5 ? false : choose(['foam', 'bubbles', 'smoke']),
        mint:  random() < 0.5 ? false : choose(['','floating ']) + round_random(1, 4),
        stick: random() < 0.5 ? false : choose(['straw', 'stirrer', 'umbrella']), 
        fruit: random() < 0.5 ? false : gerRandomFruit(),
        rim:   random() < 0.2,
    }
    drinks = {
        manhattan: {
            glassType: 'old fashioned',
            ice: 1, bubbles: 30,
            stick: 'stirrer', fruit: 'skewed cherry',
            liquid: [color('#c8691c55'), color('#dc571355')],
            top: random() < 0.5 ? false : 'smoke',
            name: ['Manhattan'],
            ingredients: ['rye', 'sweet vermouth', 'bitters'],
        },
        old_fashioned: {
            glassType: 'old fashioned',
            frost: random(.5), ice: choose([1, 2]), bubbles: 30, fruit: 'floating olive',
            liquid: [color('#c8691c'), color('#dc5713')],
            name: ['Old Fashioned'],
            ingredients: ['rye', 'simple syrup', 'bitters'],
        },
        negroni: {
            name: ['Negroni'], glassType: 'old fashioned',
            frost: random(), ice: choose(['1 large', 3]),
            fruit: choose(['orange peel', 'orange slice', 'orange wedge']),
            hues: [['red', 'amber', 'amber'], 255],
            ingredients: ['gin', 'campari', 'sweet vermouth'],
        },
        gin_tonic: {
            name: ['Gin & Tonic'], glassType: choose(['highball', 'old fashioned']),
            frost: random(), bubbles: 150,
            ice: 5, fruit: 'lemon wedge',
            hues: [['white', 'white'], 25],
            ingredients: ['gin and tonic'],
        },
        scotch: {
            glassType: 'old fashioned', name: ['Scotch Whiskey', 'Neat'], frost: random(),
            hues: [['orange', 'amber'], 35],
            ingredients: ['scotch'],
        },

        cosmopolitan: {
            name: ['COSMOPOLITAN'], glassType: 'martini',
            frost: random(.2), ice: 3, mint: 3, fruit: 'lemon',
            liquid: [color('#dd2d4a'), color('#ff99ac')],
            ingredients: ['vodka', 'triple sec', 'cranberry juice', 'lime juice'],
        },
        watermelon_margarita: {
            name: ['watermelon', 'margarita'], glassType: 'margarita',
            frost: random(.2), ice: '30 crushed', mint: 3, bubbles: '50 seeds',
            rim: true, fruit: 'lemon', stick: 'straw',
            liquid: [color('#dd2d4a'), color('#ff99ac')],
            ingredients: ['tequila', 'triple sec', 'lime juice', 'watermelon juice'],
        },
        tequila_sunrise: {
            name: ['tequila', 'sunrise'], glassType: choose(['highball', 'cocktail']),
            frost: random(.2), ice: 3, stick: 'umbrella',
            fruit: 'floating cherry & lemon',
            hues: [['red', 'yellow', 'orange'], 255],
            ingredients: ['tequila', 'orange juice', 'grenadine'],
        },
        mojito: {
            name: ['mojito'], glassType: 'highball',
            frost: random(.5, 1), ice: 15, mint: 10,
            fruit: 'lemon', stick: 'straw',
            liquid: [color('#befc0355'), color('#B7BB6955'), color('#fffd8a22')],
            ingredients: ['white rum', 'simple syrup', 'lime juice', 'mint'],
        },
        irish_coffee: {
            name: ['Irish Coffee'], glassType: choose(['highball', 'cocktail']),
            stick: choose([false, 'stirrer']),
            fruit: choose([false, 'rim cherry']), top: 'foam',
            hues: [['black', 'brown', 'brown', 'brown', 'brown', 'brown', 'white'], 255],
            ingredients: ['whiskey', 'coffee', 'simple syrup', 'cream'],
        },
        martini: {
            name: ['Martini'], glassType: 'martini',
            stick: 'stirrer', frost: random(),
            hues: [['white', 'yellow'], 10],
            fruit: choose(['lemon peel', 'skewed olive', 'sinking olive']),
            ingredients: ['gin', 'dry vermouth'],
        },
        painkiller: {
            name: ['Painkiller'], glassType: 'cocktail',
            mint: 5, ice: '10 small',
            fruit: choose('orange slice', 'orange wedge'),
            hues: [['orange', 'yellow', 'yellow', 'yellow', 'yellow', 'white'], 255],
            ingredients: ['rum', 'orange juice', 'pineapple juice', 'coconut cream'],
        },
        rum_punch: {
            glassType: 'cocktail', name: ['Rum Punch'], frost: random(),
            ice: 3, stick: 'straw', fruit: choose(['floating cherry', 'rim cherry', 'sinking cherry']),
            hues: [['red', 'yellow', 'orange'], 255],
            ingredients: ['rum', 'pineapple juice', 'orange juice', 'grenadine'],
        },
        shirly_temple: {
            glassType: 'highball', name: ['Shirly Temple'], frost: random(),
            hues: [['pink', 'red', 'pink'], 50],
            ice: "10 small", mint: 3, fruit: choose(['rim cherry', 'floating cherry']),
            stick: choose(['stirrer', 'umbrella', 'straw']),
            ingredients: ['ginger ale', 'grenadine', 'lime juice'],
        },
        hot_toddy: {
            glassType: 'highball', name: ['Hot Toddy'], top: 'smoke',
            fruit: 'lemon slice', hues: [['amber', 'yellow'], 255],
            stick: choose([false, 'stirrer']),
            ingredients: ['whiskey', 'lemon juice', 'honey', 'hot water'],
        },
        pickleback: {
            glassType: choose(['old fashioned', 'highball']), name: ['Pickleback'], frost: random(),
            hues: [['green', 'green'], 30], fruit: 'pickle slice',
            ingredients: ['whiskey', 'pickle brine'],
        },
        jalapeno_margarita: {
            name: ['Jalapeño', 'Margarita'], glassType: 'old fashioned',
            ice: 3, mint: 10, rim: true, fruit: choose(['lemon slice', 'lemon wedge']),
            hues: [['green', 'yellow'], 100],
            ingredients: ['tequila', 'triple sec', 'simple syrup', 'jalapeño'],
        },
        gin_fizz: {
            glassType: 'highball', name: ['Gin Fizz'], frost: random(.5, 1),
            foam: true, fruit: choose([false, 'lemon wedge']), bubbles: 200,
            hues: [['white', 'yellow'], 35],
            ingredients: ['gin', 'lemon juice', 'simple syrup', 'egg white', 'club soda']
        },
        kir_royale: {
            name: ['Kir Royale'], glassType: 'wine', fruit: 'floating cherry',
            hues: [['red', 'red'], 25],
            ingredients: ['champagne', 'crème de cassis'],
        },
        campari_spritz: {
            name: ['Campari', 'Spritz'], glassType: 'highball', stick:'stirrer',
            ice: 3, mint: 3, rim: true, fruit: "skewed olive & "+choose(['orange wedge', 'orange slice']),
            hues: [['red', 'pink'], 60],
            ingredients: ['campari', 'prosecco', 'club soda'],
        },
        penicillin: {
            name: ['Penicillin'], glassType: 'old fashioned',
            ice: "2 large", fruit: 'lemon peel', bubbles: 100,
            hues: [['white', 'yellow'], 60],
            ingredients: ['scotch', 'lemon juice', 'honey-ginger syrup'],
        },
        espresso_tonic: {
            name: ['Espresso & Tonic'], glassType: 'highball',
            hues: [['white', 'brown'], 70],
            fruit: 'lemon wedge', ice: '10 small', stick: 'straw',
            ingredients: ['espresso', 'tonic water'],
        },
        whiskey_sour: {
            name: ['Whiskey Sour'], glassType: 'old fashioned',
            ice: 3, mint: 2, hues: [['yellow', 'orange'], 255], bubbles: 100,
            fruit: choose(['floating cherry & orange slice', 'rim cherry & orange wedge']),
            ingredients: ['whiskey', 'lemon juice', 'simple syrup', 'egg white'],
        },
        pisco_sour: {
            name: ['Pisco Sour'], glassType: choose(['wine', 'martini']), foam: true,
            frost: random(), hues: [['yellow', 'white'], 100], bubbles: 100,
            fruit: choose(['lemon wedge', 'lemon slice']),
            ingredients: ['pisco', 'lemon juice', 'simple syrup', 'egg white'],
        },
        tom_collins: {
            name: ['Tom Collins'], glassType: 'highball', ice: 6,
            hues: [['white', 'white'], 70], bubbles: 100, stick: 'stirrer',
            fruit: 'orange slice & skewed cherry',
            ingredients: ['gin', 'lemon juice', 'simple syrup', 'club soda'],
        },
        french_75: {
            name: ['French 75'], glassType: choose(['wine', 'martini']),
            fruit: 'lemon peel', hues: [['yellow', 'yellow', 'yellow'], 50],
            bubbles: 200,
            ingredients: ['gin', 'lemon juice', 'simple syrup', 'champagne'],
        },
        paloma: {
            name: ['Paloma'], glassType: 'highball',
            ice: '15 crushed', hues: [['pink', 'orange'], 50],
            fruit: 'orange slice', bubbles: 100, rim: true,
            ingredients: ['tequila', 'lime juice', 'grapefruit soda', 'agave nectar'],
        },
        gold_rush: {
            name: ['Gold Rush'], glassType: 'old fashioned',
            ice: '1 large', hues: [['yellow', 'orange', 'yellow'], 40],
            fruit: 'lemon peel & wedge', rim: true,
            ingredients: ['bourbon', 'lemon juice', 'honey syrup'],
        },
        caipirinha: {
            name: ['Caïpirinha'], glassType: 'old fashioned',
            ice: 4, hues: [['white', 'green'], 50], mint: 10,
            fruit: 'lemon wedge',
            ingredients: ['cachaça', 'lime juice', 'simple syrup'],
        },
        pina_colada: {
            name: ['Piña Colada'], glassType: 'cocktail',
            ice: '15 crushed', hues: [['white', 'yellow','white', 'yellow'], 255],
            stick: 'umbrella', fruit: 'floating cherry', rim: true,
            ingredients: ['rum', 'pineapple juice', 'coconut cream'],
        },
        hemmingway: {
            name: ['Hemmingway', 'Dacquiri'], glassType: 'martini',
            fruit: 'lemon slice', bubbles: 100, hues: [['pink', 'white', 'pink'], 120],
            ingredients: ['rum', 'maraschino liqueur', 'lime juice', 'grapefruit juice'],
        },
        vieux_carre: {
            name: ['Vieux Carré'], glassType: 'old fashioned',
            ice: 3, hues: [['amber', 'amber'], 50],
            fruit: 'lemon peel slice',
            ingredients: ['rye whiskey', 'cognac', 'sweet vermouth', 'benedictine', 'punt e mes'],
        },
        fjellbekk: {
            name: ['Fjellbekk'], glassType: 'highball',
            ice: '10 small', hues: [['white', 'yellow'], 25],
            fruit: 'lemon wedge', bubbles: 100, rim: random() < 0.5,
            ingredients: ['aquavit', 'vodka', 'lemon juice', 'club soda'],
        },
        mimosa: {
            name: ['Mimosa'], glassType: 'wine',
            ice: '3 crushed', hues: [['orange', 'yellow'], 255],
            fruit: 'orange slice && rim cherry', bubbles: 100,
            ingredients: ['champagne', 'orange juice'],
        },
        moscow_mule: {
            name: ['Moscow Mule'], glassType: 'highball',
            ice: '10 small', hues: [['white', 'yellow', 'yellow'], 100],
            fruit: 'lime wedge', mint: 10, stick: 'straw',
            ingredients: ['vodka', 'lime juice', 'ginger beer'],
        },
        merlot: {
            name: ['Merlot'], glassType: 'wine', hues: [['purple', 'red'], 255],
            ingredients: ['merlot'],
        },
        aperol_spritz: {
            name: ['Aperol Spritz'], glassType: 'margarita',
            ice: 3, mint: 3, rim: true, fruit: choose(['orange wedge', 'orange slice']),
            hues: [['red', 'pink'], 150], stick: 'straw',
            ingredients: ['aperol', 'prosecco', 'club soda'],
        },
        mai_tai: {
            name: ['Mai Tai'], glassType: choose(['old fashioned', 'cocktail']),
            ice: '10 crushed', mint: 10, fruit: choose(['lemon slice', 'lemon wedge']) + " & cherry",
            hues: [['yellow', 'yellow', 'yellow', 'red'], 150], stick: 'umbrella',
            ingredients: ['rum', 'orange curaçao', 'lime juice', 'orgeat syrup'],
        },
        gimlet: {
            name: ['Gimlet'], glassType: 'martini',
            ice: 3, mint: 3, rim: true, fruit: choose(['rim lemon wedge', 'lemon slice']),
            hues: [['yellow', 'white'], 30],
            ingredients: ['gin', 'lime juice', 'simple syrup'],
        },
        corpse_reviver: {
            name: ['Corpse', 'Reviver'], glassType: 'martini', ice: '3 small',
            fruit: 'lemon wedge & sinking olive', bubbles: 30, hues: [['green', 'yellow', 'yellow'], 150],
            ingredients: ['gin', 'lemon juice', 'dry vermouth', 'cointreau', 'absinthe'],
        },
        grasshopper: {
            name: ['Grasshopper'], glassType: 'martini',
            ice: 3, mint: 3, rim: true,
            hues: [['green', 'green', 'green'], 255],
            ingredients: ['creme de menthe', 'creme de cacao', 'cream'],
        },

    }

    if (random() < 0.38) {
        chance = new Chance({})
        Object.keys(drinks).forEach(drinkName => chance.add(drinkName, 1))
        for (let i = 0; i < 5; i++) chance.add(Object.keys(drinks)[i], 2)
        selectedDrink = drinks[chance.get()]
        drink = { ...drink, ...selectedDrink }
    }
    // drink = { ...drink, ...drinks.hemmingway }
    
    if (drink.hues && !drink.liquid) drink.liquid = drink.hues[0].map(h => getColorFromHueName(h, drink.hues[1]))
    if (!drink.name) {
        drink = { ...drink, ...base }
        if (random() < 0.2) {
            const hue = choose(['amber', 'yellow'])
            drink.hues  = [[hue, hue], hue==='amber' ? 25 : 100]
            drink.liquid = drink.hues[0].map(h => getColorFromHueName(h, drink.hues[1]))
            if (hue == 'yellow') drink.top = 'foam'
        } else setRandomColors()
    }
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
    'blue': [199, 253],
    'orange': [9, 33],
    'red': [354, 360],
    'yellow': [41, 64],
    'amber': [15, 30],
    'pink': [311, 330],
    'green': [86, 142],
    'purple': [267, 288],
}

function getColorFromHueName(hueName, alfa = 255) {
    let clr
    if (hueName in hues) {
        const h = random(hues[hueName][0], hues[hueName][1])
        colorMode(HSB, 360, 100, 100, 255)
        clr = color(h, 100, 80, alfa)
        colorMode(RGB, 255, 255, 255, 255)
    } else {
        clr = color(choose(drinkColors[hueName]))
        clr.setAlpha(alfa)
    }
    return clr
}

function setRandomColors() {
    const sumColors = new Chance({ 1: 3, 2: 2, 3: 1, 4: 1 }).get()
    const hueNames = Object.keys(drinkColors)
    hueNames.sort(() => random() - 0.5)

    const alpha = random(50, 255)
    drink.hues = [hueNames.slice(0, sumColors), alpha]
    const colors = []
    for (let i = 0; i <= sumColors; i++) colors.push(getColorFromHueName(hueNames[i], alpha))
    drink.liquid = colors
}

function gerRandomFruit() {
    let result = choose(['cherry', 'olive', 'lemon', 'orange', 'beach ball', 'shrimp'])

    if (['orange', 'lemon'].includes(result)) {
        result += " " + choose(['floating', 'rim', 'sinking'])
        result += " " + choose(['slice', 'wedge'])
    } else {
        result += " " + choose(['floating', 'skewed', 'sinking'])
    }
    if (random() < 0.05) result = 'pobble'
    return result
}