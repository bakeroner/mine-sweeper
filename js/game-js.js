const gameField = document.getElementById("gameField");
const gameWindow = document.getElementById("gameWindow");
const menuBlock = document.getElementById("menuBlock");
const minesIndicator = document.querySelector(".stats__mines");
const timerIndicator = document.querySelector(".stats__timer");
const gameStats = document.querySelector(".game__stats");
const gameFooter = document.querySelector(".game__footer");
const restartButton = document.querySelector(".footer__button");
let game;//variable for a new game class object
let setTime;//timer variable

class MineGame {

	constructor (fieldHeight,fieldWidth,minesNumber) {
		/*variables*/
		this.fieldHeight = fieldHeight;
		this.fieldWidth = fieldWidth;
		this.areaNearCurrentTarget = [];
		this.minesNear = 0;
		this.gameEnd = false;
		this.storage = {
		minesNumber: minesNumber,
		flagsNumber: minesNumber,
		correctFlags: 0,
		minesPlacement: [],
		timer: 0
		}		
	}
	fieldBuilder () {
		/*building field by using variables*/
		/*indexing field in some way*/
		/*setting mines*/
		let flagSet = document.createElement("p");
		flagSet.innerHTML = this.storage.flagsNumber;
		minesIndicator.appendChild(flagSet);
		let timerSet = document.createElement("p");
		timerSet.innerHTML = this.storage.timer;
		timerIndicator.appendChild(timerSet);

		for (let i = 0; i<this.fieldWidth; i++) {
			for(let j = 0; j<this.fieldHeight; j++) {
				let item = document.createElement("div");
				item.classList.add("cellClass");
				item.setAttribute("data-x", j);
				item.setAttribute("data-y", i);
				gameField.appendChild(item);
			}
		}
		let minesCounter = this.storage.minesNumber;
		while (minesCounter>0) {
			for (let i = 0; i<this.fieldWidth; i++) {
				for (let j = 0; j<this.fieldHeight; j++) {
					let randomNumber = Math.floor((Math.random() * 10) + 1);
					if (randomNumber == 10 && minesCounter>0) {
						let item = document.querySelector(`[data-x='${j}'][data-y='${i}']`);
						if (!item.firstChild) {
							let currentPosition = {x: j, y: i};
							this.storage.minesPlacement.push(currentPosition);
							let mineIco = document.createElement("img");
							mineIco.setAttribute("src", "images/bomb.png");
							mineIco.classList.add("bombImage", "hideElement");
							item.appendChild(mineIco);
							minesCounter--;
						}
					}
				}
			}		
		}
	}
		neighboursCheck (cellX, cellY) {
		this.areaNearCurrentTarget = [];
		let minesArray = this.storage.minesPlacement;
		this.minesNear = 0;
		for (let i = cellX-1; i<=cellX+1; i++) {
			for (let j = cellY-1; j<=cellY+1; j++) {
				let currentCell = {x: i, y: j};
				let elementNearby = document.querySelector(`[data-x='${i}'][data-y='${j}']`)
				this.areaNearCurrentTarget.push(elementNearby);
			}
		}	
		this.areaNearCurrentTarget.forEach((elem) => {
			for (let i = 0; i<minesArray.length; i++) {
				if (elem && +elem.dataset.x == minesArray[i].x && +elem.dataset.y == minesArray[i].y) {
					this.minesNear++;
				}
			}
		})
		if (this.minesNear) {
			return false;
		}
		else {
			return true;
		}
	}
	cellOpener (currentTarget) {
		/*open first cell show mines number open empty cells*/
		if (currentTarget.classList.contains("cellClass"))
		{
			/*set timer*/
			this.timer();

			currentTarget.classList.replace("cellClass", "cellClassOpen");
			if (!this.neighboursCheck(+currentTarget.dataset.x, +currentTarget.dataset.y)) {
				let item = document.createElement("p");
				item.classList.add("cellText");
				item.innerHTML = this.minesNear;
				if (!currentTarget.children[0]) {
					currentTarget.appendChild(item);
				}
			}
			else {
				/* Opening empty cells goes here*/
				currentTarget.classList.add("blank");
				this.emptyCellOpener();
			}
		}
	}
		emptyCellOpener () {//!!!check and rewrite
		this.areaNearCurrentTarget.splice(4,1);
		let cellNeighbours = this.areaNearCurrentTarget;
		for (let i = 0; i<cellNeighbours.length; i++) {
			if (cellNeighbours[i]) {
				if (!this.neighboursCheck(+cellNeighbours[i].dataset.x, +cellNeighbours[i].dataset.y)) {
					cellNeighbours[i].classList.replace("cellClass", "cellClassOpen");
					let item = document.createElement("p");
					item.classList.add("cellText");
					item.innerHTML = this.minesNear;
					if (!cellNeighbours[i].children[0]) {
						cellNeighbours[i].appendChild(item);
					}
				}
				else if (this.neighboursCheck(+cellNeighbours[i].dataset.x, +cellNeighbours[i].dataset.y)) {
					if (!cellNeighbours[i].classList.contains("blank")) {
						cellNeighbours[i].classList.remove("cellClass");
						cellNeighbours[i].classList.add("blank", "cellClassOpen");
						this.areaNearCurrentTarget.forEach((elem) => {
							if (elem) {
								let count = 0;
								for (let i = 0; i<cellNeighbours.length; i++) {
									if (cellNeighbours[i]) {
										if (elem.dataset.x == cellNeighbours[i].dataset.x && elem.dataset.y == cellNeighbours[i].dataset.y) {
											count++;		
										}
									}
								}
								if (!count) {
									cellNeighbours.push(elem);
								}
							}
						})
					}
				}
			}
		}
	}
	winOrDie (currentTargetX, currentTargetY, isItLeft) {
		/*checking end of the game showing Congratulation Menu*/
		if (this.storage.correctFlags == this.storage.minesNumber && this.storage.flagsNumber == 0 && !document.querySelector('.cellClass:not(.flag)')) {
			this.gameEnd = true;
			clearInterval(setTime);
			gameFooter.classList.toggle('hideElement');
			gameFooter.children[0].innerHTML = `Poseur!<br>Your score:<br>${this.storage.timer}`;
		}
		this.storage.minesPlacement.forEach((elem) => {
			if (elem.x == currentTargetX && elem.y == currentTargetY && isItLeft) {
				document.querySelectorAll('.bombImage').forEach ((elem) => {
					if (elem.parentNode.classList.contains('cellClassOpen')) {
						elem.parentNode.classList.replace('cellClassOpen', 'cellClassOpenMine');
					}
					if (!elem.parentNode.classList.contains('flag')) {
						elem.classList.toggle('hideElement');
					}
				})
				clearInterval(setTime);
				gameFooter.classList.toggle('hideElement');
				gameFooter.children[0].innerHTML = `Not Your Best Day?<br>Hah!`;
				this.gameEnd = true;
			}
		})
	}
	timer () {
		if (!this.storage.timer) {
			let promise = new Promise((resolve, reject) => {
					if (!this.gameEnd) {
						resolve('tickTack');
					}
			})
			promise
				.then(
					tickTack => {
						setTime = setInterval(() => {
							this.storage.timer++;
							timerIndicator.children[0].innerHTML = this.storage.timer;
						}, 1000);
					})
		}		
	}
}
menuBlock.addEventListener("click", (event) => {
	let target = event.target;
	if (target.classList.contains('choose-difficulty__button')) {
		switch (target) {
			case document.querySelector('#beginnerButton'):
			game = new MineGame(9,9,10);
			gameField.classList.toggle("beginnerField");
			gameStats.classList.toggle('game__statsBeginner');
			break;
			case document.querySelector('#amateurButton'):
			game = new MineGame(16,16,40);
			gameField.classList.toggle("amateurField");
			gameStats.classList.toggle('game__statsAmateur');
			break;
			case document.querySelector('#expertButton'):
			game = new MineGame(30,16,99);
			gameField.classList.toggle("expertField");
			gameStats.classList.toggle('game__statsExpert');
			break;
			default: break;
		}
		menuBlock.classList.toggle("hideElement");
		gameWindow.classList.toggle("hideElement");
		game.fieldBuilder();
	}
})
gameField.addEventListener("click", (event) => {
	/*using event delegation on field elements to open*/
	let target = event.target;
	if (!game.gameEnd) {
		game.cellOpener(target);
		game.winOrDie(+target.dataset.x, +target.dataset.y, true);
	}
})
gameField.addEventListener("contextmenu", (event) => { //!!!rewrite all
	/*using event delegation on field elements to set flag*/
	event.preventDefault();
	let target = event.target;
	if (target.classList.contains('cellClass') && !game.gameEnd) {
		if (!target.classList.contains('flag')) {
			target.classList.add('flag');
			let flagIco = document.createElement("img");
			flagIco.setAttribute("src", "images/flag-icon.png");
			flagIco.classList.add("flagImage");
			target.appendChild(flagIco);
			game.storage.minesPlacement.forEach((elem) => {
				if (elem.x == target.dataset.x && elem.y == target.dataset.y) {
					game.storage.correctFlags++;
				}
			})
			game.storage.flagsNumber--;
			minesIndicator.children[0].innerHTML = game.storage.flagsNumber;
			game.winOrDie(+target.dataset.x, +target.dataset.y, false);//think about it
		}
		else {
			//remove flag
			flagRemove(target);
			target.removeChild(target.firstChild);
		}
	}
	else if (target.classList.contains('flagImage') && !game.gameEnd) {
		flagRemove(target.parentNode);
		target.parentNode.removeChild(target);
	}
	function flagRemove (currentTarget) {
		currentTarget.classList.remove('flag');
		game.storage.minesPlacement.forEach((elem) => {
			if (elem.x == currentTarget.dataset.x && elem.y == currentTarget.dataset.y) {
				game.storage.correctFlags--;
			}
		})
		game.storage.flagsNumber++;
		minesIndicator.children[0].innerHTML = game.storage.flagsNumber;		
	}
	return false;
})
restartButton.addEventListener('click', (event) => {
	menuBlock.classList.toggle("hideElement");
	gameWindow.classList.toggle("hideElement");
	gameFooter.classList.toggle("hideElement");
	//game Destroyer
	switch (gameField) {
		case document.querySelector('.beginnerField'):
		gameField.classList.toggle("beginnerField");
		gameStats.classList.toggle('game__statsBeginner');
		break;
		case document.querySelector('.amateurField'):
		gameField.classList.toggle("amateurField");
		gameStats.classList.toggle('game__statsAmateur');
		break;
		case document.querySelector('.expertField'):
		gameField.classList.toggle("expertField");
		gameStats.classList.toggle('game__statsExpert');
		break;
		default: break;
	}
	gameField.innerHTML = '';
	timerIndicator.innerHTML = '';
	minesIndicator.innerHTML = '';
	game = 'Poof!!';
	setTime = 0;
})
