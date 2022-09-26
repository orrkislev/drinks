function keyPressed() {
    const funcName = "do" + (keyCode - 48)
    if (funcName in window) {
        eval(funcName + "()")
    }
}
function startAdventure() {
    console.clear()
    adventureTitle()

    print("Its the last day of summer.\nthick clouds are forming over a blue sky.\n")
    print("You are standing in a field of tall grass.\n")
    print("You can see a forest to the north.\n")
    print("You can see a lake to the south.\n")
    print("You can see a mountain to the east.\n")
    print("You can see a desert to the west.\n")
    setDo(1, "Go to the forest", ()=>part2("forest"))
    setDo(2, "Go to the lake", ()=>part2("lake"))
    setDo(3, "Go to the mountain", ()=>part2("mountain"))
    setDo(4, "Go to the desert", ()=>part2("desert"))
}

function part2(place) {
    print("You are in the " + place + ".\nYou are sweaty from the heat.\n")
    print("You see a bar in the distance.\nYou fancy a drink.\n")
    setDo(1, "Go to the bar", startBar)
    setDo(2, "Go back to the field", ()=>startAdventure())
}
function startBar(){
    selectedBar = choose(Object.values(bars))
    print("You open the door to the bar and step inside.\nit is dark and smoky.\n")
    print("It takes a while for you eyes to adjust, but finally you can see.\n")
    print(`You find yourself in ${selectedBar.name}.\n`)

    print(`\n\nSTOP! selected your character first!\n`)
    const characterOptions = Object.values(characters).sort(_=>random(-1,1)).slice(0,2)
    setDo(1, "The "+characterOptions[0].name,()=>{selectCharacter(characterOptions[0])})
    setDo(2, "The "+characterOptions[1].name,()=>{selectCharacter(characterOptions[1])})

    
}
function selectCharacter(selectedCharacter){
    character = selectedCharacter
    print(`You are the  ${character.name}.\n${character.description}\n`)

    print(`You find yourself in ${selectedBar.name}.\n`)

    setDo(1,"Look around", ()=>{
        print(`You hear ${selectedBar.music} playing by the corner\n`)
        print(`${selectedBar.story1}\n`)

        setDo(1,"Find the bartender", bar1)
    })
    setDo(2,"Find the bartender", bar1)
}
function bar1(){
    print(`You walk to the bar, its ${selectedBar.table}\nThe ${selectedBar.bartender} is the bartender.\n`)
    print(`"${selectedBar.greeting}"\n the ${selectedBar.bartender} says.\n`)
    print(`"What can I get you?"`)

    setDo(1,`"${character.drink},please"`, ()=>bar2(character.drink))
    setDo(2,`"just a ${selectedBar.drink}"`, ()=>bar2(selectedBar.drink))
}
function bar2(drinkName){
    print(`You order a ${drinkName}.\n`)
    print(`"${drinkName}\n coming right up." says the ${selectedBar.bartender}\n\n`)

    glassDesc = ""
    if (drink.glassType == 'old fashioned') glassDesc = 'short and wide'
    else if (drink.glassType == 'highball') glassDesc = 'tall and thin'
    else if (drink.glassType == 'cocktail') glassDesc = 'festive cocktail'
    else if (drink.glassType == 'martini') glassDesc = 'wide martini'
    else if (drink.glassType == 'wine') glassDesc = 'elegant wine'
    else if (drink.glassType == 'margarita') glassDesc = 'two-tier margarita'
    print(`the bartender grabs a ${glassDesc} glass...\n`)

    setDo(1,"wait.. ",bar3)
    setDo(2,character.say1,bar3)
}
function bar3(){
    if (drink.rim) print(`the bartender rims the glass.\n`)
    if (drink.ice) print(`he adds some ice cubes to the glass.\n`)
    if (drink.mint) print(`the ${selectedBar.bartender} puts some weird leaves into the glass.\n`)
    if (drink.stick) print(`the bartender sticks a ${drink.stick} to the glass.\n`)

    setDo(1,character.say2,bar4)
    setDo(2,"but I ordered.. ",bar4)
}
function bar4(){
    print(`the ${selectedBar.bartender} pours :\n`)
    if (drink.ingredients) {
        for (const ingredient of drink.ingredients) print(`- ${ingredient}\n`)
        print('in the glass.\n')
    } else if (drink.hues) {
        for (const hue of drink.hues[0]) print(`${hue} liquid into the glass.\n`)
    }
    if (drink.top == 'foam') print(`you can see some foam on top of the glass.\n`)
    else if (drink.top == 'smoke') print(`you can see the glass is filled with smoke.\n`)
    if (drink.bubbles) print(`the drink is bubbling.\n`)
    if (drink.fruit) print(`the ${selectedBar.bartender} finishes is with a ${drink.fruit}.\n`)

    setDo(1,'take a sip',()=>{
        if (drink.name) print(`you take a sip of the ${drink.name}.\n`)
        else print(`you take a sip of the drink.\n`)

        setDo(1,"tasty!",()=>{
            print('you feel a little dizzy.\n')

            setDo(1,"uh oh",()=>{
                print('you fall down.\n')
                print('you wake up in the field.\n')
                
                setDo(1,"a field?! again?!",()=>startAdventure())
            })
        })
    })
}












