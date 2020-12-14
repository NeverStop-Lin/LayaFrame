import TweenAll from "../../Component/Game/Tween3D/TweenAll";

class UtilTool {

    public debug: boolean = true;
    public get isMobil(): boolean {
        if (typeof wx != "undefined") {
            return true;
        }
        return false;
    }

    /**2dTexture 转 Texture */
    public texture2dToTexture(tex: Laya.Texture2D): Laya.Texture {
        let oritex: Laya.Texture = new Laya.Texture;
        oritex.bitmap = tex;
        oritex.sourceHeight = tex.height;
        oritex.sourceWidth = tex.width;
        return oritex;
    }

    /**排序
     * @param arr 列表
     * @param isbig false从小到大排序
     * @param key 排序的属性，空时是列表自己自己
     */
    public sort(arr: any, isbig = false, key: string = "") {
        arr.sort(function (a, b) {
            if (isbig == false) {
                if (key == "") {
                    return b - a;
                } else {
                    return a[key] - b[key]
                }
            } else {
                if (key == "") {
                    return b - a
                } else {
                    return b[key] - a[key]
                }

            }
        });
    }
    /**
     * 播放动画
     * @param Anim 动画状态机
     * @param state 要播放动画的名字
     * @param isLoop 是否循环
     * @param PlaySpeed 播放速度
     * @param beforehandT 提前回调
     * @param fun 回调
     * @param gt 动画过渡时间
     */
    public PlayAnim(Anim: Laya.Animator, state: string, isLoop = true, PlaySpeed = 1, beforehandT = 0, fun = null, gt = 0.2) {

        let aa: Laya.AnimatorControllerLayer = Anim.getControllerLayer();
        //let clip:Laya.AnimatorPlayState= aa.getCurrentPlayState();
        let clip = aa["_crossPlayState"]
        if (clip != null) {
            if (state == clip.name) {
                return;
            }
        }

        //return;
        let targetState: Laya.AnimatorState = aa.getAnimatorState(state);
        let targetT = targetState.clipEnd / PlaySpeed;
        Anim.crossFade(state, gt);
        Anim.speed = PlaySpeed;
        if (isLoop == false) {
            Laya.timer.once((gt + targetT - beforehandT) * 1000, this, function sss() {
                //rab.Util.log('动画》》停止');
                //this.Anim.speed=0.5;
                if (fun != null) {
                    fun();
                }
            })
        }
    }

    /**
     * 格式化时间 00：00
     * @param time 
     */
    public UpdateTime(time: number): string {
        time = time < 0 ? 0 : time;
        let t = Math.ceil(time);
        let m = Math.floor(t / 60);
        let s = Math.floor(t % 60);
        let ms: string = (m >= 10) ? m + "" : ("0" + m);
        let ss: string = (s >= 10) ? s + "" : ("0" + s);
        let timeStr = ms + ":" + ss;
        // if(m<=0){
        //     timeStr = ss ;
        // }
        if (time <= 0) { timeStr = "" };
        return timeStr;
    }

    public log(message?: any, ...optionalParams: any[]) {
        if (this.debug) {
            console.log(message, ...optionalParams);
        }
    }

    /**新建返回一个Vector3(0, 0, 0)*/
    Ve3Zero() {
        return new Laya.Vector3(0, 0, 0);
    }

    /**新建返回一个Vector3(1, 1, 1)*/
    Ve3One() {
        return new Laya.Vector3(1, 1, 1);
    }

    /**加载3d物体，如果加载过的就直接返回资源
     * @param path 路径
     * @param fun 回调方法
     * @param scr 代码块，通常是this
     */
    LoadSprite3D(path: string, fun, scr = null) {
        let obj: Laya.Sprite3D = Laya.loader.getRes(path) as Laya.Sprite3D;
        let thisobj = this;
        if (scr != null) {
            thisobj = scr;
        }
        if (obj == null) {
            Laya.Sprite3D.load(path, Laya.Handler.create(thisobj, function (pre) {
                let g = Laya.Sprite3D.instantiate(pre) as Laya.Sprite3D;
                fun(g);
            }));
        } else {
            let g = Laya.Sprite3D.instantiate(obj) as Laya.Sprite3D;
            fun(g);
        }
    }

