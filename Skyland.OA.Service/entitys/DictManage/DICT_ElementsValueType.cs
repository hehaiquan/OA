using IWorkFlow.DataBase;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IWorkFlow.ORM
{
    [Serializable]
    [DataTableInfo("DICT_ElementsValueType", "EVT_ID")]
    public class DICT_ElementsValueType : QueryInfo
    {
        /// <summary>
        /// 主键
        /// </summary>
        [DataField("EVT_ID", "DICT_ElementsValueType", false)]
        public int EVT_ID { get; set; }

        /// <summary>
        /// 字典类型
        /// </summary>
        [DataField("EVTType", "DICT_ElementsValueType")]
        public int EVTType { get; set; }

        /// <summary>
        /// 字典代码
        /// </summary>
        [DataField("EVTCode", "DICT_ElementsValueType")]
        public string EVTCode { get; set; }

        /// <summary>
        /// 字典名称
        /// </summary>
        [DataField("EVTName", "DICT_ElementsValueType")]
        public string EVTName { get; set; }

        //字典类型名称
        public string EVTTypeName { get; set; }

    }
}
