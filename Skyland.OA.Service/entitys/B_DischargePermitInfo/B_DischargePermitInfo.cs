using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IWorkFlow.DataBase;

namespace IWorkFlow.ORM
{
    [Serializable]
    [DataTableInfo("B_DischargePermitInfo", "id")]
    public class B_DischargePermitInfo : QueryInfo
    {
        // 编号
        [DataField("id", "B_DischargePermitInfo", false)]
        public int id { get { return _id; } set { _id = value; } }
        private int _id;
        // 许可证编号
        [DataField("credentialid", "B_DischargePermitInfo")]
        public string credentialid { get { return _credentialid; } set { _credentialid = value; } }
        private string _credentialid;
        // 证件名称
        [DataField("credentialname", "B_DischargePermitInfo")]
        public string credentialname { get { return _credentialname; } set { _credentialname = value; } }
        private string _credentialname;
        // 污染源代码
        [DataField("unitid", "B_DischargePermitInfo")]
        public string unitid { get { return _unitid; } set { _unitid = value; } }
        private string _unitid;
        // 污染源名称
        [DataField("unitname", "B_DischargePermitInfo")]
        public string unitname { get { return _unitname; } set { _unitname = value; } }
        private string _unitname;
        // 法人代表
        [DataField("artificialperson", "B_DischargePermitInfo")]
        public string artificialperson { get { return _artificialperson; } set { _artificialperson = value; } }
        private string _artificialperson;
        // 单位地址
        [DataField("unitaddress", "B_DischargePermitInfo")]
        public string unitaddress { get { return _unitaddress; } set { _unitaddress = value; } }
        private string _unitaddress;
        [DataField("credentialcontent", "B_DischargePermitInfo")]
        // 许可内容
        public string credentialcontent { get { return _credentialcontent; } set { _credentialcontent = value; } }
        private string _credentialcontent;
        // 证书编号
        [DataField("credentialno", "B_DischargePermitInfo")]
        public string credentialno { get { return _credentialno; } set { _credentialno = value; } }
        private string _credentialno;
        // 有效日期
        [DataField("effectivedate", "B_DischargePermitInfo")]
        public DateTime? effectivedate { get { return _effectivedate; } set { _effectivedate = value; } }
        private DateTime? _effectivedate;
        // 发证机关
        [DataField("organization", "B_DischargePermitInfo")]
        public string organization { get { return _organization; } set { _organization = value; } }
        private string _organization;
        // 发证日期
        [DataField("presentationdate", "B_DischargePermitInfo")]
        public string presentationdate { get { return _presentationdate; } set { _presentationdate = value; } }
        private string _presentationdate;
        // 行政区
        [DataField("areacode", "B_DischargePermitInfo")]
        public string areacode { get { return _areacode; } set { _areacode = value; } }
        private string _areacode;
        // 证件类型（0：新证；1：换证）
        [DataField("credentialtype", "B_DischargePermitInfo")]
        public string credentialtype { get { return _credentialtype; } set { _credentialtype = value; } }
        private string _credentialtype;
        //  审批人
        [DataField("approver", "B_DischargePermitInfo")]
        public string approver { get { return _approver; } set { _approver = value; } }
        private string _approver;
        // 审批时间
        [DataField("approvedate", "B_DischargePermitInfo")]
        public DateTime? approvedate { get { return _approvedate; } set { _approvedate = value; } }
        private DateTime? _approvedate;
        // 年审时间
        [DataField("annualreviewdate", "B_DischargePermitInfo")]
        public DateTime? annualreviewdate { get { return _annualreviewdate; } set { _annualreviewdate = value; } }
        private DateTime? _annualreviewdate;
        // 年审到期日期
        [DataField("limitdate", "B_DischargePermitInfo")]
        public DateTime? limitdate { get { return _limitdate; } set { _limitdate = value; } }
        private DateTime? _limitdate;
        // 打印时间
        [DataField("printdate", "B_DischargePermitInfo")]
        public DateTime? printdate { get { return _printdate; } set { _printdate = value; } }
        private DateTime? _printdate;
        // 打印次数
        [DataField("printtimes", "B_DischargePermitInfo")]
        public int? printtimes { get { return _printtimes; } set { _printtimes = value; } }
        private int? _printtimes;
        // 是否注销
        [DataField("islogout", "B_DischargePermitInfo")]
        public int? islogout { get { return _islogout; } set { _islogout = value; } }
        private int? _islogout;
        // 注销日期
        [DataField("logoutdate", "B_DischargePermitInfo")]
        public DateTime? logoutdate { get { return _logoutdate; } set { _logoutdate = value; } }
        private DateTime? _logoutdate;
        // 操作人
        [DataField("optor", "B_DischargePermitInfo")]
        public string optor { get { return _optor; } set { _optor = value; } }
        private string _optor;
        // 创建时间
        [DataField("createdate", "B_DischargePermitInfo")]
        public DateTime? createdate { get { return _createdate; } set { _createdate = value; } }
        private DateTime? _createdate;

    }// class
}
