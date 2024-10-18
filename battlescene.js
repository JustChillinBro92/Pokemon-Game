const BattleBackgroundImg = new Image();
BattleBackgroundImg.src = "./img/battleBackground.png";

const BattleBackground = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  image: BattleBackgroundImg,
});

//creating the monster sprites
let Draggle;
let Emby;
let renderedSprites; //array for storing rendered out projectile attacks
let queue; //queue for pushing enemy attacks

function initBattle() {
  document.querySelector("#Interface").style.display = "block";
  document.querySelector("#DialogueBox").style.display = "none";
  document.querySelector("#enemyHealthBar").style.display = "block";
  document.querySelector("#playerHealthBar").style.display = "block";
  document.querySelector("#enemyHealthBar").style.width = "98.5%";
  document.querySelector("#playerHealthBar").style.width = "98.5%";
  document.querySelector("#attacksBox").replaceChildren(); //removes the appended attack buttons with each battle

  Draggle = new Monster(monsters.draggle);
  Emby = new Monster(monsters.emby);
  renderedSprites = [Draggle, Emby];
  queue = []

  Emby.attack.forEach((attack) => {
    const button = document.createElement("button");
    button.innerHTML = attack.name;
    document.querySelector("#attacksBox").append(button);

    button.addEventListener("mouseenter", () => {
      document.querySelector("#AttackTypeBox").innerHTML = attack.type;
      document.querySelector("#AttackTypeBox").style.color = attack.color;
    });

    //event listeners for our attack buttons
      button.addEventListener("click", (e) => {
        //console.log(e.currentTarget.innerHTML);
        //console.log(attacks[e.currentTarget.innerHTML]);
        const selectedAttack = attacks[e.currentTarget.innerHTML];

        Emby.Attack({
          attack: selectedAttack,
          recipient: Draggle,
          renderedSprites,
        });

        if (Draggle.health <= 0) {
          queue.push(() => {
            Draggle.faint();
          });
          queue.push(() => {
            gsap.to("#OverlappingDiv", {
              opacity: 1,
              OnComplete: () => {
                window.cancelAnimationFrame(animateBattleId);
                animate();
                document.querySelector("#Interface").style.display = "none";

                gsap.to("#OverlappingDiv", {
                  opacity: 0,
                });
                battle.initiated = false;
                audio.victory.stop();
                audio.Map.play();
              },
            });
          });
        }

        //enemy attacks
        const randomAttack =
          Draggle.attack[Math.floor(Math.random() * Draggle.attack.length)];

          queue.push(() => {
            Draggle.Attack({
              attack: randomAttack,
              recipient: Emby,
              renderedSprites,
            });

            console.log(queue.length);

            if (Emby.health <= 0) {
            // after each enemy attack check player monster's health
              queue.push(() => {
                Emby.faint();
              });
              queue.push(() => {
                gsap.to("#OverlappingDiv", {
                  opacity: 1,
                  OnComplete: () => {
                    window.cancelAnimationFrame(animateBattleId);
                    animate();
                    document.querySelector("#Interface").style.display = "none";
    
                    gsap.to("#OverlappingDiv", {
                      opacity: 0,
                    });
                    battle.initiated = false;
                    audio.victory.stop();
                    audio.Map.play();
                  },
                });
              });
            }
          });
        });
    });
}

let animateBattleId;

function animateBattle() {
  animateBattleId = window.requestAnimationFrame(animateBattle);
  //console.log("animating battle sequence");
  BattleBackground.draw();

  //rendering all the monsters and their attacks
  renderedSprites.forEach((sprite) => {
  sprite.draw();
  });
}
animate();
// initBattle();     //maintaining this order of calling the two function is must
// animateBattle();

document.querySelector("#DialogueBox").addEventListener("click", (e) => {
  if (queue.length > 0) {
    queue[0](); //calling the 0th index of queue i.e., the attack that was pushed in enemy queue
    queue.shift(); //popping the attack from enemy attack queue
  } else e.currentTarget.style.display = "none";
});
