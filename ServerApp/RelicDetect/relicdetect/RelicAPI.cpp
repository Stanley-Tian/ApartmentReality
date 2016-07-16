#include "RelicAPI.hpp"
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
		scene.Match_an_Obj(obj2);
		scene.Draw_Obj();
		waitKey(0);
	}
	return "a";
}