import CameraFollow from "../../CommonCode/Component/Game/CameraFollow";
import EventControl from "../../CommonCode/ControlCode/EventControl";
import { LoadRes, ResGet, ResPath } from "../../CommonCode/ControlCode/LoadResControl";
import EventName from "../../ConfigFile/EventName";

/** 3D场景管理 */
class _Scenes3DControl {
    /** 3D场景跟节点 */
    Scene3D: Laya.Scene3D;
    /** 光源 */
    DirectionalLight: Laya.DirectionLight;
    /** 相机 */
    MainCamera: Laya.Camera;
    /** 地图 */
    MAP: Laya.Sprite3D;
    /** NPC1节点 */
    NPC1: Laya.Sprite3D = null;
    /** NPC2节点 */
    NPC2: Laya.Sprite3D = null;
    /** NPC3节点 */
    NPC3: Laya.Sprite3D = null;
    /** zhangaiche1节点 */
    zhangaiche1: Laya.Sprite3D = null;
    /** zhangaiche2节点 */
    zhangaiche2: Laya.Sprite3D = null;
    /** zhangaiche3节点 */
    zhangaiche3: Laya.Sprite3D = null;
    constructor() { };
    /** 初始化3D场景 */
    init() {
        let ResData = [
            ResPath["SampleScene.ls"],
            ResPath["MAP.lh"],
            ResPath["MainCamera.lh"],
            ResPath["DirectionalLight.lh"],
            ResPath["NPC1.lh"],
            ResPath["NPC2.lh"],
            ResPath["NPC3.lh"],
            ResPath["zhangaiche1.lh"],
            ResPath["zhangaiche2.lh"],
            ResPath["zhangaiche3.lh"],
            ResPath["背景音乐2.mp3"],
            ResPath["引擎.mp3"],
            ResPath["喇叭.mp3"],
            ResPath["刹车.mp3"],
            ResPath["Cube.lh"]
        ]
        LoadRes.ResState(ResData, this, this.addNode);
    }
    addNode(res) {
        if (res != 1) return;
        this.Scene3D = Laya.stage.addChild(ResGet["SampleScene.ls"]) as Laya.Scene3D;
        this.DirectionalLight = this.Scene3D.addChild(ResGet["DirectionalLight.lh"]) as Laya.DirectionLight;
        this.MainCamera = this.Scene3D.addChild(ResGet["MainCamera.lh"]) as Laya.Camera;
        this.MAP = this.Scene3D.addChild(ResGet["MAP.lh"]) as Laya.Sprite3D;
        this.Scene3D.addChild(ResGet["Cube.lh"])
        this.NPC1 = this.Scene3D.addChild(ResGet["NPC1.lh"]) as Laya.Sprite3D;
        this.NPC2 = this.Scene3D.addChild(ResGet["NPC2.lh"]) as Laya.Sprite3D;
        this.NPC3 = this.Scene3D.addChild(ResGet["NPC3.lh"]) as Laya.Sprite3D;
        this.zhangaiche1 = ResGet["zhangaiche1.lh"];
        this.zhangaiche2 = ResGet["zhangaiche2.lh"];
        this.zhangaiche3 = ResGet["zhangaiche3.lh"];
        this.Scene3D.zOrder = -1;
        this.MainCamera.enableHDR = false; //抗锯齿
        this.MainCamera.addComponent(CameraFollow);
    }

}
/** 3D场景管理 */
const Scenes3DControl = new _Scenes3DControl();
export default Scenes3DControl;