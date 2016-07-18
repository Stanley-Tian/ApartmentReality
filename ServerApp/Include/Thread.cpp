#include "Thread.h"
#include <process.h>
#include "ArWatch.h"
int Mod(int i,int j)
{
	int tmp=i%j;
	if (tmp==j)
	{
		tmp=0;
	}
	return tmp; 
}

///<class_info>
//==============================================================================
//��������:���߳���,���������������� 
//�̳߳ع���:
//1:�����󴴽��̲߳�ִ��ThreadMain,�߳���ThreadMain�˳�ʱ����,
//2:�̵߳ĺ�����ThreadMain�������и�������߳��Ƿ��˳������,
//  �߳�ִ�к�����ֶ�����͸����߳� ����������,
//  ������������������ʵ�ֲ�ͬ����
//  ������������ֵ=0,�߳��˳�,������ֵ��Ϊ-1,������
//3:�߳��������ظ�ִ������������,������������жϴ���
//��������������������
//���߳�            �� <-�������������,��������
//�ĩ�����������������
//���߳�������      �� <-�̴߳���Create��ʼִ��,��������Task����Ϣ,�������˳����߳�����
//�ĩ������Щ���������
//��������        �� <-�߳�ִ����,ѭ��ִ��������������ִ�д���
//�ĩ������ة��������� 
//���жϴ���        �� <-ȷ���������Ƿ�����˳�,ForceEnd�ж�0ǿ���˳�,m_times�ж�3�����˳�
//��������������������       Suspend�ж�2����ȴ�,������ѭ����ͣ
//class Thread//3.0
//{
//�๦��
//�̼߳���ID :�̶߳���������+1,�������ı�
DWORD Thread::m_nThreadID = 0;//2.0
	//����ʱ������Դ
