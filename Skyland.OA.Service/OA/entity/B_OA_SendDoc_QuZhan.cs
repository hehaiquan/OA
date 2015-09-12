using IWorkFlow.DataBase;
using System;


namespace IWorkFlow.ORM
{
    [Serializable]
    [DataTableInfo("B_OA_SendDoc_QuZhan", "id")]
    public class B_OA_SendDoc_QuZhan : QueryInfo
    {
        #region Model
        private int _id;

        [DataField("id", "B_OA_SendDoc_QuZhan", false)]
        public int id
        {
            set { _id = value; }
            get { return _id; }
        }

        private string _title;

        [DataField("title", "B_OA_SendDoc_QuZhan")]
        public string title
        {
            set { _title = value; }
            get { return _title; }
        }

        private string _cs;

        [DataField("cs", "B_OA_SendDoc_QuZhan")]
        public string cs
        {
            set { _cs = value; }
            get { return _cs; }
        }

        private string _zs;

        [DataField("zs", "B_OA_SendDoc_QuZhan")]
        public string zs
        {
            set { _zs = value; }
            get { return _zs; }
        }

        [DataField("cb", "B_OA_SendDoc_QuZhan")]
        public string cb
        {
            set { _cb = value; }
            get { return _cb; }
        }
        private string _cb;


        [DataField("sendType", "B_OA_SendDoc_QuZhan")]
        public string sendType
        {
            set { _sendType = value; }
            get { return _sendType; }
        }
        private string _sendType;

        [DataField("printCount", "B_OA_SendDoc_QuZhan")]
        public string printCount
        {
            set { _printCount = value; }
            get { return _printCount; }
        }
        private string _printCount;


        [DataField("mj", "B_OA_SendDoc_QuZhan")]
        public string mj
        {
            set { _mj = value; }
            get { return _mj; }
        }
        private string _mj;

        [DataField("emergency", "B_OA_SendDoc_QuZhan")]
        public string emergency
        {
            set { _emergency = value; }
            get { return _emergency; }
        }
        private string _emergency;


        [DataField("caseid", "B_OA_SendDoc_QuZhan")]
        public string caseid
        {
            set { _caseid = value; }
            get { return _caseid; }
        }
        private string _caseid;

        [DataField("jd", "B_OA_SendDoc_QuZhan")]
        public string jd
        {
            set { _jd = value; }
            get { return _jd; }
        }
        private string _jd;

        [DataField("jdId", "B_OA_SendDoc_QuZhan")]
        public string jdId
        {
            set { _jdId = value; }
            get { return _jdId; }
        }
        private string _jdId;


        [DataField("fwrq", "B_OA_SendDoc_QuZhan")]
        public DateTime? fwrq
        {
            set { _fwrq = value; }
            get { return _fwrq; }
        }
        private DateTime? _fwrq;

        [DataField("guiHuanZhan", "B_OA_SendDoc_QuZhan")]
        public string guiHuanZhan
        {
            set { _guiHuanZhanq = value; }
            get { return _guiHuanZhanq; }
        }
        private string _guiHuanZhanq;

        [DataField("daiTingNiWen", "B_OA_SendDoc_QuZhan")]
        public string daiTingNiWen
        {
            set { _daiTingNiWen = value; }
            get { return _daiTingNiWen; }
        }
        private string _daiTingNiWen;

        [DataField("neiBuShiXiang", "B_OA_SendDoc_QuZhan")]
        public string neiBuShiXiang
        {
            set { _neiBuShiXiang = value; }
            get { return _neiBuShiXiang; }
        }
        private string _neiBuShiXiang;

        [DataField("qiTa", "B_OA_SendDoc_QuZhan")]
        public string qiTa
        {
            set { _qiTa = value; }
            get { return _qiTa; }
        }
        private string _qiTa;

        [DataField("mainBody", "B_OA_SendDoc_QuZhan")]
        public string mainBody
        {
            set { _mainBody = value; }
            get { return _mainBody; }
        }
        private string _mainBody;

        [DataField("sendCheckType", "B_OA_SendDoc_QuZhan")]
        public string sendCheckType
        {
            set { _sendCheckType = value; }
            get { return _sendCheckType; }
        }
        private string _sendCheckType;

        [DataField("createMan", "B_OA_SendDoc_QuZhan")]
        public string createMan
        {
            set { _createMan = value; }
            get { return _createMan; }
        }
        private string _createMan;

        [DataField("createManId", "B_OA_SendDoc_QuZhan")]
        public string createManId
        {
            set { _createManId = value; }
            get { return _createManId; }
        }
        private string _createManId;
        #endregion
    }
}
