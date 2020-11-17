(function () {
    'use strict';

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
    const TS = require(ideModuleDir + 'typescript');

    CheckViewJson()

    /** 检查视图界面的json文件是否变动,变动侧创建对应calss */
    function CheckViewJson() {
        try {
            let _viewClassPath = srcPath + "\\Views";
            let _viewClassNames = FS.readdirSync(_viewClassPath);
            let _uiViewJsons = FS.readdirSync(binPath + "\\Views");
            _uiViewJsons.forEach((_name) => {
                let _className = _name.replace(".json", ".ts");
                if (_viewClassNames.indexOf(_className) == -1) {
                    _className = _className.replace(".ts", "");
                    let _text = GetTSString(UIViewTemplate(_className));
                    FS.appendFileSync(_viewClassPath + "\\" + _className + ".ts", _text);
                }
            });
        }
        catch (err) {
            console.log(err);
        }
    }
    /** 获取ts字符串 */
    function GetTSString(_nodes) {
        const printer = TS.createPrinter();
        const file = TS.updateSourceFileNode(TS.createSourceFile('temporary.ts', '', TS.ScriptTarget.Latest), _nodes);
        return printer.printFile(file);
    }
    /** view模板类 */
    function UIViewTemplate(_className) {
        let ts = TS;
        let data = [
            ts.createImportDeclaration(undefined, undefined, ts.createImportClause(undefined, ts.createNamedImports([
                ts.createImportSpecifier(undefined, ts.createIdentifier('ui'))
            ])), ts.createStringLiteral('../ui/layaMaxUI')),
            ts.createClassDeclaration(undefined, [
                ts.createModifier(ts.SyntaxKind.ExportKeyword),
                ts.createModifier(ts.SyntaxKind.DefaultKeyword)
            ], ts.createIdentifier(_className), undefined, [
                ts.createHeritageClause(ts.SyntaxKind.ExtendsKeyword, [
                    ts.createExpressionWithTypeArguments(undefined, ts.createPropertyAccess(ts.createIdentifier('ui.Views'), ts.createIdentifier(_className + 'UI')))
                ])
            ], [
                ts.createProperty(undefined, [ts.createModifier(ts.SyntaxKind.StaticKeyword)], ts.createIdentifier('NAME'), undefined, undefined, ts.createStringLiteral(_className))
            ])
        ]
        return data;
    }




    // console.log(ReadFileJson(binPath + "\\game.json").subpackages)


    /** 根据game.json 创建对应目录及game.js */
    // function CreateSubPackagesPath() {
    //     //获取game.json 
    //     let GameJson = ReadFileJson(binPath + "\\game.json")
    //     let Paths = []
    //     if (GameJson.subpackages) {
    //         GameJson.map((item, index) => {
    //             return item.root.replace(/\//g, "\\")
    //         })
    //     }

    //     //获取路径

    //     //判断路径是否存在

    //     //创建路径
    // }


    /** 检查目录，不存在则创建目录 */
    // function MakeDir() {
    //     if (fs.existsSync('文件')) {
    //         console.log('路径已存在');
    //     }
    // }

    // /** 检查文件，不存在则创建文件 */
    // function WriteFile() {

    // }

    // /** 读取json */
    // function ReadFileJson(fileUrl) {
    //     let String = ReadFileString(fileUrl)
    //     return JSON.parse(String)
    // }

    // /** 读取文件字符串 */
    // function ReadFileString(fileUrl) {
    //     return FS.readFileSync(fileUrl, "utf-8")
    // }



    // /** 判断文件是否存在 ，文件不存在，创建*/
    // function FileExsistOrCreate(_path, _text) {
    //     try {
    //         FS.accessSync(_path);
    //         let _filetext = FS.readFileSync(_path).toString();
    //         if (_filetext != _text) {
    //             FS.writeFileSync(_path, _text);
    //         }
    //     }
    //     catch (err) {
    //         console.log(_path + "文件不存在，创建");
    //         FS.writeFileSync(_path, _text);
    //     }
    // }



    // /** 检查资源目录 */
    // function CheckResDir() {
    //     try {
    //         _CheckSubPackages();
    //         _CheckSounds();
    //     }
    //     catch (err) {
    //         console.log(err);
    //     }
    // }
    /** 分包 */
    // function _CheckSubPackages() {
    //     let _gameJsonPath = binPath + "\\game.json";
    //     let _json = FS.readFileSync(_gameJsonPath, "utf-8");
    //     _json = JSON.parse(_json);
    //     _json.subpackages = [];
    //     let files = FS.readdirSync(resPath);
    //     let _packageNames = [];
    //     files.forEach((_fileName) => {
    //         if (_fileName == "MainPackage")
    //             return;
    //         let _gameJsPath = resPath + "\\" + _fileName + "\\game.js";
    //         FileExsistOrCreate(_gameJsPath, "");
    //         let _pakage = {
    //             name: _fileName,
    //             root: "res/" + _fileName
    //         };
    //         _json.subpackages.push(_pakage);
    //         _packageNames.push(_fileName);
    //     });
    //     FileExsistOrCreate(_gameJsonPath, JSON.stringify(_json));
    //     let _subPackageTSPath = srcPath + "\\xjFrame\\SubPackage\\SubPackages.ts";
    //     let _subPackageTS = GetTSString(SubPackagesTemplate(_packageNames));
    //     FileExsistOrCreate(_subPackageTSPath, _subPackageTS);
    //     console.log(_json);
    // }
    // function _CheckSounds() {
    //     let _files = FS.readdirSync(resPath + "\\Sounds");
    //     let _soundsTS = GetTSString(SoundsTemplate(_files));
    //     FileExsistOrCreate(srcPath + "\\xjFrame\\Sound\\Sounds.ts", _soundsTS);
    // }
    // /** 不要 */
    // function SoundsTemplate(_soundsNames) {
    //     let ts = TS;
    //     let _soundNameNodes = [];
    //     _soundsNames.forEach(_name => {
    //         if (_name.indexOf(".mp3") == -1)
    //             return;
    //         let _sound = ts.createPropertyAssignment(ts.createIdentifier(_name.replace(".mp3", "")), ts.createStringLiteral('res/Sounds/' + _name));
    //         _soundNameNodes.push(_sound);
    //     });
    //     return [
    //         ts.createExportAssignment(undefined, undefined, undefined, ts.createObjectLiteral(_soundNameNodes, false))
    //     ];
    // }
    // function SubPackagesTemplate(_subPackagesName) {
    //     let ts = TS;
    //     let _subPackages = [];
    //     _subPackagesName.forEach(_name => {
    //         let _package = ts.createPropertyAssignment(ts.createIdentifier(_name), ts.createStringLiteral(_name));
    //         _subPackages.push(_package);
    //     });
    //     return [
    //         ts.createExportAssignment(undefined, undefined, undefined, ts.createObjectLiteral(_subPackages, false))
    //     ];
    // }
    // CheckResDir();

}());
