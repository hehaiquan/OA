using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using IWorkFlow.DataBase;

namespace IWorkFlow.ORM
{
    [Serializable]
    [DataTableInfo("B_PhoneRecord", "")]
    public class B_PhoneRecord : QueryInfo
    {
        private int _id;
        [DataField("id", "B_PhoneRecord", false)]
        public int id
        {
            set { _id = value; }
            get { return _id; }
        }

        /// <summary>
        /// 录入日期
        /// </summary>
        private string _recordDate;
        [DataField("recordDate", "B_PhoneRecord")]
        public string recordDate
        {
            set { _recordDate = value; }
            get { return _recordDate; }
        }

        /// <summary>
        /// 来电人姓名
        /// </summary>
        private string _incomeManName;
        [DataField("incomeManName", "B_PhoneRecord")]
        public string incomeManName
        {
            set { _incomeManName = value; }
            get { return _incomeManName; }
        }

        /// <summary>
        /// 来电人单位
        /// </summary>
        private string _incomeOrgnization;
        [DataField("incomeOrgnization", "B_PhoneRecord")]
        public string incomeOrgnization
        {
            set { _incomeOrgnization = value; }
            get { return _incomeOrgnization; }
        }

        /// <summary>
        /// 来电人电话号码
        /// </summary>
        private string _incomePhoneNumber;
        [DataField("incomePhoneNumber", "B_PhoneRecord")]
        public string incomePhoneNumber
        {
            set { _incomePhoneNumber = value; }
            get { return _incomePhoneNumber; }
        }

        /// <summary>
        /// 接电话人
        /// </summary>
        private string _answerMan;
        [DataField("answerMan", "B_PhoneRecord")]
        public string answerMan
        {
            set { _answerMan = value; }
            get { return _answerMan; }
        }

        /// <summary>
        /// 接电话人单位
        /// </summary>
        private string _answerOrgnization;
        [DataField("answerOrgnization", "B_PhoneRecord")]
        public string answerOrgnization
        {
            set { _answerOrgnization = value; }
            get { return _answerOrgnization; }
        }

        /// <summary>
        /// 通话主要内容
        /// </summary>
        private string _mainTitle;
        [DataField("mainTitle", "B_PhoneRecord")]
        public string mainTitle
        {
            set { _mainTitle = value; }
            get { return _mainTitle; }
        }

        /// <summary>
        /// 代办事项
        /// </summary>
        private string _todoSomething;
        [DataField("todoSomething", "B_PhoneRecord")]
        public string todoSomething
        {
            set { _todoSomething = value; }
            get { return _todoSomething; }
        }

        /// <summary>
        /// 代办人
        /// </summary>
        private string _todoManId;
        [DataField("todoManId", "B_PhoneRecord")]
        public string todoManId
        {
            set { _todoManId = value; }
            get { return _todoManId; }
        }

        /// <summary>
        /// 代办状态1未提交2已提交3已完成
        /// </summary>
        private string _eventStatus;
        [DataField("eventStatus", "B_PhoneRecord")]
        public string eventStatus
        {
            set { _eventStatus = value; }
            get { return _eventStatus; }
        }

        /// <summary>
        /// 受理人名称
        /// </summary>
        private string _todoManName;
        public string todoManName
        {
            set { _todoManName = value; }
            get { return _todoManName; }
        }


    }
}
