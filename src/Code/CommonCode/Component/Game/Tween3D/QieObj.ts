import Tools_3dmath from "../../ToolsCode/lishunjunTools/Tools_3dmath";


export default class $kcr_QieObj {
    constructor() {
        
    }
    qieobj:Laya.Sprite3D=null;
    //planeY=-0.1
    qie(obj:Laya.Sprite3D,qie:number=0,Objparent:Laya.Sprite3D=null,roEnglr:Laya.Vector3)
    {
        if(obj==null){
            return;
        }

        if(this.qieobj==obj){
            return;
        }else{
            this.qieobj=obj;
        }
        if(Objparent==null){
            Objparent=obj.parent as Laya.Sprite3D;
        }



        let mesh:Laya.MeshSprite3D=null;
        // qie=qie-obj.transform.position.y;
        // qie=0;
        //console.log("切的：",qie);

        mesh=obj as Laya.MeshSprite3D;
   
        var mf = mesh.meshFilter.sharedMesh;

        //顶点数组转顶点容器
        let verticeList:Array<Laya.Vector3>=new Array<Laya.Vector3>();
        mf.getPositions(verticeList);
        let verticeCount = verticeList.length;
        //Tools_3dmath.log("原来的顶点的数：",verticeCount);
        //let englr:Laya.Vector3=obj.transform.rotationEuler.clone();//Tools_3dmath.Vector3Add(obj.transform.rotationEuler,roEnglr);


        let englr:Laya.Vector3=new Laya.Vector3(-obj.transform.rotationEuler.x,-obj.transform.rotationEuler.y,-obj.transform.rotationEuler.z);
        this.GetXYZrotision(englr);
        //Tools_3dmath.log("旋转的欧拉角",englr);
        for (let index = 0; index < verticeList.length; index++) {
            this.DoTwistXYZ(verticeList[index]);
            //this.VectorRo(verticeList[index],englr);
        }
        //Tools_3dmath.log("原来的顶点：",verticeList);

        //三角形数组转三角形容器
        let indices=mesh.meshFilter.sharedMesh.getSubMesh(0).getIndices();
        var triangleList =[];
        indices.map((item,index)=>{
            triangleList.push(item);
            return item;
        })
        //Tools_3dmath.log("原来的顶点索引：",indices);
        //var triangleList=mesh.meshFilter.sharedMesh.getSubMesh(0).getIndices();
        let triangleCount = triangleList.length;
        //Tools_3dmath.log("原来的顶点索引：",triangleCount);

        //uv坐标数组转uv坐标容器
        let uvList = [];
        mesh.meshFilter.sharedMesh.getUVs(uvList);
        let uvCount = uvList.length;
        //Tools_3dmath.log("原来的uv：",uvCount);

        let colorlist=[];
        mesh.meshFilter.sharedMesh.setColors(colorlist)
        //Tools_3dmath.log("颜色》",colorlist);

        //顶点颜色数组转顶点颜色容器
        let normalList = [];
        mesh.meshFilter.sharedMesh.getNormals(normalList);
        let normalCount =normalList.length;
        //Tools_3dmath.log("原来的法线的数：",normalCount);

        let NewnormalList=[];

        NewnormalList = normalList.map((item,index)=>{
            return item;
        })


        // let AddNormalList2=[];

        let nor1=new Laya.Vector3(0,1,0);
        this.DoTwistXYZ(nor1);
        //this.VectorRo(englr,nor1);


        //检查每个三角面，是否存在两个顶点连接正好在直线上
        for (let triangleIndex = 0; triangleIndex < triangleList.length;)
        {
            //Tools_3dmath.log("顶点》》》" , verticeList[triangleIndex]);
            let trianglePoint0 = triangleList[triangleIndex];
            let trianglePoint1 = triangleList[triangleIndex + 1];
            let trianglePoint2 = triangleList[triangleIndex + 2];

            let point0 = verticeList[trianglePoint0];
            let point1 = verticeList[trianglePoint1];
            let point2 = verticeList[trianglePoint2];
            //切点

            //0-1，1-2相连线段被切割
            if ((point0.y - qie) * (point1.y - qie) < 0 && (point1.y - qie) * (point2.y - qie) < 0)
            {
                //截断0-1之间的顶点
                let k01 = (point1.y - point0.y) / (qie - point0.y);
                let newPointX01 = (point1.x - point0.x) / k01 + point0.x;
                let newPointZ01 = (point1.z - point0.z) / k01 + point0.z;
                let newPoint0_1 = new Laya.Vector3(newPointX01, qie, newPointZ01);
                verticeList.push(newPoint0_1);
                //uv
                if (uvList.length > 0)
                {
                    let uv0 = uvList[trianglePoint0];
                    let uv1 = uvList[trianglePoint1];
                    let newUV_x = (uv1.x - uv0.x) / k01 + uv0.x;
                    let newUV_y = (uv1.y - uv0.y) / k01 + uv0.y;
                    //uvList.push(new Laya.Vector2(newUV_x, newUV_y));
                    uvList.push(0,0);
                }
                //法向量
                let normalX0 = normalList[trianglePoint0];
                let normalX1 = normalList[trianglePoint1];
                let normalX2 = normalList[trianglePoint2];
                let newNoramlX01 = (normalX1.x - normalX0.x) / k01 + normalX0.x;
                let newNoramlY01 = (normalX1.y - normalX0.y) / k01 + normalX0.y;
                let newNoramlZ01 = (normalX1.z - normalX0.z) / k01 + normalX0.z;
                normalList.push(new Laya.Vector3(newNoramlX01, newNoramlY01, newNoramlZ01));
                NewnormalList.push(nor1);


                // let nor2=new Laya.Vector3(0,-0.1,0);
                // this.VectorRo(englr,nor2);
                // AddNormalList2.push(nor2);

                //截断1-2之间的顶点
                let k12 = (point2.y - point1.y) / (qie - point1.y);
                let newPointX12 = (point2.x - point1.x) / k12 + point1.x;
                let newPointZ12 = (point2.z - point1.z) / k12 + point1.z;
                let newPoint1_2 = new Laya.Vector3(newPointX12, qie, newPointZ12);
                verticeList.push(newPoint1_2);
                if (uvList.length > 0)
                {
                    let uv1 = uvList[trianglePoint1];
                    let uv2 = uvList[trianglePoint2];
                    let newUV_x = (uv2.x - uv1.x) / k12 + uv1.x;
                    let newUV_y = (uv2.y - uv1.y) / k12 + uv1.y;
                    //uvList.push(new Laya.Vector2(newUV_x, newUV_y));
                    uvList.push(0,0);
                }
                //法向量
                let newNoramlX12 = (normalX2.x - normalX1.x) / k12 + normalX1.x;
                let newNoramlY12 = (normalX2.y - normalX1.y) / k12 + normalX1.y;
                let newNoramlZ12 = (normalX2.z - normalX1.z) / k12 + normalX1.z;
                normalList.push(new Laya.Vector3(newNoramlX12, newNoramlY12, newNoramlZ12));
                NewnormalList.push(nor1);

                // AddNormalList1.push(nor1);
                // AddNormalList2.push(nor2);

                let newVerticeCount = verticeList.length;
                //插入顶点索引，以此构建新三角形

                triangleList.splice(triangleIndex + 1,0, newVerticeCount - 2);
                triangleList.splice(triangleIndex + 2,0, newVerticeCount - 1);

                triangleList.splice(triangleIndex + 3,0, newVerticeCount - 1);
                triangleList.splice(triangleIndex + 4,0, newVerticeCount - 2);

                triangleList.splice(triangleIndex + 6,0, trianglePoint0);
                triangleList.splice(triangleIndex + 7,0, newVerticeCount - 1);
            }
            //1-2，2-0相连线段被切割
            else if ((point1.y - qie) * (point2.y - qie) < 0 && (point2.y - qie) * (point0.y - qie) < 0)
            {
                //截断1-2之间的顶点
                let k12 = (point2.y - point1.y) / (qie - point1.y);
                let newPointX12 = (point2.x - point1.x) / k12 + point1.x;
                let newPointZ12 = (point2.z - point1.z) / k12 + point1.z;
                let newPoint1_2 = new Laya.Vector3(newPointX12, qie, newPointZ12);
                verticeList.push(newPoint1_2);
                if (uvList.length > 0)
                {
                    let uv1 = uvList[trianglePoint1];
                    let uv2 = uvList[trianglePoint2];
                    let newUV_x = (uv2.x - uv1.x) / k12 + uv1.x;
                    let newUV_y = (uv2.y - uv1.y) / k12 + uv1.y;
                    //uvList.push(new Laya.Vector2(newUV_x, newUV_y));
                    uvList.push(0,0);
                }
                //法向量
                let normalX0 = normalList[trianglePoint0];
                let normalX1 = normalList[trianglePoint1];
                let normalX2 = normalList[trianglePoint2];
                let newNoramlX12 = (normalX2.x - normalX1.x) / k12 + normalX1.x;
                let newNoramlY12 = (normalX2.y - normalX1.y) / k12 + normalX1.y;
                let newNoramlZ12 = (normalX2.z - normalX1.z) / k12 + normalX1.z;
                normalList.push(new Laya.Vector3(newNoramlX12, newNoramlY12, newNoramlZ12));
                NewnormalList.push(nor1);

                // let nor1=new Laya.Vector3(0,0.1,0);
                // this.VectorRo(englr,nor1);
                // let nor2=new Laya.Vector3(0,-0.1,0);
                // this.VectorRo(englr,nor2);

                // AddNormalList1.push(nor1);
                // AddNormalList2.push(nor2);

                //截断0-2之间的顶点
                let k02 = (point2.y - point0.y) / (qie - point0.y);
                let newPointX02 = (point2.x - point0.x) / k02 + point0.x;
                let newPointZ02 = (point2.z - point0.z) / k02 + point0.z;
                let newPoint0_2 = new Laya.Vector3(newPointX02, qie, newPointZ02);
                verticeList.push(newPoint0_2);
                //uv
                if (uvList.length > 0)
                {
                    let uv0 = uvList[trianglePoint0];
                    let uv2 = uvList[trianglePoint2];
                    let newUV_x = (uv2.x - uv0.x) / k02 + uv0.x;
                    let newUV_y = (uv2.y - uv0.y) / k02 + uv0.y;
                    //uvList.push(new Laya.Vector2(newUV_x, newUV_y));
                    uvList.push(0,0);
                }
                //法向量
                let newNoramlX02 = (normalX1.x - normalX0.x) / k02 + normalX0.x;
                let newNoramlY02 = (normalX1.y - normalX0.y) / k02 + normalX0.y;
                let newNoramlZ02 = (normalX1.z - normalX0.z) / k02 + normalX0.z;
                normalList.push(new Laya.Vector3(newNoramlX02, newNoramlY02, newNoramlZ02));
                NewnormalList.push(nor1);

                // AddNormalList1.push(nor1);
                // AddNormalList2.push(nor2);

                let newVerticeCount = verticeList.length;
                //插入顶点索引，以此构建新三角形

                //{0}
                //{1}
                triangleList.splice(triangleIndex + 2,0, newVerticeCount - 2);

                triangleList.splice(triangleIndex + 3,0, newVerticeCount - 1);
                triangleList.splice(triangleIndex + 4,0, newVerticeCount - 2);
                //{2},0

                triangleList.splice(triangleIndex + 6,0, newVerticeCount - 1);
                triangleList.splice(triangleIndex + 7,0, trianglePoint0);
                triangleList.splice(triangleIndex + 8,0, newVerticeCount - 2);
            }
            //0-1，2-0相连线段被切割
            else if ((point0.y - qie) * (point1.y - qie) < 0 && (point2.y - qie) * (point0.y - qie) < 0)
            {
                //截断0-1之间的顶点
                let k01 = (point1.y - point0.y) / (qie - point0.y);
                let newPointX01 = (point1.x - point0.x) / k01 + point0.x;
                let newPointZ01 = (point1.z - point0.z) / k01 + point0.z;
                let newPoint0_1 = new Laya.Vector3(newPointX01, qie, newPointZ01);
                verticeList.push(newPoint0_1);
                //uv
                if (uvList.length > 0)
                {
                    let uv0 = uvList[trianglePoint0];
                    let uv1 = uvList[trianglePoint1];
                    let newUV_x = (uv1.x - uv0.x) / k01 + uv0.x;
                    let newUV_y = (uv1.y - uv0.y) / k01 + uv0.y;
                    //uvList.push(new Laya.Vector2(newUV_x, newUV_y));
                    uvList.push(0,0);
                }
                //法向量
                let normalX0 = normalList[trianglePoint0];
                let normalX1 = normalList[trianglePoint1];
                let normalX2 = normalList[trianglePoint2];
                let newNoramlX01 = (normalX1.x - normalX0.x) / k01 + normalX0.x;
                let newNoramlY01 = (normalX1.y - normalX0.y) / k01 + normalX0.y;
                let newNoramlZ01 = (normalX1.z - normalX0.z) / k01 + normalX0.z;
                normalList.push(new Laya.Vector3(newNoramlX01, newNoramlY01, newNoramlZ01));
                NewnormalList.push(nor1);
                // let nor1=new Laya.Vector3(0,0.1,0);
                // this.VectorRo(englr,nor1);
                // let nor2=new Laya.Vector3(0,-0.1,0);
                // this.VectorRo(englr,nor2);

                // AddNormalList1.push(nor1);
                // AddNormalList2.push(nor2);

                //截断0-2之间的顶点
                let k02 = (point2.y - point0.y) / (qie - point0.y);
                let newPointX02 = (point2.x - point0.x) / k02 + point0.x;
                let newPointZ02 = (point2.z - point0.z) / k02 + point0.z;
                let newPoint0_2 = new Laya.Vector3(newPointX02, qie, newPointZ02);
                verticeList.push(newPoint0_2);
                //uv
                if (uvList.length > 0)
                {
                    let uv0 = uvList[trianglePoint0];
                    let uv2 = uvList[trianglePoint2];
                    let newUV_x = (uv2.x - uv0.x) / k02 + uv0.x;
                    let newUV_y = (uv2.y - uv0.y) / k02 + uv0.y;
                    //uvList.push(new Laya.Vector2(newUV_x, newUV_y));
                    uvList.push(0,0);
                }
                //法向量
                let newNoramlX02 = (normalX1.x - normalX0.x) / k02 + normalX0.x;
                let newNoramlY02 = (normalX1.y - normalX0.y) / k02 + normalX0.y;
                let newNoramlZ02 = (normalX1.z - normalX0.z) / k02 + normalX0.z;
                normalList.push(new Laya.Vector3(newNoramlX02, newNoramlY02, newNoramlZ02));
                NewnormalList.push(nor1);
                // AddNormalList1.push(nor1);
                // AddNormalList2.push(nor2);

                let newVerticeCount = verticeList.length;
                //插入顶点索引，以此构建新三角形

                //{0}
                triangleList.splice(triangleIndex + 1,0, newVerticeCount - 2);
                triangleList.splice(triangleIndex + 2,0, newVerticeCount - 1);

                triangleList.splice(triangleIndex + 3,0, newVerticeCount - 2);
                //{1},0
                //{2},0

                triangleList.splice(triangleIndex + 6,0, trianglePoint2);
                triangleList.splice(triangleIndex + 7,0, newVerticeCount - 1);
                triangleList.splice(triangleIndex + 8,0, newVerticeCount - 2);
            }
            //只有0-1被切
            else if ((point0.y - qie) * (point1.y - qie) < 0)
            {
                
            }
            //只有1-2被切
            else if ((point1.y - qie) * (point2.y - qie) < 0)
            {
                
            }
            //只有2-0被切
            else if ((point2.y - qie) * (point0.y - qie) < 0)
            {
                
            }
            triangleIndex += 3;
        }

        //Tools_3dmath.log("3角面》》》",verticeList.length);

        //筛选出切割面两侧的顶点索引
        let triangles1 = [];
        let triangles2 = [];
        //Tools_3dmath.log("顶点索引：",triangleList.length);

        let Xm1=0;
        let Ym1=0;
        let Zm1=0;
        let Xl1=0;
        let Yl1=0;
        let Zl1=0;

        let Xm2=0;
        let Ym2=0;
        let Zm2=0;
        let Xl2=0;
        let Yl2=0;
        let Zl2=0;

        let isru1=false;
        let isru2=false;

        let isru3=false;
        let Xm3=0;
        let Zm3=0;
        let Xl3=0;
        let Zl3=0;


        for (let triangleIndex = 0; triangleIndex < triangleList.length; triangleIndex += 3)
        {
            let trianglePoint0 = triangleList[triangleIndex];
            let trianglePoint1 = triangleList[triangleIndex + 1];
            let trianglePoint2 = triangleList[triangleIndex + 2];

            let point0 = verticeList[trianglePoint0];
            let point1 = verticeList[trianglePoint1];
            let point2 = verticeList[trianglePoint2];




            //切割面
            //Tools_3dmath.log("切割面分离:" , qie,point0,point1,point2,triangleIndex);
            if (point0.y > qie || point1.y > qie || point2.y > qie)
            {

                //Tools_3dmath.log("切割面分离1:" + triangles1.length);
                triangles1.push(trianglePoint0);
                triangles1.push(trianglePoint1);
                triangles1.push(trianglePoint2);
            }
            else
            {
                //Tools_3dmath.log("切割面分离2:" + triangles2.length);
                triangles2.push(trianglePoint0);
                triangles2.push(trianglePoint1);
                triangles2.push(trianglePoint2);
            }
        }




        for (let verticeIndex = verticeCount; verticeIndex < verticeList.length; verticeIndex++)
        {
            let point1=verticeList[verticeIndex];

            if(isru3==false){
                Xm3=point1.x;
                Zm3=point1.z;
                Xl3=point1.x;
                Zl3=point1.z;
                isru3=true;
            }
            if(point1.x>Xm1){
                Xm3=point1.x;
            }
            if(point1.x<Xl1){
                Xl3=point1.x;
            }


            if(point1.z>Zm1){
                Zm3=point1.z;
            }
            if(point1.z<Zl1){
                Zl3=point1.z;
            }
            
        }

        let NewTriangles=[];
        let box3center:Laya.Vector3=new Laya.Vector3((Xm3+Xl3)/2,qie,(Zm3+Zl3)/2);
        //Tools_3dmath.log("中心点》》》",box3center);
        verticeList.push(box3center);

        NewnormalList.push(nor1);
        normalList.push(nor1);



        let angleList = this.QieSort(verticeList, verticeCount);

        if(angleList.length==null || angleList.length<3){
            return null;
        }

        NewTriangles.push(verticeList.length-1);
        NewTriangles.push(angleList[angleList.length-1].Index);
        NewTriangles.push(angleList[0].Index);

        NewTriangles.push(angleList[0].Index);
        NewTriangles.push(angleList[angleList.length-1].Index);
        NewTriangles.push(verticeList.length-1);//verticeCount

        triangles1.push(verticeList.length-1);
        triangles1.push(angleList[angleList.length-1].Index);
        triangles1.push(angleList[0].Index);

        triangles2.push(angleList[0].Index);
        triangles2.push(angleList[angleList.length-1].Index);
        triangles2.push(verticeList.length-1);//verticeCount

        for (let verticeIndex = 0; verticeIndex < angleList.length - 1; verticeIndex++)
        {


            // triangles1.push(verticeList.length-1);
            // triangles1.push(angleList[verticeIndex].Index);
            // triangles1.push(angleList[verticeIndex + 1].Index);

            // triangles2.push(angleList[verticeIndex + 1].Index);
            // triangles2.push(angleList[verticeIndex].Index);
            // triangles2.push(verticeList.length-1);//verticeCount

            NewTriangles.push(verticeList.length-1);
            NewTriangles.push(angleList[verticeIndex].Index);
            NewTriangles.push(angleList[verticeIndex + 1].Index);

            NewTriangles.push(angleList[verticeIndex + 1].Index);
            NewTriangles.push(angleList[verticeIndex].Index);
            NewTriangles.push(verticeList.length-1);//verticeCount
        }

        let vertice1=[];
        let vertice2=[];

        this.GetXYZrotision(new Laya.Vector3(-englr.x,-englr.y,-englr.z));

        for (let index = 0; index < verticeList.length; index++) {
            //this.VectorRo(new Laya.Vector3(-englr.x,-englr.y,-englr.z) ,verticeList[index]);
            this.DoTwistXYZ(verticeList[index]);
        }

        // verticeList.map((item,index)=>{
        //     vertice1.push(item.clone());
        //     vertice2.push(item.clone());
        //     return item;
        // })

        //3角面顶点计算
        let intt1:Uint16Array=new Uint16Array(triangles1.length)
        intt1 = intt1.map((item,index)=>{
            item=triangles1[index];

            if(isru1==false){
                Xm1=verticeList[item].x;
                Ym1=verticeList[item].y;
                Zm1=verticeList[item].z;
                Xl1=verticeList[item].x;
                Yl1=verticeList[item].y;
                Zl1=verticeList[item].z;
                isru1=true;
            }
            if(verticeList[item].x>Xm1){
                Xm1=verticeList[item].x;
            }
            if(verticeList[item].x<Xl1){
                Xl1=verticeList[item].x;
            }

            if(verticeList[item].y>Ym1){
                Ym1=verticeList[item].y;
            }
            if(verticeList[item].y<Yl1){
                Yl1=verticeList[item].y;
            }

            if(verticeList[item].z>Zm1){
                Zm1=verticeList[item].z;
            }
            if(verticeList[item].z<Zl1){
                Zl1=verticeList[item].z;
            }

            return item;
        })

        let intt2:Uint16Array=new Uint16Array(triangles2.length)
        intt2 = intt2.map((item,index)=>{
            item=triangles2[index];
            if(isru2==false){
                Xm2=verticeList[item].x;
                Ym2=verticeList[item].y;
                Zm2=verticeList[item].z;
                Xl2=verticeList[item].x;
                Yl2=verticeList[item].y;
                Zl2=verticeList[item].z;
                isru2=true;
            }
            if(verticeList[item].x>Xm2){
                Xm2=verticeList[item].x;
            }
            if(verticeList[item].x<Xl2){
                Xl2=verticeList[item].x;
            }

            if(verticeList[item].y>Ym2){
                Ym2=verticeList[item].y;
            }
            if(verticeList[item].y<Yl2){
                Yl2=verticeList[item].y;
            }

            if(verticeList[item].z>Zm2){
                Zm2=verticeList[item].z;
            }
            if(verticeList[item].z<Zl2){
                Zl2=verticeList[item].z;
            }
            return item;
        })
        let box1Scale:Laya.Vector3=new Laya.Vector3((Xm1-Xl1),(Ym1-Yl1),(Zm1-Zl1));
        let box2Scale:Laya.Vector3=new Laya.Vector3((Xm2-Xl2),(Ym2-Yl2),(Zm2-Zl2));

        let box1center:Laya.Vector3=new Laya.Vector3((Xm1+Xl1)/2,(Ym1+Yl1)/2,(Zm1+Zl1)/2);
        let box2center:Laya.Vector3=new Laya.Vector3((Xm2+Xl2)/2,(Ym2+Yl2)/2,(Zm2+Zl2)/2);

        if(Yl1>qie+0.1){
            return null;
        }
        if(Ym1<qie-0.1){
            return null;
        }
        if(Yl2>qie+0.1){
            return null;
        }
        if(Ym2<qie-0.1){
            return null;
        }


        let newModel=this.CreateMesh(verticeList,intt1);//vertice1

        newModel.meshRenderer.material=mesh.meshRenderer.material.clone();
        newModel.meshFilter.sharedMesh.setUVs(uvList);
        newModel.meshFilter.sharedMesh.setNormals(normalList);
        //Tools_3dmath.log("后面的："+verticeList.length+" 法线："+normalList.length)
        //mesh=newModel;
        newModel.active=true;

        Objparent.addChild(newModel);
        //newModel.transform.position=new Laya.Vector3(0,0.5,0);



        let mesh1=this.CreateMesh(verticeList,intt2);//vertice2
        mesh1.meshRenderer.material=mesh.meshRenderer.material.clone();
        mesh1.meshFilter.sharedMesh.setUVs(uvList);
        mesh1.meshFilter.sharedMesh.setNormals(normalList);
        mesh1.active=true;

        Objparent.addChild(mesh1);

        let objlist=[];

        //1上
        if(newModel!=null){
            objlist.push(newModel);
        }
        //2上
        if(mesh1!=null){
            objlist.push(mesh1);
        }

        // Tools_3dmath.log("碰撞框1dddddd》》》",Xm1,Ym1,Zm1,Xl1,Yl1,Zl1);
        // Tools_3dmath.log("碰撞框2dddddd》》》",Xm2,Ym2,Zm2,Xl2,Yl2,Zl2);

        obj.active=false;

        // Tools_3dmath.log("碰撞框1》》》",box1Scale,box1center);
        // Tools_3dmath.log("碰撞框2》》》",box2Scale,box2center);

        var rig1:Laya.Rigidbody3D = newModel.addComponent(Laya.Rigidbody3D);
        var box1Shape:Laya.BoxColliderShape = new Laya.BoxColliderShape(box1Scale.x,box1Scale.y,box1Scale.z);
        rig1.colliderShape =box1Shape;
        rig1.colliderShape.localOffset=box1center;

        var rig2:Laya.Rigidbody3D = mesh1.addComponent(Laya.Rigidbody3D);
        var box2Shape:Laya.BoxColliderShape = new Laya.BoxColliderShape(box2Scale.x,box2Scale.y,box2Scale.z);
        rig2.colliderShape =box2Shape;
        rig2.colliderShape.localOffset=box2center;

        mesh1.transform.position=obj.transform.position.clone();
        mesh1.transform.rotation=obj.transform.rotation.clone();
        mesh1.transform.scale=obj.transform.scale.clone();

        newModel.transform.position=obj.transform.position.clone();
        newModel.transform.rotation=obj.transform.rotation.clone();
        newModel.transform.scale=obj.transform.scale.clone();

        //let mat3d:Laya.MeshSprite3D=Tools3D.self.GetAllPre("Qie_mat_0") as Laya.MeshSprite3D;
        //let qiemat=mat3d.meshRenderer.material;
        let qiemat=new Laya.BlinnPhongMaterial();

        for (let index = normalCount-1; index < NewnormalList.length; index++) {
            this.DoTwistXYZ(NewnormalList[index]);
        }

        let newintt1:Uint16Array=new Uint16Array(NewTriangles.length)
        newintt1 = newintt1.map((item,index)=>{
            item=NewTriangles[index];
            return item;
        })
        let pian1=this.CreateMesh(verticeList,newintt1);
        pian1.meshRenderer.material=qiemat.clone();
        pian1.meshFilter.sharedMesh.setUVs(uvList);
        pian1.meshFilter.sharedMesh.setNormals(NewnormalList);
        pian1.active=true;
        mesh1.addChild(pian1);

        let pian2=this.CreateMesh(verticeList,newintt1);
        pian2.meshRenderer.material=qiemat.clone();
        pian2.meshFilter.sharedMesh.setUVs(uvList);
        pian2.meshFilter.sharedMesh.setNormals(NewnormalList);
        pian2.active=true;
        newModel.addChild(pian2);



        //mesh1.active=false;
        //mesh1.transform.position=new Laya.Vector3(mesh1.transform.position.x,-mesh1.transform.position.y+1,mesh1.transform.position.z);
        //this.linearModel(mesh1,mesh1.parent as Laya.Sprite3D,Laya.Color.GREEN);
        //newModel.active=false;
        //this.linearModel(newModel,newModel.parent as Laya.Sprite3D,Laya.Color.GREEN);
        //pian2.transform.position=new Laya.Vector3(0,2,0);
        //this.linearModel(pian2,newModel.parent as Laya.Sprite3D,Laya.Color.GREEN);
        // pian1.transform.position=new Laya.Vector3(0,0,0);
        // this.linearModel(pian1,newModel.parent as Laya.Sprite3D,Laya.Color.GREEN);
        return objlist;

        //this.ChangeMesh(mesh1);
    }

