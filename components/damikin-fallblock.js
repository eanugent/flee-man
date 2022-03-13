export default class Fallblock extends HTMLElement {
	connectedCallback() {
		const html = `
			<canvas id="playarea" width="450" height="450">
				Canvas elements are required (2d context).
			</canvas>
			<p>Score: <span id="score"></span></p>
			<h2 id="gameover">&nbsp;</h2>`;
		const css = `
			<style>
				canvas#playarea {
					background-color: LightGray;
					border: solid 0.3em;
					border-color: black;
				}
			</style>`;

		this.innerHTML = `${html}${css}`;

		let canvas = this.querySelector('#playarea');
		if(!canvas.getContext) {
			console.log('fallblock: canvas.getContext not supported: ',
				canvas);
			return;
		}

		this.context = canvas.getContext('2d');
		this.reset();
		document.addEventListener('keydown', (e) => this.event_down(e));
		document.addEventListener('keyup', (e) => this.event_up(e));
	}

	reset() {
		this.querySelector('#gameover').innerHTML = '&nbsp;';
		this.context.clearRect(0, 0, 450, 450);
		this.obj = {
			x: 0,
			y: 400,
			xinc: 0,
			w: 50,
			h: 50,
			inc: 10,
			dec: -10,
		};
		this.objs = [];
		this.running = true;
		this.score = 0;
		this.blocks_cnt = 0;

		if(this.blocks)
			window.clearInterval(this.blocks);

		this.blocks = window.setTimeout(() => this.adder(), 1000);
		window.requestAnimationFrame(() => this.render());
	}

	adder() {
		if(!this.running)
			return;

		let obj = {
			x: Math.floor(Math.random() * 400),
			y: 0,
			yinc: 0,
			w: 50,
			h: 50,
			inc: 10
		};
		this.objs.push(obj);
		this.blocks_cnt++;

		let time = 5000 - this.blocks_cnt * 10;
		if(time < 100)
			time = 100;
		this.blocks = window.setTimeout(() => this.adder(), time);
	}

	render() {
		if(!this.running)
			return;

		this.context.clearRect(this.obj.x, this.obj.y, this.obj.w, this.obj.h);
		this.obj.x += this.obj.xinc;
		if(this.obj.x > 400)
			this.obj.x = 400;
		else if (this.obj.x < 0)
			this.obj.x = 0;
		this.context.fillStyle = 'rgb(200, 0, 0)';
		this.context.fillRect(this.obj.x, this.obj.y, this.obj.w, this.obj.h);

		for(let i = 0; i < this.objs.length; i++) {
			let objs = this.objs[i];
			this.context.clearRect(objs.x, objs.y, objs.w, objs.h);
			objs.y += objs.inc;
			if(objs.y <= 400) {
				this.context.fillStyle = 'rgb(0, 0, 200)';
				this.context.fillRect(objs.x, objs.y, objs.w, objs.h);
			}

			if(this.obj.y < objs.y + objs.h) {
				if(objs.y <= 400
				&& !(this.obj.x > objs.x + objs.w
				|| this.obj.x + this.obj.w < objs.x)) {
					console.log('fallblock collision: ', this.obj, ' | ', objs);
					this.running = false;
					this.querySelector('#gameover').innerHTML = 'Game Over';
					return;
				}
			}
		}

		while(this.objs.length > 0 && this.objs[0].y > 400) {
			this.score++;
			this.objs.shift();
		}

		this.querySelector('#score').innerHTML = this.score;
		window.requestAnimationFrame(() => this.render());
	}

	event_down(ev) {
		if(ev.defaultPrevented)
			return;

		const key = ev.key;
		switch(key) {
		case 'ArrowRight':
			this.obj.xinc = this.obj.inc;
			break;
		case 'ArrowLeft':
			this.obj.xinc = this.obj.dec;
			break;
		case ' ':
			if(!this.running)
				this.reset();
			break;
		default:
			return;
		}

		ev.preventDefault();
	}

	event_up(ev) {
		if(ev.defaultPrevented)
			return;

		const key = ev.key;

		switch(key) {
		case 'ArrowRight':
			if(this.obj.xinc == this.obj.inc)
				this.obj.xinc = 0;
			break;
		case 'ArrowLeft':
			if(this.obj.xinc == this.obj.dec)
				this.obj.xinc = 0;
			break;
		default:
			return;
		}

		ev.preventDefault();
	}
}

if(!customElements.get('damikin-fallblock'))
	customElements.define('damikin-fallblock', Fallblock);

