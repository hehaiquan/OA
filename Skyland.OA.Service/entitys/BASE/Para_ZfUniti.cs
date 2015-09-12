using IWorkFlow.DataBase;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IWorkFlow.ORM
{
    [Serializable]
    [DataTableInfo("Para_ZfUniti", "id")]
    public class Para_ZfUniti : QueryInfo
    {
        
        [DataField("id", "Para_ZfUniti", false)]
        public int id
        {
            set { _id = value; }
            get { return _id; }
        }
        private int _id;

        [DataField("dwmc", "Para_ZfUniti")]
        public string dwmc
        {
            set { _dwmc = value; }
            get { return _dwmc; }
        }
        private string _dwmc;

        [DataField("lxr", "Para_ZfUniti")]
        public string lxr
        {
            set { _lxr = value; }
            get { return _lxr; }
        }
        private string _lxr;

        [DataField("lxdh", "Para_ZfUniti")]
        public string lxdh
        {
            set { _lxdh = value; }
            get { return _lxdh; }
        }
        private string _lxdh;

        [DataField("cz", "Para_ZfUniti")]
        public string cz
        {
            set { _cz = value; }
            get { return _cz; }
        }
        private string _cz;

        [DataField("txdz", "Para_ZfUniti")]
        public string txdz
        {
            set { _txdz = value; }
            get { return _txdz; }
        }
        private string _txdz;

        [DataField("yzbm", "Para_ZfUniti")]
        public string yzbm
        {
            set { _yzbm = value; }
            get { return _yzbm; }
        }
        private string _yzbm;



    }
}
