precision mediump float;

uniform sampler2D tex0;
uniform vec2 resolution;
uniform float time;
uniform vec3 color1;
uniform vec3 color2;
varying vec2 vTexCoord;

vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec2 P){
  P = P + time;
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, 289.0);
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0;
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);
  vec4 norm = 1.79284291400159 - 0.85373472095314 * 
    vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

vec4 blur(sampler2D image, vec2 uv, float r){
    float pixelX = 1.0 / resolution.x;
    float pixelY = 1.0 / resolution.y;
    vec4 color = vec4(0.0);
    float total = 0.0;
    for (float i = -1.0; i <= 1.0; i += 0.1){
        for (float j = -1.0; j <= 1.0; j += 0.1){
            vec2 texCoord = uv + vec2(i * r * pixelX, j * r * pixelY);
            color += texture2D(image, texCoord);
            total += 1.0;
        }
    }
    return color / total;
}

void main() {
  vec2 uv = vTexCoord;
  uv.y = 1.0 - uv.y;

  
  float curtain = cnoise(vec2(uv.x*uv.x*7.0, uv.y)) * .8;
  float x = fract(uv.x*100.0) * 5.0;
  float strips = cnoise(vec2(x-curtain*3.0, uv.y+x)) * .8;

  float val = strips + curtain / 5.0;
  vec3 res = mix(color1,color2,vec3(val));


  vec4 origTex = blur(tex0,vec2(uv.x-val/60.0,uv.y-val/30.0),(1.0-val)*3.0);
  if (origTex.a>0.0) 
    res = mix(res,vec3(0),origTex.a/2.0);

  gl_FragColor = vec4(res, 1.0);
}