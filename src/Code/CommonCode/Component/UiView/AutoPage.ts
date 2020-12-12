export default class AutoPage extends Laya.Script {
    onAwake() {
        let View = this.owner as Laya.Sprite;
        View.width = Laya.stage.width;
        View.height = Laya.stage.height;
    }
}