Thread::Thread(HANDLE  hParent)//2.0
{
	::InitializeCriticalSection(&m_section);
	m_bExit = false;
	m_hEvt = 0;	
	m_hThread = INVALID_HANDLE_VALUE;
	m_times = -1;
	m_hParent = hParent;//2.0
	m_nThreadID = m_nThreadID + 1;//2.0
	m_waitTime = 0;
	m_taskTime = 0;
	m_includeTaskTime = false;//3.1
	m_ThStatus = TH_EXIT;
}
//����ʱ���ò����ȴ��߳�����������,��Ҫ�ȴ�1��
Thread::~Thread(void)
{
	//Destroy();
	ForceEnd();
	Sleep(1000);//�ȴ��߳��������˳��������߳�
	if (m_hEvt != 0)
	{
		::CloseHandle(m_hEvt);
	}
	m_ThStatus = TH_EXIT;
	::DeleteCriticalSection(&m_section);
}
//�̹߳���
//�߳������� :�̴߳�����ʼִ��,��������Task����Ϣ,�������˳����߳�����
void Thread::ThreadMain(void* thisObj)
{
	OutputDebugString(L"<Thread::ThreadMain()>\n");
	Thread* pThisObj = (Thread*)thisObj;
	while (!pThisObj->m_bExit && pThisObj->m_times != 0)//�ж�0:�˳�
	{
		double taskTime = 0;//3.1
		//����������
		pThisObj->m_ThStatus = Thread::TH_SUSPEND;
		::WaitForSingleObject(pThisObj->m_hEvt, INFINITE);//�ж�2:����
		pThisObj->m_ThStatus = Thread::TH_RUNNING;
		//::EnterCriticalSection(&pThisObj->m_section);

		if (pThisObj->m_includeTaskTime)//3.1
		{
			ArWatch arWatch;
			arWatch.SetData(&taskTime);
			try
			{
				pThisObj->Task();//3.0
			}
			catch (...)
			{
				LeaveCriticalSection(&(pThisObj->m_section));
				OutputDebugString(L"<\\Thread::task() fail>\n");
			}
			
		}
		else
		{
			try
			{
				pThisObj->Task();//3.0
			}
			catch (...)
			{
				LeaveCriticalSection(&(pThisObj->m_section));
				OutputDebugString(L"<\\Thread::task() fail>\n");
			}
		}
		//::LeaveCriticalSection(&pThisObj->m_section);

		if (pThisObj->m_times>0)//�ж�3�����˳�
		{
			pThisObj->m_times--;
		}
		pThisObj->m_taskTime = taskTime;
		Sleep(MAX(pThisObj->m_waitTime - taskTime, 0));//3.1
	}
	pThisObj->m_ThStatus = Thread::TH_EXIT;
	OutputDebugString(L"<\\Thread::ThreadMain()>\n");
}
//�����߳�
void  Thread::Create(long times, long waiteTime, bool includeTaskTime)//2.0
{
	if (m_hEvt == 0)
	{
		m_hEvt = ::CreateEvent(0, true, false, 0);
	}
	if (m_hThread == 0)
	{
		m_times = times;
		m_bExit = false;
		m_waitTime = MAX(waiteTime, 0);
		m_includeTaskTime = includeTaskTime;//3.1
		m_hThread = (HANDLE)_beginthread(ThreadMain, 0, this);
		if (m_hThread != 0) m_ThStatus = TH_AVIALABLE;
		OutputDebugString(L"<Thread::Create()>\n");
	}
}
//����ִ�й�����߳�
void  Thread::Resume(void)//�ж�1,2ȡ��:�ͷ�
{
	if (m_hEvt != 0)
	{
		::SetEvent(m_hEvt);
	}
	OutputDebugString(L"<Thread::Resume()>\n");
}
//�����߳�
void  Thread::Suspend(void)//�ж�2:����
{
	if (m_hEvt != 0)
	{
		::ResetEvent(m_hEvt);
	}
	OutputDebugString(L"<Thread::Suspend()>\n");
}
//���ò���ʹ�������˳��������߳�
void  Thread::Destroy(void)//�ж�0:�˳�
{
	m_bExit = true;
	Sleep(m_waitTime+100);
	m_ThStatus = TH_EXIT;
	m_hThread = INVALID_HANDLE_VALUE;
	OutputDebugString(L"<Thread::Destroy()>\n");
}
//����WindowsAPIǿ�ƽ�����ǰ�߳�
void Thread::ForceEnd(void)
{
	DWORD exitCode;
	if (GetExitCodeThread(m_hThread, &exitCode))
	{
		TerminateThread(m_hThread, exitCode);
	}
	m_hThread = 0;
	Destroy();
	OutputDebugString(L"<Thread::ForceEnd()>\n");
}
//������
//��������,���������ش˺���,��̬ThreadMain����������������Task()
void  Thread::Task(void)
{
	//::EnterCriticalSection(&m_section);
	//::LeaveCriticalSection(&m_section);
	OutputDebugString(L"<Thread::Task()>\n");
}
//};
//==============================================================================
///</class_info>



