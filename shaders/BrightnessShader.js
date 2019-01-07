THREE.BrightnessShader = {
    uniforms: {
        "tDiffuse": { value: null },        
		"brightness": { value: false }
    },

    vertexShader: [
        "varying vec2 vUv;",

        "void main(){",

            "vUv=uv;",
            "gl_Position= projectionMatrix * modelViewMatrix * vec4(position, 1.0);",

        "}"
    ].join("\n"),

    fragmentShader: [

        "uniform sampler2D tDiffuse;",
        "uniform bool brightness;",

        "varying vec2 vUv;",

        "vec3 hsv2rgb(vec3 c){",
        "	const vec4 k=vec4(1.0,2.0/3.0,1.0/3.0,3.0);",
        "	vec3 p=abs(fract(c.xxx+k.xyz)*6.0-k.www);",
        "	return c.z * mix(k.xxx, clamp(p - k.xxx, 0.0, 1.0), c.y);",
        "}",

        "vec3 rgb2hsv(vec3 c){",
        "	const vec4 k=vec4(0.0,-1.0/3.0, 2.0 / 3.0, -1.0);",
        "	vec4 p = mix(vec4(c.bg, k.wz), vec4(c.gb, k.xy), step(c.b, c.g));",
        "   vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));",
        "	float d = q.x - min(q.w, q.y);",
        "   return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + 0.001)), d / (q.x + 0.001), q.x);",
        "}",

        "void main(){",
            "vec4 color = texture2D( tDiffuse, vUv);",
            "if( brightness ){",
                "vec3 a = rgb2hsv(texture2D(tDiffuse, vUv).rgb);",
                "vec3 m = a + vec3(0, 0, 0.5);",
                "vec3 f_color = hsv2rgb(m);",
                // "vec3 f_color = (hsv2rgb(m) - 0.5) * (0.0) + 0.5;",
                "gl_FragColor = vec4(f_color, 1.0);",
            "} else{",
                "gl_FragColor = color;",
            "}",
        "}"
    ].join("\n")
};