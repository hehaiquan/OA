using IWorkFlow.DataBase;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IWorkFlow.ORM
{

    [Serializable]
    [DataTableInfo("Para_CP_EIACompany", "id")]
    public class Para_CP_EIACompany : QueryInfo
    {
        #region Model
        private int _id;
        private string _jgmc;
        private string _frdb;
        private string _zsbh;
        private string _yxq;
        private string _pjfw;
        private string _hbzzry;
        private string _lxr;
        private string _lxdh;
        private string _cz;
        private string _txdz;
        private string _jgbh;
        private string _yzbm;
        /// <summary>
        /// 
        /// </summary>
        /// 
        [DataField("id", "Para_CP_EIACompany", false)]
        public int id
        {
            set { _id = value; }
            get { return _id; }
        }
        /// <summary>
        /// 机构名称
        /// </summary>
        /// 
        [DataField("jgmc", "Para_CP_EIACompany")]
        public string jgmc
        {
            set { _jgmc = value; }
            get { return _jgmc; }
        }
        /// <summary>
        /// 法人代表
        /// </summary>
        /// 
        [DataField("frdb", "Para_CP_EIACompany")]
        public string frdb
        {
            set { _frdb = value; }
            get { return _frdb; }
        }
        /// <summary>
        /// 证书编号
        /// </summary>
        /// 
        [DataField("zsbh", "Para_CP_EIACompany")]
        public string zsbh
        {
            set { _zsbh = value; }
            get { return _zsbh; }
        }
        /// <summary>
        /// 有效期
        /// </summary>
        /// 
        [DataField("yxq", "Para_CP_EIACompany")]
        public string yxq
        {
            set { _yxq = value; }
            get { return _yxq; }
        }
        /// <summary>
        /// 评价范围
        /// </summary>
        /// 
        [DataField("pjfw", "Para_CP_EIACompany")]
        public string pjfw
        {
            set { _pjfw = value; }
            get { return _pjfw; }
        }
        /// <summary>
        /// 环评专职人员
        /// </summary>
        /// 
        [DataField("hbzzry", "Para_CP_EIACompany")]
        public string hbzzry
        {
            set { _hbzzry = value; }
            get { return _hbzzry; }
        }
        /// <summary>
        /// 汕头业务联系人
        /// </summary>
        /// 
        [DataField("lxr", "Para_CP_EIACompany")]
        public string lxr
        {
            set { _lxr = value; }
            get { return _lxr; }
        }
        /// <summary>
        /// 联系电话
        /// </summary>
        /// 
        [DataField("lxdh", "Para_CP_EIACompany")]
        public string lxdh
        {
            set { _lxdh = value; }
            get { return _lxdh; }
        }
        /// <summary>
        /// 传真
        /// </summary>
        /// 
        [DataField("cz", "Para_CP_EIACompany")]
        public string cz
        {
            set { _cz = value; }
            get { return _cz; }
        }
        /// <summary>
        /// 通讯地址
        /// </summary>
        /// 
        [DataField("txdz", "Para_CP_EIACompany")]
        public string txdz
        {
            set { _txdz = value; }
            get { return _txdz; }
        }
        /// <summary>
        /// 机构编号
        /// </summary>
        /// 
        [DataField("jgbh", "Para_CP_EIACompany")]
        public string jgbh
        {
            set { _jgbh = value; }
            get { return _jgbh; }
        }
        /// <summary>
        /// 邮政编码
        /// </summary>
        /// 
        [DataField("yzbm", "Para_CP_EIACompany")]
        public string yzbm
        {
            set { _yzbm = value; }
            get { return _yzbm; }
        }


        /// <summary>
        /// 法人手机
        /// </summary>
        [DataField("frsj", "Para_CP_EIACompany")]
        public string frsj
        {
            set { _frsj = value; }
            get { return _frsj; }
        }
        private string _frsj;

        /// <summary>
        /// 法人座机
        /// </summary>
        [DataField("frzj", "Para_CP_EIACompany")]
        public string frzj
        {
            set { _frzj = value; }
            get { return _frzj; }
        }
        private string _frzj;

        #endregion Model
    }
}
