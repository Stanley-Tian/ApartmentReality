/**
 * Created by rwp on 2016/7/15.
 */
//初始化：
// TmtWebSocket.Http("222.28.39.64:9002");
//发送数据
// TmtWebSocket.sendMsg(canvas.toDataURL('image/jpeg'));
//

var TmtWs;

var TmtWebSocket =
{
  Http: function (Url) {
    TmtWs = new WebSocket("ws://"+Url);
    TmtWs.onopen = function () {
      TmtWs.send("Hello World");
    };
    TmtWs.onmessage = function (evt) {
      TmtWebSocket.onMsg(evt.data);
    }
  },
  https: function (Url) {
    var ws = new WebSocket("wss://"+Url);
  },
  sendMsg:function (Data) {
    TmtWs.send(Data);
  },
  onMsg:function (Msg){
    console.log(Msg);
    if(isNum(Msg))
    {
      if (Msg!=-1)
      {
        tmt_house_id = parseInt(Msg);
        //onChangeModel();
        console.log("current house id: "+tmt_house_id);
        console.log("current last house id: "+tmt_last_house_id);
        var jump_status = false;
        if(tmt_house_id==tmt_last_house_id&&tmt_house_id!=-1)
        {
          window.location.href='#/tab/show3D';
          jump_status = true;
          return;
        }
        if(jump_status!=true)
        {
          tmt_last_house_id = tmt_house_id;
          tmt_house_id = -1;
        }
      }
    }
  }
};
