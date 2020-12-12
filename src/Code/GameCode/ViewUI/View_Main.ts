import { ui } from "../../../ui/layaMaxUI";
import UIControl from "../../CommonCode/ControlCode/UIControl";
import Scenes3DControl from "../Game/Scenes3DControl";
import View_Game from "./View_Game";
export default class View_Main extends ui.View_MainUI {
  static NAME: string = "View_Main"; //UI控制类需要使用,勿删。
  static AUTO: boolean = true; //当前页面是否自动适应
  test_text = "View_Main"
  onAwake() {
    Scenes3DControl.init()
    console.log("222=======>", this.test_text)
    Laya.stage.once(Laya.Event.CLICK, this, () => {
      let _View_Game: View_Game = UIControl.ShowUI(View_Game);
      console.log("111=======>", _View_Game.test_text)
      _View_Game.test_text = "Engine.ts"
    })
  }
}