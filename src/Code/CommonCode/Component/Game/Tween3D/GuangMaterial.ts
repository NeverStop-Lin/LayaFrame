export default class GuangMaterial extends Laya.Material {
    constructor() {
        super();
        this.setShaderName("ShaderGuang");
    }
    //漫反射贴图的存取函数
    get diffuseTexture() {
        return this._shaderValues.getTexture(GuangMaterial.DIFFUSETEXTURE);
    }
    set diffuseTexture(value) {
        this._shaderValues.setTexture(GuangMaterial.DIFFUSETEXTURE, value);
    }
    //设置marginalColor（边缘光照颜色）
    set marginalColor(value) {
        this._shaderValues.setVector(GuangMaterial.MARGINALCOLOR, value);
    }

    static DIFFUSETEXTURE = Laya.Shader3D.propertyNameToID("u_texture");
    static MARGINALCOLOR = Laya.Shader3D.propertyNameToID("u_marginalColor");

}
// //ES6可以定义静态属性，这些属性是CustomMaterial的属性，不属于CustomMaterial实例的属性。ES7提案将支持在class中使用static定义静态属性
// CustomMaterial.DIFFUSETEXTURE = Laya.Shader3D.propertyNameToID("u_texture");
// CustomMaterial.MARGINALCOLOR = Laya.Shader3D.propertyNameToID("u_marginalColor");

