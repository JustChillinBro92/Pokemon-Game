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
    image,
    frames = { max: 1, hold: 25 },
    scale = 1,
    sprites,
    animate = false,
    rotation = 0,
  }) {
    this.position = position;
    this.image = image;
    this.frames = { ...frames, val: 0, elapsed: 0 };
    this.scale = scale;
    this.rotation = rotation;

    this.image.onload = () => {
      this.width = (this.image.width / this.frames.max) * this.scale;
      this.height = this.image.height * this.scale;
      //console.log(this.width, this.height);
    };

    this.animate = animate;
    this.sprites = sprites;
    this.opacity = 1;
  }

  draw() {
    c.save(); //if any global property added btwn save and restore, it only affects the code inside them

    c.translate(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2
    );
    c.rotate(this.rotation);
    c.translate(
      -this.position.x - this.width / 2,
      -this.position.y - this.height / 2
    );

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
}

class Monster extends Sprite {
  //all methods of Sprite class are available here as well
  constructor({
    isEnemy = false,
    name,
    position,
    image,
    frames = { max: 1, hold: 25 },
    scale = 1,
    sprites,
    animate = false,
    rotation = 0,
    attack,
  }) {
    super({      //all the assignment(this.position = position for example) of these properites depend on the parent class(Sprite)
      position,
      image,
      frames,
      scale,
      sprites,
      animate,
      rotation,
    });
    this.health = 100;
    this.name = name;
    this.isEnemy = isEnemy;
    this.attack = attack;
  }

  Attack({ attack, recipient, renderedSprites }) {
    document.querySelector("#DialogueBox").style.display = "block";
    document.querySelector("#DialogueBox").innerHTML = this.name + " used " + attack.name + "...";

    let healthBar = "#enemyHealthBar";
    if (this.isEnemy) healthBar = "#playerHealthBar";
    const healthBarVisibility = document.querySelector(healthBar);

    recipient.health -= attack.damage; //health updates with each instance of attack being called

    let rotation = 1.2;
    if (this.isEnemy) rotation = -2.2;

    switch (attack.name) {
      case "FireBall":
        const fireballImg = new Image();
        fireballImg.src = "./img/fireball.png";

        const fireball = new Monster({
          position: {
            x: this.position.x,
            y: this.position.y,
          },
          image: fireballImg,
          frames: {
            max: 4,
            hold: 25,
          },
          animate: true,
          rotation,
        });
        renderedSprites.splice(1, 0, fireball); //'1' is the index of emby, we are not removing any element so '0' used, fireball gets inserted before emby so, index '1' is now fireball

        gsap.to(fireball.position, {
          x: recipient.position.x,
          y: recipient.position.y,

          onComplete: () => {
            //enemy gets hit
            gsap.to(healthBar, {
              width: recipient.health + "%",
              duration: 0.8,
              onComplete: () => {
                if (recipient.health <= 0) {
                  healthBarVisibility.style.display = "none";
                }
              },
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
            renderedSprites.splice(1, 1); //removing the fireball after hitting target
          },
        });
        break;

      case "Tackle":
        const tl = gsap.timeline(); //timeline object created using gsap library

        let movementDistance = 20;
        if (this.isEnemy) movementDistance = -20;

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
                width: recipient.health + "%",
                duration: 0.8,
                onComplete: () => {
                  if (recipient.health <= 0) {
                    healthBarVisibility.style.visibility = "hidden";
                  }
                },
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
            //player monster sprite returns to original position
            x: this.position.x,
          });
        break;
    }
  }

  faint() {
    //console.log("faint");
    document.querySelector('#DialogueBox').innerHTML = this.name + " Fainted! ";
    gsap.to(this.position, {
      y: this.position.y + 20,
    })
    gsap.to(this, {
      opacity: 0,
    })
  }
}
