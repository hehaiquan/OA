using IWorkFlow.Host;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using IWorkFlow.Host;

namespace BizService.Services.PrintDataSvc
{
    public class PrintDataSvc : BaseDataHandler  
    {
       /*
        #region 生成合同（协议）盖章审批表另存为(更改)
        [DataAction("CreateDoc", "workflowid", "caseid")]
        public string CreateDoc(string workflowid, string caseid)
        {
            try
            {
                // 获取数据，使用到的表有WorkFlowCase、b_jshtspb
                StringBuilder sb = new StringBuilder();
                sb.AppendFormat(@"select a.Name as title,
                                    bsbm,jbr,htjekind,htje,b.wtdw, rxqx, b.address, b.changecom, b.leadagree,
                                    kind,yzlx,fenshu,smlx,smzz,smfzz,jibie,hangye,gumo,spbm,zhengche,xiangmu,
                                    tongyi1,bmldyj,bmld,year(signtime1) as signtime1_y, month(signtime1) as signtime1_m,day(signtime1) as signtime1_d,
                                    tongyi2,zgsyj,scr2,year(signtime3) as signtime3_y,month(signtime3) as signtime3_m, day(signtime3) as signtime3_d,
                                    tongyi3,cwbyj,scr,year(signtime5) as signtime5_y,month(signtime5) as signtime5_m,day(signtime5) as signtime5_d, 
                                    tongyi4,yldspyj,scr3,year(signtime7) as signtime7_y,month(signtime7) as signtime7_m, day(signtime7) as signtime7_d,
                                    tongyi5,yzspyj,scr4,year(signtime9) as signtime9_y,month(signtime9) as signtime9_m,day(signtime9) as signtime9_d
                                    from workflowcase a 
                                    left join b_jshtspb b ON a.ID = b.id
                                    left join b_httbspsb c ON a.ID = c.id
                                    where a.id = '{0}' ", caseid);// a.FlowID= '{}' and 
                DataTable dt = Utility.Database.ExcuteDataSet(sb.ToString()).Tables[0];

                // 路径处理
                string rootPath = Utility.RootPath;
                string chooseFileModel = "ReportTemplate\\B_jshtspb_Template.docx";// 获取模板
                string modelSourcePath = rootPath + chooseFileModel;// 模板路径
                string folderPath = "ReportFiles\\TechContractPrintApprovalTable";// 创建文件夹路径
                string fileName = caseid + "table" + DateTime.Now.ToString("yyyyMMdd") + ".docx";// 创建文件后的文件路径
                string saveAsPath = folderPath + "\\" + fileName;// 
                string createNewFilePath = rootPath + saveAsPath;

                // 返回另存为文件的路径
                string resultPath = CommonCreateTableDoc(modelSourcePath, rootPath, folderPath, createNewFilePath, saveAsPath, GetDictionary(dt));
                return resultPath;
            }
            catch (Exception ex)
            {
                Utility.WriteLog(ex.Message);
                return PackResult.JsonMsg(false, ex.Message);
            }
        }
        // b_jshtspb
        #endregion

        #region 生成Table1 送审1
        [DataAction("CreateTable1Doc", "workflowid", "caseid")]
        public string CreateTable1Doc(string workflowid, string caseid)
        {
            try
            {
                // 获取数据，使用到的表有WorkFlowCase、b_appross2、b_jshtspb、b_hpplan
                StringBuilder sb = new StringBuilder();
                sb.AppendFormat(@"select a.Name as Name,
                                        kind,convert(varchar(10),time1, 120) as time1_year,convert(varchar(10),time2, 120) as time2_year,convert(varchar(10),time3, 120) as time3_year,Department,
                                        ProjectLeader,AssistantLeader,Member,Operator,Numbers,
                                        smzztongyi,smzzopin,smzzsign,year(smzzsigntime) as smzzsigntime_y,month(smzzsigntime) as smzzsigntime_m,day(smzzsigntime) as smzzsigntime_d,
                                        tongyi1,opin1,sign1,year(signtime1) as signtime1_y, month(signtime1) as signtime1_m,day(signtime1) as signtime1_d,situ1,
                                        tongyi2,opin2,sign2,year(signtime2) as signtime2_y,month(signtime2) as signtime2_m,day(signtime2) as signtime2_d,situ2,
                                        tongyi3,opin3,sign3,year(signtime3) as signtime3_y,month(signtime3) as signtime3_m,day(signtime3) as signtime3_d,situ3,
                                        zgstongyi,zgsopin,zgssign,year(zgssigntime) as zgssigntime_y,month(zgssigntime) as zgssigntime_m, day(zgssigntime) as zgssigntime_d,
                                        tongyi5,opin4,sign4,year(signtime4) as signtime4_y,month(signtime4) as signtime4_m,day(signtime4) as signtime4_d
                                        from workflowcase a 
                                        left join b_appross b ON a.ID = b.id
                                        where a.id = '{0}' ", caseid);// a.FlowID= '{}' and 
                DataTable dt = Utility.Database.ExcuteDataSet(sb.ToString()).Tables[0];

                // 路径处理
                string rootPath = Utility.RootPath;
                string chooseFileModel = "ReportTemplate\\TechDocSendAuditingArticleApprovalTable1.docx";// 获取模板
                string modelSourcePath = rootPath + chooseFileModel;// 模板路径
                string folderPath = "ReportFiles\\TechDocSendAuditingArticleApprovalTable";// 创建文件夹路径
                string fileName = caseid + "table1" + DateTime.Now.ToString("yyyyMMdd") + ".docx";// 创建文件后的文件路径
                string saveAsPath = folderPath + "\\" + fileName;// 
                string createNewFilePath = rootPath + saveAsPath;

                // 返回另存为文件的路径
                string resultPath = CommonCreateTableDoc(modelSourcePath, rootPath, folderPath, createNewFilePath, saveAsPath, GetDictionary(dt));
                return resultPath;
            }
            catch (Exception ex)
            {
                Utility.WriteLog(ex.Message);
                return PackResult.JsonMsg(false, ex.Message);
            }
        }

        // WorkFlowCase、b_appross
        #endregion

        #region 生成Table2 送审2
        [DataAction("CreateTable2Doc", "workflowid", "caseid")]
        public string CreateTable2Doc(string workflowid, string caseid)
        {
            try
            {
                // 获取数据，使用到的表有WorkFlowCase、b_appross2、b_jshtspb、b_hpplan
                StringBuilder sb = new StringBuilder();
                sb.AppendFormat(@"select a.Name as Name,
                                        kind,convert(varchar(10),time1, 120) as time1_year,convert(varchar(10),time2, 120) as time2_year,convert(varchar(10),time3, 120) as time3_year,Department,
                                        ProjectLeader,AssistantLeader,Member,Operator,Numbers,
                                        smzztongyi,smzzopin,smzzsign,year(smzzsigntime) as smzzsigntime_y,month(smzzsigntime) as smzzsigntime_m,day(smzzsigntime) as smzzsigntime_d,
                                        tongyi1,opin1,sign1,year(signtime1) as signtime1_y, month(signtime1) as signtime1_m,day(signtime1) as signtime1_d,situ1,
                                        tongyi2,opin2,sign2,year(signtime2) as signtime2_y,month(signtime2) as signtime2_m,day(signtime2) as signtime2_d,situ2,
                                        tongyi3,opin3,sign3,year(signtime3) as signtime3_y,month(signtime3) as signtime3_m,day(signtime3) as signtime3_d,situ3,
                                        zgstongyi,zgsopin,zgssign,year(zgssigntime) as zgssigntime_y,month(zgssigntime) as zgssigntime_m, day(zgssigntime) as zgssigntime_d,
                                        tongyi5,opin4,sign4,year(signtime4) as signtime4_y,month(signtime4) as signtime4_m,day(signtime4) as signtime4_d
                                        from workflowcase a 
                                        left join b_appross2 b ON a.ID = b.id
                                        where a.id = '{0}' ", caseid);// a.FlowID= '{}' and 
                DataTable dt = Utility.Database.ExcuteDataSet(sb.ToString()).Tables[0];

                // 路径处理
                string rootPath = Utility.RootPath;
                string chooseFileModel = "ReportTemplate\\TechDocSendAuditingArticleApprovalTable2.docx";// 获取模板
                string modelSourcePath = rootPath + chooseFileModel;// 模板路径
                string folderPath = "ReportFiles\\TechDocSendAuditingArticleApprovalTable";// 创建文件夹路径
                string fileName = caseid + "table2" + DateTime.Now.ToString("yyyyMMdd") + ".docx";// 创建文件后的文件路径
                string saveAsPath = folderPath + "\\" + fileName;// 
                string createNewFilePath = rootPath + saveAsPath;

                // 返回另存为文件的路径
                string resultPath = CommonCreateTableDoc(modelSourcePath, rootPath, folderPath, createNewFilePath, saveAsPath, GetDictionary(dt));
                return resultPath;
            }
            catch (Exception ex)
            {
                Utility.WriteLog(ex.Message);
                return PackResult.JsonMsg(false, ex.Message);
            }
        }

        // WorkFlowCase、b_appross2
        #endregion

        #region 生成Table3 送审3
        [DataAction("CreateTable3Doc", "workflowid", "caseid")]
        public string CreateTable3Doc(string workflowid, string caseid)
        {
            try
            {
                // 获取数据，使用到的表有WorkFlowCase、b_appross2、b_jshtspb、b_hpplan
                StringBuilder sb = new StringBuilder();
                sb.AppendFormat(@"select a.Name as Name,b.kind, convert(varchar(10), b.time1, 120) as time1_year, convert(varchar(10), b.time2, 120) as time2_year, convert(varchar(10), b.time3, 120) as time3_year,
                                    c.bsbm as Department, d.smzz as ProjectLeader, d.smfzz as AssistantLeader, d.member as Member, c.jbr as Operator, b.Numbers,
                                    b.smzztongyi, b.smzzopin, b.smzzsign, year(b.smzzsigntime) as smzzsigntime_y, month(b.smzzsigntime) as smzzsigntime_m, day(b.smzzsigntime) as smzzsigntime_d,
                                    b.tongyi1, b.opin1, b.sign1, year(b.signtime1) as signtime1_y, month(b.signtime1) as signtime1_m, day(b.signtime1) as signtime1_d,b.situ1,
                                    b.tongyi2, b.opin2, b.sign2, year(b.signtime2) as signtime2_y, month(b.signtime2) as signtime2_m, day(b.signtime2) as signtime2_d,b.situ2,
                                    b.tongyi3, b.opin3, b.sign3, year(b.signtime3) as signtime3_y, month(b.signtime3) as signtime3_m, day(b.signtime3) as signtime3_d,b.situ3,
                                    b.zgstongyi, b.zgsopin, b.zgssign, year(b.zgssigntime) as zgssigntime_y, month(b.zgssigntime) as zgssigntime_m, day(b.zgssigntime) as zgssigntime_d,
                                    b.tongyi5, b.opin4, b.sign4, year(b.signtime4) as signtime4_y, month(b.signtime4) as signtime4_m, day(b.signtime4) as signtime4_d
                                    from workflowcase a 
                                    LEFT JOIN b_appross b ON a.ID = b.id 
                                    left join b_jshtspb c on a.ID = c.id 
                                    left join b_hpplan d ON a.ID = d.id
                                    where a.id = '{0}' ", caseid);// a.FlowID= '{}' and 
                DataTable dt = Utility.Database.ExcuteDataSet(sb.ToString()).Tables[0];

                // 路径处理
                string rootPath = Utility.RootPath;
                string chooseFileModel = "ReportTemplate\\TechDocSendAuditingArticleApprovalTable3.docx";// 获取模板
                string modelSourcePath = rootPath + chooseFileModel;// 模板路径
                string folderPath = "ReportFiles\\TechDocSendAuditingArticleApprovalTable";// 创建文件夹路径
                string fileName = caseid + "table3" + DateTime.Now.ToString("yyyyMMdd") + ".docx";// 创建文件后的文件路径
                string saveAsPath = folderPath + "\\" + fileName;// 
                string createNewFilePath = rootPath + saveAsPath;

                // 返回另存为文件的路径
                string resultPath = CommonCreateTableDoc(modelSourcePath, rootPath, folderPath, createNewFilePath, saveAsPath, GetDictionary(dt));
                return resultPath;
            }
            catch (Exception ex)
            {
                Utility.WriteLog(ex.Message);
                return PackResult.JsonMsg(false, ex.Message);
            }
        }
        // WorkFlowCase、b_appross2、b_jshtspb、b_hpplan
        #endregion

        #region 生成Table4 送审4
        [DataAction("CreateTable4Doc", "workflowid", "caseid")]
        public string CreateTable4Doc(string workflowid, string caseid)
        {
            try
            {
                // 获取数据，使用到的表有WorkFlowCase、b_appross2、b_jshtspb、b_hpplan
                StringBuilder sb = new StringBuilder();
                sb.AppendFormat(@"select a.Name as Name, c.kind, convert(varchar(10), c.time1, 120) as time1_year, convert(varchar(10), c.time2, 120) as time2_year, convert(varchar(10), c.time3, 120) as time3_year,
                                    d.bsbm as Department, b.smzz as ProjectLeader, b.smfzz as AssistantLeader, b.Member, d.jbr as Operator, c.Numbers, 
                                    c.smzztongyi, c.smzzopin, c.smzzsign, year(c.smzzsigntime) as smzzsigntime_y, month(c.smzzsigntime) as smzzsigntime_m, day(c.smzzsigntime) as smzzsigntime_d,
                                    c.tongyi1, c.opin1, c.sign1, year(c.signtime1) as signtime1_y, month(c.signtime1) as signtime1_m, day(c.signtime1) as signtime1_d,c.situ1,
                                    c.tongyi2, c.opin2, c.sign2, year(c.signtime2) as signtime2_y, month(c.signtime2) as signtime2_m, day(c.signtime2) as signtime2_d,c.situ2,
                                    c.tongyi3, c.opin3, c.sign3, year(c.signtime3) as signtime3_y, month(c.signtime3) as signtime3_m, day(c.signtime3) as signtime3_d,c.situ3,
                                    c.zgstongyi, c.zgsopin, c.zgssign, year(c.zgssigntime) as zgssigntime_y, month(c.zgssigntime) as zgssigntime_m, day(c.zgssigntime) as zgssigntime_d,
                                    c.tongyi5, c.opin4, c.sign4, year(c.signtime4) as signtime4_y, month(c.signtime4) as signtime4_m, day(c.signtime4) as signtime4_d
                                    from workflowcase a 
                                    left join b_hpplan b ON a.ID = b.id
                                    left join b_appross2 c ON a.ID = c.id
                                    left join b_jshtspb d ON a.ID = d.id
                                    where a.id = '{0}' ", caseid);// a.FlowID= '{}' and 
                DataTable dt = Utility.Database.ExcuteDataSet(sb.ToString()).Tables[0];

                // 路径处理
                string rootPath = Utility.RootPath;
                string chooseFileModel = "ReportTemplate\\TechDocSendAuditingArticleApprovalTable4.docx";// 获取模板
                string modelSourcePath = rootPath + chooseFileModel;// 模板路径
                string folderPath = "ReportFiles\\TechDocSendAuditingArticleApprovalTable";// 创建文件夹路径
                string fileName = caseid + "table4" + DateTime.Now.ToString("yyyyMMdd") + ".docx";// 创建文件后的文件路径
                string saveAsPath = folderPath + "\\" + fileName;// 
                string createNewFilePath = rootPath + saveAsPath;

                // 返回另存为文件的路径
                string resultPath = CommonCreateTableDoc(modelSourcePath, rootPath, folderPath, createNewFilePath, saveAsPath, GetDictionary(dt));
                return resultPath;
            }
            catch (Exception ex)
            {
                Utility.WriteLog(ex.Message);
                return PackResult.JsonMsg(false, ex.Message);
            }
        }
        // WorkFlowCase、b_appross2、b_jshtspb、b_hpplan
        #endregion

        #region 生成Table01 报批
        [DataAction("CreateTable01Doc", "workflowid", "caseid")]
        public string CreateTable01Doc(string workflowid, string caseid)
        {
            try
            {
                // 获取数据，使用到的表有WorkFlowCase、b_appross2、b_jshtspb、b_hpplan
                StringBuilder sb = new StringBuilder();
                sb.AppendFormat(@"select a.Name as Name, b.kind, convert(varchar(10), b.time1, 120) as time1_year, convert(varchar(10), b.time2, 120) as time2_year, convert(varchar(10), b.time3, 120) as time3_year,
                                    b.Department, b.ProjectLeader, b.AssistantLeader, b.Member, b.Operator,
                                    c.member3, c.tongyi1, c.opin, c.sign, year(c.signtime) as signtime_y, month(c.signtime) as signtime_m, day(c.signtime) as signtime_d,
                                    c.tongyi2, c.opin1, c.sign1, year(c.signtime1) as signtime1_y, month(c.signtime1) as signtime1_m, day(c.signtime1) as signtime1_d,
                                    c.situ1, c.tongyi3, c.opin2, c.sign2, year(c.signtime2) as signtime2_y, month(c.signtime2) as signtime2_m, day(c.signtime2) as signtime2_d,
                                    c.situ2, c.tongyi4, c.opin3, c.sign3, year(c.signtime3) as signtime3_y, month(c.signtime3) as signtime3_m, day(c.signtime3) as signtime3_d,
                                    c.situ3, c.zgstongyi, c.zgsopin, c.zgssign, year(c.zgssigntime) as zgssigntime_y, month(c.zgssigntime) as zgssigntime_m, day(c.zgssigntime) as zgssigntime_d,
                                    c.tongyi5, c.opin4, c.sign4, year(c.signtime4) as signtime4_y, month(c.signtime4) as signtime4_m, day(c.signtime4) as signtime4_d
                                    from workflowcase a 
                                    left join b_appross b ON a.ID = b.id
                                    left join b_appro c ON a.ID = c.id
                                    where a.id = '{0}' ", caseid);// a.FlowID= '{}' and 
                DataTable dt = Utility.Database.ExcuteDataSet(sb.ToString()).Tables[0];

                // 路径处理
                string rootPath = Utility.RootPath;
                string chooseFileModel = "ReportTemplate\\TechDocReportArticlePrintApprovalTable1.docx";// 获取模板
                string modelSourcePath = rootPath + chooseFileModel;// 模板路径
                string folderPath = "ReportFiles\\TechDocReportArticlePrintApprovalTable";// 创建文件夹路径
                string fileName = caseid + "table01" + DateTime.Now.ToString("yyyyMMdd") + ".docx";// 创建文件后的文件路径
                string saveAsPath = folderPath + "\\" + fileName;// 
                string createNewFilePath = rootPath + saveAsPath;

                // 返回另存为文件的路径
                string resultPath = CommonCreateTableDoc(modelSourcePath, rootPath, folderPath, createNewFilePath, saveAsPath, GetDictionary(dt));
                return resultPath;
            }
            catch (Exception ex)
            {
                Utility.WriteLog(ex.Message);
                return PackResult.JsonMsg(false, ex.Message);
            }
        }

        // 用到的表有WorkFlowCase、b_appro（主表）、b_appross
        #endregion

        #region 生成Table02 报批
        [DataAction("CreateTable02Doc", "workflowid", "caseid")]
        public string CreateTable02Doc(string workflowid, string caseid)
        {
            try
            {
                // 获取数据，使用到的表有WorkFlowCase、b_appross2、b_jshtspb、b_hpplan
                StringBuilder sb = new StringBuilder();
                sb.AppendFormat(@"select a.Name as Name, b.kind, convert(varchar(10), b.time1, 120) as time1_year, convert(varchar(10), b.time2, 120) as time2_year, convert(varchar(10), b.time3, 120) as time3_year,
                                    d.bsbm as Department, e.smzz as ProjectLeader, e.smfzz as AssistantLeader, e.member as Member, d.jbr as Operator,
                                    c.member3, c.tongyi1, c.opin, c.sign, year(c.signtime) as signtime_y, month(c.signtime) as signtime_m, day(c.signtime) as signtime_d,
                                    c.tongyi2, c.opin1, c.sign1, year(c.signtime1) as signtime1_y, month(c.signtime1) as signtime1_m, day(c.signtime1) as signtime1_d,
                                    c.situ1, c.tongyi3, c.opin2, c.sign2, year(c.signtime2) as signtime2_y, month(c.signtime2) as signtime2_m, day(c.signtime2) as signtime2_d,
                                    c.situ2, c.tongyi4, c.opin3, c.sign3, year(c.signtime3) as signtime3_y, month(c.signtime3) as signtime3_m, day(c.signtime3) as signtime3_d,
                                    c.situ3, c.zgstongyi, c.zgsopin, c.zgssign, year(c.zgssigntime) as zgssigntime_y, month(c.zgssigntime) as zgssigntime_m, day(c.zgssigntime) as zgssigntime_d,
                                    c.tongyi5, c.opin4, c.sign4, year(c.signtime4) as signtime4_y, month(c.signtime4) as signtime4_m, day(c.signtime4) as signtime4_d
                                    from workflowcase a 
                                    left join b_appross b on a.ID = b.id
                                    left join b_appro c on a.ID = c.id
                                    left join b_jshtspb d on a.ID = d.id
                                    left join b_hpplan e on a.ID = e.id
                                    where a.id = '{0}' ", caseid);// a.FlowID= '{}' and 
                DataTable dt = Utility.Database.ExcuteDataSet(sb.ToString()).Tables[0];

                // 路径处理
                string rootPath = Utility.RootPath;
                string chooseFileModel = "ReportTemplate\\TechDocReportArticlePrintApprovalTable2.docx";// 获取模板
                string modelSourcePath = rootPath + chooseFileModel;// 模板路径
                string folderPath = "ReportFiles\\TechDocReportArticlePrintApprovalTable";// 创建文件夹路径
                string fileName = caseid + "table02" + DateTime.Now.ToString("yyyyMMdd") + ".docx";// 创建文件后的文件路径
                string saveAsPath = folderPath + "\\" + fileName;// 
                string createNewFilePath = rootPath + saveAsPath;

                // 返回另存为文件的路径
                string resultPath = CommonCreateTableDoc(modelSourcePath, rootPath, folderPath, createNewFilePath, saveAsPath, GetDictionary(dt));
                return resultPath;
            }
            catch (Exception ex)
            {
                Utility.WriteLog(ex.Message);
                return PackResult.JsonMsg(false, ex.Message);
            }
        }

        // 用到的表有 WorkFlowCase、b_appro、b_appross、B_jshtspb、b_hpplan
        #endregion

        #region 生成Table03 报批
        [DataAction("CreateTable03Doc", "workflowid", "caseid")]
        public string CreateTable03Doc(string workflowid, string caseid)
        {
            try
            {
                // 获取数据，使用到的表有WorkFlowCase、b_appro
                StringBuilder sb = new StringBuilder();
                sb.AppendFormat(@"select a.Name as Name, b.kind, 
                                    convert(VARCHAR(20), b.time1, 120) as time1, convert(VARCHAR(20), b.time2, 120) as time2, convert(VARCHAR(20), b.time3,120) as time3,
                                    b.time4, b.time5, b.time6,b.member1, b.member2, b.member3,
                                    b.tongyi1, b.opin,b.sign, year(b.signtime) as signtime_y, month(b.signtime) as signtime_m, day(b.signtime) as signtime_d,
                                    b.tongyi2, b.opin1, b.sign1, year(b.signtime1) as signtime1_y, month(b.signtime1) as signtime1_m, day(b.signtime1) as signtime1_d, b.situ1, 
                                    b.tongyi3,b.opin2, b.sign2, year(b.signtime2) as signtime2_y, month(b.signtime2) as signtime2_m, day(b.signtime2) as signtime2_d, b.situ2,
                                    b.tongyi4,b.opin3, b.sign3, year(b.signtime3) as signtime3_y, month(b.signtime3) as signtime3_m, day(b.signtime3) as signtime3_d, b.situ3,
                                    b.zgstongyi,b.zgsopin, b.zgssign, year(b.zgssigntime) as zgssigntime_y, month(b.zgssigntime) as zgssigntime_m, day(b.zgssigntime) as zgssigntime_d,
                                    b.tongyi5,b.opin4, b.sign4, year(b.signtime4) as signtime4_y, month(b.signtime4) as signtime4_m, day(b.signtime4) as signtime4_d
                                    from workflowcase a 
                                    left join b_appro b on a.ID = b.id
                                    where a.id = '{0}' ", caseid); // a.FlowID= '{}' and 
                DataTable dt = Utility.Database.ExcuteDataSet(sb.ToString()).Tables[0];

                // 路径处理
                string rootPath = Utility.RootPath;
                string chooseFileModel = "ReportTemplate\\TechDocReportArticlePrintApprovalTable3.docx";// 获取模板
                string modelSourcePath = rootPath + chooseFileModel;// 模板路径
                string folderPath = "ReportFiles\\TechDocReportArticlePrintApprovalTable";// 创建文件夹路径
                string fileName = caseid + "table03" + DateTime.Now.ToString("yyyyMMdd") + ".docx";// 创建文件后的文件路径
                string saveAsPath = folderPath + "\\" + fileName;// 
                string createNewFilePath = rootPath + saveAsPath;

                // 返回另存为文件的路径
                string resultPath = CommonCreateTableDoc(modelSourcePath, rootPath, folderPath, createNewFilePath, saveAsPath, GetDictionary(dt));
                return resultPath;
            }
            catch (Exception ex)
            {
                Utility.WriteLog(ex.Message);
                return PackResult.JsonMsg(false, ex.Message);
            }
        }

        // 用到的表有 WorkFlowCase、b_appro、b_appross、B_jshtspb、b_hpplan
        #endregion

        */