    CreateMesh(Positions:Laya.Vector3[],indice:Uint16Array)
    {
        let vertices = new Float32Array(Positions.length*8);
        var vertexDeclaration = Laya.VertexMesh.getVertexDeclaration("POSITION,NORMAL,UV");
        //_createMesh 要修改laya库文件
        //let mesh:Laya.MeshSprite3D= new Laya.MeshSprite3D(Laya.PrimitiveMesh._createMesh(vertexDeclaration, vertices, indice));
        let mesh=null;
        mesh.meshFilter.sharedMesh.setPositions(Positions);
        return mesh;
    }

    ChangeMesh(obj:Laya.Sprite3D){

        var sphere = obj;
        let g= obj as Laya.MeshSprite3D;

		var meshSprite3D = g;
		var mesh = meshSprite3D.meshFilter.sharedMesh;
        var indices = mesh.getSubMesh(0).getIndices();
        var vv1=mesh.getVertices()
        var vv2=[];
        var vv3=[];
        var vv4=[];
        mesh.getUVs(vv2);
        mesh.getPositions(vv3);
        mesh.getTangents(vv4)


    }

    public scene:Laya.Scene3D=null;

    QieSort(verticeList, verticeCount):any
    {
        //后面的新生成的3角面的索引

        //重新排序新生成的顶点,按照角度

        let SortAngleList = new Array<SortAngle>();

        //初始点的索引
        let con=verticeList[verticeList.length-1];
        let vec1to0 =this.Vector3Add(verticeList[verticeCount-1],con,false)
        //Tools_3dmath.log("初始坐标》",con);
        for (let verticeIndex = verticeCount; verticeIndex < verticeList.length-1; verticeIndex++)
        {
            //计算角度,以0-1为参照

             // verticeList[verticeCount + 1] - verticeList[verticeCount];//向量0
            let indexTo0 =this.Vector3Add(verticeList[verticeIndex],con,false);// verticeList[verticeIndex] - verticeList[verticeCount];//向量n


            //let angle = this.Angle2(indexTo0, vec1to0);//Mathf.Acos(dotRes / (mo1to0 * moIndexto0)); //Vector3.Angle(indexTo0.normalized, vec1to0.normalized);

            let angle = Tools_3dmath.DirAngle(new Laya.Vector2(vec1to0.x,vec1to0.z), new Laya.Vector2(indexTo0.x,indexTo0.z));
            let isExis = false;
            for (let i = 0; i < SortAngleList.length; ++i)
            {
                //同样角度，距离近的被剔除
                if (Math.abs(SortAngleList[i].Angle  / Math.PI - angle  / Math.PI) < 0.1)
                {
                    let dis1 = Laya.Vector3.distance(verticeList[SortAngleList[i].Index], con);
                    let dis2 = Laya.Vector3.distance(verticeList[verticeIndex], con);
                    if (dis2 >= dis1)
                    {
                        SortAngleList[i].Index = verticeIndex;
                    }
                    isExis = true;
                    break;
                }
            }
            if (!isExis)
            {
                //Debug.Log(angle);
                let sortAngle = new SortAngle();
                sortAngle.Index = verticeIndex;
                sortAngle.Angle = angle;
                sortAngle.ver=verticeList[verticeIndex];
                SortAngleList.push(sortAngle);
            }

            // let sortAngle = new SortAngle();
            // sortAngle.Index = verticeIndex;
            // sortAngle.Angle = angle;
            // SortAngleList.push(sortAngle);

        }
        this.Sort(SortAngleList);
        for (let i = 0; i < SortAngleList.length; i++)
        {
            //Debug.Log(">>>" + i + SortAngleList[i].Angle + ">>" + SortAngleList[i]);
        }

        //Tools_3dmath.log("角度排序：",SortAngleList);

        return SortAngleList;
    }

