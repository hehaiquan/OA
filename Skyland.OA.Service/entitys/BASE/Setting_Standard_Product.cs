using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IWorkFlow.DataBase;

namespace IWorkFlow.ORM
{
    [DataTableInfo("Setting_Standard_Product", "ProductID")]
    class Setting_Standard_Product : QueryInfo
    {
        #region Model
        private int _productid;
        private string _productname;
        private string _emissionunits;
        private decimal? _emissionvalue;
        private string _remark;
        /// <summary>
        /// 
        /// </summary>
        public int ProductID
        {
            set { _productid = value; }
            get { return _productid; }
        }
        /// <summary>
        /// 
        /// </summary>
        public string ProductName
        {
            set { _productname = value; }
            get { return _productname; }
        }
        /// <summary>
        /// 
        /// </summary>
        public string EmissionUnits
        {
            set { _emissionunits = value; }
            get { return _emissionunits; }
        }
        /// <summary>
        /// 
        /// </summary>
        public decimal? EmissionValue
        {
            set { _emissionvalue = value; }
            get { return _emissionvalue; }
        }
        /// <summary>
        /// 
        /// </summary>
        public string Remark
        {
            set { _remark = value; }
            get { return _remark; }
        }
        #endregion Model
    }
}
