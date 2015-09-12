using IWorkFlow.Host;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BizService.Common
{
    public class ComDBHelper
    {
        /// <summary>
        /// 查询字符串
        /// </summary>
        public static string ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["mydata"].ConnectionString;
        /// <summary>
        /// 返回第一行第一列
        /// </summary>
        /// <param name="sql"></param>
        /// <returns></returns>
        public static object ExecuteScalar(string sql)
        {
            object result = null;
            using (IDataReader reader = Utility.Database.GetSingleReader(sql))
            {
                if (reader.Read())
                {
                    result = reader[0];
                }
            }
            /*IDataReader reader = Utility.Database.GetSingleReader(sql);
            if (reader.Read())
            {
                result = reader[0];
            }
            reader.Close();*/
            return result;
        }

        /// <summary>
        /// 查询记录总数
        /// </summary>
        /// <param name="sql"></param>
        /// <returns></returns>
        public static Int32 GetCount(string sql)
        {
            object result = ExecuteScalar(sql);
            return Convert.ToInt32(result);
        }

        ///// <summary>
        ///// 获取DataTable
        ///// </summary>
        ///// <param name="sql"></param>
        ///// <returns></returns>
        //public static DataTable GetDataTable(string sql)
        //{
        //    using (OracleConnection conn = new OracleConnection(ConnectionString))
        //    {
        //        OracleDataAdapter da = new OracleDataAdapter(sql, conn);
        //        DataSet ds = new DataSet();
        //        da.Fill(ds);
        //        DataTable dt = ds.Tables[0];
        //        return dt;
        //    }
        //}

        /// <summary>
        /// 获取List<IDictionary>类型的数据
        /// </summary>
        /// <param name="info"></param>
        /// <returns></returns>
        public static List<IDictionary<string, object>> GetDictList(Para_DictList info)
        {
            //List<string> errCol = new List<string>();
            //if (string.IsNullOrWhiteSpace(info.TableName))
            //    errCol.Add("表名【TableName】属性为不能为空");
            //if (errCol.Count > 0)
            //{
            //    throw new Exception(string.Join("；", errCol));
            //}

            List<IDictionary<string, object>> recordCol = new List<IDictionary<string, object>>();

            bool isGetAllField = (info.Fields == null || info.Fields.Length < 1);//是否获取所有字段
            string sql = info.Sql;
            if (string.IsNullOrWhiteSpace(sql))
            {
                string where = string.IsNullOrWhiteSpace(info.Where) ? "" : " where " + info.Where;
                sql = string.Format("select * from {0} {1}", info.TableName, where);
            }

            using (var reader = Utility.Database.GetReader(sql))
            {
                while (reader.Read())
                {
                    #region 获取字段值
                    IDictionary<string, object> dict = new Dictionary<string, object>();
                    if (isGetAllField)//获取所有字段
                    {
                        int count = reader.FieldCount;
                        for (int i = 0; i < count; i++)
                        {
                            string fieldNmae = reader.GetName(i);
                            dict.Add(fieldNmae, reader[i]);
                        }
                    }
                    else if (!info.IsExceptFields)//获取指定字段
                    {
                        foreach (var item in info.Fields)
                        {
                            dict.Add(item, reader[item]);
                        }
                    }
                    else//获取排除字段外的字段
                    {
                        int count = reader.FieldCount;
                        for (int i = 0; i < count; i++)
                        {
                            string fieldNmae = reader.GetName(i);
                            if (info.Fields.Where(o => o.ToUpper() == fieldNmae.ToUpper()).Count() == 0)
                            {
                                dict.Add(fieldNmae, reader[i]);
                            }
                        }
                    }
                    #endregion
                    recordCol.Add(dict);
                }
            }
            return recordCol;
        }

        /// <summary>
        /// 删除数据表记录
        /// </summary>
        /// <param name="info"></param>
        /// <returns></returns>
        public static bool DelTableData(Para_DelTableData info)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();
            try
            {
                string sql = "delete from {0} where {1} = @pk";
                sql = string.Format(sql, info.TableName, info.PkField);
                DbParameter[] dbp = { Utility.Database.getParam("pk", info.PkValue) };

                int updateRows = Utility.Database.ExecuteNonQuery(sql, tran, dbp);
                //if (updateRows != 0)
                //{
                //    tran.Rollback();
                //}
                tran.Commit();
                return true;
            }
            catch (Exception ex)
            {
                tran.Rollback();
                ComBase.Logger(ex);
                return false;
            }
        }

        /// <summary>
        /// 获取表记录的空模板
        /// </summary>
        /// <param name="tableName">表名</param>
        /// <returns></returns>
        public static Dictionary<string, object> GetRecrodEmptyTpl(string tableName)
        {
            Dictionary<string, object> dict = new Dictionary<string, object>();
            string sql = string.Format("select * from {0} where 1<>1", tableName);
            using (var reader = Utility.Database.GetReader(sql))
            {
                int count = reader.FieldCount;
                for (int i = 0; i < count; i++)
                {
                    string fieldNmae = reader.GetName(i);
                    dict.Add(fieldNmae, null);
                }
            }
            return dict;
        }

    }
    /// <summary>
    /// 获取List<IDictionary>提供的参数类
    /// </summary>
    public class Para_DictList
    {
        /// <summary>
        /// select sql （执行的select语句，存在改语句时则忽略TableName和Where）
        /// </summary>
        public string Sql;

        /// <summary>
        /// 表名
        /// </summary>
        public string TableName;

        /// <summary>
        /// 指定的字段（区分大小写、默认全部返回，如果IsExceptFields为true，则为排除的字段，其他字段信息都返回）
        /// </summary>
        public string[] Fields;

        /// <summary>
        /// 是否排除指定的字段
        /// </summary>
        public bool IsExceptFields = false;

        public string Where;
    }
    /// <summary>
    /// 删除表数据参数
    /// </summary>
    public class Para_DelTableData
    {
        /// <summary>
        /// 表名
        /// </summary>
        public string TableName;
        /// <summary>
        /// 主键字段名称(默认PK)
        /// </summary>
        public string PkField = "PK";
        /// <summary>
        /// 主键值
        /// </summary>
        public string PkValue;
    }
}
