var xmlhttp = new XMLHttpRequest();
var url = "./static/data/game.json";
var clickCount = 0;
var dataJson = [];
var badMoove = false;

xmlhttp.open('GET', url);
xmlhttp.responseType = 'json';
xmlhttp.send();

var state = false;
var currentPiece;
var currentCell;

xmlhttp.onload = function() {

    var json = xmlhttp.response;
    var playerOne = json[2]["player"][0];
    var playerTwo = json[2]["player"][1];

    var turnOne = playerOne["turn"];
    var turnTwo = playerTwo["turn"];

    document.getElementById('turn').innerHTML = "au tour de " + playerOne['name'];
    
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            if ((json[0]['lines'][i]["cases"][j]["occupate"]) == 1) {
                piece = json[0]['lines'][i]["cases"][j]["piece"];
                color =  json[0]['lines'][i]["cases"][j]["color"];
                document.getElementById('line' + i + ' ' + 'case' + j).className = ('fas fa-chess-' + piece + ' ' + color);
            }
        }
    }

    var cells = document.getElementsByTagName("td"); 
        for (var i = 0; i < cells.length; i++) { 
        cells[i].onclick = function(){
            getCell(this);
        };
    }

    function getCell(cell) {

        document.getElementById('play').innerHTML = "choisir un pion";
        badMoove = false;
        document.getElementById('checkKing').innerHTML = "";
        
        if(!state) {
            var cellTag = cell.getElementsByTagName('i');
            if (verifColor(cellTag)) {
                return;
            }
            var pieceTag = cell.getElementsByTagName('i');
            if (cellTag[0].className.includes('pawn')) {
                verifPawnMoove(cell.id);
            } else if (cellTag[0].className.includes('rook')) {
                verifRookMoove(cell.id);
            } else if (cellTag[0].className.includes('bishop')) {
                verifBishopMoove(cell.id);
            } else if (cellTag[0].className.includes('queen')) {
                verifQueenMoove(cell.id);
            } else if (cellTag[0].className.includes('king')) {
                verifKingMoove(cell.id);
            } else if (cellTag[0].className.includes('knight')) {
                verifKnightMoove(cell.id);
            }
            if (badMoove) {
                alert("impossible de déplacer cette pièce, en choisir une autre");
                return;
            }
            state = true;
            currentPiece = cell.innerHTML;
            currentCell = cell;
            document.getElementById('play').innerHTML = "choisir une case";
        }
        else {
            var cellTag = cell.getElementsByTagName('i');
            if (eatFriends(cellTag, pieceTag)) {
                return;
            }
            if (cell.style.backgroundColor !== "green") {
                alert("impossible de dépalcer le pion ici");
                return;
            }
            cell.innerHTML = currentPiece;
            currentCell.innerHTML = "" + '<i class="fas fa-chess-"></i>';
            state = false;
            checkKing(cell, cellTag);
            getTurn();
            var cellColor = document.getElementsByClassName('cell');
            for (var i = 0; i < cellColor.length; i++) {
                cellColor[i].removeAttribute('style');
            }
            if (win()) {
                document.getElementsByTagName('body')[0].innerHTML = '<h1 class="center">Il y a un gagnant, retour au menu principal</h1><div class="center"><a href="http://127.0.0.1:5000/"><button>Retour</button></a></div>';
            }
        }

    }

    function getTurn() {

        if (turnOne == 1) {
            turnOne = 0;
            turnTwo = 1;
            document.getElementById("turn").innerHTML = "Au tour de " + playerTwo["name"];
        } else if (turnTwo == 1) {
            turnTwo = 0;
            turnOne = 1;
            document.getElementById("turn").innerHTML = "Au tour de " + playerOne["name"];
        }
    }

    function eatFriends(cellTag, pieceTag) {
        if (cellTag[0].className.includes("white")) {
            if (pieceTag == undefined) {
                return false;
            } else if (pieceTag[0].className.includes("white")) {
                alert("Vous ne pouvez pas manger vos propres pions blancs");
                return true;
            }
        } else if (cellTag[0].className.includes("black")) {
            if (pieceTag == undefined) {
                return false;
            } else if (pieceTag[0].className.includes("black")) {
                alert("Vous ne pouvez pas manger vos propres pions noirs");
                return true;
            }
        } else { return false; }
    }

    function verifColor(cellTag) {
        
        if (document.getElementById('turn').innerHTML.includes(playerOne['name'])) {
            if (cellTag[0].className.includes("black")) {
                alert("impossible de déplacer les pièces de l'adversaire")
                return true;
            }
        } else if (document.getElementById('turn').innerHTML.includes(playerTwo['name'])) {
            if (cellTag[0].className.includes("white")) {
                alert("impossible de déplacer les pièces de l'adversaire")
                return true;
            }
        } else { return false; }
    }
    
    function verifPawnMoove(cell) {

        cases = [];

        var split = cell.split('-');
        var linePiece = split[0].split('L');
        var casePiece = split[1].split('C');

        if (cell.includes('L1')) {
            cases.push('L' + (parseInt(linePiece[1])+2) + '-' + split[1]);
        } else if (cell.includes('L6')) {
            cases.push('L' + (parseInt(linePiece[1])-2) + '-' + split[1]);
        }

        if (document.getElementById(cell).getElementsByTagName('i')[0].className.includes('white')) {
            var eatBlackRight = 'L' + (parseInt(linePiece[1])+1) + '-' + 'C' + (parseInt(casePiece[1])+1);
            var eatBlackLeft = 'L' + (parseInt(linePiece[1])+1) + '-' + 'C' + (parseInt(casePiece[1])-1);
            eatBlackRight = document.getElementById(eatBlackRight);
            eatBlackLeft = document.getElementById(eatBlackLeft);
            if (eatBlackRight == null) {
            } else if (eatBlackRight.getElementsByTagName('i')[0].className.includes('black')) {
                eatBlackRight = 'L' + (parseInt(linePiece[1])+1) + '-' + 'C' + (parseInt(casePiece[1])+1);
                cases.push(eatBlackRight);
                console.log('eat right black');
            }

            if (eatBlackLeft == null) {
            } else if (eatBlackLeft.getElementsByTagName('i')[0].className.includes('black')) {
                eatBlackLeft = 'L' + (parseInt(linePiece[1])+1) + '-' + 'C' + (parseInt(casePiece[1])-1);
                cases.push(eatBlackLeft);
                console.log('eat left black');
            }
            
        } else if (document.getElementById(cell).getElementsByTagName('i')[0].className.includes('black')) {
            var eatWhiteRight = 'L' + (parseInt(linePiece[1])-1) + '-' + 'C' + (parseInt(casePiece[1])+1);
            var eatWhiteLeft = 'L' + (parseInt(linePiece[1])-1) + '-' + 'C' + (parseInt(casePiece[1])-1);
            eatWhiteRight = document.getElementById(eatWhiteRight);
            eatWhiteLeft = document.getElementById(eatWhiteLeft);
            if (eatWhiteRight == null) {
            } else if (eatWhiteRight.getElementsByTagName('i')[0].className.includes('white')) {
                eatWhiteRight = 'L' + (parseInt(linePiece[1])-1) + '-' + 'C' + (parseInt(casePiece[1])+1);
                cases.push(eatWhiteRight);
                console.log('eat right white');
            }

            if (eatWhiteLeft == null) {
            } else if (eatWhiteLeft.getElementsByTagName('i')[0].className.includes('white')) {
                eatWhiteLeft = 'L' + (parseInt(linePiece[1])-1) + '-' + 'C' + (parseInt(casePiece[1])-1);
                cases.push(eatWhiteLeft);
                console.log('eat right white');
            }
        }

        if (document.getElementById(cell).getElementsByTagName('i')[0].className.includes('white')) {
            var verifPiece = ('L' + (parseInt(linePiece[1])+1) + '-' + split[1]);
            if (document.getElementById(verifPiece).getElementsByTagName('i')[0].className.includes('white')) {
            } else if (document.getElementById(verifPiece).getElementsByTagName('i')[0].className.includes('black')) {
            } else {
                cases.push('L' + (parseInt(linePiece[1])+1) + '-' + split[1]);
            }
            
        } else if (document.getElementById(cell).getElementsByTagName('i')[0].className.includes('black')) {
            var verifPiece = ('L' + (parseInt(linePiece[1])-1) + '-' + split[1]);
            if (document.getElementById(verifPiece).getElementsByTagName('i')[0].className.includes('black')) {
            } else if (document.getElementById(verifPiece).getElementsByTagName('i')[0].className.includes('white')) {
            } else {
                cases.push('L' + (parseInt(linePiece[1])-1) + '-' + split[1]);
            }
        }

        if (cases.length == 0) {
            badMoove = true;
        }
        
        console.log(cases);
        for (var i = 0; i < cases.length; i++) {
            document.getElementById(cases[i]).style.backgroundColor = "green";
        }
    }

    function verifRookMoove(cell) {

        var cases = [];
        var stopLineTop = false;
        var stopLineBottom = false;
        var stopCaseTop = false;
        var stopCaseBottom = false;

        var split = cell.split('-');
        var linePiece = split[0].split('L');
        var casePiece = split[1].split('C');

        var rook = document.getElementById(cell).getElementsByTagName('i')[0].className;

        for (var i = (parseInt(linePiece[1])+1); i < 8; i++) {
            var nextCells = document.getElementById('L' + i + '-' + split[1]).getElementsByTagName('i')[0].className;
            if ((!nextCells.includes('white')) && (!nextCells.includes('black'))) {
                if (!stopLineTop) {
                    cases.push('L' + i + '-' + split[1]);
                } else {
                }
            } else {
                if (!stopLineTop) {
                    if (rook.includes('white')) {
                        if (nextCells.includes('black')) {
                            cases.push('L' + i + '-' + split[1]);
                        }
                    } else if (rook.includes('black')) {
                        if (nextCells.includes('white')) {
                            cases.push('L' + i + '-' + split[1]);
                        }
                    }
                }
                stopLineTop = true;
            }     
        }

        for (var i = (parseInt(linePiece[1])-1); i >= 0; i--) {
            var nextCells = document.getElementById('L' + i + '-' + split[1]).getElementsByTagName('i')[0].className;
            if ((!nextCells.includes('white')) && (!nextCells.includes('black'))) {
                if (!stopLineBottom) {
                    cases.push('L' + i + '-' + split[1]);
                } else {
                }
            } else {
                if (!stopLineBottom) {
                    if (rook.includes('white')) {
                        if (nextCells.includes('black')) {
                            cases.push('L' + i + '-' + split[1]);
                        }
                    } else if (rook.includes('black')) {
                        if (nextCells.includes('white')) {
                            cases.push('L' + i + '-' + split[1]);
                        }
                    }
                }
                stopLineBottom = true;
            } 
        }

        for (var i = (parseInt(casePiece[1])+1); i < 8; i++) {
            var nextCells = document.getElementById(split[0] + '-' + 'C' + i).getElementsByTagName('i')[0].className;
            if ((!nextCells.includes('white')) && (!nextCells.includes('black'))) {
                if (!stopCaseTop) {
                    cases.push(split[0] + '-' + 'C' + i);
                } else {
                    console.log(split[0] + '-' + 'C' + i);
                }
            } else {
                if (!stopCaseTop) {
                    if (rook.includes('white')) {
                        if (nextCells.includes('black')) {
                            cases.push(split[0] + '-' + 'C' + i);
                        }
                    } else if (rook.includes('black')) {
                        if (nextCells.includes('white')) {
                            cases.push(split[0] + '-' + 'C' + i);
                        }
                    }
                }
                stopCaseTop = true;
            }
        }

        for (var i = (parseInt(casePiece[1])-1); i >= 0; i--) {
            var nextCells = document.getElementById(split[0] + '-' + 'C' + i).getElementsByTagName('i')[0].className;
            if ((!nextCells.includes('white')) && (!nextCells.includes('black'))) {
                if (!stopCaseBottom) {
                    cases.push(split[0] + '-' + 'C' + i);
                } else {
                }
            } else {
                if (!stopCaseBottom) {
                    if (rook.includes('white')) {
                        if (nextCells.includes('black')) {
                            cases.push(split[0] + '-' + 'C' + i);
                        }
                    } else if (rook.includes('black')) {
                        if (nextCells.includes('white')) {
                            cases.push(split[0] + '-' + 'C' + i);
                        }
                    }
                }
                stopCaseBottom = true;
            }        
        }

        if (cases.length == 0) {
            badMoove = true;
        }

        console.log(cases);
        for (var i = 0; i < cases.length; i++) {
            document.getElementById(cases[i]).style.backgroundColor = "green";
        }

        stopLineTop = false;
        stopLineBottom = false;
        stopCaseTop = false;
        stopCaseBottom = false;

    }

    function verifBishopMoove(cell) {

        var cases = [];
        var stopLineTop = false;
        var stopLineBottom = false;
        var stopCaseTop = false;
        var stopCaseBottom = false;

        var count = 0

        var split = cell.split('-');
        var linePiece = split[0].split('L');
        var casePiece = split[1].split('C');

        var bishop = document.getElementById(cell).getElementsByTagName('i')[0].className;

        for (var i = (parseInt(casePiece[1])+1); i < 8; i++) {
            count++;
            console.log('L' + (parseInt(linePiece[1])+count) + '-' + 'C' + (parseInt(casePiece[1])+count));
            if (((parseInt(linePiece[1])+count) < 8) && ((parseInt(casePiece[1])+count) < 8)) {
                var nextCells = document.getElementById('L' + (parseInt(linePiece[1])+count) + '-' + 'C' + (parseInt(casePiece[1])+count)).getElementsByTagName('i')[0].className;
                if ((!nextCells.includes('white')) && (!nextCells.includes('black'))) {
                    if (!stopLineTop) {
                        cases.push('L' + (parseInt(linePiece[1])+count) + '-' + 'C' + (parseInt(casePiece[1])+count));
                    } else {
                    }
                } else {
                    if (!stopLineTop) {
                        if (bishop.includes('white')) {
                            if (nextCells.includes('black')) {
                                cases.push('L' + (parseInt(linePiece[1])+count) + '-' + 'C' + (parseInt(casePiece[1])+count));
                            }
                        } else if (bishop.includes('black')) {
                            if (nextCells.includes('white')) {
                                cases.push('L' + (parseInt(linePiece[1])+count) + '-' + 'C' + (parseInt(casePiece[1])+count));
                            }
                        }
                    }
                    stopLineTop = true;
                }     
            }
        }

        count = 0;

        for (var i = (parseInt(casePiece[1])-1); i >= 0; i--) {
            count++;
            console.log('L' + (parseInt(linePiece[1])+count) + '-' + 'C' + (parseInt(casePiece[1])-count));
            if ((parseInt(linePiece[1])+count) < 8) {
                var nextCells = document.getElementById('L' + (parseInt(linePiece[1])+count) + '-' + 'C' + (parseInt(casePiece[1])-count)).getElementsByTagName('i')[0].className;
                if ((!nextCells.includes('white')) && (!nextCells.includes('black'))) {
                    if (!stopLineBottom) {
                        cases.push('L' + (parseInt(linePiece[1])+count) + '-' + 'C' + (parseInt(casePiece[1])-count));
                    } else {
                    }
                } else {
                    if (!stopLineBottom) {
                        if (bishop.includes('white')) {
                            if (nextCells.includes('black')) {
                                cases.push('L' + (parseInt(linePiece[1])+count) + '-' + 'C' + (parseInt(casePiece[1])-count));
                            }
                        } else if (bishop.includes('black')) {
                            if (nextCells.includes('white')) {
                                cases.push('L' + (parseInt(linePiece[1])+count) + '-' + 'C' + (parseInt(casePiece[1])-count));
                            }
                        }
                    }
                    stopLineBottom = true;
                } 
            }
        }

        count = 0;

        for (var i = (parseInt(casePiece[1])); i >= 0; i--) {
            count++;
            console.log('L' + (parseInt(linePiece[1])-count) + '-' + 'C' + (parseInt(casePiece[1])-count));
            if (((parseInt(casePiece[1])-count) >= 0) && ((parseInt(linePiece[1])-count) >= 0)) {
                var nextCells = document.getElementById('L' + (parseInt(linePiece[1])-count) + '-' + 'C' + (parseInt(casePiece[1])-count)).getElementsByTagName('i')[0].className;
                if ((!nextCells.includes('white')) && (!nextCells.includes('black'))) {
                    if (!stopCaseTop) {
                        cases.push('L' + (parseInt(linePiece[1])-count) + '-' + 'C' + (parseInt(casePiece[1])-count));
                    } else {
                    }
                } else {
                    if (!stopCaseTop) {
                        if (bishop.includes('white')) {
                            if (nextCells.includes('black')) {
                                cases.push('L' + (parseInt(linePiece[1])-count) + '-' + 'C' + (parseInt(casePiece[1])-count));
                            }
                        } else if (bishop.includes('black')) {
                            if (nextCells.includes('white')) {
                                cases.push('L' + (parseInt(linePiece[1])-count) + '-' + 'C' + (parseInt(casePiece[1])-count));
                            }
                        }
                    }
                    stopCaseTop = true;
                }     
            }
        }

        count = 0;

        for (var i = (parseInt(casePiece[1])); i < 8; i++) {
            count++;
            console.log('L' + (parseInt(linePiece[1])-count) + '-' + 'C' + (parseInt(casePiece[1])+count));
            if (((parseInt(casePiece[1])+count) < 8) && ((parseInt(linePiece[1])-count) >= 0)) {
                console.log('pass');
                var nextCells = document.getElementById('L' + (parseInt(linePiece[1])-count) + '-' + 'C' + (parseInt(casePiece[1])+count)).getElementsByTagName('i')[0].className;
                if ((!nextCells.includes('white')) && (!nextCells.includes('black'))) {
                    if (!stopCaseBottom) {
                        cases.push('L' + (parseInt(linePiece[1])-count) + '-' + 'C' + (parseInt(casePiece[1])+count));
                    } else {
                    }
                } else {
                    if (!stopCaseBottom) {
                        if (bishop.includes('white')) {
                            if (nextCells.includes('black')) {
                                cases.push('L' + (parseInt(linePiece[1])-count) + '-' + 'C' + (parseInt(casePiece[1])+count));
                            }
                        } else if (bishop.includes('black')) {
                            if (nextCells.includes('white')) {
                                cases.push('L' + (parseInt(linePiece[1])-count) + '-' + 'C' + (parseInt(casePiece[1])+count));
                            }
                        }
                    }
                    stopCaseBottom = true;
                } 
            }
        }

        if (cases.length == 0) {
            badMoove = true;
        }

        console.log(cases);
        for (var i = 0; i < cases.length; i++) {
            document.getElementById(cases[i]).style.backgroundColor = "green";
        }

        stopLineTop = false;
        stopLineBottom = false;
        stopCaseTop = false;
        stopCaseBottom = false;

    }

    function verifQueenMoove(cell) {
        verifRookMoove(cell);
        verifBishopMoove(cell);

        badMoove = false;
    }

    function verifKingMoove(cell) {

        var cases = [];
        var stopLineTop = false;
        var stopLineBottom = false;
        var stopCaseTop = false;
        var stopCaseBottom = false;

        var split = cell.split('-');
        var linePiece = split[0].split('L');
        var casePiece = split[1].split('C');

        var rook = document.getElementById(cell).getElementsByTagName('i')[0].className;

        for (var i = (parseInt(linePiece[1])+1); i <= (parseInt(linePiece[1])+1); i++) {
            if (i < 8 && i >= 0) {
                var nextCells = document.getElementById('L' + i + '-' + split[1]).getElementsByTagName('i')[0].className;
                if ((!nextCells.includes('white')) && (!nextCells.includes('black'))) {
                    if (!stopLineTop) {
                        cases.push('L' + i + '-' + split[1]);
                    } else {
                    }
                } else {
                    if (!stopLineTop) {
                        if (rook.includes('white')) {
                            if (nextCells.includes('black')) {
                                cases.push('L' + i + '-' + split[1]);
                            }
                        } else if (rook.includes('black')) {
                            if (nextCells.includes('white')) {
                                cases.push('L' + i + '-' + split[1]);
                            }
                        }
                    }
                    stopLineTop = true;
                }  
            }   
        }

        for (var i = (parseInt(linePiece[1])-1); i >= (parseInt(linePiece[1])-1); i--) {
            if (i < 8 && i >= 0) { 
                var nextCells = document.getElementById('L' + i + '-' + split[1]).getElementsByTagName('i')[0].className;
                if ((!nextCells.includes('white')) && (!nextCells.includes('black'))) {
                    if (!stopLineBottom) {
                        cases.push('L' + i + '-' + split[1]);
                    } else {
                    }
                } else {
                    if (!stopLineBottom) {
                        if (rook.includes('white')) {
                            if (nextCells.includes('black')) {
                                cases.push('L' + i + '-' + split[1]);
                            }
                        } else if (rook.includes('black')) {
                            if (nextCells.includes('white')) {
                                cases.push('L' + i + '-' + split[1]);
                            }
                        }
                    }
                    stopLineBottom = true;
                } 
            } 
        }

        for (var i = parseInt(casePiece[1]); i <= (parseInt(casePiece[1])+1); i++) {
            if (i < 8 && i >= 0) { 
                var nextCells = document.getElementById(split[0] + '-' + 'C' + (parseInt(casePiece[1])+1)).getElementsByTagName('i')[0].className;
                if ((!nextCells.includes('white')) && (!nextCells.includes('black'))) {
                    if (!stopCaseTop) {
                        cases.push(split[0] + '-' + 'C' + (parseInt(casePiece[1])+1));
                    } else {
                    }
                } else {
                    if (!stopCaseTop) {
                        if (rook.includes('white')) {
                            if (nextCells.includes('black')) {
                                cases.push(split[0] + '-' + 'C' + (parseInt(casePiece[1])+1));
                            }
                        } else if (rook.includes('black')) {
                            if (nextCells.includes('white')) {
                                cases.push(split[0] + '-' + 'C' + (parseInt(casePiece[1])+1));
                            }
                        }
                    }
                    stopCaseTop = true;
                }
            }
        }

        for (var i = (parseInt(casePiece[1])); i >= (parseInt(casePiece[1])-1); i--) {
            if (i < 8 && i >= 0) { 
                var nextCells = document.getElementById(split[0] + '-' + 'C' + (parseInt(casePiece[1])-1)).getElementsByTagName('i')[0].className;
                if ((!nextCells.includes('white')) && (!nextCells.includes('black'))) {
                    if (!stopCaseBottom) {
                        cases.push(split[0] + '-' + 'C' + (parseInt(casePiece[1])-1));
                    } else {
                    }
                } else {
                    if (!stopCaseBottom) {
                        if (rook.includes('white')) {
                            if (nextCells.includes('black')) {
                                cases.push(split[0] + '-' + 'C' + (parseInt(casePiece[1])-1));
                            }
                        } else if (rook.includes('black')) {
                            if (nextCells.includes('white')) {
                                cases.push(split[0] + '-' + 'C' + (parseInt(casePiece[1])-1));
                            }
                        }
                    }
                    stopCaseBottom = true;
                } 
            }
        }

        stopLineTop = false;
        stopLineBottom = false;
        stopCaseTop = false;
        stopCaseBottom = false;

        var count = 0

        var bishop = document.getElementById(cell).getElementsByTagName('i')[0].className;

        for (var i = (parseInt(casePiece[1])); i < (parseInt(casePiece[1])+1); i++) {
            count++;
            // console.log('L' + (parseInt(linePiece[1])+count) + '-' + 'C' + (parseInt(casePiece[1])+count));
            if (((parseInt(linePiece[1])+count) < 8) && ((parseInt(casePiece[1])+count) < 8)) {
                var nextCells = document.getElementById('L' + (parseInt(linePiece[1])+count) + '-' + 'C' + (parseInt(casePiece[1])+count)).getElementsByTagName('i')[0].className;
                if ((!nextCells.includes('white')) && (!nextCells.includes('black'))) {
                    if (!stopLineTop) {
                        cases.push('L' + (parseInt(linePiece[1])+count) + '-' + 'C' + (parseInt(casePiece[1])+count));
                    } else {
                    }
                } else {
                    if (!stopLineTop) {
                        if (bishop.includes('white')) {
                            if (nextCells.includes('black')) {
                                cases.push('L' + (parseInt(linePiece[1])+count) + '-' + 'C' + (parseInt(casePiece[1])+count));
                            }
                        } else if (bishop.includes('black')) {
                            if (nextCells.includes('white')) {
                                cases.push('L' + (parseInt(linePiece[1])+count) + '-' + 'C' + (parseInt(casePiece[1])+count));
                            }
                        }
                    }
                    stopLineTop = true;
                }     
            }
        }

        count = 0;

        for (var i = (parseInt(casePiece[1])); i > (parseInt(casePiece[1])-1); i--) {
            count++;
            // console.log('L' + (parseInt(linePiece[1])+count) + '-' + 'C' + (parseInt(casePiece[1])-count));
            if ((parseInt(linePiece[1])+count) < 8) {
                var nextCells = document.getElementById('L' + (parseInt(linePiece[1])+count) + '-' + 'C' + (parseInt(casePiece[1])-count)).getElementsByTagName('i')[0].className;
                if ((!nextCells.includes('white')) && (!nextCells.includes('black'))) {
                    if (!stopLineBottom) {
                        cases.push('L' + (parseInt(linePiece[1])+count) + '-' + 'C' + (parseInt(casePiece[1])-count));
                    } else {
                    }
                } else {
                    if (!stopLineBottom) {
                        if (bishop.includes('white')) {
                            if (nextCells.includes('black')) {
                                cases.push('L' + (parseInt(linePiece[1])+count) + '-' + 'C' + (parseInt(casePiece[1])-count));
                            }
                        } else if (bishop.includes('black')) {
                            if (nextCells.includes('white')) {
                                cases.push('L' + (parseInt(linePiece[1])+count) + '-' + 'C' + (parseInt(casePiece[1])-count));
                            }
                        }
                    }
                    stopLineBottom = true;
                } 
            }
        }

        count = 0;

        for (var i = (parseInt(casePiece[1])); i > (parseInt(casePiece[1])-1); i--) {
            count++;
            // console.log('L' + (parseInt(linePiece[1])-count) + '-' + 'C' + (parseInt(casePiece[1])-count));
            if (((parseInt(casePiece[1])-count) >= 0) && ((parseInt(linePiece[1])-count) >= 0)) {
                var nextCells = document.getElementById('L' + (parseInt(linePiece[1])-count) + '-' + 'C' + (parseInt(casePiece[1])-count)).getElementsByTagName('i')[0].className;
                if ((!nextCells.includes('white')) && (!nextCells.includes('black'))) {
                    if (!stopCaseTop) {
                        cases.push('L' + (parseInt(linePiece[1])-count) + '-' + 'C' + (parseInt(casePiece[1])-count));
                    } else {
                    }
                } else {
                    if (!stopCaseTop) {
                        if (bishop.includes('white')) {
                            if (nextCells.includes('black')) {
                                cases.push('L' + (parseInt(linePiece[1])-count) + '-' + 'C' + (parseInt(casePiece[1])-count));
                            }
                        } else if (bishop.includes('black')) {
                            if (nextCells.includes('white')) {
                                cases.push('L' + (parseInt(linePiece[1])-count) + '-' + 'C' + (parseInt(casePiece[1])-count));
                            }
                        }
                    }
                    stopCaseTop = true;
                }     
            }
        }

        count = 0;

        for (var i = (parseInt(casePiece[1])); i < (parseInt(casePiece[1])+1); i++) {
            count++;
            // console.log('L' + (parseInt(linePiece[1])-count) + '-' + 'C' + (parseInt(casePiece[1])+count));
            if (((parseInt(casePiece[1])+count) < 8) && ((parseInt(linePiece[1])-count) >= 0)) {
                var nextCells = document.getElementById('L' + (parseInt(linePiece[1])-count) + '-' + 'C' + (parseInt(casePiece[1])+count)).getElementsByTagName('i')[0].className;
                if ((!nextCells.includes('white')) && (!nextCells.includes('black'))) {
                    if (!stopCaseBottom) {
                        cases.push('L' + (parseInt(linePiece[1])-count) + '-' + 'C' + (parseInt(casePiece[1])+count));
                    } else {
                    }
                } else {
                    if (!stopCaseBottom) {
                        if (bishop.includes('white')) {
                            if (nextCells.includes('black')) {
                                cases.push('L' + (parseInt(linePiece[1])-count) + '-' + 'C' + (parseInt(casePiece[1])+count));
                            }
                        } else if (bishop.includes('black')) {
                            if (nextCells.includes('white')) {
                                cases.push('L' + (parseInt(linePiece[1])-count) + '-' + 'C' + (parseInt(casePiece[1])+count));
                            }
                        }
                    }
                    stopCaseBottom = true;
                } 
            }
        }

        if (cases.length == 0) {
            badMoove = true;
        }

        console.log(cases);

        for (var i = 0; i < cases.length; i++) {
            document.getElementById(cases[i]).style.backgroundColor = "green";
        }

        stopLineTop = false;
        stopLineBottom = false;
        stopCaseTop = false;
        stopCaseBottom = false;

    }

    function verifKnightMoove(cell) {
        cases = [];

        var split = cell.split('-');
        var linePiece = split[0].split('L');
        var casePiece = split[1].split('C');

        function verif(param) {
            var split = param.split('-');
            var linePiece = split[0].split('L');
            var casePiece = split[1].split('C');
            if (parseInt(linePiece[1]) < 8 && parseInt(linePiece[1]) >= 0) {
                if (parseInt(casePiece[1]) < 8 && parseInt(casePiece[1]) >= 0) {
                    console.log(param);
                    var nextCells = document.getElementById(param).getElementsByTagName('i')[0].className;
                    var knight = document.getElementById(cell).getElementsByTagName('i')[0].className;
                    if ((!nextCells.includes('white')) && (!nextCells.includes('black'))) {
                        cases.push(param);
                    } else {
                        if (knight.includes('white')) {
                            if (nextCells.includes('black')) {
                                cases.push(param);
                            }
                        } else if (knight.includes('black')) {
                            if (nextCells.includes('white')) {
                                cases.push(param);
                            }
                        }
                    }
                }
            }
        }
        
        verif('L' + (parseInt(linePiece[1])+2) + '-' + 'C' + (parseInt(casePiece[1])+1));
        verif('L' + (parseInt(linePiece[1])+2) + '-' + 'C' + (parseInt(casePiece[1])-1));
        verif('L' + (parseInt(linePiece[1])-2) + '-' + 'C' + (parseInt(casePiece[1])+1));
        verif('L' + (parseInt(linePiece[1])-2) + '-' + 'C' + (parseInt(casePiece[1])-1));

        verif('L' + (parseInt(linePiece[1])+1) + '-' + 'C' + (parseInt(casePiece[1])+2));
        verif('L' + (parseInt(linePiece[1])+1) + '-' + 'C' + (parseInt(casePiece[1])-2));
        verif('L' + (parseInt(linePiece[1])-1) + '-' + 'C' + (parseInt(casePiece[1])+2));
        verif('L' + (parseInt(linePiece[1])-1) + '-' + 'C' + (parseInt(casePiece[1])-2));

        if (cases.length == 0) {
            badMoove = true;
        }

        console.log(cases);
        for (var i = 0; i < cases.length; i++) {
            document.getElementById(cases[i]).style.backgroundColor = "green";
        }

    }

    function checkKing (cell, piece) {
        let checkCell = cell.id;
        let checkPiece = piece[0].className;
        if (checkPiece.includes('pawn')) {
            verifPawnMoove(checkCell);
            getKing();
        } else if (checkPiece.includes('rook')) {
            verifRookMoove(checkCell);
            getKing();
        } else if (checkPiece.includes('bishop')) {
            verifBishopMoove(checkCell);
            getKing();
        } else if (checkPiece.includes('queen')) {
            verifQueenMoove(checkCell);
            getKing();
        } else if (checkPiece.includes('king')) {
            verifKingMoove(checkCell);
            getKing();
        } else if (checkPiece.includes('knight')) {
            verifKnightMoove(checkCell);
            getKing();
        }

        function getKing() {
            for (var i = 0; i < cases.length; i++) {
                console.log(cases);
                king = document.getElementById(cases[i]).getElementsByTagName('i')[0].className;
                if (king.includes('king')) {
                    document.getElementById('checkKing').innerHTML = "ECHEC, déplacer le roi";
                }
            }
        }
    }

    function win() {
        let winner = document.getElementsByClassName('cell');
        let whiteKing = false;
        let blackKing = false;
        let win = false;
        for (var i = 0; i < winner.length; i++) {
            if (winner[i].getElementsByTagName('i')[0].className.includes('king') && winner[i].getElementsByTagName('i')[0].className.includes('white')) {
                whiteKing = true;
            }
            if (winner[i].getElementsByTagName('i')[0].className.includes('king') && winner[i].getElementsByTagName('i')[0].className.includes('black')) {
                blackKing = true;
            }
        }
        if (!whiteKing) {
            document.getElementById('checkKing').innerHTML = "ECHEC ET MAT, " + playerTwo['name'] + " GAGNE LA PARTIE";
            return win = true;
        }
        if (!blackKing) {
            document.getElementById('checkKing').innerHTML = "ECHEC ET MAT, " + playerOne['name'] + " GAGNE LA PARTIE";
            return win = true;
        }

    }

}
