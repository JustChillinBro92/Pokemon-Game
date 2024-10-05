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

function animate() {
  window.requestAnimationFrame(animate);
  c.drawImage(image, -199, 0); //needs html element to be referenced

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
}
animate();

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "w":
      console.log("pressed w key");
      break;

    case "a":
      console.log("pressed a key");
      break;

    case "s":
      console.log("pressed s key");
      break;

    case "d":
      console.log("pressed d key");
      break;
  }
});
