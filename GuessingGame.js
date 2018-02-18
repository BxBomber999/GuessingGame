function generateWinningNumber() {
	var num = Math.floor(Math.random() * 100 + 1);
	if(num === 0) {
		return 1;
	}
	return num;
}

function shuffle(arr) {
	var m = arr.length;
	while(m) {
		var i = Math.floor(Math.random() * m--);
		var temp = arr[m];
		arr[m] = arr[i];
		arr[i] = temp;
	}
	return arr;
}

function Game() {
	this.pastGuesses = [];
	this.playersGuess = null;
	this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function() {
	return Math.abs(this.playersGuess - this.winningNumber);
};

Game.prototype.isLower = function() {
	return this.playersGuess < this.winningNumber;
};

Game.prototype.playersGuessSubmission = function(num) {
	var output = this.checkGuess(num);
	if(output === 'Invalid') {
		throw 'That is an invalid guess.';
 	}
 	$('#title').html(output);
	return output;
};

Game.prototype.checkGuess = function(num) {
	
	if(num < 1 
		|| num > 100 
		|| isNaN(num)) {
		return 'Invalid';
 	}
 	if (this.pastGuesses.indexOf(num) !== -1) {
 		return 'You have already guessed that number.';
 	}
 	this.playersGuess = num;
 	this.pastGuesses.push(num);
 	$('#guess' + this.pastGuesses.length).html(this.playersGuess);
 	if (num === this.winningNumber) {
 		$('#subtitle').html("Click reset to play again.")
 		$('#hint').prop('disabled',true);
 		$('#guessInput, #go').hide(600);
 		return 'You Win!';
 	} else if (this.pastGuesses.length === 5) {
 		$('#subtitle').html("Click reset to play again.")
 		$('#hint').prop('disabled',true);
 		$('#guessInput, #go').hide(600);
 		return 'You Lose.';
 	} else {
 		var diff = this.difference();
        if(this.isLower()) {
            $('#subtitle').text("Guess Higher!")
        } else {
            $('#subtitle').text("Guess Lower!")
        }
 		if (diff < 10) {
 			return 'You\'re burning up!';
 		} else if (diff < 25) {
 			return 'You\'re lukewarm.';
 		} else if (diff < 50) {
 			return 'You\'re a bit chilly.';
 		} else {
 			return 'You\'re ice cold!';
 		}
 	}
};

function newGame() {
	$('#hint, #go, #guessInput').show(200);
	return new Game();
}

Game.prototype.provideHint = function () {
	var win = this.winningNumber;
	var num2 = generateWinningNumber();
	var num3 = generateWinningNumber();
	return shuffle([win, num2, num3]);
}

function guess(game) {
	var value = +$('#guessInput').val();
	$('#guessInput').val('');
	var output = game.playersGuessSubmission(value);
	console.log(output);
}

Game.prototype.updateGuessList = function () {
	for (var i = 0; i < this.pastGuesses.length -1; i++) {
		var listID = '#guess' + i;
		$(listID).html(this.pastGuesses[i]);
	}
}

$(document).ready(function() {
	var game = new Game();
	$('#go').on('click', function() {
		guess(game);
	});
	$('#guessInput').on('keypress', function(event) {
		if(event.which === 13) {
			guess(game)
		}
	});
	$('#reset').click(function() {
		game = newGame();
		$('#hint').prop('disabled',false);
		$('#subtitle').html('Enter your next guess:');
		$('#title').html('Welcome to the Guessing Game!');
		$('#guessInput, #go').show();
		$('.guess').html('--');
	})
	$('#hint').click(function() {
		$('#hint').prop('disabled',true);
		var hints = game.provideHint()
		$('#title').html("Hmmm.  Is it " + hints[0] + "? Or " + hints[1] + "? Maybe it's " + hints[2] + ".");
	})
});



