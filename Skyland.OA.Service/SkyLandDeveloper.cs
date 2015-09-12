///框架的工作流对外的接口，各项目组不得直接使用engine的接口及engineservie的接口 
/// 注意需要加入对当前工程的应用！！！ 比如：using BizService;

using BizService;
using IWorkFlow.Engine;
using IWorkFlow.Host;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;

namespace IWorkFlow.BaseService
{

    public delegate void AfterDelete(string caseid, Object args);

    /// <summary>
    /// 工作流工作栏发送过来的数据模型，也就是工作流参数
    /// </summary>
    public class wfConfig
    {
        /// <summary>
        /// 业务新建时的临时编号
        /// </summary>
        public string guid { get; set; }

        /// <summary>
        /// 下一步接收节点I
        /// </summary>
        public string receActid { get; set; }

        /// <summary>
        /// 业务接收者
        /// </summary>
        public List<string> recivers { get; set; }

        /// <summary>
        /// 业务id
        /// </summary>
        public string caseid { get; set; }

        /// <summary>
        /// 办理节点id
        /// </summary>
        public string baid { get; set; }

        /// <summary>
        /// 业务流程id
        /// </summary>
        public string flowid { get; set; }

        /// <summary>
        /// 业务流程节点id
        /// </summary>
        public string actid { get; set; }

        /// <summary>
        /// 业务名称
        /// </summary>
        public string caseName { get; set; }

        /// <summary>
        /// 办理意见
        /// </summary>
        public string remark { get; set; }

        /// <summary>
        /// 办理时限，工作日
        /// </summary>
        public int limit { get; set; }

        /// <summary>
        /// 到期时间
        /// </summary>
        public DateTime? ExpireDate { get; set; }

        /// <summary>
        /// 附件
        /// </summary>
        public List<string> attachkeys { get; set; }

        /// <summary>
        /// 操作
        /// </summary>
        public string Opera { get; set; }



    }

    /// <summary>
    /// 和工具栏对应的服务端封装
    /// </summary>
    public class SkyLandDeveloper
    {
        wfConfig ent;           //设置
        string userid;          //用户
        string transID = "";    //本次工作流事务id
        IDbTransaction tran;    //事务
        /// <summary>
        /// 初始化工作流组件
        /// </summary>
        /// <param name="wfsetting">工作流设置，客户端发送过来的</param>
        /// <param name="userId">当前用户</param>
        /// <param name="args">数据库事务</param>
        public SkyLandDeveloper(string wfsetting, string userId, IDbTransaction args)
        {
            ent = JsonConvert.DeserializeObject<wfConfig>(wfsetting);
            userid = userId;
            if (ent.recivers != null)
            {
                if (ent.recivers.Count > 0)
                {
                    ent.recivers = ent.recivers.Distinct().ToList();
                }
            }
            tran = args;
        }

        public SkyLandDeveloper(wfConfig wfent, string userId, IDbTransaction args)
        {
            ent = wfent;
            userid = userId;
            if (ent.recivers != null)
            {
                if (ent.recivers.Count > 0)
                {
                    ent.recivers = ent.recivers.Distinct().ToList();
                }
            }
            tran = args;
        }
        /// <summary>
        /// 设置业务名称
        /// </summary>
        public string caseName { set { ent.caseName = value; } }

        /// <summary>
        /// 获取或设置工作流设置，包括办理期限、办理意见等...
        /// </summary>
        public wfConfig wfcase { get { return ent; } set { ent = value; } }
        /// <summary>
        /// 获取业务id，只读
        /// </summary>
        public string caseid
        {
            get { return ent.caseid; }
        }

        /// <summary>
        /// 创建业务
        /// </summary>
        /// <returns></returns>
        public string Create()
        {
            if (String.IsNullOrEmpty(ent.caseName))
            {
                ent.caseName = "新建 " + engineAPI.GetCaseModel(ent.flowid).Name + "(" + DateTime.Now.ToShortDateString() + ")";
            }

            BusinessCase bc = engineAPI.Create(ent.flowid, userid, ent.caseName, tran);//需要修改, limit
            ent.caseid = bc.ID;

            if (ent.attachkeys != null && ent.attachkeys.Count > 0)
            {
                string sql = String.Format("update FX_AttachMent set CaseID='{0}' where CaseID ='{1}'", bc.ID, ent.guid);
                //IDbTransaction tran = (IDbTransaction)tran;
                Utility.Database.ExecuteNonQuery(sql, tran);
            }

            if (tran != null) transID = ent.caseid;
            ent.baid = bc.BusinessActs[0].ID;
            return ent.caseid;
        }

