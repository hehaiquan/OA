using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IWorkFlow.DataBase;

namespace IWorkFlow.ORM
{
    [DataTableInfo("Para_EmissionFate", "dm")]
    public class Para_EmissionFate : QueryInfo
    {
        #region Model
        private string _dm;
        private string _mc;
        /// <summary>
        /// 
        /// </summary>
        /// 
         [DataField("dm", "Para_EmissionFate")]
        public string dm
        {
            set { _dm = value; }
            get { return _dm; }
        }
        /// <summary>
        /// 
        /// </summary>
        /// 
         [DataField("mc", "Para_EmissionFate")]
        public string mc
        {
            set { _mc = value; }
            get { return _mc; }
        }
        #endregion Model
    }
}
