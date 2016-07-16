#pragma once
#include "RelicDetect.hpp"
#include "RelicObj.hpp"
#include "RelicScn.hpp"
#include "..\Console Demo\RelicHelper.h"
#include <string>
#include <filesystem>
namespace fs = std::tr2::sys;
using namespace std;
class RelicAPI
{
public:
	RelicAPI();
	~RelicAPI();
	
	static string detect(const Mat origin_image);
private:

};
