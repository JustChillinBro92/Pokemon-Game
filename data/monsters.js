const embyImg = new Image();
embyImg.src = "./img/embySprite.png";

const emby2Img = new Image();
emby2Img.src = "./img/embySprite2.png";

const draggleImg = new Image();
draggleImg.src = "./img/draggleSprite.png";

const draggle2Img = new Image();
draggle2Img.src = "./img/draggleSprite2.png";

const terradonImg = new Image();
terradonImg.src = "./img/TerradonSprite.png";

const playerMonsters = {
  emby : {
    name: "Emby",
    image: embyImg,
    attack: [attacks.Tackle, attacks.FireBall,attacks.DragonBreath],
    frames: {
      max: 4,
      hold: 60,
    },
    scale: 1,
    animate: true,
    health: 150,
},
}

const monsters = {
    emby2 : {
        name: "Emby",
        image: emby2Img,
        attack: [attacks.Tackle, attacks.FireBall,attacks.DragonBreath],
        frames: {
          max: 4,
          hold: 60,
        },
        scale: 0.88,
        animate: true,
        isEnemy: true,
        health: 170,
      },
    draggle : {
          name: "Draggle",
          image: draggleImg,
          attack: [attacks.Tackle, attacks.FireBall,attacks.DragonBreath],
          frames: {
            max: 4,
            hold: 70,
          },
          scale: 0.88,
          animate: true,
          isEnemy: true,
          health: 160,
        },
      draggle2 : {
          name: "Draggle",
          image: draggle2Img,
          attack: [attacks.Tackle, attacks.FireBall,attacks.DragonBreath],
          frames: {
            max: 4,
            hold: 70,
          },
          scale: 0.88,
          animate: true,
          isEnemy: true,
          health: 180,
        },
      terradon: {
          name: "Terradon",
          image: terradonImg,
          attack: [attacks.Tackle, attacks.FireBall,attacks.DragonBreath],
          frames: {
            max: 4,
            hold: 70,
          },
          scale: 1,
          animate: true,
          isEnemy: true,
          health: 180,
        },
}

function setPlayerMonsterPositions() {
  for (const key in playerMonsters) {
    const playermonster = playerMonsters[key];
    playermonster.position = {x: 300, y: 320,}
  }
}
setPlayerMonsterPositions();

function setEnemyMonsterPositions() {
  for (const key in monsters) {
    const monster = monsters[key];
    monster.position = {x: 800, y: 110,}
  }   
}
setEnemyMonsterPositions();

function getRandomMonster() {
  const monsterKeys = Object.keys(monsters); //gets the keys of the monsters in "monsters" object and stores in an array
  const randomKey = monsterKeys[Math.floor(Math.random() * monsterKeys.length)];
  return monsters[randomKey]; //returns a random monster
}