///<class_info>
//==============================================================================
//��������:�������߳���,�ɶ�̬���������
//�̳߳ع���:
//1:�����󴴽��̲߳�ִ��ThreadMain,�߳���ThreadMain�˳�ʱ����,
//2:�̵߳ĺ�����ThreadMain�������и�������߳��Ƿ��˳������,
//  �߳�ִ�к�����ֶ�����͸����߳� ����������,
//  ��������������ʱ,�̹߳���,�ȴ��µ� ����������
//  ������������ֵ=0,�߳��˳�,������ֵ��Ϊ-1,������
//3:�߳��������ظ�ִ������������,������������жϴ���
//��������������������
//���߳�            �� <-�������������,��������
//�ĩ�����������������
//���߳�������      �� <-�̴߳���Create��ʼִ��,��������Task����Ϣ,�������˳����߳�����
//�ĩ������Щ���������
//������  ������    �� <-�߳�ִ����,��һ������ɺ�,������RegTask�ı�,
//�ĩ������ة���������       ����FreeTask�ͷ�����,�ж�1ж�غ���,������ѭ���ȴ��º���
//���жϴ���        �� <-ȷ���������Ƿ�����˳�,ForceEnd�ж�0ǿ���˳�,m_times�ж�3�����˳�
//��������������������       Suspend�ж�2����ȴ�,������ѭ����ͣ
//class TaskThread :public Thread
//{
//�๦��
TaskThread::TaskThread(HANDLE  hParent)//2.0
{
	p_Task = 0;
	p_Para = 0;//ע��ʱ����delete,���⸸�߳����ڴ�й©
}
//����ʱ���ò����ȴ��߳�����������,��Ҫ�ȴ�1��
TaskThread::~TaskThread()
{
	ForceEnd();
}
//�̹߳���
//�߳������� :�̴߳�����ʼִ��,��������Task����Ϣ,�������˳����߳�����
void TaskThread::ThreadMain(void* thisObj)
{
	OutputDebugString(L"<TaskThread::ThreadMain()>\n");
	TaskThread* pThisObj = (TaskThread*)thisObj;
	while (!pThisObj->m_bExit && pThisObj->m_times != 0)//�ж�0:�˳�
	{
		double taskTime = 0;//3.1
		//����������
		if (pThisObj->p_Task)//�ж�1:�ͷ�
		{
			pThisObj->m_ThStatus = Thread::TH_SUSPEND;
			::WaitForSingleObject(pThisObj->m_hEvt, INFINITE);//�ж�2:����
			pThisObj->m_ThStatus = Thread::TH_RUNNING;

			//::EnterCriticalSection(&pThisObj->m_section);
			if (pThisObj->m_includeTaskTime)//3.1
			{
				ArWatch arWatch;
				arWatch.SetData(&taskTime);
				pThisObj->p_Task(pThisObj->p_Para);//3.0
			}
			else
			{
				pThisObj->p_Task(pThisObj->p_Para);//3.0
			}
			//::LeaveCriticalSection(&pThisObj->m_section);

		}
		else
		{
			pThisObj->m_ThStatus = Thread::TH_AVIALABLE;
			::ResetEvent(pThisObj->m_hEvt);
			::WaitForSingleObject(pThisObj->m_hEvt, INFINITE);//�ж�2:����
		}
		if (pThisObj->m_times>0)//�ж�3�����˳�
		{
			pThisObj->m_times--;
		}
		Sleep(MAX(pThisObj->m_waitTime - taskTime, 0));//3.1
	}
	pThisObj->p_Task = 0;
	pThisObj->m_ThStatus = Thread::TH_EXIT;
	OutputDebugString(L"<\\TaskThread::ThreadMain()>\n");
}
//�����߳�
void TaskThread::Create(int times, long waiteTime, bool includeTaskTime)
{
	if (m_hEvt == 0)
	{
		m_hEvt = ::CreateEvent(0, true, false, 0);
	}
	if (m_hThread == 0)
	{
		m_times = times;
		m_waitTime = MAX(waiteTime, 0);
		m_includeTaskTime = includeTaskTime;//3.1
		m_hThread = (HANDLE)_beginthread(ThreadMain, 0, this);
		if (m_hThread != 0) m_ThStatus = TH_AVIALABLE;
		OutputDebugString(L"<TaskThread::Create()>\n");
	}
}
//������
//ע��������//ֻ��ѭ���м���Ч
void  TaskThread::FreeTask(void)
{
	::EnterCriticalSection(&m_section);
	p_Task = 0;
	::LeaveCriticalSection(&m_section);
	OutputDebugString(L"<TaskThread::FreeTask()>\n");
}
//ע��������
void  TaskThread::RegTask(ThreadTaskFun pFunc, void* pPara)
{
	::EnterCriticalSection(&m_section);
	p_Task = pFunc;
	p_Para = pPara;//�ڴ��ɸ��̹߳���
	::LeaveCriticalSection(&m_section);
	OutputDebugString(L"<TaskThread::RegTask()>\n");
}
//};
//==============================================================================
///</class_info>


