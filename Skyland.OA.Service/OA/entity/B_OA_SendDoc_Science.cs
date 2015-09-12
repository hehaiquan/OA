using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using IWorkFlow.DataBase;
using System.Web;


namespace IWorkFlow.ORM
{
    //发文
    [Serializable]
    [DataTableInfo("B_OA_SendDoc_Science", "id")]
    class B_OA_SendDoc_Science : QueryInfo
    {

        /// <summary>
        /// id
        /// </summary>		
        [DataField("id", "B_OA_SendDoc_Science", false)]
        public int? id
        {
            get { return _id; }
            set { _id = value; }
        }
        private int? _id;


        /// <summary>
        /// 业务ID
        /// </summary>		
        [DataField("title", "B_OA_SendDoc_Science")]
        public string title
        {
            get { return _title; }
            set { _title = value; }
        }
        private string _title;


        /// <summary>
        /// 标题
        /// </summary>		
        [DataField("caseid", "B_OA_SendDoc_Science")]
        public string caseid
        {
            get { return _caseid; }
            set { _caseid = value; }
        }
        private string _caseid;


        /// <summary>
        /// 发文日期
        /// </summary>		
        [DataField("sendDate", "B_OA_SendDoc_Science")]
        public DateTime? sendDate
        {
            get { return _sendDate; }
            set { _sendDate = value; }
        }
        private DateTime? _sendDate;

        /// <summary>
        /// 主送
        /// </summary>		
        [DataField("mainDelivery", "B_OA_SendDoc_Science")]
        public string mainDelivery
        {
            get { return _mainDelivery; }
            set { _mainDelivery = value; }
        }
        private string _mainDelivery;

        /// <summary>
        /// 抄送
        /// </summary>		
        [DataField("cc", "B_OA_SendDoc_Science")]
        public string cc
        {
            get { return _cc; }
            set { _cc = value; }
        }
        private string _cc;

        /// <summary>
        /// 抄报
        /// </summary>		
        [DataField("copyAndrecord", "B_OA_SendDoc_Science")]
        public string copyAndrecord
        {
            get { return _copyAndrecord; }
            set { _copyAndrecord = value; }
        }
        private string _copyAndrecord;

        /// <summary>
        /// 抄报
        /// </summary>		
        [DataField("printCount", "B_OA_SendDoc_Science")]
        public int printCount
        {
            get { return _printCount; }
            set { _printCount = value; }
        }
        private int _printCount;

        /// <summary>
        /// 核稿人名字
        /// </summary>		
        [DataField("createManName", "B_OA_SendDoc_Science")]
        public string createManName
        {
            get { return _createManName; }
            set { _createManName = value; }
        }
        private string _createManName;


        /// <summary>
        /// 核稿人名字
        /// </summary>		
        [DataField("createManId", "B_OA_SendDoc_Science")]
        public string createManId
        {
            get { return _createManId; }
            set { _createManId = value; }
        }
        private string _createManId;

        /// <summary>
        /// 发文依据
        /// </summary>		
        [DataField("sendBasisTitle", "B_OA_SendDoc_Science")]
        public string sendBasisTitle
        {
            get { return _sendBasisTitle; }
            set { _sendBasisTitle = value; }
        }
        private string _sendBasisTitle;

        /// <summary>
        /// 发文事件ID
        /// </summary>		
        [DataField("sendBaseCaseId", "B_OA_SendDoc_Science")]
        public string sendBaseCaseId
        {
            get { return _sendBaseCaseId; }
            set { _sendBaseCaseId = value; }
        }
        private string _sendBaseCaseId;

        /// <summary>
        /// 发文关联的文件路径
        /// </summary>		
        [DataField("baseDocPath", "B_OA_SendDoc_Science")]
        public string baseDocPath
        {
            get { return _baseDocPath; }
            set { _baseDocPath = value; }
        }
        private string _baseDocPath;

        /// <summary>
        /// 关联业务的草稿id
        /// </summary>		
        [DataField("triggerBAID", "B_OA_SendDoc_Science")]
        public string triggerBAID
        {
            get { return _triggerBAID; }
            set { _triggerBAID = value; }
        }
        private string _triggerBAID;

        /// <summary>
        /// 关联业务的草稿actid
        /// </summary>		
        [DataField("triggerActId", "B_OA_SendDoc_Science")]
        public string triggerActId
        {
            get { return _triggerActId; }
            set { _triggerActId = value; }
        }
        private string _triggerActId;

        /// <summary>
        /// webUrl
        /// </summary>
        public string webUrl
        {
            get
            {  //手写签批URL
                string server = HttpContext.Current.Request.ServerVariables["HTTP_HOST"];
                string url = "http://" + server + "/Forms/B_OA_CommonSighture/B_OA_CommonSightureOperation.ashx";
                return url;
            }
        }
    }
}
