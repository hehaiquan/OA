using BizService.Common;
using IWorkFlow.BaseService;
using IWorkFlow.Host;
using IWorkFlow.ORM;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace BizService.Services.B_Common_CreateDocSvc
{
    class B_Common_CreateDocSvc : BaseDataHandler
    {
        #region 判断业务文件是否生成过
        [DataAction("isExistCreateDocRecord", "caseid", "type")]
        public string isExistCreateDocRecord(string caseid, string type)
        {
            try
            {
                StringBuilder sb = new StringBuilder();
                if (String.IsNullOrEmpty(caseid)) { ComBase.Logger("caseid=" + caseid); return "false"; }
                if (String.IsNullOrEmpty(type)) { ComBase.Logger("type=" + type); return "false"; }
                sb.AppendFormat("select caseid from B_Common_CreateDoc where caseid = '{0}' and type='{1}' order by createdate;", caseid, type);
                var ds = Utility.Database.ExcuteDataSet(sb.ToString());
                if (ds.Tables[0].Rows.Count == 0)
                {
                    return "false";
                }
                else
                {
                    return "true";
                }
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex.Message);
                return "";
            }
        }

        [DataAction("getDocName", "caseid", "type", "doctype")]
        public object GetDocName(string caseid, string type, string doctype)
        {
            ////SkyLandDeveloper developer = SkyLandDeveloper.FromJson("{}");
            try
            {
                B_Common_CreateDoc doc = new B_Common_CreateDoc();
                doc.Condition.Add("caseid = " + caseid);
                doc.Condition.Add("type = " + type);
                doc.Condition.Add("docType = " + doctype);
                doc = Utility.Database.QueryObject<B_Common_CreateDoc>(doc);
                if (doc != null && !string.IsNullOrEmpty(doc.filename))
                {
                    string savePath = Utility.RootPath.Replace("\\", "/") + doc.filename.Replace("#", "/");
                    return Utility.JsonResult(true, "ok", "{wordPath:\"" + savePath + "\"}");
                }
                return Utility.JsonResult(true, "nodoc");
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex.Message);
                return Utility.JsonResult(false, "获取文件失败:" + ex.Message.Replace(":", " "));
            }
        }
        #endregion

        /// <summary>
        /// 获取手写签批的设置
        /// </summary>
        /// <param name="caseid"></param>
        /// <param name="type"></param>
        /// <param name="doctype"></param>
        /// <returns></returns>
        [DataAction("GetSightureSetting", "userid")]
        public object GetSightureSetting(string userid)
        {
            FX_Sighture fxSighture = new FX_Sighture();
            fxSighture.userid = userid;
            string rootPath = HttpContext.Current.Server.MapPath("/");
            string result = ComFileOperate.RegisterControl("2294689C-9EDF-40BC-86AE-0438112CA439", rootPath + "bin\\iWebRevision.ocx");
            return new
            {
                fxSighture = fxSighture
            };
        }

        public override string Key
        {
            get
            {
                return "B_Common_CreateDocSvc";
            }
        }
    }// class
}
