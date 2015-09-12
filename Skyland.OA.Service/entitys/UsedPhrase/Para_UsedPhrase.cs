using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IWorkFlow.DataBase;

namespace IWorkFlow.ORM
{
    [DataTableInfo("Para_UsedPhrase", "id")]
    public class Para_UsedPhrase : QueryInfo
    {
        #region Model
        private int _id;
        private string _cjrid;//创建人用户ID
        private string _nr;//常用语内容
        private string _lx;//常用语类型
        private string _ms;//常用语描述
        private DateTime? _cjsj;//创建时间
        private string _bmid;//创建人部门ID
        private int _sypl;//使用频率

        /// <summary>
        /// 常用语id
        /// </summary>
        /// 
        [DataField("id", "Para_UsedPhrase", false)]
        public int id
        {
            set { _id = value; }
            get { return _id; }
        }
        /// <summary>
        /// 创建人用户ID
        /// </summary>
        /// 
        [DataField("cjrid", "Para_UsedPhrase")]
        public string cjrid
        {
            set { _cjrid = value; }
            get { return _cjrid; }
        }
        /// <summary>
        /// 常用语内容
        /// </summary>
        /// 
        [DataField("nr", "Para_UsedPhrase")]
        public string nr
        {
            set { _nr = value; }
            get { return _nr; }
        }

        /// <summary>
        /// 常用语类型
        /// </summary>
        /// 
        [DataField("lx", "Para_UsedPhrase")]
        public string lx
        {
            set { _lx = value; }
            get { return _lx; }
        }


        /// <summary>
        /// 常用语描述
        /// </summary>
        /// 
        [DataField("ms", "Para_UsedPhrase")]
        public string ms
        {
            set { _ms = value; }
            get { return _ms; }
        }


        /// <summary>
        /// 创建时间
        /// </summary>
        /// 
        [DataField("cjsj", "Para_UsedPhrase")]
        public DateTime? cjsj
        {
            set { _cjsj = value; }
            get { return _cjsj; }
        }

        /// <summary>
        /// 创建人部门ID
        /// </summary>
        /// 
        [DataField("bmid", "Para_UsedPhrase")]
        public string bmid
        {
            set { _bmid = value; }
            get { return _bmid; }
        }

        /// <summary>
        /// 使用频率
        /// </summary>
        [DataField("sypl", "Para_UsedPhrase")]
        public int sypl
        {
            set { _sypl = value; }
            get { return _sypl; }
        }

        #endregion Model
    }
}
