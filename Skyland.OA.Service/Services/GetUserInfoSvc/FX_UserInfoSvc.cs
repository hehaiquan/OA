using BizService.Common;
using IWorkFlow.Host;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace BizService.Services.FX_DepartmentSvc
{
    public class FX_UserInfoSvc : BaseDataHandler
    {
         /// <summary>
         /// 通过用户id查找用户信息
         /// </summary>
         /// <param name="userid"></param>
         /// <returns></returns>
        [DataAction("GetUserInfor", "userid")]
        public string GetUserInfor(string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
             try
             {
               return Utility.JsonResult(true, null, ComClass.GetUserInfo(userid));//将对象转为json字符串并返回到客户端

             }
             catch (Exception ex)
             {
                 ComBase.Logger(ex);//写异常日志到本地文件夹
                 return Utility.JsonResult(false, ex.Message);//将对象转为json字符串并返回到客户端
             }
        }

        /// <summary>
        /// 通过用户id查找用户信息
        /// </summary>
        /// <param name="userid"></param>
        /// <returns></returns>
        [DataAction("GetUserId", "userid")]
        public string GetUserId(string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                //注册电子签名控件
                string rootPath = HttpContext.Current.Server.MapPath("/");
                string result = ComFileOperate.RegisterControl("2294689C-9EDF-40BC-86AE-0438112CA439", rootPath + "bin\\iWebRevision.ocx");

                return Utility.JsonResult(true, null, userid);//将对象转为json字符串并返回到客户端

            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);//写异常日志到本地文件夹
                return Utility.JsonResult(false, ex.Message);//将对象转为json字符串并返回到客户端
            }
        }

        [DataAction("GetUserInforList", "userid")]
        public string GetUserInforList(string userid) {
              var tran = Utility.Database.BeginDbTransaction();
              GetDataModel dataModel = new GetDataModel();
              try
              {
                  StringBuilder strSql = new StringBuilder();
                  strSql.Append(@"
SELECT
	a.UserID,
	a.CnName,
	a.SEX,
	a.DPID,
	a.JobPosition,
	a.EntryTime,
	b.DPName
FROM
	FX_UserInfo AS a
LEFT JOIN FX_Department AS b ON a.DPID = b.DPID
ORDER BY
	UserID DESC
");
                  DataSet ds = Utility.Database.ExcuteDataSet(strSql.ToString(),tran);
                  dataModel.dt = ds.Tables[0];
                  Utility.Database.Commit(tran);
                  return Utility.JsonResult(true, "数据加载成功", dataModel);//将对象转为json字符串并返回到客户端

                   
              }
              catch (Exception ex)
              {
                  ComBase.Logger(ex);//写异常日志到本地文件夹
                  return Utility.JsonResult(false, ex.Message);//将对象转为json字符串并返回到客户端
              }
            return "";
        }

        public class GetDataModel {
            public DataTable dt;
        }

        public override string Key
        {
            get
            {
                return "FX_UserInfoSvc";
            }
        }
    }
}
