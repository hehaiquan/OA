using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IWorkFlow.DataBase;

namespace IWorkFlow.ORM
{
    [DataTableInfo("Para_LawRegulations", "")]
    public class Para_LawRegulations : QueryInfo
    {
        #region 定义私有变量
        private int _id;// 编号
        private string _nr;// 条款内容
        private string _ts;// 条数，例如第几条
        private string _ks;// 款数，例如第几款
        private string _mc;// 法规名称
        private int _pxh;// 排序号 
        #endregion

        /// <summary>
        /// 编号
        /// </summary>
        [DataField("ID", "Para_LawRegulations")]
        public int ID
        {
            get { return _id; }
            set { _id = value; }
        }

        /// <summary>
        /// 条款内容
        /// </summary>
        [DataField("nr", "Para_LawRegulations")]
        public string nr
        {
            get { return _nr; }
            set { _nr = value; }
        }

        /// <summary>
        /// 条数，例如第几条
        /// </summary>
        [DataField("ts", "Para_LawRegulations")]
        public string ts
        {
            get { return _ts; }
            set { _ts = value; }
        }

        /// <summary>
        /// 款数，例如第几款
        /// </summary>
        [DataField("ks", "Para_LawRegulations")]
        public string ks
        {
            get { return _ks; }
            set { _ks = value; }
        }

        /// <summary>
        /// 法规名称
        /// </summary>
        [DataField("mc", "Para_LawRegulations")]
        public string mc
        {
            get { return _mc; }
            set { _mc = value; }
        }

        /// <summary>
        /// 排序号
        /// </summary>
        [DataField("pxh", "Para_LawRegulations")]
        public int pxh
        {
            get { return _pxh; }
            set { _pxh = value; }
        }

    }// class
}
