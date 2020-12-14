import { ui } from "../../../ui/layaMaxUI";
export default class View_Game extends ui.View_GameUI {
  static NAME: string = "View_Game"; //UI控制类需要使用,勿删。
  static AUTO: boolean = true; //当前页面是否自动适应
  static DATA: any = null; //用于储存打开界面时的传参
}