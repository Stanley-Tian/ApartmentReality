/**
 * Created by rwp on 2016/7/5.
 */
/*
//内部文件读写
//使用范例
新建并写入数据
file_op.creatfile("f1.txt","this is the file content 1!");

读取文件：
file_op.readFile("f1.txt");
file_op.onLoadedFile = function (filedata) {
    console.log("readeddata:"+filedata);
}
*/



var file_op = {

    creatfile: function (mfilepath, mfileData) {
        console.log("enter the creatfile!");
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
            console.log('file system open: ' + fs.name);
            fs.root.getFile(mfilepath, { create: true, exclusive: false }, function (fileEntry) {

                console.log("fileEntry is file?" + fileEntry.isFile.toString());
                console.log("file path url:"+fileEntry.toURL());
                // fileEntry.name == 'someFile.txt'
                // fileEntry.fullPath == '/someFile.txt'
                file_op.writeFileEntry(fileEntry, mfileData);
                console.log("filepath:"+fileEntry.fullPath);

            }, function onErrorCreateFile(){
                console.log("创建文件失败！");
                alert("创建文件失败");
            });

        }, function onErrorLoadFs(){
            console.log("打开文件系统失败！");
            alert("打开文件系统失败");
        });
    },

    writeFileEntry: function (fileEntry, dataObj) {
        // Create a FileWriter object for our FileEntry (log.txt).
        fileEntry.createWriter(function (fileWriter) {
            fileWriter.onwriteend = function () {
                console.log("Successful write file...");
                //file_op.readFileEntry(fileEntry);
            };

            fileWriter.onerror = function (e) {
                console.log("Failed file write: " + e.toString());
                alert("写入文件成失败！");
            };
            // If data object is not passed in,
            // create a new Blob instead.
            if (!dataObj) {
                dataObj = new Blob(['some file data'], {type: 'text/plain'});
            }

            fileWriter.write(dataObj);
        })
    },

    readFileEntry: function (fileEntry) {

        fileEntry.file(function (file) {
            var reader = new FileReader();
            reader.onloadend = function() {
                //console.log("Successful file read: " + this.result);
                console.log("read file ok");
                //console.log(fileEntry.fullPath + ": " + this.result);
                file_op.onLoadedFile(reader.result);
            };

            reader.readAsText(file);
        }, function onErrorReadFile(){
            console.log("读取文件失败！");
        });
    },
    
    readFile: function (filepath){
       // alert("enter the func");
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
            //alert("opened fs");
            console.log('file system open: ' + fs.name);
            fs.root.getFile(filepath, { create: false, exclusive: false }, function (fileEntry) {

                console.log("fileEntry is file?:" + fileEntry.isFile.toString());
                //alert("file paht url:"+fileEntry.toURL());
                // fileEntry.name == 'someFile.txt'
                // fileEntry.fullPath == '/someFile.txt'
                file_op.readFileEntry(fileEntry);
                console.log("filepath:"+fileEntry.fullPath);

            }, function onErrorCreateFile(){
                console.log("读取文件失败！");
                alert("读取文件失败");
            });

        }, function onErrorLoadFs(){
            console.log("打开文件系统失败！");
            alert("打开文件系统失败");
        });
    },
    onLoadedFile: function(fileData){}
    
    

    
};


