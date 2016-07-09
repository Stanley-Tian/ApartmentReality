/**
 * Created by Tevil on 2016/7/5.
 */
function saveJsonToFile(json_str,file_name) {
    var blob = new Blob([json_str], {type: "application/json"});
    var url  = URL.createObjectURL(blob);

    var a = document.createElement('a');
    a.download    = file_name+".json";
    a.href        = url;
    a.className = "download_link";
    a.textContent = "Download "+file_name+".json ";

    $('#content').append(a);
    $('#content').append(document.createElement("br"));
}
/**
 * 用法：
 *    var full_path = document.getElementById('imgInp').value;
 *    var name = getInputFileName(full_path);
 * @param full_path
 * @returns {XML|string}
 */
function getInputFileName(full_path) {
    var full_name = full_path.replace(/^.*[\\\/]/, '');//匹配/,剔除路径
    var full_name = full_name.replace(/\.\w{0,9}/,'');//匹配.，剔除扩展名
    return full_name;
}
/**
 * 初始化WebSQL，新建一个表，并将数据存入
 */
function initWebSQL() {
    var db = $.db("tmt_web_database", "1.0", "Our Data", 1024 * 1024);
    //为了防止冲突，先drop掉表
    db.dropTable({name: "reference"});
    //新建表
    db.createTable({
        name: "reference",
        columns: [
            "id INTEGER PRIMARY KEY",
            "name TEXT",
            "keypoints_url TEXT",
            "descriptors_url TEXT",
        ],
        done: function () {
            console.log("Table reference created successfully");
        },
        fail: function () {
            console.log("Table reference created failed");
        }
    });
    //插入数据
    db.insert("reference", {
        data: {
            id: 1,
            name: "一个花袋",
            keypoints_url:"assets/FeatureData/a_keypoints.json",
            descriptors_url:"assets/FeatureData/a_descriptors.json"
        },
        done: function () {
            console.log("One item added successfully");
        },
        fail: function () {
            console.log("One item added failed");
        }
    });
    db.insert("reference", {
        data: {
            id: 2,
            name: "一张卡",
            keypoints_url:"assets/FeatureData/c_keypoints.json",
            descriptors_url:"assets/FeatureData/c_descriptors.json"
        },
        done: function () {
            console.log("One item added successfully");
        },
        fail: function () {
            console.log("One item added failed");
        }
    });
}