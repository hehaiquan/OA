using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IWorkFlow.DataBase;

namespace IWorkFlow.ORM
{
    [Serializable]
    [DataTableInfo("B_OA_Organization", "id")]
    public class B_OA_Organization : QueryInfo
    {
        /// <summary>
        /// 主键
        /// </summary>
        [DataField("id", "B_OA_Organization", false)]
        public int id
        {
            get { return _id; }
            set { _id = value; }
        }
        private int _id;

        /// <summary>
        /// 简称
        /// </summary>
        [DataField("shortName", "B_OA_Organization")]
        public string shortName
        {
            get { return _shortName; }
            set { _shortName = value; }
        }
        private string _shortName;

        /// <summary>
        /// 全称
        /// </summary>
        [DataField("fullName", "B_OA_Organization")]
        public string fullName
        {
            get { return _fullName; }
            set { _fullName = value; }
        }
        private string _fullName;

        /// <summary>
        /// 是否选择
        /// </summary>
        public bool isSelected
        {
            get { return _isSelected; }
            set { _isSelected = value; }
        }
        private bool _isSelected;

    }
}
