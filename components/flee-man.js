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
		this.blocks_cnt = 0;

		if(this.blockInterval)
			window.clearInterval(this.blockInterval);

		this.blockInterval = window.setTimeout(() => this.addBlock(), 1000);
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
		this.blocks_cnt++;
		let time = 1000 - this.blocks_cnt * 10;
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

		// Draw avatar at new location
		this.context.fillStyle = this.avatarColor;
		this.context.fillRect(this.avatar.x, this.avatar.y, this.avatar.w, this.avatar.h);

		// Draw existing blocks
		for(let i = 0; i < this.blocks.length; i++) {
			let block = this.blocks[i];
			this.context.clearRect(block.x, block.y, block.w, block.h);
			block.y += block.inc;
			if(block.y <= this.playHeight) {
				this.context.fillStyle = this.blockColor;
				this.context.fillRect(block.x, block.y, block.w, block.h);
			}

			if(this.avatar.y < block.y + block.h) {
				if(block.y <= this.playHeight
				&& !(this.avatar.x > block.x + block.w
				|| this.avatar.x + this.avatar.w < block.x)) {
					console.log('flee-man collision: ', this.avatar, ' | ', block);
					this.running = false;
					document.querySelector('#gameover').innerHTML = 'Game Over';
					if(this.score>this.highScore){
						 this.highScore = this.score;
						 document.querySelector('#highScore').innerHTML = this.highScore;						 
					}
					return;
				}
			}
		}

		// Blocks that hit the avatar
		while(this.blocks.length > 0 && this.blocks[0].y > this.playHeight) {
			this.score = this.score + 1;
			this.blocks.shift();
		}

		document.querySelector('#score').innerHTML = this.score;
		window.requestAnimationFrame(() => this.render());
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