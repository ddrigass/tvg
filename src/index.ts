import { Application, Sprite, Texture, Container } from "pixi.js";
import "./style.css";

declare const VERSION: string;

console.log(`Welcome from pixi-typescript-boilerplate ${VERSION}`);

interface GameOption {
    width: number;
    height: number;
}

class Game {
    private app: Application;
    private options: any;
    private map: any;
    private viewport: { x: number; y: number };
    private lastUpdate: number;
    private drag: any;
    constructor() {
        this.options = {
            fps: 60,
            map: {
                width: 40,
                height: 40
            },
            tile: {
                size: 50
            }
        };
        this.viewport = {
            x: 0,
            y: 0,
        }
        this.app = new Application({
            backgroundColor: 0xd3d3d3,
            // width: options.width,
            // height: options.height,
            resizeTo: window
        });
        document.body.appendChild(this.app.view);

        this.map = {
            background: {
                items: []
            },
            foreground: {
                items: []
            }
        };

        this.drag = {
            process: false
        }

        this.lastUpdate = 0;

        this.initEvents();

        // this.start = this.start.bind(this)
        //
        // requestAnimationFrame(this.start)
        // @ts-ignore
        window.$GAME = this;
    }
    async init() {
        // this.loadMap()
        this.fillMap()
        this.drawApp()
    }
    fillMap() {
        for (let i = 0; i < this.options.map.height; i++) {
            const row = []
            for (let t = 0; t < this.options.map.width; t++) {
                row.push({
                    material: 'stone',
                    collision: true,
                })
            }
            this.map.background.items.push(row);
        }
    }
    drawMap() {
        const stoneTexture = Texture.from('../assets/stone.png');
        const background = this.map.background.items;

        this.map.container = new Container();

        for (let k = 0; k < background.length; k++) {
            const row = background[k];
            const itemX = k * this.options.tile.size;
            for (let m = 0; m < row.length; m++) {
                const itemY = m * this.options.tile.size;
                const item = row[m];
                const stone = new Sprite(stoneTexture);

                stone.width = this.options.tile.size;
                stone.height = this.options.tile.size;
                stone.buttonMode = true;

                stone.x = itemX;
                stone.y = itemY;

                stone.interactive = true;

                stone.on('mouseover', function (mouseData) {
                    mouseData.currentTarget.alpha = 0.5;
                    // this.alpha = 0.5;
                })

                stone.on('mouseout', function (mouseData) {
                    mouseData.currentTarget.alpha = 1;
                })

                this.map.container.addChild(stone)
            }
        }
        this.app.stage.addChild(this.map.container);
    }

    private logMap() {
        console.log(JSON.stringify(this.map.background))
    }

    private drawApp() {
        const stage = this.app.stage;
        for (var i = stage.children.length - 1; i >= 0; i--) {	stage.removeChild(stage.children[i]);};
        this.drawMap()
    }

    private initEvents() {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                this.logMap();
            }
        });
        document.addEventListener('mousedown', (e) => {
            this.drag.process = true;
        });
        document.addEventListener('mouseup', (e) => {
            this.drag.process = false;
        });
        document.addEventListener('mousemove', (e) => {
            if (this.drag.process) {
                // movementX
                this.viewport.x += e.movementX
                this.viewport.y += e.movementY

                this.map.container.x = this.viewport.x
                this.map.container.y = this.viewport.y
                // this.drawApp()
            }
        });
    }

    private loadMap() {
        const mapJson = require('./map.json');
        this.map = mapJson;
    }
}

const game = new Game()
game.init()
