#pragma once
struct MatchResult
{
	bool ObjectFound;
	double ObjectRatio;
	int mID;
	MatchResult() :ObjectFound(false),ObjectRatio(0.0),mID(0)
	{

	}
};