const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const collisionsMap = [];
for (let i = 0; i <= collisions.length; i += 120) {
  collisionsMap.push(collisions.slice(i, 120 + i)); //slicing the array of collisons(acc to width of map 120 tiles) into sub-arrays and storing/pushing them in another Array
}
//console.log(collisionsMap)

const boundaries = [];
const offset = {
  x: -244,
  y: 35,
};

collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025)
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      );
  });
});
//console.log(boundaries);

const image = new Image();
image.src = "./img/PetalwoodTown.png"; //html element i.e. the image(map)

const foregroundimage = new Image();
foregroundimage.src = "./img/ForegroundObjects.png";

const playerDownImage = new Image();
playerDownImage.src = "./img/playerDown.png";

const playerUpImage = new Image();
playerUpImage.src = "./img/playerUp.png";

const playerLeftImage = new Image();
playerLeftImage.src = "./img/playerLeft.png";

const playerRightImage = new Image();
playerRightImage.src = "./img/playerRight.png";

const player = new Sprite({
  position: {
    x: canvas.width / 2 - (playerDownImage.width / 4 / 2) * 0.8,
    y: canvas.height / 2 - (playerDownImage.height / 2) * 0.8,
  },
  image: playerDownImage,
  frames: {
    max: 4,
  },
  sprites: {
    up: playerUpImage,
    left: playerLeftImage,
    right: playerRightImage,
    down: playerDownImage 
  },
  scale: 0.8
});

const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: image,
});

const foreground = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: foregroundimage,
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


const movables = [background,foreground, ...boundaries];

function RectangularCollision ({rectangle1, rectangle2}) {
  return(rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height)
}

function animate() {
  window.requestAnimationFrame(animate);

  background.draw(); 
  boundaries.forEach(boundary => {
    boundary.draw();
  }) 
  player.draw();
  foreground.draw();

  let moving = true; // for collison blocks
  player.moving = false; // for player movement animation

  if (keys.w.pressed && lastkey === "w") {
    player.moving = true;
    player.image = player.sprites.up;
    for(let i = 0; i < boundaries.length; i++){
      const boundary = boundaries[i];
      if (
        RectangularCollision({
          rectangle1 : player, 
          rectangle2 : {...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y + 1.5
            }
          }
        })
      ) {
        moving = false;
        console.log("colliding");
        break;
      }
    }
    if(moving === true) {
      movables.forEach((movable) => {
        movable.position.y += 1.5;
      });
    } 
  } else if (keys.a.pressed && lastkey === "a") {
    player.moving = true;
    player.image = player.sprites.left;
    for(let i = 0; i < boundaries.length; i++){
      const boundary = boundaries[i];
      if (
        RectangularCollision({
          rectangle1 : player, 
          rectangle2 : {...boundary,
            position: {
              x: boundary.position.x + 1.5,
              y: boundary.position.y 
            }
          }
        })
      ) {
        moving = false;
        console.log("colliding");
        break;
      }
    }
    if(moving === true) {
      movables.forEach((movable) => {
        movable.position.x += 1.5;
      });
    }
  } else if (keys.s.pressed && lastkey === "s") {
    player.moving = true;
    player.image = player.sprites.down;
    for(let i = 0; i < boundaries.length; i++){
      const boundary = boundaries[i];
      if (
        RectangularCollision({
          rectangle1 : player, 
          rectangle2 : {...boundary,
            position: {
              x: boundary.position.x ,
              y: boundary.position.y - 1.5 
            }
          }
        })
      ) {
        moving = false;
        console.log("colliding");
        break;
      }
    }
    if(moving === true) {
      movables.forEach((movable) => {
        movable.position.y -= 1.5;
      });
    }
  } else if (keys.d.pressed && lastkey === "d") {
    player.moving = true;
    player.image = player.sprites.right;
    for(let i = 0; i < boundaries.length; i++){
      const boundary = boundaries[i];
      if (
        RectangularCollision({
          rectangle1 : player, 
          rectangle2 : {...boundary,
            position: {
              x: boundary.position.x - 1.5,
              y: boundary.position.y 
            }
          }
        })
      ) {
        moving = false;
        console.log("colliding");
        break;
      }
    }
    if(moving === true) {
      movables.forEach((movable) => {
        movable.position.x -= 1.5;
      });
    }
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