    Sort(num)
    {
        for (let i = 0; i < num.length - 1; i++)
        {
            for (let j = 0; j < num.length - i - 1; j++)
            {
                if (num[j].Angle > num[j + 1].Angle)
                {
                    let temp = num[j];
                    num[j] = num[j + 1];
                    num[j + 1] = temp;
                }
            }
        }
    }

    /**[SixGod]
     * 向量夹角
     *  ma 向量A
     *  mb 向量B
     */
    Angle2(ma:Laya.Vector3, mb:Laya.Vector3) {
        var v1 = (ma.x * mb.x) + (ma.y * mb.y) + (ma.z * mb.z);
        var ma_val = Math.sqrt(ma.x * ma.x + ma.y * ma.y + ma.z * ma.z);
        var mb_val = Math.sqrt(mb.x * mb.x + mb.y * mb.y + mb.z * mb.z);
        var cosM = v1 / (ma_val * mb_val);

        if (cosM < -1) cosM = -1;
        if (cosM > 1) cosM = 1;

        var angleAMB = Math.acos(cosM) * 180 / Math.PI;
        return angleAMB;
    }

    Vector3Add(one:Laya.Vector3,two:Laya.Vector3,isAdd:boolean=true):Laya.Vector3{
        if(isAdd==true){

            let add:Laya.Vector3=new Laya.Vector3(one.x+two.x,one.y+two.y,one.z+two.z);
            return add;
        }else{
            let add:Laya.Vector3=new Laya.Vector3(one.x-two.x,one.y-two.y,one.z-two.z);
            return add;
        }

    }

