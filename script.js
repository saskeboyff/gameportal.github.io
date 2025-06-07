const game = document.getElementById("game");
const player = document.getElementById("player");
const hpEl = document.getElementById("hp");
const killsEl = document.getElementById("kills");
const gameOverText = document.getElementById("game-over");

let hp = 100;
let kills = 0;
let isGameOver = false;
let enemies = [];

let x = 384, y = 234;
document.addEventListener("keydown", (e) => {
  if (isGameOver) return;
  const speed = 8;
  if (e.key === "w") y -= speed;
  if (e.key === "s") y += speed;
  if (e.key === "a") x -= speed;
  if (e.key === "d") x += speed;

  x = Math.max(0, Math.min(768, x));
  y = Math.max(0, Math.min(468, y));
  player.style.left = x + "px";
  player.style.top = y + "px";
});

document.addEventListener("keydown", (e) => {
  if (e.key === " ") shoot();
});

function shoot() {
  const bullet = document.createElement("div");
  bullet.className = "bullet";
  bullet.style.left = (x + 13) + "px";
  bullet.style.top = y + "px";
  game.appendChild(bullet);

  const interval = setInterval(() => {
    let pos = parseInt(bullet.style.top);
    bullet.style.top = (pos - 10) + "px";

    enemies.forEach((enemy, i) => {
      if (checkCollision(bullet, enemy)) {
        bullet.remove();
        enemy.remove();
        enemies.splice(i, 1);
        kills++;
        killsEl.textContent = kills;
        clearInterval(interval);
      }
    });

    if (pos < 0) {
      bullet.remove();
      clearInterval(interval);
    }
  }, 20);
}

function spawnEnemy() {
  const enemy = document.createElement("div");
  enemy.className = "enemy";
  const ex = Math.random() * 770;
  enemy.style.left = ex + "px";
  enemy.style.top = "0px";
  game.appendChild(enemy);
  enemies.push(enemy);

  const interval = setInterval(() => {
    if (isGameOver) {
      clearInterval(interval);
      return;
    }

    const ey = parseInt(enemy.style.top);
    const ex = parseInt(enemy.style.left);
    const dx = x - ex;
    const dy = y - ey;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 10) {
      enemy.remove();
      hp -= 20;
      hpEl.textContent = hp;
      clearInterval(interval);
      if (hp <= 0) endGame();
      return;
    }

    const speed = 1.5;
    enemy.style.left = (ex + speed * dx / dist) + "px";
    enemy.style.top = (ey + speed * dy / dist) + "px";
  }, 30);
}

function checkCollision(a, b) {
  const r1 = a.getBoundingClientRect();
  const r2 = b.getBoundingClientRect();
  return !(
    r1.right < r2.left ||
    r1.left > r2.right ||
    r1.bottom < r2.top ||
    r1.top > r2.bottom
  );
}

function endGame() {
  isGameOver = true;
  gameOverText.hidden = false;
}

setInterval(() => {
  if (!isGameOver) spawnEnemy();
}, 1500);
