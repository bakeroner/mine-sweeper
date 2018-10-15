const beginnerButton = document.getElementById("beginnerButton");
const amateurButton = document.getElementById("amateurButton");
const professionalButton = document.getElementById("professionalButton");
const expertButton = document.getElementById("expertButton");

const gameField = document.getElementById("gameField");
const gameWindow = document.getElementById("gameWindow");
const menuBlock = document.getElementById("menuBlock");

class MineGame {

	constructor (fieldHeight,fieldWidth,minesNumber) {
		/*variables*/
		this.fieldHeight = fieldHeight;
		this.fieldWidth = fieldWidth;
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
			//console.log(this.storage.minesPlacement);			
		}
	}
	cellOpener (currentTarget) {
		/*open cell show mines number open empty cells*/
		/*How to catch class object name?*/
	}
	winCheck () {
		/*checking end of the game showing Congratulation Menu*/
		this.storage.correctFlags = this.storage.minesNumber;
		alert("That's all, you won!");
	}
	timer () {
		/*count starting after the first click*/
		this.storage.timer++;
	}

}

beginnerButton.addEventListener("click", function (event) {
	/*creating object with current difficlty variables hiding menu showing field*/
	menuBlock.classList.toggle("hideElement");
	gameWindow.classList.toggle("hideElement");
	gameField.classList.toggle("beginnerField");
	let beginner = new MineGame(9,9,10); /*!!!!!!!!!!!!!!!Set with correct attrs for all difficulties*/
	beginner.fieldBuilder();

/*!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/
	gameField.addEventListener("click", function (event) {
	/*using event delegation on field elements to open*/
	let target = event.target;
	let targetX = +target.dataset.x;
	let targetY = +target.dataset.y;
	let areaNear = [];
	let minesNear = 0;
	for (let i = targetX-1; i<=targetX+1; i++) {//One day i use jQuery for it
		for (let j = targetY-1; j<=targetY+1; j++) {
			let currentCell = {x: i, y: j};
			areaNear.push(currentCell);
		}
	}
	if (target.classList.contains("cellClass"))
	{
		console.log(target);
		target.classList.toggle("cellClass");
		target.classList.add("cellClassOpen");
		beginner.storage.minesPlacement.forEach(function (elem) {/*Object using trouble*/	
			for (let i=0; i<areaNear.length; i++) {
				if (areaNear[i].x == elem.x && areaNear[i].y == elem.y) {
					minesNear++;
					if (elem.x == +targetX && elem.y == +targetY) {
						alert("You lose.");
					}
				}
			}
		})
		if (minesNear) {
			console.log("MinesNear " + minesNear);
			let item = document.createElement("p");
			item.classList.add("cellText");
			item.innerHTML = minesNear;
			target.appendChild(item);
		}
	}
/*!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/


	})
	})
gameField.addEventListener("contextmenu", function (event) {
	/*using event delegation on field elements to set flag*/
	let target = event.target;
	console.log("Right click catch");
	})

/*amateurButton.addEventListener("click", function (event) {
	menuBlock.classList.toggle("hideElement");
	let amateur = new MineGame(16,16,40);
	})
expertButton.addEventListener("click", function (event) {
		menuBlock.classList.toggle("hideElement");
		let professional = new MineGame(16,30,99);
	})*/