export default class $kcr_CustomMaterial extends Laya.Material{
    constructor(){
        super();
        this.setShaderName("CustomShader");
    }
    //漫反射贴图的存取函数
    get diffuseTexture(){
        return this._shaderValues.getTexture($kcr_CustomMaterial.DIFFUSETEXTURE);
    }
    set diffuseTexture(value){
        this._shaderValues.setTexture($kcr_CustomMaterial.DIFFUSETEXTURE, value);
    }
    //设置marginalColor（边缘光照颜色）
    set marginalColor(value){
        this._shaderValues.setVector($kcr_CustomMaterial.MARGINALCOLOR, value);
    }

    static DIFFUSETEXTURE = Laya.Shader3D.propertyNameToID("u_texture");
    static MARGINALCOLOR = Laya.Shader3D.propertyNameToID("u_marginalColor");

}
// //ES6可以定义静态属性，这些属性是CustomMaterial的属性，不属于CustomMaterial实例的属性。ES7提案将支持在class中使用static定义静态属性
// CustomMaterial.DIFFUSETEXTURE = Laya.Shader3D.propertyNameToID("u_texture");
// CustomMaterial.MARGINALCOLOR = Laya.Shader3D.propertyNameToID("u_marginalColor");

