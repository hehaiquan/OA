using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IWorkFlow.BaseService;

namespace BizService
{
    public class SkyLandBizFrame : IFrameOpen
    {
        public static SkyLandBizFrame intance = new SkyLandBizFrame();

        public bool DeleteCase(string caseid, string userid, Object obj)
        {
            //加入针对不同的业务的删除前处理
            return true;
        }

        public bool StopCase(string caseid, string userid, object obj)
        {
            return true;
        }

        public bool resumeCase(string caseid, string userid, object obj)
        {
            return true;
        }

        //public override string GetSignResult(BusinessCase bc, List<BusinessActivity> lstBa)
        //{
        //    return "send";
        //}

    }

}
