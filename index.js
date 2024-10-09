const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

console.log(collisions);

canvas.width = 1024;
canvas.height = 576;

const collisionsMap = [];
for (let i = 0; i <= collisions.length; i += 120) {
  collisionsMap.push(collisions.slice(i, 120 + i)); //slicing the array of collisons(acc to width of map 120 tiles) into sub-arrays and storing/pushing them in another Array
}
//console.log(collisionsMap)

class Boundary {
  static width = 36;
  static height = 36;

  constructor({ position }) {
    this.position = position;
    this.width = Boundary.width;
    this.height = Boundary.height;
  }

  draw() {
    c.fillStyle = "red";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

const boundaries = [];
const offset = {
  x: -249,
  y: 13,
};

collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025)
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y - 13,
          },
        })
      );
  });
});
//console.log(boundaries);

const image = new Image();
image.src = "./img/Petalwood Town.png"; //html element i.e. the image(map)

const playerImage = new Image();
playerImage.src = "./img/playerDown.png";

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

const player = new Sprite({
  position: {
    x: canvas.width / 2 - playerImage.width / 4 / 2,
    y: canvas.height / 2 - playerImage.height / 2,
  },
  image: playerImage,
  frames: {
    max: 4,
  },
});

const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: image,
});

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};


const movables = [background, ...boundaries];

function RectangularCollision ({rectangle1, rectangle2}) {
  return(rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height)
}

function animate() {
  window.requestAnimationFrame(animate);
  background.draw();
  player.draw();
  
  boundaries.forEach(boundary => {
    boundary.draw();

    if (
      RectangularCollision({
        rectangle1 : player, 
        rectangle2 : boundary
      })
    ) {
      console.log("colliding");
    }
  }) 

  if (keys.w.pressed && lastkey === "w") {
    movables.forEach((movable) => {
      movable.position.y += 1.5;
    });
  } else if (keys.a.pressed && lastkey === "a") {
    movables.forEach((movable) => {
      movable.position.x += 1.5;
    });
  } else if (keys.s.pressed && lastkey === "s") {
    movables.forEach((movable) => {
      movable.position.y -= 1.5;
    });
  } else if (keys.d.pressed && lastkey === "d") {
    movables.forEach((movable) => {
      movable.position.x -= 1.5;
    });
  }
}
animate();

let lastkey = "";
window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = true;
      lastkey = "w";
      break;

    case "a":
      keys.a.pressed = true;
      lastkey = "a";
      break;

    case "s":
      keys.s.pressed = true;
      lastkey = "s";
      break;

    case "d":
      keys.d.pressed = true;
      lastkey = "d";
      break;
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = false;
      break;

    case "a":
      keys.a.pressed = false;
      break;

    case "s":
      keys.s.pressed = false;
      break;

    case "d":
      keys.d.pressed = false;
      break;
  }

  if (keys.w.pressed) lastkey = "w";
  else if (keys.a.pressed) lastkey = "a";
  else if (keys.s.pressed) lastkey = "s";
  else if (keys.d.pressed) lastkey = "d";
});
