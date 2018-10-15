const gameField = document.getElementById("gameField");
const gameWindow = document.getElementById("gameWindow");
const menuBlock = document.getElementById("menuBlock");
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
	areaNearCurrentTargetCalculate () {//try use querySelector
		this.areaNearCurrentTarget = [];
		for (let i = this.targetX-1; i<=this.targetX+1; i++) {//One day i use jQuery for it
			for (let j = this.targetY-1; j<=this.targetY+1; j++) {
				let currentCell = {x: i, y: j};
				let elementNearby = document.querySelector('[data-x=' + '"' + i + '"' + '][data-y=' + '"' + j + '"' + ']');
				//console.log(elementNearby);
				this.areaNearCurrentTarget.push(elementNearby);
			}
		}

	}
	cellOpener (currentTarget) {
		/*open cell show mines number open empty cells*/
		/*How to catch class object name?*/
		if (currentTarget.classList.contains("cellClass"))
		{
			this.targetX = +currentTarget.dataset.x;
			this.targetY = +currentTarget.dataset.y;
			this.areaNearCurrentTargetCalculate();
			let areaNear = this.areaNearCurrentTarget;
			let minesArray = this.storage.minesPlacement;
			let minesNearby = this.minesNear;
			currentTarget.classList.remove("cellClass");
			currentTarget.classList.add("cellClassOpen");
			this.areaNearCurrentTarget.forEach(function (elem) {//avoid this!!!	
				for (let i = 0; i<minesArray.length; i++) {
					if (+elem.dataset.x == minesArray[i].x && +elem.dataset.y == minesArray[i].y) {// [4] is array center
						minesNearby++;
						console.log(minesNearby);	
					}
				}
			})
			if (minesNearby) {
				let item = document.createElement("p");
				item.classList.add("cellText");
				//item.innerHTML = this.minesNear;
				//debugger;
				item.innerHTML = minesNearby;
				currentTarget.appendChild(item);
			}
			else {
				/* Opening empty cells goes here*/
				this.areaNearCurrentTarget.forEach(function (elem) {
					elem.classList.remove("cellClass");
					elem.classList.add("cellClassOpen");
				})
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
		this.storage.minesPlacement.forEach(function (elem) {
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
	//game.targetX = +target.dataset.x;
	//game.targetY = +target.dataset.y;
	game.cellOpener(target);
	game.loseCheck();
	game.winCheck();
})
gameField.addEventListener("contextmenu", function (event) {
	/*using event delegation on field elements to set flag*/
	let target = event.target;
	console.log("Right click catch");
})