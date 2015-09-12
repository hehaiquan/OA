using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IWorkFlow.ORM
{
    public class yyyd {
        public string qymc;
        public List<yyydItem> yyydL;
    }
    public class yyydItem
    {
        public string qydm;
        public string qymc;
        public string WorkFlowCaseID;
        public string mingchen;
        public string ywType;
        public string FlowID;
        public string MaxBAID;
        public string ActID;
        public DateTime CreateDate;
        public int IsEnd;
    }
}
