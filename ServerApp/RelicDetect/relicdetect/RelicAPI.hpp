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
	//输入满是json特征文件的目录，返回一个加载好的Obj向量
	static vector<RelicObj> getObjs(string feature_directory);
private:

};
