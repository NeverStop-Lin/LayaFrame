


export default class $kcr_WaterRipple extends Laya.Script3D {
    onInit() {

    }
    static self: $kcr_WaterRipple = null;

    constructor() {
        super();
        $kcr_WaterRipple.self = this;
    }

    updateT = 0;
    private updateOff = 0.01;
    maxY = 0.6;
    sinX = 0.2;
    sinZ = 0.2;

    UpdateFunList = [];
    isAnim = false;

    WaterMoveOff: Laya.Vector2 = new Laya.Vector2(0.002, 0)

    private waterObjList: Array<waterinfo> = new Array<waterinfo>();

    onUpdate() {
        if (this.isAnim) {

            this.SinAnim()
            this.UpdateObj();
        }
    }

    SetInit(maxY = 0.6, sinX = 0.5, sinZ = 0.5) {
        // this.waterObj=obj as Laya.MeshSprite3D;
        // var mesh = this.waterObj.meshFilter.sharedMesh;
        // mesh.getPositions(this.verticeList);
        //this.waterObjList=new Array<waterinfo>();
        this.maxY = maxY;
        this.sinX = sinX;
        this.sinZ = sinZ;
        this.updateT = 0;
        this.isAnim = true;
    }

    addWater(obj: Laya.Sprite3D) {
        let waterin: waterinfo = new waterinfo();
        waterin.waterobj = obj;

        waterin.waterXY.x = obj.transform.localPositionX;
        waterin.waterXY.y = obj.transform.localPositionZ;

        let objmesh = obj as Laya.MeshSprite3D;
        var mesh = objmesh.meshFilter.sharedMesh;
        mesh.getPositions(waterin.verticeList);
        //console.log("sssssssssssss",this.waterObjList)
        this.waterObjList.push(waterin);
        //console.log("水的数据：",waterin);
        //console.log("sssssssssssss",this.waterObjList)
    }

    private UpdateObj() {
        this.updateT += 0.02;
        if (this.UpdateFunList != null) {
            for (let index = 0; index < this.UpdateFunList.length; index++) {
                let fun = this.UpdateFunList[index];
                if (fun != null) {
                    fun();
                }
            }
        }
    }

    private SinAnim() {
        for (let j = 0; j < this.waterObjList.length; j++) {
            let info: waterinfo = this.waterObjList[j];
            if (info.waterobj != null) {
                if (info.waterobj.transform != null) {
                    if (info.waterobj.active == true) {
                        for (let i = 0; i < info.verticeList.length; i++) {
                            //
                            let x = info.verticeList[i].x + info.waterXY.x;

                            let z = info.verticeList[i].z + info.waterXY.y;
                            info.verticeList[i].y = this.getY(x, z);
                            //console.log("顶点数组aaa：",info.waterobj.name,info.waterXY.y);
                        }

                        this.ChangeMesh(info.waterobj as Laya.MeshSprite3D, info.verticeList);

                        let g: Laya.Sprite3D = info.waterobj;
                        let waterO: Laya.MeshSprite3D = g as Laya.MeshSprite3D;
                        let mat: Laya.PBRStandardMaterial = waterO.meshRenderer.material as Laya.PBRStandardMaterial;

                        mat.tilingOffset.z += this.WaterMoveOff.x;
                        mat.tilingOffset.w += this.WaterMoveOff.y;
                    }
                }
            }
        }
    }

    private getY(x, z): number {
        let sinx = Math.sin(x * this.sinX + this.updateT)
        let sinz = Math.sin(z * this.sinZ + this.updateT)
        let xY = sinx * this.maxY;
        let zY = sinz * this.maxY;
        return xY * zY;
    }

    calculateY(x, z): number[] {
        let list = [];

        x = x * this.sinX + this.updateT;
        z = z * this.sinZ + this.updateT;

        let sinx = Math.sin(x)
        let sinz = Math.sin(z)

        let roz = Math.cos(x) * this.maxY * 8;
        let rox = Math.cos(z) * this.maxY * 8;
        // rox=Math.atan(z);
        // rox=rab.Util.radian(rox,false);


        let xY = sinx * this.maxY;
        let zY = sinz * this.maxY;
        let y = xY * zY;

        list.push(y);
        list.push(rox);
        list.push(roz);
        //console.log("计算出来的：",list);

        return list;
    }


    /**创建模型 */
    CreateMesh(Positions: Laya.Vector3[], indice: Uint16Array) {
        // let vertices = new Float32Array(Positions.length*8);
        // var vertexDeclaration = Laya.VertexMesh.getVertexDeclaration("POSITION,NORMAL,UV");
        // let mesh:Laya.MeshSprite3D= new Laya.MeshSprite3D(Laya.PrimitiveMesh._createMesh(vertexDeclaration, vertices, indice));
        // mesh.meshFilter.sharedMesh.setPositions(Positions);
        // return mesh;
    }

    /**修改模型顶点 */
    ChangeMesh(obj: Laya.MeshSprite3D, positions: Laya.Vector3[]) {
        var mesh = obj.meshFilter.sharedMesh;
        mesh.setPositions(positions);
    }
}

class waterinfo {
    public verticeList: Array<Laya.Vector3> = new Array<Laya.Vector3>();
    public waterobj: Laya.Sprite3D = null;
    public waterXY: Laya.Vector2 = new Laya.Vector2();
}


