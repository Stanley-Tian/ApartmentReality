/**
 * Created by Tevil on 2016/7/19 0019.
 */
var tmt_config ={};
function initConfig() {
    htmlobj=$.ajax({url:"config.json",async:false});
    var config_info=htmlobj.responseText;
    tmt_config =JSON.parse(config_info);
    saveConfig();
    //$("#all_config_info").html(config_info);
    //file_op.readFile("config.json");
    // file_op.onLoadedFile = function (filedata) {
    //     console.log("readeddata:"+filedata);
    // }
}
function showConfig() {
    $("#server_ip").html(tmt_config.server_ip);
    $("#send_image_timespan").html(tmt_config.send_image_timespan);
}
function saveConfig() {
    var config_json = JSON.stringify(tmt_config);
    file_op.createFile("config.json",config_json);
    console.log("写文件成功");
}
