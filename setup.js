let PS = 1
async function setup() {
    const ratio = 594 / 841
    if (window.innerWidth / window.innerHeight > ratio) canvas = createCanvas(round(window.innerHeight * ratio), round(window.innerHeight))
    else canvas = createCanvas(round(window.innerWidth), round(window.innerWidth / ratio))
    paperCanvas = document.getElementById('paperCanvas');
    paperCanvas.width = width;
    paperCanvas.height = height
    PS = width / 611
    paper.setup(paperCanvas);

    view = paper.view;

    noiseSeed(round_random(100000))

    canvas.elt.style.display = 'block';
    paperCanvas.style.display = 'none';

    noLoop()
    angleMode(DEGREES)
    activeGraphics = this

    startAdventure()
    await makeImage()
}

function preload(){
    distortShader = loadShader('shaders/shader.vert', 'shaders/distort.frag')
    blurShader = loadShader('shaders/shader.vert', 'shaders/blur.frag')
    bgShader = loadShader('shaders/shader.vert', 'shaders/bg.frag')
    cloudsShader = loadShader('shaders/shader.vert', 'shaders/clouds.frag')
    flareShader = loadShader('shaders/shader.vert', 'shaders/flare.frag')
    shaderGraphics = createGraphics(100,100, WEBGL)
    shaderGraphics.noStroke()
    shaderGraphics.pixelDensity(1)
    // shaderGraphics.setAttributes('antialias', true);
    // shaderGraphics.smooth()
    myFont = loadFont('fonts/Dazzle-Solid.otf')
}

function applyShader(shdr,img){
    if (!img) img = get()
    shaderGraphics.resizeCanvas(img.width, img.height)
    shaderGraphics.shader(shdr)
    shdr.setUniform('tex0', img)
    shdr.setUniform('time', random(1000))
    shaderGraphics.rect(-img.width / 2, -img.height / 2, img.width, img.height)
    return shaderGraphics
}