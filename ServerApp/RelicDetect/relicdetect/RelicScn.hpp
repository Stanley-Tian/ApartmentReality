#pragma once
#ifndef RELIC
#define RELIC
#endif 
#include "RelicDetect.hpp"
#include "RelicObj.hpp"
#include "RelicStructs.cpp"
class RelicScn :public RelicDetect
{
public:
	//************************************
	// Method:    Match_an_Obj
	// Returns:   bool
	// Parameter: RelicObj obj	待匹配的对象，需要经过
	// 说明:		  匹配一个目标
	//************************************
	MatchResult RelicScn::Match_an_Obj(RelicObj obj);
	//************************************
	// Method:    Draw_Obj
	// Returns:   void
	// 说明:		  绘制匹配成功的目标对象
	//************************************
	void RelicScn::Draw_Obj();
	Mat Get_Match_Result();
private:
	std::vector<Point2f> corners;
};

