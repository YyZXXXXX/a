let player1, player2;
let bullets = [];
let bgImg;
let bgX = 0;

// 宣告角色圖片變數
let player1Imgs = {};
let player2Imgs = {};


let sprites = {
  // 第一個角色的精靈圖（原有的）
  player1: {
    idle: {
      img: null,
      width: 51,
      height: 47,
      frames: 5
    },
    walk: {
      img: null,
      width: 41,
      height: 47,
      frames: 5
    },
    
    jump: {
      img: null,
      width: 35,
      height: 39,
      frames: 5
    }
  },
  // 第二個角色的精靈圖
  player2: {
    idle: {
      img: null,
      width: 88,
      height: 191,
      frames: 8
    },
    walk: {
      img: null,
      width: 177,
      height: 177,
      frames: 11
    },
    jump: {
      img: null,
      width: 221,
      height: 185,
      frames: 12
    }
  }
};

function preload() {
  // 載入背景圖片
  bgImg = loadImage('HaloZeroBGs.png');
  
  // 載入玩家1(紅方)的圖片
  player1Imgs.stand = loadImage('allrun.png');
  player1Imgs.move = loadImage('allice.png');
  player1Imgs.shoot = loadImage('allpunch.png');
  
  // 載入玩家2(藍方)的圖片
  player2Imgs.stand = loadImage('alrun.png');
  player2Imgs.move = loadImage('alice.png');
  player2Imgs.shoot = loadImage('alpunch.png');
}

class Player {
  constructor(x, y, color, controls, images) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.speed = 5;
    this.health = 100;
    this.controls = controls;
    this.images = images;
    this.currentImage = 'stand';  // 目前動作狀態
    this.direction = 1;           // 1表示面向右邊，-1表示面向左邊
    this.animationTimer = 0;      // 動畫計時器
  }

  move() {
    let isMoving = false;
    
    if (keyIsDown(this.controls.left)) {
      this.x -= this.speed;
      this.direction = -1;
      isMoving = true;
    }
    if (keyIsDown(this.controls.right)) {
      this.x += this.speed;
      this.direction = 1;
      isMoving = true;
    }
    if (keyIsDown(this.controls.up)) {
      this.y -= this.speed;
      isMoving = true;
    }
    if (keyIsDown(this.controls.down)) {
      this.y += this.speed;
      isMoving = true;
    }
    
    // 更新動作狀態
    if (isMoving) {
      this.currentImage = 'move';
    } else {
      this.currentImage = 'stand';
    }
    
    // 限制角色在畫面內
    this.x = constrain(this.x, 0, width);
    this.y = constrain(this.y, 0, height);
  }

  shoot() {
    if (keyIsDown(this.controls.shoot)) {
      this.currentImage = 'shoot';
      if (frameCount % 10 === 0) { // 限制發射頻率
        bullets.push(new Bullet(this.x, this.y, this.direction));
      }
    }
  }

  display() {
    push();
    imageMode(CENTER);
    
    // 根據方向翻轉圖片
    translate(this.x, this.y);
    if (this.direction === -1) {
      scale(-1, 1);
    }
    
    // 繪製當前狀態的圖片
    image(this.images[this.currentImage], 0, 0, 60, 60);
    
    pop();
    
    // 顯示生命值
    fill(0);
    textSize(12);
    text(`HP: ${this.health}`, this.x - 20, this.y - 40);
  }
}

// Bullet 類別保持不變
class Bullet {
  constructor(x, y, direction) {
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.speed = 7;
  }

  move() {
    this.x += this.speed * this.direction;
  }

  display() {
    fill('yellow');
    circle(this.x, this.y, 10);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // 建立兩個玩家，並傳入對應的圖片
  player1 = new Player(200, height/2, 'red', {
    left: 65,  // A
    right: 68, // D
    up: 87,    // W
    down: 83,  // S
    shoot: 70  // F
  }, player1Imgs);
  
  player2 = new Player(600, height/2, 'blue', {
    left: LEFT_ARROW,
    right: RIGHT_ARROW,
    up: UP_ARROW,
    down: DOWN_ARROW,
    shoot: 191  // /
  }, player2Imgs);
}

// draw 函數保持不變
function draw() {
  // 繪製移動的背景
  image(bgImg, bgX, 0, width, height);
  image(bgImg, bgX + width, 0, width, height);
  
  bgX -= 1;
  if (bgX <= -width) {
    bgX = 0;
  }

  player1.move();
  player1.shoot();
  player1.display();
  
  player2.move();
  player2.shoot();
  player2.display();

  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].move();
    bullets[i].display();
    
    if (dist(bullets[i].x, bullets[i].y, player1.x, player1.y) < 15) {
      player1.health -= 10;
      bullets.splice(i, 1);
    } else if (dist(bullets[i].x, bullets[i].y, player2.x, player2.y) < 15) {
      player2.health -= 10;
      bullets.splice(i, 1);
    }
    
    if (bullets[i] && (bullets[i].x < 0 || bullets[i].x > width)) {
      bullets.splice(i, 1);
    }
  }
}
