using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using IWorkFlow.DataBase;
using System.Web;

namespace IWorkFlow.ORM
{
    [Serializable]
    [DataTableInfo("B_OA_ReceiveDoc", "id")]
    public class B_OA_ReceiveDoc : QueryInfo
    {
        #region Model
        private long _id;
        private string _caseid;
        private string _wjbh;
        private DateTime? _swrq;
        private string _lwdw;
        private string _wjbt;
        private string _lwyq;
        private string _lwbh;
        private string _jjcd;
        private int? _sfgd = 0;
        private string _cs;
        private string _nbyj;
        /// <summary>
        /// id
        /// </summary>
        /// 
        [DataField("ID", "B_OA_ReceiveDoc", false)]
        public long ID
        {
            set { _id = value; }
            get { return _id; }
        }
        /// <summary>
        /// 业务流ID
        /// </summary>
        /// 
        [DataField("caseid", "B_OA_ReceiveDoc")]
        public string caseid
        {
            set { _caseid = value; }
            get { return _caseid; }
        }
        /// <summary>
        /// 文件编号
        /// </summary>
        /// 
        [DataField("wjbh", "B_OA_ReceiveDoc")]
        public string wjbh
        {
            set { _wjbh = value; }
            get { return _wjbh; }
        }
        /// <summary>
        /// 收文日期
        /// </summary>
        /// 
        [DataField("swrq", "B_OA_ReceiveDoc")]
        public DateTime? swrq
        {
            set { _swrq = value; }
            get { return _swrq; }
        }
        
        /// <summary>
        /// 来文单位
        /// </summary>
        /// 
        [DataField("lwdw", "B_OA_ReceiveDoc")]
        public string lwdw
        {
            set { _lwdw = value; }
            get { return _lwdw; }
        }
        /// <summary>
        /// 文件标题
        /// </summary>
        /// 
        [DataField("wjbt", "B_OA_ReceiveDoc")]
        public string wjbt
        {
            set { _wjbt = value; }
            get { return _wjbt; }
        }
        /// <summary>
        /// 来文要求
        /// </summary>
        /// 
        [DataField("lwyq", "B_OA_ReceiveDoc")]
        public string lwyq
        {
            set { _lwyq = value; }
            get { return _lwyq; }
        }
        /// <summary>
        /// 来文编号
        /// </summary>
        /// 
        [DataField("lwbh", "B_OA_ReceiveDoc")]
        public string lwbh
        {
            set { _lwbh = value; }
            get { return _lwbh; }
        }
        /// <summary>
        /// 紧急程度
        /// </summary>
        /// 
        [DataField("jjcd", "B_OA_ReceiveDoc")]
        public string jjcd
        {
            set { _jjcd = value; }
            get { return _jjcd; }
        }
        /// <summary>
        /// 是否归档，默认0不归档
        /// </summary>
        /// 
        [DataField("sfgd", "B_OA_ReceiveDoc")]
        public int? sfgd
        {
            set { _sfgd = value; }
            get { return _sfgd; }
        }
        /// <summary>
        /// 抄送（此文送）
        /// </summary>
        /// 
        [DataField("cs", "B_OA_ReceiveDoc")]
        public string cs
        {
            set { _cs = value; }
            get { return _cs; }
        }
        /// <summary>
        ///拟办意见
        /// </summary>
        /// 
        [DataField("nbyj", "B_OA_ReceiveDoc")]
        public string nbyj
        {
            set { _nbyj = value; }
            get { return _nbyj; }
        }

        /// <summary>
        ///局办公室
        /// </summary>
        /// 
        [DataField("jbgs", "B_OA_ReceiveDoc")]
        public string jbgs
        {
            set { _jbgs = value; }
            get { return _jbgs; }
        }
        private string _jbgs;

        /// <summary>
        ///领导批示
        /// </summary>
        /// 
        [DataField("ldps", "B_OA_ReceiveDoc")]
        public string ldps
        {
            set { _ldps = value; }
            get { return _ldps; }
        }
        private string _ldps;

