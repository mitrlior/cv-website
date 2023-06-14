let w, h, loopId, canvas, ctx, particles, id;

const options = {
  particleColor: "rgba(255, 255, 255)",
  lineColor: "rgba(0, 181, 255)",
  particleAmount: 100,
  defaultRadius: 5,
  variantRadius: 2,
  defaultSpeed: 1,
  variantSpeed: 1.5,
  linkRadius: 100,
};

const rgb = options.lineColor.match(/\d+/g);

document.addEventListener("DOMContentLoaded", init);

function init() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  resizeReset();
  initializeElements();
  startAnimation();
}

function resizeReset() {
  const html = document.documentElement;
  w = canvas.width = document.documentElement.clientWidth;
  h = canvas.height = html.clientHeight + html.scrollHeight + html.offsetHeight;
}

function initializeElements() {
  particles = [];
  for (let i = 0; i < options.particleAmount; i++) {
    particles.push(new Particle());
  }
  particles.push(new Particle()); // mouse particle
}

function startAnimation() {
  loopId = requestAnimationFrame(animationLoop);
}

function animationLoop() {
  ctx.clearRect(0, 0, w, h);
  drawScene();

  id = requestAnimationFrame(animationLoop);
}

function drawScene() {
  drawLine();
  drawParticle();
}

function drawParticle() {
  for (let i = 0; i < options.particleAmount; i++) {
    particles[i].update();
    particles[i].draw();
  }
  particles[particles.length - 1].draw();
}

function drawLine() {
  for (let i = 0; i < particles.length - 1; i++) {
    linkPoints(particles[i], particles);
  }
}

function linkPoints(point, hubs) {
  for (let i = 0; i < hubs.length; i++) {
    const distance = checkDistance(point.x, point.y, hubs[i].x, hubs[i].y);
    const opacity = 1 - distance / options.linkRadius;
    if (opacity > 0) {
      ctx.lineWidth = 0.5;
      ctx.strokeStyle =
        "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + opacity + ")";
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
      ctx.lineTo(hubs[i].x, hubs[i].y);
      ctx.closePath();
      ctx.stroke();
    }
  }
}

function checkDistance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

Particle = function () {
  const _this = this;

  _this.x = Math.random() * w;
  _this.y = Math.random() * h;
  _this.color = options.particleColor;
  _this.radius = options.defaultRadius + Math.random() * options.variantRadius;
  _this.speed = options.defaultSpeed + Math.random() * options.variantSpeed;
  _this.directionAngle = Math.floor(Math.random() * 360);
  _this.vector = {
    x: Math.cos(_this.directionAngle) * _this.speed,
    y: Math.sin(_this.directionAngle) * _this.speed,
  };

  _this.update = function () {
    _this.border();
    _this.x += _this.vector.x;
    _this.y += _this.vector.y;
  };

  _this.updateMouse = function (x, y) {
    _this.border();
    _this.x = x;
    _this.y = y;
  };

  _this.border = function () {
    if (_this.x >= w || _this.x <= 0) {
      _this.vector.x *= -1;
    }

    if (_this.y >= h || _this.y <= 0) {
      _this.vector.y *= -1;
    }
    if (_this.x > w) _this.x = w;
    if (_this.y > h) _this.y = h;
    if (_this.x < 0) _this.x = 0;
    if (_this.y < 0) _this.y = 0;
  };

  _this.draw = function () {
    ctx.beginPath();
    ctx.arc(_this.x, _this.y, _this.radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = _this.color;
    ctx.fill();
  };
};

document.addEventListener("mouseleave", function (e) {
  if ((particles.length = options.particleAmount + 1)) {
    particles.pop();
  }
});

document.addEventListener("mousemove", function (e) {
  let x = e.pageX;
  let y = e.pageY;
  if ((particles.length = options.particleAmount)) {
    particles.push(new Particle()); // mouse particle
  }
  particles[options.particleAmount].updateMouse(x, y);
});


function generatePDF() {
  const { jsPDF } = window.jspdf;
  let jsPdf = new jsPDF("p", "pt", "a4");
  
  const button = document.getElementById("cv-download");
  button.style.visibility = "hidden";
  const htmlElement = document.getElementById("cv").cloneNode(true);
  button.style.visibility = "visible";

  const opt = {
    callback: function (jsPdf) {
      jsPdf.save("Test.pdf");
    },
    margin: [10, 50, 0, 0],
    autoPaging: "text",
    html2canvas: {
      allowTaint: true,
      dpi: 300,
      letterRendering: true,
      logging: true,
      scale: 0.6,
    },
  };
  jsPdf.html(htmlElement, opt);
}

