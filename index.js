const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillStyle = 'white'
c.fillRect(0, 0, canvas.width, canvas.height)

const image = new Image()
image.src = './img/Petalwood Town.png'  //html element i.e. the image(map)

const playerImage = new Image()
playerImage.src = './img/playerDown.png'

image.onload = () => {    // map needs to be loaded first before drawing
c.drawImage(image, -220, 0)  //needs html element to be referenced
c.drawImage(playerImage, canvas.width/2 - playerImage.width/2 , canvas.height/2 - playerImage.height/2)  //needs html element to be referenced
}