        #region 生成TablessDoc  综合处理
        /*
        //        [DataAction("CreateTablessDoc", "workflowid", "caseid")]
        //        public string CreateTablessDoc(string workflowid, string caseid)
        //        {
        //            try
        //            {
        //                // 获取数据，使用到的表有WorkFlowCase、b_appross2、b_jshtspb、b_hpplan
        //                StringBuilder sb = new StringBuilder();
        //                sb.AppendFormat(@"select a.Name as Name, b.kind, b.time1, b.time2, b.time3 ,c.bsbm, d.smzz, d.smfzz, d.member, c.jbr, 
        //                                    b.Numbers, b.smzzopin, b.smzztongyi, b.smzzsign, b.smzzsigntime, b.opin1, b.tongyi1, b.sign1,
        //                                    b.signtime1, b.situ1, b.opin2, b.tongyi2, b.sign2, b.signtime2, b.situ2, b.opin3, b.tongyi3,
        //                                    b.sign3, b.signtime3, b.situ3, b.zgsopin, b.zgstongyi, b.zgssign, b.zgssigntime, b.opin4,
        //                                    b.tongyi5, b.sign4, b.signtime4, year(b.time1) as time1_year, year(b.time2) as time2_year,
        //                                    year(b.time3) as time3_year, year(b.smzzsigntime) as smzzsigntime_y, month(b.smzzsigntime) as smzzsigntime_m,
        //                                    day(b.smzzsigntime) as smzzsigntime_d, year(b.signtime1) as signtime1_y, month(b.signtime1) as signtime1_m,
        //                                    day(b.signtime1) as signtime1_d, year(b.signtime2) as signtime2_y, month(b.signtime2) as signtime2_m,
        //                                    day(b.signtime2) as signtime2_d, year(b.signtime3) as signtime3_y, month(b.signtime3) as signtime3_m,
        //                                    day(b.signtime3) as signtime3_d, year(b.zgssigntime) as zgssigntime_y, month(b.zgssigntime) as zgssigntime_m,
        //                                    day(b.zgssigntime) as zgssigntime_d, year(b.signtime4) as signtime4_y, month(b.signtime4) as signtime4_m,
        //                                    day(b.signtime4) as signtime4_d
        //                                    from workflowcase a 
        //                                    left join b_appross2 b on a.ID = b.id
        //                                    left join b_jshtspb c on a.ID = c.id
        //                                    left join b_hpplan d on a.ID = d.id
        //                                    where a.id = '{0}' ", caseid);// a.FlowID= '{}' and 
        //                DataTable dt = Utility.Database.ExcuteDataSet(sb.ToString()).Tables[0];

        //                // 路径处理
        //                string rootPath = Utility.RootPath;
        //                string chooseFileModel = "ReportTemplate\\TechDocSendAuditingArticleApprovalTable4.docx";// 获取模板
        //                string modelSourcePath = rootPath + chooseFileModel;// 模板路径
        //                string folderPath = "ReportFiles\\TechDocSendAuditingArticleApprovalTable";// 创建文件夹路径
        //                string fileName = caseid + "table4" + DateTime.Now.ToString("yyyyMMdd") + ".docx";// 创建文件后的文件路径
        //                string saveAsPath = folderPath + "\\" + fileName;// 
        //                string createNewFilePath = rootPath + saveAsPath;

        //                // 返回另存为文件的路径
        //                string resultPath = CommonCreateTableDoc(modelSourcePath, rootPath, folderPath, createNewFilePath, saveAsPath, GetDictionary(dt));
        //                return resultPath;
        //            }
        //            catch (Exception ex)
        //            {
        //                Utility.WriteLog(ex.Message);
        //                return PackResult.JsonMsg(false, ex.Message);
        //            }
        //        }
        */
        
