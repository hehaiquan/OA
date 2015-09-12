using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IWorkFlow.DataBase;

namespace IWorkFlow.ORM
{
    [DataTableInfo("Setting_Standard_Item", "StandardID")]
    public class Setting_Standard_Item : QueryInfo
    {
        #region Model
        private int _standardid;
        private string _standardcode;
        private string _standardname;
        private string _standardtype;
        private string _inspecttype;
        private string _inspectsubtype;
        private DateTime _publishdate;
        private DateTime _executedate;
        private DateTime _abolishdate;
        private string _userange;
        private string _status;
        private string _remark;
        /// <summary>
        /// 标准ID
        /// </summary>
        /// 
        [DataField("StandardID", "Setting_Standard_Item", false)]
        public int StandardID
        {
            set { _standardid = value; }
            get { return _standardid; }
        }
        /// <summary>
        /// 标准代码
        /// </summary>
        /// 
        [DataField("StandardCode", "Setting_Standard_Item")]
        public string StandardCode
        {
            set { _standardcode = value; }
            get { return _standardcode; }
        }
        /// <summary>
        /// 标准名称
        /// </summary>
        /// 
        [DataField("StandardName", "Setting_Standard_Item")]
        public string StandardName
        {
            set { _standardname = value; }
            get { return _standardname; }
        }
        /// <summary>
        /// 标准类型
        /// </summary>
        /// 
        [DataField("StandardType", "Setting_Standard_Item")]
        public string StandardType
        {
            set { _standardtype = value; }
            get { return _standardtype; }
        }
        /// <summary>
        /// 监测类型，水气声等等
        /// </summary>
        /// 
        [DataField("InspectType", "Setting_Standard_Item")]
        public string InspectType
        {
            set { _inspecttype = value; }
            get { return _inspecttype; }
        }
        /// <summary>
        /// 监测子类型，废水、噪声等等
        /// </summary>
        /// 
         [DataField("InspectSubType", "Setting_Standard_Item")]
        public string InspectSubType
        {
            set { _inspectsubtype = value; }
            get { return _inspectsubtype; }
        }
        /// <summary>
        /// 发布日期
        /// </summary>
        /// 
        [DataField("PublishDate", "Setting_Standard_Item")]
        public DateTime PublishDate
        {
            set { _publishdate = value; }
            get { return _publishdate; }
        }
        /// <summary>
        /// 实施日期
        /// </summary>
        /// 
        [DataField("ExecuteDate", "Setting_Standard_Item")]
        public DateTime ExecuteDate
        {
            set { _executedate = value; }
            get { return _executedate; }
        }
        /// <summary>
        /// 废止日期
        /// </summary>
        /// 
        [DataField("AbolishDate", "Setting_Standard_Item")]
        public DateTime AbolishDate
        {
            set { _abolishdate = value; }
            get { return _abolishdate; }
        }
        /// <summary>
        /// 适用范围
        /// </summary>
        /// 
        [DataField("UseRange", "Setting_Standard_Item")]
        public string UseRange
        {
            set { _userange = value; }
            get { return _userange; }
        }
        /// <summary>
        /// 标准状态
        /// </summary>
        /// 
        [DataField("Status", "Setting_Standard_Item")]
        public string Status
        {
            set { _status = value; }
            get { return _status; }
        }
        /// <summary>
        /// 备注
        /// </summary>
        /// 
        [DataField("Remark", "Setting_Standard_Item")]
        public string Remark
        {
            set { _remark = value; }
            get { return _remark; }
        }
        #endregion Model
    }
}
