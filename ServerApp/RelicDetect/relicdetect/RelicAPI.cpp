#include "RelicAPI.hpp"
#include <algorithm>
RelicAPI::RelicAPI()
{
}

RelicAPI::~RelicAPI()
{
}

string RelicAPI::detect(const Mat origin_image)
{
	//将图像转为灰度图
	Mat gray_img;
	if (origin_image.channels() != 1)
	{
		cvtColor(origin_image, gray_img, CV_BGR2GRAY);
	}
	else {
		gray_img = origin_image;
	};
	//获取图像的特征
	RelicScn scene;
	scene.Load_Img(gray_img);
	scene.Calc_Keypoints_and_Descriptors();
	fs::path p("..\\..\\assets\\FeatureData");
	vector<fs::path> feature_filenames;
	RelicHelper::getFilenames(system_complete(p), feature_filenames);

	//vector<pair<int,MatchResult>> all_mr_candidate;
	pair<int, double> match_candidate;
	match_candidate.first = -1;
	match_candidate.second = 0.0;
	for (int i = 0;i < feature_filenames.size();i++)
	{
		fstream in_file(feature_filenames[i], ios::in);
		RelicObj obj2;
		if (in_file.is_open())
		{
			stringstream buffer;
			buffer << in_file.rdbuf();
			string json_str(buffer.str());

			obj2.Parse_from_Json(json_str);
		}
		MatchResult cur_mr = scene.Match_an_Obj(obj2);
		if (cur_mr.ObjectFound)
		{
			if (cur_mr.ObjectRatio>match_candidate.second)
			{
				match_candidate.first = i;
				match_candidate.second = cur_mr.ObjectRatio;
			}
		}

		//scene.Draw_Obj();
		//waitKey(0);
	}
	stringstream ss;string str;
	ss << match_candidate.first;
	ss >> str;
	return str;
}