    /**加载任何资源 ，如果加载过的就直接返回资源
     * @param path 路径
     * @param fun 回调方法
    */
    LoadResource(path: string, fun) {
        let obj = Laya.loader.getRes(path);
        if (obj == null) {
            Laya.loader.load(path, Laya.Handler.create(this, function (pre) {
                fun(pre);
            }));
        } else {
            fun(obj);
        }
    }

    // /**
    //  * 科学计数法
    //  * @param value 数值
    //  * @param fix 保留小数
    //  */
    // public formatter (value,fix = 2){
    //     let bits = ["K","M","B","T","AA","AB","AC","AD","AE","AF","AG","AH","AI","AJ","AK","AL","AM","AN","AO","AP","AQ","AR"];
    //     // if(/\D/.test(value)) return `${value}`;
    //     if(value >= 1000){
    //         for(let i=bits.length; i>0; i--){
    //             if(value >= Math.pow(1000,i)){
    //                return `${parseFloat((value/Math.pow(1000,i)).toFixed(fix))+bits[i-1]}`;
    //             }
    //         }
    //     }

    //     return `${parseFloat(value.toFixed(fix))}`;
    // }

    /**移除数组的某个元素 
     * @param list 列表
     * @param g 要移除的元素
    */
    public RemoveListToValue(list, g) {
        var i = list.indexOf(g);
        if (i > -1) {
            list.splice(i, 1);
        } else {
            //this.log("数组不存在：", list, g);
        }
    }

