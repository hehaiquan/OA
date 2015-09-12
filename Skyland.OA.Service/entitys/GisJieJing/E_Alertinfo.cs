using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using IWorkFlow.DataBase;

namespace IWorkFlow.ORM
{
    [Serializable]
    [DataTableInfo("E_Alertinfo", "id")]
    public class E_Alertinfo : QueryInfo
    {
        private decimal? _nbjjssje;//直接经济损失
        private string _jarq;//结案日期
        private string _cljg;//处理结果
        private string _zyylwt;//主要遗留问题
        private string _jd;//经度
        private string _wd;//纬度
        private string _tp;//图片
        private string _fj;//附件


        [DataField("id", "E_Alertinfo", false)]
        public int id
        {
            get { return this._id; }
            set { this._id = value; }
        }
        int _id;

        [DataField("sjmc", "E_Alertinfo")]
        public string sjmc
        {
            get { return this._sjmc; }
            set { this._sjmc = value; }
        }
        string _sjmc;

        [DataField("jjsj", "E_Alertinfo")]
        public string jjsj
        {
            
            set { this._jjsj = value; }
            get
            {
                if (_jjsj != null && _jjsj != "")
                {
                    return Convert.ToDateTime(_jjsj).ToShortDateString().Replace("/", "-");
                }
                else
                {
                    return null;
                }
            }
        }
        string _jjsj;//接警时间

        [DataField("bgdqsj", "E_Alertinfo")]
        public string bgdqsj
        {
            get {  
            
                if (_bgdqsj != null && _bgdqsj != "")
                {
                    return Convert.ToDateTime(_bgdqsj).ToShortDateString().Replace("/", "-");
                }
                else
                {
                    return null;
                }
             }
            set { this._bgdqsj = value; }
        }
        string _bgdqsj;//报告到期时间

        [DataField("bjly", "E_Alertinfo")]
        public string bjly
        {
            get { return this._bjly; }
            set { this._bjly = value; }
        }
        string _bjly;//报警来源

        [DataField("lxr", "E_Alertinfo")]
        public string lxr  //联系人
        {
            get { return this._lxr; }
            set { this._lxr = value; }
        }
        string _lxr;

        [DataField("lxrdh", "E_Alertinfo")]
        public string lxrdh
        {
            get { return this._lxrdh; }
            set { this._lxrdh = value; }
        }
        string _lxrdh;//联系人电话

        [DataField("fssj", "E_Alertinfo")]
        public string fssj
        {
            get
            {
                if (_fssj != null && _fssj != "")
                {
                    return Convert.ToDateTime(_fssj).ToShortDateString().Replace("/", "-");
                }
                else
                {
                    return null;
                }
            }
            set { this._fssj = value; }
        }
        string _fssj;//发生时间

        [DataField("sjdd", "E_Alertinfo")]
        public string sjdd
        {
            get { return this._sjdd; }
            set { this._sjdd = value; }
        }
        string _sjdd;//事件地点

        [DataField("sjqy", "E_Alertinfo")]
        public string sjqy
        {
            get { return this._sjqy; }
            set { this._sjqy = value; }
        }
        string _sjqy;//事件起因

        [DataField("sjxz", "E_Alertinfo")]
        public string sjxz
        {
            get { return this._sjxz; }
            set { this._sjxz = value; }
        }
        string _sjxz;//事件性质

        [DataField("sjjb", "E_Alertinfo")]
        public string sjjb
        {
            get { return this._sjjb; }
            set { this._sjjb = value; }
        }
        string _sjjb;//事件级别

        [DataField("jbgc", "E_Alertinfo")]
        public string jbgc
        {
            get { return this._jbgc; }
            set { this._jbgc = value; }
        }
        string _jbgc;//基本过程

        [DataField("zywrw", "E_Alertinfo")]
        public string zywrw
        {
            get { return this._zywrw; }
            set { this._zywrw = value; }
        }
        string _zywrw;//主要污染源

        [DataField("wrwsl", "E_Alertinfo")]
        public string wrwsl
        {
            get { return this._wrwsl; }
            set { this._wrwsl = value; }
        }
        string _wrwsl;//污染源数量

        [DataField("ryshqk", "E_Alertinfo")]
        public string ryshqk
        {
            get { return this._ryshqk; }
            set { this._ryshqk = value; }
        }
        string _ryshqk;//人员受害情况

