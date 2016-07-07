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