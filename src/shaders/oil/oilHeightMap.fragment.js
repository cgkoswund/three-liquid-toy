const fragmentShader = `
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
uniform float iTime;
uniform float iTimeDelta;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;


/////////////////////////////////////////////////////////////////
// 2017 Inigo Quilez

// Based on https://www.shadertoy.com/view/4tfyW4, but simpler and faster
//
// See these too: 
//
// - https://www.shadertoy.com/view/llGSzw
// - https://www.shadertoy.com/view/XlXcW4
// - https://www.shadertoy.com/view/4tXyWN
//
// Not testes for uniformity, stratification, periodicity or whatever. Use (or not!) at your own risk


  const uint k = 1103515245U;  // GLIB C
//const uint k = 134775813U;   // Delphi and Turbo Pascal
//const uint k = 20170906U;    // Today's date (use three days ago's dateif you want a prime)
//const uint k = 1664525U;     // Numerical Recipes

vec3 noiseTexGen3D( uvec3 x )
{
    x = ((x>>8U)^x.yzx)*k;
    x = ((x>>8U)^x.yzx)*k;
    x = ((x>>8U)^x.yzx)*k;
    
    return vec3(x)*(1.0/float(0xffffffffU));
}

// void custom3DNoise(/*used to be main*/)
// {
    // uvec3 p = uvec3(fragCoord, iFrame);
    
    // fragColor = vec4( hash(p), 1.0 );
// }
//////////////////////////////////////////////////////////
// Liquid toy by Leon Denise 2022-05-18
// Playing with shading with a fake fluid heightmap

const float speed = .01;
const float scale = .1;
const float falloff = 3.;
const float fade = .4;
const float strength = 1.;
const float range = 5.;

vec3 iMouse = vec3(0.0,0.0,0.0);
varying vec2 vUv;

// Precision-adjusted variations of https://www.shadertoy.com/view/4djSRW
float hash(float p) { p = fract(p * 0.011); p *= p + 7.5; p *= p + p; return fract(p); }
float hash(vec2 p) {vec3 p3 = fract(vec3(p.xyx) * 0.13); p3 += dot(p3, p3.yzx + 3.333); return fract((p3.x + p3.y) * p3.z); }

float noise(vec3 x) {
    const vec3 step = vec3(110, 241, 171);

    vec3 i = floor(x);
    vec3 f = fract(x);
 
    // For performance, compute the base input to a 1D hash from the integer part of the argument and the 
    // incremental change to the 1D based on the 3D -> 1D wrapping
    float n = dot(i, step);

    vec3 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix( hash(n + dot(step, vec3(0, 0, 0))), hash(n + dot(step, vec3(1, 0, 0))), u.x),
                   mix( hash(n + dot(step, vec3(0, 1, 0))), hash(n + dot(step, vec3(1, 1, 0))), u.x), u.y),
               mix(mix( hash(n + dot(step, vec3(0, 0, 1))), hash(n + dot(step, vec3(1, 0, 1))), u.x),
                   mix( hash(n + dot(step, vec3(0, 1, 1))), hash(n + dot(step, vec3(1, 1, 1))), u.x), u.y), u.z);
}

// fractal brownian motion (layers of multi scale noise)
vec3 fbm(vec3 p)
{
    vec3 result = vec3(0);
    vec3 result2 = vec3(0);
    float amplitude = 0.5;
     uvec3 testIn2 = uvec3(abs(p));//,p.y,p.z);
     uvec3 testIn3 = uvec3(abs(p));//,p.y,p.z);
    for (float index = 0.; index < 3.; ++index)
    {
        result += vec3(noise(p/(5.0*amplitude)),noise(p/amplitude),noise(p/(0.5*amplitude))) * amplitude;
        // result += texture(iChannel0, p/amplitude).xyz * amplitude;
        amplitude /= falloff;
    }
    result2 = noiseTexGen3D(testIn2);
    return result2;
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
    paint = max(paint, frame.x - iTimeDelta * fade);
    
    // print result
    // fragColor = vec4(clamp(paint, 0., 1.));
    // fragColor = vec4(spice,1.0);
    uvec3 testIn = uvec3(fragCoord,60.0*iTime);
    // fragColor = vec4(noiseTexGen3D(testIn),1.0);
    fragColor = vec4(spice2,1.0);
}
//////////////////////////////
 

     
    void main() {
      mainImage(gl_FragColor, gl_FragCoord.xy);
      // mainImage(gl_FragColor, vUv*iResolution.xy);
    }
    `;

export default fragmentShader;
