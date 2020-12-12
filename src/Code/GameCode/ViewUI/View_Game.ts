import { ui } from "../../../ui/layaMaxUI";
import UIControl from "../../CommonCode/ControlCode/UIControl";
import View_Main from "./View_Main";
export default class View_Game extends ui.View_GameUI {
  static NAME: string = "View_Game"; //UI控制类需要使用,勿删。
  static AUTO: boolean = true; //当前页面是否自动适应
  test_text = "View_Game"
  onAwake() {
    console.log("222=====>", this.test_text)
  }
}