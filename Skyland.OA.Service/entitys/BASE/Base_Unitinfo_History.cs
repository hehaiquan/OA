using IWorkFlow.DataBase;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IWorkFlow.ORM
{
    [Serializable]
    [DataTableInfo("Base_Unitinfo_History", "id")]
    public class Base_Unitinfo_History : QueryInfo
    {
        [DataField("id", "Base_Unitinfo_History",false)]
        public int id
        {
            get { return this._id; }
            set { this._id = value; }
        }
        int _id;

        [DataField("qydm", "Base_Unitinfo_History")]
        public string qydm
        {
            get { return this._qydm; }
            set { this._qydm = value; }
        }
        string _qydm;

        [DataField("qymc", "Base_Unitinfo_History")]
        public string qymc
        {
            get { return this._qymc; }
            set { this._qymc = value; }
        }
        string _qymc;

        [DataField("cym", "Base_Unitinfo_History")]
        public string cym
        {
            get { return this._cym; }
            set { this._cym = value; }
        }
        string _cym;

        [DataField("qydz", "Base_Unitinfo_History")]
        public string qydz
        {
            get { return this._qydz; }
            set { this._qydz = value; }
        }
        string _qydz;

        [DataField("gszch", "Base_Unitinfo_History")]
        public string gszch
        {
            get { return this._gszch; }
            set { this._gszch = value; }
        }
        string _gszch;

        [DataField("zzjgdm", "Base_Unitinfo_History")]
        public string zzjgdm
        {
            get { return this._zzjgdm; }
            set { this._zzjgdm = value; }
        }
        string _zzjgdm;

        [DataField("qyzt", "Base_Unitinfo_History")]
        public string qyzt
        {
            get { return this._qyzt; }
            set { this._qyzt = value; }
        }
        string _qyzt;

        [DataField("jzdm", "Base_Unitinfo_History")]
        public string jzdm
        {
            get { return this._jzdm; }
            set { this._jzdm = value; }
        }
        string _jzdm;

        [DataField("ssqydm", "Base_Unitinfo_History")]
        public string ssqydm
        {
            get { return this._ssqydm; }
            set { this._ssqydm = value; }
        }
        string _ssqydm;

        [DataField("hymc", "Base_Unitinfo_History")]
        public string hymc
        {
            get { return this._hymc; }
            set { this._hymc = value; }
        }
        string _hymc;

        [DataField("qygm", "Base_Unitinfo_History")]
        public string qygm
        {
            get { return this._qygm; }
            set { this._qygm = value; }
        }
        string _qygm;

        [DataField("jjlx", "Base_Unitinfo_History")]
        public string jjlx
        {
            get { return this._jjlx; }
            set { this._jjlx = value; }
        }
        string _jjlx;

        [DataField("lsgx", "Base_Unitinfo_History")]
        public string lsgx
        {
            get { return this._lsgx; }
            set { this._lsgx = value; }
        }
        string _lsgx;

        [DataField("hbjg", "Base_Unitinfo_History")]
        public string hbjg
        {
            get { return this._hbjg; }
            set { this._hbjg = value; }
        }
        string _hbjg;

        [DataField("cz", "Base_Unitinfo_History")]
        public string cz
        {
            get { return this._cz; }
            set { this._cz = value; }
        }
        string _cz;

        [DataField("yzbm", "Base_Unitinfo_History")]
        public string yzbm
        {
            get { return this._yzbm; }
            set { this._yzbm = value; }
        }
        string _yzbm;

        [DataField("fzr", "Base_Unitinfo_History")]
        public string fzr
        {
            get { return this._fzr; }
            set { this._fzr = value; }
        }
        string _fzr;

        [DataField("xb", "Base_Unitinfo_History")]
        public string xb
        {
            get { return this._xb; }
            set { this._xb = value; }
        }
        string _xb;

        [DataField("sfzh", "Base_Unitinfo_History")]
        public string sfzh
        {
            get { return this._sfzh; }
            set { this._sfzh = value; }
        }
        string _sfzh;

        [DataField("zw", "Base_Unitinfo_History")]
        public string zw
        {
            get { return this._zw; }
            set { this._zw = value; }
        }
        string _zw;

        [DataField("fzrzz", "Base_Unitinfo_History")]
        public string fzrzz
        {
            get { return this._fzrzz; }
            set { this._fzrzz = value; }
        }
        string _fzrzz;

        [DataField("fzrdh", "Base_Unitinfo_History")]
        public string fzrdh
        {
            get { return this._fzrdh; }
            set { this._fzrdh = value; }
        }
        string _fzrdh;

        [DataField("frdb", "Base_Unitinfo_History")]
        public string frdb
        {
            get { return this._frdb; }
            set { this._frdb = value; }
        }
        string _frdb;

        [DataField("frdz", "Base_Unitinfo_History")]
        public string frdz
        {
            get { return this._frdz; }
            set { this._frdz = value; }
        }
        string _frdz;

        [DataField("frdh", "Base_Unitinfo_History")]
        public string frdh
        {
            get { return this._frdh; }
            set { this._frdh = value; }
        }
        string _frdh;

        [DataField("fr", "Base_Unitinfo_History")]
        public string fr
        {
            get { return this._fr; }
            set { this._fr = value; }
        }
        string _fr;

        [DataField("frdm", "Base_Unitinfo_History")]
        public string frdm
        {
            get { return this._frdm; }
            set { this._frdm = value; }
        }
        string _frdm;

        [DataField("zjhm", "Base_Unitinfo_History")]
        public string zjhm
        {
            get { return this._zjhm; }
            set { this._zjhm = value; }
        }
        string _zjhm;

        [DataField("zjlx", "Base_Unitinfo_History")]
        public string zjlx
        {
            get { return this._zjlx; }
            set { this._zjlx = value; }
        }
        string _zjlx;

        [DataField("jclx", "Base_Unitinfo_History")]
        public string jclx
        {
            get { return this._jclx; }
            set { this._jclx = value; }
        }
        string _jclx;

        [DataField("spwh", "Base_Unitinfo_History")]
        public string spwh
        {
            get { return this._spwh; }
            set { this._spwh = value; }
        }
        string _spwh;

        [DataField("tcrq", "Base_Unitinfo_History")]
        public string tcrq
        {
            get { return this._tcrq; }
            set { this._tcrq = value; }
        }
        string _tcrq;

        [DataField("ysrq", "Base_Unitinfo_History")]
        public string ysrq
        {
            get { return this._ysrq; }
            set { this._ysrq = value; }
        }
        string _ysrq;

        [DataField("sfsfqy", "Base_Unitinfo_History")]
        public string sfsfqy
        {
            get { return this._sfsfqy; }
            set { this._sfsfqy = value; }
        }
        string _sfsfqy;

        [DataField("khh", "Base_Unitinfo_History")]
        public string khh
        {
            get { return this._khh; }
            set { this._khh = value; }
        }
        string _khh;

        [DataField("yhzh", "Base_Unitinfo_History")]
        public string yhzh
        {
            get { return this._yhzh; }
            set { this._yhzh = value; }
        }
        string _yhzh;

        [DataField("khrq", "Base_Unitinfo_History")]
        public string khrq
        {
            get { return this._khrq; }
            set { this._khrq = value; }
        }
        string _khrq;

        [DataField("khm", "Base_Unitinfo_History")]
        public string khm
        {
            get { return this._khm; }
            set { this._khm = value; }
        }
        string _khm;

        [DataField("pwkgfh", "Base_Unitinfo_History")]
        public string pwkgfh
        {
            get { return this._pwkgfh; }
            set { this._pwkgfh = value; }
        }
        string _pwkgfh;

        [DataField("wrlb", "Base_Unitinfo_History")]
        public string wrlb
        {
            get { return this._wrlb; }
            set { this._wrlb = value; }
        }
        string _wrlb;

        [DataField("qylx", "Base_Unitinfo_History")]
        public string qylx
        {
            get { return this._qylx; }
            set { this._qylx = value; }
        }
        string _qylx;

        [DataField("lxr", "Base_Unitinfo_History")]
        public string lxr
        {
            get { return this._lxr; }
            set { this._lxr = value; }
        }
        string _lxr;

        [DataField("lxdh", "Base_Unitinfo_History")]
        public string lxdh
        {
            get { return this._lxdh; }
            set { this._lxdh = value; }
        }
        string _lxdh;

        [DataField("sfhtqy", "Base_Unitinfo_History")]
        public int sfhtqy
        {
            get { return this._sfhtqy; }
            set { this._sfhtqy = value; }
        }
        int _sfhtqy;

        [DataField("sfwpqy", "Base_Unitinfo_History")]
        public int sfwpqy
        {
            get { return this._sfwpqy; }
            set { this._sfwpqy = value; }
        }
        int _sfwpqy;

        [DataField("sfzxjk", "Base_Unitinfo_History")]
        public int sfzxjk
        {
            get { return this._sfzxjk; }
            set { this._sfzxjk = value; }
        }
        int _sfzxjk;

        [DataField("sfwryqy", "Base_Unitinfo_History")]
        public int sfwryqy
        {
            get { return this._sfwryqy; }
            set { this._sfwryqy = value; }
        }
        int _sfwryqy;

        [DataField("sfwxfwjsqy", "Base_Unitinfo_History")]
        public int sfwxfwjsqy
        {
            get { return this._sfwxfwjsqy; }
            set { this._sfwxfwjsqy = value; }
        }
        int _sfwxfwjsqy;

        [DataField("sfwxfwysqy", "Base_Unitinfo_History")]
        public int sfwxfwysqy
        {
            get { return this._sfwxfwysqy; }
            set { this._sfwxfwysqy = value; }
        }
        int _sfwxfwysqy;

        [DataField("sjcjrq", "Base_Unitinfo_History")]
        public string sjcjrq
        {
            get { return this._sjcjrq; }
            set { this._sjcjrq = value; }
        }
        string _sjcjrq;

        [DataField("sjcjr", "Base_Unitinfo_History")]
        public string sjcjr
        {
            get { return this._sjcjr; }
            set { this._sjcjr = value; }
        }
        string _sjcjr;

        [DataField("jd", "Base_Unitinfo_History")]
        public float jd
        {
            get { return this._jd; }
            set { this._jd = value; }
        }
        float _jd;

        [DataField("wd", "Base_Unitinfo_History")]
        public float wd
        {
            get { return this._wd; }
            set { this._wd = value; }
        }
        float _wd;

        [DataField("jdd", "Base_Unitinfo_History")]
        public float jdd
        {
            get { return this._jdd; }
            set { this._jdd = value; }
        }
        float _jdd;

        [DataField("jdf", "Base_Unitinfo_History")]
        public float jdf
        {
            get { return this._jdf; }
            set { this._jdf = value; }
        }
        float _jdf;

        [DataField("jdm", "Base_Unitinfo_History")]
        public float jdm
        {
            get { return this._jdm; }
            set { this._jdm = value; }
        }
        float _jdm;

        [DataField("wdd", "Base_Unitinfo_History")]
        public float wdd
        {
            get { return this._wdd; }
            set { this._wdd = value; }
        }
        float _wdd;

        [DataField("wdf", "Base_Unitinfo_History")]
        public float wdf
        {
            get { return this._wdf; }
            set { this._wdf = value; }
        }
        float _wdf;

        [DataField("wdm", "Base_Unitinfo_History")]
        public float wdm
        {
            get { return this._wdm; }
            set { this._wdm = value; }
        }
        float _wdm;

        [DataField("x", "Base_Unitinfo_History")]
        public float x
        {
            get { return this._x; }
            set { this._x = value; }
        }
        float _x;

        [DataField("y", "Base_Unitinfo_History")]
        public float y
        {
            get { return this._y; }
            set { this._y = value; }
        }
        float _y;

        [DataField("bz", "Base_Unitinfo_History")]
        public string bz
        {
            get { return this._bz; }
            set { this._bz = value; }
        }
        string _bz;

        [DataField("xkzh", "Base_Unitinfo_History")]
        public string xkzh
        {
            get { return this._xkzh; }
            set { this._xkzh = value; }
        }
        string _xkzh;

        [DataField("fzjg", "Base_Unitinfo_History")]
        public string fzjg
        {
            get { return this._fzjg; }
            set { this._fzjg = value; }
        }
        string _fzjg;

        [DataField("hylx", "Base_Unitinfo_History")]
        public string hylx
        {
            get { return this._hylx; }
            set { this._hylx = value; }
        }
        string _hylx;

        [DataField("qyscqk", "Base_Unitinfo_History")]
        public string qyscqk
        {
            get { return this._qyscqk; }
            set { this._qyscqk = value; }
        }
        string _qyscqk;

        [DataField("jyfw", "Base_Unitinfo_History")]
        public string jyfw
        {
            get { return this._jyfw; }
            set { this._jyfw = value; }
        }
        string _jyfw;



        [DataField("lastEdit", "Base_Unitinfo_History")]
        public string lastEdit
        {
            get { return this._lastEdit; }
            set { this._lastEdit = value; }
        }
        string _lastEdit;

        [DataField("Province", "Base_Unitinfo_History")]
        public string Province { get; set; }

        [DataField("City", "Base_Unitinfo_History")]
        public string City { get; set; }

        [DataField("UnitCode", "Base_Unitinfo_History")]
        public string UnitCode { get; set; }
    }
}