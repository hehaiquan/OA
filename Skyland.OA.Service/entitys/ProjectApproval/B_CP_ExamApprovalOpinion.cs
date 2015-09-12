using IWorkFlow.DataBase;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IWorkFlow.ORM
{
    [Serializable]
    [DataTableInfo("B_CP_ExamApprovalOpinion", "")]
    public class B_CP_ExamApprovalOpinion : QueryInfo
    {
        [DataField("id", "B_CP_ExamApprovalOpinion",false)]
        public int id
        {
            get { return this._id; }
            set { this._id = value; }
        }
        int _id;

        [DataField("jsxmbh", "B_CP_ExamApprovalOpinion")]
        public string jsxmbh
        {
            get { return this._jsxmbh; }
            set { this._jsxmbh = value; }
        }
        string _jsxmbh;

        [DataField("hppwsj", "B_CP_ExamApprovalOpinion")]
        public DateTime? hppwsj
        {
            get { return this._hppwsj; }
            set { this._hppwsj = value; }
        }
        DateTime? _hppwsj;

        [DataField("nwbh", "B_CP_ExamApprovalOpinion")]
        public string nwbh
        {
            get { return this._nwbh; }
            set { this._nwbh = value; }
        }
        string _nwbh;

        [DataField("nwrq", "B_CP_ExamApprovalOpinion")]
        public DateTime? nwrq
        {
            get { return this._nwrq; }
            set { this._nwrq = value; }
        }
        DateTime? _nwrq;

        [DataField("wjbt", "B_CP_ExamApprovalOpinion")]
        public string wjbt
        {
            get { return this._wjbt; }
            set { this._wjbt = value; }
        }
        string _wjbt;

        [DataField("zbbm", "B_CP_ExamApprovalOpinion")]
        public string zbbm
        {
            get { return this._zbbm; }
            set { this._zbbm = value; }
        }
        string _zbbm;

        [DataField("mj", "B_CP_ExamApprovalOpinion")]
        public string mj
        {
            get { return this._mj; }
            set { this._mj = value; }
        }
        string _mj;

        [DataField("jjcd", "B_CP_ExamApprovalOpinion")]
        public string jjcd
        {
            get { return this._jjcd; }
            set { this._jjcd = value; }
        }
        string _jjcd;

        [DataField("gkcd", "B_CP_ExamApprovalOpinion")]
        public string gkcd
        {
            get { return this._gkcd; }
            set { this._gkcd = value; }
        }
        string _gkcd;

        [DataField("zs", "B_CP_ExamApprovalOpinion")]
        public string zs
        {
            get { return this._zs; }
            set { this._zs = value; }
        }
        string _zs;

        [DataField("cb", "B_CP_ExamApprovalOpinion")]
        public string cb
        {
            get { return this._cb; }
            set { this._cb = value; }
        }
        string _cb;

        [DataField("cs", "B_CP_ExamApprovalOpinion")]
        public string cs
        {
            get { return this._cs; }
            set { this._cs = value; }
        }
        string _cs;

        [DataField("fwzh", "B_CP_ExamApprovalOpinion")]
        public string fwzh
        {
            get { return this._fwzh; }
            set { this._fwzh = value; }
        }
        string _fwzh;

        [DataField("bz", "B_CP_ExamApprovalOpinion")]
        public string bz
        {
            get { return this._bz; }
            set { this._bz = value; }
        }
        string _bz;

        [DataField("dzy", "B_CP_ExamApprovalOpinion")]
        public string dzy
        {
            get { return this._dzy; }
            set { this._dzy = value; }
        }
        string _dzy;

        [DataField("yx", "B_CP_ExamApprovalOpinion")]
        public string yx
        {
            get { return this._yx; }
            set { this._yx = value; }
        }
        string _yx;

        [DataField("ex", "B_CP_ExamApprovalOpinion")]
        public string ex
        {
            get { return this._ex; }
            set { this._ex = value; }
        }
        string _ex;

        [DataField("ztc", "B_CP_ExamApprovalOpinion")]
        public string ztc
        {
            get { return this._ztc; }
            set { this._ztc = value; }
        }
        string _ztc;



        [DataField("ys", "B_CP_ExamApprovalOpinion")]
        public string ys
        {
            get { return this._ys; }
            set { this._ys = value; }
        }
        string _ys;

    }
}