function setDo(num, txt, func) {
    print("\n"+num+" - "+txt)
    window["do" + num] = () => {
        console.clear()
        adventureTitle()
        resetDos()
        func()
    }
}

function resetDos() {
    do1 = () => { }
    do2 = () => { }
}

function adventureTitle() {
    print('\n\n\n')
    print('  ╦ ╦┬┌─┐┬ ┬      ')
    print('  ╠═╣││ ┬├─┤      ')
    print('  ╩ ╩┴└─┘┴ ┴      ')
    print('╔═╗┌─┐┬┬─┐┬┌┬┐┌─┐┬')
    print('╚═╗├─┘│├┬┘│ │ └─┐│')
    print('╚═╝┴  ┴┴└─┴ ┴ └─┘o')
    print('\n\n\n')
}



const characters = {
    drunk: {
        name: "drunk", description: "",
        drink: "whatever is on tap", 
        say1: "aahaugg....", say2:"but fella, please.."
    },
    musician: {
        name: "musician", description: "",
        drink: "Rum and Coke",
        say1: "hey man, listen..", say2: "rock on!"
    },
    seargent:{
        name: "seargent", description: "",
        drink: "warm beer",
        say1: "soldier! stop -", say2: "did you hear what - "
    },
    scientist:{
        name: "scientist", description: "",
        drink: "root beer",
        say1: "um.. in my lab, we use..", say2: "I'm not sure, but I think.."
    },
}

const bars = {
    medieval : {
        name: "medieval bar", bartender: "ogre",
        music: "a bard playing a lute", story1: "some dwarves are playing a game of chess.",
        table: "a simple wooden table.",
        greeting: "Ugh-bugh, stranger",
        drink: "mug of grog",
    },
    speakeasy : {
        name: "1920s speakeasy bar", bartender: "man with the most magnificent moustache you've ever seen",
        music: "a jazz band", story1: "some men in suits playing a game of poker.",
        table: "a long wood and glass bar, with lights.",
        greeting: "Good day, sir",
        drink: "Gin Rickey",
    },
    eighties:{
        name: "1980s bar in west berlin", bartender: "young woman with a mohawk",
        music: "jukebox with german rock", story1: "some teenagers are playing at an arcade machine.",
        table: "a stack of boxes with a carpet on them.", greeting: "Fremden, grüßen.",
        drink: "pilsner",
    },
    // british:{
    //     name: "british pub", bartender: "wrinkly old ginger man",
    //     music: "pianist, collecting coins,", story1: "some young men "
    // }
}


