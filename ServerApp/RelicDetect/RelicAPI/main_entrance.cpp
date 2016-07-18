// RelicAPI.cpp : 定义控制台应用程序的入口点。
//

#include "stdafx.h"


#include "RelicDetect.hpp"
#include "RelicObj.hpp"
#include "RelicScn.hpp"
#include "RelicAPI.hpp"
#include "JsonCPPHeader\json.h"
#include "..\Console Demo\RelicHelper.h"
#include "..\Console Demo\opencv_serialization.hpp"
#include <boost/timer.hpp>
#include <boost/thread.hpp>
#include <boost/chrono.hpp>

//websocket 
#include <stdio.h>
#include <iostream>
#include <fstream>
#include <sstream>
#include "opencv2/core.hpp"
#include "opencv2/imgproc.hpp"
#include "opencv2/features2d.hpp"
#include "opencv2/highgui.hpp"
#include "opencv2/calib3d.hpp"
#include "opencv2/xfeatures2d.hpp"



namespace logging = boost::log;
namespace sinks = boost::log::sinks;
namespace src = boost::log::sources;
namespace expr = boost::log::expressions;
namespace attrs = boost::log::attributes;
namespace keywords = boost::log::keywords;

using namespace cv;
using namespace cv::xfeatures2d;
using namespace std;
using boost::timer;





void SetFilter() {
	logging::core::get()->set_filter(logging::trivial::severity >= logging::trivial::fatal);
}

int test_match()
{
	SetFilter();
	vector<RelicObj> objs = RelicAPI::getObjs("..\\..\\assets\\FeatureData");//获取已经提取过的json feature
	VideoCapture cap(0); // open the default camera
	if (!cap.isOpened())  // check if we succeeded
		return -1;
	for (;;)
	{
		Mat frame;
		cap >> frame; // get a new frame from camera
		if (waitKey(30) == 32)
		{
			Mat scene_color = frame;
			timer t0;
			cout << "best Match ID:" << RelicAPI::detect(frame, objs) << endl;
			cout << "本次匹配总耗时 " << t0.elapsed() << " 秒" << endl;
		}
		imshow("aka", frame);
		waitKey(10);
		//if (waitKey(30) == 0) break;
	}
}



int main()
{
	test_match();
	system("pause");
	return 0;
}

