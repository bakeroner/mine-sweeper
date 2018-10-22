const gameField = document.getElementById("gameField");
const gameWindow = document.getElementById("gameWindow");
const menuBlock = document.getElementById("menuBlock");
const minesIndicator = document.querySelector(".stats__mines");
const timerIndicator = document.querySelector(".stats__timer");
let game;//variable for a new game class object

class MineGame {

	constructor (fieldHeight,fieldWidth,minesNumber) {
		/*variables*/
		this.fieldHeight = fieldHeight;
		this.fieldWidth = fieldWidth;
		this.areaNearCurrentTarget = [];
		this.minesNear = 0;
		this.targetX = 0;
		this.targetY = 0;
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
		let minesCounter = this.storage.minesNumber;
		let randomNumber = 0;
		let flagSet = document.createElement("p");
			flagSet.innerHTML = this.storage.flagsNumber;
			minesIndicator.appendChild(flagSet);

			let timerSet = document.createElement("p");
			timerSet.innerHTML = this.storage.timer;
			timerIndicator.appendChild(timerSet);
			//console.log(game.storage.flagsNumber);

		for (let i = 0; i<this.fieldWidth; i++) {
			for(let j = 0; j<this.fieldHeight; j++) {
				let item = document.createElement("div");
				item.classList.add("cellClass");
				item.setAttribute("data-x", j);
				item.setAttribute("data-y", i);
				gameField.appendChild(item);
			}
		}
			while (minesCounter>0) {//!!!mix it with top part in some way
				for (let i = 0; i<this.fieldWidth; i++) {
					for (let j = 0; j<this.fieldHeight; j++) {
						randomNumber = Math.floor((Math.random() * 10) + 1);
						if (randomNumber == 10 && minesCounter>0) {
							let item = document.querySelector('[data-x=' + '"' + j + '"' + '][data-y=' + '"' + i + '"' + ']');
							if (!item.firstChild) {
							let currentPosition = {x: j, y: i};
							let mineIco = document.createElement("img");
							mineIco.setAttribute("src", "images/bomb.png");
							mineIco.classList.add("bombImage");
							mineIco.classList.add("hideElement"); 
							item.appendChild(mineIco);
							minesCounter--;
							this.storage.minesPlacement.push(currentPosition);
							}
						}
				}
			}		
		}
	}

