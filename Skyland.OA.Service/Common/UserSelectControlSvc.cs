using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IWorkFlow.Host;
using Newtonsoft.Json;
using BizService;
using System.Data;
using IWorkFlow.ORM;
namespace BizService.Services
{
    class UserSelectControlSvc : BaseDataHandler
    {
        [DataAction("GetData","FilterText","userid")]
        public string GetData(string FilterText,string userid)
        {
            StringBuilder strSql = new StringBuilder();
            IDbTransaction tran = Utility.Database.BeginDbTransaction();
            GetDataModel dataModel = new GetDataModel();
            dataModel.dt = new DataTable();
            try
            {
                
                if (FilterText == "dcry")
                {
                    //调查人员
                    strSql.Append(@"SELECT 
	A.UserID AS id, B.CnName AS name, B.DPID AS ParentId 
FROM FX_RYLXInfo A
	INNER JOIN FX_UserInfo B ON B.UserID = A.UserID
WHERE 
	A.UserType = 1
UNION
SELECT 
	C.DPID AS id, C.DPName AS name, '0' AS ParentId 
FROM FX_RYLXInfo A
	INNER JOIN FX_UserInfo B ON B.UserID = A.UserID
	INNER JOIN FX_Department C ON C.DPID = B.DPID
WHERE 
	A.UserType = 1");
                }
                else if (FilterText == "xwry")
                {
                    //询问人员
                    strSql.Append(@"SELECT 
	A.UserID AS id, B.CnName AS name, B.DPID AS ParentId 
FROM FX_RYLXInfo A
	INNER JOIN FX_UserInfo B ON B.UserID = A.UserID
WHERE 
	A.UserType = 2
UNION
SELECT 
	C.DPID AS id, C.DPName AS name, '0' AS ParentId 
FROM FX_RYLXInfo A
	INNER JOIN FX_UserInfo B ON B.UserID = A.UserID
	INNER JOIN FX_Department C ON C.DPID = B.DPID
WHERE 
	A.UserType = 2");
                }
                else if (FilterText == "zfry")
                {
                    //执法人员
                    strSql.Append(@"SELECT 
	A.UserID AS id, B.CnName AS name, B.DPID AS ParentId 
FROM FX_RYLXInfo A
	INNER JOIN FX_UserInfo B ON B.UserID = A.UserID
WHERE 
	A.UserType = 3
UNION
SELECT 
	C.DPID AS id, C.DPName AS name, '0' AS ParentId 
FROM FX_RYLXInfo A
	INNER JOIN FX_UserInfo B ON B.UserID = A.UserID
	INNER JOIN FX_Department C ON C.DPID = B.DPID
WHERE 
	A.UserType = 3");
                }
                else
                {
                    //加载所有科室人员
                    strSql.Append(@"select DPID AS id,DPName as name,'0' as ParentId from FX_Department UNION
                    select UserID AS id,CnName as name,DPID AS ParentId from FX_UserInfo");
                }

                DataSet dataSet = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                dataModel.dt = dataSet.Tables[0];
                dataModel.dpName = ComClass.GetDeptByUserId(userid).DPName;
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, null, dataModel);//将对象转为json字符串并返回到客户端
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
                return Utility.JsonResult(false, ex.Message);
            }
        }

        public class GetDataModel
        {
            public DataTable dt;
            public string dpName;//部门名称
        }

        public override string Key
        {
            get
            {
                return "UserSelectControlSvc";
            }
        }
    }
}