        /// <summary>
        /// 发送工作流
        /// </summary>
        /// <param name="args">事务</param>
        public void Send()
        {
            if (tran != null && transID == "") transID = engineAPI.beginTransaction(ent.caseid);
            try
            {
                if (engineAPI.getCase(ent.caseid).GetBusinessAct(ent.baid).UserID != userid)
                    throw new Exception("业务已经不在此步,请不要重复操作");
            }
            catch
            { throw new Exception("不存在该业务或该步骤！"); }

            if (ent.Opera == "end")
                engineAPI.End(ent.caseid, ent.baid, userid, ent.remark, tran);
            else if (ent.Opera == "back")
                engineAPI.Back(ent.caseid, ent.baid, userid, ent.remark, tran);
            else
                engineAPI.Send(ent.caseid, ent.baid, userid, ent.recivers, ent.receActid, ent.remark, tran);

            //删除草稿
            IWorkFlow.BaseService.IWorkDraftManageHandler.DeleteOneDraft(ent.guid, ent.flowid, ent.caseid, ent.baid);
        }

        /// <summary>
        /// 提交工作流事务，并一并提交数据库事务
        /// </summary>
        public void Commit()
        {
            tran.Commit();
            if (transID == "") return;

            engineAPI.commit(transID);
            transID = "";
        }
        /// <summary>
        /// 回滚工作流事务，并一并回滚数据库事务
        /// </summary>
        public void RollBack()
        {
            tran.Rollback();
            if (transID == "") return;

            engineAPI.rollback(transID);
            transID = "";
        }

        /// <summary>
        /// 提交工作流事务
        /// </summary>
        public void CommitEngine()
        {
            if (transID == "") return;

            engineAPI.commit(transID);
            transID = "";
        }
        /// <summary>
        /// 回滚工作流事务
        /// </summary>
        public void RollBackEngine()
        {
            if (transID == "") return;

            engineAPI.rollback(transID);
            transID = "";
        }

