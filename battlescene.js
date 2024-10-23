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
let enemy;
let partner;
let renderedSprites; //array for storing rendered out projectile attacks
let queue; //queue for pushing enemy attacks

function initBattle() {
  document.querySelector("#Interface").style.display = "block";
  document.querySelector("#encounterBox").style.display = "block";
  document.querySelector("#BattleBox").style.display = "flex";
  
  document.querySelector("#DialogueBox").style.display = "none";
  document.querySelector("#enemyHealthBar").style.display = "block";
  document.querySelector("#playerHealthBar").style.display = "block";
  document.querySelector("#enemyHealthBar").style.backgroundColor = "rgb(58, 227, 58)";
  document.querySelector("#playerHealthBar").style.backgroundColor = "rgb(58, 227, 58)";

  document.querySelector("#enemyHealthBar").style.width = "98.5%";
  document.querySelector("#playerHealthBar").style.width = "98.5%";
  document.querySelector("#attacksBox").replaceChildren(); //removes the appended attack buttons with each battle

  enemy = new Monster(getRandomMonster());
  partner = new Monster(playerMonsters.emby);
  enemy.health = enemy.maxHealth;
  partner.health = partner.maxHealth;


  document.querySelector("#encounterBox").innerHTML = "A Wild " + enemy.name + " Appeared! ";

  document.querySelector("#encounterBox").addEventListener("click", () => {
    console.log("box clicked")
    document.querySelector("#BattleBox").style.opacity = "1";
    document.querySelector("#BattleBox").style.visibility = "visible";
  })

   document.querySelector("#fight").addEventListener("click", () => {
     document.querySelector("#BattleBox").style.opacity = "0";
     document.querySelector("#BattleBox").style.visibility = "hidden"
     document.querySelector("#encounterBox").style.display = "none";
   })
  
   
   document.querySelector("#run").addEventListener("click", () => {

    document.querySelector("#BattleBox").style.visibility = "hidden"
    document.querySelector("#encounterBox").style.display = "none";
    // document.querySelector("#attackTypeBox").style.display = "none";
    // document.querySelector("#attacksBox").style.display = "none"
    document.querySelector("#DialogueBox").innerHTML = " Ran away safely! ";
    document.querySelector("#DialogueBox").styale.display = "block";

    audio.run.volume = 0.15;
    audio.run.currentTime = 0;

    if(!audio.run.paused) {
      audio.run.play();
      audio.run.pause();
    }
    
    queue.push(()=> {
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
          audio.battle.stop();
          audio.Map.play();
        },
      })
    })
    })

  document.querySelector("#enemyMon").innerHTML = enemy.name;
  document.querySelector("#playerMon").innerHTML = partner.name;

  renderedSprites = [enemy, partner];
  queue = []

  partner.attack.forEach((attack) => {
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

        partner.Attack({
          attack: selectedAttack,
          recipient: enemy,
          renderedSprites,
        });
        
        if (enemy.health <= 0) {
          queue.push(() => {
            enemy.faint();
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
          enemy.attack[Math.floor(Math.random() * enemy.attack.length)];

          queue.push(() => {
            enemy.Attack({
              attack: randomAttack,
              recipient: partner,
              renderedSprites,
            });

            //console.log(queue.length);

            if (partner.health <= 0) {
            // after each enemy attack check player monster's health
              queue.push(() => {
                partner.faint();
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
//initBattle();     //maintaining this order of calling the two function is must
//animateBattle();

document.querySelector("#DialogueBox").addEventListener("click", (e) => {
  if (queue.length > 0) {
    queue[0](); //calling the 0th index of queue i.e., the attack that was pushed in enemy queue
    queue.shift(); //popping the attack from enemy attack queue
  } else e.currentTarget.style.display = "none";
});
