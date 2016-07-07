/**
 * Created by Tevil on 2016/7/4.
 */
/**
 * 对象说明：
 * 需要包含头文件<script src="../build/tracking-min.js"></script>
 * 使用方法：
 *     var img1 = document.getElementById("test1");//获取两张图
 *     var img2 = document.getElementById("test2");
 *     var detect_test = Object.create(Detect);//新建一个对象
 *     detect_test.loadImage(img1,img2);//载入两张图像
 *     detect_test.Match();//进行匹配
 *     detect_test.showResult();//显示匹配结果
 * @type {{image1: {RGB: null, Gray: null, Width: null, Data: null, KeyPoints: null, Descriptors: null}, image2: {RGB: null, Gray: null, Width: null, Data: null, KeyPoints: null, Descriptors: null}, canvas: {element: null, name: null, context: null}, matches: null, loadImage: Detect.loadImage, createCanvas: Detect.createCanvas, drawToCanvas: Detect.drawToCanvas, getImageData: Detect.getImageData, Match: Detect.Match, drawResult: Detect.drawResult}}
 */
var Detect ={
  image1:{
    RGB:null,
    Gray:null,
    Width:null,
    Data:null,
    KeyPoints:null,
    Descriptors:null
  },
  image2:{
    RGB:null,
    Gray:null,
    Width:null,
    Data:null,
    KeyPoints:null,
    Descriptors:null
  },
  canvas:{
    element:null,
    name:null,
    context:null
  },
  matches:null,
//载入两张图像，生成并绘制一个hidden的canvas
  loadImage:function (img1,img2) {
    this.image1.RGB = img1;
    this.image2.RGB = img2;
    this.image1.Width = img1.width;
    this.image1.Height = img1.height;
    this.image2.Width = img2.width;
    this.image2.Height = img2.height;
    this.canvas.name = "canvas_"+Math.random();
  //create a canvas to draw the two images
    this.createCanvas(this.canvas.name);
    this.drawToCanvas();
  },
  //生成一个Canvas
  createCanvas:function (canvas_name) {
    var createDiv=document.createElement("canvas");
    createDiv.style.background="pink";
    createDiv.width=this.image1.Width+this.image2.Width;
    createDiv.height=Math.max(this.image1.Height,this.image2.Height);
    createDiv.id= canvas_name;
    createDiv.hidden = true;
    document.body.appendChild(createDiv);
    this.canvas.element = document.getElementById(canvas_name);
  },
  drawToCanvas:function () {
    this.canvas.context = this.canvas.element.getContext("2d");
    this.canvas.context.drawImage(this.image1.RGB,0,0);
    this.canvas.context.drawImage(this.image2.RGB,this.image1.Width,0);
  },
  getImageData:function () {
    this.image1.Data = this.canvas.context.getImageData(0,0,this.image1.Width,this.image1.Height);
    this.image2.Data = this.canvas.context.getImageData(this.image1.Width,0,this.image2.Width,this.image2.Height);

  },
  Match:function () {
    this.getImageData();
    tracking.Brief.N = 256;
    //transfer image data to gray image.arg:data,width,height,store to color image or gray image ,false for gray
    this.image1.Gray = tracking.Image.grayscale(this.image1.Data.data,this.image1.Width,this.image1.Height,false);
    this.image2.Gray = tracking.Image.grayscale(this.image2.Data.data,this.image2.Width,this.image2.Height,false);

    //calc corners
    this.image1.KeyPoints = tracking.Fast.findCorners(this.image1.Gray,this.image1.Width,this.image1.Height);
    this.image2.KeyPoints = tracking.Fast.findCorners(this.image2.Gray,this.image2.Width,this.image2.Height);

    //cal brief descriptors
    this.image1.Descriptors = tracking.Brief.getDescriptors(this.image1.Gray,this.image1.Width,this.image1.KeyPoints);
    this.image2.Descriptors = tracking.Brief.getDescriptors(this.image2.Gray,this.image2.Width,this.image2.KeyPoints);

    //do the match
    this.matches = tracking.Brief.reciprocalMatch(this.image1.KeyPoints,this.image1.Descriptors,this.image2.KeyPoints,this.image2.Descriptors);
    //sort by confidence from big to small
    this.matches.sort(function(a, b) {
      return b.confidence - a.confidence;
    });
  },
  showResult:function () {
    var matches = this.matches;
    for (var i = 0; i < Math.min(30, matches.length); i++) {
      var color = '#' + Math.floor(Math.random()*16777215).toString(16);//a random color
      this.canvas.context.fillStyle = color;
      this.canvas.context.strokeStyle = color;
      this.canvas.context.fillRect(matches[i].keypoint1[0], matches[i].keypoint1[1], 4, 4);
      this.canvas.context.fillRect(matches[i].keypoint2[0] + this.image1.Width, matches[i].keypoint2[1], 4, 4);

      this.canvas.context.beginPath();
      this.canvas.context.moveTo(matches[i].keypoint1[0], matches[i].keypoint1[1]);
      this.canvas.context.lineTo(matches[i].keypoint2[0] + this.image1.Width, matches[i].keypoint2[1]);
      this.canvas.context.stroke();
    }
    this.canvas.element.hidden=false;
    return matches;
  }
};
/**
 * 继承自Detect的对象，用来提取图像特征
 * 使用方法：
 *       var img1 = document.getElementById("test1");//获取图像
 *       var ef = Object.create(ExtraFeatures);//创建对象
 *       ef.loadImage(img1);//载入图像
 *       var features = ef.getFeatures();//获取特征
 *       var json_kp = JSON.stringify(features.KeyPoints);//将两个特征转换为json格式
 *       var json_dp = JSON.stringify(features.Descriptors);
 * @type {Detect}
 */