		areaNearCurrentTargetCalculate (cellX, cellY) {
		this.areaNearCurrentTarget = [];
		let minesArray = this.storage.minesPlacement;
		this.minesNear = 0;
		let minesNearby = this.minesNear;
		for (let i = cellX-1; i<=cellX+1; i++) {//One day i'll use jQuery for it
			for (let j = cellY-1; j<=cellY+1; j++) {
				//console.log("cellX: " + i + " cellY: " + j);
				let currentCell = {x: i, y: j};
				let elementNearby = document.querySelector('[data-x=' + '"' + i + '"' + '][data-y=' + '"' + j + '"' + ']');
				//console.log(elementNearby);
					this.areaNearCurrentTarget.push(elementNearby);
			}
		}	
		this.areaNearCurrentTarget.forEach(function (elem) {
			for (let i = 0; i<minesArray.length; i++) {
				if (elem && +elem.dataset.x == minesArray[i].x && +elem.dataset.y == minesArray[i].y) {// [4] is array center
					minesNearby++;
					//console.log("mines from function: " + minesNearby);	
				}
			}
		})
		this.minesNear = minesNearby;
		if (minesNearby) {
			return false;
		}
		else {
			return true;
		}
	}
	cellOpener (currentTarget) {
		/*open cell show mines number open empty cells*/
		if (currentTarget.classList.contains("cellClass"))
		{
			this.targetX = +currentTarget.dataset.x;
			this.targetY = +currentTarget.dataset.y;
			currentTarget.classList.remove("cellClass");
			currentTarget.classList.add("cellClassOpen");
			if (!this.areaNearCurrentTargetCalculate(+currentTarget.dataset.x, +currentTarget.dataset.y)) {
				let item = document.createElement("p");
				item.classList.add("cellText");
				item.innerHTML = this.minesNear;
				currentTarget.appendChild(item);
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
		//console.log("cellNeighbours: " + cellNeighbours);
		for (let i = 0; i<cellNeighbours.length; i++) {
			if (cellNeighbours[i]) {
				//console.log("x: " + cellNeighbours[i].dataset.x + " y: " + cellNeighbours[i].dataset.y);
				if (!this.areaNearCurrentTargetCalculate(+cellNeighbours[i].dataset.x, +cellNeighbours[i].dataset.y)) {
					//console.log("mines: " + this.minesNear);
					cellNeighbours[i].classList.remove("cellClass");
					cellNeighbours[i].classList.add("cellClassOpen");
					let item = document.createElement("p");
					item.classList.add("cellText");
					item.innerHTML = this.minesNear;
						cellNeighbours[i].appendChild(item);
				}
				else if (this.areaNearCurrentTargetCalculate(+cellNeighbours[i].dataset.x, +cellNeighbours[i].dataset.y)) {
					if (!cellNeighbours[i].classList.contains("blank")) {
						cellNeighbours[i].classList.remove("cellClass");
						cellNeighbours[i].classList.add("blank");
						cellNeighbours[i].classList.add("cellClassOpen");
						let arrayLength = cellNeighbours.length;
						let cellsNearby = this.areaNearCurrentTarget;
						this.areaNearCurrentTarget.forEach(function (elem) {
							if (elem) {
								let count = 0;
								for (let i = 0; i<arrayLength; i++) {
									if (cellNeighbours[i]) {
										if (elem.dataset.x == cellNeighbours[i].dataset.x && elem.dataset.y == cellNeighbours[i].dataset.y) {
											//console.log("areaNear-x: " + elem.dataset.x + " areaNear-y: " + elem.dataset.y);
											//console.log("x: " + cellNeighbours[i].dataset.x + " y: " + cellNeighbours[i].dataset.y);
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
	winCheck () {
		/*checking end of the game showing Congratulation Menu*/
		if (this.storage.correctFlags == this.storage.minesNumber && this.storage.flagsNumber == 0 && !document.querySelector('.cellClass:not(.flag)')) {
		alert("That's all, you won!" + " Your time: " + this.storage.timer);
		}
	}
	loseCheck () {
		let currentTargetX = this.targetX;
		let currentTargetY = this.targetY;
		this.storage.minesPlacement.forEach(function (elem) {
			if (elem.x == currentTargetX && elem.y == currentTargetY) {
				document.querySelectorAll('.bombImage').forEach (function (elem) {
					elem.classList.toggle('hideElement');
				})
				alert("You lose.");
			}
		})
	}
	timer () {
		/*count starting after the first click*/
		this.storage.timer++;
		timerIndicator.children[0].innerHTML = this.storage.timer;
	}
/*	flagCheck (currentTarget) {
		if (currentTarget.classList.contains('cellClass')) {
			if (currentTarget.classList.contains('flag')) {

			}
			else {

			}
			
		}
		else if (currentTarget.classList.contains('flagImage')) {

		}
		function classCheck () {

		}
	}*/

}
/*if (document.querySelector('.cellClassOpen')) { !!!don't work
setInterval(game.timer(), 1000);
}*/
menuBlock.addEventListener("click", function (event) {
	let target = event.target;
	//while () {//!!!looking for a great idea
		switch (target) {
			case document.querySelector('#beginnerButton'):
			game = new MineGame(9,9,10);
			gameField.classList.toggle("beginnerField");
			break;
			case document.querySelector('#amateurButton'):
			game = new MineGame(16,16,40);
			gameField.classList.toggle("amateurField");
			break;
			case document.querySelector('#expertButton'):
			game = new MineGame(30,16,99);
			gameField.classList.toggle("expertField");
			break;
			default: break;
		}
	//}
	menuBlock.classList.toggle("hideElement");
	gameWindow.classList.toggle("hideElement");
	game.fieldBuilder();
})
gameField.addEventListener("click", function (event) {
	/*using event delegation on field elements to open*/
	let target = event.target;
	game.cellOpener(target);
	game.loseCheck();
	game.winCheck();//check it
})
gameField.addEventListener("contextmenu", function (event) { //!!!rewrite all
	/*using event delegation on field elements to set flag*/
	event.preventDefault();
	let target = event.target;
	if (target.classList.contains('cellClass')) {
		if (!target.classList.contains('flag')) {
			target.classList.add('flag');
			let flagIco = document.createElement("img");
			flagIco.setAttribute("src", "images/flag-icon.png");
			flagIco.classList.add("flagImage");
			target.appendChild(flagIco);
			game.storage.minesPlacement.forEach(function (elem) {
				if (elem.x == target.dataset.x && elem.y == target.dataset.y) {
					game.storage.correctFlags++;
				}
			})
			game.storage.flagsNumber--;
			minesIndicator.children[0].innerHTML = game.storage.flagsNumber;
			//console.log(game.storage.flagsNumber);
			game.winCheck();//!!!remove it and add open cells check
		}
		else {
			//remove flag
			target.removeChild(target.firstChild);
			target.classList.remove('flag');
			game.storage.minesPlacement.forEach(function (elem) {
				if (elem.x == target.dataset.x && elem.y == target.dataset.y) {
					game.storage.correctFlags--;
				}
			})
			game.storage.flagsNumber++;
			minesIndicator.children[0].innerHTML = game.storage.flagsNumber;
			//console.log(game.storage.flagsNumber);
		}
	}
	else if (target.classList.contains('flagImage')) {

	}
	console.log("Right click catch");
	return false;
})