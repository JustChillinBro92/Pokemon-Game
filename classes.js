class Boundary {
  static width = 36;
  static height = 36;

  constructor({ position }) {
    this.position = position;
    this.width = Boundary.width;
    this.height = Boundary.height;
  }

  draw() {
    c.fillStyle = "rgba(255, 0, 0, 0.2)";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

class Sprite {
  constructor({ position, velocity, image, frames = { max: 1 }, scale = 1, sprites}) {
    this.position = position;
    this.image = image;
    this.frames = { ...frames, val: 0, elapsed: 0 };
    this.scale = scale;

    this.image.onload = () => {
      this.width = (this.image.width / this.frames.max) * this.scale;
      this.height = this.image.height * this.scale;

      console.log(this.width, this.height);
    };

    this.moving = false;
    this.sprites = sprites;
  }

  draw() {
    const frameWidth = this.image.width / this.frames.max;  // Single frame width
    const frameHeight = this.image.height;                 // Single frame height
    
    // Determine the scaling factor for rendering the player sprite (scale only the sprite)
    const scaledWidth = frameWidth * this.scale;   // Scaled width of the frame
    const scaledHeight = frameHeight * this.scale; // Scaled height of the frame
    
    
    c.drawImage(
      this.image,
      this.frames.val * frameWidth, //cropping the sprite-sheet of the player x axis
      0, //cropping the sprite-sheet of the player y axis
      frameWidth,
      frameHeight,
      this.position.x,
      this.position.y,
      scaledWidth,
      scaledHeight
    );

    if(!this.moving) return // if player is not moving we do not call the following code

    if (this.frames.max > 1) {
      // it means that a sprite-sheet for animation is present
      this.frames.elapsed++;
    }
    if (this.frames.elapsed % 25 === 0) {
      if (this.frames.val < this.frames.max - 1) this.frames.val++;
      else this.frames.val = 0;
    }
  }
}
