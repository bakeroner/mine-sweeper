const gameField = document.getElementById("gameField");
const gameWindow = document.getElementById("gameWindow");
const menuBlock = document.getElementById("menuBlock");
let game;//variable for a new game class object

class MineGame {

	constructor (fieldHeight,fieldWidth,minesNumber) {
		/*variables*/
		this.fieldHeight = fieldHeight;
		this.fieldWidth = fieldWidth;
		//this.areaNearCurrentTarget = [];
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
		/*indexing field in some case*/
		/*setting mines*/
		let minesCounter = this.storage.minesNumber;
		let randomNumber = 0;

		for (let i = 0; i<this.fieldWidth; i++) {
			for(let j = 0; j<this.fieldHeight; j++) {
				let item = document.createElement("div");
				item.classList.add("cellClass");
				item.setAttribute("data-x", j);
				item.setAttribute("data-y", i);
				gameField.appendChild(item);

				randomNumber = Math.floor((Math.random() * 10) + 1);/*!!!!Fix this*/
				if (randomNumber == 10 && minesCounter>0) {
					let currentPosition = {x: j, y: i};
					let mineIco = document.createElement("img");
					mineIco.setAttribute("src", "images/bomb.png");
					mineIco.classList.add("bombImage");
					item.appendChild(mineIco);
					minesCounter--;
					this.storage.minesPlacement.push(currentPosition);
				}
			}		
		}
	}
		areaNearCurrentTargetCalculate (cellX, cellY) {//try use querySelector
			//debugger;
		this.areaNearCurrentTarget = [];
		//let cellsNearby = [];
		let minesArray = this.storage.minesPlacement;
		this.minesNear = 0;
		let minesNearby = this.minesNear;
		for (let i = cellX-1; i<=cellX+1; i++) {//One day i'll use jQuery for it
			for (let j = cellY-1; j<=cellY+1; j++) {
				console.log("cellX: " + i + " cellY: " + j);
				let currentCell = {x: i, y: j};
				let elementNearby = document.querySelector('[data-x=' + '"' + i + '"' + '][data-y=' + '"' + j + '"' + ']');
				//console.log(elementNearby);
				//if (elementNearby) {
					this.areaNearCurrentTarget.push(elementNearby);
				//}
				//cellsNearby.push(elementNearby);
			}
		}	
		this.areaNearCurrentTarget.forEach(function (elem) {
		//cellsNearby.forEach(function (elem) {
			for (let i = 0; i<minesArray.length; i++) {
				if (elem && +elem.dataset.x == minesArray[i].x && +elem.dataset.y == minesArray[i].y) {// [4] is array center
					minesNearby++;
					console.log("mines from function: " + minesNearby);	
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
		/*How to catch class object name?*/
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
	emptyCellOpener () {
		this.areaNearCurrentTarget.splice(4,1);
		let cellNeighbours = this.areaNearCurrentTarget;
		//console.log("cellNeighbours: " + cellNeighbours);
		for (let i = 0; i<cellNeighbours.length; i++) {
			if (cellNeighbours[i]) {
				console.log("x: " + cellNeighbours[i].dataset.x + " y: " + cellNeighbours[i].dataset.y);
				if (!this.areaNearCurrentTargetCalculate(+cellNeighbours[i].dataset.x, +cellNeighbours[i].dataset.y)) {
					console.log("mines: " + this.minesNear);
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
											console.log("areaNear-x: " + elem.dataset.x + " areaNear-y: " + elem.dataset.y);
											console.log("x: " + cellNeighbours[i].dataset.x + " y: " + cellNeighbours[i].dataset.y);
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
		if (this.storage.correctFlags == this.storage.minesNumber) {
		alert("That's all, you won!");
		}
	}
	loseCheck () {
		let currentTargetX = this.targetX;
		let currentTargetY = this.targetY;
		this.storage.minesPlacement.forEach(function (elem) {//add condition about open cells
			if (elem.x == currentTargetX && elem.y == currentTargetY) {
				alert("You lose.");
			}
		})
	}
	timer () {
		/*count starting after the first click*/
		this.storage.timer++;
	}

}
menuBlock.addEventListener("click", function (event) {
	let target = event.target;
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
		game = new MineGame(16,30,99);
		gameField.classList.toggle("expertField");
		break;
		default: break;
	}
	menuBlock.classList.toggle("hideElement");
	gameWindow.classList.toggle("hideElement");
	game.fieldBuilder();
})
gameField.addEventListener("click", function (event) {
	/*using event delegation on field elements to open*/
	let target = event.target;
	game.cellOpener(target);
	game.loseCheck();
	game.winCheck();
})
gameField.addEventListener("contextmenu", function (event) {
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
		}
		else {
			//remove flag
			//game.storage.correctFlags--;
		}
	}
	console.log("Right click catch");
	return false;
})