using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IWorkFlow.DataBase;

namespace IWorkFlow.ORM
{
    [Serializable]
    [DataTableInfo("B_OA_Supervision_Reminder_Notice", "")]
    public class B_OA_Supervision_Reminder_Notice : QueryInfo
    {
        /// <summary>
        /// 主键
        /// </summary>
        [DataField("id", "B_OA_Supervision_Reminder_Notice", false)]
        public int id
        {
            get { return _id; }
            set { _id = value; }
        }
        private int _id;

        /// <summary>
        /// 年
        /// </summary>
        [DataField("year", "B_OA_Supervision_Reminder_Notice")]
        public string year
        {
            get { return _year; }
            set { _year = value; }
        }
        private string _year;

        /// <summary>
        /// 号
        /// </summary>
        [DataField("code", "B_OA_Supervision_Reminder_Notice")]
        public string code
        {
            get { return _code; }
            set { _code = value; }
        }
        private string _code;

        /// <summary>
        /// 年
        /// </summary>
        [DataField("assistManName", "B_OA_Supervision_Reminder_Notice")]
        public string assistManName
        {
            get { return _assistManName; }
            set { _assistManName = value; }
        }
        private string _assistManName;

        /// <summary>
        /// 年
        /// </summary>
        [DataField("assistManId", "B_OA_Supervision_Reminder_Notice")]
        public string assistManId
        {
            get { return _assistManId; }
            set { _assistManId = value; }
        }
        private string _assistManId;

        /// <summary>
        ///  填空
        /// </summary>
        [DataField("space1", "B_OA_Supervision_Reminder_Notice")]
        public string space1
        {
            get { return _space1; }
            set { _space1 = value; }
        }
        private string _space1;

        /// <summary>
        ///  填空
        /// </summary>
        [DataField("space2", "B_OA_Supervision_Reminder_Notice")]
        public string space2
        {
            get { return _space2; }
            set { _space2 = value; }
        }
        private string _space2;

        /// <summary>
        ///  填空
        /// </summary>
        [DataField("space3", "B_OA_Supervision_Reminder_Notice")]
        public string space3
        {
            get { return _space3; }
            set { _space3 = value; }
        }
        private string _space3;

        /// <summary>
        ///  填空
        /// </summary>
        [DataField("space4", "B_OA_Supervision_Reminder_Notice")]
        public string space4
        {
            get { return _space4; }
            set { _space4 = value; }
        }
        private string _space4;

        /// <summary>
        ///  填空
        /// </summary>
        [DataField("space5", "B_OA_Supervision_Reminder_Notice")]
        public string space5
        {
            get { return _space5; }
            set { _space5 = value; }
        }
        private string _space5;

        /// <summary>
        ///  填空
        /// </summary>
        [DataField("space6", "B_OA_Supervision_Reminder_Notice")]
        public string space6
        {
            get { return _space6; }
            set { _space6 = value; }
        }
        private string _space6;

        /// <summary>
        ///  填空
        /// </summary>
        [DataField("space7", "B_OA_Supervision_Reminder_Notice")]
        public string space7
        {
            get { return _space7; }
            set { _space7 = value; }
        }
        private string _space7;

        /// <summary>
        ///  填空
        /// </summary>
        [DataField("space8", "B_OA_Supervision_Reminder_Notice")]
        public string space8
        {
            get { return _space8; }
            set { _space8 = value; }
        }
        private string _space8;


        /// <summary>
        ///  填空
        /// </summary>
        [DataField("space9", "B_OA_Supervision_Reminder_Notice")]
        public string space9
        {
            get { return _space9; }
            set { _space9 = value; }
        }
        private string _space9;

        /// <summary>
        ///  填空
        /// </summary>
        [DataField("space10", "B_OA_Supervision_Reminder_Notice")]
        public string space10
        {
            get { return _space10; }
            set { _space10 = value; }
        }
        private string _space10;

        /// <summary>
        ///  承办人ID
        /// </summary>
        [DataField("createDate", "B_OA_Supervision_Reminder_Notice")]
        public string createDate
        {
            get { return _createDate; }
            set { _createDate = value; }
        }
        private string _createDate;

        /// <summary>
        /// 督办人签名
        /// </summary>
        [DataField("supervisionManSighture", "B_OA_Supervision_Notice")]
        public string supervisionManSighture
        {
            get { return _supervisionManSighture; }
            set { _supervisionManSighture = value; }
        }
        private string _supervisionManSighture;

        /// <summary>
        ///  领取人签名
        /// </summary>
        [DataField("receiveManSighture", "B_OA_Supervision_Reminder_Notice")]
        public string receiveManSighture
        {
            get { return _receiveManSighture; }
            set { _receiveManSighture = value; }
        }
        private string _receiveManSighture;


        /// <summary>
        ///关联ID
        /// </summary>
        [DataField("relationCaseId", "B_OA_Supervision_Reminder_Notice")]
        public string relationCaseId
        {
            get { return _relationCaseId; }
            set { _relationCaseId = value; }
        }
        private string _relationCaseId;

        /// <summary>
        ///事件ID
        /// </summary>
        [DataField("caseid", "B_OA_Supervision_Reminder_Notice")]
        public string caseid
        {
            get { return _caseid; }
            set { _caseid = value; }
        }
        private string _caseid;

        /// <summary>
        /// 签发人ID
        /// </summary>
        [DataField("issuerManId", "B_OA_Supervision_Reminder_Notice")]
        public string issuerManId
        {
            get { return _issuerManId; }
            set { _issuerManId = value; }
        }
        private string _issuerManId;

        /// <summary>
        /// 签发人名字
        /// </summary>
        [DataField("issuerManName", "B_OA_Supervision_Reminder_Notice")]
        public string issuerManName
        {
            get { return _issuerManName; }
            set { _issuerManName = value; }
        }
        private string _issuerManName;

        /// <summary>
        /// 催办日期
        /// </summary>
        [DataField("supervisionDate", "B_OA_Supervision_Reminder_Notice")]
        public string supervisionDate
        {
            get { return _supervisionDate; }
            set { _supervisionDate = value; }
        }
        private string _supervisionDate;

   
    }


}
