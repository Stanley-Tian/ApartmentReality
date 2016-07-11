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
    app.db = $.db("tmt_web_database", "1.0", "Our Data", 1024 * 1024);
    //为了防止冲突，先drop掉表
    app.db.dropTable({name: "reference"});
    //新建表
    app.db.createTable({
        name: "reference",
        columns: [
            "id INTEGER PRIMARY KEY",
            "name TEXT",
            "feature_url TEXT",
            "image_url TEXT"
        ],
        done: function () {
            console.log("Table reference created successfully");
        },
        fail: function () {
            console.log("Table reference created failed");
        }
    });
    //载入json数据
    feature_data_json=$.ajax({url:"assets/FeatureData.json",async:false});
    var feature_data = JSON.parse(feature_data_json.responseText);
    for(var i in feature_data)
    {
        var a = feature_data[i];
        //console.log(feature_data[i]);
        app.db.insert("reference", {
            data: {
                id: i,
                name: a["name"],
                feature_url:a["feature_url"],
                image_url:a["image_url"]
            },
            done: function () {
                console.log("item "+i+" added successfully");
            },
            fail: function () {
                console.log("item "+i+" added failed");
            }
        });
    }
}

function saveFeaturesToSessionStorage() {
    var storage = window.sessionStorage;
    app.db.criteria("reference").list(
        function (transaction, results) {
            var rows = results.rows;
            for (var i = 0; i < rows.length; i++) {
                var row = rows.item(i);
                var feature_json=$.ajax({url:row.feature_url,async:false}).responseText;
                // var feature ;
                // feature = JSON.parse(feature_json);
                // var features_json = JSON.stringify(features);
                //将数据存入sessionStorage，这样只要用户还在这个session里面，就可以持续的访问数据
                //当用户离开session，及重启应用时，sessionStorage将被重置
               // var value = storage.getItem(key); // Pass a key name to get its value.
                storage.setItem(row.id,feature_json) // Pass a key name and its value to add or update that key.
                //storage.removeItem(key) // Pass a key name to remove that key from storage.
                console.log(row.id + " " + row.name + " " + row.feature_url + "");
            }
        },
        function (transaction, error) {
            console.log("Something went wrong....");
        }
    );
}