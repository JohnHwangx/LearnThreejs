THREE.DotScreenShader = {
    uniforms: {
        "tDiffuse": { value: null },        
		"greyscale": { value: false }
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
        "uniform bool greyscale;",

        "varying vec2 vUv;",

        "void main(){",

            "vec4 color = texture2D( tDiffuse, vUv);",
            "if( greyscale ){",
                "float average = ( color.r + color.g + color.b) / 3.0;",
                "gl_FragColor = vec4( vec3(average), color.a);",
            "} else{",
                "gl_FragColor = color;",
            "}",
        "}"
    ].join("\n")
};