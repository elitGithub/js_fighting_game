const canvas = document.querySelector('canvas');
const canvasContext = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;
canvasContext.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

class Sprite {
    lastKey;

    constructor({ position, velocity, color = 'red' }) {
        this.position = position;
        this.velocity = velocity;
        this.width = 50;
        this.height = 150;
        this.color = color;
        this.attacBox = {
            position: this.position,
            width: 100,
            height: 50,
        };
    }

    draw() {
        canvasContext.fillStyle = this.color;
        canvasContext.fillRect(this.position.x, this.position.y, 50, this.height);
        canvasContext.fillStyle = 'green';
        canvasContext.fillRect(this.attacBox.position.x, this.attacBox.position.y, this.attacBox.width, this.attacBox.height);
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        if (this.position.y + this.height + this.velocity.y > canvas.height) {
            this.velocity.y = 0;
        } else {
            this.velocity.y += gravity;
        }
    }

    move(keys = {}) {
        this.velocity.x = 0;
        if ((keys.a.pressed && (this.lastKey === 'a')) || keys.ArrowLeft.pressed && (this.lastKey === 'ArrowLeft')) {
            this.velocity.x = -5;
        } else if ((keys.d.pressed && (this.lastKey === 'd')) || (keys.ArrowRight.pressed && (this.lastKey === 'ArrowRight'))) {
            this.velocity.x = 5;
        }
    }
}

const player = new Sprite({ position: { x: 0, y: 0 }, velocity: { x: 0, y: 10 } });
const enemy = new Sprite({ position: { x: 400, y: 100 }, velocity: { x: 0, y: 0 }, color: 'blue' });
const keys = {
    a: { pressed: false },
    d: { pressed: false },
    w: { pressed: false },
    ArrowRight: { pressed: false },
    ArrowUp: { pressed: false },
    ArrowLeft: { pressed: false },
};

function animate() {
    window.requestAnimationFrame(animate);
    canvasContext.fillStyle = 'black';
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;
    player.move(keys);
    enemy.move(keys);


    if (detectHorizontalCollision(player, enemy) && detectVerticalCollision(player, enemy)) {
        console.log('hit');
    }
}


function detectHorizontalCollision(player = {}, enemy = {}) {
    return ((player.attacBox.position.x + player.attacBox.width) >= enemy.position.x) && (player.attacBox.position.x <= enemy.position.x + enemy.width);
}

function detectVerticalCollision(player = {}, enemy = {}) {
    return ((player.attacBox.position.y + player.attacBox.height) >= enemy.position.y) && (player.attacBox.position.y <= (enemy.position.y + enemy.height));
}

animate();

window.addEventListener('keydown', (event) => {
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
            player.velocity.y = -20;
            break;
        case 'ArrowRight':
            keys.ArrowRight.pressed = true;
            enemy.lastKey = 'ArrowRight';
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true;
            enemy.lastKey = 'ArrowLeft';
            break;
        case 'ArrowUp':
            enemy.velocity.y = -20;
            break;

    }

});
window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false;
            player.lastKey = 'd';
            break;
        case 'a':
            keys.a.pressed = false;
            player.lastKey = 'a';
            break;

        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            enemy.lastKey = 'ArrowRight';
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;

    }
});
