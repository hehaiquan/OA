using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IWorkFlow.DataBase;

namespace IWorkFlow.ORM
{
    [Serializable]
    [DataTableInfo("B_OA_SupervisionMsg", "")]
    public class B_OA_SupervisionMsg : QueryInfo
    {
        /// <summary>
        /// 主键
        /// </summary>
        [DataField("id", "B_OA_SupervisionMsg", false)]
        public int id
        {
            get { return _id; }
            set { _id = value; }
        }
        private int _id;

        /// <summary>
        /// 创建时间
        /// </summary>
        [DataField("createDate", "B_OA_SupervisionMsg")]
        public string createDate
        {
            get { return _createDate; }
            set { _createDate = value; }
        }
        private string _createDate;

        /// <summary>
        /// 内容
        /// </summary>
        [DataField("content", "B_OA_SupervisionMsg")]
        public string content
        {
            get { return _content; }
            set { _content = value; }
        }
        private string _content;

        /// <summary>
        /// 附件路径
        /// </summary>
        [DataField("attchmentPath", "B_OA_SupervisionMsg")]
        public string attchmentPath
        {
            get { return _attchmentPath; }
            set { _attchmentPath = value; }
        }
        private string _attchmentPath;


        /// <summary>
        /// 创建用户ID
        /// </summary>
        [DataField("userId", "B_OA_SupervisionMsg")]
        public string userId
        {
            get { return _userId; }
            set { _userId = value; }
        }
        private string _userId;

        /// <summary>
        /// 用户名
        /// </summary>
        [DataField("userName", "B_OA_SupervisionMsg")]
        public string userName
        {
            get { return _userName; }
            set { _userName = value; }
        }
        private string _userName;

        /// <summary>
        /// 1为领导批示2为办理情况
        /// </summary>
        [DataField("type", "B_OA_SupervisionMsg")]
        public string type
        {
            get { return _type; }
            set { _type = value; }
        }
        private string _type;

        /// <summary>
        ///事件ID
        /// </summary>
        [DataField("caseId", "B_OA_SupervisionMsg")]
        public string caseId
        {
            get { return _caseId; }
            set { _caseId = value; }
        }
        private string _caseId;

        /// <summary>
        ///督办事件ID
        /// </summary>
        [DataField("relactionCaseId", "B_OA_SupervisionMsg")]
        public string relactionCaseId
        {
            get { return _relactionCaseId; }
            set { _relactionCaseId = value; }
        }
        private string _relactionCaseId;

    }
}
