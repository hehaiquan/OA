using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using IWorkFlow.DataBase;


namespace IWorkFlow.ORM
{
    [Serializable]
    [DataTableInfo("B_WorkLog", "")]
    public class B_WorkLog:QueryInfo
    {
        private int _id;
        [DataField("id", "B_WorkLog", false)]
        public int id
        {
            set { _id = value; }
            get { return _id; }
        }

        private DateTime _createDate;
        /// <summary>
        /// 记录日期
        /// </summary>
        [DataField("createDate", "B_WorkLog")]
        public DateTime createDate
        {    
           
            set { _createDate = value; }
            get { return _createDate; }
        }

        private string _createManId;
        /// <summary>
        /// 记录人姓名
        /// </summary>
        [DataField("createManId", "B_WorkLog")]
        public string createManId
        {
            set { _createManId = value; }
            get { return _createManId; }
        }

        private string _substance;
        /// <summary>
        /// 内容
        /// </summary>
        [DataField("substance", "B_WorkLog")]
        public string substance
        {
            set { _substance = value; }
            get { return _substance; }
        }

        private string _attachment;
        /// <summary>
        /// 附件
        /// </summary>
        [DataField("attachment", "B_WorkLog")]
        public string attachment
        {
            set { _attachment = value; }
            get { return _attachment; }
        }
        private string _logType;
        /// <summary>
        /// 日志类型
        /// </summary>
        [DataField("logType", "B_WorkLog")]
        public string logType
        {
            set { _logType = value; }
            get { return _logType; }
        }


        private string _workOvertime;
        /// <summary>
        /// 加班时间
        /// </summary>
        [DataField("workOvertime", "B_WorkLog")]
        public string workOvertime
        {
            set { _workOvertime = value; }
            get { return _workOvertime; }
        }

        private string _logTypeName;
        /// <summary>
        /// 日志类型名称
        /// </summary>
        public string logTypeName
        {
            set { _logTypeName = value; }
            get { return _logTypeName; }
        }

        private string _workLogType;
        /// <summary>
        /// 工作日志类型1个人类型2部门类型
        /// </summary>
        [DataField("workLogType", "B_WorkLog")]
        public string workLogType
        {
            set { _workLogType = value; }
            get { return _workLogType; }
        }

        private string _departmentId;
        /// <summary>
        /// 日志所属部门id
        /// </summary>
        [DataField("departmentId", "B_WorkLog")]
        public string departmentId
        {
            set { _departmentId = value; }
            get { return _departmentId; }
        }


        private string _departmentName;
        /// <summary>
        /// 部门名称
        /// </summary>
        public string departmentName
        {
            set { _departmentName = value; }
            get { return _departmentName; }
        }
    }
}
