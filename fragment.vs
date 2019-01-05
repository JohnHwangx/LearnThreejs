"#ifdef TEXTURE_LOD_EXT
	#define texCube(a, b) textureCube(a, b)
	#define texCubeBias(a, b, c) textureCubeLodEXT(a, b, c)
	#define tex2D(a, b) texture2D(a, b)
	#define tex2DBias(a, b, c) texture2DLodEXT(a, b, c)
#else
	#define texCube(a, b) textureCube(a, b)
	#define texCubeBias(a, b, c) textureCube(a, b, c)
	#define tex2D(a, b) texture2D(a, b)
	#define tex2DBias(a, b, c) texture2D(a, b, c)
#endif
#include <packing>
#include <common>
varying vec2 vUv;


uniform sampler2D renderTexture;
uniform float nVu1;




void main() {



gl_FragColor = vec4( ( LinearToLinear( tex2D( renderTexture, vUv ) ).xyz * nVu1 ), 1.0 );

}"