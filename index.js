const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillStyle = "white";
c.fillRect(0, 0, canvas.width, canvas.height);

const image = new Image();
image.src = "./img/Petalwood Town.png"; //html element i.e. the image(map)

const playerImage = new Image();
playerImage.src = "./img/playerDown.png";

class Sprite {
  constructor({ position, velocity, image }) {
    this.position = position;
    this.image = image;
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

const background = new Sprite({
  position: {
    x: -199,
    y: 0,
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

function animate() {
  window.requestAnimationFrame(animate);
  background.draw();

  // Scale the player image
  const playerWidth = playerImage.width * 0.8; // Scale down by 80% (adjust this value as needed)
  const playerHeight = playerImage.height * 0.8;

  c.drawImage(
    playerImage,
    0, //cropping the sprite-sheet of the player
    0,
    playerImage.width / 4,
    playerImage.height,
    canvas.width / 2 - playerImage.width / 4 / 1.26,
    canvas.height / 2 - playerImage.height / 2 - 28,
    playerWidth / 4, //actual height and width of player being rendered out
    playerHeight
  );

  if (keys.w.pressed) background.position.y += 3;
  else if (keys.a.pressed) background.position.x += 3;
  else if (keys.s.pressed) background.position.y -= 3;
  else if (keys.d.pressed) background.position.x -= 3;
}
animate();
window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = true;
      break;

    case "a":
      keys.a.pressed = true;
      break;

    case "s":
      keys.s.pressed = true;
      break;

    case "d":
      keys.d.pressed = true;
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
});
