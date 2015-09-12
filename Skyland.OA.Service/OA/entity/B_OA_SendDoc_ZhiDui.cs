using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using IWorkFlow.DataBase;
using System.Web;

namespace IWorkFlow.ORM
{
    //发文
    [Serializable]
    [DataTableInfo("B_OA_SendDoc_ZhiDui", "id")]
    public class B_OA_SendDoc_ZhiDui : QueryInfo
    {  /// <summary>
        /// id
        /// </summary>		
        [DataField("id", "B_OA_SendDoc_ZhiDui", false)]
        public int? id
        {
            get { return _id; }
            set { _id = value; }
        }
        private int? _id;

        /// <summary>
        /// 业务ID
        /// </summary>		
        [DataField("caseid", "B_OA_SendDoc_ZhiDui")]
        public string caseid
        {
            get { return _caseid; }
            set { _caseid = value; }
        }
        private string _caseid;
        /// <summary>
        /// fwrq
        /// </summary>		
        [DataField("fwrq", "B_OA_SendDoc_ZhiDui")]
        public DateTime fwrq
        {
            get { return _fwrq; }
            set { _fwrq = value; }
        }
        private DateTime _fwrq;
        /// <summary>
        /// wjbh
        /// </summary>		
        [DataField("wjbh", "B_OA_SendDoc_ZhiDui")]
        public string wjbh
        {
            get { return _wjbh; }
            set { _wjbh = value; }
        }
        private string _wjbh;
        /// <summary>
        /// 发文号
        /// </summary>		
        [DataField("fwzh", "B_OA_SendDoc_ZhiDui")]
        public string fwzh
        {
            get { return _fwzh; }
            set { _fwzh = value; }
        }
        private string _fwzh;
        /// <summary>
        /// 发文类型
        /// </summary>		
        [DataField("fwlx", "B_OA_SendDoc_ZhiDui")]
        public string fwlx
        {
            get { return _fwlx; }
            set { _fwlx = value; }
        }
        private string _fwlx;
        /// <summary>
        /// 密级
        /// </summary>		
        [DataField("mj", "B_OA_SendDoc_ZhiDui")]
        public string mj
        {
            get { return _mj; }
            set { _mj = value; }
        }
        private string _mj;
        /// <summary>
        /// 印数
        /// </summary>		
        [DataField("ys", "B_OA_SendDoc_ZhiDui")]
        public string ys
        {
            get { return _ys; }
            set { _ys = value; }
        }
        private string _ys;
        /// <summary>
        /// 文件标题
        /// </summary>		
        [DataField("wjbt", "B_OA_SendDoc_ZhiDui")]
        public string wjbt
        {
            get { return _wjbt; }
            set { _wjbt = value; }
        }
        private string _wjbt;
        /// <summary>
        /// 公开程度
        /// </summary>		
        [DataField("gkcd", "B_OA_SendDoc_ZhiDui")]
        public int? gkcd
        {
            get { return _gkcd; }
            set { _gkcd = value; }
        }
        private int? _gkcd;
        /// <summary>
        /// 主送
        /// </summary>		
        [DataField("zs", "B_OA_SendDoc_ZhiDui")]
        public string zs
        {
            get { return _zs; }
            set { _zs = value; }
        }
        private string _zs;
        /// <summary>
        /// 抄报
        /// </summary>		
        [DataField("cb", "B_OA_SendDoc_ZhiDui")]
        public string cb
        {
            get { return _cb; }
            set { _cb = value; }
        }
        private string _cb;
        /// <summary>
        /// 抄送
        /// </summary>		
        [DataField("cs", "B_OA_SendDoc_ZhiDui")]
        public string cs
        {
            get { return _cs; }
            set { _cs = value; }
        }
        private string _cs;
        /// <summary>
        /// 主题词
        /// </summary>		
        [DataField("ztc", "B_OA_SendDoc_ZhiDui")]
        public string ztc
        {
            get { return _ztc; }
            set { _ztc = value; }
        }
        private string _ztc;
        /// <summary>
        /// 主办部门
        /// </summary>		
        [DataField("zbbm", "B_OA_SendDoc_ZhiDui")]
        public string zbbm
        {
            get { return _zbbm; }
            set { _zbbm = value; }
        }
        private string _zbbm;
        /// <summary>
        /// 拟稿人
        /// </summary>		
        [DataField("ngr", "B_OA_SendDoc_ZhiDui")]
        public string ngr
        {
            get { return _ngr; }
            set { _ngr = value; }
        }
        private string _ngr;
        /// <summary>
        /// 校对
        /// </summary>		
        [DataField("jd", "B_OA_SendDoc_ZhiDui")]
        public string jd
        {
            get { return _jd; }
            set { _jd = value; }
        }
        private string _jd;
        /// <summary>
        /// 打字员
        /// </summary>		
        [DataField("dzy", "B_OA_SendDoc_ZhiDui")]
        public string dzy
        {
            get { return _dzy; }
            set { _dzy = value; }
        }
        private string _dzy;
        /// <summary>
        /// 备注
        /// </summary>		
        [DataField("bz", "B_OA_SendDoc_ZhiDui")]
        public string bz
        {
            get { return _bz; }
            set { _bz = value; }
        }
        private string _bz;

        /// <summary>
        /// 来文ID
        /// </summary>		
        [DataField("receiveCaseId", "B_OA_SendDoc_ZhiDui")]
        public string receiveCaseId
        {
            get { return _receiveCaseId; }
            set { _receiveCaseId = value; }
        }
        private string _receiveCaseId;

