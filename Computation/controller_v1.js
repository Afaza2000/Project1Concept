class Controller {

    // This is the state we start with.
    constructor() {
        this.gameState = "PLAY";
    }
    
    // This is called from draw() in sketch.js with every frame
    update() {
        switch(this.gameState) {
            case "PLAY":
                display.clear();
            
                // show all players in the right place, by adding them to display buffer
                display.setPixel(playerOne.position, playerOne.playerColor);
                
                // now add the target
                display.setPixel(target.position, target.playerColor);

                break;

            // This state is used to play an animation, after a target has been caught by a player 
            case "COLLISION":
                
                 // clear screen at frame rate so we always start fresh      
                 display.clear();

                // play explosion animation one frame at a time.
                // first figure out what frame to show
                let frameToShow = collisionAnimation.currentFrame();    // this grabs number of current frame and increments it 
                
                // then grab every pixel of frame and put it into the display buffer
                for(let i = 0; i < collisionAnimation.pixels; i++) {
                    display.setPixel(i, collisionAnimation.animation[frameToShow][i]);                    
                }

                //check if animation is done and we should move on to another state
                if (frameToShow == collisionAnimation.animation.length-1)  {
                    
                    // We've hit score max, this player wins
                    if (playerOne.score >= score.max) {
                        score.winner = playerOne.playerColor;   // store winning color in score.winner
                        this.gameState = "SCORE";               // go to state that displays score

                    // We haven't hit the max score yet, keep playing    
                    } else {
                        target.position = parseInt(random(0, displaySize));  // move the target to a new random position
                        target.playerColor = color(random(255), random(255), random(255)); // change target color
                        this.startNewLevel(); // Start a new level
                        this.gameState = "PLAY"; // Ensure the game state is updated to reflect the change
                    }
                } 

                break;

            // Game is over. Show winner and clean everything up so we can start a new game.
            case "SCORE":       
            
                // reset player's score
                playerOne.score = 0;

                // put the target somewhere else, so we don't restart the game with player and target in the same place
                target.position = parseInt(random(1, displaySize));

                //light up w/ winner color by populating all pixels in buffer with their color
                display.setAllPixels(score.winner);                    

                // Transition to a new state to prevent looping
                this.gameState = "END";

                break;

            // End state to prevent looping
            case "END":
                // Do nothing or show end screen
                break;

            // New state to handle black screen
            case "BLACK_SCREEN":
                display.setAllPixels(color(0, 0, 0));
                display.show();
                break;

            // Not used, it's here just for code compliance
            default:
                break;
        }
    }

    // Function to start a new level
    startNewLevel() {
        display.resetToWhite(); // Reset all pixels to white
        display.show();         // Show the display
        setTimeout(() => {
            display.changeColors(); // Change colors after a delay
            display.show();         // Show the display
        }, 500); // 750 milliseconds delay
    }
}

// This function gets called when a key on the keyboard is pressed
function keyPressed() {

    // Move player one to the left if letter A is pressed
    if (key == 'A' || key == 'a') {
        playerOne.move(-1);
    }
    
    // Move player one to the right if letter D is pressed
    if (key == 'D' || key == 'd') {
        playerOne.move(1);
    }    

    // Check if player is on the target and Enter key is pressed
    if (keyCode === ENTER) {
        if (playerOne.position == target.position) {
            playerOne.score++;              // increment score
            controller.gameState = "COLLISION";   // go to COLLISION state
        } else {
            // Turn everything black if Enter is pressed on the wrong pixel
            display.setAllPixels(color(0, 0, 0));
            display.show(); // Update the display to reflect the change
            controller.gameState = "BLACK_SCREEN"; // Change the game state to BLACK_SCREEN
        }
    }

    // When you press the letter R, the game resets back to the play state
    if (key == 'R' || key == 'r') {
        controller.startNewLevel(); // Reset to white and go through the delay to random color
        controller.gameState = "PLAY";
    }
}

// This function gets called when the mouse is pressed
function mousePressed() {
    // When clicking on the 1D bar with the mouse, toggle full-screen mode.
    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
        let fs = fullscreen();
        fullscreen(!fs);
    }
}