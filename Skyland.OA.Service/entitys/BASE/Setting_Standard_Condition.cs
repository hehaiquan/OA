using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IWorkFlow.DataBase;

namespace IWorkFlow.ORM
{
    [DataTableInfo("Setting_Standard_Condition", "NodeID")]
    class Setting_Standard_Condition : QueryInfo
    {
        #region Model
        private int _nodeid;
        private string _name;
        private string _monitoridstr;
        private string _productidstr;
        private int? _standardid;
        private int _parentid;
        private string _nodepath;
        private bool _isleaf;
        private string _nodedescription;

        /// <summary>
        /// 主键ID
        /// </summary>
        /// 
        [DataField("NodeID", "Setting_Standard_Condition", false)]
        public int NodeID
        {
            set { _nodeid = value; }
            get { return _nodeid; }
        }
        /// <summary>
        /// 名称
        /// </summary>
        /// 
        [DataField("Name", "Setting_Standard_Condition")]
        public string Name
        {
            set { _name = value; }
            get { return _name; }
        }
        /// <summary>
        /// 
        /// </summary>
        /// 
        [DataField("MonitorIDStr", "Setting_Standard_Condition")]
        public string MonitorIDStr
        {
            set { _monitoridstr = value; }
            get { return _monitoridstr; }
        }
        /// <summary>
        /// 
        /// </summary>
        /// 
         [DataField("ProductIDStr", "Setting_Standard_Condition")]
        public string ProductIDStr
        {
            set { _productidstr = value; }
            get { return _productidstr; }
        }
        /// <summary>
        /// 标准号--对应[Setting_Standard_Item]表 [StandardID]
        /// </summary>
        /// 
         [DataField("StandardID", "Setting_Standard_Condition")]
        public int? StandardID
        {
            set { _standardid = value; }
            get { return _standardid; }
        }
        /// <summary>
        /// 
        /// </summary>
        /// 
        [DataField("ParentID", "Setting_Standard_Condition")]
        public int ParentID
        {
            set { _parentid = value; }
            get { return _parentid; }
        }
        /// <summary>
        /// 
        /// </summary>
        /// 
        [DataField("NodePath", "Setting_Standard_Condition")]
        public string NodePath
        {
            set { _nodepath = value; }
            get { return _nodepath; }
        }
        /// <summary>
        /// 是否为最高层
        /// </summary>
        /// 
        [DataField("IsLeaf", "Setting_Standard_Condition")]
        public bool IsLeaf
        {
            set { _isleaf = value; }
            get { return _isleaf; }
        }
        /// <summary>
        /// 
        /// </summary>
        /// 
         [DataField("NodeDescription", "Setting_Standard_Condition")]
        public string NodeDescription
        {
            set { _nodedescription = value; }
            get { return _nodedescription; }
        }
        #endregion Model
    }
}
