// FIRST TASK - Project setup
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 567;
c.fillRect(0, 0, canvas.width, canvas.height); // Fundo preto

// Pegar sprites dos personagens selecionados na página de seleção
let spritesPlayerOne = {};
let spritesPlayerTwo = {};

// Informações dos perfis
let perfilPlayer = document.querySelector('#image_player');
let perfilEnemy = document.querySelector('#image_enemy');

let playerSettingOne;
let playerSettingTwo;

if (window.localStorage.PlayerOne && window.localStorage.PlayerTwo) {
    playerSettingOne = localStorage.getItem('PlayerOne');
    playerSettingTwo = localStorage.getItem('PlayerTwo');
} else {
    // Se não carregar, personagens padrões
    alert('A seleção de personagens deu errado :( Mas aproveite com os personagens padrões!');
    playerSettingOne = 'knight';
    playerSettingTwo = 'mago';
}

// Montar sprites de cada jogador
settings.forEach(e => {
    if (playerSettingOne === e.nome) {
        spritesPlayerOne = {
            idle: e.sprites.idle,
            run: e.sprites.run,
            jump: e.sprites.jump,
            fall: e.sprites.fall,
            attack1: e.sprites.attack1,
            takeHit: e.sprites.takeHit,
            death: e.sprites.death
        };
        perfilPlayer.src = e.perfil;
    }

    if (playerSettingTwo === e.nome) {
        spritesPlayerTwo = {
            idle: e.sprites.idle,
            run: e.sprites.run,
            jump: e.sprites.jump,
            fall: e.sprites.fall,
            attack1: e.sprites.attack1,
            takeHit: e.sprites.takeHit,
            death: e.sprites.death
        };
        perfilEnemy.src = e.perfil;
    }
});

// Mostrar nomes dos players
let textPlayer = document.querySelector('.name-text-pl span');
let textEnemy = document.querySelector('.name-text-en span');
textPlayer.textContent = playerSettingOne;
textEnemy.textContent = playerSettingTwo;

// Configurações gerais
const gravity = 0.7;

// BACKGROUND
const background = new Sprite({
    position: { x: 0, y: 0 },
    imgSrc: '../imagens/game/background_game.png'
});

const characterBack = new Sprite({
    position: { x: 260, y: 115 },
    imgSrc: '../imagens/game/dormammu.png',
    scale: 1.5,
    framesMax: 10,
    framesHold: 7
});

// Player
const player = new Fighter({
    position: { x: 200, y: 400 },
    velocity: { x: 0, y: 0 },
    color: '#FE2C54',
    imgSrc: spritesPlayerOne.idle.imgSrc,
    framesMax: spritesPlayerOne.idle.framesMax,
    framesHold: 10,
    scale: 1.8,
    offset: { x: 215, y: 147 },
    sprites: spritesPlayerOne,
    attackBox: {
        offset: { x: 100, y: 0 },
        width: 144,
        height: 50
    }
});

// Enemy
const enemy = new Fighter({
    position: { x: 854, y: 400 },
    velocity: { x: 0, y: 0 },
    offset: { x: -50, y: 0 },
    imgSrc: spritesPlayerTwo.idle.imgSrc,
    framesMax: spritesPlayerTwo.idle.framesMax,
    scale: 1.8,
    offset: { x: 215, y: 147 },
    sprites: spritesPlayerTwo,
    attackBox: {
        offset: { x: -300, y: 0 },
        width: 144,
        height: 50
    }
});

// Controles
const keys = {
    a: { pressed: false },
    d: { pressed: false },
    ArrowRight: { pressed: false },
    ArrowLeft: { pressed: false }
};

decreaseTimer();

// Loop de animação
function animate() {
    window.requestAnimationFrame(animate);

    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);

    background.update();
    characterBack.update();

    c.fillStyle = 'rgba(255,255,255,0.05)';
    c.fillRect(0, 0, canvas.width, canvas.height);

    if (!(keys.a.pressed && player.lastKey === 'a')) {
        player.update();
    }
    if (!(keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight')) {
        enemy.updateEnemy(); // imagem espelhada
    }

    // Movimentação Player
    player.velocity.x = 0;
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5;
        player.updateEnemy();
        player.switchSprite('run');
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5;
        player.switchSprite('run');
    } else {
        player.switchSprite('idle');
    }

    if (player.velocity.y < 0) {
        player.switchSprite('jump');
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall');
    }

    // Movimentação Enemy
    enemy.velocity.x = 0;
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5;
        enemy.switchSprite('run');
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5;
        enemy.update();
        enemy.switchSprite('run');
    } else {
        enemy.switchSprite('idle');
    }

    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump');
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall');
    }

    // Ataques - Player
    if (colisao({ player1: player, enemy: enemy }) &&
        player.isAttacking && player.framaCurrent === 4) {
        enemy.takeHit();
        player.isAttacking = false;
        gsap.to('#enemyHealth', { width: enemy.health + '%' });
    }
    if (player.isAttacking && player.framaCurrent === 4) {
        player.isAttacking = false;
    }

    // Ataques - Enemy
    if (colisao({ player1: player, enemy: enemy }) &&
        enemy.isAttacking && enemy.framaCurrent === 4) {
        player.takeHit();
        enemy.isAttacking = false;
        gsap.to('#playerHealth', { width: player.health + '%' });
    }
    if (enemy.isAttacking && enemy.framaCurrent === 4) {
        enemy.isAttacking = false;
    }

    // Game Over
    if (player.health <= 0 || enemy.health <= 0) {
        if (player.health <= 0 && enemy.health > 0) {
            player.switchSprite('death');
        }
        if (enemy.health <= 0 && player.health > 0) {
            enemy.switchSprite('death');
        }
        if (enemy.health === player.health) {
            enemy.switchSprite('death');
            player.switchSprite('death');
        }
        winner({ player, enemy, timerID });
    }
}
animate();

// Controles
let blockControlE = false;
let blockControlP = false;

// Keyboard
window.addEventListener('keydown', event => {
    if (!blockControlP && !player.dead) {
        switch (event.key) {
            case 'd':
                keys.d.pressed = true;
                player.lastKey = 'd';
                break;
            case 'a':
                keys.a.pressed = true;
                player.lastKey = 'a';
                break;
            case 'w':
                if (player.velocity.y === 0) player.velocity.y = -14;
                break;
            case 's':
                player.attacks();
                break;
        }
    }

    if (!blockControlE && !enemy.dead) {
        switch (event.key) {
            case 'ArrowRight':
                keys.ArrowRight.pressed = true;
                enemy.lastKey = 'ArrowRight';
                break;
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true;
                enemy.lastKey = 'ArrowLeft';
                break;
            case 'ArrowUp':
                if (enemy.velocity.y === 0) enemy.velocity.y = -14;
                break;
            case 'ArrowDown':
                enemy.attacks();
                break;
        }
    }
});

window.addEventListener('keyup', event => {
    switch (event.key) {
        case 'd': keys.d.pressed = false; break;
        case 'a': keys.a.pressed = false; break;
        case 'ArrowRight': keys.ArrowRight.pressed = false; break;
        case 'ArrowLeft': keys.ArrowLeft.pressed = false; break;
    }
});
