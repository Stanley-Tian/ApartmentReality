#pragma once
#include "Thread.h"
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

class DataItem
{
public:
	websocketpp::connection_hdl hdl;
	Mat mImg;
};


class AppServerThread: Thread
{
public:
	AppServerThread();
	~AppServerThread();
	void Initial(void *pParent);
	void AddDataItem(DataItem *pDataItem);
	bool GetDataItem(DataItem *pDataItem);
	void Task();
private:
	AppServerThread* m_pParent;
	vector<DataItem> m_DataItemVec;
};

AppServerThread::AppServerThread()
{
}

AppServerThread::~AppServerThread()
{
}
void AppServerThread::Initial(void *pParent)
{
	if (pParent == NULL) return;
	m_pParent = (AppServerThread*)pParent;
	Create();
	Resume();
}
void AppServerThread::AddDataItem(DataItem *pDataItem)
{
	EnterCriticalSection(&m_section);
	m_DataItemVec.push_back(*pDataItem);
	this->Resume();
	LeaveCriticalSection(&m_section);
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
	DataItem mDataItem;
	GetDataItem(&DataItem);






}

class AppServerThreadManagement
{
public:
private:

};