#include "RelicHelper.h"

RelicHelper::RelicHelper()
{
}

RelicHelper::~RelicHelper()
{
}
int RelicHelper::getFilenames(const std::string& dir, std::vector<std::string>& filenames)
{
	fs::path path(dir);
	if (!fs::exists(path))
	{
		return -1;
	}
	fs::directory_iterator end_iter;
	for (fs::directory_iterator iter(path); iter != end_iter; ++iter)
	{
		if (fs::is_regular_file(iter->status()))
		{
			filenames.push_back(iter->path().string());
		}
		if (fs::is_directory(iter->status()))
		{
			getFilenames(iter->path().string(), filenames);
		}
	}
	return filenames.size();
}

int RelicHelper::getFilenames(fs::path dir, std::vector<fs::path>& filenames)
{
	fs::path path = system_complete(dir);
	if (!fs::exists(path))
	{
		return -1;
	}
	fs::directory_iterator end_iter;
	for (fs::directory_iterator iter(path); iter != end_iter; ++iter)
	{
		if (fs::is_regular_file(iter->status()))
		{
			filenames.push_back(iter->path());
		}
		if (fs::is_directory(iter->status()))
		{
			getFilenames(iter->path(), filenames);
		}
	}
	return filenames.size();
}

string RelicHelper::eraseCinGetlineQuotation(string str)
{
	size_t first_one = str.find_first_of("\"");
	if (first_one != string::npos)
	{
		str.erase(first_one, first_one + 1);
	}
	size_t last_one = str.find_last_of("\"");
	if (last_one != string::npos)
	{
		str.erase(last_one, last_one + 1);
	}
	return str;
}
bool RelicHelper::Base64Encode(const std::string& input, std::string* output) 
{
	typedef boost::archive::iterators::base64_from_binary<boost::archive::iterators::transform_width<std::string::const_iterator, 6, 8> > Base64EncodeIterator;
	std::stringstream result;
	std::copy(Base64EncodeIterator(input.begin()), Base64EncodeIterator(input.end()), std::ostream_iterator<char>(result));
	size_t equal_count = (3 - input.length() % 3) % 3;
	for (size_t i = 0; i < equal_count; i++) {
		result.put('=');
	}
	*output = result.str();
	return output->empty() == false;
}

bool RelicHelper::Base64Decode(const std::string& input, std::string* output) 
{
	typedef boost::archive::iterators::transform_width<boost::archive::iterators::binary_from_base64<std::string::const_iterator>, 8, 6> Base64DecodeIterator;
	std::stringstream result;
	bool bPaded = false;
	int iLength = input.size();
	if (iLength && input[iLength - 1] == '=')
	{
		bPaded = true;
		--iLength;
		if (iLength && input[iLength - 1] == '=')
		{
			--iLength;
		}
	}
	if (iLength == 0)
	{
		return false;
	}

	if (bPaded)
	{
		--iLength;
	}

	try {
		std::copy(Base64DecodeIterator(input.begin()), Base64DecodeIterator(input.begin() + iLength), std::ostream_iterator<char>(result));
	}
	catch (...) {
		return false;
	}

	*output = result.str();
	return output->empty() == false;
}