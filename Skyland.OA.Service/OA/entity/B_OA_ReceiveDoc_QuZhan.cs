using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using IWorkFlow.DataBase;
using System.Web;

namespace IWorkFlow.ORM
{
    [Serializable]
    [DataTableInfo("B_OA_ReceiveDoc_QuZhan", "id")]
    public class B_OA_ReceiveDoc_QuZhan : QueryInfo
    {

        [DataField("id", "B_OA_ReceiveDoc_QuZhan", false)]
        public int id
        {
            set { _id = value; }
            get { return _id; }
        }
        private int _id;

        [DataField("lwrq", "B_OA_ReceiveDoc_QuZhan")]
        public DateTime? lwrq
        {
            set { _lwrq = value; }
            get { return _lwrq; }
        }
        private DateTime? _lwrq;


        [DataField("code", "B_OA_ReceiveDoc_QuZhan")]
        public string code
        {
            set { _code = value; }
            get { return _code; }
        }
        private string _code;

        [DataField("lwdw", "B_OA_ReceiveDoc_QuZhan")]
        public string lwdw
        {
            set { _lwdw = value; }
            get { return _lwdw; }
        }
        private string _lwdw;

        [DataField("wjmc", "B_OA_ReceiveDoc_QuZhan")]
        public string wjmc
        {
            set { _wjmc = value; }
            get { return _wjmc; }
        }
        private string _wjmc;

        [DataField("caseid", "B_OA_ReceiveDoc_QuZhan")]
        public string caseid
        {
            set { _caseid = value; }
            get { return _caseid; }
        }
        private string _caseid;

        [DataField("remark", "B_OA_ReceiveDoc_QuZhan")]
        public string remark
        {
            set { _remark = value; }
            get { return _remark; }
        }
        private string _remark;

        [DataField("zbsj", "B_OA_ReceiveDoc_QuZhan")]
        public DateTime? zbsj
        {
            set { _zbsj = value; }
            get { return _zbsj; }
        }
        private DateTime? _zbsj;

        [DataField("lwdwTypeId", "B_OA_ReceiveDoc_QuZhan")]
        public string lwdwTypeId
        {
            set { _lwdwTypeId = value; }
            get { return _lwdwTypeId; }
        }
        private string _lwdwTypeId;

        [DataField("recordManId", "B_OA_ReceiveDoc_QuZhan")]
        public string recordManId
        {
            set { _recordManId = value; }
            get { return _recordManId; }
        }
        private string _recordManId;

        [DataField("recordManName", "B_OA_ReceiveDoc_QuZhan")]
        public string recordManName
        {
            set { _recordManName = value; }
            get { return _recordManName; }
        }
        private string _recordManName;

        [DataField("toDoSug", "B_OA_ReceiveDoc_QuZhan")]
        public string toDoSug
        {
            set { _toDoSug = value; }
            get { return _toDoSug; }
        }
        private string _toDoSug;
    }
}