    //给模型顶点画线

    huaobj:Laya.PixelLineSprite3D=null;

	linearModel(sprite3D1, xianParent:Laya.Sprite3D, color:Laya.Color){

        if(this.huaobj!=null){
            this.huaobj.active=false;
        }

        let sprite3D=Laya.Sprite3D.instantiate(sprite3D1);
        sprite3D.active=false;
        sprite3D.transform.position=new Laya.Vector3(0,2,0);

        var sphereLineSprite3D = new Laya.PixelLineSprite3D(10000);
        xianParent.addChild(sphereLineSprite3D);
        this.huaobj=sphereLineSprite3D;
		if (sprite3D instanceof Laya.MeshSprite3D) {
			var meshSprite3D = sprite3D;
			var mesh = meshSprite3D.meshFilter.sharedMesh;
			var positions = [];
			mesh.getPositions(positions);
            var indices = mesh.getSubMesh(0).getIndices();

            let transVertex0 = new Laya.Vector3();
            let transVertex1 = new Laya.Vector3();
            let transVertex2 = new Laya.Vector3();

			for (var i = 0; i < indices.length; i += 3) {
				var vertex0 = positions[indices[i]];
				var vertex1 = positions[indices[i + 1]];
				var vertex2 = positions[indices[i + 2]];
				Laya.Vector3.transformCoordinate(vertex0, meshSprite3D.transform.worldMatrix, transVertex0);
				Laya.Vector3.transformCoordinate(vertex1, meshSprite3D.transform.worldMatrix, transVertex1);
				Laya.Vector3.transformCoordinate(vertex2, meshSprite3D.transform.worldMatrix, transVertex2);
				sphereLineSprite3D.addLine(transVertex0, transVertex1, color, color);
				sphereLineSprite3D.addLine(transVertex1, transVertex2, color, color);
                sphereLineSprite3D.addLine(transVertex2, transVertex0, color, color);
            }
            //mesh.getSubMesh(0).setIndices(indices);
		}

    }

