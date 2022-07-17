const fragmentShader = `
#include <common>
 
uniform vec3 iResolution;
uniform float iTime;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;
uniform sampler2D shadowSaved;

varying vec2 vUv;

#define Sensitivity (vec2(0.3, 1.5) * iResolution.y / 400.0)

float checkSame(vec4 center, vec4 samplef)
{
    vec2 centerNormal = center.xy;
    float centerDepth = center.z;
    vec2 sampleNormal = samplef.xy;
    float sampleDepth = samplef.z;
    
    vec2 diffNormal = abs(centerNormal - sampleNormal) * Sensitivity.x;
    bool isSameNormal = (diffNormal.x + diffNormal.y) < 0.1;
    float diffDepth = abs(centerDepth - sampleDepth) * Sensitivity.y;
    bool isSameDepth = diffDepth < 0.1;
    
    return (isSameNormal && isSameDepth) ? 1.0 : 0.0;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec4 sample0 = texture2D(iChannel0, fragCoord / iResolution.xy);
    vec4 sample1 = texture2D(iChannel0, (fragCoord + vec2(1.0, 1.0)) / iResolution.xy);
    vec4 sample2 = texture2D(iChannel0, (fragCoord + vec2(-1.0, -1.0)) / iResolution.xy);
    vec4 sample3 = texture2D(iChannel0, (fragCoord + vec2(-1.0, 1.0)) / iResolution.xy);
    vec4 sample4 = texture2D(iChannel0, (fragCoord + vec2(1.0, -1.0)) / iResolution.xy);
    
    float edge = checkSame(sample1, sample2) * checkSame(sample3, sample4);
    float shadow = texture2D(shadowSaved,fragCoord / iResolution.xy).x;
    fragColor = vec4(edge, shadow, 1.0, 1.0);
    // fragColor = vec4(1.0,1.0,0.0,1.0);
    // fragColor = texture2D(shadowSaved,vUv);
    // fragColor = texture2D(iChannel0,fragCoord/iResolution.xy);
}
     
    void main() {
      mainImage(gl_FragColor, gl_FragCoord.xy);
      // mainImage(gl_FragColor, vUv*iResolution.xy);
    }
    `;

export default fragmentShader;
