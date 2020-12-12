import Tools from "../CommonCode/ToolsCode/Toools";
import Ready from "../CommonCode/ControlCode/Ready";
import EventControl from "../CommonCode/ControlCode/EventControl";
import EventName from "../ConfigFile/EventName";
import UIControl from "../CommonCode/ControlCode/UIControl";
import View_Game from "./ViewUI/View_Game";
import Scenes3DControl from "./Game/Scenes3DControl";
import View_Main from "./ViewUI/View_Main";

/** 启动 */
export default class Engine extends Ready {
    constructor() {
        super(); // 初始化了一些东西
        EventControl.on(EventName.ShowUI, this, (name) => {
            console.log("显示页面：", name)
        })
        EventControl.on(EventName.HideUI, this, (name) => {
            console.log("隐藏页面：", name)
        })
        EventControl.on(EventName.RemoveUI, this, (name) => {
            console.log("关闭页面：", name)
        })

        let _View_Main: View_Main = UIControl.ShowUI(View_Main);
        console.log("111=======>", _View_Main.test_text)
        _View_Main.test_text = "Engine.ts"



    }
}