    //旋转
    VectorRo(englr:Laya.Vector3,Position:Laya.Vector3){
        this.DoTwistX(Position,englr.x);
        this.DoTwistY(Position,englr.y);
        this.DoTwistZ(Position,englr.z);
    }

    //围绕着X轴旋转
    DoTwistX(Position:Laya.Vector3 , angle:number)
    {

        let CosAngle = Math.cos(Tools_3dmath.radian(angle));
        let SinAngle = Math.sin(Tools_3dmath.radian(angle));
        let x = Position.x;
        let y = Position.y * CosAngle + SinAngle * Position.z;
        let z = -Position.y * SinAngle + CosAngle * Position.z;
        Position.x=x;
        Position.y=y;
        Position.z=z;

    }
    //围绕着Y轴旋转
    DoTwistY(Position:Laya.Vector3 , angle:number)
    {

        let CosAngle = Math.cos(Tools_3dmath.radian(angle));
        let SinAngle = Math.sin(Tools_3dmath.radian(angle));
        let x = Position.x * CosAngle - SinAngle * Position.z;
        let y = Position.y;
        let z = Position.x * SinAngle + CosAngle * Position.z;
        Position.x=x;
        Position.y=y;
        Position.z=z;
    }
    //围绕Z轴旋转
    DoTwistZ(Position:Laya.Vector3 , angle:number)
    {

        let CosAngle = Math.cos(Tools_3dmath.radian(angle));
        let SinAngle = Math.sin(Tools_3dmath.radian(angle));
        let x = Position.x * CosAngle + SinAngle * Position.y;
        let y = -Position.x * SinAngle + CosAngle * Position.y;
        let z = Position.z;
        Position.x=x;
        Position.y=y;
        Position.z=z;
    }

