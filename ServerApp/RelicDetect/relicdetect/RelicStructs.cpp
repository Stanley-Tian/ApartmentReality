#pragma once
struct MatchResult
{
	bool ObjectFound;
	double ObjectRatio;
	MatchResult() :ObjectFound(false),ObjectRatio(0.0)
	{

	}
};