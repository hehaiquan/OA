using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IWorkFlow.DataBase;

namespace IWorkFlow.ORM
{
     [DataTableInfo("Setting_Standard_Monitor", "MonitorID")]
    class Setting_Standard_Monitor : QueryInfo
    {
        #region Model
        private int _monitorid;
        private int? _itemid;
        private string _itemsname;
        private string _monitorvaluetype;
        private decimal? _upperlimit;
        private string _upperlimitoperator;
        private decimal? _lowlimit;
        private string _lowlimitoperator;
        private decimal? _standardlimit;
        private string _units;
        private string _remark;
        private bool _isnoorganize;
        /// <summary>
        /// 
        /// </summary>
        public int MonitorID
        {
            set { _monitorid = value; }
            get { return _monitorid; }
        }
        /// <summary>
        /// 项目ID,对应Setting_AnalysisItemAbbreviation表主键
        /// </summary>
        public int? ItemID
        {
            set { _itemid = value; }
            get { return _itemid; }
        }
        /// <summary>
        /// 项目名称
        /// </summary>
        public string ItemsName
        {
            set { _itemsname = value; }
            get { return _itemsname; }
        }
        /// <summary>
        /// 
        /// </summary>
        public string MonitorValueType
        {
            set { _monitorvaluetype = value; }
            get { return _monitorvaluetype; }
        }
        /// <summary>
        /// 
        /// </summary>
        public decimal? UpperLimit
        {
            set { _upperlimit = value; }
            get { return _upperlimit; }
        }
        /// <summary>
        /// 
        /// </summary>
        public string UpperLimitOperator
        {
            set { _upperlimitoperator = value; }
            get { return _upperlimitoperator; }
        }
        /// <summary>
        /// 
        /// </summary>
        public decimal? LowLimit
        {
            set { _lowlimit = value; }
            get { return _lowlimit; }
        }
        /// <summary>
        /// 
        /// </summary>
        public string LowLimitOperator
        {
            set { _lowlimitoperator = value; }
            get { return _lowlimitoperator; }
        }
        /// <summary>
        /// 
        /// </summary>
        public decimal? StandardLimit
        {
            set { _standardlimit = value; }
            get { return _standardlimit; }
        }
        /// <summary>
        /// 
        /// </summary>
        public string Units
        {
            set { _units = value; }
            get { return _units; }
        }
        /// <summary>
        /// 
        /// </summary>
        public string Remark
        {
            set { _remark = value; }
            get { return _remark; }
        }
        /// <summary>
        /// 
        /// </summary>
        public bool IsNoOrganize
        {
            set { _isnoorganize = value; }
            get { return _isnoorganize; }
        }
        #endregion Model
    }
}
