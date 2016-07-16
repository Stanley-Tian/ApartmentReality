#pragma once

#include <boost/archive/iterators/base64_from_binary.hpp>  
#include <boost/archive/iterators/binary_from_base64.hpp>  
#include <boost/archive/iterators/transform_width.hpp>  
#include <string>  
#include <iostream>  
#include <sstream>  
#include <vector>
#include <fstream>
#include <filesystem>
using namespace std;
using namespace std::tr2::sys;  //<filesystem>�������ռ�  

namespace fs = std::tr2::sys;

class RelicHelper
{
public:
	RelicHelper();
	~RelicHelper();
    static bool Base64Encode(const std::string& input, std::string* output);
	static bool Base64Decode(const std::string& input, std::string* output);
	//************************************
	// Method:    getFilenames
	// Returns:   int
	// Parameter: const std::string & dir
	// Parameter: std::vector<std::string> & filenames
	// ˵��:		  ��ȡĳһĿ¼�µ������ļ���������Ϊstring����
	//************************************
	static int getFilenames(const std::string& dir, std::vector<std::string>& filenames);
	//************************************
	// Method:    getFilenames
	// Returns:   int
	// Parameter: fs::path dir
	// Parameter: std::vector<fs::path> & filenames
	// ˵��:		  ��ȡĳһĿ¼�µ������ļ���������Ϊpath����
	//************************************
	static int getFilenames(fs::path dir, std::vector<fs::path>& filenames);
	//************************************
	// Method:    eraseCinGetlineQuotation
	// Returns:   std::string
	// Parameter: string str
	// ˵��:		  ����ȥ��Cin��Getline������ȡ�ַ�����˫����
	//************************************
	static string eraseCinGetlineQuotation(string str);
private:

};
