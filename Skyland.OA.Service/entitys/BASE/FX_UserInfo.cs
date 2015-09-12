using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using IWorkFlow.DataBase;

namespace IWorkFlow.ORM
{
    //FX_UserInfo
    [Serializable]
    [DataTableInfo("FX_UserInfo", "")]
    public class FX_UserInfo : QueryInfo
    {
        /// <summary>
        /// 用户编号
        /// </summary>		
        [DataField("UserID", "FX_UserInfo")]
        public string UserID
        {
            get { return _userid; }
            set { _userid = value; }
        }

        private string _userid;

        /// <summary>
        /// 英文名称
        /// </summary>		
        [DataField("EnName", "FX_UserInfo")]
        public string EnName
        {
            get { return _enname; }
            set { _enname = value; }
        }

        private string _enname;

        /// <summary>
        /// 密码
        /// </summary>		
        [DataField("PWD", "FX_UserInfo")]
        public string PWD
        {
            get { return _pwd; }
            set { _pwd = value; }
        }

        private string _pwd;

        /// <summary>
        /// 部门编号
        /// </summary>		
        [DataField("DPID", "FX_UserInfo")]
        public string DPID
        {
            get { return _dpid; }
            set { _dpid = value; }
        }

        private string _dpid;

        /// <summary>
        /// 中文名称
        /// </summary>		
        [DataField("CnName", "FX_UserInfo")]
        public string CnName
        {
            get { return _cnname; }
            set { _cnname = value; }
        }

        private string _cnname;

        /// <summary>
        /// 性别
        /// </summary>		
        [DataField("SEX", "FX_UserInfo")]
        public int? SEX
        {
            get { return _sex; }
            set { _sex = value; }
        }

        private int? _sex;

        /// <summary>
        /// 联系电话
        /// </summary>		
        [DataField("Phone", "FX_UserInfo")]
        public string Phone
        {
            get { return _phone; }
            set { _phone = value; }
        }

        private string _phone;

        /// <summary>
        /// EMail邮箱
        /// </summary>		
        [DataField("EMail", "FX_UserInfo")]
        public string EMail
        {
            get { return _email; }
            set { _email = value; }
        }

        private string _email;

        /// <summary>
        /// 传真号
        /// </summary>		
        [DataField("FoxNum", "FX_UserInfo")]
        public string FoxNum
        {
            get { return _foxnum; }
            set { _foxnum = value; }
        }

        private string _foxnum;

        /// <summary>
        /// 联系地址
        /// </summary>		
        [DataField("Address", "FX_UserInfo")]
        public string Address
        {
            get { return _address; }
            set { _address = value; }
        }

        private string _address;

        /// <summary>
        /// PostNum
        /// </summary>		
        [DataField("PostNum", "FX_UserInfo")]
        public string PostNum
        {
            get { return _postnum; }
            set { _postnum = value; }
        }

        private string _postnum;

        /// <summary>
        /// DesText
        /// </summary>		
        [DataField("DesText", "FX_UserInfo")]
        public string DesText
        {
            get { return _destext; }
            set { _destext = value; }
        }

        private string _destext;

        /// <summary>
        /// RuleID
        /// </summary>		
        [DataField("RuleID", "FX_UserInfo")]
        public string RuleID
        {
            get { return _ruleid; }
            set { _ruleid = value; }
        }

        private string _ruleid;

        /// <summary>
        /// UIConfig
        /// </summary>		
        [DataField("UIConfig", "FX_UserInfo")]
        public string UIConfig
        {
            get { return _uiconfig; }
            set { _uiconfig = value; }
        }

        private string _uiconfig;

        /// <summary>
        /// PortalConfig
        /// </summary>		
        [DataField("PortalConfig", "FX_UserInfo")]
        public string PortalConfig
        {
            get { return _portalconfig; }
            set { _portalconfig = value; }
        }

        private string _portalconfig;

        /// <summary>
        /// RankID
        /// </summary>		
        [DataField("RankID", "FX_UserInfo")]
        public string RankID
        {
            get { return _rankid; }
            set { _rankid = value; }
        }

        private string _rankid;
    }
}