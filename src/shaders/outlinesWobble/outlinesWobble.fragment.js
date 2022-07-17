const fragmentShader = `
#include <common>
 
uniform vec3 iResolution;
uniform float iTime;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;

varying vec2 vUv;

// #define TIMESCALE 0.25 
// #define TILES 8
// #define COLOR 0.7, 1.6, 2.8
 
// void mainImage( out vec4 fragColor, in vec2 fragCoord )
// {
//     vec2 uv = fragCoord.xy / iResolution.xy;
//     uv.x *= iResolution.x / iResolution.y;
 
//     vec4 noise = texture2D(iChannel0, floor(uv * float(TILES)) / float(TILES));
//     float p = 1.0 - mod(noise.r + noise.g + noise.b + iTime * float(TIMESCALE), 1.0);
//     p = min(max(p * 3.0 - 1.8, 0.1), 2.0);
 
//     vec2 r = mod(uv * float(TILES), 1.0);
//     r = vec2(pow(r.x - 0.5, 2.0), pow(r.y - 0.5, 2.0));
//     p *= 1.0 - pow(min(1.0, 12.0 * dot(r, r)), 2.0);
 
//     fragColor = vec4(COLOR, 1.0) * p;
// }

#define EdgeColor vec4(0.2, 0.2, 0.15, 1.0)
#define BackgroundColor vec4(1.0/1.2,0.95/1.2,0.85/1.2,1)
#define NoiseAmount 0.01
#define ErrorPeriod 30.0
#define ErrorRange 0.003

// Reference: https://www.shadertoy.com/view/MsSGD1
float triangle(float x)
{
	return abs(1.0 - mod(abs(x), 2.0)) * 2.0 - 1.0;
}

float rand(float x)
{
    return fract(sin(x) * 43758.5453);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    float time = floor(iTime * 16.0) / 16.0;
    vec2 uv = fragCoord.xy / iResolution.xy;
    uv += vec2(triangle(uv.y * rand(time) * 1.0) * rand(time * 1.9) * 0.005,
			triangle(uv.x * rand(time * 3.4) * 1.0) * rand(time * 2.1) * 0.005);
    
    float noise = (texture2D(iChannel1, uv * 0.5).r - 0.5) * NoiseAmount;
    vec2 uvs[3];
    uvs[0] = uv + vec2(ErrorRange * sin(ErrorPeriod * uv.y + 0.0) + noise, ErrorRange * sin(ErrorPeriod * uv.x + 0.0) + noise);
    uvs[1] = uv + vec2(ErrorRange * sin(ErrorPeriod * uv.y + 1.047) + noise, ErrorRange * sin(ErrorPeriod * uv.x + 3.142) + noise);
    uvs[2] = uv + vec2(ErrorRange * sin(ErrorPeriod * uv.y + 2.094) + noise, ErrorRange * sin(ErrorPeriod * uv.x + 1.571) + noise);
    
    float edge = texture2D(iChannel0, uvs[0]).r * texture2D(iChannel0, uvs[1]).r * texture2D(iChannel0, uvs[2]).r;
  	float diffuse = texture2D(iChannel0, uv).g;
    
	float w = fwidth(diffuse) * 2.0;
	vec4 mCol = mix(BackgroundColor , BackgroundColor* 0.5, mix(0.0, 1.0, smoothstep(-w, w, diffuse - 0.3)));
	fragColor = mix(EdgeColor, mCol, edge);
    // fragColor = texture2D(iChannel0,uv);
    //fragColor = vec4(diffuse);
}
     
    void main() {
      mainImage(gl_FragColor, gl_FragCoord.xy);
      // mainImage(gl_FragColor, vUv*iResolution.xy);
    }
    `;

export default fragmentShader;
