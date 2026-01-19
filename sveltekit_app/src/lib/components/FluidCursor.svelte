<script>
    import { onMount, onDestroy } from 'svelte';

    let canvas;
    let gl;
    let animationId;

    // Configuration
    const config = {
        TEXTURE_DOWNSAMPLE: 1,
        DENSITY_DISSIPATION: 0.98,
        VELOCITY_DISSIPATION: 0.99,
        PRESSURE_DISSIPATION: 0.8,
        PRESSURE_ITERATIONS: 25,
        CURL: 30,
        SPLAT_RADIUS: 0.002, // Slightly smaller for sharper trails
        SPLAT_FORCE: 6000
    };

    let pointers = [];
    let splatStack = [];

    // Neon Palette: Magenta, Cyan, Lime
    const neonColors = [
        [1.0, 0.0, 1.0], // Magenta
        [0.0, 1.0, 1.0], // Cyan
        [0.0, 1.0, 0.0]  // Lime
    ];

    function getNeonColor() {
        const color = neonColors[Math.floor(Math.random() * neonColors.length)];
        return { r: color[0], g: color[1], b: color[2] };
    }

    onMount(() => {
        if (typeof window === "undefined") return;

        initWebGL();
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Mouse Events
        window.addEventListener('mousemove', (e) => {
            if (pointers.length === 0) pointers.push(new PointerPrototype());
            const p = pointers[0];
            p.moved = true;
            p.dx = (e.clientX - p.x) * 5.0;
            p.dy = (e.clientY - p.y) * 5.0;
            p.x = e.clientX;
            p.y = e.clientY;
            p.color = getNeonColor();
        });
        
        // Touch Events
        window.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touches = e.targetTouches;
            for (let i = 0; i < touches.length; i++) {
                if (i >= pointers.length) pointers.push(new PointerPrototype());
                pointers[i].id = touches[i].identifier;
                pointers[i].down = true;
                pointers[i].x = touches[i].clientX;
                pointers[i].y = touches[i].clientY;
                pointers[i].color = getNeonColor();
            }
        });

        window.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touches = e.targetTouches;
            for (let i = 0; i < touches.length; i++) {
                let p = pointers[i];
                p.moved = p.down;
                p.dx = (touches[i].clientX - p.x) * 8.0;
                p.dy = (touches[i].clientY - p.y) * 8.0;
                p.x = touches[i].clientX;
                p.y = touches[i].clientY;
            }
        }, false);

        update();

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resizeCanvas);
        };
    });

    function PointerPrototype() {
        this.id = -1;
        this.x = 0;
        this.y = 0;
        this.dx = 0;
        this.dy = 0;
        this.down = false;
        this.moved = false;
        this.color = { r: 1, g: 0, b: 1 };
    }

    // --------------------------------------------------------------------------
    // WebGL Core
    // --------------------------------------------------------------------------

    function initWebGL() {
        if (!canvas) return;
        gl = canvas.getContext('webgl2', { alpha: true, depth: false, antialias: false, preserveDrawingBuffer: false });
        // Fallback or extensions...
        if (!gl) return;

        // Verify extensions
        gl.getExtension('EXT_color_buffer_float'); 
        // Some mobile browsers need OES_texture_float_linear for linear filtering on float textures
        gl.getExtension('OES_texture_float_linear');

        // Programs (Same as before, ensuring correctness)
        const baseVertexShader = compileShader(gl.VERTEX_SHADER, `
            precision highp float;
            attribute vec2 aPosition;
            varying vec2 vUv;
            varying vec2 vL;
            varying vec2 vR;
            varying vec2 vT;
            varying vec2 vB;
            uniform vec2 texelSize;

            void main () {
                vUv = aPosition * 0.5 + 0.5;
                vL = vUv - vec2(texelSize.x, 0.0);
                vR = vUv + vec2(texelSize.x, 0.0);
                vT = vUv + vec2(0.0, texelSize.y);
                vB = vUv - vec2(0.0, texelSize.y);
                gl_Position = vec4(aPosition, 0.0, 1.0);
            }
        `);

        const displayShaderSource = `
            precision highp float;
            precision highp sampler2D;
            varying vec2 vUv;
            uniform sampler2D uTexture;
            
            void main () {
                vec3 C = texture(uTexture, vUv).rgb;
                float a = max(C.r, max(C.g, C.b));
                // Boost alpha for visibility
                gl_FragColor = vec4(C, a * 1.5); 
            }
        `;

        const splatShaderSource = `
            precision highp float;
            precision highp sampler2D;
            varying vec2 vUv;
            uniform sampler2D uTarget;
            uniform float aspectRatio;
            uniform vec3 color;
            uniform vec2 point;
            uniform float radius;

            void main () {
                vec2 p = vUv - point.xy;
                p.x *= aspectRatio;
                vec3 splat = exp(-dot(p, p) / radius) * color;
                vec3 base = texture(uTarget, vUv).xyz;
                gl_FragColor = vec4(base + splat, 1.0);
            }
        `;

        const advectionShaderSource = `
            precision highp float;
            precision highp sampler2D;
            varying vec2 vUv;
            uniform sampler2D uVelocity;
            uniform sampler2D uSource;
            uniform vec2 texelSize;
            uniform float dt;
            uniform float dissipation;

            void main () {
                vec2 coord = vUv - dt * texture(uVelocity, vUv).xy * texelSize;
                gl_FragColor = texture(uSource, coord) * dissipation;
            }
        `;

        const divergenceShaderSource = `
            precision highp float;
            precision highp sampler2D;
            varying vec2 vUv;
            varying vec2 vL;
            varying vec2 vR;
            varying vec2 vT;
            varying vec2 vB;
            uniform sampler2D uVelocity;

            void main () {
                float L = texture(uVelocity, vL).x;
                float R = texture(uVelocity, vR).x;
                float T = texture(uVelocity, vT).y;
                float B = texture(uVelocity, vB).y;

                vec2 C = texture(uVelocity, vUv).xy;
                if (vL.x < 0.0) { L = -C.x; }
                if (vR.x > 1.0) { R = -C.x; }
                if (vT.y > 1.0) { T = -C.y; }
                if (vB.y < 0.0) { B = -C.y; }

                float div = 0.5 * (R - L + T - B);
                gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
            }
        `;

        const curlShaderSource = `
            precision highp float;
            precision highp sampler2D;
            varying vec2 vUv;
            varying vec2 vL;
            varying vec2 vR;
            varying vec2 vT;
            varying vec2 vB;
            uniform sampler2D uVelocity;

            void main () {
                float L = texture(uVelocity, vL).y;
                float R = texture(uVelocity, vR).y;
                float T = texture(uVelocity, vT).x;
                float B = texture(uVelocity, vB).x;
                float vorticity = R - L - T + B;
                gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
            }
        `;

        const vorticityShaderSource = `
            precision highp float;
            precision highp sampler2D;
            varying vec2 vUv;
            varying vec2 vL;
            varying vec2 vR;
            varying vec2 vT;
            varying vec2 vB;
            uniform sampler2D uVelocity;
            uniform sampler2D uCurl;
            uniform float curl;
            uniform float dt;

            void main () {
                float L = texture(uCurl, vL).x;
                float R = texture(uCurl, vR).x;
                float T = texture(uCurl, vT).x;
                float B = texture(uCurl, vB).x;
                float C = texture(uCurl, vUv).x;

                vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
                force /= length(force) + 0.0001;
                force *= curl * C;
                force.y *= -1.0;

                vec2 vel = texture(uVelocity, vUv).xy;
                gl_FragColor = vec4(vel + force * dt, 0.0, 1.0);
            }
        `;

        const pressureShaderSource = `
            precision highp float;
            precision highp sampler2D;
            varying vec2 vUv;
            varying vec2 vL;
            varying vec2 vR;
            varying vec2 vT;
            varying vec2 vB;
            uniform sampler2D uPressure;
            uniform sampler2D uDivergence;

            void main () {
                float L = texture(uPressure, vL).x;
                float R = texture(uPressure, vR).x;
                float T = texture(uPressure, vT).x;
                float B = texture(uPressure, vB).x;
                float C = texture(uPressure, vUv).x;
                float divergence = texture(uDivergence, vUv).x;
                float pressure = (L + R + B + T - divergence) * 0.25;
                gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
            }
        `;

        const gradientSubtractShaderSource = `
            precision highp float;
            precision highp sampler2D;
            varying vec2 vUv;
            varying vec2 vL;
            varying vec2 vR;
            varying vec2 vT;
            varying vec2 vB;
            uniform sampler2D uPressure;
            uniform sampler2D uVelocity;

            void main () {
                float L = texture(uPressure, vL).x;
                float R = texture(uPressure, vR).x;
                float T = texture(uPressure, vT).x;
                float B = texture(uPressure, vB).x;
                vec2 velocity = texture(uVelocity, vUv).xy;
                velocity.xy -= vec2(R - L, T - B);
                gl_FragColor = vec4(velocity, 0.0, 1.0);
            }
        `;

        programs = {
            display: createProgram(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, displayShaderSource)),
            splat: createProgram(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, splatShaderSource)),
            advection: createProgram(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, advectionShaderSource)),
            divergence: createProgram(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, divergenceShaderSource)),
            curl: createProgram(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, curlShaderSource)),
            vorticity: createProgram(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, vorticityShaderSource)),
            pressure: createProgram(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, pressureShaderSource)),
            gradientSubtract: createProgram(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, gradientSubtractShaderSource))
        };

        initFramebuffers();
    }

    let programs = {};
    let fbos = {};
    let textureWidth;
    let textureHeight;

    function initFramebuffers() {
        textureWidth = gl.drawingBufferWidth >> config.TEXTURE_DOWNSAMPLE;
        textureHeight = gl.drawingBufferHeight >> config.TEXTURE_DOWNSAMPLE;

        const texType = gl.HALF_FLOAT || gl.FLOAT; // Try FLOAT if available
        const rgba = gl.RGBA;
        const rg = gl.RG;

        fbos = {
            velocity: createDoubleFBO(2, textureWidth, textureHeight, rg, texType, gl.LINEAR),
            density: createDoubleFBO(0, textureWidth, textureHeight, rgba, texType, gl.LINEAR),
            divergence: createFBO(4, textureWidth, textureHeight, rg, texType, gl.NEAREST),
            curl: createFBO(5, textureWidth, textureHeight, rg, texType, gl.NEAREST),
            pressure: createDoubleFBO(6, textureWidth, textureHeight, rg, texType, gl.NEAREST)
        };
    }

    function createFBO(texId, w, h, internalFormat, type, filter) {
        gl.activeTexture(gl.TEXTURE0 + texId);
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, internalFormat, type, null);

        const fbo = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        gl.viewport(0, 0, w, h);
        gl.clear(gl.COLOR_BUFFER_BIT);

        return { texture, fbo, width: w, height: h, attach: (id) => gl.activeTexture(gl.TEXTURE0 + id) || gl.bindTexture(gl.TEXTURE_2D, texture) };
    }

    function createDoubleFBO(texId, w, h, internalFormat, type, filter) {
        let fbo1 = createFBO(texId, w, h, internalFormat, type, filter);
        let fbo2 = createFBO(texId + 1, w, h, internalFormat, type, filter);

        return {
            get read() { return fbo1; },
            get write() { return fbo2; },
            swap() { let temp = fbo1; fbo1 = fbo2; fbo2 = temp; }
        };
    }

    function resizeCanvas() {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        if (gl) initFramebuffers();
    }

    function update() {
        if (!gl) return;
        
        const dt = 0.016;

        gl.viewport(0, 0, textureWidth, textureHeight);

        // 1. Advection (Velocity)
        programs.advection.bind();
        gl.uniform2f(programs.advection.uniforms.texelSize, 1.0 / textureWidth, 1.0 / textureHeight);
        gl.uniform1f(programs.advection.uniforms.dt, dt);
        gl.uniform1f(programs.advection.uniforms.dissipation, config.VELOCITY_DISSIPATION);
        gl.uniform1i(programs.advection.uniforms.uVelocity, fbos.velocity.read.attach(0));
        gl.uniform1i(programs.advection.uniforms.uSource, fbos.velocity.read.attach(0));
        blit(fbos.velocity.write.fbo);
        fbos.velocity.swap();

        // 2. Advection (Density)
        gl.uniform1i(programs.advection.uniforms.uVelocity, fbos.velocity.read.attach(0));
        gl.uniform1i(programs.advection.uniforms.uSource, fbos.density.read.attach(1));
        gl.uniform1f(programs.advection.uniforms.dissipation, config.DENSITY_DISSIPATION);
        blit(fbos.density.write.fbo);
        fbos.density.swap();

        // 3. Splat
        for (let i = 0; i < pointers.length; i++) {
            const pointer = pointers[i];
            if (pointer.moved) {
                programs.splat.bind();
                gl.uniform1i(programs.splat.uniforms.uTarget, fbos.velocity.read.attach(0));
                gl.uniform1f(programs.splat.uniforms.aspectRatio, canvas.width / canvas.height);
                gl.uniform2f(programs.splat.uniforms.point, pointer.x / canvas.width, 1.0 - pointer.y / canvas.height);
                gl.uniform3f(programs.splat.uniforms.color, pointer.dx, -pointer.dy, 1.0);
                gl.uniform1f(programs.splat.uniforms.radius, config.SPLAT_RADIUS);
                blit(fbos.velocity.write.fbo);
                fbos.velocity.swap();

                gl.uniform1i(programs.splat.uniforms.uTarget, fbos.density.read.attach(1));
                gl.uniform3f(programs.splat.uniforms.color, pointer.color.r, pointer.color.g, pointer.color.b);
                blit(fbos.density.write.fbo);
                fbos.density.swap();
                
                pointer.moved = false;
            }
        }

        // 4. Curl
        programs.curl.bind();
        gl.uniform2f(programs.curl.uniforms.texelSize, 1.0 / textureWidth, 1.0 / textureHeight);
        gl.uniform1i(programs.curl.uniforms.uVelocity, fbos.velocity.read.attach(0));
        blit(fbos.curl.fbo);

        // 5. Vorticity
        programs.vorticity.bind();
        gl.uniform2f(programs.vorticity.uniforms.texelSize, 1.0 / textureWidth, 1.0 / textureHeight);
        gl.uniform1i(programs.vorticity.uniforms.uVelocity, fbos.velocity.read.attach(0));
        gl.uniform1i(programs.vorticity.uniforms.uCurl, fbos.curl.attach(1));
        gl.uniform1f(programs.vorticity.uniforms.curl, config.CURL);
        gl.uniform1f(programs.vorticity.uniforms.dt, dt);
        blit(fbos.velocity.write.fbo);
        fbos.velocity.swap();

        // 6. Divergence
        programs.divergence.bind();
        gl.uniform2f(programs.divergence.uniforms.texelSize, 1.0 / textureWidth, 1.0 / textureHeight);
        gl.uniform1i(programs.divergence.uniforms.uVelocity, fbos.velocity.read.attach(0));
        blit(fbos.divergence.fbo);

        // 7. Pressure
        programs.pressure.bind();
        gl.uniform2f(programs.pressure.uniforms.texelSize, 1.0 / textureWidth, 1.0 / textureHeight);
        gl.uniform1i(programs.pressure.uniforms.uDivergence, fbos.divergence.attach(0));
        for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
            gl.uniform1i(programs.pressure.uniforms.uPressure, fbos.pressure.read.attach(1));
            blit(fbos.pressure.write.fbo);
            fbos.pressure.swap();
        }

        // 8. Gradient Subtract
        programs.gradientSubtract.bind();
        gl.uniform2f(programs.gradientSubtract.uniforms.texelSize, 1.0 / textureWidth, 1.0 / textureHeight);
        gl.uniform1i(programs.gradientSubtract.uniforms.uPressure, fbos.pressure.read.attach(0));
        gl.uniform1i(programs.gradientSubtract.uniforms.uVelocity, fbos.velocity.read.attach(1));
        blit(fbos.velocity.write.fbo);
        fbos.velocity.swap();

        // 9. Render
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        programs.display.bind();
        gl.uniform1i(programs.display.uniforms.uTexture, fbos.density.read.attach(0));
        blit(null);

        animationId = requestAnimationFrame(update);
    }

    function blit(destination) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, destination);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    function compileShader(type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        return shader;
    }

    function createProgram(vertexShader, fragmentShader) {
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        const uniforms = {};
        const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < count; i++) {
            const name = gl.getActiveUniform(program, i).name;
            uniforms[name] = gl.getUniformLocation(program, name);
        }

        return {
            program,
            uniforms,
            bind: () => {
                gl.useProgram(program);
                const positionLocation = gl.getAttribLocation(program, 'aPosition');
                gl.enableVertexAttribArray(positionLocation);
                gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
            }
        };
    }

    onMount(() => {
        if (!gl) return;
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
    });

</script>

<canvas 
    bind:this={canvas} 
    class="fluid-canvas"
></canvas>

<style>
    .fluid-canvas {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 99999; /* Ensure it's on top */
        pointer-events: none;
        mix-blend-mode: screen; 
    }
</style>
