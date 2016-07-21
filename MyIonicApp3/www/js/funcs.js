//This js file require : tmt_algo.js

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
/**
 *
 * @param scene_img 图像img,html上的<image>对象
 * @param onSuccess 第一个参数为成功匹配的户型id
 * @param onFailed
 *
 * 使用方法：
 *  var onSuccess = function (bestid) {
 *  console.log(`Perfect Matched! Id: ${bestid} `);
 *   };
 *    var onFailed = function () {
 *   console.log("Failed Again");
 *   };
 *    var img1 = document.getElementById("image1");
 *    matchFeaturesFromSessionStorage(img1,onSuccess,onFailed);
 */
function matchFeaturesFromSessionStorage(scene_img,onSuccess,onFailed) {
    //var img1 = document.getElementById("image1");
    var scene = Object.create(ExtractFeatures);
    scene.loadImage(scene_img);
    var scene_features = scene.getFeatures();

    var storage = window.sessionStorage;
    var best_fit = {};
    best_fit.id=0;
    best_fit.av_confidence = 0.0;
    for(var i=1;i<=11;i++)
    {
        var obj_features_json = storage.getItem(i); // Pass a key name to get its value.
        var obj_features = JSON.parse(obj_features_json);
        var matches = tracking.Brief.reciprocalMatch(scene_features.KeyPoints,scene_features.Descriptors,obj_features.KeyPoints,obj_features.Descriptors);
        //sort by confidence from big to small
        matches.sort(function(a, b) {
            return b.confidence - a.confidence;
        });
        var total_confidence =0.0;

        var start =0;
        var end= matches.length>50?50:matches.length;
        for(var j=start;j<end;j++)
        {
            total_confidence=total_confidence+matches[j].confidence;
        }
        var average_confidence = total_confidence/(end-start);
        if (average_confidence>best_fit.av_confidence)
        {
            best_fit.id = i;
            best_fit.av_confidence = average_confidence;
        }
        console.log("item: "+i+" av_confidence: "+average_confidence);
    }
    console.log("best id: "+best_fit.id+" av_confidence: "+best_fit.av_confidence);

    if(typeof onSuccess === "function"&&best_fit.av_confidence>0.82)
    {
        onSuccess(best_fit.id);
    }else if(typeof onFailed === "function")
    {
        onFailed();
    }
}
/**
 * 获取一张图片的base64格式信息
 * @param img_id    img元素的id
 * @param canvas_id 将绘制所在的canvas_id值，不指定则使用默认值
 * @returns {string} 返回base64字符串
 */
function getImageDataURL(img_id,canvas_id,target_width ) {
    if(!canvas_id)
    {
        canvas_id= "canvas_for_dataurl";
    }
    var taken_img =  document.getElementById(img_id);
    var h = taken_img.naturalHeight;
    var w = taken_img.naturalWidth;
    var ratio = w/h;
    console.log("origin img height:"+h+" origin img width:"+w);
    if(!target_width)
    {
        target_width = 400;
    }
    var target_height = target_width/ratio;
    if(!$(`#${canvas_id}`).length)
    {//if this element does not exist
        $("#selector-content").append(`<canvas width='${target_width}' height='${target_height}' id='${canvas_id}' hidden></canvas>`);//增加canvas元素
    }
    var c = document.getElementById(canvas_id);
    var ctx = c.getContext("2d");
    ctx.drawImage(taken_img, 0, 0, target_width, target_height);
    console.log("resized img height:"+target_height+" resized img width:"+target_width);

    var this_canvas = document.getElementById(canvas_id);
    return this_canvas.toDataURL('image/jpeg');
}
function showLogOnHtml(tag_id) {
    if(!tag_id)
        tag_id="log";
    (function () {
        if (!console) {
            console = {};
        }
        var old = console.log;
        var logger = document.getElementById(tag_id);
        console.log = function (message) {
            if (typeof message == 'object') {
                logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(message) : String(message)) + '<br />';
            } else {
                logger.innerHTML += message + '<br />';
            }
        }
    })();
}
