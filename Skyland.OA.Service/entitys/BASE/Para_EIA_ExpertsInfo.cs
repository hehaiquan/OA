using IWorkFlow.DataBase;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IWorkFlow.ORM
{

    [Serializable]
    [DataTableInfo("Para_EIA_ExpertsInfo", "id")]
    public class Para_EIA_ExpertsInfo : QueryInfo
    {

        private int _id;
        private string _expertsid;
        private string _name;
        private string _tel;
        private string _hjyjzy;
        private string _tcdw;
        private string _cszy;
        private string _zhuanc;
        private string _zc;
        private string _zw;
        private string _dz;
        private string _remark;
        private string _sex ;
        private string _school; 
        private string _degree;
        private string _mobile;
        private string _birthday;
        private string _email;
        private string _fax;
        private string _zipcode;
        private string _sfcp;
        private string _zjlx;
        private string _qdzcsj;
        private string _sfhpgcs;
        private string _kstgsj;
        private string _zcdjlb;
        private string _major;
        private string _gzdw;
        private string _tjlx;
        private DateTime? _addtime;

        [DataField("id", "Para_EIA_ExpertsInfo", false)]
        public int id
        {
            set { _id = value; }
            get { return _id; }
        }

        [DataField("ExpertsId", "Para_EIA_ExpertsInfo")]
        public string ExpertsId
        {
            set { _expertsid = value; }
            get { return _expertsid; }
        }
        /// <summary>
        /// 
        /// </summary>
        /// 
        [DataField("name", "Para_EIA_ExpertsInfo")]
        public string name
        {
            set { _name = value; }
            get { return _name; }
        }
        /// <summary>
        /// 
        /// </summary>
        /// 
        [DataField("tel", "Para_EIA_ExpertsInfo")]
        public string tel
        {
            set { _tel = value; }
            get { return _tel; }
        }
        /// <summary>
        /// 环境研究专业
        /// </summary>
        /// 
        [DataField("hjyjzy", "Para_EIA_ExpertsInfo")]
        public string hjyjzy
        {
            set { _hjyjzy = value; }
            get { return _hjyjzy; }
        }
        /// <summary>
        /// 推荐单位
        /// </summary>
        /// 
        [DataField("tcdw", "Para_EIA_ExpertsInfo")]
        public string tcdw
        {
            set { _tcdw = value; }
            get { return _tcdw; }
        }
        /// <summary>
        /// 从事职业
        /// </summary>
        /// 
        [DataField("cszy", "Para_EIA_ExpertsInfo")]
        public string cszy
        {
            set { _cszy = value; }
            get { return _cszy; }
        }
        /// <summary>
        /// 专长
        /// </summary>
        /// 
        [DataField("zhuanc", "Para_EIA_ExpertsInfo")]
        public string zhuanc
        {
            set { _zhuanc = value; }
            get { return _zhuanc; }
        }
        /// <summary>
        /// 职称
        /// </summary>
        /// 
        [DataField("zc", "Para_EIA_ExpertsInfo")]
        public string zc
        {
            set { _zc = value; }
            get { return _zc; }
        }
        /// <summary>
        /// 职位
        /// </summary>
        /// 
        [DataField("zw", "Para_EIA_ExpertsInfo")]
        public string zw
        {
            set { _zw = value; }
            get { return _zw; }
        }
        /// <summary>
        /// 地址
        /// </summary>
        /// 
        [DataField("dz", "Para_EIA_ExpertsInfo")]
        public string dz
        {
            set { _dz = value; }
            get { return _dz; }
        }
        /// <summary>
        /// 备注
        /// </summary>
        /// 
        [DataField("remark", "Para_EIA_ExpertsInfo")]
        public string remark
        {
            set { _remark = value; }
            get { return _remark; }
        }

        /// <summary>
        /// 性别
        /// </summary>
        [DataField("sex", "Para_EIA_ExpertsInfo")]
        public string sex
        {
            set { _sex = value; }
            get { return _sex; }
        }

        /// <summary>
        /// 毕业学校
        /// </summary>
        [DataField("school", "Para_EIA_ExpertsInfo")]
        public string school
        {
            set { _school = value; }
            get { return _school; }
        }

        /// <summary>
        /// 学历
        /// </summary>
        [DataField("degree", "Para_EIA_ExpertsInfo")]
        public string degree
        {
            set { _degree = value; }
            get { return _degree; }
        }

        /// <summary>
        /// 手机号码
        /// </summary>
        [DataField("mobile", "Para_EIA_ExpertsInfo")]
        public string mobile
        {
            set { _mobile = value; }
            get { return _mobile; }
        }

        /// <summary>
        /// 出生年月
        /// </summary>
        [DataField("birthday", "Para_EIA_ExpertsInfo")]
        public string birthday
        {
            set { _birthday = value; }
            get { return _birthday; }
        }

        /// <summary>
        /// 电子邮箱
        /// </summary>
        [DataField("email", "Para_EIA_ExpertsInfo")]
        public string email
        {
            set { _email = value; }
            get { return _email; }
        }

        /// <summary>
        /// 传真
        /// </summary>
        [DataField("fax", "Para_EIA_ExpertsInfo")]
        public string fax
        {
            set { _fax = value; }
            get { return _fax; }
        }
      
        /// <summary>
        /// 邮编
        /// </summary>
        [DataField("zipcode", "Para_EIA_ExpertsInfo")]
        public string zipcode
        {
            set { _zipcode = value; }
            get { return _zipcode; }
        }
     
        /// <summary>
        /// 是否常聘
        /// </summary>
        [DataField("sfcp", "Para_EIA_ExpertsInfo")]
        public string sfcp
        {
            set { _sfcp = value; }
            get { return _sfcp; }
        }

        /// <summary>
        /// 专家类型
        /// </summary>
        [DataField("zjlx", "Para_EIA_ExpertsInfo")]
        public string zjlx
        {
            set { _zjlx = value; }
            get { return _zjlx; }
        }
    
        /// <summary>
        /// 取得职称时间
        /// </summary>
        [DataField("qdzcsj", "Para_EIA_ExpertsInfo")]
        public string qdzcsj
        {
            set { _qdzcsj = value; }
            get { return _qdzcsj; }
        }

        /// <summary>
        /// 是否环评工程师
        /// </summary>
        [DataField("sfhpgcs", "Para_EIA_ExpertsInfo")]
        public string sfhpgcs
        {
            set { _sfhpgcs = value; }
            get { return _sfhpgcs; }
        }
      
        /// <summary>
        /// 环评工程师考试通过时间
        /// </summary>
        [DataField("kstgsj", "Para_EIA_ExpertsInfo")]
        public string kstgsj
        {
            set { _kstgsj = value; }
            get { return _kstgsj; }
        }
       
        /// <summary>
        /// 环评工程师注册登记类别
        /// </summary>
        [DataField("zcdjlb", "Para_EIA_ExpertsInfo")]
        public string zcdjlb
        {
            set { _zcdjlb = value; }
            get { return _zcdjlb; }
        }

        /// <summary>
        /// 所学专业
        /// </summary>
        [DataField("major", "Para_EIA_ExpertsInfo")]
        public string major
        {
            set { _major = value; }
            get { return _major; }
        }
       
        /// <summary>
        /// 工作单位
        /// </summary>
        [DataField("gzdw", "Para_EIA_ExpertsInfo")]
        public string gzdw
        {
            set { _gzdw = value; }
            get { return _gzdw; }
        }

        /// <summary>
        /// 推荐类型
        /// </summary>
        [DataField("tjlx", "Para_EIA_ExpertsInfo")]
        public string tjlx
        {
            set { _tjlx = value; }
            get { return _tjlx; }
        }

        /// <summary>
        /// 添加时间
        /// </summary>
        [DataField("addtime", "Para_EIA_ExpertsInfo")]
        public DateTime? addtime
        {
            set { _addtime = value; }
            get { return _addtime; }
        }

        /// <summary>
        /// 专家类型名称（非数据表字段，只为显示需要）
        /// </summary>
        public string zjlxName
        {
            get { return _zjlxName; }
            set { _zjlxName = value; }
        }
        private string _zjlxName;

        /// <summary>
        /// 参加评审次数（非数据表字段，只为显示需要）
        /// </summary>
        public string cjpscs
        {
            get { return _cjpscs; }
            set { _cjpscs = value; }
        }
        private string _cjpscs;

        /// <summary>
        /// 是否选择（非数据表字段，只为显示需要）
        /// </summary>
        public bool isSelected
        {
            get { return _isSelected; }
            set { _isSelected = value; }
        }
        private bool _isSelected;
    }
}
