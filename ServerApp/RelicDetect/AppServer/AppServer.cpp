// AppServer.cpp : 定义控制台应用程序的入口点。
//
#include "stdafx.h"
#include "AppServerThread.hpp"

//#include <websocketpp/config/asio_no_tls.hpp>
//#include <websocketpp/server.hpp>
//#include <websocketpp/base64/base64.hpp>
//
//
//#include "RelicDetect.hpp"
//#include "RelicObj.hpp"
//#include "RelicScn.hpp"
//#include "RelicAPI.hpp"
//#include "JsonCPPHeader\json.h"
//#include "..\Console Demo\RelicHelper.h"
//#include "..\Console Demo\opencv_serialization.hpp"
//#include <boost/timer.hpp>
//#include <boost/thread.hpp>
//#include <boost/chrono.hpp>
//
////websocket 
//#include <stdio.h>
//#include <iostream>
//#include <fstream>
//#include <sstream>
//#include "opencv2/core.hpp"
//#include "opencv2/imgproc.hpp"
//#include "opencv2/features2d.hpp"
//#include "opencv2/highgui.hpp"
//#include "opencv2/calib3d.hpp"
//#include "opencv2/xfeatures2d.hpp"
//
//
//
//namespace logging = boost::log;
//namespace sinks = boost::log::sinks;
//namespace src = boost::log::sources;
//namespace expr = boost::log::expressions;
//namespace attrs = boost::log::attributes;
//namespace keywords = boost::log::keywords;
//
//using namespace cv;
//using namespace cv::xfeatures2d;
//using namespace std;
//using boost::timer;
//
//typedef websocketpp::server<websocketpp::config::asio> server;
//
//using websocketpp::lib::placeholders::_1;
//using websocketpp::lib::placeholders::_2;
//using websocketpp::lib::bind;
//// pull out the type of messages sent by our config
//typedef server::message_ptr message_ptr;
//
//
//vector<RelicObj> objs;


//void SetFilter() {
//	logging::core::get()->set_filter(logging::trivial::severity >= logging::trivial::fatal);
//}
//
//int test_match()
//{
//	SetFilter();
//	objs = RelicAPI::getObjs("..\\..\\assets\\FeatureData");//获取已经提取过的json feature
//	VideoCapture cap(0); // open the default camera
//	if (!cap.isOpened())  // check if we succeeded
//		return -1;
//	for (;;)
//	{
//		Mat frame;
//		cap >> frame; // get a new frame from camera
//		if (waitKey(30) == 32)
//		{
//			Mat scene_color = frame;
//			timer t0;
//			cout << "best Match ID:" << RelicAPI::detect(frame, objs) << endl;
//			cout << "本次匹配总耗时 " << t0.elapsed() << " 秒" << endl;
//		}
//		imshow("aka", frame);
//		waitKey(10);
//		//if (waitKey(30) == 0) break;
//	}
//}


AppServerThreadManagement mManager;
size_t ImgUniId;
void on_message(server* s, websocketpp::connection_hdl hdl, message_ptr msg) {
	std::cout << "on_message called with hdl: " << hdl.lock().get()
		//<< " and message: " << msg->get_payload()
		<< std::endl;
	std::cout << "get a massage over!" << std::endl;
	vector<uchar> buff;
	string mmsg = msg->get_payload();
	cout << "srclength: " << mmsg.length() << endl;

	for (int i = 0; i < (30 < mmsg.length() ? 30 : mmsg.length()); i++)
	{
		cout << mmsg[i];
	}
	cout << endl;
	size_t Offt = mmsg.find("/9j/");
	if (string::npos == Offt)
	{
		std::cout << "Not a Base64Image!" << std::endl;
		return;
	}
	const char* Pos0 = mmsg.c_str() + Offt;
	string mmsg2 = Pos0;
	for (int i = 0; i < (30 < mmsg2.length() ? 30 : mmsg2.length()); i++)
	{
		cout << mmsg2[i];
	}
	cout << endl;
	//std::string mstr = websocketpp::base64_decode(mmsg2);
	std::string mstr1;
	try
	{
		//RelicHelper::Base64Decode(mmsg2, &mstr1);
		mstr1 = websocketpp::base64_decode(mmsg2);
		std::cout << "Base64Decode over!" << std::endl;
	}
	catch (...)
	{
		std::cout << "Base64Decode error!" << std::endl;
		return;
	}
	size_t len = mstr1.length();
	if (len == 0)
	{
		int a = 1;
		cout << "Decoded data invalidate! will return!" << endl;
		return;
	}
	std::cout << "Length: " << len << std::endl;
	byte* imgbuffer = new byte[len];
	for (int i = 0; i < len; i++)
	{
		buff.push_back(mstr1[i]);
	}
	Mat mMat;
	try
	{
		mMat = cv::imdecode(buff, CV_LOAD_IMAGE_COLOR);
		std::cout << "imdecode over!" << std::endl;
	}
	catch (...)
	{
		std::cout << "imdecode error!" << std::endl;
		return;
	}
	//try
	//{
	//	imshow("接收", mMat);
	//	waitKey(1);
	//	imwrite("receivedImg.jpg", mMat);
	//}
	//catch (...)
	//{
	//	std::cout << "image error!" << std::endl;
	//	return;
	//}
	cout << "ImgWidth：" << mMat.cols<<endl;
	cout << "ImgHeight：" << mMat.rows << endl;
	mManager.RegImg(mMat, hdl,ImgUniId);
	ImgUniId++;
}

int main() {
	//Create a server endpoint
	//SetFilter();
	//objs = RelicAPI::getObjs("..\\..\\assets\\FeatureData");//获取已经提取过的json feature
	//cout << "加载的图像特征数据数量：" << objs.size()<<endl;
	cout << "程序运行成功" << endl;
	logging::core::get()->set_filter(logging::trivial::severity >= logging::trivial::fatal);//设置日志级别
	ImgUniId = 0;
	server echo_server;
	cout << "创建网络服务成功" << endl;
	mManager.Initial("..\\..\\assets\\FeatureData",&echo_server);

	try {
		// Set logging settings
		echo_server.set_access_channels(websocketpp::log::alevel::all);
		echo_server.clear_access_channels(websocketpp::log::alevel::frame_payload);

		// Initialize Asio
		echo_server.init_asio();

		// Register our message handler
		echo_server.set_message_handler(bind(&on_message, &echo_server, ::_1, ::_2));

		//echo_server
		// Listen on port 9002
		echo_server.listen(9002);

		// Start the server accept loop
		echo_server.start_accept();

		// Start the ASIO io_service run loop
		echo_server.run();
	}
	catch (websocketpp::exception const & e) {
		std::cout << e.what() << std::endl;
	}
	catch (...) {
		std::cout << "other exception" << std::endl;
	}


	return 0;
}

//
//int main()
//{
//	test_match();
//	system("pause");
//	return 0;
//}
