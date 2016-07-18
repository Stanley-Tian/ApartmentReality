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
	
	//旧版detect，每次匹配都需要读取json文件
	static string detect(const Mat origin_image);
	//detect的重载版本，将目标objects作为参数传入
    static string detect(const Mat origin_image,vector<RelicObj> relic_objs);
	//detect 单个对象，返回匹配结果，第一位是是否匹配，第二位是框占百分比
    static MatchResult detectSingle(const Mat origin_image, RelicObj relic_obj);
	//detect 单个对象，返回匹配结果，第一位是是否匹配，第二位是框占百分比，！！第一个需要先用 loadAndCalcScene计算好在传入
    static MatchResult detectSingle(RelicScn relic_scn, RelicObj relic_obj);
	//载入并计算一个场景图像的特征，并返回
    static RelicScn loadAndCalcScene(Mat origin_image);
	//输入满是json特征文件的目录，返回一个加载好的Obj向量
	static vector<RelicObj> getObjs(string feature_directory);
private:

};
