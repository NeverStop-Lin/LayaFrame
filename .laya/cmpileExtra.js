
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

    createViewScript();
    /** 根据bin/Views/目录下的界面json文件 创建对应的界面class在src/Views/ */
    function createViewScript() {
        //获取所有json路径
        let jsonPath = getFilePath(binPath + "\\Views");
        //获取所有界面class文件路径
        let classPath = getFilePath(srcPath + "\\Views");
        //需要创建的class文件路径
        let needClassPath = [];
        // 比较缺少哪些界面class 获取所要创建文件的路径数组
        jsonPath.relative.forEach(json_path => {
            json_path = json_path.replace(".json", ".ts");
            if (classPath.relative.indexOf(json_path) == -1) {
                needClassPath.push({ absolute: srcPath + "\\Views\\" + json_path, relative: json_path });
            }
        })
        /** 解析路径 创建文件，生成文件内容字符*/
        needClassPath.forEach(item => {
            let pathDir = path.parse(item.relative);
            let pathDir2 = pathDir.dir.split(path.sep);
            let ui_path = "../ui/layaMaxUI";
            pathDir2.forEach(() => {
                ui_path = "../" + ui_path;
            })
            let class_name = pathDir.name;
            let class_path = "ui.Views." + pathDir2.join(".") + "." + pathDir.name + "UI";

            let data = `import { ui } from "${ui_path}";
export default class ${class_name} extends ${class_path} {
    static NAME = "${class_name}"; //UI控制类需要使用,勿删。
}`;

            mkdirsSync(srcPath + "\\Views\\" + pathDir.dir); //创建目录
            FS.writeFileSync(item.absolute.replace(".json", ".ts"), data); //创建文件
        })
    }


    subpackageDir()
    /** 根据bin/game.json分包配置，创建相应目录及game.js */
    function subpackageDir() {
        let content = FS.readFileSync(binPath + "\\game.json", "utf-8");
        content = JSON.parse(content);
        if (typeof content.subpackages == "undefined") {
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
    //==================================================

    /** 递归获取目录下所有文件的绝对路径和相对路径 */
    function getFilePath(rootUrl) {
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
                    filesList.push(fullPath);
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

    //==================================================
    /** 输出到控制台,用于调试 */
    function log(val) {
        texts.push(val);
    }
    FS.writeFileSync(srcPath + "\\Views\\View_loading.ts", `import { ui } from "../ui/layaMaxUI";
export default class LoadingView extends ui.Views.View_LoadingUI {
    static NAME = "View_Loading"; //UI控制类需要使用,勿删。
    onAwake() {
        console.log(...JSON.parse('${JSON.stringify(texts)}'))
    }
}`);

}());
