async function setup() {
    const ratio = 594 / 841
    if (window.innerWidth / window.innerHeight > ratio) canvas = createCanvas(window.innerHeight * ratio, window.innerHeight)
    else canvas = createCanvas(window.innerWidth, window.innerWidth / ratio)
    paperCanvas = document.getElementById('paperCanvas');
    paperCanvas.width = width;
    paperCanvas.height = height
    pixelSize = width / 1000
    paper.setup(paperCanvas);

    view = paper.view;

    noiseSeed(round_random(100000))

    toggleCanvas('p5')

    noLoop()
    angleMode(DEGREES)
    activeGraphics = this

    await makeImage()
}

function toggleCanvas(t){
    if (t=='paper'){
        canvas.elt.style.display = 'none';
        paperCanvas.style.display = 'block';
    } else {
        canvas.elt.style.display = 'block';
        paperCanvas.style.display = 'none';
    }
}


function preload(){
    distortShader = loadShader('shaders/shader.vert', 'shaders/distort.frag')
    blurShader = loadShader('shaders/shader.vert', 'shaders/blur.frag')
    bgShader = loadShader('shaders/shader.vert', 'shaders/bg.frag')
    shaderGraphics = createGraphics(100,100, WEBGL)
    shaderGraphics.noStroke()
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