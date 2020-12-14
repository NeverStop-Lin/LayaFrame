import EventName from "../../ConfigFile/EventName";
import EventControl from "../ControlCode/EventControl";
import { ResControl } from "../ControlCode/ResControl";
import { _InitLocaData } from "../ControlCode/LocalDataControl";
import Tools from "../ToolsCode/Toools";

export default class Ready {
    constructor() {
        //失去焦点后是否自动停止背景音乐。false不自动停止，一直播。true是自动停止
        Laya.SoundManager.autoStopMusic = false;
        //初始化资源加载器
        EventControl.on(EventName.Frame.ShowUI, this, ResControl.init)
        //初始化本地存储
        _InitLocaData()
        //开启微信分享功能
        if (Tools.getPlatform == "wx") {
            var data: any = { withShareTicket: true }
            wx.showShareMenu(data)
        }
    }
}