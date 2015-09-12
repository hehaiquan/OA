using IWorkFlow.DataBase;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IWorkFlow.ORM
{
    [Serializable]
    [DataTableInfo("B_YYYD_Comparison", "ID")]
    public class B_YYYD_Comparison : QueryInfo
    {
        [DataField("ID", "B_YYYD_Comparison")]
        public int ID
        {
            get { return this._ID; }
            set { this._ID = value; }
        }
        int _ID;

        [DataField("qydm", "B_YYYD_Comparison")]
        public string qydm
        {
            get { return this._qydm; }
            set { this._qydm = value; }
        }
        string _qydm;

        [DataField("sjly", "B_YYYD_Comparison")]
        public string sjly
        {
            get { return this._sjly; }
            set { this._sjly = value; }
        }
        string _sjly;

        [DataField("dybm", "B_YYYD_Comparison")]
        public string dybm
        {
            get { return this._dybm; }
            set { this._dybm = value; }
        }
        string _dybm;

    }
}