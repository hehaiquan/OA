using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BizService.Services;
using IWorkFlow.Host;
using IWorkFlow.ORM;
using Newtonsoft.Json;

namespace BizService.B_GoodsSvc
{
    public class B_GoodsSvc : BaseDataHandler
    {

        [DataAction("SearchGoods", "content")]
        public string SearchGoods(string content)
        {
            var tran = Utility.Database.BeginDbTransaction();
            var data = new B_GoodsSvc.GetDataModel();
            try
            {
                StringBuilder sql = new StringBuilder();
                sql.AppendFormat(@"SELECT newTb.*,b.mc,a1.CnName as bgryName,b1.DPName as sybmName,c1.CnName as originalProtectmanName,d1.DPName as originalDepName,
                 a.mc as zclbName,b.mc as jldwName,c.mc as bgqkName,d.mc as wpztName from B_Goods as newTb
                 left join (select * from Para_BizTypeItem where flid = (select id from Para_BizTypeDictionary where lx='goodsTypeDic')) as a on newTb.zclb=a.csz 
                 left join (select * from Para_BizTypeItem where flid = (select id from Para_BizTypeDictionary where lx='unitDic')) as b on newTb.jldw = b.csz
                 left join (select * from Para_BizTypeItem where flid = (select id from Para_BizTypeDictionary where lx='protectTypeDic')) as c on newTb.bgqk = c.csz
                 left join (select * from Para_BizTypeItem where flid = (select id from Para_BizTypeDictionary where lx='goodsStatusDic')) as d on newTb.wpzt = d.csz
                 left join FX_UserInfo as a1 on newTb.bgry=a1.UserID 
                 left join FX_Department as b1 on newTb.sybm = b1.DPID
                 left join FX_UserInfo as c1 on newTb.originalProtectman=c1.UserID 
                 left join FX_Department as d1 on newTb.originalDep = d1.DPID
                 where newTb.isDelete=0 ORDER BY newTb.recordDate DESC
                ");
                DataSet goodsDataSet = Utility.Database.ExcuteDataSet(sql.ToString(), tran);
                Utility.Database.Commit(tran);
                string jsonData = JsonConvert.SerializeObject(goodsDataSet.Tables[0]);
                data.dataList = (List<B_Goods>)JsonConvert.DeserializeObject(jsonData, typeof(List<B_Goods>));
                data.dataEdit = new B_Goods();
                return Utility.JsonResult(true, "数据加载成功", data);//将对象转为json字符串并返回到客户端
            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "数据加载失败！异常信息: " + e.Message);
            }
        }

        /// <summary>
        /// 返回空的实体
        /// </summary>
        /// <param name="content"></param>
        /// <returns></returns>
        [DataAction("GetGoodsModel", "content")]
        public string GetGoodsModel(string content)
        {
            B_Goods model = new B_Goods();
            return Utility.JsonResult(true, null, model);
        }

        /// <summary>
        /// 返回空的实体
        /// </summary>
        /// <param name="content"></param>
        /// <returns></returns>
        [DataAction("GetData", "content")]
        public string GetData(string content)
        {
            GetDataModel model = new GetDataModel();
            B_Goods goodsEnt = new B_Goods();
            B_GoodsStatusRecord goodStatusRecordEnt = new B_GoodsStatusRecord();
            model.dataEdit = Utility.Database.QueryObject<B_Goods>(goodsEnt);
            model.dataGoodsStatusRecordEdit = Utility.Database.QueryObject<B_GoodsStatusRecord>(goodStatusRecordEnt);
            return Utility.JsonResult(true, null, model);
        }

        /// <summary>
        /// 返回空的实体
        /// </summary>
        /// <param name="content"></param>
        /// <returns></returns>
        [DataAction("GetB_GoodsStatusRecordModel", "content")]
        public string GetB_GoodsStatusRecordModel(string content)
        {
            B_GoodsStatusRecord model = new B_GoodsStatusRecord();
            List<B_GoodsStatusRecord> list = new List<B_GoodsStatusRecord>();
            list.Add(model);
            return Utility.JsonResult(true, null, list);
        }

