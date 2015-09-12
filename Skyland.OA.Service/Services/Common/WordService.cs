using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IWorkFlow.Host;
using IWorkFlow.ORM;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.IO;
using System.Web;

namespace BizService
{
    class WordService : BaseDataHandler
    {

        [DataAction("Load", "caseid", "type")]
        public string load(string caseid, string type)
        {
            try
            {
                string res = "";

                string commonPath = System.Web.HttpContext.Current.Request.PhysicalApplicationPath + @"WordDoc\";

                string existFile = "";//存在，判断的文件
                string existFilePath = "";//存在，判断的全路径

                string firstFile = "";//模板文件名

                existFile = "{#flow#_#" + caseid + "#,#type#_#" + type + "#,#num#_0}.docx";
                existFilePath = commonPath + type + @"\" + existFile;

                if (File.Exists(existFilePath))//判断是否存在此文件
                {
                    res = existFilePath;
                }
                else
                {
                    if (!Directory.Exists(commonPath + type))
                    {
                        Directory.CreateDirectory(commonPath + type);
                    }

                    Dictionary<string, Object> dict = new Dictionary<string, object>();
                    switch (type)
                    {
                        case "XINFANG_CHENGPIBIAO": //信访呈批表
                            //this.XINGFANG_CHENGPIBIAO(ref dict, caseid);
                            break;
                    }

                    //生成
                    firstFile = type + "_Template.docx";
                    string[] strArr = type.Split('_');
                    if (dict != null && dict.Count > 0)
                    {
                        IWorkFlow.OfficeService.IWorkFlowOfficeHandler.ProduceWord2007UP(commonPath + @"AllWordTemple\" + strArr[0] + "\\" + firstFile, existFilePath, dict);
                    }
                    res = existFilePath;
                }

                return res;
            }
            catch (Exception ex)
            {
                return Utility.JsonMsg(false, ex.Message);
            }
        }



        private string getActiveString(string obj)
        {
            if (!string.IsNullOrEmpty(obj))
            {
                return obj;
            }
            return "";
        }

        public override string Key
        {
            get
            {
                return "WordService";
            }
        }
    }
}
