
class $kcr_UtilTool {


    /**角度转弧度 默认角度转弧度
     * @param angle 角度或弧度
     * @param isAngle 是否是角度转弧度
    */
    public radian(angle, isAngle = true) {

        if (isAngle == true) {
            return angle * (Math.PI / 180); //计算出弧度
        } else {
            return angle * (180 / Math.PI); //计算出角度
        }
    }

    /**方向转角度 通过2个轴的坐标算出另外的一个轴的欧拉角，如x，z轴，计算出y轴的欧拉角
     * @param x
     * @param z
     */
    public dirToAngle(x, z) {
        let angle = 0;
        if (x == 0) {
            angle = 180;
        } else {
            angle = Math.atan(z / x);
            angle = this.radian(angle, false)

            if (x > 0) {
                angle = -(angle + 90)

            } else {
                angle = 90 - angle;
            }

            if (angle == 180) {
                angle = 0;
            }
            else if (angle == 0) {
                angle = 180;
            }
        }
        return angle;

    }

    private ProjectDistanceVec: Laya.Vector3 = new Laya.Vector3();
    /**
     * 向量投影长度, 向量CA 在向量 CB 上的投影长度
     *  @param A 坐标A
     *  @param C 坐标C
     *  @param B 坐标B
     */
    ProjectDistance(A: Laya.Vector3, C: Laya.Vector3, B: Laya.Vector3) {
        var CA = this.ProjectDistanceVec;
        Laya.Vector3.subtract(A, C, CA);
        var angle = this.Angle2(CA, B) * Math.PI / 180;
        var distance = Laya.Vector3.distance(A, C);
        distance *= Math.cos(angle);
        return distance;
    }

    /**2维的投影长度 a投影到b 
     * @param a
     * @param b
    */
    ProjectDistanceV2(a: Laya.Vector2, b: Laya.Vector2) {
        //let adic2=a.x*a.x+a.y*a.y;
        let bdic2 = b.x * b.x + b.y * b.y;
        //let aDic=Math.sqrt(adic2)
        let bDic = Math.sqrt(bdic2)
        //console.log("距离》",a,b,Laya.Vector2.dot(a,b),bDic);
        let dic = Laya.Vector2.dot(a, b) / bDic;
        //console.log("投影距离：",dic);
        return dic;
    }

    /** 计算3维向量的夹角 
     *  @param ma 向量A
     *  @param mb 向量B
     */
    Angle2(ma: Laya.Vector3, mb: Laya.Vector3) {
        var v1 = (ma.x * mb.x) + (ma.y * mb.y) + (ma.z * mb.z);
        var ma_val = Math.sqrt(ma.x * ma.x + ma.y * ma.y + ma.z * ma.z);
        var mb_val = Math.sqrt(mb.x * mb.x + mb.y * mb.y + mb.z * mb.z);
        var cosM = v1 / (ma_val * mb_val);

        if (cosM < -1) cosM = -1;
        if (cosM > 1) cosM = 1;

        var angleAMB = Math.acos(cosM) * 180 / Math.PI;
        return angleAMB;
    }

    /**计算2维夹角 
     *  @param ma 向量A
     *  @param mb 向量B
    */
    Angle(ma: Laya.Vector2, mb: Laya.Vector2) {
        if ((ma.x == 0 && ma.y == 0) || (mb.x == 0 && mb.y == 0)) {
            return 0;
        } else {
            var v1 = (ma.x * mb.x) + (ma.y * mb.y);
            var ma_val = Math.sqrt(ma.x * ma.x + ma.y * ma.y);
            var mb_val = Math.sqrt(mb.x * mb.x + mb.y * mb.y);
            //this.log("ss>>",ma_val,mb_val);
            var cosM = v1 / (ma_val * mb_val);

            if (cosM < -1) cosM = -1;
            if (cosM > 1) cosM = 1;

            var angleAMB = Math.acos(cosM) * 180 / Math.PI;
            return angleAMB;
        }
    }

    private DirAngleV: Laya.Vector2 = new Laya.Vector2();

    /**计算方向夹角 以two为基准的角度，one在two右边的是0~180 ，one在two的左边的是0~-180
     * @param one
     * @param two
    */
    DirAngle(one: Laya.Vector2, two: Laya.Vector2) {
        //let right = new Laya.Vector2(-one.y, one.x);

        this.DirAngleV.x = -one.y;
        this.DirAngleV.y = one.x;

        let angle = this.Angle(one, two);
        //this.log("角度》》》》》》》》"+angle)
        let angleDir = Laya.Vector2.dot(this.DirAngleV, two);
        if (0 < angleDir) {
            angle = 360 - angle;
        }
        return angle;
    }

