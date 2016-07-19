#pragma once

#include <websocketpp/config/asio_no_tls.hpp>
#include <websocketpp/server.hpp>
#include <websocketpp/base64/base64.hpp>

#include "stdafx.h"
#include "RelicDetect.hpp"
#include "RelicObj.hpp"
#include "RelicScn.hpp"
#include "RelicAPI.hpp"
#include "JsonCPPHeader\json.h"
#include "..\Console Demo\RelicHelper.h"
#include "..\Console Demo\opencv_serialization.hpp"
#include <boost/timer.hpp>
#include <boost/thread.hpp>
#include <boost/chrono.hpp>

//websocket 
#include <stdio.h>
#include <iostream>
#include <fstream>
#include <sstream>
#include "opencv2/core.hpp"
#include "opencv2/imgproc.hpp"
#include "opencv2/features2d.hpp"
#include "opencv2/highgui.hpp"
#include "opencv2/calib3d.hpp"
#include "opencv2/xfeatures2d.hpp"
#include <queue>
#include "Thread.h"
namespace logging = boost::log;
namespace sinks = boost::log::sinks;
namespace src = boost::log::sources;
namespace expr = boost::log::expressions;
namespace attrs = boost::log::attributes;
namespace keywords = boost::log::keywords;

using namespace cv;
using namespace cv::xfeatures2d;
using namespace std;
using boost::timer;

typedef websocketpp::server<websocketpp::config::asio> server;

using websocketpp::lib::placeholders::_1;
using websocketpp::lib::placeholders::_2;
using websocketpp::lib::bind;
// pull out the type of messages sent by our config
typedef server::message_ptr message_ptr;


#define MaxServerThread 512 //定义了最大数量
class DataItem
{
public:
	websocketpp::connection_hdl hdl;
	RelicScn mImgScn;
	DataItem& operator = (DataItem sDI)
	{
		hdl = sDI.hdl;
		mImgScn = sDI.mImgScn;
		return *this;
	}
};



class DataResult
{
public:
	websocketpp::connection_hdl hdl;
	MatchResult mMatchResult[MaxServerThread];
	int Index;
	DataResult():Index(0) {}
	DataResult& operator=(DataResult sDR)
	{
		hdl = sDR.hdl;
		Index = sDR.Index;
		for (int i = 0; (i < sDR.Index)&&(i<MaxServerThread); i++)
		{
			mMatchResult[i] = sDR.mMatchResult[i];
		}
		return *this;
	}
};
class AppServerThread;
class AppServerThreadManagement
{
public:
	AppServerThreadManagement();
	void Initial(string feature_directory, server* s);
	void RegImg(Mat mMat, websocketpp::connection_hdl hdl);
	void AddResult(MatchResult *pMatchResult, websocketpp::connection_hdl hdl);
	void DeletDataResult(websocketpp::connection_hdl hdl);//计算出错时调用
	void UnInitial();

private:
	void SendResult(websocketpp::connection_hdl hdl, string msg);

private:
	CRITICAL_SECTION m_cs;
	vector<RelicObj> relic_objs;
	vector<AppServerThread*> AppServerThreadPointerVec;
	vector<DataResult> DataResultVec;
	size_t AppServerThreadNum;
	timer t0;
	server* s;
};

class AppServerThread: Thread
{
public:
	AppServerThread();
	~AppServerThread();
	void Initial(void *pParent, RelicObj *pRelicObj,int ID);
	void AddDataItem(DataItem *pDataItem);
	
private:
	bool GetDataItem(DataItem *pDataItem);
	void Task();

private:
	AppServerThreadManagement* m_pParent;
	vector<DataItem> m_DataItemVec;
	RelicObj mRelicObj;
	int m_ID;
};

AppServerThread::AppServerThread()
{
	m_ID = -1;
}

AppServerThread::~AppServerThread()
{
}
void AppServerThread::Initial(void *pParent, RelicObj *pRelicObj,int ID)
{
	if (pParent == NULL) return;
	m_ID = ID;
	this->mRelicObj = *pRelicObj;
	m_pParent = (AppServerThreadManagement*)pParent;
	Create();
}
void AppServerThread::AddDataItem(DataItem *pDataItem)
{
	EnterCriticalSection(&m_section);
	m_DataItemVec.push_back(*pDataItem);
	this->Resume();
	LeaveCriticalSection(&m_section);
	OutputDebugString(L"添加Scn进入分线程成功");
}

bool AppServerThread::GetDataItem(DataItem *pDataItem)
{
	bool status=false;
	EnterCriticalSection(&m_section);
	if (this->m_DataItemVec.empty())
	{
		status = false;
		this->Suspend();
	}
	else
	{
		*pDataItem = *m_DataItemVec.begin();
		m_DataItemVec.erase(m_DataItemVec.begin());
		status = true;
	}
	LeaveCriticalSection(&m_section);
	return status;
}

