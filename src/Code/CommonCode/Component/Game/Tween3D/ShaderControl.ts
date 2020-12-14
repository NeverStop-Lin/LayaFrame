export default class ShaderControl extends Laya.Material {
    constructor() {
        super();
        this.InitShader();
    }

    InitShader() {
        this.NewShader1("CustomShader");
    }

    //新建shader
    public NewShader1(ShaderName: string): void {
        var attributeMap: Object = {
            'a_Position': Laya.VertexMesh.MESH_POSITION0,
            'a_Normal': Laya.VertexMesh.MESH_NORMAL0
        };
        var uniformMap: Object = {
            'u_MvpMatrix': Laya.Shader3D.PERIOD_SPRITE,
            'u_WorldMat': Laya.Shader3D.PERIOD_SPRITE
        };
        var vs: string = `
        #include "Lighting.glsl"; 
        attribute vec4 a_Position;
        uniform mat4 u_MvpMatrix;
        uniform mat4 u_WorldMat;
        attribute vec3 a_Normal;
        varying vec3 v_Normal;
        void main()
        {
        gl_Position = u_MvpMatrix * a_Position;
        mat3 worldMat=mat3(u_WorldMat);
        v_Normal=worldMat*a_Normal;
        gl_Position=remapGLPositionZ(gl_Position); 
        }`;
        var ps: string = `
        #ifdef FSHIGHPRECISION
        precision highp float;
        #else
        precision mediump float;
        #endif
        varying vec3 v_Normal;
        void main()
        {
        gl_FragColor=vec4(v_Normal,1.0);
        }`;

        var customShader: Laya.Shader3D = Laya.Shader3D.add(ShaderName);
        var subShader: Laya.SubShader = new Laya.SubShader(attributeMap, uniformMap);
        customShader.addSubShader(subShader);
        subShader.addShaderPass(vs, ps);
    }
}


