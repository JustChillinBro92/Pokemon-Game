const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

//console.log(gsap)
//console.log(battleZonesData);

canvas.width = 1024;
canvas.height = 576;

const collisionsMap = [];
for (let i = 0; i <= collisions.length; i += 120) {
  collisionsMap.push(collisions.slice(i, 120 + i)); //slicing the array of collisons(acc to width of map 120 tiles) into sub-arrays and storing/pushing them in another Array
}
//console.log(collisionsMap)

const battleZonesMap = [];
for (let i = 0; i <= battleZonesData.length; i += 120) {
  battleZonesMap.push(battleZonesData.slice(i, 120 + i)); //slicing the array of battlezones(acc to width of map 120 tiles) into sub-arrays and storing/pushing them in another Array
}
//console.log(battlezonesMap);

const boundaries = [];
const offset = {
  x: -244,
  y: 28,
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

const battleZones = [];

battleZonesMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025)
      battleZones.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      );
  });
});
//console.log(battleZones);

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
    hold: 25
  },
  sprites: {
    up: playerUpImage,
    left: playerLeftImage,
    right: playerRightImage,
    down: playerDownImage,
  },
  scale: 0.8,
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

const movables = [background, foreground, ...boundaries, ...battleZones];

function RectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height
  );
}

const battle = {
  initiated: false
}

function animate() {
  const animateId = window.requestAnimationFrame(animate);

  background.draw();
  boundaries.forEach((boundary) => {
    boundary.draw();
  });
  battleZones.forEach((battleZone) => {
    battleZone.draw();
  });
  player.draw();
  foreground.draw();

  let moving = true; // for collison blocks
  player.animate = false; // for player movement animation

  if(battle.initiated) return

  //activates a battle
  if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
    for (let i = 0; i < battleZones.length; i++) {

      const battleZone = battleZones[i];
      const OverlappingArea =
        (Math.min(
          player.position.x + player.width,
          battleZone.position.x + battleZone.width
        ) -
        Math.max(player.position.x, battleZone.position.x)) *
        (Math.min(
            player.position.y + player.height,
            battleZone.position.y + battleZone.height
          ) -
        Math.max(player.position.y, battleZone.position.y));

      if (
        RectangularCollision({
          rectangle1: player,
          rectangle2: battleZone,
        }) &&
        OverlappingArea > (player.height * player.width) / 2
        && 
        Math.random() < 0.01
      ) {
        console.log("battleZone Activate");
        window.cancelAnimationFrame(animateId) //deactivates current animation loop
        battle.initiated = true;
        
        //flashing animation on battle activation
        gsap.to('#OverlappingDiv', {
          opacity: 1,
          repeat: 3,
          yoyo: true,  //smoothes out animation by bringing counter to 0 i.e., default state
          duration: 0.4,
          onComplete() {
            gsap.to('#OverlappingDiv', {  
              //keeps the canvas covered by the 'overlapping div' as no yoyo property present...done to change the canvas behind it to battle scene
              opacity: 1,
              duration: 0.4,
              onComplete() {
                //activate a new animation loop (battle sequence)
                animateBattle();
                gsap.to('#OverlappingDiv', {
                  opacity: 0,
                  duration: 0.4
                })
              }
            })
          }
        })

        break;
      }
    }
  }

  if (keys.w.pressed && lastkey === "w") {
    player.animate = true;
    player.image = player.sprites.up;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        RectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y + 1.5,
            },
          },
        })
      ) {
        moving = false;
        console.log("colliding");
        break;
      }
    }
    if (moving === true) {
      movables.forEach((movable) => {
        movable.position.y += 1.5;
      });
    }
  } else if (keys.a.pressed && lastkey === "a") {
    player.animate = true;
    player.image = player.sprites.left;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        RectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x + 1.5,
              y: boundary.position.y,
            },
          },
        })
      ) {
        moving = false;
        console.log("colliding");
        break;
      }
    }
    if (moving === true) {
      movables.forEach((movable) => {
        movable.position.x += 1.5;
      });
    }
  } else if (keys.s.pressed && lastkey === "s") {
    player.animate = true;
    player.image = player.sprites.down;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        RectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y - 1.5,
            },
          },
        })
      ) {
        moving = false;
        console.log("colliding");
        break;
      }
    }
    if (moving === true) {
      movables.forEach((movable) => {
        movable.position.y -= 1.5;
      });
    }
  } else if (keys.d.pressed && lastkey === "d") {
    player.animate = true;
    player.image = player.sprites.right;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        RectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x - 1.5,
              y: boundary.position.y,
            },
          },
        })
      ) {
        moving = false;
        console.log("colliding");
        break;
      }
    }
    if (moving === true) {
      movables.forEach((movable) => {
        movable.position.x -= 1.5;
      });
    }
  }
}
//animate();

const BattleBackgroundImg = new Image();
BattleBackgroundImg.src = "./img/battleBackground.png";

const BattleBackground = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  image: BattleBackgroundImg,
});

const draggleImg = new Image();
draggleImg.src = "./img/draggleSprite.png"

const embyImg = new Image();
embyImg.src = "./img/embySprite.png"

const draggle = new Sprite({
  position: {
    x: 800, 
    y: 115
  },
  image: draggleImg,
  frames: {
    max: 4,
    hold: 70
  },
  scale: 0.85,
  animate: true,
  isEnemy: true,
})

const emby = new Sprite({
  position: {
    x: 290, 
    y: 340
  },
  image: embyImg,
  frames: {
    max: 4,
    hold: 60
  },
  scale: 0.9,
  animate: true,
})

function animateBattle() {
  window.requestAnimationFrame(animateBattle);
  //console.log("animating battle sequence");
  BattleBackground.draw();
  draggle.draw();
  emby.draw();
}
animateBattle();

document.querySelectorAll('button').forEach(button => {
  button.addEventListener('click', () => {
    //console.log('clicked');
    
    emby.attack({
      attack: {
        name: 'Tackle',
        damage: 30,
        type: 'Normal',
      },
      recipient: draggle
    })

    /*draggle.attack({
      attack: {
        name: 'Tackle',
        damage: 30,
        type: 'Normal',
      },
      recipient: emby
    })*/
   
  })
})

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
