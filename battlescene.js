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

const Draggle = new Sprite({
  position: {
    x: 800, 
    y: 115
  },
  name: 'Draggle',
  image: draggleImg,
  frames: {
    max: 4,
    hold: 70
  },
  scale: 0.85,
  animate: true,
  isEnemy: true,
})

const Emby = new Sprite({
  position: {
    x: 290, 
    y: 340
  },
  name: 'Emby',
  image: embyImg,
  frames: {
    max: 4,
    hold: 60
  },
  scale: 0.9,
  animate: true,
})

const renderedSprites = [Draggle, Emby]; //array for storing rendered out projectile attacks

function animateBattle() {
  window.requestAnimationFrame(animateBattle);
  //console.log("animating battle sequence");
  BattleBackground.draw();

  renderedSprites.forEach((sprite) => {
    sprite.draw();
  })
}
animateBattle();

//event listeners for our attack buttons
document.querySelectorAll('button').forEach(button => {
  button.addEventListener('click', (e) => {
    //console.log(e.currentTarget.innerHTML);
    //console.log(attacks[e.currentTarget.innerHTML]);
    const selectedAttack = attacks[e.currentTarget.innerHTML];

      Emby.Attack({
        attack: selectedAttack,
        recipient: Draggle,
        renderedSprites,
      })

      // Draggle.attack({
      //   attack: selectedAttack,
      //   recipient: Emby,
      //   renderedSprites,
      // })
  })
})