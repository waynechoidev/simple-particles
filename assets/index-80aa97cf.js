var y=Object.defineProperty;var E=(i,e,r)=>e in i?y(i,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):i[e]=r;var n=(i,e,r)=>(E(i,typeof e!="symbol"?e+"":e,r),r);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))o(t);new MutationObserver(t=>{for(const s of t)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&o(a)}).observe(document,{childList:!0,subtree:!0});function r(t){const s={};return t.integrity&&(s.integrity=t.integrity),t.referrerPolicy&&(s.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?s.credentials="include":t.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(t){if(t.ep)return;t.ep=!0;const s=r(t);fetch(t.href,s)}})();class D{constructor(e,r){n(this,"_canvas");n(this,"_gl");this._canvas=document.getElementById("canvas"),this._canvas.width=e,this._canvas.height=r,this._gl=this._canvas.getContext("webgl2"),this._gl||alert("Cannot use webgl2"),this.createWindow()}get gl(){return this._gl}makeVertexArray(e){const r=this._gl.createVertexArray();this._gl.bindVertexArray(r);for(const[o,t]of e)this._gl.bindBuffer(this._gl.ARRAY_BUFFER,o),this._gl.enableVertexAttribArray(t),this._gl.vertexAttribPointer(t,2,this._gl.FLOAT,!1,0,0);return r}makeTransformFeedback(e){const r=this._gl.createTransformFeedback();return this._gl.bindTransformFeedback(this._gl.TRANSFORM_FEEDBACK,r),this._gl.bindBufferBase(this._gl.TRANSFORM_FEEDBACK_BUFFER,0,e),r}makeBuffer(e,r=this._gl.STATIC_DRAW){const o=this._gl.createBuffer();return this._gl.bindBuffer(this._gl.ARRAY_BUFFER,o),this._gl.bufferData(this._gl.ARRAY_BUFFER,e,r),o}createWindow(){const e=this._gl;this.resizeCanvasToDisplaySize(e.canvas),e.viewport(0,0,e.canvas.width,e.canvas.height),e.clearColor(1,1,1,1),e.enable(e.DEPTH_TEST),e.enable(e.CULL_FACE)}resizeCanvasToDisplaySize(e,r=1){const o=e.clientWidth*r|0,t=e.clientHeight*r|0;return e.width!==o||e.height!==t?(e.width=o,e.height=t,!0):!1}}const B=(i,e)=>(e===void 0&&(e=i,i=0),Math.random()*(e-i)+i),u=(i,e)=>new Array(i).fill(0).map(r=>e.map(o=>B(o[0],o[1]))).flat(),x=(i,e,r,o,t,s)=>[2/(e-i),0,0,0,0,2/(o-r),0,0,0,0,2/(t-s),0,(i+e)/(i-e),(r+o)/(r-o),(t+s)/(t-s),1],C=(i,e)=>{const r={...i};Object.assign(i,e),Object.assign(e,r)};class v{constructor(e,r,o,t){n(this,"_gl");n(this,"_program");this._gl=e,this._program=this.createProgram(r,o,t)}addAttrib(e){return this._gl.getAttribLocation(this._program,e)}addUniform(e){return this._gl.getUniformLocation(this._program,e)}use(){this._gl.useProgram(this._program)}createProgram(e,r,o){const t=this._gl.createProgram();t||console.error("failed to creat a program.");const s=this.createShader(this._gl.VERTEX_SHADER,e),a=this.createShader(this._gl.FRAGMENT_SHADER,r);return this._gl.attachShader(t,s),this._gl.attachShader(t,a),o&&this._gl.transformFeedbackVaryings(t,o,this._gl.SEPARATE_ATTRIBS),this._gl.linkProgram(t),this._gl.getProgramParameter(t,this._gl.LINK_STATUS)||(console.error(this._gl.getProgramInfoLog(t)),this._gl.deleteProgram(t)),t}createShader(e,r){const o=this._gl,t=o.createShader(e);if(t){if(o.shaderSource(t,r),o.compileShader(t),o.getShaderParameter(t,o.COMPILE_STATUS))return t;console.log(o.getShaderInfoLog(t)),o.deleteShader(t)}else console.error(`failed to creat a shader type ${e}.`)}}const V=`#version 300 es
  in vec2 oldPosition;
  in vec2 velocity;

  uniform float deltaTime;
  uniform vec2 canvasDimensions;

  out vec2 newPosition;

  vec2 euclideanModulo(vec2 n, vec2 m) {
  	return mod(mod(n, m) + m, m);
  }

  void main() {
    newPosition = euclideanModulo(
        oldPosition + velocity * deltaTime,
        canvasDimensions);
  }
  `,I=`#version 300 es
  precision highp float;
  void main() {
  }
  `;class O extends v{constructor(r){super(r,V,I,["newPosition"]);n(this,"_oldPosition");n(this,"_velocity");n(this,"_canvasDimensions");n(this,"_deltaTime");this._oldPosition=this.addAttrib("oldPosition"),this._velocity=this.addAttrib("velocity"),this._canvasDimensions=this.addUniform("canvasDimensions"),this._deltaTime=this.addUniform("deltaTime")}get oldPosition(){return this._oldPosition}get velocity(){return this._velocity}get canvasDimensions(){return this._canvasDimensions}get deltaTime(){return this._deltaTime}}const k=`#version 300 es
  in vec4 position;
  uniform mat4 matrix;

  void main() {
    // do the common matrix math
    gl_Position = matrix * position;
    gl_PointSize = 2.0;
  }
  `,U=`#version 300 es
  precision highp float;
  out vec4 outColor;
  
   // Function to generate a random float between min and max
  float random(float min, float max, float seed) {
      return fract(sin(seed)) * (max - min) + min;
  }

  void main() {
    // Generate a random color for each particle
    vec3 randomColor = vec3(
      random(0.0, 0.5, gl_FragCoord.x),
      random(0.0, 0.5, gl_FragCoord.y),
      random(0.0, 0.5, 0.0)  // Seed doesn't need to be based on coordinates
    );

    outColor = vec4(randomColor, 1.0);
  }
  `;class L extends v{constructor(r){super(r,k,U);n(this,"_position");n(this,"_matrix");this._position=this.addAttrib("position"),this._matrix=this.addUniform("matrix")}get position(){return this._position}get matrix(){return this._matrix}}const d=3e3,_=window.innerWidth,A=window.innerHeight;function N(){const i=new D(_,A),e=i.gl,r=new O(e),o=new L(e),t=new Float32Array(u(d,[[_],[A]])),s=new Float32Array(u(d,[[-300,300],[-300,300]])),a=i.makeBuffer(t,e.DYNAMIC_DRAW),c=i.makeBuffer(t,e.DYNAMIC_DRAW),m=i.makeBuffer(s,e.STATIC_DRAW),p=i.makeVertexArray([[a,r.oldPosition],[m,r.velocity]]),T=i.makeVertexArray([[c,r.oldPosition],[m,r.velocity]]),P=i.makeVertexArray([[a,o.position]]),F=i.makeVertexArray([[c,o.position]]),S=i.makeTransformFeedback(a),R=i.makeTransformFeedback(c);e.bindBuffer(e.ARRAY_BUFFER,null),e.bindBuffer(e.TRANSFORM_FEEDBACK_BUFFER,null);let l={updateVA:p,tf:R,drawVA:F},b={updateVA:T,tf:S,drawVA:P},g=0;function f(h){h*=.001;const w=h-g;g=h,e.clear(e.COLOR_BUFFER_BIT),r.use(),e.bindVertexArray(l.updateVA),e.uniform2f(r.canvasDimensions,e.canvas.width,e.canvas.height),e.uniform1f(r.deltaTime,w),e.enable(e.RASTERIZER_DISCARD),e.bindTransformFeedback(e.TRANSFORM_FEEDBACK,l.tf),e.beginTransformFeedback(e.POINTS),e.drawArrays(e.POINTS,0,d),e.endTransformFeedback(),e.bindTransformFeedback(e.TRANSFORM_FEEDBACK,null),e.disable(e.RASTERIZER_DISCARD),o.use(),e.bindVertexArray(l.drawVA),e.viewport(0,0,e.canvas.width,e.canvas.height),e.uniformMatrix4fv(o.matrix,!1,x(0,e.canvas.width,0,e.canvas.height,-1,1)),e.drawArrays(e.POINTS,0,d),C(l,b),requestAnimationFrame(f)}requestAnimationFrame(f)}N();
