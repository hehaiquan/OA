using IWorkFlow.DataBase;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace IWorkFlow.ORM
{
    //发文
    [Serializable]
    [DataTableInfo("B_Goods", "id")]
    public class B_Goods : QueryInfo
    {
        #region Model
        private int _id;
        private string _zcbh;
        private string _zclb;
        private string _scrq;
        private string _ghdw;
        private string _zczt;
        private string _bgry;
        private string _scdw;
        private string _zjl;
        private string _gdsynx;
        private string _bgqk;
        private string _bz;
        private string _zcmc;
        private string _jldw;
        private string _dwmc;
        private decimal _cgje;
        private string _sybm;
        private string _azfy;
        private string _qyrq;
        private string _synx;
        private string _gmrq;
        private string _bgryName;
        private string _sybmName;
        private string _wpzt;
        private string _recordMan;
        private string _recordDate;
        private string _deleteMan;
        private string _deleteDate;
        private int _isDelete;
        private string _zclbName;
        private string _sylbName;
        private string _wpztName;
        
        
        [DataField("id", "B_Goods",false)]
        public int id
        {
            set { _id = value; }
            get { return _id; }
        }

        /// <summary>
        /// 资产编号
        /// </summary>
        [DataField("zcbh", "B_Goods")]
        public string zcbh
        {
            set { _zcbh = value; }
            get { return _zcbh; }
        }

        /// <summary>
        /// 资产类别
        /// </summary>
        [DataField("zclb", "B_Goods")]
        public string zclb
        {
            set { _zclb = value; }
            get { return _zclb; }
        }
        /// <summary>
        /// 生产日期
        /// </summary>
        [DataField("scrq", "B_Goods")]
        public string scrq
        {
            set { _scrq = value; }
            get { return _scrq; }
        }
        /// <summary>
        /// 供货单位
        /// </summary>
        [DataField("ghdw", "B_Goods")]
        public string ghdw
        {
            set { _ghdw = value; }
            get { return _ghdw; }
        }
        /// <summary>
        /// 资产状态
        /// </summary>
        [DataField("zczt", "B_Goods")]
        public string zczt
        {
            set { _zczt = value; }
            get { return _zczt; }
        }

        /// <summary>
        /// 保管人员
        /// </summary>
        [DataField("bgry", "B_Goods")]
        public string bgry
        {
            set { _bgry = value; }
            get { return _bgry; }
        }
        /// <summary>
        /// 生产单位
        /// </summary>
        [DataField("scdw", "B_Goods")]
        public string scdw
        {
            set { _scdw = value; }
            get { return _scdw; }
        }
        /// <summary>
        /// 折旧率
        /// </summary>
        [DataField("zjl", "B_Goods")]
        public string zjl
        {
            set { _zjl = value; }
            get { return _zjl; }
        }
        /// <summary>
        /// 规定使用年限
        /// </summary>
        [DataField("gdsynx", "B_Goods")]
        public string gdsynx
        {
            set { _gdsynx = value; }
            get { return _gdsynx; }
        }
        /// <summary>
        /// 保管情况
        /// </summary>
        [DataField("bgqk", "B_Goods")]
        public string bgqk
        {
            set { _bgqk = value; }
            get { return _bgqk; }
        }
        /// <summary>
        /// 备注
        /// </summary>
        [DataField("bz", "B_Goods")]
        public string bz
        {
            set { _bz = value; }
            get { return _bz; }
        }
        /// <summary>
        /// 资产名称
        /// </summary>
        [DataField("zcmc", "B_Goods")]
        public string zcmc
        {
            set { _zcmc = value; }
            get { return _zcmc; }
        }
        /// <summary>
        /// 计量单位
        /// </summary>
        [DataField("jldw", "B_Goods")]
        public string jldw
        {
            set { _jldw = value; }
            get { return _jldw; }
        }
        /// <summary>
        /// 单位名称
        /// </summary>
        [DataField("dwmc", "B_Goods")]
        public string dwmc
        {
            set { _dwmc = value; }
            get { return _dwmc; }
        }
        /// <summary>
        /// 采购金额
        /// </summary>
        [DataField("cgje", "B_Goods")]
        public decimal cgje
        {
            set { _cgje = value; }
            get { return _cgje; }
        }
        /// <summary>
        /// 使用部门
        /// </summary>
        [DataField("sybm", "B_Goods")]
        public string sybm
        {
            set { _sybm = value; }
            get { return _sybm; }
        }
        /// <summary>
        /// 安装费用
        /// </summary>
        [DataField("azfy", "B_Goods")]
        public string azfy
        {
            set { _azfy = value; }
            get { return _azfy; }
        }
        /// <summary>
        /// 启用日期
        /// </summary>
        [DataField("qyrq", "B_Goods")]
        public string qyrq
        {
            set { _qyrq = value; }
            get { return _qyrq; }
        }
        /// <summary>
        /// 已使用年限
        /// </summary>
        [DataField("synx", "B_Goods")]
        public string ysynx
        {
            set { _synx = value; }
            get { return _synx; }
        }
        /// <summary>
        /// 购买日期
        /// </summary>
        [DataField("gmrq", "B_Goods")]
        public string gmrq
        {
            set { _gmrq = value; }
            get { return _gmrq; }
        }
          /// <summary>
        /// 物品状态
        /// </summary>
        [DataField("wpzt", "B_Goods")]
        public string wpzt
        {
            set { _wpzt = value; }
            get { return _wpzt; }
        }
              /// <summary>
        /// 保管人员名称
        /// </summary>
        public string bgryName
        {
            set { _bgryName = value; }
            get { return _bgryName; }
        }

        /// <summary>
        /// 使用部门名称
        /// </summary>
        public string sybmName
        {
            set { _sybmName = value; }
            get { return _sybmName; }
        }

        /// <summary>
        /// 录入人
        /// </summary>
        [DataField("recordMan", "B_Goods")]
        public string recordMan
        {
            set { _recordMan = value; }
            get { return _recordMan; }
        }

        /// <summary>
        /// 录入日期
        /// </summary>
        [DataField("recordDate", "B_Goods")]
        public string recordDate
        {
            set { _recordDate = value; }
            get { return _recordDate; }
        }

        /// <summary>
        /// 删除人
        /// </summary>
        [DataField("deleteMan", "B_Goods")]
        public string deleteMan
        {
            set { _deleteMan = value; }
            get { return _deleteMan; }
        }


        /// <summary>
        /// 删除日期
        /// </summary>
        [DataField("deleteDate", "B_Goods")]
        public string deleteDate
        {
            set { _deleteDate = value; }
            get { return _deleteDate; }
        }

        
        /// <summary>
        /// 是否删除
        /// </summary>
        [DataField("isDelete", "B_Goods")]
        public int isDelete
        {
            set { _isDelete = value; }
            get { return _isDelete; }
        }

        private string _quitMethod;
        /// <summary>
        /// 推出方式
        /// </summary>
        [DataField("quitMethod", "B_Goods")]
        public string quitMethod
        {
            set { _quitMethod = value; }
            get { return _quitMethod; }
        }

        private string _buyMethod;
        /// <summary>
        /// 购置方式
        /// </summary>
        [DataField("buyMethod", "B_Goods")]
        public string buyMethod
        {
            set { _buyMethod = value; }
            get { return _buyMethod; }
        }

        private string _instoragePlace;
        /// <summary>
        /// 存放地
        /// </summary>
        [DataField("instoragePlace", "B_Goods")]
        public string instoragePlace
        {
            set { _instoragePlace = value; }
            get { return _instoragePlace; }
        }


        private string _originalDep;
        /// <summary>
        /// 原始部门（第一次加入时的部门，此部门字段只有在转移的时候才会有改动）
        /// </summary>
        [DataField("originalDep", "B_Goods")]
        public string originalDep
        {
            set { _originalDep = value; }
            get { return _originalDep; }
        }


        private string _originalProtectman;
        /// <summary>
        ///原始保管人员（第一次加入时的保管人员，此字段只有在转移的时候才会有改动）
        /// </summary>
        [DataField("originalProtectman", "B_Goods")]
        public string originalProtectman
        {
            set { _originalProtectman = value; }
            get { return _originalProtectman; }
        }

        /// <summary>
        ///物品状态名称
        /// </summary>
        [DataField("bgryId", "B_Goods")]
        public string bgryId
        {
            set { _bgryId = value; }
            get { return _bgryId; }
        }
        private string _bgryId;

        private string _originalProtectmanName;
        /// <summary>
        ///原始保管人员名字
        /// </summary>
        public string originalProtectmanName
        {
            set { _originalProtectmanName = value; }
            get { return _originalProtectmanName; }
        }


        private string _originalDepName;
        /// <summary>
        ///原始保管部门
        /// </summary>
        public string originalDepName
        {
            set { _originalDepName = value; }
            get { return _originalDepName; }
        }
        /// <summary>
        /// 资产类别名称
        /// </summary>
        public string zclbName
        {
            set { _zclbName = value; }
            get { return _zclbName; }
        }


        /// <summary>
        /// 使用类别名称
        /// </summary>
        public string sylbName
        {
            set { _sylbName = value; }
            get { return _sylbName; }
        }

        /// <summary>
        ///物品状态名称
        /// </summary>
        public string wpztName
        {
            set { _wpztName = value; }
            get { return _wpztName; }
        }
        
        #endregion Model
    }
}
