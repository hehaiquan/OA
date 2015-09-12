using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using IWorkFlow.DataBase;

namespace IWorkFlow.ORM
{
    //FX_BArea
    [Serializable]
    [DataTableInfo("FX_BArea", "")]
    public class FX_BArea : QueryInfo
    {
        /// <summary>
        /// AID
        /// </summary>		
        [DataField("AID", "FX_BArea")]
        public string AID
        {
            get { return _aid; }
            set { _aid = value; }
        }
        private string _aid;
        /// <summary>
        /// AName
        /// </summary>		
        [DataField("AName", "FX_BArea")]
        public string AName
        {
            get { return _aname; }
            set { _aname = value; }
        }
        private string _aname;
        /// <summary>
        /// AIndex
        /// </summary>		
        [DataField("AIndex", "FX_BArea")]
        public int? AIndex
        {
            get { return _aindex; }
            set { _aindex = value; }
        }
        private int? _aindex;
    }
}