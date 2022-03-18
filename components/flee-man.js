class FleeMan {
	initialize() {
		this.screenWidth = 450;	
		this.screenHeight = 450;
		this.avatarWidth = 50;
		this.avatarHeight = 50;
		this.blockWidth = 50;
		this.blockHeight = 50;
		this.playWidth = this.screenWidth - this.avatarWidth;
		this.playHeight = this.screenHeight - this.avatarHeight;
		this.blockColor = 'rgb(255, 255, 0)';
		this.avatarColor ='rgb(255, 0, 0)';
		this.highScore = 0;
		this.level = 1;

		let canvas = document.querySelector('#playarea');
		if(!canvas.getContext) {
			console.log('canvas.getContext is required ', canvas);
			return;
		}
		this.context = canvas.getContext('2d');

		document.addEventListener('keydown', (e) => this.keyDown(e));
		document.addEventListener('keyup', (e) => this.keyUp(e));

		this.newGame();
	}

	newGame() {
		document.querySelector('#gameover').innerHTML = '&nbsp;';
		this.context.clearRect(0, 0, this.screenWidth, this.screenHeight);
		this.avatar = {
			x: 0,
			y: this.playHeight,
			xinc: 0,
			w: this.avatarWidth,
			h: this.avatarHeight,
			inc: 10,
			dec: -10,
		};
		this.blocks = [];
		this.running = true;
		this.score = 0;
		this.level = 1;

		if(this.blockInterval)
			window.clearInterval(this.blockInterval);

		this.blockInterval = window.setTimeout(() => this.addBlock(), 1000);

		document.querySelector('#score').innerHTML = this.score;
		if(this.levelInterval)
			window.clearInterval(this.levelInterval);

		this.levelInterval = window.setInterval(() => {
			this.level = this.level + 1;
		}, 6 * 1000);

		window.requestAnimationFrame(() => this.render());
	}

	addBlock() {
		if(!this.running)
			return;

		let newBlock = {
			x: Math.floor(Math.random() * this.playWidth),
			y: 0,
			yinc: 0,
			w: this.blockWidth,
			h: this.blockHeight,
			inc: 10
		};
		this.blocks.push(newBlock);
		let time = 1066 - (66 * this.level);
		if(time < 100)
			time = 100;
		this.blockInterval = window.setTimeout(() => this.addBlock(), time);
	}

	render() {
		if(!this.running)
			return;

		// Clear old player avatar
		this.context.clearRect(this.avatar.x, this.avatar.y, this.avatar.w, this.avatar.h);
		// Set new x value
		this.avatar.x += this.avatar.xinc;
		
		// Can't be off the screen
		this.avatar.x = Math.min(this.playWidth, this.avatar.x);
		this.avatar.x = Math.max(0, this.avatar.x);

		this.drawAvatar();

		// Draw existing blocks
		for(let i = 0; i < this.blocks.length; i++) {
			let block = this.blocks[i];
			this.context.clearRect(block.x, block.y, block.w, block.h);
			block.y += block.inc;
			if(block.y <= this.playHeight) {
				this.context.fillStyle = this.blockColor;
				this.context.fillRect(block.x, block.y, block.w, block.h);
			}

			// Collision between block and avatar
			if(this.avatar.y < block.y + block.h
				&& block.y <= this.playHeight
				&& !(this.avatar.x > block.x + block.w
				|| this.avatar.x + this.avatar.w < block.x)) {
					this.running = false;
					document.querySelector('#gameover').innerHTML = 'Game Over';
					if(this.score > this.highScore){
						 this.highScore = this.score;
						 document.querySelector('#highScore').innerHTML = this.highScore;						 
					}
					return;
			}
		}

		// Blocks that hit the ground
		while(this.blocks.length > 0 && this.blocks[0].y > this.playHeight) {
			this.score = this.score + 1;
			this.blocks.shift();
			document.querySelector('#score').innerHTML = this.score;
		}
		
		document.querySelector('#level').innerHTML = this.level;
		window.requestAnimationFrame(() => this.render());
	}

	drawAvatar(){
		this.context.fillStyle = this.avatarColor;
		this.context.fillRect(this.avatar.x + 15, this.avatar.y, 20, 15);

		// Face
		this.context.fillStyle = 'white';
		this.context.fillRect(this.avatar.x + 17, this.avatar.y + 3, 5, 4);
		this.context.fillRect(this.avatar.x + 29, this.avatar.y + 3, 5, 4);
		this.context.fillRect(this.avatar.x + 22, this.avatar.y + 10, 6, 3);

		// Hair
		this.context.strokeStyle = this.avatarColor;
		
		this.context.beginPath();
		this.context.moveTo(this.avatar.x + 15, this.avatar.y + 2);
		this.context.lineTo(this.avatar.x + 5, this.avatar.y + 10);
		this.context.stroke();

		this.context.beginPath();
		this.context.moveTo(this.avatar.x + 15, this.avatar.y + 5);
		this.context.lineTo(this.avatar.x + 8, this.avatar.y + 10);
		this.context.stroke();

		this.context.beginPath();
		this.context.moveTo(this.avatar.x + 15, this.avatar.y + 8);
		this.context.lineTo(this.avatar.x + 11, this.avatar.y + 10);
		this.context.stroke();

		this.context.beginPath();
		this.context.moveTo(this.avatar.x + 35, this.avatar.y + 2);
		this.context.lineTo(this.avatar.x + 45, this.avatar.y + 10);
		this.context.stroke();

		this.context.beginPath();
		this.context.moveTo(this.avatar.x + 35, this.avatar.y + 5);
		this.context.lineTo(this.avatar.x + 42, this.avatar.y + 10);
		this.context.stroke();

		this.context.beginPath();
		this.context.moveTo(this.avatar.x + 35, this.avatar.y + 8);
		this.context.lineTo(this.avatar.x + 39, this.avatar.y + 10);
		this.context.stroke();

		// Dress
		this.context.fillStyle = this.avatarColor;
		let region = new Path2D();
		region.moveTo(this.avatar.x + 15, this.avatar.y + 15);
		region.lineTo(this.avatar.x + 5, this.avatar.y + 35);
		region.lineTo(this.avatar.x + 45, this.avatar.y + 35);
		region.lineTo(this.avatar.x + 35, this.avatar.y + 15);
		region.closePath();		
		this.context.fill(region);

		// Arms
		this.context.fillRect(this.avatar.x + 5, this.avatar.y + 20, 10, 5);
		this.context.fillRect(this.avatar.x + 35, this.avatar.y + 20, 10, 5);
		
		// Legs
		this.context.fillRect(this.avatar.x + 15, this.avatar.y + 35, 5, 10);
		this.context.fillRect(this.avatar.x + 30, this.avatar.y + 35, 5, 10);
	}

	keyDown(ev) {
		if(ev.defaultPrevented)
			return;

		const key = ev.key;
		switch(key) {
			case 'ArrowRight':
				this.avatar.xinc = this.avatar.inc;
				break;
			case 'ArrowLeft':
				this.avatar.xinc = this.avatar.dec;
				break;
			case ' ':
				if(!this.running)
					this.newGame();
				break;
			default:
				return;
		}

		ev.preventDefault();
	}

	keyUp(ev) {
		if(ev.defaultPrevented)
			return;

		const key = ev.key;

		switch(key) {
			case 'ArrowRight':
				if(this.avatar.xinc == this.avatar.inc)
					this.avatar.xinc = 0;
				break;
			case 'ArrowLeft':
				if(this.avatar.xinc == this.avatar.dec)
					this.avatar.xinc = 0;
				break;
			default:
				return;
		}

		ev.preventDefault();
	}
}

let myGame = null;
window.onload = function(){
	myGame = new FleeMan();
	myGame.initialize();
}