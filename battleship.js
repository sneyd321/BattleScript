function Input(input) {
  this.input = input;
  this.tablePosition = "";

  /* Function that validates user input and manipulates it into the correct format.
  *  @Params: None
  *  @Returns: A string with the corresoding error. If input is valid returns "Fire!"
  */
  this.validateInput = function() {
    //if input is empty
    if (!this.input) {
      return "Error: Please enter a value.";
    }
    //is the length of the input is not exactly 2
    if (this.input.length < 2 || this.input.length > 2) {
      return "Error: Please enter a value in the format LetterNumber ex. E4";
    }
    //extract the letter from input
    var letter = this.input[0];
    //extract the number from the input
    var number = parseInt(this.input[1]);
    //if number is between 6 and 0
    if (number > 6 || number < 0) {
      return "Error: Please enter a number in the range of [0-6]";
    }
    //if the letter is a string and the number is a number
    if (typeof letter === "string" && !isNaN(number)) {
      //get the numerical value of the letter and set the value of table position
      this.translateLetter(letter);

      //if string is not empty
      if (this.tablePosition) {
        //add the number to the string
        this.tablePosition += number.toString();
        return "Fire!";

      } else {
        return "Error: Please enter a capital letter in the range of [A-G]";
      }
    } else {
      return "Error: Please enter a value in the format LetterNumber ex F6";
    }
  };

  /* Function that converts a letter entered by the user and translates it into
  *  a numeric value. Translated value is saved into local variable table position.
  *  @Param: letter: letter entered by the user
  *  @Return: Void
  */
  this.translateLetter = function(letter) {
    //Get all possible letter values
    yIndices = ["A", "B", "C", "D", "E", "F", "G"];
    //for every possible letter
    for (var i = 0; i < yIndices.length; i++) {
      //does the letter match
      if (letter == yIndices[i]) {
        //set the translated value
        var translatedValue = i;
        //set table position
        this.tablePosition = translatedValue.toString();
      }
    }
  };
}

function Game() {
  this.history = [];
  this.ships = [];
  this.gameOverCounter = 0;

  /*  Function that updates the UI based on the user hitting the fire button.
   *  @Params: None
   *  @Return: Void
   */ 
  this.fire = function() {
    //get user input
    var value = document.getElementById("guessInput").value;
    //get message area to prompt users
    var messageArea = document.getElementById("messageArea");
    //Create "instance" of input variable
    var input = new Input(value);
    //Check if input is valid
    var inputMessage = input.validateInput();
    //Update message are with error or Fire!
    messageArea.innerHTML = inputMessage;
    //log users input
    this.history.push(input.tablePosition);
    //convert history array to set so that all values are unique
    var set = new Set(this.history);
    //if array size and set size do not match
    if (set.size != this.history.length) {
      //remove the last element from history 
      this.history.pop();
      //prompt user
      messageArea.innerHTML = "Dont waste ammo! Choose another spot.";
      return;
    }
    //input was valid
    if (inputMessage === "Fire!") {
      //for all the ships
      for (var i = 0; i < this.ships.length; i++) {
        //determine if ship has been hit
        var displayMessage = this.ships[i].isHit(input);
        //if the ship has been sunk
        if (displayMessage == "Sink") {
          //update message area
          displayMessage = "You sunk my " + this.ships[i].name;
          //update UI with Red Square
          document
            .getElementById(input.tablePosition)
            .setAttribute("class", "hit");
          //inform user of hit
          messageArea.innerHTML = displayMessage;
          //increment ship sunk counter
          this.gameOverCounter += this.gameOver();
          //console.log(this.gameOverCounter);
          //if the counter equals the number of ships
          if (this.gameOverCounter == this.ships.length) {
            messageArea.innerHTML = "Game Over!";
          }
          break;
        }
        //if hit
        if (displayMessage == "Hit!") {
          //update UI with Red Square
          document
            .getElementById(input.tablePosition)
            .setAttribute("class", "hit");
          //inform user of hit
          messageArea.innerHTML = displayMessage;
          break;
        }
        //if miss
        if (displayMessage == "Miss...") {
          //udate UI with White Square
          document
            .getElementById(input.tablePosition)
            .setAttribute("class", "miss");
          //inform user of miss
          messageArea.innerHTML = displayMessage;
        }
      }
    }
    /*  Function that returns 1 if a ship is sunk, 0 otherwise
     *  @Params: None
     *  @Return: int 1 if ship is sunk
     *               0 otherwise 
     */
    this.gameOver = function() {
      //for all positions on the ship
      for (var i = 0; i < this.ships.length; i++) {
        //is number of positions is 0
        if (this.ships[i].getPositions.length == 0) {
          return 1;
        }
      }
      return 0;
    };
  };

  /*  Function that checks if any ships overlap with each other
   *  @Params: None
   *  @Return: True if no overlap
   *           False if there is overlap
   */
  this.valididateGame = function() {
    //create array to hold all ship positions
    var shipsArray = [];
    //for every ship
    for (var i = 0; i < this.ships.length; i++) {
      //add the positions to the shipsArray
      shipsArray = shipsArray.concat(this.ships[i].getPositions());
    }
    //convert shipArray to a set
    var set = new Set(shipsArray);

    //if set size equals array size
    if (set.size != shipsArray.length) {
      return false;
    }
    //Console log to show location of the battleships
    console.log(shipsArray);
    return true;
  };

  /*  Function that intializes all game related elements
   *  @Param: None
   *  @Return: Void
   */
  this.initGame = function(){
    //Create ship "instances"
    var submarine = new Ship(4, "Submarine");
    var destroyer = new Ship(3, "Destroyer");
    var minesweeper = new Ship(2, "Minesweeper");
    //add to ships array
    this.ships.push(submarine);
    this.ships.push(destroyer);
    this.ships.push(minesweeper);
    //for all ships
    for (var i = 0; i < this.ships.length; i++) {
      //set inital position 
      this.ships[i].setVerticlePosition();
    }
    //While ships are overlapping
    while(!this.valididateGame()){
      //place the ships
      this.placeShips();
    }
    
  }
  /*  Function that places the ships on random positions on the map
   *  @Params: None
   *  @Return: Void
   */ 
  this.placeShips = function(){
    //For every ship
    for (var i = 0; i < this.ships.length; i++) {
      //reset positions
      this.ships[i].positions = [];
      //randomly determine if ship will be verticle or horizontal
      if (Math.floor(Math.random() * 2) == 1) {
        //set x
        this.ships[i].x = Math.floor(Math.random() * (7 - this.ships[i].size));
        //set y
        this.ships[i].y = Math.floor(Math.random() * (7 - this.ships[i].size));
        //place vertically
        this.ships[i].setVerticlePosition();
      } else {
        //set x
        this.ships[i].x = Math.floor(Math.random() * (7 - this.ships[i].size));
        //set y
        this.ships[i].y = Math.floor(Math.random() * (7 - this.ships[i].size));
        //place horizontally
        this.ships[i].setHorizontalPosition();
      }
    }
  }

}

