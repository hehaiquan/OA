using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IWorkFlow.DataBase;

namespace IWorkFlow.ORM
{
    [Serializable]
    [DataTableInfo("B_OA_Supervision", "")]
    public class B_OA_Supervision : QueryInfo
    {
        /// <summary>
        /// 主键
        /// </summary>
        [DataField("id", "B_OA_Supervision", false)]
        public int id
        {
            get { return _id; }
            set { _id = value; }
        }
        private int _id;

        /// <summary>
        /// 标题
        /// </summary>
        [DataField("title", "B_OA_Supervision")]
        public string title
        {
            get { return _title; }
            set { _title = value; }
        }
        private string _title;

        /// <summary>
        /// 主要承办科室
        /// </summary>
        [DataField("undertake_Department", "B_OA_Supervision")]
        public string undertake_Department
        {
            get { return _undertake_Department; }
            set { _undertake_Department = value; }
        }
        private string _undertake_Department;

        /// <summary>
        /// 办理期限
        /// </summary>
        [DataField("manageDate", "B_OA_Supervision")]
        public DateTime? manageDate
        {
            get { return _manageDate; }
            set { _manageDate = value; }
        }
        private DateTime? _manageDate;

        /// <summary>
        /// 延时期限
        /// </summary>
        [DataField("limiteDate", "B_OA_Supervision")]
        public DateTime? limiteDate
        {
            get { return _limiteDate; }
            set { _limiteDate = value; }
        }
        private DateTime? _limiteDate;

        /// <summary>
        /// 业务号
        /// </summary>
        [DataField("caseId", "B_OA_Supervision")]
        public string caseId
        {
            get { return _caseId; }
            set { _caseId = value; }
        }
        private string _caseId;

        /// <summary>
        /// 公文依据标题
        /// </summary>
        [DataField("refferTitle", "B_OA_Supervision")]
        public string refferTitle
        {
            get { return _refferTitle; }
            set { _refferTitle = value; }
        }
        private string _refferTitle;

        /// <summary>
        /// 紧急程度
        /// </summary>
        [DataField("enmergencyLevel", "B_OA_Supervision")]
        public string enmergencyLevel
        {
            get { return _enmergencyLevel; }
            set { _enmergencyLevel = value; }
        }
        private string _enmergencyLevel;

        /// <summary>
        /// 协办科室
        /// </summary>
        [DataField("assistDepartment", "B_OA_Supervision")]
        public string assistDepartment
        {
            get { return _assistDepartment; }
            set { _assistDepartment = value; }
        }
        private string _assistDepartment;

        /// <summary>
        /// 督办人名字
        /// </summary>
        [DataField("supervisionManName", "B_OA_Supervision")]
        public string supervisionManName
        {
            get { return _supervisionManName; }
            set { _supervisionManName = value; }
        }
        private string _supervisionManName;

        /// <summary>
        /// 督办人ID
        /// </summary>
        [DataField("supervisionManId", "B_OA_Supervision")]
        public string supervisionManId
        {
            get { return _supervisionManId; }
            set { _supervisionManId = value; }
        }
        private string _supervisionManId;

        /// <summary>
        /// 协办人名字
        /// </summary>
        [DataField("assistMan", "B_OA_Supervision")]
        public string assistMan
        {
            get { return _assistMan; }
            set { _assistMan = value; }
        }
        private string _assistMan;

        /// <summary>
        /// 协办人ID
        /// </summary>
        [DataField("assitManId", "B_OA_Supervision")]
        public string assitManId
        {
            get { return _assitManId; }
            set { _assitManId = value; }
        }
        private string _assitManId;

        /// <summary>
        /// 生成日期
        /// </summary>
        [DataField("createDate", "B_OA_Supervision")]
        public string createDate
        {
            get { return _createDate; }
            set { _createDate = value; }
        }
        private string _createDate;

        /// <summary>
        /// 承办人ID
        /// </summary>
        [DataField("undertakeManId", "B_OA_Supervision")]
        public string undertakeManId
        {
            get { return _undertakeManId; }
            set { _undertakeManId = value; }
        }
        private string _undertakeManId;

        /// <summary>
        /// 承办人名字
        /// </summary>
        [DataField("undertakeManName", "B_OA_Supervision")]
        public string undertakeManName
        {
            get { return _undertakeManName; }
            set { _undertakeManName = value; }
        }
        private string _undertakeManName;

        /// <summary>
        /// 督办状态1待办2已办
        /// </summary>
        [DataField("status", "B_OA_Supervision")]
        public string status
        {
            get { return _status; }
            set { _status = value; }
        }
        private string _status;

        /// <summary>
        /// 是否延时
        /// </summary>
        [DataField("isLimited", "B_OA_Supervision")]
        public bool isLimited
        {
            get { return _isLimited; }
            set { _isLimited = value; }
        }
        private bool _isLimited;

        /// <summary>
        /// 签发人ID
        /// </summary>
        [DataField("issuerManId", "B_OA_Supervision")]
        public string issuerManId
        {
            get { return _issuerManId; }
            set { _issuerManId = value; }
        }
        private string _issuerManId;

        /// <summary>
        /// 签发人名字
        /// </summary>
        [DataField("issuerManName", "B_OA_Supervision")]
        public string issuerManName
        {
            get { return _issuerManName; }
            set { _issuerManName = value; }
        }
        private string _issuerManName;

         /// <summary>
        /// 备注
        /// </summary>
        [DataField("remark", "B_OA_Supervision")]
        public string remark
        {
            get { return _remark; }
            set { _remark = value; }
        }
        private string _remark;


        /// <summary>
        ///公文的caseId
        /// </summary>
        [DataField("relationCaseId", "B_OA_Supervision")]
        public string relationCaseId
        {
            get { return _relationCaseId; }
            set { _relationCaseId = value; }
        }
        private string _relationCaseId;

        /// <summary>
        ///督办编号
        /// </summary>
        [DataField("code", "B_OA_Supervision")]
        public string code
        {
            get { return _code; }
            set { _code = value; }
        }
        private string _code;
         
    }
}
