using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using IWorkFlow.DataBase;

namespace IWorkFlow.ORM
{
    //BASE_DataDictType（数据字典类型表）
    [Serializable]
    [DataTableInfo("BASE_DataDictType", "")]
    public class BASE_DataDictType : QueryInfo
    {
        /// <summary>
        /// 主键
        /// </summary>	
        [DataField("PK", "BASE_DataDictType")]
        public string PK
        {
            get { return _pk; }
            set { _pk = value; }
        }
        string _pk;
        /// <summary>
        /// 类型
        /// </summary>	
        [DataField("Type", "BASE_DataDictType")]
        public string Type
        {
            get { return _type; }
            set { _type = value; }
        }
        string _type;
        /// <summary>
        /// 名称
        /// </summary>	
        [DataField("Name", "BASE_DataDictType")]
        public string Name
        {
            get { return _name; }
            set { _name = value; }
        }
        string _name;
        /// <summary>
        /// 备注
        /// </summary>	
        [DataField("Remark", "BASE_DataDictType")]
        public string Remark
        {
            get { return _remark; }
            set { _remark = value; }
        }
        string _remark;
        /// <summary>
        /// 创建时间
        /// </summary>	
        [DataField("CreatedOn", "BASE_DataDictType")]
        public DateTime? CreatedOn
        {
            get { return _createdon; }
            set { _createdon = value; }
        }
        DateTime? _createdon;

    }//class
}