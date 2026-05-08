const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// =====================================================
// VIEWPORT
// =====================================================

let xmin = 200;
let ymin = 150;

let xmax = 600;
let ymax = 450;

// =====================================================
// ESCENAS
// =====================================================

const escenas = [

    // 1. totalmente dentro
    {
        nombre: "Totalmente dentro",

        x1: 300,
        y1: 250,

        x2: 500,
        y2: 400
    },

    // 2. totalmente fuera
    {
        nombre: "Totalmente fuera",

        x1: 50,
        y1: 520,

        x2: 120,
        y2: 580
    },

    // 3. entrada parcial izquierda
    {
        nombre: "Entrada por izquierda",

        x1: 50,
        y1: 300,

        x2: 450,
        y2: 300
    },

    // 4. cruce exacto por esquina
    {
        nombre: "Cruce por esquina",

        x1: 50,
        y1: 550,

        x2: 400,
        y2: 300
    },

    // 5. cruce completo
    {
        nombre: "Cruce total",

        x1: 50,
        y1: 100,

        x2: 750,
        y2: 520
    }
];

let escenaActual = 0;

// =====================================================
// CODIGOS
// =====================================================

const INSIDE = 0;

const LEFT = 1;
const RIGHT = 2;

const BOTTOM = 4;
const TOP = 8;

// =====================================================
// CONVERTIR Y
// =====================================================

function convertirY(y){

    return HEIGHT - y;
}

// =====================================================
// GRID
// =====================================================

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

// =====================================================
// LINEA PERSONALIZADA
// =====================================================

function dibujarLinea(x1, y1, x2, y2, color){

    ctx.strokeStyle = color;

    ctx.lineWidth = 4;

    ctx.beginPath();

    ctx.moveTo(x1, convertirY(y1));

    ctx.lineTo(x2, convertirY(y2));

    ctx.stroke();
}
// =====================================================
// DIBUJAR PUNTO
// =====================================================

function dibujarPunto(x, y, color){

    ctx.fillStyle = color;

    ctx.beginPath();

    ctx.arc(
        x,
        convertirY(y),
        6,
        0,
        Math.PI * 2
    );

    ctx.fill();
}
// =====================================================
// VIEWPORT
// =====================================================

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

// =====================================================
// CODIGO DE REGION
// =====================================================

function obtenerCodigo(x, y){

    let codigo = INSIDE;

    if(x < xmin){

        codigo |= LEFT;
    }

    else if(x > xmax){

        codigo |= RIGHT;
    }

    if(y < ymin){

        codigo |= BOTTOM;
    }

    else if(y > ymax){

        codigo |= TOP;
    }

    return codigo;
}

// =====================================================
// COHEN SUTHERLAND
// =====================================================

function cohenSutherland(x1, y1, x2, y2){

    let codigo1 = obtenerCodigo(x1, y1);

    let codigo2 = obtenerCodigo(x2, y2);

    let aceptar = false;

    while(true){

        // totalmente dentro

        if((codigo1 | codigo2) === 0){

            aceptar = true;

            break;
        }

        // totalmente fuera

        else if((codigo1 & codigo2) !== 0){

            break;
        }

        // parcialmente visible

        else{

            let codigoFuera;

            let x, y;

            if(codigo1 !== 0){

                codigoFuera = codigo1;
            }

            else{

                codigoFuera = codigo2;
            }

            // arriba

            if(codigoFuera & TOP){

                x = x1 + (x2 - x1) *
                (ymax - y1) / (y2 - y1);

                y = ymax;
            }

            // abajo

            else if(codigoFuera & BOTTOM){

                x = x1 + (x2 - x1) *
                (ymin - y1) / (y2 - y1);

                y = ymin;
            }

            // derecha

            else if(codigoFuera & RIGHT){

                y = y1 + (y2 - y1) *
                (xmax - x1) / (x2 - x1);

                x = xmax;
            }

            // izquierda

            else if(codigoFuera & LEFT){

                y = y1 + (y2 - y1) *
                (xmin - x1) / (x2 - x1);

                x = xmin;
            }

            // actualizar punto 1

            if(codigoFuera === codigo1){

                x1 = x;
                y1 = y;

                codigo1 = obtenerCodigo(x1, y1);
            }

            // actualizar punto 2

            else{

                x2 = x;
                y2 = y;

                codigo2 = obtenerCodigo(x2, y2);
            }
        }
    }

    if(aceptar){

        return {

            x1,
            y1,
            x2,
            y2
        };
    }

    return null;
}

// =====================================================
// DIBUJAR ESCENA
// =====================================================

function dibujar(){

    let linea = escenas[escenaActual];

    // actualizar informacion

    document.getElementById("tituloCaso").innerText =
    linea.nombre;

    document.getElementById("descripcionCaso").innerText =
    "Visualizacion del caso del algoritmo Cohen-Sutherland.";

    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    dibujarGrid();

    dibujarViewport();

    // titulo

    ctx.fillStyle = "black";

    ctx.font = "22px Arial";

    ctx.fillText(
        "Caso: " + linea.nombre,
        20,
        30
    );

    // linea original

    dibujarLinea(
        linea.x1,
        linea.y1,
        linea.x2,
        linea.y2,
        "gray"
    );

    // puntos extremos

    dibujarPunto(
        linea.x1,
        linea.y1,
        "black"
    );

    dibujarPunto(
        linea.x2,
        linea.y2,
        "black"
    );

    // coordenadas

    ctx.fillStyle = "black";

    ctx.font = "16px Arial";

    ctx.fillText(
        `(${linea.x1}, ${linea.y1})`,
        linea.x1 + 10,
        convertirY(linea.y1) - 10
    );

    ctx.fillText(
        `(${linea.x2}, ${linea.y2})`,
        linea.x2 + 10,
        convertirY(linea.y2) - 10
    );

    // linea recortada

    let resultado = cohenSutherland(
        linea.x1,
        linea.y1,
        linea.x2,
        linea.y2
    );

    if(resultado){

        dibujarLinea(
            resultado.x1,
            resultado.y1,
            resultado.x2,
            resultado.y2,
            "red"
        );
    }
}

// =====================================================
// SIGUIENTE
// =====================================================

function siguiente(){

    escenaActual++;

    if(escenaActual >= escenas.length){

        escenaActual = 0;
    }

    dibujar();
}

// =====================================================
// ANTERIOR
// =====================================================

function anterior(){

    escenaActual--;

    if(escenaActual < 0){

        escenaActual = escenas.length - 1;
    }

    dibujar();
}

// =====================================================
// INICIO
// =====================================================

dibujar();