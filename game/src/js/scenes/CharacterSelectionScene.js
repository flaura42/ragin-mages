import Button from 'objects/ui/Button';
import Controller from '../util/Controller';
import Character from 'objects/characters/Character';

export default class CharacterSelectionScene extends Phaser.Scene {
  constructor() {
    super({key: 'CharacterSelectionScene'});
  }

  init(data){
    this.gameType = data.type;
  }

  preload() {
    this.controller = new Controller(this);
  }
    
  create() {
    let background = this.add.image(800, 330, 'title_background');
    this.cameras.main.startFollow(background);
    
    let logoStyle = {fontSize: 85, fontFamily: "'Jim Nightshade', cursive", color: '#000000'};
    let logo = this.add.text(450, 50, 'Ragin\' Mages', logoStyle);
    logo.setStroke('#ae7f00', 16);
    let playerMode= this.gameType == 'single_player' ? 'single player mode' : 'multiplayer on-line battle mode';
    
    this.add.text(450, 200, `Select your character for ${playerMode}` ,{
      fontSize: 30,
      fontFamily: "'Fjalla One', sans-serif",
      fill: '#ae7f00',
      width: '500px',
    });

    let btnX=450;
    let btnY=250;
    let btnSpacing=50;

    let characterList = this.cache.json.get('characters');
    for (const key in characterList) {
      this.addCharacterButton(characterList[key], this, btnX, btnY);
      btnY +=btnSpacing;
    }
  }

  addCharacterButton(btnData, scene, x, y){
    let chkButton = new Button(this, x, y, btnData.name);
    chkButton.key=btnData.key;
    chkButton.scene=scene;
    chkButton.buttonDown(() => {
      this.scene.start(this.gameType == 'multi_player' ? 'GameScene' : 'DungeonScene', {character: btnData.key});  
    });

    chkButton.on('pointerover', () => {
      this.showCharacter(btnData.key);
    });


  }

  showCharacter(key) {
    if(this.chosenCharacter) this.chosenCharacter.destroy();
    this.chosenCharacter = new Character(this, 900, 450, key, {
      scale: 1,
      orientation: 'S',
    });
  }

  update() {
    if(this.chosenCharacter) {
      const orientation = this.controller.getWASDCoordinate();
      this.chosenCharacter.setAnimation(orientation != '' ? 'walk' : 'stance', orientation);
    }
  }

}