#pragma once
#include "RelicDetect.hpp"
#include "RelicObj.hpp"
#include "RelicScn.hpp"
#include "..\Console Demo\RelicHelper.h"
#include <string>
#include <filesystem>
#include <boost/timer.hpp>
#include <boost/progress.hpp>
namespace fs = std::tr2::sys;
using namespace std;
using boost::timer;
class RelicAPI
{
public:
	RelicAPI();
	~RelicAPI();
	
	//�ɰ�detect��ÿ��ƥ�䶼��Ҫ��ȡjson�ļ�
	static string detect(const Mat origin_image);
	//detect�����ذ汾����Ŀ��objects��Ϊ��������
    static string detect(const Mat origin_image,vector<RelicObj> relic_objs);
	//detect �������󣬷���ƥ��������һλ���Ƿ�ƥ�䣬�ڶ�λ�ǿ�ռ�ٷֱ�
    static MatchResult detectSingle(const Mat origin_image, RelicObj relic_obj);
	//detect �������󣬷���ƥ��������һλ���Ƿ�ƥ�䣬�ڶ�λ�ǿ�ռ�ٷֱȣ�������һ����Ҫ���� loadAndCalcScene������ڴ���
    static MatchResult detectSingle(RelicScn relic_scn, RelicObj relic_obj);
	//���벢����һ������ͼ���������������
    static RelicScn loadAndCalcScene(Mat origin_image);
	//��������json�����ļ���Ŀ¼������һ�����غõ�Obj����
	static vector<RelicObj> getObjs(string feature_directory);
private:

};