void AppServerThread::Task()
{
	OutputDebugString(L"进入分线程");
	//cout << m_ID << "进入线程"<<endl;
	DataItem mDataItem;
	if (GetDataItem(&mDataItem))
	{
		MatchResult mMr;
		try
		{
			mMr = RelicAPI::detectSingle(mDataItem.mImgScn, mRelicObj);
		}
		catch (...)
		{
			m_pParent->DeletDataResult(mDataItem.hdl);
			cout << mDataItem.hdl.lock().get() << "匹配出错！" << endl;
			return;
		}
		mMr.mID = m_ID;
		m_pParent->AddResult(&mMr, mDataItem.hdl);
	}
}


AppServerThreadManagement::AppServerThreadManagement()
{
	AppServerThreadNum = 0;
}

void AppServerThreadManagement::Initial(string feature_directory, server* s)
{
	InitializeCriticalSection(&m_cs);
	relic_objs.clear();
	relic_objs = RelicAPI::getObjs(feature_directory);
	if (relic_objs.empty()) return;
	AppServerThread* pThread;
	AppServerThreadNum = 0;
	vector<RelicObj>::iterator it = relic_objs.begin();
	cout << "创建工作线程:"<<endl;
	for (; it != relic_objs.end(); it++)
	{
		pThread = new AppServerThread;
		pThread->Initial(this, &(*it),AppServerThreadNum);
		AppServerThreadPointerVec.push_back(pThread);
		AppServerThreadNum++;
		cout << "线程 " << AppServerThreadNum << " 已启动;" << endl;
		Sleep(100);
	}
	this->s = s;
}

void AppServerThreadManagement::RegImg(Mat mMat, websocketpp::connection_hdl hdl)
{
	t0.restart();
	DataItem mDataItem;
	mDataItem.mImgScn = RelicAPI::loadAndCalcScene(mMat);
	mDataItem.hdl = hdl;

	DataResult mDr;
	mDr.hdl = hdl;
	EnterCriticalSection(&m_cs);
	DataResultVec.push_back(mDr);
	LeaveCriticalSection(&m_cs);
	vector<AppServerThread*>::iterator it;
	for (it = AppServerThreadPointerVec.begin(); it != AppServerThreadPointerVec.end(); it++)
	{
		(*it)->AddDataItem(&mDataItem);
	}
	cout << hdl.lock().get() << ":载入图像耗时：" << t0.elapsed() << " s"<<endl;

	t0.restart();
}

void AppServerThreadManagement::AddResult(MatchResult *pMatchResult, websocketpp::connection_hdl hdl)
{
	MatchResult mMr;
	EnterCriticalSection(&m_cs);
	vector<DataResult>::iterator it;
	bool CompleteFlag = false;
	for (it = DataResultVec.begin(); it != DataResultVec.end();it++)
	{
		if (hdl.lock().get() == it->hdl.lock().get())
		{
			it->mMatchResult[it->Index] = *pMatchResult;
			it->Index++;
			if (it->Index>= AppServerThreadNum)
			{
				///计算最优匹配值
				for (int i = 0; i < it->Index; i++)
				{
					if ((it->mMatchResult[i].ObjectFound == true)&&(it->mMatchResult[i].ObjectRatio>mMr.ObjectRatio))
					{
						mMr = it->mMatchResult[i];
					}
				}
				DataResultVec.erase(it);
				CompleteFlag = true;
			}
			break;
		}
	}
	LeaveCriticalSection(&m_cs);
	if (CompleteFlag==true)
	{
		if (mMr.ObjectFound == true)
		{
			cout << hdl.lock().get() << "匹配用时:" << t0.elapsed() << "s" << endl;
			cout << "检测到的ID：" << mMr.mID << endl;
			SendResult(hdl, boost::lexical_cast<string>(mMr.mID));
		}
		else
		{
			cout << hdl.lock().get() << ":未找到匹配项" << endl;
			cout << hdl.lock().get() << "匹配用时:" << t0.elapsed() << "s" << endl;
			SendResult(hdl, string("null"));
		}
	}
}

void AppServerThreadManagement::DeletDataResult(websocketpp::connection_hdl hdl)
{
	EnterCriticalSection(&m_cs);
	vector<DataResult>::iterator it;
	for (it = DataResultVec.begin(); it != DataResultVec.end(); it++)
	{
		if (hdl.lock().get() == it->hdl.lock().get())
		{
			DataResultVec.erase(it);
			break;
		}
	}
	LeaveCriticalSection(&m_cs);
}

void AppServerThreadManagement::UnInitial()
{
	vector<AppServerThread*>::iterator it;
	for (it = AppServerThreadPointerVec.begin(); it != AppServerThreadPointerVec.end();it++)
	{
		if (*it)
		{
			delete  (*it);
		}
	}
}

void AppServerThreadManagement::SendResult(websocketpp::connection_hdl hdl, string msg)
{
	try {
		s->send(hdl, msg, websocketpp::frame::opcode::text);
	}
	catch (const websocketpp::lib::error_code& e) {
		std::cout << "Echo failed because: " << e
			<< "(" << e.message() << ")" << std::endl;
	}
}