        /// <summary>
        /// 来文标题名
        /// </summary>		
        [DataField("receiveTittleName", "B_OA_SendDoc_ZhiDui")]
        public string receiveTittleName
        {
            get { return _receiveTittleName; }
            set { _receiveTittleName = value; }
        }
        private string _receiveTittleName;

        /// <summary>
        /// 是否归档默认为0
        /// </summary>		
        [DataField("sfgd", "B_OA_SendDoc_ZhiDui")]
        public int sfgd
        {
            get { return _sfgd; }
            set { _sfgd = value; }
        }
        private int _sfgd;

        /// <summary>
        /// 正文路径
        /// </summary>		
        [DataField("articlePath", "B_OA_SendDoc_ZhiDui")]
        public string articlePath
        {
            get { return _articlePath; }
            set { _articlePath = value; }
        }
        private string _articlePath;

        /// <summary>
        /// 签发
        /// </summary>
        [DataField("qf", "B_OA_SendDoc_ZhiDui")]
        public string qf
        {
            get { return _qf; }
            set { _qf = value; }
        }
        private string _qf;


        /// <summary>
        /// 会办单位意
        /// </summary>
        [DataField("hbdwyj", "B_OA_SendDoc_ZhiDui")]
        public string hbdwyj
        {
            get { return _hbdwyj; }
            set { _hbdwyj = value; }
        }
        private string _hbdwyj;

        /// <summary>
        /// 分局领导审核
        /// </summary>
        [DataField("fjldsh", "B_OA_SendDoc_ZhiDui")]
        public string fjldsh
        {
            get { return _fjldsh; }
            set { _fjldsh = value; }
        }
        private string _fjldsh;

        /// <summary>
        /// 拟稿部门拟稿
        /// </summary>
        [DataField("ngbmfzrng", "B_OA_SendDoc_ZhiDui")]
        public string ngbmfzrng
        {
            get { return _ngbmfzrng; }
            set { _ngbmfzrng = value; }
        }
        private string _ngbmfzrng;

        /// <summary>
        /// 办公室领导审核
        /// </summary>
        [DataField("bgsldsh", "B_OA_SendDoc_ZhiDui")]
        public string bgsldsh
        {
            get { return _bgsldsh; }
            set { _bgsldsh = value; }
        }
        private string _bgsldsh;

        /// <summary>
        /// 拟稿部门负责任
        /// </summary>
        [DataField("ngbmjfzr", "B_OA_SendDoc_ZhiDui")]
        public string ngbmjfzr
        {
            get { return _ngbmjfzr; }
            set { _ngbmjfzr = value; }
        }
        private string _ngbmjfzr;

        /// <summary>
        /// 一校
        /// </summary>
        [DataField("yx", "B_OA_SendDoc_ZhiDui")]
        public string yx
        {
            get { return _yx; }
            set { _yx = value; }
        }
        private string _yx;

        /// <summary>
        /// 二校
        /// </summary>
        [DataField("ex", "B_OA_SendDoc_ZhiDui")]
        public string ex
        {
            get { return _ex; }
            set { _ex = value; }
        }
        private string _ex;


        /// <summary>
        /// 审批意见
        /// </summary>
        [DataField("spyj", "B_OA_SendDoc_ZhiDui")]
        public string spyj
        {
            get { return _spyj; }
            set { _spyj = value; }
        }
        private string _spyj;

        /// <summary>
        /// 公开类型(1.主动公开2.依申请公开3.不予公开 )
        /// </summary>
        [DataField("gklx", "B_OA_SendDoc_ZhiDui")]
        public string gklx
        {
            get { return _gklx; }
            set { _gklx = value; }
        }
        private string _gklx;

        /// <summary>
        /// 发文类型id（此字段用于文档中心的归类）
        /// </summary>
        [DataField("fwlxId", "B_OA_SendDoc_ZhiDui")]
        public string fwlxId
        {
            get { return _fwlxId; }
            set { _fwlxId = value; }
        }
        private string _fwlxId;

        /// <summary>
        /// 关联业务的草稿id
        /// </summary>
        [DataField("triggerBAID", "B_OA_SendDoc_ZhiDui")]
        public string triggerBAID
        {
            get { return _triggerBAID; }
            set { _triggerBAID = value; }
        }
        private string _triggerBAID;

        /// <summary>
        /// 打字员id
        /// </summary>
        [DataField("dzyId", "B_OA_SendDoc_ZhiDui")]
        public string dzyId
        {
            get { return _dzyId; }
            set { _dzyId = value; }
        }
        private string _dzyId;

        /// <summary>
        /// 一校ID
        /// </summary>
        [DataField("yxId", "B_OA_SendDoc_ZhiDui")]
        public string yxId
        {
            get { return _yxId; }
            set { _yxId = value; }
        }
        private string _yxId;

        /// <summary>
        /// 关联业务的草稿id
        /// </summary>
        [DataField("exId", "B_OA_SendDoc_ZhiDui")]
        public string exId
        {
            get { return _exId; }
            set { _exId = value; }
        }
        private string _exId;


        /// <summary>
        /// 公开类型(1.主动公开2.依申请公开3.不予公开 )
        /// </summary>
        public string webUrl
        {
            get
            {  //手写签批URL
                string server = HttpContext.Current.Request.ServerVariables["HTTP_HOST"];
                string url = "http://" + server + "/Forms/B_OA_CommonSighture/B_OA_CommonSightureOperation.ashx";
                return url;
            }
        }
        private string _webUrl;
    }
}
