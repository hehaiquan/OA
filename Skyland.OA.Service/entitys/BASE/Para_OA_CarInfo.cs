using IWorkFlow.DataBase;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IWorkFlow.ORM
{

    [Serializable]
    [DataTableInfo("Para_OA_CarInfo", "id")]
    public class Para_OA_CarInfo : QueryInfo
    {
        #region Model
        private int _id;
        private string _cph;
        private decimal? _zdlc;
        private decimal? _sjlc;
        private decimal? _whlc;
        private int? _sfky;
        private string _zt;
        /// <summary>
        /// id
        /// </summary>
        /// 
        [DataField("id", "Para_OA_CarInfo", false)]
        public int id
        {
            set { _id = value; }
            get { return _id; }
        }
        /// <summary>
        /// 车牌号
        /// </summary>
        /// 
        [DataField("cph", "Para_OA_CarInfo")]
        public string cph
        {
            set { _cph = value; }
            get { return _cph; }
        }

        /// <summary>
        /// 品牌
        /// </summary>
        private string _carBrand;
        [DataField("carBrand", "Para_OA_CarInfo")]
        public string carBrand
        {
            set { _carBrand = value; }
            get { return _carBrand; }
        }


        /// <summary>
        /// 型号
        /// </summary>
        private string _carModel;
        [DataField("carModel", "Para_OA_CarInfo")]
        public string carModel
        {
            set { _carModel = value; }
            get { return _carModel; }
        }

        /// <summary>
        /// 车辆类型
        /// </summary>
        private string _carType;
        [DataField("carType", "Para_OA_CarInfo")]
        public string carType
        {
            set { _carType = value; }
            get { return _carType; }
        }

        /// <summary>
        /// 最大路程(公路)
        /// </summary>
        /// 
        [DataField("zdlc", "Para_OA_CarInfo")]
        public decimal? zdlc
        {
            set { _zdlc = value; }
            get { return _zdlc; }
        }
        /// <summary>
        /// 实际路程(公里)
        /// </summary>
        /// 
        [DataField("sjlc", "Para_OA_CarInfo")]
        public decimal? sjlc
        {
            set { _sjlc = value; }
            get { return _sjlc; }
        }
        /// <summary>
        /// 维护路程(公里)
        /// </summary>
        /// 
        [DataField("whlc", "Para_OA_CarInfo")]
        public decimal? whlc
        {
            set { _whlc = value; }
            get { return _whlc; }
        }
        /// <summary>
        /// 车辆状态
        /// </summary>
        /// 
        [DataField("sfky", "Para_OA_CarInfo")]
        public int? sfky
        {
            set { _sfky = value; }
            get { return _sfky; }
        }
        public string foramtSfky
        {
            get { return _sfky == 0 ? "不可用" : "可用"; }
        }
        /// <summary>
        /// 状态描述
        /// </summary>
        /// 
        [DataField("zt", "Para_OA_CarInfo")]
        public string zt
        {
            set { _zt = value; }
            get { return _zt; }
        }

        /// <summary>
        /// 发动机
        /// </summary>
        private string _carEngine;
        [DataField("carEngine", "Para_OA_CarInfo")]
        public string carEngine
        {
            set { _carEngine = value; }
            get { return _carEngine; }
        }

        /// <summary>
        /// 底盘
        /// </summary>
        private string _chassis;
        [DataField("chassis", "Para_OA_CarInfo")]
        public string chassis
        {
            set { _chassis = value; }
            get { return _chassis; }
        }

        /// <summary>
        /// 颜色
        /// </summary>
        private string _color;
        [DataField("color", "Para_OA_CarInfo")]
        public string color
        {
            set { _color = value; }
            get { return _color; }
        }

        /// <summary>
        /// 载重
        /// </summary>
        private string _loadWeight;
        [DataField("loadWeight", "Para_OA_CarInfo")]
        public string loadWeight
        {
            set { _loadWeight = value; }
            get { return _loadWeight; }
        }
        /// <summary>
        /// 座位
        /// </summary>
        private string _seatCount;
        [DataField("seatCount", "Para_OA_CarInfo")]
        public string seatCount
        {
            set { _seatCount = value; }
            get { return _seatCount; }
        }

        /// <summary>
        /// 价格
        /// </summary>
        private string _price;
        [DataField("price", "Para_OA_CarInfo")]
        public string price
        {
            set { _price = value; }
            get { return _price; }
        }

        /// <summary>
        /// 生产日期
        /// </summary>
        private string _proDate;
        [DataField("proDate", "Para_OA_CarInfo")]
        public string proDate
        {
            set { _proDate = value; }
            get { return _proDate; }
        }

        /// <summary>
        /// 购买日期
        /// </summary>
        private string _buyDate;
        [DataField("buyDate", "Para_OA_CarInfo")]
        public string buyDate
        {
            set { _buyDate = value; }
            get { return _buyDate; }
        }

        /// <summary>
        /// 归属单位
        /// </summary>
        private string _belongTo;
        [DataField("belongTo", "Para_OA_CarInfo")]
        public string belongTo
        {
            set { _belongTo = value; }
            get { return _belongTo; }
        }

        /// <summary>
        /// 备注
        /// </summary>
        private string _remark;
        [DataField("remark", "Para_OA_CarInfo")]
        public string remark
        {
            set { _remark = value; }
            get { return _remark; }
        }


        /// <summary>
        /// 录入日期
        /// </summary>
        private string _recordDate;
        [DataField("recordDate", "Para_OA_CarInfo")]
        public string recordDate
        {
            set { _recordDate = value; }
            get { return _recordDate; }
        }

        /// <summary>
        /// 录入人
        /// </summary>
        private string _recordMan;
        [DataField("recordMan", "Para_OA_CarInfo")]
        public string recordMan
        {
            set { _recordMan = value; }
            get { return _recordMan; }
        }
        /// <summary>
        /// 司机
        /// </summary>
        [DataField("Driver", "Para_OA_CarInfo")]
        public string Driver { get; set; }

        public string driverName { get; set; }

        /// <summary>
        /// checkBOx
        /// </summary>
        public bool isCheck { get; set; }

        public string sfkyText { get; set; }

        /// <summary>
        /// 连续新增
        /// </summary>
        private bool _continueAdd;
        public bool continueAdd
        {
            set { _continueAdd = value; }
            get { return _continueAdd; }
        }

        #endregion Model
    }
}
