
#include <common>

// shortcut to sample texture
#define TEX(uv) texture(iChannel0, uv).r
#define TEX1(uv) texture(iChannel1, uv).r
#define TEX2(uv) texture(iChannel2, uv).r
#define TEX3(uv) texture(iChannel3, uv).r


// shorcut for smoothstep uses
#define trace(edge, thin) smoothstep(thin,.0,edge)
#define ss(a,b,t) smoothstep(a,b,t)

 
uniform vec3 iResolution;
uniform vec3 iMouse;
uniform float iTime;
uniform float iTimeDelta;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;

float TILESIZEx = 8.0;
float TILESIZEy = 4.0;

vec4 texture3D(sampler2D imageTexture,vec3 selector){
float ticker = 32.0*mod(selector.z,1.0);//0->32 float
float tickerFloor = floor(ticker);//0->32 int
float tickerCeil = ceil(ticker);//0->32 int

float xOffset = mod(ticker,TILESIZEx);//0->8
float xOffsetFloor = mod(tickerFloor,TILESIZEx);//0->8
float xOffsetCeil = mod(tickerCeil,TILESIZEx);//0->8
float yOffset = (ticker/TILESIZEx);//0->4
float yOffsetFloor = floor(tickerFloor/TILESIZEx);//0->4
float yOffsetCeil = floor(tickerCeil/TILESIZEx);//0->4

vec2 uvB = vec2((xOffsetFloor+selector.x)/TILESIZEx,(yOffsetFloor+selector.y)/TILESIZEy);//lower image in stack
uvB = mod(uvB+1.,2.0)-1.; //allow repeating by only taking the remainder
uvB = 0.5*(uvB+1.);//convert (-1 -> +1) range to (0->1) range 

vec2 uvT = vec2((xOffsetCeil+selector.x)/TILESIZEx,(yOffsetCeil+selector.y)/TILESIZEy);//lower image in stack
uvT = mod(uvT+1.,2.0)-1.; //allow repeating by only taking the remainder
uvT = 0.5*(uvT+1.);//convert (-1 -> +1) range to (0->1) range 

// vec2 uvT = vec2((xOffsetCeil+selector.x)/TILESIZEx,(yOffsetCeil+selector.y)/TILESIZEy);//upper image in stack
vec4 bottomImage = texture2D(imageTexture,uvB);//lower image in stack
vec4 topImage = texture2D(imageTexture,uvT);//upper image in stack
vec4 finImage = mix(bottomImage,topImage,ticker-tickerFloor);//data at 3d point

vec3 selectorMod = mod(selector+1.,2.)-1.;//make texture repeat when uv goes past edges
vec2 testUv = vec2(.5*(selectorMod.x+1.),.5*(selectorMod.y+1.));
vec4 testImage = texture2D(imageTexture,testUv);
return finImage;
}

//////////////////////////////////////////////////////////
// Liquid toy by Leon Denise 2022-05-18
// Playing with shading with a fake fluid heightmap

const float speed = .01;
const float scale = .3;
const float falloff = 3.;
const float fade = .4;
const float strength = 1.;
const float range = 5.;

varying vec2 vUv;

// fractal brownian motion (layers of multi scale noise)
vec3 fbm(vec3 p)
{
    vec3 result = vec3(0);
    float amplitude = .5;
    for (float index = 0.; index < 3.; ++index)
    {
        result += texture3D(iChannel0, p/amplitude).xyz * amplitude;
        amplitude /= falloff;
    }

    return result;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{

    // coordinates
    vec2 uv = (fragCoord.xy - iResolution.xy / 2.)/iResolution.y;
    
    // noise
    vec3 spice = fbm(vec3(uv*scale,iTime*speed));
    vec3 spice2 = fbm(vec3(uv*scale,iTime*speed));
    
    // draw circle at mouse or in motion
    float t = iTime*2.;
    vec2 mouse = (iMouse.xy - iResolution.xy / 2.)/iResolution.y;
    if (iMouse.z > .5) uv -= mouse;
    else uv -= vec2(cos(t),sin(t))*.3;
    float paint = trace(length(uv),.1);
    float paint2 = trace(length(uv),.1/1.30);
    
    // expansion
    vec2 offset = vec2(0);
    uv = fragCoord.xy / iResolution.xy;
    vec4 data = texture(iChannel1, uv);
    vec3 unit = vec3(range/iResolution.xy,0);
    vec3 normal = normalize(vec3(
        TEX1(uv - unit.xz)-TEX1(uv + unit.xz),
        TEX1(uv - unit.zy)-TEX1(uv + unit.zy),
        data.x*data.x)+.001);
    offset -= normal.xy;
    
    // turbulence
    spice.x *= 6.28*2.;
    spice.x += iTime;
    offset += vec2(cos(spice.x),sin(spice.x));
    
    // sample buffer
    vec4 frame = texture(iChannel1, uv + strength * offset / iResolution.xy);
    
    // temporal fading buffer
    //paint = max(paint, frame.x - iTimeDelta * fade);
    
    // print result
    // fragColor = vec4(clamp(paint, 0., 1.));
    // fragColor = vec4(min(max(paint2, 0.), 1.));
    // fragColor = vec4(spice,1.0);
    uvec3 testIn = uvec3(fragCoord,60.0*iTime);
    // fragColor = vec4(noiseTexGen3D(testIn),1.0);
    fragColor = vec4(vec3(paint2),1.0);
}
//////////////////////////////
 

     
    void main() {
      mainImage(gl_FragColor, gl_FragCoord.xy);
      // mainImage(gl_FragColor, vUv*iResolution.xy);
    }
    
