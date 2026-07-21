<script lang="ts">
    interface Props {
        veilVariant?: "default" | "soft";
    }

    let { veilVariant = "default" }: Props = $props();

    let canvas: HTMLCanvasElement;
    let fallback: HTMLDivElement;

    function init() {
        const gl = canvas.getContext("webgl2", { antialias: true });
        if (!gl) {
            fallback.style.display = "flex";
            canvas.style.display = "none";
            return;
        }

        const VERT = `#version 300 es
void main(){ vec2 p=vec2((gl_VertexID<<1)&2, gl_VertexID&2); gl_Position=vec4(p*2.0-1.0,0.0,1.0); }`;

        const FRAG = `#version 300 es
precision highp float;
out vec4 o;
uniform vec2 u_res; uniform float u_time; uniform vec2 u_mouse;
float hash(vec2 p){ return fract(sin(dot(p,vec2(41.3,289.1)))*43758.5453); }
float noise(vec2 p){ vec2 i=floor(p),f=fract(p); vec2 u=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y); }
float fbm(vec2 p){ float v=0.0,a=0.5; for(int i=0;i<5;i++){ v+=a*noise(p); p=p*1.9+3.0; a*=0.55; } return v; }
vec3 auroraPal(float t){
  float a=0.5+0.5*cos(t*6.28318), b=0.5+0.5*sin(t*6.28318);
  return mix(mix(vec3(0.10,0.9,0.45), vec3(0.15,0.8,0.85), a), vec3(0.6,0.35,0.95), b);
}
void main(){
  vec2 uv=gl_FragCoord.xy/u_res;
  vec2 p=(gl_FragCoord.xy-0.5*u_res)/u_res.y;
  float sway=(u_mouse.x-0.5)*1.2;
  vec3 col=mix(vec3(0.122,0.133,0.157), vec3(0.14,0.18,0.24), uv.y);
  vec2 sc=floor(gl_FragCoord.xy/3.0);
  float star=step(0.9975,hash(sc))*pow(hash(sc+7.0),2.0)*smoothstep(0.3,1.0,uv.y);
  col+=vec3(0.9,0.95,1.0)*star*0.7;
  float t=u_time*0.15;
  for(int i=0;i<4;i++){
    float fi=float(i);
    float base=(fi-1.5)*0.42 + sway*(0.3+fi*0.18);
    float cx=base + sin(p.y*1.4 + t*1.8 + fi*1.9)*0.18 + (fbm(vec2(p.y*0.9+fi*3.0, t*1.3))-0.5)*0.55;
    float w=0.32 + 0.12*fbm(vec2(p.y*2.0+fi, t));
    float band=exp(-pow((p.x-cx)/w, 2.0));
    float vert=smoothstep(-0.95,0.85,p.y) * (0.5+0.5*fbm(vec2(p.x*3.5+fi*4.0, p.y*1.8 - t*2.0)));
    float ribbon=band*vert;
    float hue=fract(0.10 + fi*0.22 + p.x*0.08 + p.y*0.06 + t*0.25);
    col += auroraPal(hue) * ribbon * (0.62 - fi*0.08);
  }
  col *= 0.6+0.5*smoothstep(1.5,0.1,length(p*vec2(0.6,1.0)));
  col=col/(col+0.8);
  col+=(hash(gl_FragCoord.xy+u_time)-0.5)*0.02;
  o=vec4(pow(max(col,0.0),vec3(0.9)),1.0);
}`;

        function sh(t: number, s: string) {
            const x = gl!.createShader(t);
            gl!.shaderSource(x!, s);
            gl!.compileShader(x!);
            if (!gl!.getShaderParameter(x!, gl!.COMPILE_STATUS))
                throw gl!.getShaderInfoLog(x!);
            return x!;
        }

        const pr = gl.createProgram();
        gl.attachShader(pr, sh(gl.VERTEX_SHADER, VERT));
        gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FRAG));
        gl.linkProgram(pr);
        if (!gl.getProgramParameter(pr, gl.LINK_STATUS))
            throw gl.getProgramInfoLog(pr);
        gl.useProgram(pr);

        const uRes = gl.getUniformLocation(pr, "u_res");
        const uTime = gl.getUniformLocation(pr, "u_time");
        const uMouse = gl.getUniformLocation(pr, "u_mouse");

        let mouse = [0.5, 0.5];
        let target = [0.5, 0.5];

        addEventListener("pointermove", (e) => {
            target = [e.clientX / innerWidth, 1.0 - e.clientY / innerHeight];
        });

        function resize() {
            const d = Math.min(devicePixelRatio || 1, 2);
            const w = (innerWidth * d) | 0;
            const h = (innerHeight * d) | 0;
            if (w === canvas.width && h === canvas.height) return;
            canvas.width = w;
            canvas.height = h;
            gl!.viewport(0, 0, w, h);
        }

        addEventListener("resize", resize);
        resize();

        const t0 = performance.now();
        const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
        let frozenTime = 0;

        function frame(now: number) {
            resize();
            if (reduced) {
                target = [0.5, 0.5];
                mouse = [0.5, 0.5];
                frozenTime = 0.6;
            } else {
                mouse[0] += (target[0] - mouse[0]) * 0.05;
                mouse[1] += (target[1] - mouse[1]) * 0.05;
            }
            const tNow = reduced ? frozenTime : (now - t0) / 1000;
            gl!.uniform2f(uRes, canvas.width, canvas.height);
            gl!.uniform1f(uTime, tNow);
            gl!.uniform2f(uMouse, mouse[0], mouse[1]);
            gl!.drawArrays(gl!.TRIANGLES, 0, 3);
            requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
    }

    $effect(() => {
        init();
    });
</script>

<canvas class="av-canvas" bind:this={canvas} aria-hidden="true"></canvas>
<div class={veilVariant === "soft" ? "av-veil-soft" : "av-veil"} aria-hidden="true"></div>
<div class="av-fallback" bind:this={fallback} role="alert">
    <p>WebGL2 not available. This experience needs a WebGL2-capable browser.</p>
</div>