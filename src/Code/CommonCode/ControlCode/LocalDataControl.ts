import EventName from "../../ConfigFile/EventName"
import LOCALDATA from "../../ConfigFile/LocalData"
import EventControl from "./EventControl"
let InitState = false
/** 初始化本地存储 */
export function _InitLocaData() {
    if (InitState) return
    InitState = true
    if (Laya.LocalStorage.getJSON("VERSION") != LocalData.VERSION) {
        for (const key in LOCALDATA) {
            LocalData[key] = LocalData[key]
        }
    } else {
        for (const key in LOCALDATA) {
            let data = Laya.LocalStorage.getJSON(key)
            if (!data) {
                LocalData[key] = LocalData[key]
            } else {
                LocalData[key] = data
            }
        }
    }
}
let LocalData = new Proxy(LOCALDATA, {
    get(target, key) {
        _InitLocaData()
        EventControl.emit(EventName.Frame.GetLocalData, [key])
        return target[key];
    },
    set(target, key, value) {
        Reflect.set(target, key, value);
        Laya.LocalStorage.setJSON(key as string, target[key])
        EventControl.emit(EventName.Frame.SetLocalData, [key, value])
        _InitLocaData()
        return true
    }
})
export default LocalData