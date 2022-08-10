function initDrink() {
    drink = {
        glassType: choose(['highball', 'old fashioned', 'martini', 'wine']),
        frost: Math.floor(random(3)) / 2,
        glassRidges: random() < 0.5 ? 0 : round_random(15, 30),
        bubbles: random() < 0.5 ? false : random(30, 200),
        ice: random() < 0.5 ? 0 : round_random(1, 4),
        foam: random() < 0.5,
        mint: random() < 0.5,
        toothPick: random() < 0.5,
        cherry: random()<.5 ? false : choose(['floating','skewed']),
        liquid: [
            color(random(360), 100, 100),
            color(random(360), 100, 100)]
    }
    drinks = {
        manhattan: {
            glassType: 'old fashioned',
            glassRidges: 0,
            frost: 0, ice: 1, mint: false, foam: false, bubbles: 30,
            toothPick: true, cherry: 'skewed',
            liquid: ['#c8691c', '#dc5713'],
        },
        cosmopolitan: {
            glassType: 'martini',
            glassRidges: 0,
            frost: random(.2), ice: 3, mint: true, foam: false, bubbles: 0,
            toothPick: false, cherry: false,
            lemon: true,
            liquid: ['#dd2d4a', '#ff99ac'],
        }
    }



    // drink = { ...drink, ...drinks.cosmopolitan }
}