    private NoInverseTransformPoint: Laya.Vector3 = new Laya.Vector3();
    /** 世界坐标转相对坐标
     *  @param origin 要转成那个物体空间的Transform3D
     *  @param point 要转的那个世界坐标点
     */
    InverseTransformPoint(origin: Laya.Transform3D, point: Laya.Vector3) {
        origin.getRight(this.NoInverseTransformPoint);
        var x = this.ProjectDistance(point, origin.position, this.NoInverseTransformPoint);
        //var yy = new Laya.Vector3();
        origin.getUp(this.NoInverseTransformPoint);
        var y = this.ProjectDistance(point, origin.position, this.NoInverseTransformPoint);

        var zz = this.NoInverseTransformPoint;
        origin.getForward(zz);
        //var zz1 = new Laya.Vector3(-zz.x, -zz.y, -zz.z);

        this.NoInverseTransformPoint.x = -zz.x;
        this.NoInverseTransformPoint.y = -zz.y;
        this.NoInverseTransformPoint.z = -zz.z;

        var z = this.ProjectDistance(point, origin.position, this.NoInverseTransformPoint);

        this.NoInverseTransformPoint.x = x;
        this.NoInverseTransformPoint.y = y;
        this.NoInverseTransformPoint.z = z;
        //var value = new Laya.Vector3(x, y, z);
        return this.NoInverseTransformPoint;
    }

    /** 相对坐标转世界坐标
     * @param transform 当前所在的空间
     * @param point  需要转换的点
     */
    TransformPoint(origin: Laya.Transform3D, point: Laya.Vector3) {
        var value = new Laya.Vector3();
        //this.log("转世界坐标",origin.rotation);
        Laya.Vector3.transformQuat(point, origin.rotation, value);
        //this.log("转世界坐标",origin.rotation,value,point);
        Laya.Vector3.add(value, origin.position, value);
        //this.log("转世界1>>>>坐标",value,origin.position);
        return value;
    }

    /** 世界坐标转屏幕坐标
     * @param {Laya.Camera} camera   参照相机
     * @param {Laya.Vector3} point   需要转换的点
     */
    WorldToScreen2(camera, point) {
        var pointA = this.InverseTransformPoint(camera.transform, point);
        var distance = pointA.z;

        var out = new Laya.Vector3();
        camera.viewport.project(point, camera.projectionViewMatrix, out);
        var value = new Laya.Vector3(out.x / Laya.stage.clientScaleX, out.y / Laya.stage.clientScaleY, distance);
        return value;
    }

    /** 屏幕坐标转世界坐标
     * @param {Laya.Camera} camera  参照相机
     * @param {Laya.Vector3} point  需要转换的点
     */
    ScreenToWorld(camera, point) {
        var halfFOV = (camera.fieldOfView * 0.5) * Math.PI / 180;
        let height = point.z * Math.tan(halfFOV);
        let width = height * camera.aspectRatio;

        let lowerLeft = this.GetLowerLeft(camera.transform, point.z, width, height);
        let v = this.GetScreenScale(width, height);

        // 放到同一坐标系（相机坐标系）上计算相对位置
        var value = new Laya.Vector3();
        var lowerLeftA = this.InverseTransformPoint(camera.transform, lowerLeft);
        value = new Laya.Vector3(-point.x / v.x, point.y / v.y, 0);
        Laya.Vector3.add(lowerLeftA, value, value);
        // 转回世界坐标系
        value = this.TransformPoint(camera.transform, value);
        return value;
    }

    /** 获取三维场景和屏幕比例
    * @param {Number} width     宽
    * @param {Number} height    长
    */
    GetScreenScale(width, height) {
        var v = new Laya.Vector3();
        v.x = Laya.stage.width / width / 2;
        v.y = Laya.stage.height / height / 2;
        return v;
    }

    /** 获取相机在 distance距离的截面右下角世界坐标位置
    * @param {Laya.Transform} transform    相机transfrom
    * @param {Number} distance     距离
    * @param {Number} width        宽度
    * @param {Number} height       长度
    */
    GetLowerLeft(transform, distance, width, height) {
        // 相机在 distance距离的截面左下角世界坐标位置
        // LowerLeft
        var lowerLeft = new Laya.Vector3();

        // lowerLeft = transform.position - (transform.right * width);
        var right = new Laya.Vector3();
        transform.getRight(right);
        Laya.Vector3.normalize(right, right);
        var xx = new Laya.Vector3(right.x * width, right.y * width, right.z * width);
        Laya.Vector3.add(transform.position, xx, lowerLeft);

        // lowerLeft -= transform.up * height;
        var up = new Laya.Vector3();
        transform.getUp(up);
        Laya.Vector3.normalize(up, up);
        var yy = new Laya.Vector3(up.x * height, up.y * height, up.z * height);
        Laya.Vector3.subtract(lowerLeft, yy, lowerLeft);

        // lowerLeft += transform.forward * distance;
        var forward = new Laya.Vector3();
        transform.getForward(forward);
        Laya.Vector3.normalize(forward, forward);
        var zz = new Laya.Vector3(forward.x * distance, forward.y * distance, forward.z * distance);
        Laya.Vector3.subtract(lowerLeft, zz, lowerLeft);
        return lowerLeft;
    }

}

let Tools_3dmath: $kcr_UtilTool = new $kcr_UtilTool()
export default Tools_3dmath