        /// <summary>
        /// 封装的发送，通过委托保存数据
        /// </summary>
        /// <param name="BizParams"></param>
        /// <param name="userid"></param>
        /// <param name="saveData"></param>
        /// <param name="CaseName"></param>
        public static void send(string BizParams, string userid, Action<IDbTransaction, string> saveData, string CaseName)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();
            SkyLandDeveloper developer = new SkyLandDeveloper(BizParams, userid, tran);
            try
            {
                //SaveDataModel data = JsonConvert.DeserializeObject<SaveDataModel>(content);
                string caseid = developer.caseid;

                if (String.IsNullOrEmpty(caseid))
                {
                    //developer.caseName = data.baseInfo.traveler + "-出差申请";// 设置流程实例标题
                    //developer.wfcase.caseName= data.baseInfo.traveler + "-出差申请"; //这种写法也可以
                    developer.wfcase.caseName = CaseName;
                    caseid = developer.Create();//生成一个业务流ID                    
                }

                saveData(tran, caseid);
                developer.Send();
                developer.Commit();
                //return Utility.JsonResult(true, "发送成功！");
            }
            catch (Exception ex)
            {
                developer.RollBack();
                ComBase.Logger(ex);
                throw (new Exception("业务发送失败！", ex));
            }
        }


    }

    //接口
    interface IFrameOpen
    {
        bool DeleteCase(string caseid, string userid, Object obj);
        bool StopCase(string caseid, string userid, Object obj);
        bool resumeCase(string caseid, string userid, Object obj);
    }

    ////操作工作流的服务，在待办箱删除或停办业务会调用该服务
    public class FrameOpenService : BaseDataHandler
    {
        [DataAction("deletecase", "caseid", "flowid", "userid")]
        public string Deletecase(string caseid, string flowid, string userid)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();
            string tranID = "";
            try
            {
                IFrameOpen FrameOpen = (IFrameOpen)SkyLandBizFrame.intance;
                IWorkDraftManageHandler.DeleteCaseAllDraft(null, flowid, caseid);

                FrameOpen.DeleteCase(caseid, userid, tran);
                //这里实现自己的删除，注意用同一事务
                tranID = engineAPI.beginTransaction(caseid);
                engineAPI.Delete(caseid, userid, tran);
                tran.Commit();
                engineAPI.commit(tranID);
                return Utility.JsonResult(true, "删除成功");
            }
            catch (Exception ex)
            {
                tran.Rollback();
                engineAPI.rollback(tranID);
                throw new Exception("业务删除失败！", ex);
            }
        }


        [DataAction("stopcase", "caseid", "baid", "userid", "remark")]
        public string Stopcase(string caseid, string baid, string userid, string remark)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();
            string tranID = "";
            try
            {
                IFrameOpen FrameOpen = (IFrameOpen)SkyLandBizFrame.intance;

                FrameOpen.StopCase(caseid, userid, tran);
                //这里实现自己的删除，注意用同一事务
                tranID = engineAPI.beginTransaction(caseid);
                engineAPI.Stop(caseid, baid, userid, remark, tran);
                engineAPI.commit(tranID);
                tran.Commit();
                return Utility.JsonResult(true, "停办成功");//调用工具方法返回
            }
            catch (Exception ex)
            {
                tran.Rollback();
                engineAPI.rollback(tranID);
                throw new Exception("业务停办失败！", ex);
            }
        }

        [DataAction("resumecase", "caseid", "baid", "userid", "remark")]
        public string resumecase(string caseid, string baid, string userid, string remark)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();
            string tranID = "";
            try
            {
                IFrameOpen FrameOpen = (IFrameOpen)SkyLandBizFrame.intance;

                FrameOpen.resumeCase(caseid, userid, tran);
                //这里实现自己的删除，注意用同一事务
                tranID = engineAPI.beginTransaction(caseid);
                engineAPI.Resume(caseid, baid, userid, remark, tran);
                engineAPI.commit(tranID);
                tran.Commit();
                return Utility.JsonResult(true, "业务恢复办理！");//调用工具方法返回
            }
            catch (Exception ex)
            {
                tran.Rollback();
                engineAPI.rollback(tranID);
                throw new Exception("业务恢复办理操作失败！", ex);
            }
        }

        public override string Key
        {
            get
            {
                return "frameopen";
            }
        }

    }

    /// <summary>
    /// 工作流调用界面
    /// </summary>
    public static class engineAPI
    {
        #region 流程
        public static void SetIsReaded(string caseID, string baid, string userid)
        {
            try
            {
                if (String.IsNullOrEmpty(caseID)) return;
                EngineHost.Instance.setIsreaded(caseID, baid, userid);
            }
            catch (Exception ex)
            {
                throw new Exception("设置已读出错，错误：" + ex.Message, ex);
            }
        }
        public static BusinessCase Create(string flowID, string creater, string name, object args)
        {
            return EngineHost.Instance.Create(flowID, creater, name, args);
        }

        public static void Back(string caseID, string baID, string senderid, string remark, object args)
        {
            EngineHost.Instance.Back(caseID, baID, senderid, args, remark);
        }
        //需要修改，还没有实现办结
        public static void End(string caseID, string baID, string userid, string remark, object args)
        {
            IWorkFlow.Engine.EngineHost.Instance.End(caseID, baID, userid, remark, args);
        }
        public static void Delete(string caseID, string creater, object args)
        {
            EngineHost.Instance.Delete(caseID, creater, args);
        }

        public static void Send(string caseID, string baID, string senderid, List<string> receivers, string receAct, string remark, object args)
        {
            //可以实现多个节点提交，这里只是实现了一个
            List<ReceiverInfo> recInfos = new List<ReceiverInfo>();
            string recs = "";
            foreach (string r in receivers)
            { recs += r + ";"; }
            recs = recs.TrimEnd(';');
            recInfos.Add(new ReceiverInfo(recs, receAct));

            EngineHost.Instance.Send(caseID, baID, recInfos, senderid, remark, args);
        }

        public static void Resume(string caseid, string baid, string senderid, string remark, object args)
        {
            //需要修改，设置为提交给本人办理本步骤
            List<ReceiverInfo> recInfos = new List<ReceiverInfo>();
            string actid = EngineHost.Instance.CContent[caseid].GetBusinessAct(baid).ActID;
            recInfos.Add(new ReceiverInfo(senderid, actid));
            remark = "业务恢复办理！" + remark;
            EngineHost.Instance.WorkFLowChangeState(caseid, baid, null, CaseActState.DOING, args);
            EngineHost.Instance.Send(caseid, baid, recInfos, senderid, remark, args);
        }

        //public static void StopOneCase(string caseid, string senderid, string remark, object args)
        //{
        //    IWorkFlow.Engine.EngineHost.Instance.WorkFLowChangeState(caseid, null, Engine.CaseActState.DOING, args);
        //    // IWorkFlow.Engine.EngineHost.Instance.StopOneCase(caseid, senderid, remark, args);
        //}

        public static void Stop(string caseid, string baid, string senderid, string remark, object args)
        {
            remark = "业务暂停办理！" + remark;

            EngineHost.Instance.WorkFLowChangeState(caseid, baid, remark, CaseActState.STOP, args);
        }

        //public static void CreateRollback(string flowID, string caseid)
        //{
        //    //  return IWorkFlow.Engine.EngineHost.Instance.CreateRollback(flowID, caseid, args);
        //}

        public static void ReLoadOneCase(string caseid, object args)
        {
            EngineHost.Instance.ReLoadOneCase(caseid, args);
        }

        public static void SetBizActExpireDate(string caseID, string baid, DateTime expiredate)
        {
            EngineHost.Instance.SetCaseExpireDate(caseID, baid, expiredate);
        }

        //public static void SetBizActRemark(string caseid, string userid, string remark)
        //{
        //    return IWorkFlow.Engine.EngineHost.Instance.SetBusinessActRemark(caseid, userid, remark, args);
        //}

        //public static void SetBizCaseLimit(string caseid, int limit)
        //{
        //    // return IWorkFlow.Engine.EngineHost.Instance.SetBusinessCaseLimit(caseid, limit, args);
        //}
        public static void SetBizCaseName(string caseid, string caseName, object args)
        {
            EngineHost.Instance.setCaseName(caseid, caseName, args);
        }
        #endregion

        #region 获取流程信息  在了解需求后考虑删除直接获取业务对象或模型对象
        /// <summary>
        /// 获取待办业务实例
        /// </summary>
        /// <param name="caseid">业务id</param>
        /// <returns></returns>
        public static BusinessCase getCase(string caseid)
        {
            return EngineHost.Instance.CContent[caseid];
        }
        /// <summary>
        /// 获取任意业务，不管是不是办结
        /// </summary>
        /// <param name="caseid"></param>
        /// <returns></returns>
        public static BusinessCase getAnyCase(string caseid)
        {
            BusinessCase bc = EngineHost.Instance.CContent[caseid];
            if (bc == null) return EngineHost.Instance.getAnyCase(caseid);

            return bc;
        }

        /// <summary>
        /// 获取业务模型
        /// </summary>
        /// <param name="flowid"></param>
        /// <returns></returns>
        public static BusinessModel GetCaseModel(string flowid)
        {
            return EngineHost.Instance.MContent[flowid];
        }
        /// <summary>
        /// 业务节点实例，如果actid为空，则返回当前办理节点
        /// </summary>
        /// <param name="caseid"></param>
        /// <param name="baid"></param>
        /// <returns></returns>
        public static BusinessActivity GetAct(string caseid, string baid)
        {
            return EngineHost.Instance.CContent[caseid].GetBusinessAct(baid);
        }
        /// <summary>
        /// 获取节点模型
        /// </summary>
        /// <param name="flowid"></param>
        /// <param name="actid"></param>
        /// <returns></returns>
        public static ActivityModel GetActModel(string flowid, string actid)
        {
            return IWorkFlow.Engine.EngineHost.Instance.MContent[flowid].GetAct(actid);
        }

        /// <summary>
        /// 获取当前业务节点模型可提交步骤
        /// </summary>
        /// <param name="flowid"></param>
        /// <param name="curActID"></param>
        /// <returns></returns>
        public static List<ActivityModel> GetReceiveActModels(string flowid, string curActID)
        {
            return IWorkFlow.Engine.EngineHost.Instance.GetReceiveActs(flowid, curActID, true);
        }
        /// <summary>
        /// 获取可提交节点的可接受人  需要修改 还没有实现
        /// </summary>
        /// <param name="flowid"></param>
        /// <param name="actid"></param>
        /// <returns></returns>
        public static List<string> getReceiveUser(string flowid, string actid)
        {
            return null;
        }
        /// <summary>
        /// 回滚工作流事务
        /// </summary>
        /// <param name="guid"></param>
        public static void rollback(string guid)
        {
            EngineHost.Instance.rollbackTransaction(guid);
        }
        /// <summary>
        /// 提交工作流事务
        /// </summary>
        /// <param name="guid"></param>
        public static void commit(string guid)
        {
            EngineHost.Instance.commitTransaction(guid);
        }

        /// <summary>
        /// 创建工作流事务，本质是构建指定的业务实例副本，如果提交，则删除副本，如果回滚，则将副本替换当前业务实例
        /// </summary>
        /// <param name="caseid">指定业务实例编号</param>
        /// <returns>事务id</returns>
        public static string beginTransaction(string caseid)
        {
            return EngineHost.Instance.beginTransaction(caseid);
        }
        #endregion
    }

    public static class userAPI
    {
        public static List<string> getPrivilege(string userid)
        {
            return null;
        }

        public static string getUsername(string userid)
        {
            return "";
        }

        public static List<string> getUserids(string roleid)
        {
            return null;
        }
    }

    public static class messageAPI
    {
        /// <summary>
        /// 添加消息
        /// </summary>
        /// <param name="id"></param>
        /// <param name="msg"></param>
        /// <param name="type"></param>
        /// <param name="receiveUserids"></param>
        /// <param name="rexpireDate"></param>
        public static void addMsg(string id, string msg, string type, string receiveUserids, DateTime rexpireDate)
        {

            BaseService.MessageManager.addMsg(new cMsg
            {
                guid = id,
                text = msg,
                type = type,
                recipient = receiveUserids
            });
        }
        /// <summary>
        /// 删除消息
        /// </summary>
        /// <param name="id"></param>
        public static void delMsg(string id)
        {
            MessageManager.userMsgDict.Remove(id);
        }
    }

}