    DoTwistXYZ(Position:Laya.Vector3){
        let x=this.m3x3[0]*Position.x+this.m3x3[1]*Position.y+this.m3x3[2]*Position.z;
        let y=this.m3x3[3]*Position.x+this.m3x3[4]*Position.y+this.m3x3[5]*Position.z;
        let z=this.m3x3[6]*Position.x+this.m3x3[7]*Position.y+this.m3x3[8]*Position.z;
        Position.x=x;
        Position.y=y;
        Position.z=z;
    }

    m3x3=[];
    GetXYZrotision(englr:Laya.Vector3){
        let Cosx = Math.cos(Tools_3dmath.radian(englr.x));
        let Sinx = Math.sin(Tools_3dmath.radian(englr.x));
        let Cosy = Math.cos(Tools_3dmath.radian(englr.y));
        let Siny = Math.sin(Tools_3dmath.radian(englr.y));
        let Cosz = Math.cos(Tools_3dmath.radian(englr.z));
        let Sinz = Math.sin(Tools_3dmath.radian(englr.z));


        this.m3x3[0]=Cosy*Cosz;
        this.m3x3[1]=Cosy*Sinz;
        this.m3x3[2]=-Siny;
        this.m3x3[3]=-Cosx*Sinz+Sinx*Siny*Cosz;
        this.m3x3[4]=Cosx*Cosz+Sinx*Siny*Sinz;
        this.m3x3[5]=Sinx*Cosy;
        this.m3x3[6]=Sinx*Sinz+Cosx*Siny*Cosz;
        this.m3x3[7]=-Sinx*Cosz+Cosx*Siny*Sinz;
        this.m3x3[8]=Cosx*Cosy;

        // this.m3x3[0]=Cosy+Sinz*Siny*Sinz;
        // this.m3x3[0]=-Cosy*Sinz+Sinx*Siny*Cosz;
        // this.m3x3[0]=Cosx*Siny;
        // this.m3x3[0]=Cosx*Sinz;
        // this.m3x3[0]=Cosx*Cosz;
        // this.m3x3[0]=-Sinx;
        // this.m3x3[0]=-Siny*Cosz+Sinx*Cosy*Sinz;
        // this.m3x3[0]=Siny*Sinz+Sinx*Cosy*Cosz;
        // this.m3x3[0]=Cosx*Cosy;
    }

}

class SortAngle
{
    public Index:number;
    public Angle:number;
    public ver:Laya.Vector3;
}
