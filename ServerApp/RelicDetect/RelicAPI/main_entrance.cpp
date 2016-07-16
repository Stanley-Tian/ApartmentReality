// RelicAPI.cpp : �������̨Ӧ�ó������ڵ㡣
//

#include "stdafx.h"

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

#include "RelicDetect.hpp"
#include "RelicObj.hpp"
#include "RelicScn.hpp"
#include "RelicAPI.hpp"
#include "JsonCPPHeader\json.h"
#include "..\Console Demo\RelicHelper.h"
#include "..\Console Demo\opencv_serialization.hpp"

namespace logging = boost::log;
namespace logging = boost::log;
namespace sinks = boost::log::sinks;
namespace src = boost::log::sources;
namespace expr = boost::log::expressions;
namespace attrs = boost::log::attributes;
namespace keywords = boost::log::keywords;

using namespace cv;
using namespace cv::xfeatures2d;
using namespace std;
int main()
{
	VideoCapture cap(1); // open the default camera
	if (!cap.isOpened())  // check if we succeeded
		return -1;
	for (;;)
	{
		Mat frame;
		cap >> frame; // get a new frame from camera
		if (waitKey(30) == 32)
		{
			Mat scene_color = frame;
			cout << "best Match ID:" << RelicAPI::detect(frame) << endl;
		}
		imshow("aka", frame);
		waitKey(10);
		//if (waitKey(30) == 0) break;
	}
	//Mat test_img =imread("A1-test.jpg");

	system("pause");
    return 0;
}

