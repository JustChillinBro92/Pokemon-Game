const audio = {
    Map : new Howl({
        src: './audio/map.wav',
        html5: true,
        volume: 0.2
    }),
    grass: new Howl ({
        src: './audio/grass.wav',
        html5: true,
        volume: 0.15,
    }),
    initBattle : new Howl({
        src: './audio/initBattle.wav',
        html5: true,
        volume: 0.03
    }),
    battle : new Howl({
        src: './audio/battle.mp3',
        html5: true,
        volume: 0.1
    }),
    victory : new Howl({
        src: './audio/victory.wav',
        html5: true,
        volume: 0.8
    }),
    run: new Howl({
        src: './audio/run.wav',
        html5: true,
        volume: 0.15,
    }),
    TackleHit : new Howl({
        src: './audio/tackleHit.wav',
        html5: true,
        volume: 0.1
    }),
    initFireball : new Howl({
        src: './audio/initFireball.wav',
        html5: true,
        volume: 0.1
    }),
    FireballHit : new Howl({
        src: './audio/FireballHit.wav',
        html5: true,
        volume: 0.08
    }),
}