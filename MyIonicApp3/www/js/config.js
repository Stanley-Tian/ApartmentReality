/**
 * Created by Tevil on 2016/7/19 0019.
 */
var tmt_config = {};
var tmt_house_id = -1;
function initConfig() {
    // htmlobj=$.ajax({url:"config.json",async:false});
    // var config_info=htmlobj.responseText;
    //tmt_config =JSON.parse(config_info);
    //saveConfig();
    //$("#all_config_info").html(config_info);
    file_op.readFile("config.json");
    file_op.onLoadedFile = function (filedata) {
        console.log("readeddata:" + filedata);
        tmt_config = JSON.parse(filedata);
        console.log("读取文件成功");
        TmtWebSocket.Http(tmt_config.server_ip);

    }
    file_op.onLoadFileFailed=function () {
        $.get("origin_config.json",function (data, status) {
            tmt_config =JSON.parse(data);
        });
        // var htmlobj=$.ajax({url:"origin_config.json",async:false});
        // var config_info=htmlobj.responseText;
    }
}
function showConfig() {
    $("#server_ip").html(tmt_config.server_ip);
    $("#send_image_timespan").html(tmt_config.send_image_timespan/1000 + "秒");
}
function saveConfig() {
    var config_json = JSON.stringify(tmt_config);
    file_op.createFile("config.json", config_json);
}
function changeConfig() {
    var server_ip = $("#server_ip_input").val();
    var send_image_timespan = $("#send_image_timespan_select").val();
    if(server_ip.length>10)
    {
        tmt_config.server_ip = server_ip;
    }
    if(send_image_timespan>0)
    {
        tmt_config.send_image_timespan = send_image_timespan;
    }
    clearConfigInput();
}
function clearConfigInput() {
    $("#server_ip_input").val("");
    $("#send_image_timespan_select").val(0);
}