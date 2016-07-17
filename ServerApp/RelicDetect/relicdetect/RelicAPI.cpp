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
	timer t0;
	//��ͼ��תΪ�Ҷ�ͼ
	Mat gray_img;
	if (origin_image.channels() != 1)
	{
		cvtColor(origin_image, gray_img, CV_BGR2GRAY);
	}
	else {
		gray_img = origin_image;
	};
	//��ȡͼ�������
cout << "��ȡͼ���ʱ��" << t0.elapsed()<<"s"<<endl;
t0.restart();
	RelicScn scene;
	scene.Load_Img(gray_img);
cout << "RelicScn����ͼ���ʱ��" << t0.elapsed() << "s" << endl;
t0.restart();
	scene.Calc_Keypoints_and_Descriptors();
cout << "����Sceneͼ���ʱ��" << t0.elapsed() << "s" << endl;
t0.restart();
	fs::path p("..\\..\\assets\\FeatureData");
	vector<fs::path> feature_filenames;
	RelicHelper::getFilenames(system_complete(p), feature_filenames);
cout << "��ȡ���������ļ���ʱ��" << t0.elapsed() << "s" << endl;
t0.restart();
	//vector<pair<int,MatchResult>> all_mr_candidate;
	pair<int, double> match_candidate;
	match_candidate.first = -1;
	match_candidate.second = 0.0;
	for (int i = 0;i < feature_filenames.size();i++)
	{
		timer t1;
		fstream in_file(feature_filenames[i], ios::in);
		RelicObj obj2;
		if (in_file.is_open())
		{
			stringstream buffer;
			buffer << in_file.rdbuf();
			string json_str(buffer.str());

			obj2.Parse_from_Json(json_str);
		}
cout << "    Json�ļ�������ʱ��" << t1.elapsed() << "s" << endl;
t1.restart();
		MatchResult cur_mr = scene.Match_an_Obj(obj2);

		if (cur_mr.ObjectFound)
		{
			if (cur_mr.ObjectRatio>match_candidate.second)
			{
				match_candidate.first = i;
				match_candidate.second = cur_mr.ObjectRatio;
			}
		}
cout << "    ƥ���ʱ��" << t1.elapsed() << "s" << endl;
t1.restart();
cout << "    ----------------" << endl;
		//scene.Draw_Obj();
		//waitKey(0);
	}
	stringstream ss;string str;
	ss << match_candidate.first;
	ss >> str;
cout << "����ƥ���ʱ��" << t0.elapsed() << "s" << endl;
t0.restart();
	return str;
}

//detect �����ذ汾�����ⲿֱ�Ӷ�������õ�json����
string RelicAPI::detect(const Mat origin_image,vector <RelicObj> relic_objs)
{
	timer t0;
	//��ͼ��תΪ�Ҷ�ͼ
	Mat gray_img;
	if (origin_image.channels() != 1)
	{
		cvtColor(origin_image, gray_img, CV_BGR2GRAY);
	}
	else {
		gray_img = origin_image;
	};
	//��ȡͼ�������
	cout << "��ȡͼ���ʱ��" << t0.elapsed() << "s" << endl;
	t0.restart();
	RelicScn scene;
	scene.Load_Img(gray_img);
	cout << "RelicScn����ͼ���ʱ��" << t0.elapsed() << "s" << endl;
	t0.restart();
	scene.Calc_Keypoints_and_Descriptors();
	cout << "����Sceneͼ���ʱ��" << t0.elapsed() << "s" << endl;
	t0.restart();
///////////////////////////////////	
	//vector<pair<int,MatchResult>> all_mr_candidate;
	pair<int, double> match_candidate;
	match_candidate.first = -1;
	match_candidate.second = 0.0;
	for (int i = 0;i < relic_objs.size();i++)
	{
		timer t1;
		MatchResult cur_mr = scene.Match_an_Obj(relic_objs[i]);

		if (cur_mr.ObjectFound)
		{
			if (cur_mr.ObjectRatio > match_candidate.second)
			{
				match_candidate.first = i;
				match_candidate.second = cur_mr.ObjectRatio;
			}
		}
		cout << "    ƥ���ʱ��" << t1.elapsed() << "s" << endl;
		t1.restart();
		cout << "    ----------------" << endl;
		//scene.Draw_Obj();
		//waitKey(0);
	}
	stringstream ss;string str;
	ss << match_candidate.first;
	ss >> str;
	cout << "����ƥ���ʱ��" << t0.elapsed() << "s" << endl;
	t0.restart();
	return str;
}

vector<RelicObj> RelicAPI::getObjs(string feature_directory) 
{
	fs::path p("..\\..\\assets\\FeatureData");
	vector<fs::path> feature_filenames;
	RelicHelper::getFilenames(system_complete(p), feature_filenames);

	vector<RelicObj> objs(feature_filenames.size());
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
		objs[i] = obj2;
	}
	return objs;
}