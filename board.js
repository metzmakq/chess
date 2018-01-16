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

    canvas.addEventListener('click', board_click, false);
    selectedPiece = null;
}

function generate_board(){
    for(var row = 0; row < 8; ++row){
        draw_row(row);
    }
    context.lineWidth = 3;
    context.strokeRect(0, 0, 8 * square_dimension, 8 * square_dimension);

    game = getStartingPosition();
    game.playerToMove = "white";

    pieces = new Image();
    pieces.src = 'chessPiecesResized.png';
    pieces.onload = drawPieces;
}

function draw_row(rownum){
    for(var square = 0; square < 8; ++square){
        drawSquare(rownum, square, false, false);
    }
}

function drawSquare(rnum, squarenum, clicked, possible){
    context.fillStyle = getSquareColor(rnum, squarenum, clicked, possible);
    context.fillRect(rnum * square_dimension, squarenum * square_dimension, square_dimension, square_dimension);
    context.stroke();
}

function getSquareColor(r, s, clicked, possible){
    var color;
    if(clicked){
        color = "gold";
    }
    else if(possible){
        color = "#ffff4d";
    }
    else if(r % 2)
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
        "y":(isBlack?square_dimension: 0)
    };
    var white = 1;
    if(game.playerToMove == "black"){
        //white = 0;
    }
    context.drawImage(pieces, 
        picXY.x, picXY.y, square_dimension, square_dimension,
        piece_in.col * square_dimension, Math.abs(7*white -piece_in.row) * square_dimension, square_dimension, square_dimension);
}

function board_click(ev){
    var x = Math.floor((ev.layerX - canvas.offsetLeft)/square_dimension);
    var y = 7 - Math.floor((ev.layerY - canvas.offsetTop)/square_dimension);

    if(selectedPiece){
        makemove(selectedPiece, y, x);
    }
    else{
        selectedPiece = null;
        for(var i = 0; i < game[game.playerToMove].length; ++i){
            if(x == game[game.playerToMove][i].col
            && y == game[game.playerToMove][i].row){
                selectedPiece = game[game.playerToMove][i];
                break;
            }
        }
        if(selectedPiece){
            highlightSquare(selectedPiece);
            highlightPossibleMoves(selectedPiece);
        }
    }
}
function highlightSquare(piece_in){
    //drawSquare(piece_in.col, 7 - piece_in.row, true, false);
    context.lineWidth = 3;
    context.strokeStyle = "yellow";
    context.strokeRect((piece_in.col * square_dimension) + 3,
        ((7 - piece_in.row) * square_dimension) + 3, 
        square_dimension - (3 * 2), 
        square_dimension - (3 * 2));
    //drawPiece(piece_in, game.playerToMove == "black");
    drawPieces();
}
function highlightPossibleMoves(piece_in){
    all_possible_moves = getPossibleMoves(piece_in);
    for(var i = 0; i < all_possible_moves.length; ++i){
        drawSquare(all_possible_moves[i].col, 7 - all_possible_moves[i].row, false, true);
        context.lineWidth = 3;
        context.strokeStyle = "black";
        context.strokeRect((all_possible_moves[i].col * square_dimension) + 3,
            ((7 - all_possible_moves[i].row) * square_dimension) + 3, 
            square_dimension - (3 * 2), 
            square_dimension - (3 * 2));
    }
}

