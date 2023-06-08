let canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
// canvasオブジェクト

canvas.width = 400;
canvas.height = 400;

canvas.setAttribute(
  "style",
  "display: block; margin: 0 auto; background-image: url(img/sun-3588618_1280.jpg);"
);

document.body.appendChild(canvas);

// ボールオブジェクト
const ball = {
  x: null,
  y: null,
  width: 5,
  height: 5,
  speed: 4,
  dx: null,
  dy: null,

  update: function () {
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.fill();

    if (this.x < 0 || this.x > canvas.width - this.width / 2) this.dx *= -1;
    if (this.y < 0 || this.y >= canvas.height) this.dy *= -1;

    this.x += this.dx;
    this.y += this.dy;
  },
};

// パドルオブジェクト
const paddle = {
  x: null,
  y: null,
  width: 100,
  height: 15,
  speed: 0,

  update: function () {
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.fill();

    this.x += this.speed;
  },
};

const block = {
  width: null,
  height: 20,
  data: [],

  update: function () {
    this.data.forEach((brick) => {
      ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
      ctx.stroke();
      // ctx.fillStyle = "#fffff0";
    });
  },
};

const level = [
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1],
];



// 初期値
const init = () => {
  paddle.x = canvas.width / 2 - paddle.width / 2;
  paddle.y = canvas.height - paddle.height;

  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2 - 100;
  ball.dx = ball.speed;
  ball.dy = ball.speed;

  block.width = canvas.width / level[0].length;

  for (let i = 0; i < level.length; i++) {
    for (let j = 0; j < level[i].length; j++) {
      // JavaScriptではfalse = 0, 0 = false
      if (level[i][j]) {
        block.data.push({
          x: block.width * j,
          y: block.height * i,
          width: block.width,
          height: block.height,
        });
      }
    }
  }
};

//ボールの衝突検知
const collide = (obj1, obj2) => {
  return (
    obj1.x < obj2.x + obj2.width &&
    obj2.x < obj1.x + obj1.width &&
    obj1.y < obj2.y + obj2.height &&
    obj2.y < obj1.y + obj1.height
  );
};

const loop = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // ブラウザごとに最適なタイミングで繰り返し処理ができる
  window.requestAnimationFrame(loop);
  paddle.update();
  ball.update();
  block.update();

  if (collide(ball, paddle)) {
    ball.dy *= -1;

    ball.y = paddle.y - ball.height;
  }

  block.data.forEach((brick, index) => {
    if (collide(ball, brick)) {
      ball.dy *= -1;
      block.data.splice(index, 1);
    }

    // 追加 パドルが画面からはみ出ない
    if (paddle.x < 0) paddle.x = 0;
    if (paddle.x + paddle.width > canvas.width)
      paddle.x = canvas.width - paddle.width;
  });

  // ===================
  // ゲームオーバー
  // ===================
  if (ball.y + ball.height > canvas.height) {
    ctx.font = "50px century";
    ctx.fillText("Game Over", 70, 150);
    ball.dx = 0;
    ball.dy = 0;

    paddle.x = paddle.x;
  }

  // ===================
  // ゲームクリア
  // ===================

  if (block.data.length == 0) {
    // block.data => ブロックオブジェクトがもっている配列データ
    // → 今、残っているブロックは何個？のデータ

    ctx.font = "40px century";

    ctx.fillText("Congratulations!", 45, 150);
    ball.dx = 0;
    ball.dy = 0;
  }
};

// 初期化
init();

loop();

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") paddle.speed = -6;
  if (e.key === "ArrowRight") paddle.speed = 6;
});

document.addEventListener("keyup", () => (paddle.speed = 0));
