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

void relic_from_file()
{
	Mat object_color = imread("..\\images\\postcard_object.JPG");
	Mat scene_color = imread("..\\images\\postcard_scene_1.jpg");

	//RelicObj obj;
	RelicScn scene;
	//obj.Load_Img(object_color);
	scene.Load_Img(scene_color);
	//calc 
	//obj.Calc_Keypoints_and_Descriptors();
	scene.Calc_Keypoints_and_Descriptors();

	//scene.Match_an_Obj(obj);
	//scene.Draw_Obj();
	//cout << "relicDetect" << endl;

	/////////////////////////////////////////////////////
	//RelicDetect doit;
	//doit.Match(obj, scene);
	////-------------------------

	//cout << obj.descriptors;
	////----------------------------
	//auto descriptors_vecvec = obj.Get_Descriptors(obj.descriptors);
	//cout << "vec descriptors" << endl;
	////---------------------------
	//for (int j = 0;j < descriptors_vecvec[0].size();j++)
	//{
	//	cout << descriptors_vecvec[0][j]<<endl;
	//}
	//Json::Value root;string test;
	//auto str = obj.Convert_to_Json(obj);

	//fstream a_file("obj_json.json", ios::out);
	//if (a_file.is_open())
	//{
	//	a_file << str;
	//	a_file.close();
	//}
	fstream in_file("obj_json.json", ios::in);
	RelicObj obj2;
	if (in_file.is_open())
	{
		stringstream buffer;
		buffer << in_file.rdbuf();
		string json_str(buffer.str());
		
		obj2.Parse_from_Json(json_str);
	}
	//RelicDetect judge;
	//obj2.Load_Img(object_color);
	//obj2.img_color = imread("..\\images\\postcard_object.JPG", IMREAD_COLOR);
	//judge.Match(obj2, scene);
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
			relic_origin(object_color, scene_color);
		}
		imshow("aka", frame);
		//if (waitKey(30) == 0) break;
	}
	//relic_origin();
	system("pause");
    return 0;
}

