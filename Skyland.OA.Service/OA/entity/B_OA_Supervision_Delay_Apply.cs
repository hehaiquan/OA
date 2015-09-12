using IWorkFlow.DataBase;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace IWorkFlow.ORM
{
    [Serializable]
    [DataTableInfo("B_OA_Supervision_Delay_Apply", "")]
    public class B_OA_Supervision_Delay_Apply : QueryInfo
    {
        /// <summary>
        /// 主键
        /// </summary>
        [DataField("id", "B_OA_Supervision_Delay_Apply", false)]
        public int id
        {
            get { return _id; }
            set { _id = value; }
        }
        private int _id;

        /// <summary>
        /// 督办事项名称
        /// </summary>
        [DataField("title", "B_OA_Supervision_Delay_Apply")]
        public string title
        {
            get { return _title; }
            set { _title = value; }
        }
        private string _title;

        /// <summary>
        /// 生成日期
        /// </summary>
        [DataField("createDate", "B_OA_Supervision_Delay_Apply")]
        public string createDate
        {
            get { return _createDate; }
            set { _createDate = value; }
        }
        private string _createDate;

        /// <summary>
        /// 申请延期事由
        /// </summary>
        [DataField("applyReason", "B_OA_Supervision_Delay_Apply")]
        public string applyReason
        {
            get { return _applyReason; }
            set { _applyReason = value; }
        }
        private string _applyReason;


        /// <summary>
        /// 延期后的办结时间
        /// </summary>
        [DataField("delayDate", "B_OA_Supervision_Delay_Apply")]
        public DateTime? delayDate
        {
            get { return _delayDate; }
            set { _delayDate = value; }
        }
        private DateTime? _delayDate;


        /// <summary>
        /// 延期后的办结时间
        /// </summary>
        [DataField("caseId", "B_OA_Supervision_Delay_Apply")]
        public string caseId
        {
            get { return _caseId; }
            set { _caseId = value; }
        }
        private string _caseId;

        /// <summary>
        /// 业务关联ID
        /// </summary>
        [DataField("relationCaseId", "B_OA_Supervision_Delay_Apply")]
        public string relationCaseId
        {
            get { return _relationCaseId; }
            set { _relationCaseId = value; }
        }
        private string _relationCaseId;
      
        /// <summary>
        /// 申请人ID
        /// </summary>
        [DataField("applyManId", "B_OA_Supervision_Delay_Apply")]
        public string applyManId
        {
            get { return _applyManId; }
            set { _applyManId = value; }
        }
        private string _applyManId;


        /// <summary>
        /// 申请人名字
        /// </summary>
        [DataField("relationTitle", "B_OA_Supervision_Delay_Apply")]
        public string relationTitle
        {
            get { return _relationTitle; }
            set { _relationTitle = value; }
        }
        private string _relationTitle;

        /// <summary>
        /// 申请人名字
        /// </summary>
        [DataField("applyManName", "B_OA_Supervision_Delay_Apply")]
        public string applyManName
        {
            get { return _applyManName; }
            set { _applyManName = value; }
        }
        private string _applyManName;

        /// <summary>
        /// webUrl
        /// </summary>
        public string webUrl
        {
            get
            {  //手写签批URL
                string server = HttpContext.Current.Request.ServerVariables["HTTP_HOST"];
                string url = "http://" + server + "/SightureOperation.data?action=save";
                return url;
            }
        }



    }
}