///<class_info>
//==============================================================================
//��������:���������߳���,�ɶ�̬�������������
// 1:����̳߳ع���,�ڶ���˽�д洢�ռ��������������
// 2:�������������������ȡ����
// 3:�������������ڲ������̷߳���������ָ���̵߳��������,
//    �����������̺��߳����еĸ����̷߳���������
// 4:��������е�һ�������ִ�к���ָ��,�ͺ�������ָ��,
//    ����Ϊ���⺯�������ռ���������������,���������ڹ̶����ȵ�������
//��������������������
//���߳�            �� <-�������������,��������
//�ĩ�����������������
//���߳�������      �� <-�̴߳���Create��ʼִ��,��������Task����Ϣ,�������˳����߳�����
//�ĩ������Щ���������
//��  �K  �� �K     �� <-ѭ������,�̶�����,ѭ���洢
//�������񩦿�����  �� 
//������0 ������0   �� <-����ͷ�߳�ִ�к�����,��DelHeadTaskɾ��
//������1 ������1   �� <-���еȴ��е�����
//��  :   ��  :     ��
//������n ������n   �� <-����β������AddTailTask����.
//��  :   ��  :     ��
//�������񩦿ղ���  ��
//��  �L  �� �L     �� <-ѭ������,�̶�����,ѭ���洢
//�ĩ������ة���������       
//���жϴ���        �� <-ȷ���������Ƿ�����˳�,ForceEnd�ж�0ǿ���˳�,m_times�ж�3�����˳�
//��������������������       Suspend�ж�2����ȴ�,������ѭ����ͣ.
//                           ��TaskList����Ϊ��,�ж�1ж�غ���,������ѭ���ȴ��º���
//class TaskThreadEx :public TaskThread
//{
//�๦��
TaskThreadEx::TaskThreadEx(HANDLE  hParent)
{
	p_TaskListHead = 0;
	p_TaskListTail = p_TaskListHead;
	m_TaskNum = 0;
	//p_Task = 0;
}
//�̹߳���
//�߳������� :�̴߳�����ʼִ��,��������Task����Ϣ,�������˳����߳�����
void TaskThreadEx::ThreadMain(void* thisObj)
{
	OutputDebugString(L"<TaskThreadEx::ThreadMain()>\n");
	TaskThreadEx* pThisObj = (TaskThreadEx*)thisObj;
	while (!pThisObj->m_bExit && pThisObj->m_times != 0)//�ж�0:�˳�
	{
		double taskTime = 0;//3.1
		//�����ȡ����
		//�ж���������Ƿ�Ϊ��
		if (pThisObj->p_TaskListHead == pThisObj->p_TaskListTail - 1 || pThisObj->m_TaskNum <= 0)
		{
			pThisObj->p_Task = 0;//����Ϊ��,��Ϊ�ж�1
			pThisObj->p_Para = 0;
		}
		else
		{
			pThisObj->RegTask(pThisObj->m_TastList[pThisObj->p_TaskListHead].pFun,
				pThisObj->m_TastList[pThisObj->p_TaskListHead].pPara);
		}
		//����������
		pThisObj->m_ThStatus = Thread::TH_SUSPEND;
		::WaitForSingleObject(pThisObj->m_hEvt, INFINITE);//�ж�2:����
		if (pThisObj->p_Task)//�ж�1:�ͷ�
		{
			pThisObj->m_ThStatus = Thread::TH_RUNNING;
			OutputDebugString(L"ThreadMain RunTask\n");

			//::EnterCriticalSection(&pThisObj->m_section);
			if (pThisObj->m_includeTaskTime)//3.1
			{
				ArWatch arWatch;
				arWatch.SetData(&taskTime);
				pThisObj->p_Task(pThisObj->p_Para);//3.0
			}
			else
			{
				pThisObj->p_Task(pThisObj->p_Para);//3.0
			}
			//::LeaveCriticalSection(&pThisObj->m_section);

			//������ɺ���
			pThisObj->p_Task = 0;
			pThisObj->p_Para = 0;
			pThisObj->DelHeadTask();//���豣����ɾ����ͷ����ĺ���
		}
		else
		{
			pThisObj->m_ThStatus = Thread::TH_AVIALABLE;
			//Ϊ���������ȡ����,��ǰ����Ϊ��ʱ,ɨ���������ͷ,��������
			//::ResetEvent(pThisObj->m_hEvt);
			//::WaitForSingleObject(pThisObj->m_hEvt, INFINITE);//�ж�2:����
		}
		if (pThisObj->m_times>0)//�ж�3�����˳�
		{
			pThisObj->m_times--;
		}
		Sleep(MAX(pThisObj->m_waitTime - taskTime, 0));//3.1
	}
	pThisObj->p_Task = 0;
	pThisObj->m_ThStatus = Thread::TH_EXIT;
	OutputDebugString(L"<\\TaskThreadEx::ThreadMain()>\n");
}
//�����߳�
void TaskThreadEx::Create(int times, long waiteTime, bool includeTaskTime)
{
	if (m_hEvt == 0)
	{
		m_hEvt = ::CreateEvent(0, true, false, 0);
	}
	if (m_hThread == 0)
	{
		m_times = times;
		m_waitTime = MAX(waiteTime, 0);
		m_includeTaskTime = includeTaskTime;//3.1
		m_hThread = (HANDLE)_beginthread(ThreadMain, 0, this);
		if (m_hThread != 0) m_ThStatus = TH_AVIALABLE;
		OutputDebugString(L"<TaskThreadEx::Create()>\n");
	}
}
//ǿ��ɾ���߳�,����ǰ����ж��,�����߳�,�������µ��߳�ָ��
void  TaskThreadEx::Recover(void)
{
	ForceEnd();
	Sleep(1000);
	Destroy();
	if (m_hEvt != 0)
	{
		::CloseHandle(m_hEvt);
		m_hEvt = 0;
	}
	::DeleteCriticalSection(&m_section);
	::InitializeCriticalSection(&m_section);
	DelHeadTask();
	Create();
	Resume();
	OutputDebugString(L"<TaskThreadEx::Recover()>\n");
}
//������
bool TaskThreadEx::AddTailTask(ThreadTask _Task)
{
	OutputDebugString(L"<AddTailTask()>\n");
	_Task.status = ThreadTask::enFree;
	//���������
	if (p_TaskListHead == Mod((p_TaskListTail + 1), TASKNUM) || m_TaskNum >= TASKNUM)
	{
		OutputDebugString(L"TaskListFull\n");
		return false;
	}
	int tmpTail = 0;
	wchar_t debugStr[64] = { 0 };
	wsprintf(debugStr, L"TaskList:Head=%d,Tail=%d,Num=%d\n", p_TaskListHead, p_TaskListTail, m_TaskNum);
	OutputDebugString(debugStr);
	::EnterCriticalSection(&m_section);
	//taskCritalSection.Enter();
	memcpy(m_TastList + p_TaskListTail, &_Task, sizeof(ThreadTask));
	p_TaskListTail = Mod(p_TaskListTail + 1, TASKNUM);
	m_TaskNum++;
	//taskCritalSection.Leave();
	::LeaveCriticalSection(&m_section);
	OutputDebugString(L"TaskListAdd\n");
	wsprintf(debugStr, L"TaskList:Head=%d,Tail=%d,Num=%d\n", p_TaskListHead, p_TaskListTail, m_TaskNum);
	OutputDebugString(debugStr);
	OutputDebugString(L"<\\AddTailTask()>\n");
	Resume();
	return true;
}
bool TaskThreadEx::DelHeadTask()
{
	OutputDebugString(L"<DelHeadTask()>\n");
	//���������
	if (p_TaskListHead == p_TaskListTail - 1)
	{
		OutputDebugString(L"TaskListEmpty\n");
		return false;
	}
	if (m_TastList[p_TaskListHead].status == ThreadTask::enBusy)
	{
		OutputDebugString(L"TaskListHead is Busy\n");
		return false;
	}
	if (m_TastList[p_TaskListHead].status == ThreadTask::enNull)
	{
		OutputDebugString(L"TaskListHead is Null\n");//��ͷ�����Ѿ�ִ���겢�ͷ�
	}
	wchar_t debugStr[64] = { 0 };
	wsprintf(debugStr, L"TaskList:Head=%d,Tail=%d,Num=%d\n", p_TaskListHead, p_TaskListTail, m_TaskNum);
	OutputDebugString(debugStr);
	//taskCritalSection.Enter();
	::EnterCriticalSection(&m_section);
	p_TaskListHead = Mod((p_TaskListHead + 1), TASKNUM);
	m_TaskNum--;
	//taskCritalSection.Leave();
	::LeaveCriticalSection(&m_section);
	OutputDebugString(L"TaskListHead is Delleted\n");
	wsprintf(debugStr, L"TaskList:Head=%d,Tail=%d,Num=%d\n", p_TaskListHead, p_TaskListTail, m_TaskNum);
	OutputDebugString(debugStr);
	OutputDebugString(L"<\\DelHeadTask()>\n");
	return true;
}
//};
//==============================================================================
///</class_info>