    /**浅拷贝 */
    public objClone(obj: any): any {
        var dst: any = {};
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                dst[prop] = obj[prop];
            }
        }
        return dst;
    }

    /**
     * 缓动3d物体的移动
     * @param g 缓动的物体
     * @param time 需要的时间
     * @param to 缓动到的位置
     * @param form 初始位置
     * @param isPaly 是否一添加就缓动
     * @param isword 是否是世界坐标
     * @param More 缓动的类型 如：TweenAll.TweenMore.loop（循环缓动）
     * @param Ease 缓动的变化 如：Laya.Ease.sineOut(加速度缓动)
     */
    public AddTweenPos(g: Laya.Sprite3D, time: number, to: Laya.Vector3, form: Laya.Vector3 = null, isPaly = true, isword = false, More: number = 0, Ease = Laya.Ease.linearNone) {
        let tw = g.getComponent(TweenAll.TweenPos);
        if (tw == null) {
            tw = g.addComponent(TweenAll.TweenPos);
        }
        tw.time = time;
        tw.to = to;
        tw.form = form;
        tw.isWordSpace = isword;
        tw.More = More;
        tw.Ease = Ease;
        if (isPaly == true) {
            tw.start();
        }

        return tw;
    }

    /**
     * 缓动3d物体的旋转
     * @param g 缓动的物体
     * @param time 需要的时间
     * @param to 缓动到的位置
     * @param form 初始位置
     * @param isPaly 是否一添加就缓动
     * @param isword 是否是世界坐标
     * @param More 缓动的类型 如：TweenAll.TweenMore.loop（循环缓动）
     * @param Ease 缓动的变化 如：Laya.Ease.sineOut(加速度缓动)
     */
    public AddTweenRotation(g: Laya.Sprite3D, time: number, to: Laya.Vector3, form: Laya.Vector3 = null, isPaly = true, isword = false, More: number = 0, Ease = Laya.Ease.linearNone) {
        let tw = g.getComponent(TweenAll.TweenRotation);
        if (tw == null) {
            tw = g.addComponent(TweenAll.TweenRotation);
        }
        tw.time = time;
        tw.to = to;
        tw.form = form;
        tw.isWordSpace = isword;
        tw.More = More;
        tw.Ease = Ease;
        if (isPaly == true) {
            tw.start();
        }

        return tw;
    }
    /**
     * 缓动3d物体的大小
     * @param g 缓动的物体
     * @param time 需要的时间
     * @param to 缓动到的位置
     * @param form 初始位置
     * @param isPaly 是否一添加就缓动
     * @param isword 是否是世界坐标
     * @param More 缓动的类型 如：TweenAll.TweenMore.loop（循环缓动）
     * @param Ease 缓动的变化 如：Laya.Ease.sineOut(加速度缓动)
     */
    public AddTweenScale(g: Laya.Sprite3D, time: number, to: Laya.Vector3, form: Laya.Vector3 = null, isPaly = true, isword = false, More: number = 0, Ease = Laya.Ease.linearNone) {
        let tw = g.getComponent(TweenAll.TweenScale);
        if (tw == null) {
            tw = g.addComponent(TweenAll.TweenScale);
        }
        tw.time = time;
        tw.to = to;
        tw.form = form;
        tw.isWordSpace = isword;
        tw.More = More;
        tw.Ease = Ease;
        if (isPaly == true) {
            tw.start();
        }

        return tw;
    }

    // /**
    //  * 数据补全
    //  * @param org 原数据
    //  * @param type 目标数据
    //  */
    // public supplement(org:any,type:any):any{
    //     Object.keys(type).forEach(function(key){
    //        // rab.Util.log(key,'==',org[key],"===baocun===",type[key])
    //         if(org[key] != undefined){
    //             org[key] = type[key];
    //         }
    //     });
    //     return org;
    // }

    /**
     * 计算两个时间的相差的天数
     * @param oldTime 
     * @param curTime 
     */
    public timestampToDay(oldTime: number, curTime: number) {
        let d1 = Math.floor(curTime / (24 * 3600 * 1000));
        let d2 = Math.floor(oldTime / (24 * 3600 * 1000));
        return d1 - d2;
    }

    /**通过名字获取物体
     * @param objName 物体名字
     * @param g 父节点
     */
    public GetByName(objName: string, g: Laya.Node = null): Laya.Node {
        if (g == null) {
            //console.log("父节点是空");
            return;
        }
        var obj: Laya.Node = null;
        if (g.name == objName) {

            return g;
        }
        else {
            var tran: Laya.Node = g;
            obj = this.GetObjAll(tran, objName);
        }

        if (obj != null) {

            return obj;
        }
        else {
            console.error("在" + g.name + "找不到物体:" + objName);
            return null;
        }
    }
    private GetObjAll(t: Laya.Node, tname: string): Laya.Node {
        var g = null;

        for (var i: number = 0; i < t.numChildren; i++) {

            if (tname == t.getChildAt(i).name) {
                g = t.getChildAt(i);
                break;
            }
            if (g == null) {
                if (t.getChildAt(i).numChildren > 0) {
                    g = this.GetObjAll(t.getChildAt(i), tname);
                    if (g != null) {
                        break;
                    }
                }
            }
        }
        return g;
    }

    /** 设置摄像机的坐标 */
    SetCameraPos(MainCamera, Objpos: Laya.Vector3, ObjRo: Laya.Vector3 = null) {
        let pos = new Laya.Vector3(Objpos.x, Objpos.y, Objpos.z);
        MainCamera.transform.position = pos;
        if (ObjRo == null) {
            MainCamera.transform.rotationEuler = new Laya.Vector3(0, 0, 0);
        } else {
            let ro = new Laya.Vector3(-ObjRo.x, -(180 - ObjRo.y), -ObjRo.z)
            MainCamera.transform.rotationEuler = ro;
        }

    }

    /** 获取物体对于摄像机的坐标 */
    public GetCameraPos(Objpos: Laya.Sprite3D): any {
        let pos: Laya.Vector3 = new Laya.Vector3(Objpos.transform.position.x, Objpos.transform.position.y, Objpos.transform.position.z);
        let ro: Laya.Vector3 = new Laya.Vector3(-Objpos.transform.rotationEuler.x, -(180 - Objpos.transform.rotationEuler.y), -Objpos.transform.rotationEuler.z)
        let da = [];
        da.push(pos);
        da.push(ro);
        return da;
    }

    /** 缓动看向物体 */
    SetCameraMove(MainCamera, OriPos: Laya.Sprite3D, moveSpeed = 0, fun = null) {
        if (moveSpeed > 0) {
            let data = this.GetCameraPos(OriPos);
            let tr = MainCamera.getComponent(TweenAll.TweenRotation);
            let tm = MainCamera.getComponent(TweenAll.TweenPos);
            if (tr == null) {
                tr = MainCamera.addComponent(TweenAll.TweenRotation);
            }
            if (tm == null) {
                tm = MainCamera.addComponent(TweenAll.TweenPos);
            }
            let tran: Laya.Transform3D = MainCamera.transform;
            tr.form = new Laya.Vector3(tran.rotationEuler.x, tran.rotationEuler.y, tran.rotationEuler.z);
            tr.to = data[1];
            tr.form = new Laya.Vector3(tr.form.x % 360, tr.form.y % 360, tr.form.z % 360);
            tr.to = new Laya.Vector3(tr.to.x % 360, tr.to.y % 360, tr.to.z % 360);
            tr.isWordSpace = true;
            tr.time = moveSpeed;
            tr.start();
            tm.form = new Laya.Vector3(tran.position.x, tran.position.y, tran.position.z);
            tm.to = data[0];
            tm.isWordSpace = true;
            tm.time = moveSpeed;
            if (fun != null) {
                tm.fun = fun;
            }
            tm.start();
        } else {
            this.SetCameraPosByObj(MainCamera, OriPos);
        }
    }

    /** 设置摄像机的坐标 */
    public SetCameraPosByObj(MainCamera, Objpos: Laya.Sprite3D) {
        let pos = new Laya.Vector3(Objpos.transform.position.x, Objpos.transform.position.y, Objpos.transform.position.z);
        MainCamera.transform.position = pos;
        let ro = new Laya.Vector3(-Objpos.transform.rotationEuler.x, -(180 - Objpos.transform.rotationEuler.y), -Objpos.transform.rotationEuler.z)
        MainCamera.transform.rotationEuler = ro;
    }

    /**设置父级且不改变其坐标位置
     * @param g 子物体
     * @param parent 父物体
     */
    SetParent(g: Laya.Sprite3D, parent: Laya.Sprite3D) {
        let o: Laya.Vector3 = new Laya.Vector3(g.transform.position.x, g.transform.position.y, g.transform.position.z);
        let ro = new Laya.Vector3(g.transform.rotationEuler.x, g.transform.rotationEuler.y, g.transform.rotationEuler.z);
        let s = g.transform.scale.clone();
        parent.addChild(g);
        g.transform.position = o;
        g.transform.rotationEuler = ro;
        g.transform.scale = s;
    }

    /**清空子物体 
     * @param Parent 要清空的物体
    */
    ClearObj(Parent: Laya.Sprite3D) {
        //console.log("清空车:"+CarParent.numChildren);
        let ClearCarList: Array<Laya.Sprite3D> = new Array<Laya.Sprite3D>();
        for (let index = 0; index < Parent.numChildren; index++) {
            let g: Laya.Sprite3D = Parent.getChildAt(index) as Laya.Sprite3D;
            g.active = false;
            ClearCarList.push(g);
        }
        for (let index = 0; index < ClearCarList.length; index++) {
            ClearCarList[index].destroy(true);
        }
    }


    /** Vector3相加减 默认是想加
     * @param one
     * @param two
     * @param isAdd 是否是相加，false相减，one-two
     */
    Vector3Add(one: Laya.Vector3, two: Laya.Vector3, isAdd: boolean = true): Laya.Vector3 {
        if (isAdd == true) {
            let add: Laya.Vector3 = new Laya.Vector3(one.x + two.x, one.y + two.y, one.z + two.z);
            return add;
        } else {
            let add: Laya.Vector3 = new Laya.Vector3(one.x - two.x, one.y - two.y, one.z - two.z);
            return add;
        }

    }

    /** 随机一个Vector3
     * @param mis 最小值
     * @param max 最大值
    */
    randomV3(mis = 0, max = 1) {
        let px = Math.random() * (max - mis) + mis;
        let py = Math.random() * (max - mis) + mis;
        let pz = Math.random() * (max - mis) + mis;
        return new Laya.Vector3(px, py, pz);
    }

    /** Vector3相乘 */
    Vector3X(one: Laya.Vector3, x: number): Laya.Vector3 {
        return new Laya.Vector3(one.x * x, one.y * x, one.z * x);
    }

    /**添加爆炸力 
     * @param list 刚体列表
     * @param center 中心点
     * @param radius 半径
     * @param force 受力大小
     * @param isRo 是否添加旋转力
    */
    RigBomb(list: Array<Laya.Rigidbody3D>, center: Laya.Vector3, radius: number, force = 1, isRo = true) {
        if (list.length == 0) {
            return;
        }
        for (let index = 0; index < list.length; index++) {

            let rig = list[index];
            let rx = Math.random() * radius / 10 - radius / 20;
            let ry = Math.random() * radius / 10 - radius / 20;
            let rz = Math.random() * radius / 10 - radius / 20;
            let g = rig.owner as Laya.Sprite3D;
            let pos = this.Vector3Add(g.transform.position, new Laya.Vector3(rx, ry, rz));
            let dir = this.Vector3Add(pos, center, false);
            let dic = Laya.Vector3.distance(center, g.transform.position);
            if (dic > radius) {
                continue;
            }
            Laya.Vector3.normalize(dir, dir);

            let tran = g.transform.position;
            if (isRo == true) {
                let px = Math.random() * radius / 10 - radius / 20;
                let py = Math.random() * radius / 10 - radius / 20;
                let pz = Math.random() * radius / 10 - radius / 20;
                tran = this.Vector3Add(g.transform.position, new Laya.Vector3(px, py, pz));
            }

            let f = Math.random() * 0.3 + 0.7;
            rig.applyForce(this.Vector3X(dir, 100 * force * f), tran);
            //this.log("爆炸》》》》",g);
        }
    }


    // /**克隆一张图 */
    // CloneTex(img: Laya.Image) {
    //     var item: Laya.Image = new Laya.Image();
    //     item.skin = img.skin;
    //     item.anchorX = img.anchorX;
    //     item.anchorY = img.anchorY;
    //     for (var i = 0; i < img.numChildren; i++) {
    //         if (img.getChildAt(i) as Laya.Image) {
    //             var childImg: Laya.Image = new Laya.Image();
    //             childImg.skin = (<Laya.Image>img.getChildAt(i)).skin;
    //             item.addChild(childImg);
    //             childImg.centerX = (<Laya.Image>img.getChildAt(i)).centerX;
    //             childImg.centerY = (<Laya.Image>img.getChildAt(i)).centerY;
    //             childImg.width = (<Laya.Image>img.getChildAt(i)).width;
    //             childImg.height = (<Laya.Image>img.getChildAt(i)).height;
    //             childImg.anchorX = (<Laya.Image>img.getChildAt(i)).anchorX;
    //             childImg.anchorY = (<Laya.Image>img.getChildAt(i)).anchorY;
    //         }
    //     }
    //     return item;
    // }

}

let Tools_3dutil: UtilTool = new UtilTool()
export default Tools_3dutil