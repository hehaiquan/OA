using IWorkFlow.DataBase;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace  IWorkFlow.ORM
{
    [Serializable]
    [DataTableInfo("B_OA_CommonCode", "id")]
    public class B_OA_CommonCode: QueryInfo
    {
        /// <summary>
        ///
        /// </summary>
        /// 
        [DataField("id", "B_OA_CommonCode",false)]
        public int id
        {
            set { _id = value; }
            get { return _id; }
        }
        private int _id;

        /// <summary>
        ///代码号
        /// </summary>
        /// 
        [DataField("code", "B_OA_CommonCode")]
        public string code
        {
            set { _code = value; }
            get { return _code; }
        }
        private string _code;

        /// <summary>
        ///代码类型
        /// </summary>
        /// 
        [DataField("type", "B_OA_CommonCode")]
        public string type
        {
            set { _type = value; }
            get { return _type; }
        }
        private string _type;

        /// <summary>
        ///拼接字段
        /// </summary>
        /// 
        [DataField("flCode", "B_OA_CommonCode")]
        public string flCode
        {
            set { _flCode = value; }
            get { return _flCode; }
        }
        private string _flCode;

    }
}
