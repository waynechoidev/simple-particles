export class Engine {
  private _canvas: HTMLCanvasElement;
  private _gl: WebGL2RenderingContext;

  constructor(width: number, height: number) {
    this._canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this._canvas.width = width;
    this._canvas.height = height;
    this._gl = this._canvas.getContext("webgl2") as WebGL2RenderingContext;
    if (!this._gl) alert("Cannot use webgl2");

    this.createWindow();
  }

  get gl() {
    return this._gl;
  }

  createProgram(
    vertexShaderSource: string,
    fragmentShaderSource: string,
    varyings?: string[]
  ) {
    const program = this._gl.createProgram() as WebGLProgram;
    if (!program) console.error(`failed to creat a program.`);

    const vertexShader = this.createShader(
      this._gl.VERTEX_SHADER,
      vertexShaderSource
    );
    const fragmentShader = this.createShader(
      this._gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );

    this._gl.attachShader(program, vertexShader!);
    this._gl.attachShader(program, fragmentShader!);

    if (varyings)
      this._gl.transformFeedbackVaryings(
        program,
        varyings,
        this._gl.SEPARATE_ATTRIBS
      );

    this._gl.linkProgram(program);

    const success = this._gl.getProgramParameter(program, this._gl.LINK_STATUS);
    if (success) {
      return program;
    } else {
      console.log(this._gl.getProgramInfoLog(program));
      this._gl.deleteProgram(program);
    }
  }

  makeVertexArray(bufLocPairs: [WebGLBuffer, number][]) {
    const va = this._gl.createVertexArray();
    this._gl.bindVertexArray(va);
    for (const [buffer, loc] of bufLocPairs) {
      this._gl.bindBuffer(this._gl.ARRAY_BUFFER, buffer);
      this._gl.enableVertexAttribArray(loc);
      this._gl.vertexAttribPointer(
        loc, // attribute location
        2, // number of elements
        this._gl.FLOAT, // type of data
        false, // normalize
        0, // stride (0 = auto)
        0 // offset
      );
    }
    return va;
  }

  makeTransformFeedback(buffer: WebGLBuffer) {
    const tf = this._gl.createTransformFeedback();
    this._gl.bindTransformFeedback(this._gl.TRANSFORM_FEEDBACK, tf);
    this._gl.bindBufferBase(this._gl.TRANSFORM_FEEDBACK_BUFFER, 0, buffer);
    return tf;
  }

  makeBuffer(sizeOrData: Float32Array, usage: number = this._gl.STATIC_DRAW) {
    const buf = this._gl.createBuffer();
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, buf);
    this._gl.bufferData(this._gl.ARRAY_BUFFER, sizeOrData, usage);
    return buf;
  }

  makeBufferAndSetAttribute(data: Float32Array, loc: number) {
    this.makeBuffer(data);
    // setup our attributes to tell WebGL how to pull
    // the data from the buffer above to the attribute
    this._gl.enableVertexAttribArray(loc);
    this._gl.vertexAttribPointer(
      loc,
      1, // size (num components)
      this._gl.FLOAT, // type of data in buffer
      false, // normalize
      0, // stride (0 = auto)
      0 // offset
    );
  }

  private createWindow() {
    const gl = this._gl;
    this.resizeCanvasToDisplaySize(gl.canvas as HTMLCanvasElement);
    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    // Clear the canvas
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
  }

  private createShader(type: number, source: string) {
    const gl = this._gl;

    const shader = gl.createShader(type);
    if (shader) {
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
      if (success) {
        return shader;
      }

      console.log(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
    } else {
      console.error(`failed to creat a shader type ${type}.`);
    }
  }

  private resizeCanvasToDisplaySize(canvas: HTMLCanvasElement, multiplier = 1) {
    const width = (canvas.clientWidth * multiplier) | 0;
    const height = (canvas.clientHeight * multiplier) | 0;
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      return true;
    }
    return false;
  }
}
