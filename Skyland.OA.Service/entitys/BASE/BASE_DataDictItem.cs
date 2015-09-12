using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using IWorkFlow.DataBase;

namespace IWorkFlow.ORM
{
    //BASE_DataDictItem（数据字典类型项）
    [Serializable]
    [DataTableInfo("BASE_DataDictItem", "")]
    public class BASE_DataDictItem : QueryInfo
    {
        /// <summary>
        /// 主键
        /// </summary>	
        [DataField("PK", "BASE_DataDictItem")]
        public string PK
        {
            get { return _pk; }
            set { _pk = value; }
        }
        string _pk;
        /// <summary>
        /// 外键（数据字典类型表主键）
        /// </summary>	
        [DataField("FK", "BASE_DataDictItem")]
        public string FK
        {
            get { return _fk; }
            set { _fk = value; }
        }
        string _fk;
        /// <summary>
        /// 值
        /// </summary>	
        [DataField("Value", "BASE_DataDictItem")]
        public string Value
        {
            get { return _value; }
            set { _value = value; }
        }
        string _value;
        /// <summary>
        /// 名称
        /// </summary>	
        [DataField("Name", "BASE_DataDictItem")]
        public string Name
        {
            get { return _name; }
            set { _name = value; }
        }
        string _name;
        /// <summary>
        /// 排序
        /// </summary>	
        [DataField("Rank", "BASE_DataDictItem")]
        public int Rank
        {
            get { return _rank; }
            set { _rank = value; }
        }
        int _rank;
        /// <summary>
        /// 是否启用（1：启用，0：禁用）
        /// </summary>	
        [DataField("IsEnabled", "BASE_DataDictItem")]
        public string IsEnabled
        {
            get { return _isenabled; }
            set { _isenabled = value; }
        }
        string _isenabled;
        /// <summary>
        /// 创建时间
        /// </summary>	
        [DataField("CreatedOn", "BASE_DataDictItem")]
        public DateTime? CreatedOn
        {
            get { return _createdon; }
            set { _createdon = value; }
        }
        DateTime? _createdon;

    }//class
}