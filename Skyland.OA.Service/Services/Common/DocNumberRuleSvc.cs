using IWorkFlow.Host;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BizService.Services
{
    public class DocNumberRuleSvc
    {
        /// <summary>
        /// 创建一个文件编号对象
        /// </summary>
        /// <param name="lx">类型</param>
        /// <returns>返回一个对象</returns>
        public DocNumberRule CreateDocNumber(string lx)
        {
            var tran = Utility.Database.BeginDbTransaction();
            DataSet dataSet = null;
            try
            {
                //编写查询用户的sql语句
                StringBuilder sql = new StringBuilder();
                sql.Append("declare @id int;declare @dateTime varchar(10);declare @gz varchar(100);declare @lx varchar(100);");
                sql.Append("select top 1 @id=id,@dateTime=nf,@gz=gz,@lx=lx  from Para_DocNumberRule where lx='{0}' order by id desc;");
                sql.Append("if @dateTime=YEAR(GETDATE()) begin ");
                sql.Append("update Para_DocNumberRule set nf=year(getdate()) ,yf=month(getdate()), dqz=dqz+1 from Para_DocNumberRule where id=@id; ");
                sql.Append("select id, nf,yf,gz,dqz from Para_DocNumberRule where id=@id;");
                sql.Append("end else begin ");
                sql.Append("insert into Para_DocNumberRule(nf,yf,gz,dqz,lx) values(YEAR(GETDATE()),month(GETDATE()),@gz,1,@lx ); ");
                sql.Append("select top 1 id, nf,yf,gz,dqz from Para_DocNumberRule  where lx='{1}' order by id desc; ");
                sql.Append("end ");
                //string id = "7";
                string sqlStr = string.Format(sql.ToString(), lx, lx);//转为字符串,并设置where条件值
                dataSet = Utility.Database.ExcuteDataSet(sqlStr.ToString(), tran);//执行查询并将查询结果放到DataSet里
                Utility.Database.Commit(tran);//提交事务
                DocNumberRule no = new DocNumberRule();
                no.id = dataSet.Tables[0].Rows[0]["id"].ToString();
                no.nf = dataSet.Tables[0].Rows[0]["nf"].ToString();
                no.yf = dataSet.Tables[0].Rows[0]["yf"].ToString();
                no.dqz = dataSet.Tables[0].Rows[0]["dqz"].ToString();
                no.gz = dataSet.Tables[0].Rows[0]["gz"].ToString();
                //no.gz = string.Format(no.gz, no.nf, no.dqz);
                return no;
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);//回滚事务
                ComBase.Logger(ex);
                throw ex;
            }
            finally
            {
                if (dataSet != null) dataSet.Dispose();
                if (tran != null) tran.Dispose();
            }

        }

        /// <summary>
        /// 预览一个新的文件编号
        /// </summary>
        /// <param name="lx"></param>
        /// <returns></returns>
        public DocNumberRule GetDocNumber(string lx)
        {
            var tran = Utility.Database.BeginDbTransaction();
            DataSet dataSet = null;
            try
            {
                //编写查询用户的sql语句
                StringBuilder sql = new StringBuilder();
                sql.Append("select top 1 id, nf,yf,gz, dqz + 1 as dqz from Para_DocNumberRule  where lx='{0}' order by id desc; ");
                string sqlStr = string.Format(sql.ToString(), lx);//转为字符串,并设置where条件值
                dataSet = Utility.Database.ExcuteDataSet(sqlStr.ToString(), tran);//执行查询并将查询结果放到DataSet里
                Utility.Database.Commit(tran);//提交事务
                DocNumberRule no = new DocNumberRule();
                no.id = dataSet.Tables[0].Rows[0]["id"].ToString();
                no.nf = dataSet.Tables[0].Rows[0]["nf"].ToString();
                no.yf = dataSet.Tables[0].Rows[0]["yf"].ToString();
                no.dqz = dataSet.Tables[0].Rows[0]["dqz"].ToString();
                no.gz = dataSet.Tables[0].Rows[0]["gz"].ToString();
                return no;
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);//回滚事务
                ComBase.Logger(ex);
                throw ex;
            }
            finally
            {
                if (dataSet != null) dataSet.Dispose();
                if (tran != null) tran.Dispose();
            }

        }

    }

    public class DocNumberRule
    {
        public string id;
        public string nf;
        public string yf;
        public string gz;
        public string dqz;
    }
}
