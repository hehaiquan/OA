using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using IWorkFlow.DataBase;

namespace IWorkFlow.ORM
{
    //Para_BizTypeDictionary
    [Serializable]
    [DataTableInfo("Para_BizTypeDictionary", "id")]
    public class Para_BizTypeDictionary : QueryInfo
    {
        /// <summary>
        /// id
        /// </summary>		
        [DataField("id", "Para_BizTypeDictionary",false)]
        public int? id
        {
            get { return _id; }
            set { _id = value; }
        }
        private int? _id;
        /// <summary>
        /// 参数类型，key
        /// </summary>		
        [DataField("lx", "Para_BizTypeDictionary")]
        public string lx
        {
            get { return _lx; }
            set { _lx = value; }
        }
        private string _lx;
        /// <summary>
        /// 参数名称
        /// </summary>		
        [DataField("mc", "Para_BizTypeDictionary")]
        public string mc
        {
            get { return _mc; }
            set { _mc = value; }
        }
        private string _mc;
        /// <summary>
        /// 创建时间
        /// </summary>		
        [DataField("cjsj", "Para_BizTypeDictionary")]
        public DateTime? cjsj
        {
            get { return _cjsj; }
            set { _cjsj = value; }
        }
        private DateTime? _cjsj;
        /// <summary>
        /// 是否启用，默认为1，1为启用
        /// </summary>		
        [DataField("sfqy", "Para_BizTypeDictionary")]
        public string sfqy
        {
            get { return _sfqy; }
            set { _sfqy = value; }
        }
        private string _sfqy;
        /// <summary>
        /// 权限组集名称
        /// </summary>		
        [DataField("qxzj", "Para_BizTypeDictionary")]
        public string qxzj
        {
            get { return _qxzj; }
            set { _qxzj = value; }
        }
        private string _qxzj;
        /// <summary>
        /// 备注
        /// </summary>		
        [DataField("bz", "Para_BizTypeDictionary")]
        public string bz
        {
            get { return _bz; }
            set { _bz = value; }
        }
        private string _bz;
    }
}