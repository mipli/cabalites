import * as Core from './core';
import * as Map from './map';
import {Logger} from './Logger';

import Console from './Console';

export default class PixiConsole {
  private _width: number;
  private _height: number;

  private canvasId: string;
  private isDirty: boolean;

  private renderer: any;
  private stage: PIXI.Container;

  private loaded: boolean;

  private charWidth: number;
  private charHeight: number;

  private font: PIXI.BaseTexture;
  private chars: PIXI.Texture[];

  private foreCells: PIXI.Sprite[][];
  private backCells: PIXI.Sprite[][];
  private tint: Core.Color[][];

  private defaultBackground: Core.Color;
  private defaultForeground: Core.Color;

  private canvas: any;
  private topLeftPosition: Core.Vector2;

  private mouseEventListener: (position: Core.Vector2) => void;

  constructor(width: number, height: number, canvasId: string, foreground: Core.Color = 0xffffff, background: Core.Color = 0x000000, mouseEventListener: (position: Core.Vector2) => void) {
    this._width = width;
    this._height = height;

    this.mouseEventListener = mouseEventListener;

    this.canvasId = canvasId;

    this.loaded = false;
    this.stage = new PIXI.Container();

    this.loadFont();
    this.defaultBackground = 0x00000;
    this.defaultForeground = 0xfffff;

    this.tint = Core.Utils.buildMatrix<Core.Color>(this.width, this.height, null);
    this.isDirty = true;
  }

  get height(): number {
    return this._height;
  }

  get width(): number {
    return this._width;
  }

  private loadFont() {
    let fontUrl = './Talryth_square_15x15.png';
    this.font = PIXI.BaseTexture.fromImage(fontUrl, false, PIXI.SCALE_MODES.NEAREST);
    if (this.font.hasLoaded) {
      this.onFontLoaded();
    } else {
      this.font.on('loaded', this.onFontLoaded.bind(this));
    }
  }

  private onFontLoaded() {
    this.charWidth = this.font.width / 16;
    this.charHeight = this.font.height / 16;

    this.initCanvas();
    this.initCharacterMap();
    this.initBackgroundCells();
    this.initForegroundCells();
    this.loaded = true;
    this.initMouse();
  }

  private initMouse() {
    this.canvas.addEventListener('click', (event: MouseEvent) => {
      this.mouseEventListener(this.getPositionFromPixels(event.offsetX, event.offsetY));
    });
  }

  private initCanvas() {
    const canvasWidth = this.width * this.charWidth;
    const canvasHeight = this.height * this.charHeight;

    this.canvas = document.getElementById(this.canvasId);

    let pixiOptions = {
      antialias: false,
      clearBeforeRender: false,
      preserveDrawingBuffer: false,
      resolution: 1,
      transparent: false,
      backgroundColor: Core.ColorUtils.toNumber(this.defaultBackground),
      view: this.canvas
    };
    this.renderer = PIXI.autoDetectRenderer(canvasWidth, canvasHeight, pixiOptions);
    this.renderer.backgroundColor = Core.ColorUtils.toNumber(this.defaultBackground);
    this.topLeftPosition = new Core.Vector2(this.canvas.offsetLeft, this.canvas.offsetTop);
  }

  private initCharacterMap() {
    this.chars = [];
    for (let x = 0; x < 16; x++) {
      for (let y = 0; y < 16; y++) {
        const rect = new PIXI.Rectangle(x * this.charWidth, y * this.charHeight, this.charWidth, this.charHeight);
        this.chars[x + y * 16] = new PIXI.Texture(this.font, rect);
      }
    }
  }

  private initBackgroundCells() {
    this.backCells = [];
    for ( let x = 0; x < this.width; x++) {
      this.backCells[x] = [];
      for ( let y = 0; y < this.height; y++) {
        const cell = new PIXI.Sprite(this.chars[Map.Glyph.CHAR_FULL]);
        cell.position.x = x * this.charWidth;
        cell.position.y = y * this.charHeight;
        cell.width = this.charWidth;
        cell.height = this.charHeight;
        cell.tint = Core.ColorUtils.toNumber(this.defaultBackground);
        this.backCells[x][y] = cell;
        this.stage.addChild(cell);
      }
    }
  }

  private initForegroundCells() {
    this.foreCells = [];
    for (let x = 0; x < this.width; x++) {
      this.foreCells[x] = [];
      for (let y = 0; y < this.height; y++) {
        const cell = new PIXI.Sprite(this.chars[Map.Glyph.CHAR_SPACE]);
        cell.position.x = x * this.charWidth;
        cell.position.y = y * this.charHeight;
        cell.width = this.charWidth;
        cell.height = this.charHeight;
        cell.tint = Core.ColorUtils.toNumber(this.defaultForeground);
        this.foreCells[x][y] = cell;
        this.stage.addChild(cell);
      }
    }
  }

  addGridOverlay(x: number, y: number, width: number, height: number) {
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        let cell = new PIXI.Graphics();
        cell.lineStyle(1, 0x444444, 0.5);
        cell.beginFill(0, 0);
        cell.drawRect((i + x) * this.charWidth, (j + y) * this.charHeight, this.charWidth, this.charHeight);
        this.stage.addChild(cell);
      }
    }
  }

  addBorder(x: number, y: number, width: number, height: number) {
    const cell = new PIXI.Graphics();
    cell.lineStyle(1, 0x444444, 0.5);
    cell.beginFill(0, 0);
    cell.drawRect(x * this.charWidth, y * this.charHeight, x * width * this.charWidth, y * height * this.charHeight);
    this.stage.addChild(cell);
  }

  render() {
    if (this.loaded && this.isDirty) {
      this.renderer.render(this.stage);
      this.isDirty = false;
    }
  }

  blit(console: Console, offsetX: number = 0, offsetY: number = 0, forceDirty: boolean = false) {
    if (!this.loaded) {
      return false;
    }
    for (let x = 0; x < console.width; x++) {
      for (let y = 0; y < console.height; y++) {
        if (forceDirty || console.isDirty[x][y]) {
          const px = offsetX + x;
          const py = offsetY + y;
          const ascii = console.text[x][y];
          const texture = (ascii > 0 && ascii <= 255)  ? this.chars[ascii] : null;
          let foreTint = Core.ColorUtils.toNumber(console.fore[x][y]);
          let backTint = Core.ColorUtils.toNumber(console.back[x][y]);
          const tint = console.tint[x][y];
          if (
            this.foreCells[px][py].tint !== foreTint || 
            this.backCells[px][py].tint !== backTint || 
            (texture && this.foreCells[px][py].texture !== texture) ||
            this.tint[px][py] !== tint) 
            {
            if (texture) {
              this.foreCells[px][py].texture = texture;
            }
            if (tint) {
              foreTint = <number>Core.ColorUtils.tint(foreTint, tint);
              backTint = <number>Core.ColorUtils.tint(backTint, tint);
              this.tint[px][py] = tint;
            } else {
              this.tint[px][py] = 0;
            }
            this.foreCells[px][py].tint = foreTint;
            this.backCells[px][py].tint = backTint;
            this.isDirty = true;
          }
        }
        console.cleanCell(x, y);
      }
    }
  }

  getPositionFromPixels(x: number, y: number) : Core.Vector2 {
    if (!this.loaded) {
      return null;
    } 
    const dx: number = x - this.topLeftPosition.x;
    const dy: number = y - this.topLeftPosition.y;
    const rx = Math.round(dx / this.charWidth);
    const ry = Math.round(dy / this.charHeight);
    return new Core.Vector2(rx, ry);
  }
}