        // 将获取到的表数据进行处理，用于生成WORD，根据批注来
        // 综合处理 table数据
        public static Dictionary<string, object> GetDictionary(DataTable dt)
        {
            Dictionary<string, object> dict = new Dictionary<string, object>();
            List<string> list = ParseTableColumns(dt);
            if (dt.Rows.Count == 0)
            {
                for (int i = 0; i < list.Count; i++)
                {
                    var key = list[i];
                    var value = "";
                    dict.Add(key, value);
                }
            }
            else if (dt.Rows.Count == 1)
            {
                DataRow dr = dt.Rows[0];
                for (int i = 0; i < list.Count; i++)
                {
                    var key = list[i];
                    var value = dr[list[i]];
                    dict.Add(key, (value == null) ? "" : value.ToString());
                }
            }
            else
            {
                // 多行  如果插入多行，则会出现相同批注，对生成产生影响，建议不这样处理。
                Utility.WriteLog("存在多行记录！");
                /*
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    DataRow dr = dt.Rows[i];
                    for (int j = 0; j < list.Count; j++)
                    {
                        var key = list[j];
                        var value = dr[list[j]];
                        dict.Add(key, value == null ? "" : value);
                    }
                }
                */
            }
            return dict;
        }

        // 获取Columns
        public static List<string> ParseTableColumns(DataTable table)
        {
            return (from DataColumn col in table.Columns select col.ColumnName).ToList();
            //return (from DataColumn col in table.Columns select col.ColumnName.ToUpper()).ToList();
        }

        /// <summary>
        /// 生成DOC公共函数(方法引用了别的IWorkFlow.OfficeService  dll)
        /// </summary>
        /// <param name="moduleSourcePath">模板路径</param>
        /// <param name="folderPath">文件夹路径</param>
        /// <param name="createNewFilePath">生成的DOC文件路径</param>
        /// <param name="saveAsPath">要返回给用户另存的路径</param>
        /// <param name="dict">数据</param>
        /// <returns></returns>
        public static string CommonCreateTableDoc(string moduleSourcePath, string rootPath, string folderPath, string createNewFilePath, string saveAsPath, Dictionary<string, object> dict)
        {
            if (!Directory.Exists(rootPath + folderPath))// 若文件夹不存在则新建文件夹  
            {
                Directory.CreateDirectory(rootPath + folderPath); // 新建文件夹  
            }

            IWorkFlow.OfficeService.IWorkFlowOfficeHandler.ProduceWord2007UP(moduleSourcePath, createNewFilePath, dict);
            saveAsPath = saveAsPath.Replace("\\", "/");
            return saveAsPath;
        }
        #endregion

        public override string Key
        {
            get { return "PrintDataSvc"; }
        }
    }// class
}