        /// <summary>
        /// 保存固定资产
        /// </summary>
        /// <param name="JsonData">要保存的数据</param>
        /// <returns>反回json结果</returns>
        [DataAction("SaveGoods", "JsonData", "userName", "userid")]
        public string SaveGoods(string JsonData, string userName, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                StringBuilder validateTip = new StringBuilder();//验证提示

                B_Goods goods = JsonConvert.DeserializeObject<B_Goods>(JsonData);

                //验证
                if (goods.zclb == "" || goods.zclb == null)
                {//资产类别
                    validateTip.Append("\r\n请选择资产类别!");
                }

                if (goods.zcmc == "" || goods.zcmc == null)//资产名称
                {
                    validateTip.Append("\r\n资产名称不能为空!");
                }

                if (goods.sybm == "" || goods.sybm == null)//资产名称
                {
                    validateTip.Append("\r\n使用部门不能为空!");
                }
                if (goods.bgry == "" || goods.bgry == null)//资产名称
                {
                    validateTip.Append("\r\n保管人员不能为空!");
                }
                if (validateTip.Length > 0) throw new Exception(validateTip.ToString());


                if (goods.id == 0 || goods.id == null)
                {
                    //新增
                    goods.zcbh = GetGoodsNo();//资产编号
                    goods.recordMan = userid;
                    goods.recordDate = DateTime.Now.ToString();
                    goods.isDelete = 0;//删除状态设置为未删除
                    goods.wpzt = "1";
                    goods.originalDep = goods.sybm;//原始的使用部门
                    goods.originalProtectman = goods.bgry;//原始的保管人员
                    Utility.Database.Insert(goods, tran);
                    Utility.Database.Commit(tran);
                    B_Goods model = new B_Goods();
                    model = GetGoodsById(goods.zcbh);
                    //添加一条记录
                    AddGoodsRecordWhenNewGoodsAdd(model, userid);
                    return Utility.JsonResult(true, "保存数据成功", model);
                }
                else
                {
                    goods.Condition.Add("ID=" + goods.id);
                    //修改
                    Utility.Database.Update<B_Goods>(goods, tran);
                    Utility.Database.Commit(tran);
                    return Utility.JsonResult(true, "保存数据成功");
                }
            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "保存数据失败！异常信息: " + e.Message); ;//将对象转为json字符串并返回到客户端
            }
        }

        public B_Goods GetGoodsById(string zcbh)
        {
            var tran = Utility.Database.BeginDbTransaction();

            StringBuilder strSql = new StringBuilder();
            strSql.AppendFormat(@"
               SELECT newTb.*,b.mc,a1.CnName as bgryName,b1.DPName as sybmName,c1.CnName as originalProtectmanName,d1.DPName as originalDepName,
                 a.mc as zclbName,b.mc as jldwName,c.mc as bgqkName,d.mc as wpztName from B_Goods as newTb
                 left join (select * from Para_BizTypeItem where flid = (select id from Para_BizTypeDictionary where lx='goodsTypeDic')) as a on newTb.zclb=a.csz 
                 left join (select * from Para_BizTypeItem where flid = (select id from Para_BizTypeDictionary where lx='unitDic')) as b on newTb.jldw = b.csz
                 left join (select * from Para_BizTypeItem where flid = (select id from Para_BizTypeDictionary where lx='protectTypeDic')) as c on newTb.bgqk = c.csz
                 left join (select * from Para_BizTypeItem where flid = (select id from Para_BizTypeDictionary where lx='goodsStatusDic')) as d on newTb.wpzt = d.csz
                 left join FX_UserInfo as a1 on newTb.bgry=a1.UserID 
                 left join FX_Department as b1 on newTb.sybm = b1.DPID
                 left join FX_UserInfo as c1 on newTb.originalProtectman=c1.UserID 
                 left join FX_Department as d1 on newTb.originalDep = d1.DPID
                 where newTb.zcbh={0}", zcbh);
            DataSet ds = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
            Utility.Database.Commit(tran);
            string jsonData = JsonConvert.SerializeObject(ds.Tables[0]);
            List<B_Goods> listB_Goods = (List<B_Goods>)JsonConvert.DeserializeObject(jsonData, typeof(List<B_Goods>));
            return listB_Goods[0];
        }


        /// <summary>
        /// 删除资产
        /// </summary>
        /// <param name="id">资产主键</param>
        /// <param name="userId">用户主键</param>
        /// <returns></returns>
        [DataAction("DeleteGoods", "id", "userid")]
        public string DeleteGoods(string id, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            StringBuilder strinBuilder = new StringBuilder();
            try
            {
                //int i = GetGoodsRecordExistById(id);
                //if (i > 0) throw new Exception("此物品还有状态记录，无法删除，请将此物品的状态记录删除后，再做次操作。");
                //strinBuilder.AppendFormat("update B_Goods set isDelete = 1,deleteMan='{0}',deleteDate='{1}' where id={2}", userid, DateTime.Now, id);
                //Utility.Database.ExecuteNonQuery(strinBuilder.ToString(), tran);
                //先删除记录表的相关内容
                DeleteGoodsRecordListByGoodsId(id);
                B_Goods goods = new B_Goods();
                goods.Condition.Add("id=" + id);
                Utility.Database.Delete(goods);
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "删除除数据成功");
            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "册除数据失败！异常信息: " + e.Message);
            }
        }

        /// <summary>
        /// 通过物品id删除物品记录
        /// </summary>
        /// <param name="id">物品ID</param>
        public void DeleteGoodsRecordListByGoodsId(string id) {
            B_GoodsStatusRecord goodsReocrd = new B_GoodsStatusRecord();
            var tran = Utility.Database.BeginDbTransaction();
            goodsReocrd.Condition.Add("goodsId="+id);
            Utility.Database.Delete(goodsReocrd);

            Utility.Database.Commit(tran);
        }

        //查找物品是否存在于记录表内，若存在就不能删除
        public int GetGoodsRecordExistById(string goodsId)
        {
            var tran = Utility.Database.BeginDbTransaction();
            StringBuilder strinBuilder = new StringBuilder();
            strinBuilder.AppendFormat("select count(*) from B_GoodsStatusRecord where goodsId='{0}'", goodsId);
            DataSet ds = Utility.Database.ExcuteDataSet(strinBuilder.ToString(), tran);
            Utility.Database.Commit(tran);
            return int.Parse(ds.Tables[0].Rows[0][0].ToString());

        }
        ////将前台的信息复制存入对象中
        //public B_Goods CopyGoodsToSave(B_Goods goods)
        //{
        //    B_Goods newGoods = new B_Goods();

        //    newGoods.zcmc = goods.zcmc;//资产名称
        //    newGoods.zclb = goods.zcbh;//资产编号
        //    newGoods.ghdw = goods.zclb;//资产类别
        //    newGoods.scrq = goods.scrq;//生产日期
        //    newGoods.ghdw = goods.ghdw;//供货单位
        //    newGoods.zczt = goods.zczt;//资产状态
        //    newGoods.bgry = goods.bgry;//保管人员
        //    newGoods.zjl = goods.zjl;//折旧率
        //    newGoods.gdsynx = goods.gdsynx;//规定使用年限
        //    newGoods.bgqk = goods.bgqk;//保管情况
        //    newGoods.bz = goods.bz;//备注
        //    newGoods.jldw = goods.jldw;//计量单位
        //    newGoods.cgje = goods.cgje;//采购金额
        //    newGoods.dwmc = goods.dwmc;//单位名称
        //    newGoods.cgje = goods.cgje;//资产名称
        //    newGoods.sybm = goods.sybm;//使用部门
        //    newGoods.azfy = goods.azfy;//安装费用
        //    newGoods.gmrq = goods.gmrq;//购买日期
        //    newGoods.qyrq = goods.qyrq;//启用日期

        //    return newGoods;
        //}

        /// <summary>
        /// 取固定资产编号（唯一值）
        /// </summary>
        /// <returns></returns>

        public string GetGoodsNo()
        {
            string sql = "select max(id) from B_Goods";
            DataSet dataSet = Utility.Database.ExcuteDataSet(sql);
            string code = DateTime.Now.ToString("yyyyMMdd").ToString() + dataSet.Tables[0].Rows[0][0];
            return code;
        }

        /// <summary>
        /// 修改物品状态
        /// </summary>
        /// <param name="goodsInforModel">物品原信息</param>
        /// <param name="goodsStatuModel">物品状态记录信息</param>
        /// <param name="newGoodsInforModel">修改后的物品信息</param>
        /// <returns></returns>
        [DataAction("UpdateGoodsStatus", "goodsInforModel", "goodsStatuModel", "newGoodsInforModel", "userName", "userid")]
        public string UpdateGoodsStatus(string goodsInforModel, string goodsStatuModel, string newGoodsInforModel, string userName, string userid)
        {


            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                B_Goods oldGoods = JsonConvert.DeserializeObject<B_Goods>(goodsInforModel);
                B_GoodsStatusRecord goodsRecord = JsonConvert.DeserializeObject<B_GoodsStatusRecord>(goodsStatuModel);
                B_Goods newGoods = JsonConvert.DeserializeObject<B_Goods>(newGoodsInforModel);
                //修改物品表的数据状态
                newGoods.Condition.Add("ID=" + newGoods.id);
                Utility.Database.Update<B_Goods>(newGoods, tran);
                //添加记录到物品记录表
                goodsRecord.goodsId = newGoods.id;
                goodsRecord.recordDate = DateTime.Now.ToString();
                goodsRecord.recordManId = userid;
                goodsRecord.recordMan = userName;
                goodsRecord.goodsStatus = newGoods.wpzt;
                goodsRecord.isDelete = 0;
                goodsRecord.originalGoodsStatus = oldGoods.wpzt;
                goodsRecord.originalProtectMan = oldGoods.bgry;
                goodsRecord.originalUseDepartment = oldGoods.sybm;
                Utility.Database.Insert(goodsRecord, tran);
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "保存数据成功");
            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "保存数据失败！异常信息: " + e.Message); ;//将对象转为json字符串并返回到客户端
            }
        }

        public string SearchGoodsRecord(string goodsId, string goodsStatus)
        {
            var tran = Utility.Database.BeginDbTransaction();

            return null;
        }

        /// <summary>
        /// 保存修改、转移、借用、维修记录
        /// </summary>
        /// <param name="recordInfor">记录表的内容</param>
        /// <param name="detailInfor">固定资产信息</param>
        /// <param name="userName">用户名</param>
        /// <param name="userid">用户ID</param>
        /// <returns></returns>
        [DataAction("UpdateGoodsAndGoodsRecord", "recordInfor", "detailInfor", "userName", "userid")]
        public string UpdateGoodsAndGoodsRecord(string recordInforModel, string detailInfor, string userName, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                B_GoodsStatusRecord goodsRecordInfor = JsonConvert.DeserializeObject<B_GoodsStatusRecord>(recordInforModel);
                B_Goods goodsInfor = JsonConvert.DeserializeObject<B_Goods>(detailInfor);

                //插入一条记录
                goodsRecordInfor.goodsId = goodsInfor.id;//物品Id
                goodsRecordInfor.recordDate = DateTime.Now.ToString();//录入时间
                goodsRecordInfor.recordMan = userid;//录入人名称
                goodsRecordInfor.originalGoodsStatus = goodsInfor.wpzt;//原来物品状态
                goodsRecordInfor.originalProtectMan = goodsInfor.bgry;//原来保管人员
                goodsRecordInfor.originalUseDepartment = goodsInfor.sybm;//原来使用部门
                goodsRecordInfor.isDelete = 0;
                Utility.Database.Insert(goodsRecordInfor, tran);

                //修改物品状态、使用部门、保管人员
                goodsInfor.wpzt = goodsRecordInfor.goodsStatus;//物品状态
                goodsInfor.sybm = goodsRecordInfor.useDepartment;//使用部门
                goodsInfor.bgry = goodsRecordInfor.protectMan;//保管人员
                goodsInfor.quitMethod = goodsRecordInfor.quitMethod;//退出方式
                goodsInfor.Condition.Add("ID=" + goodsInfor.id);
                Utility.Database.Update<B_Goods>(goodsInfor, tran);

                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "保存数据成功");
            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "保存数据失败！异常信息: " + e.Message); ;//将对象转为json字符串并返回到客户端
            }
        }

        /// <summary>
        /// 当物品新增时，在记录表中添加一条物品状态为“正常”的记录，用作统计功能
        /// </summary>
        /// <param name="goods">物品对象</param>
        /// <param name="userid">录入人</param>
        /// <returns></returns>
        public string AddGoodsRecordWhenNewGoodsAdd(B_Goods goods, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            B_GoodsStatusRecord goodsRecordInfor = new B_GoodsStatusRecord();
            goodsRecordInfor.goodsId = goods.id;//物品Id
            goodsRecordInfor.recordDate = DateTime.Now.ToString();//录入时间
            goodsRecordInfor.recordMan = userid;//录入人名称
            goodsRecordInfor.originalGoodsStatus = goods.wpzt;//原来物品状态
            goodsRecordInfor.originalProtectMan = goods.bgry;//原来保管人员
            goodsRecordInfor.originalUseDepartment = goods.sybm;//原来使用部门
            goodsRecordInfor.isDelete = 0;

            goodsRecordInfor.useDepartment = goods.sybm;//使用部门
            goodsRecordInfor.goodsStatus = "1";//物品状态为正常状态
            goodsRecordInfor.protectMan = goods.bgry;//保管人员
            goodsRecordInfor.statusRemark = "新增记录";//备注
            Utility.Database.Insert(goodsRecordInfor, tran);
            Utility.Database.Commit(tran);
            return Utility.JsonResult(true, "保存数据成功");
        }

        /// <summary>
        /// 查找物品记录
        /// </summary>
        /// <param name="goodsId">物品主键</param>
        /// <returns></returns>
        [DataAction("GetGoodsRecordByGoodsId", "goodsId")]
        public string GetGoodsRecordByGoodsId(string goodsId)
        {

            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                StringBuilder stringSql = new StringBuilder();
                stringSql.AppendFormat(@"
                 select CONVERT(varchar(20),newTb.recordDate,120) as recordDate,newTb.*,a1.CnName as originalProtectManName,b1.DPName as originalUseDepartmentName,c1.CnName as recordManName,a.mc as goodsStatusName,b.mc as originalGoodsStatusName from B_GoodsStatusRecord as newTB 
                 left join (select * from Para_BizTypeItem where flid = (select id from Para_BizTypeDictionary where lx='goodsStatusDic')) as a on newTb.goodsStatus=a.csz 
                 left join (select * from Para_BizTypeItem where flid = (select id from Para_BizTypeDictionary where lx='goodsStatusDic')) as b on newTb.originalGoodsStatus=b.csz 
                 left join FX_UserInfo as a1 on newTb.originalProtectMan=a1.UserID
                 left join FX_Department as b1 on newTb.originalUseDepartment = b1.DPID
                 left join FX_UserInfo as c1 on newTb.recordMan=c1.UserID
                 where newTb.goodsId = {0} and newTb.goodsStatus =2

                 select CONVERT(varchar(20),newTb.recordDate,120) as recordDate,newTb.*,a1.CnName as originalProtectManName,b1.DPName as originalUseDepartmentName,c1.CnName as recordManName,a.mc as goodsStatusName,b.mc as originalGoodsStatusName from B_GoodsStatusRecord as newTB 
                 left join (select * from Para_BizTypeItem where flid = (select id from Para_BizTypeDictionary where lx='goodsStatusDic')) as a on newTb.goodsStatus=a.csz 
                 left join (select * from Para_BizTypeItem where flid = (select id from Para_BizTypeDictionary where lx='goodsStatusDic')) as b on newTb.originalGoodsStatus=b.csz 
                 left join FX_UserInfo as a1 on newTb.originalProtectMan=a1.UserID
                 left join FX_Department as b1 on newTb.originalUseDepartment = b1.DPID
                 left join FX_UserInfo as c1 on newTb.recordMan=c1.UserID
                 where newTb.goodsId = {0}and newTb.goodsStatus =3

                 select CONVERT(varchar(20),newTb.recordDate,120) as recordDate,newTb.*,a1.CnName as originalProtectManName,b1.DPName as originalUseDepartmentName,c1.CnName as recordManName,a.mc as goodsStatusName,b.mc as originalGoodsStatusName from B_GoodsStatusRecord as newTB 
                 left join (select * from Para_BizTypeItem where flid = (select id from Para_BizTypeDictionary where lx='goodsStatusDic')) as a on newTb.goodsStatus=a.csz 
                 left join (select * from Para_BizTypeItem where flid = (select id from Para_BizTypeDictionary where lx='goodsStatusDic')) as b on newTb.originalGoodsStatus=b.csz 
                 left join FX_UserInfo as a1 on newTb.originalProtectMan=a1.UserID
                 left join FX_Department as b1 on newTb.originalUseDepartment = b1.DPID
                 left join FX_UserInfo as c1 on newTb.recordMan=c1.UserID
                 where newTb.goodsId = {0} and newTb.goodsStatus =4

                 select CONVERT(varchar(20),newTb.recordDate,120) as recordDate,newTb.*,a1.CnName as originalProtectManName,b1.DPName as originalUseDepartmentName,c1.CnName as recordManName,a.mc as goodsStatusName,b.mc as originalGoodsStatusName from B_GoodsStatusRecord as newTB 
                 left join (select * from Para_BizTypeItem where flid = (select id from Para_BizTypeDictionary where lx='goodsStatusDic')) as a on newTb.goodsStatus=a.csz 
                 left join (select * from Para_BizTypeItem where flid = (select id from Para_BizTypeDictionary where lx='goodsStatusDic')) as b on newTb.originalGoodsStatus=b.csz 
                 left join FX_UserInfo as a1 on newTb.originalProtectMan=a1.UserID
                 left join FX_Department as b1 on newTb.originalUseDepartment = b1.DPID
                 left join FX_UserInfo as c1 on newTb.recordMan=c1.UserID
                 where newTb.goodsId = {0} and newTb.goodsStatus =1

                 select CONVERT(varchar(20),newTb.recordDate,120) as recordDate,newTb.*,a1.CnName as originalProtectManName,b1.DPName as originalUseDepartmentName,c1.CnName as recordManName,a.mc as goodsStatusName,b.mc as originalGoodsStatusName from B_GoodsStatusRecord as newTB 
                 left join (select * from Para_BizTypeItem where flid = (select id from Para_BizTypeDictionary where lx='goodsStatusDic')) as a on newTb.goodsStatus=a.csz 
                 left join (select * from Para_BizTypeItem where flid = (select id from Para_BizTypeDictionary where lx='goodsStatusDic')) as b on newTb.originalGoodsStatus=b.csz 
                 left join FX_UserInfo as a1 on newTb.originalProtectMan=a1.UserID
                 left join FX_Department as b1 on newTb.originalUseDepartment = b1.DPID
                 left join FX_UserInfo as c1 on newTb.recordMan=c1.UserID
                 where newTb.goodsId = {0} and newTb.goodsStatus =5
                 ", goodsId);


                DataSet goodsDataSet = Utility.Database.ExcuteDataSet(stringSql.ToString(), tran);
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "数据加载成功", goodsDataSet);//将对象转为json字符串并返回到客户端
            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "保存数据失败！异常信息: " + e.Message); ;//将对象转为json字符串并返回到客户端
            }
        }

        /// <summary>
        /// 删除状态改变记录
        /// </summary>
        /// <param name="id">资产主键</param>
        /// <param name="userId">用户主键</param>
        /// <returns></returns>
        [DataAction("DeleteGoodsRecord", "id", "userid")]
        public string DeleteGoodsRecord(string id, string userid)
        {
            //var tran = Utility.Database.BeginDbTransaction();
            //StringBuilder strinBuilder = new StringBuilder();
            //var userInfo = ComClass.GetUserInfo(userid);
            //try
            //{
            //    strinBuilder.AppendFormat("update B_GoodsStatusRecord set isDelete = 1,deleteMan='{0}',deleteDate='{1}' where id={2}", userid, DateTime.Now, id);
            //    Utility.Database.ExecuteNonQuery(strinBuilder.ToString(), tran);
            //    Utility.Database.Commit(tran);
            //    return Utility.JsonResult(true, "删除除数据成功");
            //}
            //catch (Exception e)
            //{
            //    Utility.Database.Rollback(tran);
            //    return Utility.JsonResult(false, "删除除数据失败！异常信息: " + e.Message);
            //}
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                StringBuilder strinBuilder = new StringBuilder();
                B_GoodsStatusRecord goodsStatusRecord = new B_GoodsStatusRecord();
                goodsStatusRecord.Condition.Add("id=" + id);
                Utility.Database.Delete(goodsStatusRecord);
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "删除除数据成功");
            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "删除除数据失败！异常信息: " + e.Message);
            }
        }


        [DataAction("GetGoodsStatic", "beginDate", "endDate", "userid")]
        public string GetGoodsStatic(string beginDate, string endDate, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            //  string sql = "exec sp_GoodsStaticPc '"+d+"','"+dsfd+"'";
            try
            {
                StringBuilder strSql = new StringBuilder();
                strSql.AppendFormat("exec sp_GoodsStaticPc '{0}','{1}'", beginDate, endDate);

                //string sql = "exec sp_GoodsStaticPc '";
                DataSet ds = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "加载数据成功", ds.Tables[0]);
            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "加载数据失败！异常信息: " + e.Message);
            }
        }
        /// <summary>
        /// 获取数据模型
        /// </summary>
        public class GetDataModel
        {
            public List<B_Goods> dataList;
            public B_Goods dataEdit;
            public B_GoodsStatusRecord dataGoodsStatusRecordEdit;
            public List<B_GoodsStatusRecord> dataGoodsStatusRecordEditList;
        }

        public class SaveDataModel
        {
            public B_Goods saveEmail;
        }

        public override string Key
        {
            get
            {
                return "B_GoodsSvc";
            }
        }
    }
}
