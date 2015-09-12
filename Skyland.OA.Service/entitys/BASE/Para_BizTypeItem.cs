using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using IWorkFlow.DataBase;

namespace IWorkFlow.ORM
{
    //Para_BizTypeItem
    [Serializable]
    [DataTableInfo("Para_BizTypeItem", "")]
    public class Para_BizTypeItem : QueryInfo
    {
        /// <summary>
        /// id  自增字段必须添加false
        /// </summary>		
        [DataField("id", "Para_BizTypeItem", false)]
        public int? id
        {
            get { return _id; }
            set { _id = value; }
        }
        private int? _id;
        /// <summary>
        /// 参数值
        /// </summary>		
        [DataField("csz", "Para_BizTypeItem")]
        public string csz
        {
            get { return _csz; }
            set { _csz = value; }
        }
        private string _csz;
        /// <summary>
        /// 参数名称
        /// </summary>		
        [DataField("mc", "Para_BizTypeItem")]
        public string mc
        {
            get { return _mc; }
            set { _mc = value; }
        }
        private string _mc;
        /// <summary>
        /// 父类ID
        /// </summary>		
        [DataField("flid", "Para_BizTypeItem")]
        public string flid
        {
            get { return _flid; }
            set { _flid = value; }
        }
        private string _flid;
        /// <summary>
        /// 排序号，排序时使用
        /// </summary>		
        [DataField("pxh", "Para_BizTypeItem")]
        public string pxh
        {
            get { return _pxh; }
            set { _pxh = value; }
        }
        private string _pxh;
        /// <summary>
        /// 是否启用该参数
        /// </summary>		
        [DataField("sfqy", "Para_BizTypeItem")]
        public string sfqy
        {
            get { return _sfqy; }
            set { _sfqy = value; }
        }
        private string _sfqy;
        /// <summary>
        /// 上报代码
        /// </summary>		
        [DataField("sbdm", "Para_BizTypeItem")]
        public string sbdm
        {
            get { return _sbdm; }
            set { _sbdm = value; }
        }
        private string _sbdm;
        /// <summary>
        /// 创建时间
        /// </summary>		
        [DataField("cjsj", "Para_BizTypeItem")]
        public DateTime? cjsj
        {
            get { return _cjsj; }
            set { _cjsj = value; }
        }
        private DateTime? _cjsj;

        private string _flmc;
        public string flmc
        {
            get { return _flmc; }
            set { _flmc = value; }
        }
    }
}