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
  constructor({
    position,
    velocity,
    image,
    frames = { max: 1, hold: 25 },
    scale = 1,
    sprites,
    animate = false,
    isEnemy = false,
  }) {
    this.position = position;
    this.image = image;
    this.frames = { ...frames, val: 0, elapsed: 0 };
    this.scale = scale;

    this.image.onload = () => {
      this.width = (this.image.width / this.frames.max) * this.scale;
      this.height = this.image.height * this.scale;
      //console.log(this.width, this.height);
    };

    this.animate = animate;
    this.sprites = sprites;
    this.opacity = 1;
    this.health = 100;
    this.isEnemy = isEnemy;
  }

  draw() {
    c.save(); //if any global property added btwn save and restore, it only affects the code inside them
    c.globalAlpha = this.opacity; //global property

    const frameWidth = this.image.width / this.frames.max; // Single frame width
    const frameHeight = this.image.height; // Single frame height

    // Determine the scaling factor for rendering the player sprite (scale only the sprite)
    const scaledWidth = frameWidth * this.scale; // Scaled width of the frame
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
    c.restore();

    if (!this.animate) return; // if player is not moving we do not call the following code

    if (this.frames.max > 1) {
      // it means that a sprite-sheet for animation is present
      this.frames.elapsed++;
    }
    if (this.frames.elapsed % this.frames.hold === 0) {
      if (this.frames.val < this.frames.max - 1) this.frames.val++;
      else this.frames.val = 0;
    }
  }

  attack({ attack, recipient }) {
    const tl = gsap.timeline(); //timeline object created using gsap library

    this.health -= attack.damage //health updates with each instance

    let movementDistance = 20;
    let healthBar = "#enemyHealthBar";

    if (this.isEnemy) {
      movementDistance = -20;
      healthBar = "#playerHealthBar";
    }

    const healthBarVisibility = document.querySelector(healthBar);

    tl.to(this.position, {
      x: this.position.x - movementDistance,
    })
      .to(this.position, {
        x: this.position.x + movementDistance * 2,
        duration: 0.1,

        //enemy gets hit
        onComplete: () => {
          //arrow function instead of noraml function given so that we can use/increase scope of 'this.health'
          gsap.to(healthBar, {
            width: this.health + "%",
            duration: 0.8,
            onComplete: () => {
              if(this.health <= 0.1 * this.health) {
                healthBarVisibility.style.visibility = "hidden";
              }
            }
          });

          gsap.to(recipient.position, {
            x: recipient.position.x + 10,
            yoyo: true,
            repeat: 5,
            duration: 0.08,
          });

          gsap.to(recipient, {
            opacity: 0,
            yoyo: true,
            repeat: 3,
            duration: 0.08,
          });
        },
      })
      .to(this.position, {
        x: this.position.x,
      });
  }
}
