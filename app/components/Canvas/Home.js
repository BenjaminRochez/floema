import { Plane, Transform } from "ogl";
import GSAP from "gsap";
import Media from "./Media";
import map from "lodash/map";

export default class {
  constructor({ gl, scene, sizes }) {
    this.gl = gl;
    this.group = new Transform();
    this.sizes = sizes;

    this.galleryElement = document.querySelector(".home__gallery");
    this.mediasElements = document.querySelectorAll(
      ".home__gallery__media__image"
    );
    this.createGeometry();
    this.createGallery();
    this.group.setParent(scene);

    this.x = {
      current: 0,
      target: 0,
      lerp: 0.1,
    };

    this.y = {
      current: 0,
      target: 0,
      lerp: 0.1,
    };

    this.scroll = {
      x: 0,
      y: 0,
    };

    this.scrollCurrent = {
      x: 0,
      y: 0,
    };
  }

  createGeometry() {
    this.geometry = new Plane(this.gl);
  }
  createGallery() {
    this.medias = map(this.mediasElements, (element, index) => {
      return new Media({
        element,
        geometry: this.geometry,
        index,
        gl: this.gl,
        scene: this.group,
        sizes: this.sizes,
      });
    });
  }

  onTouchDown({ x, y }) {
    // this.speed.target = 1

    this.scrollCurrent.x = this.scroll.x;
    this.scrollCurrent.y = this.scroll.y;
  }

  onTouchMove({ x, y }) {
    const xDistance = x.start - x.end;
    const yDistance = y.start - y.end;

    this.x.target = this.scrollCurrent.x - xDistance;
    this.y.target = this.scrollCurrent.y - yDistance;
  }

  onTouchUp({ x, y }) {
    // this.speed.target = 0
  }

  // onWheel ({ pixelX, pixelY }) {
  //   this.x.target += pixelX
  //   this.y.target += pixelY
  // }

  onResize(event) {
    this.galleryBounds = this.galleryElement.getBoundingClientRect();
    this.gallerySizes = {
      height:
        (this.galleryBounds.height / window.innerHeight) * this.sizes.height,
      width: (this.galleryBounds.width / window.innerWidth) * this.sizes.width,
    };

    this.sizes = event.sizes;
    map(this.medias, (media) => media.onResize(event));
  }

  update() {
    if (!this.galleryBounds) return;
    this.x.current = GSAP.utils.interpolate(
      this.x.current,
      this.x.target,
      this.x.lerp
    );
    this.y.current = GSAP.utils.interpolate(
      this.y.current,
      this.y.target,
      this.y.lerp
    );

    if (this.scroll.x < this.x.current) {
      this.x.direction = "right";
    } else if (this.scroll.x > this.x.current) {
      this.x.direction = "left";
    }

    if (this.scroll.y < this.y.current) {
      this.y.direction = "top";
    } else if (this.scroll.y > this.y.current) {
      this.y.direction = "bottom";
    }

    this.galleryWidth =
      (this.galleryBounds.width / window.innerWidth) * this.sizes.width;

    this.scroll.x = this.x.current;
    this.scroll.y = this.y.current;
    map(this.medias, (media, index) => {


      if (this.x.direction === "left") {
        const x = media.mesh.position.x + media.mesh.scale.x / 2;
        if( x < -this.sizes.width / 2){
          media.extra.x += this.galleryWidth;
        }

      } else if(this.x.direction === 'right'){
        const x = media.mesh.position.x - media.mesh.scale.x / 2;
        if( x > this.sizes.width / 2){
          media.extra.x -= this.galleryWidth;
        }
      }
      media.update(this.scroll);
    });
  }
}
