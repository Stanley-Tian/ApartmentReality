/**
 * Created by Tevil on 2016/7/19 0019.
 */
var tmt_config ={};
var tmt_house_id = -1;
function initConfig() {
    // htmlobj=$.ajax({url:"config.json",async:false});
    // var config_info=htmlobj.responseText;
    //tmt_config =JSON.parse(config_info);
    //saveConfig();
    //$("#all_config_info").html(config_info);
    file_op.readFile("config.json");
    file_op.onLoadedFile = function (filedata) {
        console.log("readeddata:"+filedata);
      tmt_config =JSON.parse(filedata);
      console.log("读取文件成功");
        TmtWebSocket.Http(tmt_config.server_ip);

    }
}
function showConfig() {
    $("#server_ip").html(tmt_config.server_ip);
    $("#send_image_timespan").html(tmt_config.send_image_timespan);
}
function saveConfig() {
    var config_json = JSON.stringify(tmt_config);
    file_op.createFile("config.json",config_json);
}
