import EventName from "../../ConfigFile/EventName"
import { _LocalData } from "../../ConfigFile/LocalData"
import EventControl from "./EventControl"
let InitState = false
export function _InitLocaData() {
    if (InitState) return
    InitState = true
    if (Laya.LocalStorage.getJSON("version") != LocalData.version) {
        for (const key in _LocalData) {
            LocalData[key] = LocalData[key]
        }
    } else {
        for (const key in _LocalData) {
            let data = Laya.LocalStorage.getJSON(key)
            if (!data) {
                LocalData[key] = LocalData[key]
            } else {
                LocalData[key] = data
            }
        }
    }
}
let LocalData = new Proxy(_LocalData, {
    get(target, key) {
        _InitLocaData()
        EventControl.emit(EventName.GetLocalData, target, key)
        return target[key];
    },
    set(target, key, value) {
        Reflect.set(target, key, value);
        Laya.LocalStorage.setJSON(key as string, target[key])
        EventControl.emit(EventName.SetLocalData, target, key, value)
        _InitLocaData()
        return true
    }
})
export default LocalData