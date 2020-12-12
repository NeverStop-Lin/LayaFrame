/** 视角跟随 */
export default class CameraFollow extends Laya.Script3D {
    Camera: Laya.Camera
    nodePos: Laya.Sprite3D
    nodeRot: Laya.Sprite3D
    rot: Laya.Vector3 //用于计算角度的缓动
    speedPos: number = 0.95
    speedRot: number = 0.95
    onEnable() {
        this.Camera = this.owner as Laya.Camera
    }

    /** 通过控制设置的节点控制摄像机（两点一线）
     * 
     * @param nodePos 摄像机坐标缓动到该节点的坐标
     * @param nodeRot 摄像机视角缓动看向该节点的坐标 
     * @param speedPos   （0 - 0.9999） 数值越小坐标缓动速度越快 (默认：0.95)
     * @param speedRot   （0 - 0.9999） 数值越小视角缓动速度越快 (默认：0.95)
     */
    setFollow(nodePos: Laya.Sprite3D, nodeRot: Laya.Sprite3D, speedPos = 0.95, speedRot = 0.95) {
        this.rot = nodeRot.transform.position
        this.nodePos = nodePos
        this.nodeRot = nodeRot
        this.speedPos = speedPos
        this.speedRot = speedRot
    }
    onLateUpdate() {
        this.startFollow()
    }
    startFollow() {
        if (this.nodePos && this.nodePos) {
            let pos = this.slowAction(this.nodePos.transform.position, this.Camera.transform.position, this.speedPos)
            this.rot = this.slowAction(this.nodeRot.transform.position, this.rot, this.speedRot)
            this.Camera.transform.lookAt(this.rot, new Laya.Vector3(0, 1, 0))
            this.Camera.transform.position = pos
        }
    }
    slowAction(Cube, Camera, speed) {
        let v3 = new Laya.Vector3()

        let offX = Camera.x - Cube.x
        let offY = Camera.y - Cube.y
        let offZ = Camera.z - Cube.z

        v3.x = Cube.x + offX * speed;
        v3.y = Cube.y + offY * speed;
        v3.z = Cube.z + offZ * speed;
        return v3
    }
}