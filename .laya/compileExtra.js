(function () {
    'use strict';
    let texts = [];
    const useIDENode = process.argv[0].indexOf("LayaAir") > -1 ? true : false;
    const useCMDNode = process.argv[1].indexOf("layaair2-cmd") > -1 ? true : false;

    function useOtherNode() {
        return useIDENode || useCMDNode;
    }
    //获取Node插件和工作路径
    const ideModuleDir = useOtherNode() ? process.argv[1].replace("gulp\\bin\\gulp.js", "").replace("gulp/bin/gulp.js", "") : "";
    const workSpaceDir = useOtherNode() ? process.argv[2].replace("--gulpfile=", "").replace("\\.laya\\compile.js", "").replace("/.laya/compile.js", "") : "./../";

    const binPath = workSpaceDir + "\\bin";
    const resPath = binPath + "\\res";
    const srcPath = workSpaceDir + "\\src";

    const FS = require('fs');
    var path = require('path');

    /** 创建对应的界面class在src/Code/GameCode/ViewUI/ */
    function createViewScript() {
        /** 界面类跟目录 */
        let ClassPATH = srcPath + "\\Code\\GameCode\\ViewUI";
        /** layaMaxUI.ts的路径 */
        let layaMaxUI = srcPath + "\\ui\\layaMaxUI.ts";

        /** 获取已创建界面类的路径 */
        let GetClassPATH = getFilePath(ClassPATH)
        /** 读取layaMaxUI，获取需要创建的界面类的路径 */
        let CreateClassPath = { relative: [], absolute: [] }
        let ClassNameArray = FS.readFileSync(layaMaxUI, "utf-8").replace(/\s/g, "").match(/REG\("ui\.(\w|\.)+/ig)
        ClassNameArray.forEach((item, index) => {
            let path = item.replace(/REG\("/g, "").replace(/ui\./g, "").replace(/\./g, "\\")
            path = path.substring(0, path.length - 2) + ".ts"
            CreateClassPath.relative[index] = path
            CreateClassPath.absolute[index] = ClassPATH + "\\" + path
        })
        let NeedClassPath = { relative: [], absolute: [] };
        // 比较缺少哪些界面class 获取所要创建文件的路径数组
        CreateClassPath.absolute.forEach((createPath, index) => {
            if (GetClassPATH.absolute.indexOf(createPath) == -1) {
                NeedClassPath.relative.push(CreateClassPath.relative[index])
                NeedClassPath.absolute.push(createPath)
            }
        })

        /** 解析路径 创建文件，生成文件内容字符*/
        NeedClassPath.relative.forEach((item, index) => {
            /**
             * { root: '/',
             * dir: '/目录1/目录2',
             * base: '文件.txt',
             * ext: '.txt',
             * name: '文件' }
             */
            let pathParse = path.parse(item);
            /** 将目录分割成数组 */
            let pathArr = pathParse.dir.split(path.sep);

            //layaMaxUI类路径
            let ui_path = "../../../ui/layaMaxUI";
            pathArr.forEach(name => { if (name) ui_path = "../" + ui_path; })

            // 当前类名
            let class_name = pathParse.name;

            //layaMaxUI单一界面的引用
            let class_path = pathArr.join(".")
            class_path = class_path ? class_path + "." : ""
            class_path = "ui." + class_path + class_name + "UI";

            //组合内容
            let data = `import { ui } from "${ui_path}";
export default class ${class_name} extends ${class_path} {
  static NAME: string = "${class_name}"; //UI控制类需要使用,勿删。
  static AUTO: boolean = true; //当前页面是否自动适应
  static DATA: any = null; //用于储存打开界面时的传参
}`;

            mkdirsSync(ClassPATH + "\\" + pathParse.dir); //创建目录
            //创建目录
            console.log("创建文件界面类============>", pathParse.name)
            FS.writeFileSync(NeedClassPath.absolute[index], data); //创建文件
        })
    }

    /** 根据bin/game.json分包配置，创建相应目录及game.js */
    function subpackageDir() {
        let content = FS.readFileSync(binPath + "\\game.json", "utf-8");
        content = JSON.parse(content);
        if (typeof content.subpackages == "undefined") {
            return
            content.subpackages = [];
            content = JSON.stringify(content);
            FS.writeFileSync(binPath + "\\game.json", content);
        } else {
            content = content.subpackages;
        }
        content = content.map((item) => {
            item.path = binPath + "\\" + item.root.replace(/\//g, "\\");

            //创建game.js
            try {
                FS.accessSync(item.path + "\\game.js");
            } catch (error) {
                FS.writeFileSync(item.path + "\\game.js", "");
            }
            return item;
        })
    }

    /** 读取res目录下的资源文件，生成资源配置表 */
    function AssatConfig() {

        //修改的文件路径
        let PATH = srcPath + "\\Code\\CommonCode\\ControlCode\\ResControl.ts"

        let content = FS.readFileSync(PATH, "utf-8");

        let StartContent = content.substring(0, content.indexOf("////___AUTO_CONFIG_START___////") + 31)
        let EndContent = content.substring(content.indexOf("//#endregion ////___AUTO_CONFIG_END___////"))

        let Paths_ls = getFilePath(binPath + "\\res", ".ls");
        let Paths_lh = getFilePath(binPath + "\\res", ".lh");
        let Paths_mp3 = getFilePath(binPath + "\\res", ".mp3");

        let data = {}
        let getRes = {}
        let Package = {}

        // 音乐
        Paths_mp3.relative.forEach(item => {
            let name = path.parse(item).base
            data[name] = ("res\\" + item)
            getRes[name] = '<any>null'
        })

        // 场景文件
        Paths_ls.relative.forEach(item => {
            let name = path.parse(item).base
            data[name] = ("res\\" + item)
            getRes[name] = '<Laya.Scene3D>null'
        })

        // 预制体文件
        Paths_lh.relative.forEach(item => {
            let name = path.parse(item).base
            data[name] = ("res\\" + item)
            getRes[name] = '<Laya.Sprite3D>null'
        })

        // 生成分包配置表
        let gameJson = FS.readFileSync(binPath + "\\game.json", "utf-8");
        gameJson = JSON.parse(gameJson);
        if (typeof gameJson.subpackages == "undefined") {
            gameJson = []
        } else {
            gameJson = gameJson.subpackages;
        }
        gameJson.forEach((item) => {
            Package[item.name] = item.name;
        })

        //生成界面JSON文件路径
        let ViewJsonPath = JSON.stringify(getViewJSONPath()).replace(/\\\\/g, "/")

        //对象转字符串
        Package = JSON.stringify(Package)
        data = JSON.stringify(data)
            .replace(/\\\\/g, "/")
            .replace(/{/g, "{\n    ")
            .replace(/,/g, ",\n    ")
            .replace(/}/g, "\n}")
        getRes = JSON.stringify(getRes)
            .replace(/:"/g, ":")
            .replace(/",/g, ",")
            .replace(/"}/g, "}")

        //拼接字符串
        content = `${StartContent}
/** 资源路径 */
export const ResPath = ${data};\n
let _ResPath = ${getRes};\n
/** 分包名字 */
export const PackName = ${Package};\n
/** 获取资源，未加载返回null */
export const ResGet = new Proxy(_ResPath, {
    get: function (target, propKey, receiver) {
        let result = Laya.loader.getRes(ResPath[propKey])
        return result ? result : null
    }
});\nlet VIEWJSONPATH = ${ViewJsonPath};\n${EndContent}`

        FS.writeFileSync(PATH, content);
    }

    /** 读取界面json文件路径 */
    function getViewJSONPath() {
        /** layaMaxUI.ts的路径 */
        let layaMaxUI = srcPath + "\\ui\\layaMaxUI.ts";
        let content = FS.readFileSync(layaMaxUI, "utf-8")
        content = content.match(/this.loadScene\(".+"\);\s/gi)
        let result = []
        content.forEach(item => {
            try {
                FS.statSync(binPath + "\\" + item.match(/".+"/gi)[0].replace(/"/g, "").replace(/\//, "\\") + ".json");
                result.push(item.match(/".+"/gi)[0].replace(/"/g, "").replace(/\//, "\\") + ".json")
            } catch (err) { }
        })
        return result

    }

    //==================================================

    /**递归获取目录下所有文件的绝对路径和相对路径
     * @param {*} rootUrl 目录路径
     * @param {string} string 文件名及后缀需要包含的字符串
     */
    function getFilePath(rootUrl, string) {
        var absolute = [];
        var relative = [];
        readFileList(rootUrl, absolute);
        absolute.forEach(item => {// 转换成相对路径
            relative.push(path.relative(rootUrl, item));
        })

        return { relative, absolute };

        /** 递归 */
        function readFileList(dir, filesList = []) {
            const files = FS.readdirSync(dir);
            files.forEach(item => {
                var fullPath = path.join(dir, item);

                const stat = FS.statSync(fullPath);
                if (stat.isDirectory()) {
                    readFileList(path.join(dir, item), filesList);  //递归读取文件
                } else {
                    if (typeof string == "string") {
                        if (fullPath.indexOf(string) > -1) {
                            filesList.push(fullPath);
                        }
                    } else {
                        filesList.push(fullPath);
                    }
                }
            });
            return filesList;
        }
    }

    /**递归创建目录 同步方法
     * @param {string} dirname 路径 例：hello/a/b/c
     */
    function mkdirsSync(dirname) {
        if (FS.existsSync(dirname)) {
            return true;
        } else {
            if (mkdirsSync(path.dirname(dirname))) {
                FS.mkdirSync(dirname);
                return true;
            }
        }
    }

    createViewScript();
    AssatConfig()
    subpackageDir()
}());