var ExtraFeatures = Object.create(Detect);//从Detect继承过来
ExtraFeatures = {
  test:1,
  loadImage:function (img) {
    Detect.image1.RGB = img;
    Detect.image1.Width = img.width;
    Detect.image1.Height = img.height;
    Detect.canvas.name = "canvas_"+Math.random();
    //create a canvas to draw the two images
    this.createCanvas(Detect.canvas.name);
    this.drawToCanvas();
  },
  createCanvas:function (canvas_name) {
    var createDiv=document.createElement("canvas");
    createDiv.style.background="pink";
    createDiv.width=Detect.image1.Width;
    createDiv.height=Math.max(Detect.image1.Height);
    createDiv.id= canvas_name;
    createDiv.hidden = true;
    document.body.appendChild(createDiv);
    Detect.canvas.element = document.getElementById(canvas_name);
  },
  drawToCanvas:function(){
    Detect.canvas.context = Detect.canvas.element.getContext("2d");
    Detect.canvas.context.drawImage(Detect.image1.RGB,0,0);
  },
  getImageData:function () {
    Detect.image1.Data = Detect.canvas.context.getImageData(0,0,Detect.image1.Width,Detect.image1.Height);
  },
  getFeatures:function () {
    //this.getImageData();
    Detect.image1.Data = Detect.canvas.context.getImageData(0,0,Detect.image1.Width,Detect.image1.Height);

    tracking.Brief.N = 256;
    //transfer image data to gray image.arg:data,width,height,store to color image or gray image ,false for gray
    Detect.image1.Gray = tracking.Image.grayscale(Detect.image1.Data.data,Detect.image1.Width,Detect.image1.Height,false);
    //calc corners
    Detect.image1.KeyPoints = tracking.Fast.findCorners(Detect.image1.Gray,Detect.image1.Width,Detect.image1.Height);
    //cal brief descriptors
    Detect.image1.Descriptors = tracking.Brief.getDescriptors(Detect.image1.Gray,Detect.image1.Width,Detect.image1.KeyPoints);
    var output_features={
      KeyPoints:Detect.image1.KeyPoints,
      Descriptors:Detect.image1.Descriptors
    };
    return output_features;
  }
};



