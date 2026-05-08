const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// =====================================================
// VENTANA DE RECORTE
// =====================================================

let xmin = 200;
let ymin = 150;

let xmax = 600;
let ymax = 450;

// =====================================================
// CODIGOS BINARIOS
// =====================================================

const INSIDE = 0;

const LEFT = 1;
const RIGHT = 2;

const BOTTOM = 4;
const TOP = 8;

// =====================================================
// CONVERTIR EJE Y
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
// FUNCION PERSONALIZADA LINEA
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
// OBTENER CODIGO
// =====================================================

function obtenerCodigo(x, y){

    let codigo = INSIDE;

    // izquierda
    if(x < xmin){

        codigo |= LEFT;
    }

    // derecha
    else if(x > xmax){

        codigo |= RIGHT;
    }

    // abajo
    if(y < ymin){

        codigo |= BOTTOM;
    }

    // arriba
    else if(y > ymax){

        codigo |= TOP;
    }

    return codigo;
}

// =====================================================
// ALGORITMO COHEN-SUTHERLAND
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

        // parcialmente dentro

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

                x = x1 + (x2 - x1) * (ymax - y1) / (y2 - y1);

                y = ymax;
            }

            // abajo

            else if(codigoFuera & BOTTOM){

                x = x1 + (x2 - x1) * (ymin - y1) / (y2 - y1);

                y = ymin;
            }

            // derecha

            else if(codigoFuera & RIGHT){

                y = y1 + (y2 - y1) * (xmax - x1) / (x2 - x1);

                x = xmax;
            }

            // izquierda

            else if(codigoFuera & LEFT){

                y = y1 + (y2 - y1) * (xmin - x1) / (x2 - x1);

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

    // retornar linea recortada

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

    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    dibujarGrid();

    dibujarViewport();

    // linea original

    let x1 = 100;
    let y1 = 100;

    let x2 = 700;
    let y2 = 500;

    dibujarLinea(
        x1,
        y1,
        x2,
        y2,
        "gray"
    );

    // linea recortada

    let resultado = cohenSutherland(
        x1,
        y1,
        x2,
        y2
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

dibujar();