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
    [DataTableInfo("B_OA_OnDuty", "id")]
    public class B_OA_OnDuty : QueryInfo
    {
        #region Model
        private int _id;
        private string _workPlanName;
        private string _userid;
        private string _userName;
        private string _startTime;
        private string _endTime;
        private string _remark;
        /// <summary>
        /// 
        /// </summary>
        /// 
        [DataField("id", "B_OA_OnDuty", false)]
        public int id
        {
            set { _id = value; }
            get { return _id; }
        }
        /// <summary>
        /// 
        /// </summary>
        /// 
        [DataField("workPlanName", "B_OA_OnDuty")]
        public string workPlanName
        {
            set { _workPlanName = value; }
            get { return _workPlanName; }
        }
        /// <summary>
        /// 
        /// </summary>
        /// 
        [DataField("userid", "B_OA_OnDuty")]
        public string userid
        {
            set { _userid = value; }
            get { return _userid; }
        }

        [DataField("userName", "B_OA_OnDuty")]
        public string userName
        {
            set { _userName = value; }
            get { return _userName; }
        }

        [DataField("department", "B_OA_OnDuty")]
        public string department
        {
            set { _department = value; }
            get { return _department; }
        }
        private string _department;

        [DataField("deptName", "B_OA_OnDuty")]
        public string deptName
        {
            set { _deptName = value; }
            get
            {
                if (_deptName == null || _deptName == "")
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
                    return _deptName;
                }
            }
        }
        private string _deptName;

        [DataField("startTime", "B_OA_OnDuty")]
        public string startTime
        {
            set { _startTime = value; }
            get { return _startTime; }
        }

        [DataField("endTime", "B_OA_OnDuty")]
        public string endTime
        {
            set { _endTime = value; }
            get { return _endTime; }
        }



        /// <summary>
        /// 备注
        /// </summary>
        /// 
        [DataField("remark", "B_OA_OnDuty")]
        public string remark
        {
            set { _remark = value; }
            get { return _remark; }
        }



        #endregion Model
    }
}

