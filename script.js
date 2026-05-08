const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// ======================================
// VENTANA DE RECORTE
// ======================================

let xmin = 200;
let ymin = 150;

let xmax = 600;
let ymax = 450;

// ======================================
// CONVERTIR EJE Y
// ======================================

function convertirY(y){

    return HEIGHT - y;
}

// ======================================
// DIBUJAR GRID
//Las líneas se trazan a partir de una función no primitiva del canvas
// ======================================

function dibujarGrid(){

    ctx.strokeStyle = "#d1d5db";

    for(let x = 0; x <= WIDTH; x += 50){

        ctx.beginPath();

        ctx.moveTo(x, 0);

        ctx.lineTo(x, HEIGHT);

        ctx.stroke();
    }

    for(let y = 0; y <= HEIGHT; y += 50){

        ctx.beginPath();

        ctx.moveTo(0, y);

        ctx.lineTo(WIDTH, y);

        ctx.stroke();
    }
}

// ======================================
// FUNCION PERSONALIZADA LINEA
// ======================================

function dibujarLinea(x1, y1, x2, y2, color){

    ctx.strokeStyle = color;

    ctx.lineWidth = 3;

    ctx.beginPath();

    ctx.moveTo(x1, convertirY(y1));

    ctx.lineTo(x2, convertirY(y2));

    ctx.stroke();
}

// ======================================
// FUNCION VIEWPORT
// ======================================

function dibujarViewport(){

    ctx.strokeStyle = "blue";

    ctx.lineWidth = 4;

    ctx.strokeRect(
        xmin,
        convertirY(ymax),
        xmax - xmin,
        ymax - ymin
    );
}

// ======================================
// DIBUJAR ESCENA
// ======================================

function dibujar(){

    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    dibujarGrid();

    dibujarViewport();

    // linea de prueba

    dibujarLinea(
        100,
        100,
        700,
        500,
        "red"
    );
}

dibujar();