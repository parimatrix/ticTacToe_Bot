/**
 * Created by Parikansh on 01/10/2018.
 */
var board = [0,1,2,3,4,5,6,7,8];
var level = -1;
var human = "X";
var bot = "O";
var finished = false;
var clicked = [];
var w1,w2,w3;

function avPositions(newboard) {
    return newboard.filter(function (elem) {return elem!="X" && elem!="O";})
}

function winUtil(newboard, player, x, y, z) {
    if (newboard[x]==player && newboard[y]==player && newboard[z]==player) {
        w1 = x, w2 = y, w3 = z;
        return true;
    }
    return false;
}
function winCondition(newboard, player) {
    return(winUtil(newboard,player,0,1,2) ||
        winUtil(newboard,player,3,4,5) ||
        winUtil(newboard,player,6,7,8) ||
        winUtil(newboard,player,0,3,6) ||
        winUtil(newboard,player,1,4,7) ||
        winUtil(newboard,player,2,5,8) ||
        winUtil(newboard,player,0,4,8) ||
        winUtil(newboard,player,2,4,6))
}

function minimax(newboard,player) {
    var avBoard = avPositions(newboard);
    //console.log(avBoard.length);
    var finalMove = {};

    if(winCondition(newboard,human)) {/*console.log("loss");*/return {score : -10};}
    else if(winCondition(newboard,bot)){/*console.log("win");*/return {score : 10};}
    else if(avBoard.length==0){/*console.log("draw");*/return {score: 0}}


    if(player == "X")
    {
        var bestScore = +1000;
        var bestIndex = -1;
        for(var i=0;i<avBoard.length;i++)
        {
            newboard[avBoard[i]] = "X";
            var res = minimax(newboard,"O");
            if(res.score < bestScore){
                //console.log("updating");
                bestScore = res.score;
                bestIndex = avBoard[i];
            }
            newboard[avBoard[i]] = avBoard[i];
            //console.log("looping");
        }
        finalMove.index = bestIndex;
        finalMove.score = bestScore;
    }
    else
    {
        var bestScore = -1000;
        var bestIndex = -1;
        for(var i=0;i<avBoard.length;i++)
        {
            newboard[avBoard[i]] = "O";
            var res = minimax(newboard,"X");
            if(res.score > bestScore){
                //console.log("updating");
                bestScore = res.score;
                bestIndex = avBoard[i];
            }
            newboard[avBoard[i]] = avBoard[i];
        }
        finalMove.index = bestIndex;
        finalMove.score = bestScore;
    }
    return finalMove;
}

function makeLine(x,y,z) {
    document.getElementById("sq"+x).style.color = "red";
    document.getElementById("sq"+y).style.color = "red";
    document.getElementById("sq"+z).style.color = "red";
}

function makeMove(elem) {
    if(finished) return ;
    if(clicked.indexOf(elem.id) > -1) return ;
    clicked.push(elem.id);
    var eleID = elem.id;
    var position = parseInt(eleID[2]);
    board[position] = "X";
    elem.innerHTML+="X";

    if(winCondition(board,human)) {
        console.log("Human Wins !");
        finished =true;
        makeLine(w1,w2,w3);
        document.getElementById("footer").innerHTML+="You Win !";
        document.getElementById("refresh").style.visibility = "visible";
        return ;
    }
    var avBoard = avPositions(board);
    if(avBoard.length==0) {
        console.log("Game Tie.");
        finished =true;
        document.getElementById("footer").innerHTML+="Game Tie !";
        document.getElementById("refresh").style.visibility = "visible";
        return ;
    }
    var botPos = {};
    if(level == 0)
    {
        botPos.index = avBoard[Math.floor(Math.random() * avBoard.length)];
    }
    else if(level == 1)
    {
        var chance = Math.floor(Math.random() * (9));
        if(chance <= 2) {
            botPos.index = avBoard[Math.floor(Math.random() * avBoard.length)];
            console.log("Random botPos = " + botPos.index);
        }
        else
            botPos = minimax(board, "O");
    }
    else
        botPos = minimax(board, "O");
    //console.log("botPos = " + botPos.index);
    board[botPos.index] = "O";
    document.getElementById("sq"+botPos.index).innerHTML+="O";
    if(winCondition(board,bot)) {
        console.log("Bot Wins !");
        finished =true;
        makeLine(w1,w2,w3);
        document.getElementById("footer").innerHTML+="Bot Wins !";
        document.getElementById("refresh").style.visibility = "visible";
        //alert("Bot Wins.");
    }
}