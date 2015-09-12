using IWorkFlow.DataBase;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace IWorkFlow.ORM
{
    [Serializable]
    [DataTableInfo("B_OA_SupervisionReminder", "id")]
    public class B_OA_SupervisionReminder : QueryInfo
    {
        /// <summary>
        /// id
        /// </summary>		
        [DataField("id", "B_OA_SupervisionReminder", false)]
        public int id
        {
            get { return _id; }
            set { _id = value; }
        }
        private int _id;

        /// <summary>
        /// 督办通知单外键
        /// </summary>		
        [DataField("msgCaseId", "B_OA_SupervisionReminder")]
        public string msgCaseId
        {
            get { return _msgCaseId; }
            set { _msgCaseId = value; }
        }
        private string _msgCaseId;


        /// <summary>
        /// 业务id
        /// </summary>		
        [DataField("caseId", "B_OA_SupervisionReminder")]
        public string caseId
        {
            get { return _caseId; }
            set { _caseId = value; }
        }
        private string _caseId;


        /// <summary>
        /// 相关业务督办的外键
        /// </summary>		
        [DataField("relationCaseId", "B_OA_SupervisionReminder")]
        public string relationCaseId
        {
            get { return _relationCaseId; }
            set { _relationCaseId = value; }
        }
        private string _relationCaseId;


        /// <summary>
        /// 催办人ID
        /// </summary>		
        [DataField("reminderManId", "B_OA_SupervisionReminder")]
        public string reminderManId
        {
            get { return _reminderManId; }
            set { _reminderManId = value; }
        }
        private string _reminderManId;

        /// <summary>
        /// 催办人名称
        /// </summary>		
        [DataField("reminderManName", "B_OA_SupervisionReminder")]
        public string reminderManName
        {
            get { return _reminderManName; }
            set { _reminderManName = value; }
        }
        private string _reminderManName;

        /// <summary>
        /// 承办人ID
        /// </summary>		
        [DataField("undertakeManId", "B_OA_SupervisionReminder")]
        public string undertakeManId
        {
            get { return _undertakeManId; }
            set { _undertakeManId = value; }
        }
        private string _undertakeManId;

        /// <summary>
        /// 承办人姓名
        /// </summary>		
        [DataField("undertakeManName", "B_OA_SupervisionReminder")]
        public string undertakeManName
        {
            get { return _undertakeManName; }
            set { _undertakeManName = value; }
        }
        private string _undertakeManName;

        /// <summary>
        /// 生成时间
        /// </summary>		
        [DataField("createDate", "B_OA_SupervisionReminder")]
        public string createDate
        {
            get { return _createDate; }
            set { _createDate = value; }
        }
        private string _createDate;

        /// <summary>
        /// 督办状态1待办2已办
        /// </summary>		
        [DataField("enmergencyLevel", "B_OA_SupervisionReminder")]
        public string enmergencyLevel
        {
            get { return _enmergencyLevel; }
            set { _enmergencyLevel = value; }
        }
        private string _enmergencyLevel;

        /// <summary>
        /// 催办标题
        /// </summary>		
        [DataField("title", "B_OA_SupervisionReminder")]
        public string title
        {
            get { return _title; }
            set { _title = value; }
        }
        private string _title;

        /// <summary>
        /// 催办依据
        /// </summary>		
        [DataField("msgCaseTitle", "B_OA_SupervisionReminder")]
        public string msgCaseTitle
        {
            get { return _msgCaseTitle; }
            set { _msgCaseTitle = value; }
        }
        private string _msgCaseTitle;

        /// <summary>
        /// 签发人名字
        /// </summary>		
        [DataField("issuerManName", "B_OA_SupervisionReminder")]
        public string issuerManName
        {
            get { return _issuerManName; }
            set { _issuerManName = value; }
        }
        private string _issuerManName;

        /// <summary>
        /// 签发人ID
        /// </summary>		
        [DataField("issuerManId", "B_OA_SupervisionReminder")]
        public string issuerManId
        {
            get { return _issuerManId; }
            set { _issuerManId = value; }
        }
        private string _issuerManId;


        /// <summary>
        /// 催办说明
        /// </summary>
        [DataField("explain", "B_OA_SupervisionReminder")]
        public string explain
        {
            get { return _explain; }
            set { _explain = value; }
        }
        private string _explain;

        /// <summary>
        /// 催办次数
        /// </summary>
        [DataField("reminderCount", "B_OA_SupervisionReminder")]
        public int reminderCount
        {
            get { return _reminderCount; }
            set { _reminderCount = value; }
        }
        private int _reminderCount;

        /// <summary>
        /// 催办编号
        /// </summary>
        [DataField("code", "B_OA_SupervisionReminder")]
        public string code
        {
            get { return _code; }
            set { _code = value; }
        }
        private string _code;

        /// <summary>
        /// 承办部门
        /// </summary>
        [DataField("undertake_Department", "B_OA_SupervisionReminder")]
        public string undertake_Department
        {
            get { return _undertake_Department; }
            set { _undertake_Department = value; }
        }
        private string _undertake_Department;
    }
}
