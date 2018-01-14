pieceImages = {
    "KING": 0,
    "QUEEN": 1,
    "BISHOP": 2,
    "KNIGHT": 3,
    "ROOK": 4,
    "PAWN": 5
};

function draw_board(){
    canvas = document.getElementById("board");

    context = canvas.getContext('2d');
    //check height and width?
    square_dimension = canvas.height/8;
    COLOR_1 = "aliceblue";
    COLOR_2 = "dodgerblue";
    generate_board();

    game = getStartingPosition();
}

function generate_board(){
    for(var row = 0; row < 8; ++row){
        draw_row(row);
    }
    context.lineWidth = 3;
    context.strokeRect(0, 0, 8 * square_dimension, 8 * square_dimension);

    game = getStartingPosition();

    pieces = new Image();
    pieces.src = 'chessPiecesResized.png';
    pieces.onload = drawPieces;
}

function draw_row(rownum){
    for(var square = 0; square < 8; ++square){
        drawSquare(rownum, square);
    }
}

function drawSquare(rnum, squarenum){
    context.fillStyle = getSquareColor(rnum, squarenum);
    context.fillRect(rnum * square_dimension, squarenum * square_dimension, square_dimension, square_dimension);
    context.stroke();
}

function getSquareColor(r, s){
    var color;
    if(r % 2)
        color = (s % 2?COLOR_1:COLOR_2);
    else
        color = (s % 2?COLOR_2:COLOR_1); 
    return color;
}

function drawPieces(){
    for(var i = 0; i < game.black.length; ++i){
        drawPiece(game.black[i], true);
    }
    for(var i = 0; i < game.white.length; ++i){
        drawPiece(game.white[i], false);
    }
}

function drawPiece(piece_in, isBlack){
    console.log(piece_in);
    var piece_index = pieceImages[piece_in.piece];
    var picXY = {
        "x": piece_index * square_dimension,
        "y":(isBlack?0:square_dimension)
    };
    context.drawImage(pieces, 
        picXY.x, picXY.y, square_dimension, square_dimension,
        piece_in.col * square_dimension, piece_in.row * square_dimension, square_dimension, square_dimension);
}

function getStartingPosition(){
    var start = 
    {
        "white": 
        [
            {
                "piece": "ROOK",
                "row": 0,
                "col": 0,
                "captured": false
            },
            {
                "piece": "KNIGHT",
                "row": 0,
                "col": 1,
                "captured": false
            },
            {
                "piece": "BISHOP",
                "row": 0,
                "col": 2,
                "captured": false
            }, 
            {
                "piece": "QUEEN",
                "row": 0,
                "col": 3,
                "captured": false
            },
            {
                "piece": "KING",
                "row": 0,
                "col": 4,
                "captured": false
            }, 
            {
                "piece": "BISHOP",
                "row": 0,
                "col": 5,
                "captured": false
            },
            {
                "piece": "KNIGHT",
                "row": 0,
                "col": 6,
                "captured": false
            },
            {
                "piece": "ROOK",
                "row": 0,
                "col": 7,
                "captured": false
            },
            {
                "piece": "PAWN",
                "row": 1,
                "col": 0,
                "captured": false
            },
            {
                "piece": "PAWN",
                "row": 1,
                "col": 1,
                "captured": false
            },
            {
                "piece": "PAWN",
                "row": 1,
                "col": 2,
                "captured": false
            },
            {
                "piece": "PAWN",
                "row": 1,
                "col": 3,
                "captured": false
            },  
            {
                "piece": "PAWN",
                "row": 1,
                "col": 4,
                "captured": false
            },
            {
                "piece": "PAWN",
                "row": 1,
                "col": 5,
                "captured": false
            },
            {
                "piece": "PAWN",
                "row": 1,
                "col": 6,
                "captured": false
            },
            {
                "piece": "PAWN",
                "row": 1,
                "col": 7,
                "captured": false
            }
        ],
        "black": 
        [
            {
                "piece": "ROOK",
                "row": 7,
                "col": 0,
                "captured": false
            },
            {
                "piece": "KNIGHT",
                "row": 7,
                "col": 1,
                "captured": false
            },
            {
                "piece": "BISHOP",
                "row": 7,
                "col": 2,
                "captured": false
            }, 
            {
                "piece": "QUEEN",
                "row": 7,
                "col": 3,
                "captured": false
            },
            {
                "piece": "KING",
                "row": 7,
                "col": 4,
                "captured": false
            }, 
            {
                "piece": "BISHOP",
                "row": 7,
                "col": 5,
                "captured": false
            },
            {
                "piece": "KNIGHT",
                "row": 7,
                "col": 6,
                "captured": false
            },
            {
                "piece": "ROOK",
                "row": 7,
                "col": 7,
                "captured": false
            },
            {
                "piece": "PAWN",
                "row": 6,
                "col": 0,
                "captured": false
            },
            {
                "piece": "PAWN",
                "row": 6,
                "col": 1,
                "captured": false
            },
            {
                "piece": "PAWN",
                "row": 6,
                "col": 2,
                "captured": false
            },
            {
                "piece": "PAWN",
                "row": 6,
                "col": 3,
                "captured": false
            },  
            {
                "piece": "PAWN",
                "row": 6,
                "col": 4,
                "captured": false
            },
            {
                "piece": "PAWN",
                "row": 6,
                "col": 5,
                "captured": false
            },
            {
                "piece": "PAWN",
                "row": 6,
                "col": 6,
                "captured": false
            },
            {
                "piece": "PAWN",
                "row": 6,
                "col": 7,
                "captured": false
            }
        ]       
    };
    return start;
}

