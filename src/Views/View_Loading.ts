import { ui } from "../ui/layaMaxUI";
        export default class LoadingView extends ui.Views.View_LoadingUI {
            static NAME = "View_Loading"; //UI控制类需要使用,勿删。
            onAwake() {
                console.log(...JSON.parse('[]'))
            }
        }