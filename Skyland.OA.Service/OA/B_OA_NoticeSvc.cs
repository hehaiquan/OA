using IWorkFlow.Host;
using IWorkFlow.ORM;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;


//开发者:黄欢
namespace BizService.Services
{
    class B_OA_NoticeSvc : BaseDataHandler
    {
        /// <summary>
        /// 获取初始化数据
        /// </summary>
        /// <param name="userid">用户ID</param>
        /// <param name="caseId">业务流WID</param>
        /// <param name="baid">步骤ID</param>
        /// <returns>返回初始化数据</returns>
        [DataAction("GetData", "NewsTypeId", "userid")]
        public string GetData(string NewsTypeId,string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                //只有待办箱才有设置为已读
               // if (!String.IsNullOrEmpty(baid)) engineAPI.SetIsReaded(caseId, baid, userid);

                var user = ComClass.GetUserInfo(userid);//获取当前用户信息           
                GetDataModel data = new GetDataModel();//获取数据模型
                data.baseInfo = new B_OA_Notice();
                data.baseInfo.NewsFromDept = user.DPID;
                B_OA_Notice en = new B_OA_Notice();//声名一个对象        
                en.Condition.Add("NewsTypeId = " + NewsTypeId);//设置查询条件
                en.Condition.Add("Creater =" + user.CnName);//设置查询条件
                data.noticeList = Utility.Database.QueryList<B_OA_Notice>(en, tran);//查询，并返回结果。注:该方法已在框架内定义,直接调用即可
                return Utility.JsonResult(true, null, data);//将对象转为json字符串并返回到客户端
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex);//写异常日志到本地文件夹
                return Utility.JsonResult(false, ex.Message);//将对象转为json字符串并返回到客户端
            }
        }

        [DataAction("SearchChkData", "NewsTypeId", "userid")]
        public string SearchChkData(string NewsTypeId, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            DataSet dataSet = null;
            try
            {
                var user = ComClass.GetUserInfo(userid);//获取当前用户信息           
                string sql = "select convert(varchar(20),CreateTime,23) CreateTime,* from B_OA_Notice where NewsFromDept='" + user.DPID+ "' and NewsTypeId='" + NewsTypeId + "' order by chk";
                dataSet = Utility.Database.ExcuteDataSet(sql, tran);
                return Utility.JsonResult(true, null, dataSet.Tables[0]);//将对象转为json字符串并返回到客户端
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex);//写异常日志到本地文件夹
                return Utility.JsonResult(false, ex.Message);//将对象转为json字符串并返回到客户端
            }
            finally
            {
                if (dataSet != null) dataSet.Dispose();
            }
        }

        [DataAction("SearchData", "NewsTypeId", "userid")]
        public string SearchData(string NewsTypeId, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            DataSet dataSet = null;
            try
            {
                var user = ComClass.GetUserInfo(userid);//获取当前用户信息           
                string sql = "select convert(varchar(20),CreateTime,23) CreateTime,* from B_OA_Notice where chk='1' and NewsTypeId='" + NewsTypeId + "' order by B_OA_Notice.CreateTime desc,Chkdate desc";
                dataSet = Utility.Database.ExcuteDataSet(sql, tran);
                return Utility.JsonResult(true, null, dataSet.Tables[0]);//将对象转为json字符串并返回到客户端
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex);//写异常日志到本地文件夹
                return Utility.JsonResult(false, ex.Message);//将对象转为json字符串并返回到客户端
            }
            finally
            {
                if (dataSet != null) dataSet.Dispose();
            }
        }


        /// <summary>
        /// 获取数据
        /// </summary>
        /// <param name="userid">用户ID</param>
        /// <returns>返回初始化数据</returns>
        [DataAction("GetBrowseData", "NewsId", "userid")]
        public string GetBrowseData(string NewsId,string userid)
        {
            IDbTransaction tran = null;
            DataSet dataSet = null;
            try
            {
                tran = Utility.Database.BeginDbTransaction();
                StringBuilder sql = new StringBuilder();
                sql.Append("select convert(varchar(20),CreateTime,23) CreateTime,B_OA_Notice.*,B_OA_NewsType.TypeName from B_OA_Notice ");
                sql.Append("left join B_OA_NewsType on B_OA_Notice.NewsTypeId=B_OA_NewsType.NewsTypeId ");
                sql.Append("where B_OA_Notice.NewsId='{0}'");
                string sqlStr = string.Format(sql.ToString(), NewsId);
                dataSet = Utility.Database.ExcuteDataSet(sqlStr, tran);
                Utility.Database.Commit(tran);//提交事务
                return Utility.JsonResult(true, null, dataSet.Tables[0]);//将对象转为json字符串并返回到客户端
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex);//写异常日志到本地文件夹
                return Utility.JsonResult(false, ex.Message);//将对象转为json字符串并返回到客户端
            }
            finally {
                if (dataSet != null) dataSet.Dispose();
                if (tran != null) tran.Dispose();
            }
        }


        /// <summary>
        /// 获取部门数据
        /// </summary>
        /// <param name="userid">用户ID</param>
        /// <returns>返回初始化数据</returns>
        [DataAction("GetDeptData", "isShare", "userid")]
        public string GetDeptData(string isShare, string userid)
        {
            IDbTransaction tran = null;
            DataSet dataSet = null;
            try
            {   
                var userInfo = ComClass.GetUserInfo(userid);//获取当前用户信 
                tran = Utility.Database.BeginDbTransaction();
                string sql = "select '1' as  id,'0' as parentid,'所有部门' as name union ";
                sql += "select DPID as id,PDPID as parentid,DPName as name from FX_Department where 1=1 ";
                
                
                if (isShare != "1")
                {
                    sql += " and DPID='" + userInfo.DPID + "' ";
                }
                dataSet = Utility.Database.ExcuteDataSet(sql, tran);
                Utility.Database.Commit(tran);//提交事务
                return Utility.JsonResult(true, null, dataSet.Tables[0]);//将对象转为json字符串并返回到客户端
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex);//写异常日志到本地文件夹
                return Utility.JsonResult(false, ex.Message);//将对象转为json字符串并返回到客户端
            }
            finally
            {
                if (dataSet != null) dataSet.Dispose();
                if (tran != null) tran.Dispose();
            }
        }

        /// <summary>
        /// 获取文档文件数据
        /// </summary>
        /// <param name="deptid">部门ID</param>
        /// <param name="userid">用户ID</param>
        /// <returns>返回初始化数据</returns>
        [DataAction("GetFileData", "deptid", "isShare", "userid")]
        public string GetFileData(string deptid,string isShare,string userid)
        {
            IDbTransaction tran = null;
            DataSet dataSet = null;
            try
            {
                var userInfo = ComClass.GetUserInfo(userid);//获取当前用户信 
                tran = Utility.Database.BeginDbTransaction();
                string sql = "select a.*,BeforeFileName,RelativePath,FileSize from ( " +
                               "select NewsId,NewsFromDeptName,NewsFromDept,ShareAttachment,AttachmentType,convert(varchar(20),CreateTime,23) CreateTime,Creater from B_OA_Notice " +
                               "where ISNULL(NewsAttachment,'')<>'' and NewsTypeId='wdwj' ";

                if (deptid != null && deptid != "")
                {
                    sql += "and NewsFromDept='" + deptid.Trim() + "'";
                }
                else {
                    sql += "and NewsFromDept='" + userInfo.DPID + "'";
                }
                
                if (isShare == "1")
                {
                    sql += "and ShareAttachment=" + isShare.Trim() + "";
                }

                sql+=") as a left join B_OA_FileList as b on a.NewsId=b.NewsId";
                dataSet = Utility.Database.ExcuteDataSet(sql, tran);
                Utility.Database.Commit(tran);//提交事务
                return Utility.JsonResult(true, null, dataSet.Tables[0]);//将对象转为json字符串并返回到客户端
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex);//写异常日志到本地文件夹
                return Utility.JsonResult(false, ex.Message);//将对象转为json字符串并返回到客户端
            }
            finally
            {
                if (dataSet != null) dataSet.Dispose();
                if (tran != null) tran.Dispose();
            }
        }


        /// <summary>
        /// 保存数据
        /// </summary>
        /// <param name="JsonData">要保存的数据</param>
        /// <returns>反回json结果</returns>
        [DataAction("SaveData", "JsonData", "userName", "userid")]
        public string SaveData(string JsonData, string userName, string userid)
        {
            string rootPath = HttpContext.Current.Server.MapPath("/").Replace("\\", "/");
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                B_OA_Notice OA_Notice = JsonConvert.DeserializeObject<B_OA_Notice>(JsonData);
                OA_Notice.CreateTime = DateTime.Now.ToShortDateString();

                //更新或插入主业务信息
                if (OA_Notice.NewsId == null || OA_Notice.NewsId == "")
                {
                    OA_Notice.NewsId =  ComClass.GetGuid();//生成一个ID
                    Utility.Database.Insert<B_OA_Notice>(OA_Notice, tran);
                }
                else {
                    OA_Notice.Condition.Add("NewsId=" + OA_Notice.NewsId);
                    Utility.Database.Update<B_OA_Notice>(OA_Notice, tran);
                }
                
                ////删除所有文件
                //B_OA_FileList del= new B_OA_FileList();
                //del.Condition.Add("NewsId = " + OA_Notice.NewsId);//设置条件
                //Utility.Database.Delete<B_OA_FileList>(del, tran);
                ////保存文件
                ////string fileString = OA_Notice.NewsAttachment;
                //if (fileString != null && fileString!="")
                //{
                //    string[] str = fileString.Trim('|').Split('|');
                //    foreach(string s in str){
                //        if (s != null && s != "")
                //        {
                //            B_OA_FileList fiel = new B_OA_FileList();
                //            fiel.RelativePath = s;//文件相对路径
                //            fiel.AbsolutePath = rootPath + s;//文件绝对路径
                //            fiel.Dept = OA_Notice.NewsFromDept;//部门
                //            fiel.NewsId = OA_Notice.NewsId;
                //            fiel.FileName = Path.GetFileName(fiel.AbsolutePath);//文件名
                //            fiel.Extension = Path.GetExtension(fiel.AbsolutePath);//扩展名
                //            int index=fiel.FileName.IndexOf("_");
                //            fiel.BeforeFileName = fiel.FileName.Substring(index + 1, fiel.FileName.Length - index - 1);
                //            Utility.Database.Insert<B_OA_FileList>(fiel, tran);
                //        }
                //    }              
                //    //string [] files= System.IO.Directory.GetFiles("c:\\","*.txt");
                //}
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "保存数据成功", OA_Notice);//将对象转为json字符串并返回到客户端

            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "保存数据失败！异常信息: " + e.Message);//将对象转为json字符串并返回到客户端
            }
        }


        /// <summary>
        /// 删除数据
        /// </summary>
        /// <param name="userid">当前用户ID</param>
        /// <param name="id">主键ID</param>
        /// <returns>返回结果数据集</returns>
        [DataAction("DeleteData", "userid", "id")]
        public string DeleteData(string userid, string id)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();//开始事务并返回一个事务对象
            try
            {
                B_OA_Notice OA_Notice = new B_OA_Notice();
                OA_Notice.Condition.Add("NewsId = " + id);//设置查询条件,条件为当前用户ID
                Utility.Database.Delete(OA_Notice, tran);
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "删除成功！");
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex);//写日专到本地文件
                return Utility.JsonResult(false, "删除失败:" + ex.Message);
            }
        }

        //审核
        [DataAction("Chk", "Chk", "id", "userid")]
        public string Chk(string Chk, string id,string userid)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();//开始事务并返回一个事务对象
            DataSet se = null;
            try
            {
                var user = ComClass.GetUserInfo(userid);//获取当前用户信息
                string sql = "update B_OA_Notice set Chk='{0}',ChkM='{1}',Chkdate={2} where NewsId='{3}';";
                if (Chk == "0")
                {
                    sql = "update B_OA_Notice set Chk='1',ChkM='" + user.CnName + "',Chkdate=GETDATE() where NewsId='" + id + "';";
                }
                else
                {
                    sql = "update B_OA_Notice set Chk='0',ChkM=null,Chkdate=null where NewsId='" + id + "';";
                }
                sql += "select * from B_OA_Notice where NewsId='" + id + "';";
                se = Utility.Database.ExcuteDataSet(sql, tran);
                Utility.Database.Commit(tran);//提交事务
                return Utility.JsonResult(true, Chk == "0" ? "审核成功！" : "取消审核成功！", "{Chk:'" + se.Tables[0].Rows[0]["Chk"].ToString() + "',ChkM:'" + se.Tables[0].Rows[0]["ChkM"].ToString() + "',Chkdate:'" + se.Tables[0].Rows[0]["Chkdate"].ToString() + "'}");
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex);//写日专到本地文件
                return Utility.JsonResult(false, "审核失败:" + ex.Message);
            }
            finally {
                if (se != null) se.Dispose();
            }
        }



        /// <summary>
        /// 获取门户数据
        /// </summary>
        /// <param name="userid">用户ID</param>
        /// <returns>返回初始化数据</returns>
        [DataAction("GetGatewayData", "top", "typeId", "userid")]
        public string GetGatewayData(string top,string typeId, string userid)
        {
            IDbTransaction tran = null;
            DataSet dataSet = null;
            try
            {
                tran = Utility.Database.BeginDbTransaction();
                StringBuilder sql = new StringBuilder();
                sql.Append("select top {0} NewsId,NewsTitle,convert(varchar(20),CreateTime,23) as CreateTime from B_OA_Notice where NewsTypeId='{1}' order by CreateTime desc ");
                //sql.Append("left join B_OA_NewsType on B_OA_Notice.NewsTypeId=B_OA_NewsType.NewsTypeId ");
                //sql.Append("where B_OA_Notice.NewsId='{0}'");
                string sqlStr = string.Format(sql.ToString(), top, typeId);
                dataSet = Utility.Database.ExcuteDataSet(sqlStr, tran);
                Utility.Database.Commit(tran);//提交事务
                return Utility.JsonResult(true, null, dataSet.Tables[0]);//将对象转为json字符串并返回到客户端
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex);//写异常日志到本地文件夹
                return Utility.JsonResult(false, ex.Message);//将对象转为json字符串并返回到客户端
            }
            finally
            {
                if (dataSet != null) dataSet.Dispose();
                if (tran != null) tran.Dispose();
            }
        }

        /// <summary>
        /// 获取共享文档文件数据
        /// </summary>
        /// <param name="deptid">部门ID</param>
        /// <param name="userid">用户ID</param>
        /// <returns>返回初始化数据</returns>
        [DataAction("GetSharingFileData", "top", "userid")]
        public string GetSharingFileData(string top, string userid)
        {
            IDbTransaction tran = null;
            DataSet dataSet = null;
            try
            {
                var userInfo = ComClass.GetUserInfo(userid);//获取当前用户信 
                tran = Utility.Database.BeginDbTransaction();
                string sql = "select top {0} id,RelativePath,BeforeFileName,convert(varchar(20),CreateTime,23) as CreateTime from B_OA_FileList " +
                             "left join B_OA_Notice on B_OA_Notice.NewsId=B_OA_FileList.NewsId " +
                             "where ShareAttachment=1 and NewsTypeId='wdwj' order by CreateTime desc;";
                sql = string.Format(sql, top);
                dataSet = Utility.Database.ExcuteDataSet(sql, tran);
                Utility.Database.Commit(tran);//提交事务
                return Utility.JsonResult(true, null, dataSet.Tables[0]);//将对象转为json字符串并返回到客户端
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex);//写异常日志到本地文件夹
                return Utility.JsonResult(false, ex.Message);//将对象转为json字符串并返回到客户端
            }
            finally
            {
                if (dataSet != null) dataSet.Dispose();
                if (tran != null) tran.Dispose();
            }
        }



        // 获取数据模型
        public class GetDataModel
        {
            public B_OA_Notice baseInfo;
            public List<B_OA_Notice> noticeList;

        }

        /// <summary>
        /// 保存数据模型
        /// </summary>
        public class SaveDataModel
        {
            public B_OA_Notice baseInfo;
        }

        public override string Key
        {
            get
            {
                return "B_OA_NoticeSvc";
            }
        }

    }
}

