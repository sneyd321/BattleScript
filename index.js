

var shipLocationMiddle = Math.floor(Math.random() * 5);
var shipLocationTop = shipLocationMiddle + 1;
var shipLocationBottom = shipLocationMiddle -1;

var guess = 0;
var shipSunk = false;

var hitCounter = 0;



while (shipSunk == false){
    guess = prompt("Enter a guess:");
    
    if (guess <= 0 && guess >= 6){
        console.log(guess);
        alert("Invalid Input! Enter a guess");
        continue;
    }
    //Check if ship has been sunk
    if (guess == shipLocationMiddle || guess == shipLocationTop || guess == shipLocationBottom){
        hitCounter += 1;
        if (hitCounter < 3){
            alert("HIT!")
        }
        else{
            alert("Player Wins");
            shipSunk = true;
            break;
        }
    }
    else{
        alert("MISS...");
    }
    


}





//display user stats

guess = prompt("Enter a guess:");


