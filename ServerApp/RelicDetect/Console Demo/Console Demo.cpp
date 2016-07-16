// Console Demo.cpp : 定义控制台应用程序的入口点。
//
#pragma once
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
#include "JsonCPPHeader\json.h"
#include "RelicHelper.h"

#include "opencv_serialization.hpp"

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
void relic_origin(Mat object_color,Mat scene_color)
{
	RelicObj obj;
	RelicScn scene;
	obj.Load_Img(object_color);
	scene.Load_Img(scene_color);
	cout << "blur measure:" << RelicDetect::Image_Blurred(scene.img_gray, 200) << endl;;
	obj.Calc_Keypoints_and_Descriptors();
	scene.Calc_Keypoints_and_Descriptors();

	if (scene.Match_an_Obj(obj))
	{
		scene.Draw_Obj();
	}
	else
	{
		cout << "nothing detect" << endl;
	}

	cout << "relicDetect" << endl;
	waitKey(1);
}

void relic_from_file(Mat scene_color,string feature_json_file)
{
	RelicScn scene;
	scene.Load_Img(scene_color);
	scene.Calc_Keypoints_and_Descriptors();

	fstream in_file(feature_json_file, ios::in);
	RelicObj obj2;
	if (in_file.is_open())
	{
		stringstream buffer;
		buffer << in_file.rdbuf();
		string json_str(buffer.str());
		
		obj2.Parse_from_Json(json_str);
	}
	scene.Match_an_Obj(obj2);
	scene.Draw_Obj();
	waitKey(0);
}
void init()
{
	logging::add_file_log
		(
			keywords::file_name = "sample_%N.log",
			keywords::rotation_size = 10 * 1024 * 1024,
			keywords::time_based_rotation = sinks::file::rotation_at_time_point(0, 0, 0),
			keywords::format = "[%TimeStamp%]: %Message%"
			);

	logging::core::get()->set_filter
		(
			logging::trivial::severity >= logging::trivial::info
			);
}
int main()
{
	VideoCapture cap(1); // open the default camera
	if (!cap.isOpened())  // check if we succeeded
		return -1;
	for (;;)
	{
		Mat frame;
		cap >> frame; // get a new frame from camera
		if (waitKey(30)==32)
		{
			Mat object_color = imread("..\\images\\objects\\A1.jpg");
			Mat scene_color = frame;
			//relic_origin(object_color, scene_color);//读取原图，来做匹配
			relic_from_file(scene_color,"..\\..\\..\\Images\\新户型图\\裁切的下载的原图\\json\\A1_feature.json");//读取特征文件，来做匹配
		}
		imshow("aka", frame);
		//if (waitKey(30) == 0) break;
	}
	//relic_origin();
	system("pause");
    return 0;
}

