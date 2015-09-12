
using IWorkFlow.DataBase;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IWorkFlow.ORM
{
    [Serializable]
    [DataTableInfo("GIS_PSS_IndustryBaseinfo", "ID")]
    public class GIS_PSS_IndustryBaseinfo : QueryInfo
    {
        [DataField("代码", "GIS_PSS_IndustryBaseinfo")]
        public string 代码
        {
            get { return this._代码; }
            set { this._代码 = value; }
        }
        string _代码;

        [DataField("调查对象类型代码", "GIS_PSS_IndustryBaseinfo")]
        public string 调查对象类型代码
        {
            get { return this._调查对象类型代码; }
            set { this._调查对象类型代码 = value; }
        }
        string _调查对象类型代码;

        [DataField("名称", "GIS_PSS_IndustryBaseinfo")]
        public string 名称
        {
            get { return this._名称; }
            set { this._名称 = value; }
        }
        string _名称;

        [DataField("编号", "GIS_PSS_IndustryBaseinfo")]
        public string 编号
        {
            get { return this._编号; }
            set { this._编号 = value; }
        }
        string _编号;

        [DataField("父代码", "GIS_PSS_IndustryBaseinfo")]
        public string 父代码
        {
            get { return this._父代码; }
            set { this._父代码 = value; }
        }
        string _父代码;

        [DataField("行政区划代码", "GIS_PSS_IndustryBaseinfo")]
        public string 行政区划代码
        {
            get { return this._行政区划代码; }
            set { this._行政区划代码 = value; }
        }
        string _行政区划代码;

        [DataField("标签代码", "GIS_PSS_IndustryBaseinfo")]
        public string 标签代码
        {
            get { return this._标签代码; }
            set { this._标签代码 = value; }
        }
        string _标签代码;

        [DataField("专业代码", "GIS_PSS_IndustryBaseinfo")]
        public string 专业代码
        {
            get { return this._专业代码; }
            set { this._专业代码 = value; }
        }
        string _专业代码;

        [DataField("行业类别_代码", "GIS_PSS_IndustryBaseinfo")]
        public int 行业类别_代码
        {
            get { return this._行业类别_代码; }
            set { this._行业类别_代码 = value; }
        }
        int _行业类别_代码;

        [DataField("行业类别_名称", "GIS_PSS_IndustryBaseinfo")]
        public string 行业类别_名称
        {
            get { return this._行业类别_名称; }
            set { this._行业类别_名称 = value; }
        }
        string _行业类别_名称;

        [DataField("企业规模", "GIS_PSS_IndustryBaseinfo")]
        public int 企业规模
        {
            get { return this._企业规模; }
            set { this._企业规模 = value; }
        }
        int _企业规模;

        [DataField("登记注册类型", "GIS_PSS_IndustryBaseinfo")]
        public int 登记注册类型
        {
            get { return this._登记注册类型; }
            set { this._登记注册类型 = value; }
        }
        int _登记注册类型;

        [DataField("开业时间_年", "GIS_PSS_IndustryBaseinfo")]
        public int 开业时间_年
        {
            get { return this._开业时间_年; }
            set { this._开业时间_年 = value; }
        }
        int _开业时间_年;

        [DataField("开业时间_月", "GIS_PSS_IndustryBaseinfo")]
        public int 开业时间_月
        {
            get { return this._开业时间_月; }
            set { this._开业时间_月 = value; }
        }
        int _开业时间_月;

        [DataField("最新改扩建时间_年", "GIS_PSS_IndustryBaseinfo")]
        public string 最新改扩建时间_年
        {
            get { return this._最新改扩建时间_年; }
            set { this._最新改扩建时间_年 = value; }
        }
        string _最新改扩建时间_年;

        [DataField("最新改扩建时间_月", "GIS_PSS_IndustryBaseinfo")]
        public string 最新改扩建时间_月
        {
            get { return this._最新改扩建时间_月; }
            set { this._最新改扩建时间_月 = value; }
        }
        string _最新改扩建时间_月;

        [DataField("年生产时间_小时", "GIS_PSS_IndustryBaseinfo")]
        public int 年生产时间_小时
        {
            get { return this._年生产时间_小时; }
            set { this._年生产时间_小时 = value; }
        }
        int _年生产时间_小时;

        [DataField("工业总产值_万元", "GIS_PSS_IndustryBaseinfo")]
        public float 工业总产值_万元
        {
            get { return this._工业总产值_万元; }
            set { this._工业总产值_万元 = value; }
        }
        float _工业总产值_万元;

        [DataField("传真号码", "GIS_PSS_IndustryBaseinfo")]
        public string 传真号码
        {
            get { return this._传真号码; }
            set { this._传真号码 = value; }
        }
        string _传真号码;

        [DataField("街村门牌号", "GIS_PSS_IndustryBaseinfo")]
        public string 街村门牌号
        {
            get { return this._街村门牌号; }
            set { this._街村门牌号 = value; }
        }
        string _街村门牌号;

        [DataField("电话号码", "GIS_PSS_IndustryBaseinfo")]
        public string 电话号码
        {
            get { return this._电话号码; }
            set { this._电话号码 = value; }
        }
        string _电话号码;

        [DataField("日", "GIS_PSS_IndustryBaseinfo")]
        public int 日
        {
            get { return this._日; }
            set { this._日 = value; }
        }
        int _日;

        [DataField("法定代表人", "GIS_PSS_IndustryBaseinfo")]
        public string 法定代表人
        {
            get { return this._法定代表人; }
            set { this._法定代表人 = value; }
        }
        string _法定代表人;

        [DataField("分机号码", "GIS_PSS_IndustryBaseinfo")]
        public string 分机号码
        {
            get { return this._分机号码; }
            set { this._分机号码 = value; }
        }
        string _分机号码;

        [DataField("单位负责人", "GIS_PSS_IndustryBaseinfo")]
        public string 单位负责人
        {
            get { return this._单位负责人; }
            set { this._单位负责人 = value; }
        }
        string _单位负责人;

        [DataField("中心经度_度", "GIS_PSS_IndustryBaseinfo")]
        public float 中心经度_度
        {
            get { return this._中心经度_度; }
            set { this._中心经度_度 = value; }
        }
        float _中心经度_度;

        [DataField("中心经度_分", "GIS_PSS_IndustryBaseinfo")]
        public float 中心经度_分
        {
            get { return this._中心经度_分; }
            set { this._中心经度_分 = value; }
        }
        float _中心经度_分;

        [DataField("联系人姓名", "GIS_PSS_IndustryBaseinfo")]
        public string 联系人姓名
        {
            get { return this._联系人姓名; }
            set { this._联系人姓名 = value; }
        }
        string _联系人姓名;

        [DataField("中心经度_秒", "GIS_PSS_IndustryBaseinfo")]
        public float 中心经度_秒
        {
            get { return this._中心经度_秒; }
            set { this._中心经度_秒 = value; }
        }
        float _中心经度_秒;

        [DataField("中心经度", "GIS_PSS_IndustryBaseinfo")]
        public float 中心经度
        {
            get { return this._中心经度; }
            set { this._中心经度 = value; }
        }
        float _中心经度;

        [DataField("备注说明", "GIS_PSS_IndustryBaseinfo")]
        public string 备注说明
        {
            get { return this._备注说明; }
            set { this._备注说明 = value; }
        }
        string _备注说明;

        [DataField("月", "GIS_PSS_IndustryBaseinfo")]
        public int 月
        {
            get { return this._月; }
            set { this._月 = value; }
        }
        int _月;

        [DataField("区号", "GIS_PSS_IndustryBaseinfo")]
        public string 区号
        {
            get { return this._区号; }
            set { this._区号 = value; }
        }
        string _区号;

        [DataField("地区_市州盟", "GIS_PSS_IndustryBaseinfo")]
        public string 地区_市州盟
        {
            get { return this._地区_市州盟; }
            set { this._地区_市州盟 = value; }
        }
        string _地区_市州盟;

        [DataField("省_自治区_直辖市", "GIS_PSS_IndustryBaseinfo")]
        public string 省_自治区_直辖市
        {
            get { return this._省_自治区_直辖市; }
            set { this._省_自治区_直辖市 = value; }
        }
        string _省_自治区_直辖市;

        [DataField("审核人", "GIS_PSS_IndustryBaseinfo")]
        public string 审核人
        {
            get { return this._审核人; }
            set { this._审核人 = value; }
        }
        string _审核人;

        [DataField("填表人", "GIS_PSS_IndustryBaseinfo")]
        public string 填表人
        {
            get { return this._填表人; }
            set { this._填表人 = value; }
        }
        string _填表人;

        [DataField("中心纬度_度", "GIS_PSS_IndustryBaseinfo")]
        public float 中心纬度_度
        {
            get { return this._中心纬度_度; }
            set { this._中心纬度_度 = value; }
        }
        float _中心纬度_度;

        [DataField("中心纬度_分", "GIS_PSS_IndustryBaseinfo")]
        public float 中心纬度_分
        {
            get { return this._中心纬度_分; }
            set { this._中心纬度_分 = value; }
        }
        float _中心纬度_分;

        [DataField("县_区市旗", "GIS_PSS_IndustryBaseinfo")]
        public string 县_区市旗
        {
            get { return this._县_区市旗; }
            set { this._县_区市旗 = value; }
        }
        string _县_区市旗;

        [DataField("中心纬度_秒", "GIS_PSS_IndustryBaseinfo")]
        public float 中心纬度_秒
        {
            get { return this._中心纬度_秒; }
            set { this._中心纬度_秒 = value; }
        }
        float _中心纬度_秒;

        [DataField("中心纬度", "GIS_PSS_IndustryBaseinfo")]
        public float 中心纬度
        {
            get { return this._中心纬度; }
            set { this._中心纬度 = value; }
        }
        float _中心纬度;

        [DataField("乡镇", "GIS_PSS_IndustryBaseinfo")]
        public string 乡镇
        {
            get { return this._乡镇; }
            set { this._乡镇 = value; }
        }
        string _乡镇;

        [DataField("年", "GIS_PSS_IndustryBaseinfo")]
        public int 年
        {
            get { return this._年; }
            set { this._年 = value; }
        }
        int _年;

        [DataField("邮政编码", "GIS_PSS_IndustryBaseinfo")]
        public string 邮政编码
        {
            get { return this._邮政编码; }
            set { this._邮政编码 = value; }
        }
        string _邮政编码;

        [DataField("ID", "GIS_PSS_IndustryBaseinfo",false)]
        public int ID
        {
            get { return this._ID; }
            set { this._ID = value; }
        }
        int _ID;

        [DataField("是否修改", "GIS_PSS_IndustryBaseinfo")]
        public string 是否修改
        {
            get { return this._是否修改; }
            set { this._是否修改 = value; }
        }
        string _是否修改;

    }
}
