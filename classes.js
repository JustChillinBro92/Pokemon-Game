class Boundary {
    static width = 36;
    static height = 36;
  
    constructor({ position }) {
      this.position = position;
      this.width = Boundary.width;
      this.height = Boundary.height;
    }
  
    draw() {
      c.fillStyle = "rgba(255, 0, 0, 0)";
      c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
  }

  class Sprite {
    constructor({ position, velocity, image, frames = { max: 1 } }) {
      this.position = position;
      this.image = image;
      this.frames = frames;
  
      this.image.onload = () => {
        this.width = (this.image.width * 0.8) / this.frames.max;
        this.height = this.image.height * 0.8;
  
        console.log(this.width, this.height);
      };
    }
  
    draw() {
      let actualwidth, actualheight;
      if (this.frames.max === 4) {
        actualwidth = this.image.width * 0.8;
        actualheight = this.image.height * 0.8;
      } else {
        actualwidth = this.image.width;
        actualheight = this.image.height;
      }
  
      c.drawImage(
        this.image,
        0, //cropping the sprite-sheet of the player x axis
        0, //cropping the sprite-sheet of the player y axis
        this.image.width / this.frames.max,
        this.image.height,
        this.position.x,
        this.position.y,
        actualwidth / this.frames.max,
        actualheight
      );
    }
  }