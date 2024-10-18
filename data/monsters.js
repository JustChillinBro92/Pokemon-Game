const embyImg = new Image();
embyImg.src = "./img/embySprite.png";

const draggleImg = new Image();
draggleImg.src = "./img/draggleSprite.png";

const monsters = {
    emby : {
        position: {
            x: 290,
            y: 340,
          },
          name: "Emby",
          image: embyImg,
          attack: [attacks.Tackle, attacks.FireBall],
          frames: {
            max: 4,
            hold: 60,
          },
          scale: 0.9,
          animate: true,
    },

    draggle : {
        position: {
            x: 800,
            y: 115,
          },
          name: "Draggle",
          image: draggleImg,
          attack: [attacks.Tackle, attacks.FireBall],
          frames: {
            max: 4,
            hold: 70,
          },
          scale: 0.85,
          animate: true,
          isEnemy: true,
    }
}

