using IWorkFlow.DataBase;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IWorkFlow.ORM
{
    [Serializable]
    [DataTableInfo("Para_CP_ProjectTrade", "")]
    public class Para_CP_ProjectTrade : QueryInfo
    {
        [DataField("TradeCode", "Para_CP_ProjectTrade")]
        public string TradeCode
        {
            get { return this._TradeCode; }
            set { this._TradeCode = value; }
        }
        string _TradeCode;

        [DataField("TradeName", "Para_CP_ProjectTrade")]
        public string TradeName
        {
            get { return this._TradeName; }
            set { this._TradeName = value; }
        }
        string _TradeName;

        [DataField("ParentCode", "Para_CP_ProjectTrade")]
        public string ParentCode
        {
            get { return this._ParentCode; }
            set { this._ParentCode = value; }
        }
        string _ParentCode;

        [DataField("Old", "Para_CP_ProjectTrade")]
        public int Old
        {
            get { return this._Old; }
            set { this._Old = value; }
        }
        int _Old;

    }
}