function Ship(size, name) {
  this.name = name;
  this.size = size;
  //X Y referes to inital coordinates set; see setHorizontal/VerticalPosition
  this.x = 0;
  this.y = 0;
  this.xPositions = [];
  this.yPositions = [];
  this.positions = [];

  /* Function that determines if a ship has been hit. 
  *  @Params: input: value that is compared with every position on the ship.
  *  @Return: string: value indicating if a input hit, missed or sunk.
  */
  this.isHit = function(input) {
    //for all values on the ship
    for (var i = 0; i < this.positions.length; i++) {
      //if input matches any positions on the ship
      if (input.tablePosition === this.positions[i]) {
        //get the index of that position
        var index = this.positions.indexOf(input.tablePosition);
        //if position exists
        if (index != -1) {
          //remove position from array
          this.positions.splice(index, 1);
          //if all positions are hit
          if (this.positions.length == 0) {
            return "Sink";
          }
        }
        return "Hit!";
      }
    }
    //otherwise Miss...
    return "Miss...";
  };
  /* Function that returns the positions on the ship
  *  @Params: None
  *  @Return: Array of positions
  */
  this.getPositions = function() {
    return this.positions;
  };
  /*  Function that sets the horizontal position of the ship and assigns positions to positions array
   *  @Params: None
   *  @Return: Void
   */
  this.setHorizontalPosition = function() {
    //for the size of the ship
    for (var i = 0; i < this.size; i++) {
      //fill position array
      this.positions.push(this.x.toString() + (this.y + i).toString());
    }
  };
  /*  Function that sets the horizontal position of the ship and assigns positions to positions array
   *  @Params: None
   *  @Return: Void
   */
  this.setVerticlePosition = function() {
    //for the size of the ship
    for (var i = 0; i < this.size; i++) {
      //fill the position array
      this.positions.push((this.x + i).toString() + this.y.toString());
    }
  };
}

//game "instance"
var game = new Game();
//initalize the game
game.initGame();

//Event handler for the fire button
document.getElementById("fireButton").onclick = function() {
  //Fire!
  game.fire();
};
