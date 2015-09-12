using System;
using System.Collections.Generic;
using System.Data;   
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace BizService
{
    public class ComBase
    {
        /// <summary>
        /// 服务器根目录
        /// </summary>
        /// 
        static string rootPath;

        public static string SerRootPath
        {
            get
            {
                if (rootPath == null)
                {
                    rootPath = System.AppDomain.CurrentDomain.BaseDirectory;
                }
                return rootPath;
            }
        }
        //public static string SerRootPath
        //{
        //    get { return System.AppDomain.CurrentDomain.SetupInformation.ApplicationBase; }
        //}

        #region 写日志

        private static object writeLogLock = new object();
        /// <summary>
        /// 写日志
        /// </summary>
        /// <param name="msg">日志内容</param>
        public static void Logger(string msg)
        {
            System.IO.StreamWriter writer = null;
            try
            {
                lock (writeLogLock)
                {
                    string logfileName = string.Format("{0}.txt", DateTime.Now.ToString("yyyy_MM_dd"));


                    string logFolderPath = string.Format("{0}log\\{1}\\{2}\\", SerRootPath, DateTime.Now.Year, DateTime.Now.Month);
                    string logFilePath = logFolderPath + logfileName;
                    if (!System.IO.Directory.Exists(logFolderPath))
                        System.IO.Directory.CreateDirectory(logFolderPath);

                    System.IO.FileInfo file = new System.IO.FileInfo(logFilePath);
                    writer = new System.IO.StreamWriter(file.FullName, true);//文件不存在就创建,true表示追加
                    writer.WriteLine("--------------------------------------------------------------------------------------");
                    writer.WriteLine("时间：" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
                    writer.WriteLine("内容：");
                    writer.WriteLine(msg);
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            finally
            {
                if (writer != null)
                    writer.Close();
            }
        }

        /// <summary>
        /// 写日志
        /// </summary>
        /// <param name="ex"></param>
        public static void Logger(Exception ex)
        {
            StringBuilder sb = new StringBuilder();
            sb.Append("异常信息：" + ex.ToString());
            sb.AppendLine();
            sb.Append("异常信息：" + ex.Message.ToString());
            sb.AppendLine();
            sb.Append("异常堆栈：" + ex.StackTrace.ToString());
            Logger(sb.ToString());
        }

        #endregion


    }

    /// <summary>
    /// 执行时长日志记录
    /// </summary>
    public class ComStopwatchLogger
    {
        System.Diagnostics.Stopwatch stopwatch = new System.Diagnostics.Stopwatch();
        string loggerFlag = string.Empty;//记录标记（用于在日志中区分，易于查找）
        DateTime? startDateTime = null;//执行开始时间
        DateTime? endDateTime = null;//执行结束时间
        //是否记录
        private bool isLog
        {
            get
            {
                if (_isLog == null)
                    _isLog = ComAppSetting.IsStopWatchLog;
                return _isLog.Value;
            }
        }
        bool? _isLog = ComAppSetting.IsStopWatchLog;

        /// <summary>
        /// 开始计时
        /// </summary>
        /// <param name="loggerFlag"></param>
        public void Start(string loggerFlag)
        {
            if (!isLog)
                return;
            startDateTime = DateTime.Now;
            this.loggerFlag = loggerFlag;
            stopwatch.Start();
        }

        /// <summary>
        /// 开始计时
        /// </summary>
        /// <param name="loggerFlag"></param>
        public void Start()
        {
            if (!isLog)
                return;
            startDateTime = DateTime.Now;
            stopwatch.Start();
        }

        /// <summary>
        /// 重新开始计时
        /// </summary>
        /// <param name="loggerFlag"></param>
        public void ReStart(string loggerFlag)
        {
            if (!isLog)
                return;
            startDateTime = DateTime.Now;
            this.loggerFlag = loggerFlag;
            stopwatch.Restart();
        }

        /// <summary>
        /// 停止计时，并记录日志
        /// </summary>
        public void Stop()
        {
            if (!isLog)
                return;
            endDateTime = DateTime.Now;
            stopwatch.Stop();
            logger();
        }

        /// <summary>
        ///记录日志
        /// </summary>
        private void logger()
        {
            System.IO.StreamWriter writer = null;
            try
            {
                lock (this)
                {
                    string logfileName = string.Format("{0}.txt", DateTime.Now.ToString("yyyy_MM_dd"));
                    string logFolderPath = string.Format("{0}log\\StopwatchLogger\\{1}\\{2}\\", ComBase.SerRootPath, DateTime.Now.Year, DateTime.Now.Month);
                    string logFilePath = logFolderPath + logfileName;
                    if (!System.IO.Directory.Exists(logFolderPath))
                        System.IO.Directory.CreateDirectory(logFolderPath);

                    System.IO.FileInfo file = new System.IO.FileInfo(logFilePath);
                    writer = new System.IO.StreamWriter(file.FullName, true);//文件不存在就创建,true表示追加
                    TimeSpan timespan = stopwatch.Elapsed; //  获取当前实例测量得出的总时间搜索
                    writer.WriteLine("-------------------------------------");
                    writer.WriteLine("标记：" + loggerFlag);
                    writer.WriteLine("开始时间：" + startDateTime.Value.ToString("yyyy-MM-dd HH:mm:ss:fff"));
                    writer.WriteLine("结束时间：" + endDateTime.Value.ToString("yyyy-MM-dd HH:mm:ss:fff"));
                    writer.WriteLine(string.Format("用时：{0}秒", timespan.TotalSeconds.ToString("f6"))); // 
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            finally
            {
                if (writer != null)
                    writer.Close();
            }
        }
    }

    /// <summary>
    /// appSettings读取
    /// </summary>
    public class ComAppSetting
    {
        /// <summary>
        /// 是否记录执行时长日志记录
        /// </summary>
        public static bool IsStopWatchLog
        {
            get
            {
                string val = GetKey("IsStopwatchLog");
                return val != null && val.ToUpper() == "TRUE";
            }
        }

        /// <summary>
        /// 获取key对应的value值
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        public static string GetKey(string key)
        {
            return System.Configuration.ConfigurationManager.AppSettings[key];
        }
    }

}