        /// <summary>
        /// 创建时间
        /// </summary>
        [DataField("cjsj", "B_OA_ReceiveDoc")]
        public string cjsj
        {
            set { _cjsj = value; }
            get
            {
                DateTime dateTime = DateTime.Now;
                string t = dateTime.ToLongDateString() + " " + dateTime.Hour + "时" + dateTime.Minute + "分" + dateTime.Second + "秒";
                return _cjsj == null ? t : _cjsj;
            }
        }
        private string _cjsj;


        /// <summary>
        /// 密级
        /// </summary>
        [DataField("mj", "B_OA_ReceiveDoc")]
        public string mj
        {
            set { _mj = value; }
            get { return _mj; }
        }
        private string _mj;

        /// <summary>
        /// 办理期限
        /// </summary>
        [DataField("isOverTimeRemind", "B_OA_ReceiveDoc")]
        public string isOverTimeRemind
        {
            set { _isOverTimeRemind = value; }
            get { return _isOverTimeRemind; }
        }
        private string _isOverTimeRemind;

        /// <summary>
        /// 办结提醒日期
        /// </summary>
        [DataField("overTimeRemindDate", "B_OA_ReceiveDoc")]
        public string overTimeRemindDate
        {
            set { _overTimeRemindDate = value; }
            get { return _overTimeRemindDate; }
        }
        private string _overTimeRemindDate;

        /// <summary>
        /// 办理期限
        /// </summary>
        [DataField("manageDate", "B_OA_ReceiveDoc")]
        public string manageDate
        {
            set { _manageDate = value; }
            get { return _manageDate; }
        }
        private string _manageDate;


        /// <summary>
        /// 来文类型
        /// </summary>
        [DataField("lwlx", "B_OA_ReceiveDoc")]
        public string lwlx
        {
            set { _lwlx = value; }
            get { return _lwlx; }
        }
        private string _lwlx;

        /// <summary>
        /// 打字员ID
        /// </summary>
        [DataField("recordManId", "B_OA_ReceiveDoc")]
        public string recordManId
        {
            set { _recordManId = value; }
            get { return _recordManId; }
        }
        private string _recordManId;


        /// <summary>
        /// 打字员名字
        /// </summary>
        [DataField("recordManName", "B_OA_ReceiveDoc")]
        public string recordManName
        {
            set { _recordManName = value; }
            get { return _recordManName; }
        }
        private string _recordManName;

        /// <summary>
        /// 收文附件
        /// </summary>
        [DataField("attachment", "B_OA_ReceiveDoc")]
        public string attachment
        {
            set { _attachment = value; }
            get { return _attachment; }
        }
        private string _attachment;

        /// <summary>
        /// 来文类型ID用于文档中心归类
        /// </summary>
        [DataField("lwlxId", "B_OA_ReceiveDoc")]
        public string lwlxId
        {
            set { _lwlxId = value; }
            get { return _lwlxId; }
        }
        private string _lwlxId;


        /// <summary>
        ///签阅人
        /// </summary>
        [DataField("sightureManName", "B_OA_ReceiveDoc")]
        public string sightureManName
        {
            set { _sightureManName = value; }
            get { return _sightureManName; }
        }
        private string _sightureManName;

        /// <summary>
        /// 签阅人ID
        /// </summary>
        [DataField("sightrureManId", "B_OA_ReceiveDoc")]
        public string sightrureManId
        {
            set { _sightrureManId = value; }
            get { return _sightrureManId; }
        }
        private string _sightrureManId;

        /// <summary>
        /// webUrl
        /// </summary>
        //public string webUrl
        //{
        //    get
        //    {  //手写签批URL
        //        //string server = HttpContext.Current.Request.ServerVariables["HTTP_HOST"];
        //        //string url = "http://" + server + "/Forms/B_OA_ReceiveDoc/ReceiveDocSightureOperation.ashx";
        //        //return url;
        //        string server = HttpContext.Current.Request.ServerVariables["HTTP_HOST"];
        //        string url = "SightureOperation.data?action=";
        //        return url;
        //        //string server = HttpContext.Current.Request.ServerVariables["HTTP_HOST"];
        //        //string url = "http://" + server + "/Forms/B_OA_CommonSighture/B_OA_CommonSightureOperation.ashx";
        //        //return url;

        //    }
        //}


        #endregion Model

    }
}
