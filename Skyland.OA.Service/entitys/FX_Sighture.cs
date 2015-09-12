using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using IWorkFlow.DataBase;
using System.Web;


namespace BizService
{
    class FX_Sighture : QueryInfo
    {
        //专门存放附件的文件夹
        public string fileDir
        {
            get
            {
                string dir = IWorkFlow.Host.Utility.config.get("FileDir");
                dir = dir.Replace('\\', '/');
                return dir;
            }
        }
        private string _fileDir;

        //显示路径
        public string showPath
        {
            get { return this._showPath; }
            set { this._showPath = value; }
        }
        private string _showPath;

        //保存路径
        public string savePath
        {
            get { return this._savePath; }
            set { this._savePath = value; }
        }
        private string _savePath;

        //服务端连接
        public string webUrl
        {
            get
            {
                //手写签批URL
                string server = HttpContext.Current.Request.ServerVariables["HTTP_HOST"];
                string url = "http://" + server + "/script/framePlugin/frame-sighture/B_OA_CommonSightureOperation.ashx";
                return url;
            }
        }
        private string _webUrl;

        //保存图片的路径
        public string saveImageDir
        {
            get
            {
                string rootPath = HttpContext.Current.Server.MapPath("/");//系统路径
                string dir = IWorkFlow.Host.Utility.config.get("FileDir");
                dir = rootPath + dir + "sighture";
                //判断路径是否存在，若不存在自动生成文件夹路径
                BizService.Common.ComFileOperate.CreateDirectory(dir);
                return dir;
            }
        }
        private string _saveImageDir;

        //文件夹名称
        public string documentName
        {
            get
            {
                return "sighture";
            }
        }

        public string userid
        {
            get { return this._userid; }
            set { this._userid = value; }
        }
        private string _userid;
    }
}