function getPossibleMoves(piece_in){
    var possible_moves = [];
    if(piece_in.piece == "PAWN"){
        
        if(game.playerToMove == "white"){
            //if not moved yet
            if(piece_in.row == 1){
                if(!squareOccupied(piece_in.row + 2, piece_in.col)){
                    possible_moves.push({"row": piece_in.row + 2, "col": piece_in.col});
                }
            }
            //normal one move
            if(!squareOccupied(piece_in.row + 1, piece_in.col)){
                possible_moves.push({"row": piece_in.row + 1, "col": piece_in.col});
            }
            //do capture

        }
        else{
            //if not moved yet
            if(piece_in.row == 6){
                if(!squareOccupied(piece_in.row - 2, piece_in.col)){
                    possible_moves.push({"row": piece_in.row - 2, "col": piece_in.col});
                }
            }
            //normal one move
            if(!squareOccupied(piece_in.row - 1, piece_in.col)){
                possible_moves.push({"row": piece_in.row - 1, "col": piece_in.col});
            }
            //do capture

        }
    }
    if(piece_in.piece == "BISHOP" || piece_in.piece == "QUEEN"){
        //diagonal four ways from its location
        var search = true;
        var sq_row = piece_in.row;
        var sq_col = piece_in.col;
        //down right
        while(search){
            ++sq_row;
            ++sq_col;
            if(sq_row > 7 || sq_row < 0 || sq_col > 7 || sq_col < 0){
                break;
            }
            var sq = squareOccupied(sq_row, sq_col);
            if(!sq){
                possible_moves.push({"row": sq_row, "col": sq_col});
            }
            else if(pieceOnSquare != game.playerToMove){
                possible_moves.push({"row": sq_row, "col": sq_col});
                break;
            }
            else{
                break;
            }
        }
        var search = true;
        var sq_row = piece_in.row;
        var sq_col = piece_in.col;
        //down right
        while(search){
            --sq_row;
            ++sq_col;
            if(sq_row > 7 || sq_row < 0 || sq_col > 7 || sq_col < 0){
                break;
            }
            var sq = squareOccupied(sq_row, sq_col);
            if(!sq){
                possible_moves.push({"row": sq_row, "col": sq_col});
            }
            else if(pieceOnSquare != game.playerToMove){
                possible_moves.push({"row": sq_row, "col": sq_col});
                break;
            }
            else{
                break;
            }
        }
        var search = true;
        var sq_row = piece_in.row;
        var sq_col = piece_in.col;
        //down right
        while(search){
            ++sq_row;
            --sq_col;
            if(sq_row > 7 || sq_row < 0 || sq_col > 7 || sq_col < 0){
                break;
            }
            var sq = squareOccupied(sq_row, sq_col);
            if(!sq){
                possible_moves.push({"row": sq_row, "col": sq_col});
            }
            else if(pieceOnSquare != game.playerToMove){
                possible_moves.push({"row": sq_row, "col": sq_col});
                break;
            }
            else{
                break;
            }
        }
        var search = true;
        var sq_row = piece_in.row;
        var sq_col = piece_in.col;
        //down right
        while(search){
            --sq_row;
            --sq_col;
            if(sq_row > 7 || sq_row < 0 || sq_col > 7 || sq_col < 0){
                break;
            }
            var sq = squareOccupied(sq_row, sq_col);
            if(!sq){
                possible_moves.push({"row": sq_row, "col": sq_col});
            }
            else if(pieceOnSquare != game.playerToMove){
                possible_moves.push({"row": sq_row, "col": sq_col});
                break;
            }
            else{
                break;
            }
        }
    }
    if(piece_in.piece == "KNIGHT"){
        //8 cases
        var sq_row = piece_in.row + 2;
        var sq_col = piece_in.col - 1;
        if(sq_row > 7 || sq_row < 0 || sq_col > 7 || sq_col < 0){
            
        }else{
            if(!squareOccupied(sq_row, sq_col)){
                possible_moves.push({"row": sq_row, "col": sq_col});
            }
            else{
                if(pieceOnSquare != game.playerToMove){
                    possible_moves.push({"row": sq_row, "col": sq_col});
                }
            }
        }
        /////////////////////
        var sq_row = piece_in.row + 2;
        var sq_col = piece_in.col + 1;
        if(sq_row > 7 || sq_row < 0 || sq_col > 7 || sq_col < 0){
            
        }else{
            if(!squareOccupied(sq_row, sq_col)){
                possible_moves.push({"row": sq_row, "col": sq_col});
            }
            else{
                if(pieceOnSquare != game.playerToMove){
                    possible_moves.push({"row": sq_row, "col": sq_col});
                }
            }
        }
        ///////////////////////////////
        var sq_row = piece_in.row + 1;
        var sq_col = piece_in.col + 2;
        if(sq_row > 7 || sq_row < 0 || sq_col > 7 || sq_col < 0){
            
        }else{
            if(!squareOccupied(sq_row, sq_col)){
                possible_moves.push({"row": sq_row, "col": sq_col});
            }
            else{
                if(pieceOnSquare != game.playerToMove){
                    possible_moves.push({"row": sq_row, "col": sq_col});
                }
            }
        }
        //////////////////////////////////
        var sq_row = piece_in.row - 1;
        var sq_col = piece_in.col + 2;
        if(sq_row > 7 || sq_row < 0 || sq_col > 7 || sq_col < 0){
            
        }else{
            if(!squareOccupied(sq_row, sq_col)){
                possible_moves.push({"row": sq_row, "col": sq_col});
            }
            else{
                if(pieceOnSquare != game.playerToMove){
                    possible_moves.push({"row": sq_row, "col": sq_col});
                }
            }
        }
        ///////////////////////////////////
        var sq_row = piece_in.row - 2;
        var sq_col = piece_in.col + 1;
        if(sq_row > 7 || sq_row < 0 || sq_col > 7 || sq_col < 0){
            
        }else{
            if(!squareOccupied(sq_row, sq_col)){
                possible_moves.push({"row": sq_row, "col": sq_col});
            }
            else{
                if(pieceOnSquare != game.playerToMove){
                    possible_moves.push({"row": sq_row, "col": sq_col});
                }
            }
        }
        //////////////////////////////////
        var sq_row = piece_in.row - 2;
        var sq_col = piece_in.col - 1;
        if(sq_row > 7 || sq_row < 0 || sq_col > 7 || sq_col < 0){
            
        }else{
            if(!squareOccupied(sq_row, sq_col)){
                possible_moves.push({"row": sq_row, "col": sq_col});
            }
            else{
                if(pieceOnSquare != game.playerToMove){
                    possible_moves.push({"row": sq_row, "col": sq_col});
                }
            }
        }
        ///////////////////////////////////////
        var sq_row = piece_in.row - 1;
        var sq_col = piece_in.col - 2;
        if(sq_row > 7 || sq_row < 0 || sq_col > 7 || sq_col < 0){
            
        }else{
            if(!squareOccupied(sq_row, sq_col)){
                possible_moves.push({"row": sq_row, "col": sq_col});
            }
            else{
                if(pieceOnSquare != game.playerToMove){
                    possible_moves.push({"row": sq_row, "col": sq_col});
                }
            }
        }
        //////////////////////////////////////////
        var sq_row = piece_in.row + 1;
        var sq_col = piece_in.col - 2;
        if(sq_row > 7 || sq_row < 0 || sq_col > 7 || sq_col < 0){
            
        }else{
            if(!squareOccupied(sq_row, sq_col)){
                possible_moves.push({"row": sq_row, "col": sq_col});
            }
            else{
                if(pieceOnSquare != game.playerToMove){
                    possible_moves.push({"row": sq_row, "col": sq_col});
                }
            }
        }

    }
    if(piece_in.piece == "ROOK" || piece_in.piece == "QUEEN"){
        var search = true;
        var sq_row = piece_in.row;
        var sq_col = piece_in.col;
        //down right
        while(search){
            ++sq_row;
            
            if(sq_row > 7 || sq_row < 0 || sq_col > 7 || sq_col < 0){
                break;
            }
            var sq = squareOccupied(sq_row, sq_col);
            if(!sq){
                possible_moves.push({"row": sq_row, "col": sq_col});
            }
            else if(pieceOnSquare != game.playerToMove){
                possible_moves.push({"row": sq_row, "col": sq_col});
                break;
            }
            else{
                break;
            }
        }
        var search = true;
        var sq_row = piece_in.row;
        var sq_col = piece_in.col;
        //down right
        while(search){
            --sq_row;
            
            if(sq_row > 7 || sq_row < 0 || sq_col > 7 || sq_col < 0){
                break;
            }
            var sq = squareOccupied(sq_row, sq_col);
            if(!sq){
                possible_moves.push({"row": sq_row, "col": sq_col});
            }
            else if(pieceOnSquare != game.playerToMove){
                possible_moves.push({"row": sq_row, "col": sq_col});
                break;
            }
            else{
                break;
            }
        }
        var search = true;
        var sq_row = piece_in.row;
        var sq_col = piece_in.col;
        //down right
        while(search){
            
            ++sq_col;
            if(sq_row > 7 || sq_row < 0 || sq_col > 7 || sq_col < 0){
                break;
            }
            var sq = squareOccupied(sq_row, sq_col);
            if(!sq){
                possible_moves.push({"row": sq_row, "col": sq_col});
            }
            else if(pieceOnSquare != game.playerToMove){
                possible_moves.push({"row": sq_row, "col": sq_col});
                break;
            }
            else{
                break;
            }
        }
        var search = true;
        var sq_row = piece_in.row;
        var sq_col = piece_in.col;
        //down right
        while(search){
            
            --sq_col;
            if(sq_row > 7 || sq_row < 0 || sq_col > 7 || sq_col < 0){
                break;
            }
            var sq = squareOccupied(sq_row, sq_col);
            if(!sq){
                possible_moves.push({"row": sq_row, "col": sq_col});
            }
            else if(pieceOnSquare != game.playerToMove){
                possible_moves.push({"row": sq_row, "col": sq_col});
                break;
            }
            else{
                break;
            }
        }
    }
    if(piece_in.piece == "KING"){
                //8 cases Also have to account for check
                var sq_row = piece_in.row;
                var sq_col = piece_in.col - 1;
                if(sq_row > 7 || sq_row < 0 || sq_col > 7 || sq_col < 0){
                    
                }else{
                    if(!squareOccupied(sq_row, sq_col)){
                        possible_moves.push({"row": sq_row, "col": sq_col});
                    }
                    else{
                        if(pieceOnSquare != game.playerToMove){
                            possible_moves.push({"row": sq_row, "col": sq_col});
                        }
                    }
                }
                /////////////////////
                var sq_row = piece_in.row;
                var sq_col = piece_in.col + 1;
                if(sq_row > 7 || sq_row < 0 || sq_col > 7 || sq_col < 0){
                    
                }else{
                    if(!squareOccupied(sq_row, sq_col)){
                        possible_moves.push({"row": sq_row, "col": sq_col});
                    }
                    else{
                        if(pieceOnSquare != game.playerToMove){
                            possible_moves.push({"row": sq_row, "col": sq_col});
                        }
                    }
                }
                ///////////////////////////////
                var sq_row = piece_in.row + 1;
                var sq_col = piece_in.col;
                if(sq_row > 7 || sq_row < 0 || sq_col > 7 || sq_col < 0){
                    
                }else{
                    if(!squareOccupied(sq_row, sq_col)){
                        possible_moves.push({"row": sq_row, "col": sq_col});
                    }
                    else{
                        if(pieceOnSquare != game.playerToMove){
                            possible_moves.push({"row": sq_row, "col": sq_col});
                        }
                    }
                }
                //////////////////////////////////
                var sq_row = piece_in.row - 1;
                var sq_col = piece_in.col;
                if(sq_row > 7 || sq_row < 0 || sq_col > 7 || sq_col < 0){
                    
                }else{
                    if(!squareOccupied(sq_row, sq_col)){
                        possible_moves.push({"row": sq_row, "col": sq_col});
                    }
                    else{
                        if(pieceOnSquare != game.playerToMove){
                            possible_moves.push({"row": sq_row, "col": sq_col});
                        }
                    }
                }
                ///////////////////////////////////
                var sq_row = piece_in.row - 1;
                var sq_col = piece_in.col - 1;
                if(sq_row > 7 || sq_row < 0 || sq_col > 7 || sq_col < 0){
                    
                }else{
                    if(!squareOccupied(sq_row, sq_col)){
                        possible_moves.push({"row": sq_row, "col": sq_col});
                    }
                    else{
                        if(pieceOnSquare != game.playerToMove){
                            possible_moves.push({"row": sq_row, "col": sq_col});
                        }
                    }
                }
                //////////////////////////////////
                var sq_row = piece_in.row + 1;
                var sq_col = piece_in.col - 1;
                if(sq_row > 7 || sq_row < 0 || sq_col > 7 || sq_col < 0){
                    
                }else{
                    if(!squareOccupied(sq_row, sq_col)){
                        possible_moves.push({"row": sq_row, "col": sq_col});
                    }
                    else{
                        if(pieceOnSquare != game.playerToMove){
                            possible_moves.push({"row": sq_row, "col": sq_col});
                        }
                    }
                }
                ///////////////////////////////////////
                var sq_row = piece_in.row - 1;
                var sq_col = piece_in.col + 1;
                if(sq_row > 7 || sq_row < 0 || sq_col > 7 || sq_col < 0){
                    
                }else{
                    if(!squareOccupied(sq_row, sq_col)){
                        possible_moves.push({"row": sq_row, "col": sq_col});
                    }
                    else{
                        if(pieceOnSquare != game.playerToMove){
                            possible_moves.push({"row": sq_row, "col": sq_col});
                        }
                    }
                }
                //////////////////////////////////////////
                var sq_row = piece_in.row + 1;
                var sq_col = piece_in.col + 1;
                if(sq_row > 7 || sq_row < 0 || sq_col > 7 || sq_col < 0){
                    
                }else{
                    if(!squareOccupied(sq_row, sq_col)){
                        possible_moves.push({"row": sq_row, "col": sq_col});
                    }
                    else{
                        if(pieceOnSquare != game.playerToMove){
                            possible_moves.push({"row": sq_row, "col": sq_col});
                        }
                    }
                }
    }
    /*else{
        alert("Unrecognized piece");
    }*/
    return possible_moves;
}

function squareOccupied(row, col){
    pieceOnSquare = null;
    for(var i = 0; i < game.black.length; ++i){
        if(game.black[i].row == row && game.black[i].col == col){
            pieceOnSquare = "black";
            return game.black[i];
        }
    }
    for(var i = 0; i < game.white.length; ++i){
        if(game.white[i].row == row && game.white[i].col == col){
            pieceOnSquare = "white";
            return game.white[i];
        }
    }
    return null;
}

function makemove(piece_in, row, col){
    var legal = false;
    for(var i = 0; i < all_possible_moves.length; ++i){
        if(row == all_possible_moves[i].row && col == all_possible_moves[i].col){
            legal = true;
            break;
        }
    }
    if(legal){
        drawSquare(piece_in.col, 7 - piece_in.row, false, false);
        piece_in.row = row;
        piece_in.col = col;
        for(var i = 0; i < all_possible_moves.length; ++i){
            drawSquare(all_possible_moves[i].col, 7 - all_possible_moves[i].row, false, false);
        }
        drawPieces();
        if(game.playerToMove == "white"){
            game.playerToMove = "black";
        }
        else{
            game.playerToMove = "white";
        }
        selectedPiece = null;
    }
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

