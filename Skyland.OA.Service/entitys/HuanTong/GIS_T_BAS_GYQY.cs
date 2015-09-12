using IWorkFlow.DataBase;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IWorkFlow.ORM
{
    [Serializable]
    [DataTableInfo("GIS_T_BAS_GYQY", "ID")]
    public class GIS_T_BAS_GYQY : QueryInfo
    {
        [DataField("ID", "GIS_T_BAS_GYQY",false)]
        public string ID
        {
            get { return this._ID; }
            set { this._ID = value; }
        }
        string _ID;

        [DataField("NF", "GIS_T_BAS_GYQY")]
        public string NF
        {
            get { return this._NF; }
            set { this._NF = value; }
        }
        string _NF;

        [DataField("QYFRDM", "GIS_T_BAS_GYQY")]
        public string QYFRDM
        {
            get { return this._QYFRDM; }
            set { this._QYFRDM = value; }
        }
        string _QYFRDM;

        [DataField("TBDWXXMC", "GIS_T_BAS_GYQY")]
        public string TBDWXXMC
        {
            get { return this._TBDWXXMC; }
            set { this._TBDWXXMC = value; }
        }
        string _TBDWXXMC;

        [DataField("FR_XM", "GIS_T_BAS_GYQY")]
        public string FR_XM
        {
            get { return this._FR_XM; }
            set { this._FR_XM = value; }
        }
        string _FR_XM;

        [DataField("XZQDM", "GIS_T_BAS_GYQY")]
        public string XZQDM
        {
            get { return this._XZQDM; }
            set { this._XZQDM = value; }
        }
        string _XZQDM;

        [DataField("XXDZ_S", "GIS_T_BAS_GYQY")]
        public string XXDZ_S
        {
            get { return this._XXDZ_S; }
            set { this._XXDZ_S = value; }
        }
        string _XXDZ_S;

        [DataField("XXDZ_DQ", "GIS_T_BAS_GYQY")]
        public string XXDZ_DQ
        {
            get { return this._XXDZ_DQ; }
            set { this._XXDZ_DQ = value; }
        }
        string _XXDZ_DQ;

        [DataField("XXDZ_XIA", "GIS_T_BAS_GYQY")]
        public string XXDZ_XIA
        {
            get { return this._XXDZ_XIA; }
            set { this._XXDZ_XIA = value; }
        }
        string _XXDZ_XIA;

        [DataField("XXDZ_XIG", "GIS_T_BAS_GYQY")]
        public string XXDZ_XIG
        {
            get { return this._XXDZ_XIG; }
            set { this._XXDZ_XIG = value; }
        }
        string _XXDZ_XIG;

        [DataField("XXDZ_JC", "GIS_T_BAS_GYQY")]
        public string XXDZ_JC
        {
            get { return this._XXDZ_JC; }
            set { this._XXDZ_JC = value; }
        }
        string _XXDZ_JC;

        [DataField("ZXJD_DU", "GIS_T_BAS_GYQY")]
        public float ZXJD_DU
        {
            get { return this._ZXJD_DU; }
            set { this._ZXJD_DU = value; }
        }
        float _ZXJD_DU;

        [DataField("ZXJD_FEN", "GIS_T_BAS_GYQY")]
        public float ZXJD_FEN
        {
            get { return this._ZXJD_FEN; }
            set { this._ZXJD_FEN = value; }
        }
        float _ZXJD_FEN;

        [DataField("ZXJD_MIAO", "GIS_T_BAS_GYQY")]
        public float ZXJD_MIAO
        {
            get { return this._ZXJD_MIAO; }
            set { this._ZXJD_MIAO = value; }
        }
        float _ZXJD_MIAO;

        [DataField("ZXJD", "GIS_T_BAS_GYQY")]
        public float ZXJD
        {
            get { return this._ZXJD; }
            set { this._ZXJD = value; }
        }
        float _ZXJD;

        [DataField("ZXWD_DU", "GIS_T_BAS_GYQY")]
        public float ZXWD_DU
        {
            get { return this._ZXWD_DU; }
            set { this._ZXWD_DU = value; }
        }
        float _ZXWD_DU;

        [DataField("ZXWD_FEN", "GIS_T_BAS_GYQY")]
        public float ZXWD_FEN
        {
            get { return this._ZXWD_FEN; }
            set { this._ZXWD_FEN = value; }
        }
        float _ZXWD_FEN;

        [DataField("ZXWD_MIAO", "GIS_T_BAS_GYQY")]
        public float ZXWD_MIAO
        {
            get { return this._ZXWD_MIAO; }
            set { this._ZXWD_MIAO = value; }
        }
        float _ZXWD_MIAO;

        [DataField("ZXWD", "GIS_T_BAS_GYQY")]
        public float ZXWD
        {
            get { return this._ZXWD; }
            set { this._ZXWD = value; }
        }
        float _ZXWD;

        [DataField("LXFS_DH", "GIS_T_BAS_GYQY")]
        public string LXFS_DH
        {
            get { return this._LXFS_DH; }
            set { this._LXFS_DH = value; }
        }
        string _LXFS_DH;

        [DataField("LXFS_LXR", "GIS_T_BAS_GYQY")]
        public string LXFS_LXR
        {
            get { return this._LXFS_LXR; }
            set { this._LXFS_LXR = value; }
        }
        string _LXFS_LXR;

        [DataField("DJZCLXDM", "GIS_T_BAS_GYQY")]
        public string DJZCLXDM
        {
            get { return this._DJZCLXDM; }
            set { this._DJZCLXDM = value; }
        }
        string _DJZCLXDM;

        [DataField("QYGMDM", "GIS_T_BAS_GYQY")]
        public string QYGMDM
        {
            get { return this._QYGMDM; }
            set { this._QYGMDM = value; }
        }
        string _QYGMDM;

        [DataField("SSJTGS", "GIS_T_BAS_GYQY")]
        public string SSJTGS
        {
            get { return this._SSJTGS; }
            set { this._SSJTGS = value; }
        }
        string _SSJTGS;

        [DataField("HYLBDM", "GIS_T_BAS_GYQY")]
        public string HYLBDM
        {
            get { return this._HYLBDM; }
            set { this._HYLBDM = value; }
        }
        string _HYLBDM;

        [DataField("HYLBMC", "GIS_T_BAS_GYQY")]
        public string HYLBMC
        {
            get { return this._HYLBMC; }
            set { this._HYLBMC = value; }
        }
        string _HYLBMC;

        [DataField("KYSJ_Y", "GIS_T_BAS_GYQY")]
        public string KYSJ_Y
        {
            get { return this._KYSJ_Y; }
            set { this._KYSJ_Y = value; }
        }
        string _KYSJ_Y;

        [DataField("KYSJ_N", "GIS_T_BAS_GYQY")]
        public string KYSJ_N
        {
            get { return this._KYSJ_N; }
            set { this._KYSJ_N = value; }
        }
        string _KYSJ_N;

        [DataField("SZLYDM", "GIS_T_BAS_GYQY")]
        public string SZLYDM
        {
            get { return this._SZLYDM; }
            set { this._SZLYDM = value; }
        }
        string _SZLYDM;

        [DataField("SZLYMC", "GIS_T_BAS_GYQY")]
        public string SZLYMC
        {
            get { return this._SZLYMC; }
            set { this._SZLYMC = value; }
        }
        string _SZLYMC;

        [DataField("PSQXDM", "GIS_T_BAS_GYQY")]
        public string PSQXDM
        {
            get { return this._PSQXDM; }
            set { this._PSQXDM = value; }
        }
        string _PSQXDM;

        [DataField("PSQXLX", "GIS_T_BAS_GYQY")]
        public string PSQXLX
        {
            get { return this._PSQXLX; }
            set { this._PSQXLX = value; }
        }
        string _PSQXLX;

        [DataField("SNSTDM", "GIS_T_BAS_GYQY")]
        public string SNSTDM
        {
            get { return this._SNSTDM; }
            set { this._SNSTDM = value; }
        }
        string _SNSTDM;

        [DataField("SNSTMC", "GIS_T_BAS_GYQY")]
        public string SNSTMC
        {
            get { return this._SNSTMC; }
            set { this._SNSTMC = value; }
        }
        string _SNSTMC;

        [DataField("BZ", "GIS_T_BAS_GYQY")]
        public string BZ
        {
            get { return this._BZ; }
            set { this._BZ = value; }
        }
        string _BZ;

        [DataField("SFQY", "GIS_T_BAS_GYQY")]
        public string SFQY
        {
            get { return this._SFQY; }
            set { this._SFQY = value; }
        }
        string _SFQY;

        [DataField("LRZT", "GIS_T_BAS_GYQY")]
        public string LRZT
        {
            get { return this._LRZT; }
            set { this._LRZT = value; }
        }
        string _LRZT;

        [DataField("LXFS_CZ", "GIS_T_BAS_GYQY")]
        public string LXFS_CZ
        {
            get { return this._LXFS_CZ; }
            set { this._LXFS_CZ = value; }
        }
        string _LXFS_CZ;

        [DataField("LXFS_YB", "GIS_T_BAS_GYQY")]
        public string LXFS_YB
        {
            get { return this._LXFS_YB; }
            set { this._LXFS_YB = value; }
        }
        string _LXFS_YB;

        [DataField("GYZCZ", "GIS_T_BAS_GYQY")]
        public string GYZCZ
        {
            get { return this._GYZCZ; }
            set { this._GYZCZ = value; }
        }
        string _GYZCZ;

        [DataField("ZCSCSJ", "GIS_T_BAS_GYQY")]
        public string ZCSCSJ
        {
            get { return this._ZCSCSJ; }
            set { this._ZCSCSJ = value; }
        }
        string _ZCSCSJ;

        [DataField("GYYSL", "GIS_T_BAS_GYQY")]
        public string GYYSL
        {
            get { return this._GYYSL; }
            set { this._GYYSL = value; }
        }
        string _GYYSL;

        [DataField("GYYSL_QSL", "GIS_T_BAS_GYQY")]
        public string GYYSL_QSL
        {
            get { return this._GYYSL_QSL; }
            set { this._GYYSL_QSL = value; }
        }
        string _GYYSL_QSL;

        [DataField("GYYSL_CFYSL", "GIS_T_BAS_GYQY")]
        public string GYYSL_CFYSL
        {
            get { return this._GYYSL_CFYSL; }
            set { this._GYYSL_CFYSL = value; }
        }
        string _GYYSL_CFYSL;

        [DataField("YDL", "GIS_T_BAS_GYQY")]
        public string YDL
        {
            get { return this._YDL; }
            set { this._YDL = value; }
        }
        string _YDL;

        [DataField("GYYLS", "GIS_T_BAS_GYQY")]
        public string GYYLS
        {
            get { return this._GYYLS; }
            set { this._GYYLS = value; }
        }
        string _GYYLS;

        [DataField("ZYYFCLYL1", "GIS_T_BAS_GYQY")]
        public string ZYYFCLYL1
        {
            get { return this._ZYYFCLYL1; }
            set { this._ZYYFCLYL1 = value; }
        }
        string _ZYYFCLYL1;

        [DataField("ZYYFCLYL_JLDW1", "GIS_T_BAS_GYQY")]
        public string ZYYFCLYL_JLDW1
        {
            get { return this._ZYYFCLYL_JLDW1; }
            set { this._ZYYFCLYL_JLDW1 = value; }
        }
        string _ZYYFCLYL_JLDW1;

        [DataField("ZYYFCLYL_BNSJ1", "GIS_T_BAS_GYQY")]
        public string ZYYFCLYL_BNSJ1
        {
            get { return this._ZYYFCLYL_BNSJ1; }
            set { this._ZYYFCLYL_BNSJ1 = value; }
        }
        string _ZYYFCLYL_BNSJ1;

        [DataField("ZYCPSCQK1", "GIS_T_BAS_GYQY")]
        public string ZYCPSCQK1
        {
            get { return this._ZYCPSCQK1; }
            set { this._ZYCPSCQK1 = value; }
        }
        string _ZYCPSCQK1;

        [DataField("ZYCPSCQK_JLDW1", "GIS_T_BAS_GYQY")]
        public string ZYCPSCQK_JLDW1
        {
            get { return this._ZYCPSCQK_JLDW1; }
            set { this._ZYCPSCQK_JLDW1 = value; }
        }
        string _ZYCPSCQK_JLDW1;

        [DataField("ZYCPSCQK_BNSJ1", "GIS_T_BAS_GYQY")]
        public string ZYCPSCQK_BNSJ1
        {
            get { return this._ZYCPSCQK_BNSJ1; }
            set { this._ZYCPSCQK_BNSJ1 = value; }
        }
        string _ZYCPSCQK_BNSJ1;

        [DataField("FQ_PFL", "GIS_T_BAS_GYQY")]
        public string FQ_PFL
        {
            get { return this._FQ_PFL; }
            set { this._FQ_PFL = value; }
        }
        string _FQ_PFL;

        [DataField("FQ_ZLSSS", "GIS_T_BAS_GYQY")]
        public string FQ_ZLSSS
        {
            get { return this._FQ_ZLSSS; }
            set { this._FQ_ZLSSS = value; }
        }
        string _FQ_ZLSSS;

        [DataField("FQ_ZLSSS_CC", "GIS_T_BAS_GYQY")]
        public string FQ_ZLSSS_CC
        {
            get { return this._FQ_ZLSSS_CC; }
            set { this._FQ_ZLSSS_CC = value; }
        }
        string _FQ_ZLSSS_CC;

        [DataField("FQ_ZLSS_CLNL", "GIS_T_BAS_GYQY")]
        public string FQ_ZLSS_CLNL
        {
            get { return this._FQ_ZLSS_CLNL; }
            set { this._FQ_ZLSS_CLNL = value; }
        }
        string _FQ_ZLSS_CLNL;

        [DataField("FQ_ZLSS_CLNL_CC", "GIS_T_BAS_GYQY")]
        public string FQ_ZLSS_CLNL_CC
        {
            get { return this._FQ_ZLSS_CLNL_CC; }
            set { this._FQ_ZLSS_CLNL_CC = value; }
        }
        string _FQ_ZLSS_CLNL_CC;

        [DataField("FQ_ZLSS_YXFY", "GIS_T_BAS_GYQY")]
        public string FQ_ZLSS_YXFY
        {
            get { return this._FQ_ZLSS_YXFY; }
            set { this._FQ_ZLSS_YXFY = value; }
        }
        string _FQ_ZLSS_YXFY;

        [DataField("FQ_PFL_YC", "GIS_T_BAS_GYQY")]
        public string FQ_PFL_YC
        {
            get { return this._FQ_PFL_YC; }
            set { this._FQ_PFL_YC = value; }
        }
        string _FQ_PFL_YC;

        [DataField("FQ_CSL_YC", "GIS_T_BAS_GYQY")]
        public string FQ_CSL_YC
        {
            get { return this._FQ_CSL_YC; }
            set { this._FQ_CSL_YC = value; }
        }
        string _FQ_CSL_YC;

        [DataField("FQ_ZLSS_YXFY_CC", "GIS_T_BAS_GYQY")]
        public string FQ_ZLSS_YXFY_CC
        {
            get { return this._FQ_ZLSS_YXFY_CC; }
            set { this._FQ_ZLSS_YXFY_CC = value; }
        }
        string _FQ_ZLSS_YXFY_CC;

        [DataField("GYMTXFL", "GIS_T_BAS_GYQY")]
        public string GYMTXFL
        {
            get { return this._GYMTXFL; }
            set { this._GYMTXFL = value; }
        }
        string _GYMTXFL;

        [DataField("GYMTXFL_RLMXHL", "GIS_T_BAS_GYQY")]
        public string GYMTXFL_RLMXHL
        {
            get { return this._GYMTXFL_RLMXHL; }
            set { this._GYMTXFL_RLMXHL = value; }
        }
        string _GYMTXFL_RLMXHL;

        [DataField("RLMPJLF", "GIS_T_BAS_GYQY")]
        public string RLMPJLF
        {
            get { return this._RLMPJLF; }
            set { this._RLMPJLF = value; }
        }
        string _RLMPJLF;

        [DataField("RLMPJHF", "GIS_T_BAS_GYQY")]
        public string RLMPJHF
        {
            get { return this._RLMPJHF; }
            set { this._RLMPJHF = value; }
        }
        string _RLMPJHF;

        [DataField("RLMPJGZWHJHFF", "GIS_T_BAS_GYQY")]
        public string RLMPJGZWHJHFF
        {
            get { return this._RLMPJGZWHJHFF; }
            set { this._RLMPJGZWHJHFF = value; }
        }
        string _RLMPJGZWHJHFF;

        [DataField("GYGLS", "GIS_T_BAS_GYQY")]
        public string GYGLS
        {
            get { return this._GYGLS; }
            set { this._GYGLS = value; }
        }
        string _GYGLS;

        [DataField("GYGLS_ZDZJ", "GIS_T_BAS_GYQY")]
        public string GYGLS_ZDZJ
        {
            get { return this._GYGLS_ZDZJ; }
            set { this._GYGLS_ZDZJ = value; }
        }
        string _GYGLS_ZDZJ;

        [DataField("GYGLS_ZDS", "GIS_T_BAS_GYQY")]
        public string GYGLS_ZDS
        {
            get { return this._GYGLS_ZDS; }
            set { this._GYGLS_ZDS = value; }
        }
        string _GYGLS_ZDS;

        [DataField("GYGLS_ZDZJ_ZDS", "GIS_T_BAS_GYQY")]
        public string GYGLS_ZDZJ_ZDS
        {
            get { return this._GYGLS_ZDZJ_ZDS; }
            set { this._GYGLS_ZDZJ_ZDS = value; }
        }
        string _GYGLS_ZDZJ_ZDS;

        [DataField("ZYYFCLYL2", "GIS_T_BAS_GYQY")]
        public string ZYYFCLYL2
        {
            get { return this._ZYYFCLYL2; }
            set { this._ZYYFCLYL2 = value; }
        }
        string _ZYYFCLYL2;

        [DataField("ZYYFCLYL3", "GIS_T_BAS_GYQY")]
        public string ZYYFCLYL3
        {
            get { return this._ZYYFCLYL3; }
            set { this._ZYYFCLYL3 = value; }
        }
        string _ZYYFCLYL3;

        [DataField("ZYYFCLYL_JLDW2", "GIS_T_BAS_GYQY")]
        public string ZYYFCLYL_JLDW2
        {
            get { return this._ZYYFCLYL_JLDW2; }
            set { this._ZYYFCLYL_JLDW2 = value; }
        }
        string _ZYYFCLYL_JLDW2;

        [DataField("ZYYFCLYL_BNSJ2", "GIS_T_BAS_GYQY")]
        public string ZYYFCLYL_BNSJ2
        {
            get { return this._ZYYFCLYL_BNSJ2; }
            set { this._ZYYFCLYL_BNSJ2 = value; }
        }
        string _ZYYFCLYL_BNSJ2;

        [DataField("ZYYFCLYL_JLDW3", "GIS_T_BAS_GYQY")]
        public string ZYYFCLYL_JLDW3
        {
            get { return this._ZYYFCLYL_JLDW3; }
            set { this._ZYYFCLYL_JLDW3 = value; }
        }
        string _ZYYFCLYL_JLDW3;

        [DataField("ZYYFCLYL_BNSJ3", "GIS_T_BAS_GYQY")]
        public string ZYYFCLYL_BNSJ3
        {
            get { return this._ZYYFCLYL_BNSJ3; }
            set { this._ZYYFCLYL_BNSJ3 = value; }
        }
        string _ZYYFCLYL_BNSJ3;

        [DataField("ZYCPSCQK2", "GIS_T_BAS_GYQY")]
        public string ZYCPSCQK2
        {
            get { return this._ZYCPSCQK2; }
            set { this._ZYCPSCQK2 = value; }
        }
        string _ZYCPSCQK2;

        [DataField("ZYCPSCQK3", "GIS_T_BAS_GYQY")]
        public string ZYCPSCQK3
        {
            get { return this._ZYCPSCQK3; }
            set { this._ZYCPSCQK3 = value; }
        }
        string _ZYCPSCQK3;

        [DataField("ZYCPSCQK_JLDW2", "GIS_T_BAS_GYQY")]
        public string ZYCPSCQK_JLDW2
        {
            get { return this._ZYCPSCQK_JLDW2; }
            set { this._ZYCPSCQK_JLDW2 = value; }
        }
        string _ZYCPSCQK_JLDW2;

        [DataField("ZYCPSCQK_BNSJ2", "GIS_T_BAS_GYQY")]
        public string ZYCPSCQK_BNSJ2
        {
            get { return this._ZYCPSCQK_BNSJ2; }
            set { this._ZYCPSCQK_BNSJ2 = value; }
        }
        string _ZYCPSCQK_BNSJ2;

        [DataField("ZYCPSCQK_JLDW3", "GIS_T_BAS_GYQY")]
        public string ZYCPSCQK_JLDW3
        {
            get { return this._ZYCPSCQK_JLDW3; }
            set { this._ZYCPSCQK_JLDW3 = value; }
        }
        string _ZYCPSCQK_JLDW3;

        [DataField("ZYCPSCQK_BNSJ3", "GIS_T_BAS_GYQY")]
        public string ZYCPSCQK_BNSJ3
        {
            get { return this._ZYCPSCQK_BNSJ3; }
            set { this._ZYCPSCQK_BNSJ3 = value; }
        }
        string _ZYCPSCQK_BNSJ3;

        [DataField("FS_ZLSSS", "GIS_T_BAS_GYQY")]
        public string FS_ZLSSS
        {
            get { return this._FS_ZLSSS; }
            set { this._FS_ZLSSS = value; }
        }
        string _FS_ZLSSS;

        [DataField("FS_ZLSSCLNL", "GIS_T_BAS_GYQY")]
        public string FS_ZLSSCLNL
        {
            get { return this._FS_ZLSSCLNL; }
            set { this._FS_ZLSSCLNL = value; }
        }
        string _FS_ZLSSCLNL;

        [DataField("FS_ZLSSYXFY", "GIS_T_BAS_GYQY")]
        public string FS_ZLSSYXFY
        {
            get { return this._FS_ZLSSYXFY; }
            set { this._FS_ZLSSYXFY = value; }
        }
        string _FS_ZLSSYXFY;

        [DataField("FS_CLL", "GIS_T_BAS_GYQY")]
        public string FS_CLL
        {
            get { return this._FS_CLL; }
            set { this._FS_CLL = value; }
        }
        string _FS_CLL;

        [DataField("FS_PFL", "GIS_T_BAS_GYQY")]
        public string FS_PFL
        {
            get { return this._FS_PFL; }
            set { this._FS_PFL = value; }
        }
        string _FS_PFL;

        [DataField("FS_PFL_PRHJ", "GIS_T_BAS_GYQY")]
        public string FS_PFL_PRHJ
        {
            get { return this._FS_PFL_PRHJ; }
            set { this._FS_PFL_PRHJ = value; }
        }
        string _FS_PFL_PRHJ;

        [DataField("FS_CSL_HXXYL", "GIS_T_BAS_GYQY")]
        public string FS_CSL_HXXYL
        {
            get { return this._FS_CSL_HXXYL; }
            set { this._FS_CSL_HXXYL = value; }
        }
        string _FS_CSL_HXXYL;

        [DataField("FS_PFL_HXXYL", "GIS_T_BAS_GYQY")]
        public string FS_PFL_HXXYL
        {
            get { return this._FS_PFL_HXXYL; }
            set { this._FS_PFL_HXXYL = value; }
        }
        string _FS_PFL_HXXYL;

        [DataField("FQ_CSL_EYHL", "GIS_T_BAS_GYQY")]
        public string FQ_CSL_EYHL
        {
            get { return this._FQ_CSL_EYHL; }
            set { this._FQ_CSL_EYHL = value; }
        }
        string _FQ_CSL_EYHL;

        [DataField("FQ_PFL_EYHL", "GIS_T_BAS_GYQY")]
        public string FQ_PFL_EYHL
        {
            get { return this._FQ_PFL_EYHL; }
            set { this._FQ_PFL_EYHL = value; }
        }
        string _FQ_PFL_EYHL;

        [DataField("FQ_CSL_DYHW", "GIS_T_BAS_GYQY")]
        public string FQ_CSL_DYHW
        {
            get { return this._FQ_CSL_DYHW; }
            set { this._FQ_CSL_DYHW = value; }
        }
        string _FQ_CSL_DYHW;

        [DataField("FQ_PFL_DYHW", "GIS_T_BAS_GYQY")]
        public string FQ_PFL_DYHW
        {
            get { return this._FQ_PFL_DYHW; }
            set { this._FQ_PFL_DYHW = value; }
        }
        string _FQ_PFL_DYHW;

        [DataField("GF_CSL", "GIS_T_BAS_GYQY")]
        public string GF_CSL
        {
            get { return this._GF_CSL; }
            set { this._GF_CSL = value; }
        }
        string _GF_CSL;

        [DataField("GF_ZHLYL", "GIS_T_BAS_GYQY")]
        public string GF_ZHLYL
        {
            get { return this._GF_ZHLYL; }
            set { this._GF_ZHLYL = value; }
        }
        string _GF_ZHLYL;

        [DataField("GYGLS_ZDYS", "GIS_T_BAS_GYQY")]
        public string GYGLS_ZDYS
        {
            get { return this._GYGLS_ZDYS; }
            set { this._GYGLS_ZDYS = value; }
        }
        string _GYGLS_ZDYS;

        [DataField("GYGLS_ZDYS_ZDS", "GIS_T_BAS_GYQY")]
        public string GYGLS_ZDYS_ZDS
        {
            get { return this._GYGLS_ZDYS_ZDS; }
            set { this._GYGLS_ZDYS_ZDS = value; }
        }
        string _GYGLS_ZDYS_ZDS;

        [DataField("FS_CSL_AD", "GIS_T_BAS_GYQY")]
        public string FS_CSL_AD
        {
            get { return this._FS_CSL_AD; }
            set { this._FS_CSL_AD = value; }
        }
        string _FS_CSL_AD;

        [DataField("FS_CSL_SYL", "GIS_T_BAS_GYQY")]
        public string FS_CSL_SYL
        {
            get { return this._FS_CSL_SYL; }
            set { this._FS_CSL_SYL = value; }
        }
        string _FS_CSL_SYL;

        [DataField("FS_CSL_HFF", "GIS_T_BAS_GYQY")]
        public string FS_CSL_HFF
        {
            get { return this._FS_CSL_HFF; }
            set { this._FS_CSL_HFF = value; }
        }
        string _FS_CSL_HFF;

        [DataField("FS_CSL_QHW", "GIS_T_BAS_GYQY")]
        public string FS_CSL_QHW
        {
            get { return this._FS_CSL_QHW; }
            set { this._FS_CSL_QHW = value; }
        }
        string _FS_CSL_QHW;

        [DataField("FS_CSL_G", "GIS_T_BAS_GYQY")]
        public string FS_CSL_G
        {
            get { return this._FS_CSL_G; }
            set { this._FS_CSL_G = value; }
        }
        string _FS_CSL_G;

        [DataField("FS_PFL_AD", "GIS_T_BAS_GYQY")]
        public string FS_PFL_AD
        {
            get { return this._FS_PFL_AD; }
            set { this._FS_PFL_AD = value; }
        }
        string _FS_PFL_AD;

        [DataField("FS_PFL_SYL", "GIS_T_BAS_GYQY")]
        public string FS_PFL_SYL
        {
            get { return this._FS_PFL_SYL; }
            set { this._FS_PFL_SYL = value; }
        }
        string _FS_PFL_SYL;

        [DataField("FS_PFL_HFF", "GIS_T_BAS_GYQY")]
        public string FS_PFL_HFF
        {
            get { return this._FS_PFL_HFF; }
            set { this._FS_PFL_HFF = value; }
        }
        string _FS_PFL_HFF;

        [DataField("FS_PFL_QHW", "GIS_T_BAS_GYQY")]
        public string FS_PFL_QHW
        {
            get { return this._FS_PFL_QHW; }
            set { this._FS_PFL_QHW = value; }
        }
        string _FS_PFL_QHW;

        [DataField("FS_PFL_G", "GIS_T_BAS_GYQY")]
        public string FS_PFL_G
        {
            get { return this._FS_PFL_G; }
            set { this._FS_PFL_G = value; }
        }
        string _FS_PFL_G;

        [DataField("FQ_ZLSSS_TL", "GIS_T_BAS_GYQY")]
        public string FQ_ZLSSS_TL
        {
            get { return this._FQ_ZLSSS_TL; }
            set { this._FQ_ZLSSS_TL = value; }
        }
        string _FQ_ZLSSS_TL;

        [DataField("FQ_ZLSS_CLNL_TL", "GIS_T_BAS_GYQY")]
        public string FQ_ZLSS_CLNL_TL
        {
            get { return this._FQ_ZLSS_CLNL_TL; }
            set { this._FQ_ZLSS_CLNL_TL = value; }
        }
        string _FQ_ZLSS_CLNL_TL;

        [DataField("TLJXH", "GIS_T_BAS_GYQY")]
        public string TLJXH
        {
            get { return this._TLJXH; }
            set { this._TLJXH = value; }
        }
        string _TLJXH;

        [DataField("TLJXH_BNSJ", "GIS_T_BAS_GYQY")]
        public string TLJXH_BNSJ
        {
            get { return this._TLJXH_BNSJ; }
            set { this._TLJXH_BNSJ = value; }
        }
        string _TLJXH_BNSJ;

        [DataField("ZYCPSCQK4", "GIS_T_BAS_GYQY")]
        public string ZYCPSCQK4
        {
            get { return this._ZYCPSCQK4; }
            set { this._ZYCPSCQK4 = value; }
        }
        string _ZYCPSCQK4;

        [DataField("ZYCPSCQK_BNSJ4", "GIS_T_BAS_GYQY")]
        public string ZYCPSCQK_BNSJ4
        {
            get { return this._ZYCPSCQK_BNSJ4; }
            set { this._ZYCPSCQK_BNSJ4 = value; }
        }
        string _ZYCPSCQK_BNSJ4;

        [DataField("GF_ZHLYL_WNXC", "GIS_T_BAS_GYQY")]
        public string GF_ZHLYL_WNXC
        {
            get { return this._GF_ZHLYL_WNXC; }
            set { this._GF_ZHLYL_WNXC = value; }
        }
        string _GF_ZHLYL_WNXC;

        [DataField("GF_ZCL", "GIS_T_BAS_GYQY")]
        public string GF_ZCL
        {
            get { return this._GF_ZCL; }
            set { this._GF_ZCL = value; }
        }
        string _GF_ZCL;

        [DataField("GF_CSL_WF", "GIS_T_BAS_GYQY")]
        public string GF_CSL_WF
        {
            get { return this._GF_CSL_WF; }
            set { this._GF_CSL_WF = value; }
        }
        string _GF_CSL_WF;

        [DataField("GF_ZHLYL_WF", "GIS_T_BAS_GYQY")]
        public string GF_ZHLYL_WF
        {
            get { return this._GF_ZHLYL_WF; }
            set { this._GF_ZHLYL_WF = value; }
        }
        string _GF_ZHLYL_WF;

        [DataField("GF_ZHLYL_WF_WNXC", "GIS_T_BAS_GYQY")]
        public string GF_ZHLYL_WF_WNXC
        {
            get { return this._GF_ZHLYL_WF_WNXC; }
            set { this._GF_ZHLYL_WF_WNXC = value; }
        }
        string _GF_ZHLYL_WF_WNXC;

        [DataField("GF_ZHLYL_WF_SWDW", "GIS_T_BAS_GYQY")]
        public string GF_ZHLYL_WF_SWDW
        {
            get { return this._GF_ZHLYL_WF_SWDW; }
            set { this._GF_ZHLYL_WF_SWDW = value; }
        }
        string _GF_ZHLYL_WF_SWDW;

        [DataField("GF_ZHLYL_WF_SCZDW", "GIS_T_BAS_GYQY")]
        public string GF_ZHLYL_WF_SCZDW
        {
            get { return this._GF_ZHLYL_WF_SCZDW; }
            set { this._GF_ZHLYL_WF_SCZDW = value; }
        }
        string _GF_ZHLYL_WF_SCZDW;

        [DataField("GF_XCL_WF", "GIS_T_BAS_GYQY")]
        public string GF_XCL_WF
        {
            get { return this._GF_XCL_WF; }
            set { this._GF_XCL_WF = value; }
        }
        string _GF_XCL_WF;

        [DataField("FQ_ZLSS_YXFY_TL", "GIS_T_BAS_GYQY")]
        public string FQ_ZLSS_YXFY_TL
        {
            get { return this._FQ_ZLSS_YXFY_TL; }
            set { this._FQ_ZLSS_YXFY_TL = value; }
        }
        string _FQ_ZLSS_YXFY_TL;

        [DataField("RLYXHL", "GIS_T_BAS_GYQY")]
        public string RLYXHL
        {
            get { return this._RLYXHL; }
            set { this._RLYXHL = value; }
        }
        string _RLYXHL;

        [DataField("RLYPJLF", "GIS_T_BAS_GYQY")]
        public string RLYPJLF
        {
            get { return this._RLYPJLF; }
            set { this._RLYPJLF = value; }
        }
        string _RLYPJLF;

        [DataField("JTXHL", "GIS_T_BAS_GYQY")]
        public string JTXHL
        {
            get { return this._JTXHL; }
            set { this._JTXHL = value; }
        }
        string _JTXHL;

        [DataField("JTHLL", "GIS_T_BAS_GYQY")]
        public string JTHLL
        {
            get { return this._JTHLL; }
            set { this._JTHLL = value; }
        }
        string _JTHLL;

        [DataField("JTPJHF", "GIS_T_BAS_GYQY")]
        public string JTPJHF
        {
            get { return this._JTPJHF; }
            set { this._JTPJHF = value; }
        }
        string _JTPJHF;

        [DataField("TRQXHL", "GIS_T_BAS_GYQY")]
        public string TRQXHL
        {
            get { return this._TRQXHL; }
            set { this._TRQXHL = value; }
        }
        string _TRQXHL;

        [DataField("QTRLXHL", "GIS_T_BAS_GYQY")]
        public string QTRLXHL
        {
            get { return this._QTRLXHL; }
            set { this._QTRLXHL = value; }
        }
        string _QTRLXHL;

        [DataField("GYGLS_YZDZJ", "GIS_T_BAS_GYQY")]
        public string GYGLS_YZDZJ
        {
            get { return this._GYGLS_YZDZJ; }
            set { this._GYGLS_YZDZJ = value; }
        }
        string _GYGLS_YZDZJ;

        [DataField("GYGLS_ZDYX", "GIS_T_BAS_GYQY")]
        public string GYGLS_ZDYX
        {
            get { return this._GYGLS_ZDYX; }
            set { this._GYGLS_ZDYX = value; }
        }
        string _GYGLS_ZDYX;

        [DataField("FQ_ZLSSS_TX", "GIS_T_BAS_GYQY")]
        public string FQ_ZLSSS_TX
        {
            get { return this._FQ_ZLSSS_TX; }
            set { this._FQ_ZLSSS_TX = value; }
        }
        string _FQ_ZLSSS_TX;

        [DataField("FQ_ZLSS_CLNL_TX", "GIS_T_BAS_GYQY")]
        public string FQ_ZLSS_CLNL_TX
        {
            get { return this._FQ_ZLSS_CLNL_TX; }
            set { this._FQ_ZLSS_CLNL_TX = value; }
        }
        string _FQ_ZLSS_CLNL_TX;

        [DataField("TXJXH_BNSJ", "GIS_T_BAS_GYQY")]
        public string TXJXH_BNSJ
        {
            get { return this._TXJXH_BNSJ; }
            set { this._TXJXH_BNSJ = value; }
        }
        string _TXJXH_BNSJ;

        [DataField("TLJXH2", "GIS_T_BAS_GYQY")]
        public string TLJXH2
        {
            get { return this._TLJXH2; }
            set { this._TLJXH2 = value; }
        }
        string _TLJXH2;

        [DataField("TLJXH_BNSJ2", "GIS_T_BAS_GYQY")]
        public string TLJXH_BNSJ2
        {
            get { return this._TLJXH_BNSJ2; }
            set { this._TLJXH_BNSJ2 = value; }
        }
        string _TLJXH_BNSJ2;

        [DataField("GF_CZL", "GIS_T_BAS_GYQY")]
        public string GF_CZL
        {
            get { return this._GF_CZL; }
            set { this._GF_CZL = value; }
        }
        string _GF_CZL;

        [DataField("GF_CZL_WNXC", "GIS_T_BAS_GYQY")]
        public string GF_CZL_WNXC
        {
            get { return this._GF_CZL_WNXC; }
            set { this._GF_CZL_WNXC = value; }
        }
        string _GF_CZL_WNXC;

        [DataField("GF_QDDQL", "GIS_T_BAS_GYQY")]
        public string GF_QDDQL
        {
            get { return this._GF_QDDQL; }
            set { this._GF_QDDQL = value; }
        }
        string _GF_QDDQL;

        [DataField("GF_CZL_WF", "GIS_T_BAS_GYQY")]
        public string GF_CZL_WF
        {
            get { return this._GF_CZL_WF; }
            set { this._GF_CZL_WF = value; }
        }
        string _GF_CZL_WF;

        [DataField("GF_CZL_WF_WNXC", "GIS_T_BAS_GYQY")]
        public string GF_CZL_WF_WNXC
        {
            get { return this._GF_CZL_WF_WNXC; }
            set { this._GF_CZL_WF_WNXC = value; }
        }
        string _GF_CZL_WF_WNXC;

        [DataField("GF_CZL_WF_SWDW", "GIS_T_BAS_GYQY")]
        public string GF_CZL_WF_SWDW
        {
            get { return this._GF_CZL_WF_SWDW; }
            set { this._GF_CZL_WF_SWDW = value; }
        }
        string _GF_CZL_WF_SWDW;

        [DataField("GF_CZL_WF_SCZDW", "GIS_T_BAS_GYQY")]
        public string GF_CZL_WF_SCZDW
        {
            get { return this._GF_CZL_WF_SCZDW; }
            set { this._GF_CZL_WF_SCZDW = value; }
        }
        string _GF_CZL_WF_SCZDW;

        [DataField("GF_QDDQL_WF", "GIS_T_BAS_GYQY")]
        public string GF_QDDQL_WF
        {
            get { return this._GF_QDDQL_WF; }
            set { this._GF_QDDQL_WF = value; }
        }
        string _GF_QDDQL_WF;

        [DataField("FQ_ZLSS_YXFY_TX", "GIS_T_BAS_GYQY")]
        public string FQ_ZLSS_YXFY_TX
        {
            get { return this._FQ_ZLSS_YXFY_TX; }
            set { this._FQ_ZLSS_YXFY_TX = value; }
        }
        string _FQ_ZLSS_YXFY_TX;

        [DataField("GF_NBNZHLYCZNL", "GIS_T_BAS_GYQY")]
        public string GF_NBNZHLYCZNL
        {
            get { return this._GF_NBNZHLYCZNL; }
            set { this._GF_NBNZHLYCZNL = value; }
        }
        string _GF_NBNZHLYCZNL;

        [DataField("CYM", "GIS_T_BAS_GYQY")]
        public string CYM
        {
            get { return this._CYM; }
            set { this._CYM = value; }
        }
        string _CYM;

        [DataField("GYGLS_YZDZJ_ZDS", "GIS_T_BAS_GYQY")]
        public string GYGLS_YZDZJ_ZDS
        {
            get { return this._GYGLS_YZDZJ_ZDS; }
            set { this._GYGLS_YZDZJ_ZDS = value; }
        }
        string _GYGLS_YZDZJ_ZDS;

        [DataField("GYGLS_ZDYX_ZDS", "GIS_T_BAS_GYQY")]
        public string GYGLS_ZDYX_ZDS
        {
            get { return this._GYGLS_ZDYX_ZDS; }
            set { this._GYGLS_ZDYX_ZDS = value; }
        }
        string _GYGLS_ZDYX_ZDS;

        [DataField("FS_PFL_PRWSCLC", "GIS_T_BAS_GYQY")]
        public string FS_PFL_PRWSCLC
        {
            get { return this._FS_PFL_PRWSCLC; }
            set { this._FS_PFL_PRWSCLC = value; }
        }
        string _FS_PFL_PRWSCLC;

        [DataField("FS_ND_PRWSCLC_COD", "GIS_T_BAS_GYQY")]
        public string FS_ND_PRWSCLC_COD
        {
            get { return this._FS_ND_PRWSCLC_COD; }
            set { this._FS_ND_PRWSCLC_COD = value; }
        }
        string _FS_ND_PRWSCLC_COD;

        [DataField("FS_ND_PRWSCLC_AD", "GIS_T_BAS_GYQY")]
        public string FS_ND_PRWSCLC_AD
        {
            get { return this._FS_ND_PRWSCLC_AD; }
            set { this._FS_ND_PRWSCLC_AD = value; }
        }
        string _FS_ND_PRWSCLC_AD;

        [DataField("FS_ND_PRWSCLC_SYL", "GIS_T_BAS_GYQY")]
        public string FS_ND_PRWSCLC_SYL
        {
            get { return this._FS_ND_PRWSCLC_SYL; }
            set { this._FS_ND_PRWSCLC_SYL = value; }
        }
        string _FS_ND_PRWSCLC_SYL;

        [DataField("FS_CSL_S", "GIS_T_BAS_GYQY")]
        public string FS_CSL_S
        {
            get { return this._FS_CSL_S; }
            set { this._FS_CSL_S = value; }
        }
        string _FS_CSL_S;

        [DataField("FS_CSL_Q", "GIS_T_BAS_GYQY")]
        public string FS_CSL_Q
        {
            get { return this._FS_CSL_Q; }
            set { this._FS_CSL_Q = value; }
        }
        string _FS_CSL_Q;

        [DataField("FS_CSL_GE", "GIS_T_BAS_GYQY")]
        public string FS_CSL_GE
        {
            get { return this._FS_CSL_GE; }
            set { this._FS_CSL_GE = value; }
        }
        string _FS_CSL_GE;

        [DataField("FS_CSL_LJG", "GIS_T_BAS_GYQY")]
        public string FS_CSL_LJG
        {
            get { return this._FS_CSL_LJG; }
            set { this._FS_CSL_LJG = value; }
        }
        string _FS_CSL_LJG;

        [DataField("FS_CSL_ZL", "GIS_T_BAS_GYQY")]
        public string FS_CSL_ZL
        {
            get { return this._FS_CSL_ZL; }
            set { this._FS_CSL_ZL = value; }
        }
        string _FS_CSL_ZL;

        [DataField("FS_PFL_S", "GIS_T_BAS_GYQY")]
        public string FS_PFL_S
        {
            get { return this._FS_PFL_S; }
            set { this._FS_PFL_S = value; }
        }
        string _FS_PFL_S;

        [DataField("FS_PFL_Q", "GIS_T_BAS_GYQY")]
        public string FS_PFL_Q
        {
            get { return this._FS_PFL_Q; }
            set { this._FS_PFL_Q = value; }
        }
        string _FS_PFL_Q;

        [DataField("FS_PFL_GE", "GIS_T_BAS_GYQY")]
        public string FS_PFL_GE
        {
            get { return this._FS_PFL_GE; }
            set { this._FS_PFL_GE = value; }
        }
        string _FS_PFL_GE;

        [DataField("FS_PFL_LJG", "GIS_T_BAS_GYQY")]
        public string FS_PFL_LJG
        {
            get { return this._FS_PFL_LJG; }
            set { this._FS_PFL_LJG = value; }
        }
        string _FS_PFL_LJG;

        [DataField("FS_PFL_ZL", "GIS_T_BAS_GYQY")]
        public string FS_PFL_ZL
        {
            get { return this._FS_PFL_ZL; }
            set { this._FS_PFL_ZL = value; }
        }
        string _FS_PFL_ZL;

        [DataField("FQ_CSL_S", "GIS_T_BAS_GYQY")]
        public string FQ_CSL_S
        {
            get { return this._FQ_CSL_S; }
            set { this._FQ_CSL_S = value; }
        }
        string _FQ_CSL_S;

        [DataField("FQ_PFL_S", "GIS_T_BAS_GYQY")]
        public string FQ_PFL_S
        {
            get { return this._FQ_PFL_S; }
            set { this._FQ_PFL_S = value; }
        }
        string _FQ_PFL_S;

        [DataField("FQ_CSL_Q", "GIS_T_BAS_GYQY")]
        public string FQ_CSL_Q
        {
            get { return this._FQ_CSL_Q; }
            set { this._FQ_CSL_Q = value; }
        }
        string _FQ_CSL_Q;

        [DataField("FQ_PFL_Q", "GIS_T_BAS_GYQY")]
        public string FQ_PFL_Q
        {
            get { return this._FQ_PFL_Q; }
            set { this._FQ_PFL_Q = value; }
        }
        string _FQ_PFL_Q;

        [DataField("FQ_CSL_LJG", "GIS_T_BAS_GYQY")]
        public string FQ_CSL_LJG
        {
            get { return this._FQ_CSL_LJG; }
            set { this._FQ_CSL_LJG = value; }
        }
        string _FQ_CSL_LJG;

        [DataField("FQ_PFL_LJG", "GIS_T_BAS_GYQY")]
        public string FQ_PFL_LJG
        {
            get { return this._FQ_PFL_LJG; }
            set { this._FQ_PFL_LJG = value; }
        }
        string _FQ_PFL_LJG;

        [DataField("FQ_CSL_ZJ", "GIS_T_BAS_GYQY")]
        public string FQ_CSL_ZJ
        {
            get { return this._FQ_CSL_ZJ; }
            set { this._FQ_CSL_ZJ = value; }
        }
        string _FQ_CSL_ZJ;

        [DataField("FQ_PFL_ZJ", "GIS_T_BAS_GYQY")]
        public string FQ_PFL_ZJ
        {
            get { return this._FQ_PFL_ZJ; }
            set { this._FQ_PFL_ZJ = value; }
        }
        string _FQ_PFL_ZJ;

        [DataField("FQ_CSL_G", "GIS_T_BAS_GYQY")]
        public string FQ_CSL_G
        {
            get { return this._FQ_CSL_G; }
            set { this._FQ_CSL_G = value; }
        }
        string _FQ_CSL_G;

        [DataField("FQ_PFL_G", "GIS_T_BAS_GYQY")]
        public string FQ_PFL_G
        {
            get { return this._FQ_PFL_G; }
            set { this._FQ_PFL_G = value; }
        }
        string _FQ_PFL_G;

        [DataField("FQ_CSL_QE", "GIS_T_BAS_GYQY")]
        public string FQ_CSL_QE
        {
            get { return this._FQ_CSL_QE; }
            set { this._FQ_CSL_QE = value; }
        }
        string _FQ_CSL_QE;

        [DataField("FQ_PFL_QE", "GIS_T_BAS_GYQY")]
        public string FQ_PFL_QE
        {
            get { return this._FQ_PFL_QE; }
            set { this._FQ_PFL_QE = value; }
        }
        string _FQ_PFL_QE;

    }
}
