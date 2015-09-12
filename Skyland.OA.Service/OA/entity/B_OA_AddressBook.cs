using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IWorkFlow.DataBase;

namespace IWorkFlow.ORM
{
    [Serializable]
    [DataTableInfo("B_OA_AddressBook", "id")]
    public class B_OA_AddressBook : QueryInfo
    {
        [DataField("id", "B_OA_AddressBook", false)]
        public int id
        {
            get { return _id; }
            set { _id = value; }
        }
        private int _id;

        // 姓名
        [DataField("name", "B_OA_AddressBook")]
        public string name
        {
            get { return _name; }
            set { _name = value; }
        }
        private string _name;

        // 电话号码
        [DataField("phone", "B_OA_AddressBook")]
        public string phone
        {
            get { return _phone; }
            set { _phone = value; }
        }
        private string _phone;

        // 单位电话
        [DataField("unitphone", "B_OA_AddressBook")]
        public string unitphone
        {
            get { return _unitphone; }
            set { _unitphone = value; }
        }
        private string _unitphone;

        // 移动电话
        [DataField("mobilephone", "B_OA_AddressBook")]
        public string mobilephone
        {
            get { return _mobilephone; }
            set { _mobilephone = value; }
        }
        private string _mobilephone;

        // 传真号
        [DataField("fax", "B_OA_AddressBook")]
        public string fax
        {
            get { return _fax; }
            set { _fax = value; }
        }
        private string _fax;

        // 电子邮件
        [DataField("email", "B_OA_AddressBook")]
        public string email
        {
            get { return _email; }
            set { _email = value; }
        }
        private string _email;


        private string _hobby;

        // 部门编号
        [DataField("dpid", "B_OA_AddressBook")]
        public string dpid
        {
            get { return _dpid; }
            set { _dpid = value; }
        }
        private string _dpid;

        // 部门名称
        [DataField("dpname", "B_OA_AddressBook")]
        public string dpname
        {
            get { return _dpname; }
            set { _dpname = value; }
        }
        private string _dpname;

        // 用户编号
        [DataField("userId", "B_OA_AddressBook")]
        public string userId
        {
            get { return _userId; }
            set { _userId = value; }
        }
        private string _userId;

        // 用户权限
        [DataField("personal", "B_OA_AddressBook")]
        public int personal
        {
            get { return _personal; }
            set { _personal = value; }
        }
        private int _personal;

        // 创建时间
        [DataField("createtime", "B_OA_AddressBook")]
        public DateTime createtime
        {
            get { return _createtime; }
            set { _createtime = value; }
        }
        private DateTime _createtime;

        // 通讯录拥有者
        [DataField("ownnerUserId", "B_OA_AddressBook")]
        public string ownnerUserId
        {
            get { return _ownnerUserId; }
            set { _ownnerUserId = value; }
        }
        private string _ownnerUserId;

    }// class
}
