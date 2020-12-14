import Tools from "../CommonCode/ToolsCode/Toools";
import Ready from "../CommonCode/ControlCode/Ready";
import EventControl from "../CommonCode/ControlCode/EventControl";
import EventName from "../ConfigFile/EventName";
import UIControl from "../CommonCode/ControlCode/UIControl";
import LocalData, { _InitLocaData } from "../CommonCode/ControlCode/LocalDataControl";
import { ResControl, ResGet, ResPath } from "../CommonCode/ControlCode/ResControl";
import View_Main from "./ViewUI/View_Main";

/** 启动 */
export default class Engine extends Ready {
    constructor() {
        super(); // 初始化了一些东西

        //事件通信
        EventControl.on(EventName.Test, this, Test)
        EventControl.emit(EventName.Test, "测试触发Test事件并传参")
        function Test(data) {
            console.log("Test事件被触发，参数：", data)
            EventControl.off(EventName, this, Test)
        }

        // //资源加载
        ResControl.init()
        ResControl.ResState([ResPath["Cube.lh"]], this, (progress) => {
            console.log("加载进度:", progress)
            if (progress == 1) {
                console.log("加载完成：", ResGet["Cube.lh"])
            }
        })
        ResControl.load(null, null, null, null, null)
        ResControl.loadPackage(null, null, null, null)
        ResGet
        ResPath

        // //本地存储
        // _InitLocaData()
        LocalData.Test.name
        LocalData.Test.age = 4
        LocalData.Test.merit[0]
        LocalData.Test = LocalData.Test

        // //界面控制
        let _View_Main: View_Main = UIControl.ShowUI(View_Main, "测试打开界面并传参")
        UIControl.HideUI(View_Main);
        UIControl.RemoveUI(View_Main)
        UIControl.ShowUI(View_Main);
        UIControl.GetUI(View_Main);
    }
}