        [DataField("mgdsyxqk", "E_Alertinfo")]
        public string mgdsyxqk
        {
            get { return this._mgdsyxqk; }
            set { this._mgdsyxqk = value; }
        }
        string _mgdsyxqk;//敏感点受影响情况

        [DataField("sjfzqs", "E_Alertinfo")]
        public string sjfzqs
        {
            get { return this._sjfzqs; }
            set { this._sjfzqs = value; }
        }
        string _sjfzqs;//事件发展趋势

        [DataField("czqk", "E_Alertinfo")]
        public string czqk
        {
            get { return this._czqk; }
            set { this._czqk = value; }
        }
        string _czqk;//处置情况

        [DataField("ncqcs", "E_Alertinfo")]
        public string ncqcs
        {
            get { return this._ncqcs; }
            set { this._ncqcs = value; }
        }
        string _ncqcs;//拟采取的措施

        [DataField("xybgzjy", "E_Alertinfo")]
        public string xybgzjy
        {
            get { return this._xybgzjy; }
            set { this._xybgzjy = value; }
        }
        string _xybgzjy;//下一步工作建议

        [DataField("hsr", "E_Alertinfo")]
        public string hsr
        {
            get { return this._hsr; }
            set { this._hsr = value; }
        }
        string _hsr;//核实人

        [DataField("hsqk", "E_Alertinfo")]
        public string hsqk
        {
            get { return this._hsqk; }
            set { this._hsqk = value; }
        }
        string _hsqk;//核实情况

        [DataField("hsfs", "E_Alertinfo")]
        public string hsfs
        {
            get { return this._hsfs; }
            set { this._hsfs = value; }
        }
        string _hsfs;//核实方式

        [DataField("hssj", "E_Alertinfo")]
        public string hssj
        {
            get
            {
                if (_hssj != null && _hssj != "")
                {
                    return Convert.ToDateTime(_hssj).ToShortDateString().Replace("/", "-");
                }
                else
                {
                    return null;
                }
            }
            set { this._hssj = value; }
        }
        string _hssj;

        [DataField("nbyjxx", "E_Alertinfo")]
        public string nbyjxx
        {
            get { return this._nbyjxx; }
            set { this._nbyjxx = value; }
        }
        string _nbyjxx;


        /// <summary>
        /// 直接经济损失_万元
        /// </summary>
        /// 
        [DataField("nbjjssje", "E_Alertinfo")]
        public decimal? nbjjssje
        {
            set { _nbjjssje = value; }
            get { return _nbjjssje; }
        }
        /// <summary>
        /// 结案日期
        /// </summary>
        /// 
        [DataField("jarq", "E_Alertinfo")]
        public string jarq
        {
            set { _jarq = value; }
            get
            {
                if (_jarq != null && _jarq != "")
                {
                    return Convert.ToDateTime(_jarq).ToShortDateString().Replace("/", "-");
                }
                else
                {
                    return null;
                }
            }
        }
        /// <summary>
        /// 处理结果
        /// </summary>
        /// 
        [DataField("cljg", "E_Alertinfo")]
        public string cljg
        {
            set { _cljg = value; }
            get { return _cljg; }
        }
        /// <summary>
        /// 主要遗留问题
        /// </summary>
        /// 
        [DataField("zyylwt", "E_Alertinfo")]
        public string zyylwt
        {
            set { _zyylwt = value; }
            get { return _zyylwt; }
        }
        /// <summary>
        /// 经度
        /// </summary>
        /// 
        [DataField("jd", "E_Alertinfo")]
        public string jd
        {
            set { _jd = value; }
            get { return _jd; }
        }
        /// <summary>
        /// 纬度
        /// </summary>
        /// 
        [DataField("wd", "E_Alertinfo")]
        public string wd
        {
            set { _wd = value; }
            get { return _wd; }
        }
        /// <summary>
        /// 图片
        /// </summary>
        /// 
        [DataField("tp", "E_Alertinfo")]
        public string tp
        {
            set { _tp = value; }
            get { return _tp; }
        }
        /// <summary>
        /// 附件
        /// </summary>
        /// 
        [DataField("fj", "E_Alertinfo")]
        public string fj
        {
            set { _fj = value; }
            get { return _fj; }
        }

    }
}
