import { Renderer, Camera, Transform } from "ogl";

import Home from "./Home";

export default class Canvas {
  constructor() {
    this.x = {
      start: 0,
      distance: 0,
      end: 0
    }
    this.y = {
      start: 0,
      distance: 0,
      end: 0
    }
    this.createRenderer();
    this.createScene();
    this.createCamera();

    this.onResize();
    this.createHome();
  }

  createRenderer() {
    this.renderer = new Renderer({
      alpha: true
    });

    this.gl = this.renderer.gl;

    document.body.appendChild(this.gl.canvas);
  }

  createHome() {
    this.home = new Home({
      gl: this.gl,
      scene: this.scene,
      sizes: this.sizes,
    });
  }

  createScene() {
    this.scene = new Transform();
  }

  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.position.z = 5;
  }

  onTouchDown (event) {
    this.isDown = true

    this.x.start = event.touches ? event.touches[0].clientX : event.clientX
    this.y.start = event.touches ? event.touches[0].clientY : event.clientY



    const values = {
      x: this.x,
      y: this.y,
    }

    // if (this.about) {
    //   this.about.onTouchDown(values)
    // }

    // if (this.collections) {
    //   this.collections.onTouchDown(values)
    // }

    // if (this.detail) {
    //   this.detail.onTouchDown(values)
    // }

    if (this.home) {
      this.home.onTouchDown(values)
    }
  }

  onTouchMove (event) {
    if (!this.isDown) return

    const x = event.touches ? event.touches[0].clientX : event.clientX
    const y = event.touches ? event.touches[0].clientY : event.clientY

    this.x.end = x
    this.y.end = y

    const values = {
      x: this.x,
      y: this.y,
    }

    // if (this.about) {
    //   this.about.onTouchMove(values)
    // }

    // if (this.collections) {
    //   this.collections.onTouchMove(values)
    // }

    // if (this.detail) {
    //   this.detail.onTouchMove(values)
    // }

    if (this.home) {
      this.home.onTouchMove(values)
    }
  }

  onTouchUp (event) {
    this.isDown = false

    const x = event.changedTouches ? event.changedTouches[0].clientX : event.clientX
    const y = event.changedTouches ? event.changedTouches[0].clientY : event.clientY

    this.x.end = x
    this.y.end = y

    const values = {
      x: this.x,
      y: this.y,
    }

    // if (this.about) {
    //   this.about.onTouchUp(values)
    // }

    // if (this.collections) {
    //   this.collections.onTouchUp(values)
    // }

    // if (this.detail) {
    //   this.detail.onTouchUp(values)
    // }

    if (this.home) {
      this.home.onTouchUp(values)
    }
  }

  onWheel (event) {
    // if (this.collections) {
    //   this.collections.onWheel(event)
    // }

    // if (this.home) {
    //   this.home.onWheel(event)
    // }
  }


  onResize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.perspective({
      aspect: window.innerWidth / window.innerHeight,
    });

    const fov = this.camera.fov * (Math.PI / 180);
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;

    this.sizes = {
      height,
      width,
    };

    if (this.home) {
      this.home.onResize({
        sizes: this.sizes,
      });
    }
  }

  update() {
    if(this.home){
      this.home.update()
    }
    this.renderer.render({
      camera: this.camera,
      scene: this.scene,
    });
  }
}
