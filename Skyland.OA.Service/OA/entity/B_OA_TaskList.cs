using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using IWorkFlow.DataBase;
using IWorkFlow.Host;
using System.Data;

namespace IWorkFlow.ORM
{

    [Serializable]
    [DataTableInfo("B_OA_TaskList", "id")]
    public class B_OA_TaskList : QueryInfo
    {
        #region Model
        private int _taskid;
        private int _workplanid;
        private string _taskname;
        private string _userid;
        private string _username;
        private string _starttime;
        private string _endtime;
        private string _department;
        private string _deptname;
        private string _workcontent;
        private string _remark;
        private string _iswc="0";
        private int _id;

        [DataField("id", "B_OA_TaskList", false)]
        public int id
        {
            set { _id = value; }
            get { return _id; }
        }

        /// <summary>
        /// 任务ID
        /// </summary>
        /// 
        [DataField("TaskId", "B_OA_TaskList")]
        public int TaskId
        {
            set { _taskid = value; }
            get { return _taskid; }
        }
        /// <summary>
        /// 工作计划ID
        /// </summary>
        /// 
        [DataField("workPlanId", "B_OA_TaskList")]
        public int workPlanId
        {
            set { _workplanid = value; }
            get { return _workplanid; }
        }
        /// <summary>
        /// 工作计划名称
        /// </summary>
        /// 
        [DataField("TaskName", "B_OA_TaskList")]
        public string TaskName
        {
            set { _taskname = value; }
            get { return _taskname; }
        }
        /// <summary>
        /// 
        /// </summary>
        /// 
        [DataField("userid", "B_OA_TaskList")]
        public string userid
        {
            set { _userid = value; }
            get { return _userid; }
        }
        /// <summary>
        /// 工作人
        /// </summary>
        /// 
        [DataField("userName", "B_OA_TaskList")]
        public string userName
        {
            set { _username = value; }
            get { return _username; }
        }
        /// <summary>
        /// 开始时间
        /// </summary>
        /// 
        [DataField("startTime", "B_OA_TaskList")]
        public string startTime
        {
            set { _starttime = value; }
            get { return _starttime; }
        }
        /// <summary>
        /// 结束时间
        /// </summary>
        /// 
        [DataField("endTime", "B_OA_TaskList")]
        public string endTime
        {
            set { _endtime = value; }
            get { return _endtime; }
        }
        /// <summary>
        /// 部门
        /// </summary>
        /// 
        [DataField("department", "B_OA_TaskList")]
        public string department
        {
            set { _department = value; }
            get { return _department; }
        }
        /// <summary>
        /// 
        /// </summary>
        /// 
        [DataField("deptName", "B_OA_TaskList")]
        public string deptName
        {
            set { _deptname = value; }
            get {
                if (_deptname == null || _deptname == "")
                {
                    IDbTransaction tran = Utility.Database.BeginDbTransaction();
                    DataSet dataSet = Utility.Database.ExcuteDataSet("select DPName from FX_Department where DPID='" + department + "'", tran);
                    Utility.Database.Commit(tran);//提交事务
                    string name = dataSet.Tables[0].Rows[0][0].ToString();
                    if (dataSet != null) dataSet.Dispose();
                    return name;
                }
                else
                {
                    return _deptname;
                }
            }
        }
        /// <summary>
        /// 工作内容
        /// </summary>
        /// 
        [DataField("WorkContent", "B_OA_TaskList")]
        public string WorkContent
        {
            set { _workcontent = value; }
            get { return _workcontent; }
        }
        /// <summary>
        /// 备注
        /// </summary>
        /// 
        [DataField("remark", "B_OA_TaskList")]
        public string remark
        {
            set { _remark = value; }
            get { return _remark; }
        }
        /// <summary>
        /// 
        /// </summary>
        /// 
        [DataField("isWc", "B_OA_TaskList")]
        public string isWc
        {
            set { _iswc = value; }
            get { return _iswc; }
        }

        
        #endregion Model
    }
}
