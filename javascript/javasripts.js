let canvas = document.getElementById("miCanvas");
let ctx = canvas.getContext("2d");

let juego_iniciado = false;
let juego_pausado = false;

// NUEVO → variable para saber si estamos viendo las instrucciones
let mostrando_instrucciones = false;

let pantallaInicio = new Image();
pantallaInicio.src = "imagenes/inicio.png";

let imagenExtra = new Image(); 
imagenExtra.src = "imagenes/instrucciones.png";

let fondo = new Image();
fondo.src = "imagenes/fondo.png";

fondo.onload = function () {
    ctx.drawImage(fondo, 0, 0, canvas.width, canvas.height);
}

let personaje = {
    sprites: [
        document.getElementById("sprite1"),
        document.getElementById("sprite2"),
        document.getElementById("sprite3"),
    ],
    spriteIndex: 0,
    posX: 0,
    posY: canvas.height - 240,
    ancho: 300,
    alto: 300,

    dibujar: function () {
        ctx.drawImage(
            this.sprites[this.spriteIndex],
            this.posX,
            this.posY,
            this.ancho,
            this.alto
        );
    },

    animar: function () {
        if (!juego_pausado) {
            this.spriteIndex++;
            this.spriteIndex = this.spriteIndex % this.sprites.length;
        }
    }
};

canvas.addEventListener("mousemove", function (e) {
    personaje.posX = e.offsetX - personaje.ancho / 2;
});

canvas.addEventListener("click", function () {

    // NUEVO → si estamos viendo instrucciones, un clic las cierra
    if (mostrando_instrucciones) {
        mostrando_instrucciones = false;
        return;
    }

    if (!juego_iniciado) {
        juego_iniciado = true;
        return;
    }

    if (vidas <= 0) {
        vidas = 3;
        comidaY = -50;
        puntuacion = 0;
        juego_iniciado = true;
        return;
    }
});

let comidaImg = document.getElementById("comida_buena");
let comidaImg2 = document.getElementById("comida_buena2");
let comida_mala = document.getElementById("comida_mala");
let comida_mala2 = document.getElementById("comida_mala2");

let comida_actual = 1;
let comidaX = Math.random() * (canvas.width - 50);
let comidaY = -50;
let comidaVelocidad = 2;

let vidas = 3;
let vidaImg = document.getElementById("vida");
let gameOverImg = document.getElementById("gameover");
let puntuacion = 0;

function moverComida() {
    if (!juego_pausado) {
        comidaY += comidaVelocidad;
    }

    if (comidaY > canvas.height) {
        comidaY = -50;
        comidaX = Math.random() * (canvas.width - 50);
        comida_actual = Math.floor(Math.random() * 4) + 1;
    }
}

function dibujarComida() {
    if (comida_actual === 1) ctx.drawImage(comidaImg, comidaX, comidaY, 110, 110);
    if (comida_actual === 2) ctx.drawImage(comidaImg2, comidaX, comidaY, 130, 130);
    if (comida_actual === 3) ctx.drawImage(comida_mala, comidaX, comidaY, 150, 150);
    if (comida_actual === 4) ctx.drawImage(comida_mala2, comidaX, comidaY, 160, 160);
}

function dibujarVidas() {
    for (let i = 0; i < vidas; i++) {
        ctx.drawImage(vidaImg, 20 + (i * 60), 20, 50, 50);
    }
}

function hayColision() {
    return (
        personaje.posX < comidaX + 100 &&
        personaje.posX + personaje.ancho > comidaX &&
        personaje.posY < comidaY + 100 &&
        personaje.posY + personaje.alto > comidaY
    );
}

function comprobarColision() {
    if (hayColision()) {
        if (comida_actual === 3 || comida_actual === 4) {
            vidas--;
        } else {
            puntuacion += 10;
        }

        comidaY = -50;
        comidaX = Math.random() * (canvas.width - 50);
        comida_actual = Math.floor(Math.random() * 4) + 1;
    }
}

function mostrarGameOver() {
    ctx.drawImage(gameOverImg, 0, 0, canvas.width, canvas.height);
}

function dibujarPuntuacion() {
    ctx.font = "42px 'Pixelify Sans'";
    ctx.fillStyle = "black";
    ctx.fillText("Puntos: " + puntuacion, canvas.width - 250, 50);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // NUEVO → si se muestran instrucciones, solo se dibuja eso
    if (mostrando_instrucciones) {
        ctx.drawImage(imagenExtra, 0, 0, canvas.width, canvas.height);
        return;
    }

    if (!juego_iniciado) {
        ctx.drawImage(pantallaInicio, 0, 0, canvas.width, canvas.height);
        return;
    }

    ctx.drawImage(fondo, 0, 0, canvas.width, canvas.height);

    if (vidas <= 0) {
        mostrarGameOver();
        return;
    }

    personaje.dibujar();
    moverComida();
    dibujarComida();
    comprobarColision();
    dibujarVidas();
    dibujarPuntuacion();
}

setInterval(draw, 4);
setInterval(function () { personaje.animar(); }, 500);

// BOTÓN DE INSTRUCCIONES (básico)
document.getElementById("btnImagen").addEventListener("click", function () {
    mostrando_instrucciones = true;
});

// BOTÓN DE PAUSA (básico)
document.getElementById("btnPausa").addEventListener("click", function () {
    juego_pausado = !juego_pausado;
    this.textContent = juego_pausado ? "Reanudar" : "Pausar";
});






