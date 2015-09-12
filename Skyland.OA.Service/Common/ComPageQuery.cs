using IWorkFlow.Host;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BizService.Common
{
    /// <summary>
    ///通用分页查询 sqlserver
    /// </summary>
    public class ComPageQuery
    {
        /// <summary>
        /// 查询总记录数SQL格式
        /// </summary>
        public static string NoPageCountSqlFormat = @"SELECT COUNT(1) FROM {0} WHERE 1=1 {1}";

        /// <summary>
        /// 查询SQL格式（不分页）
        /// </summary>
        public static string NoPageSqlFormat = @"SELECT ROW_NUMBER() OVER(ORDER BY {2}) AS RN,* FROM {0} WHERE 1=1 {1}";
        /// <summary>
        /// 查询SQL格式（不分页、不排序）
        /// </summary>
        public static string NoPageSqlFormat_NoOrder = @"SELECT ROW_NUMBER() OVER (ORDER BY (SELECT 0)) AS RN,* FROM {0} WHERE 1=1 {1}";

        /// <summary>
        /// 分页查询SQL格式
        /// </summary>
        public static string PageSqlFormat = @"SELECT * FROM (SELECT ROW_NUMBER() OVER(ORDER BY {2}) AS RN,* FROM {0} WHERE 1=1 {1}) AS T WHERE T.RN BETWEEN  {3}  AND {4}";

        /// <summary>
        /// 分页查询SQL格式(不排序)
        /// </summary>
        public static string PageSqlFormat_NoOrder = @"SELECT * FROM (SELECT ROW_NUMBER() OVER(ORDER BY (SELECT 0)) AS RN,* FROM {0} WHERE 1=1 {1}) AS T WHERE T.RN BETWEEN  {2}  AND {3}";

        #region 分页查询相关函数
        /// <summary>
        /// 分页查询（字符串参数）
        /// </summary>
        /// <param name="queryInfo"></param>
        /// <returns>SearchResult类型的json字符串</returns>
        public static string PageQuery<T>(string queryInfo)
        {
            try
            {
                QueryInfo info = JsonConvert.DeserializeObject<QueryInfo>(queryInfo);
                if (info == null)
                    throw new Exception("查询条件有误！");
                return JsonConvert.SerializeObject(PageQuery<T>(info));
            }
            catch (Exception e)
            {
                QueryResult sr = new QueryResult();
                sr.IsSuccess = false;
                sr.ErrMsg = e.Message;
                return JsonConvert.SerializeObject(sr);
            }
        }

        /// <summary>
        /// 分页查询（字符串参数）
        /// </summary>
        /// <param name="queryInfo"></param>
        /// <returns>SearchResult类型的json字符串</returns>
        public static string PageQueryToJsonResult<T>(string queryInfo)
        {
            try
            {
                QueryInfo info = JsonConvert.DeserializeObject<QueryInfo>(queryInfo);
                if (info == null)
                    throw new Exception("查询条件有误！");
                var res = PageQuery<T>(info);
                if (!res.IsSuccess)
                    throw new Exception(res.ErrMsg);
                return Utility.JsonResult(true, null, res);
            }
            catch (Exception e)
            {
                return Utility.JsonResult(false, e.Message);
            }
        }

        /// <summary>
        /// 分页查询（字符串参数）
        /// </summary>
        /// <param name="queryInfo"></param>
        /// <returns>SearchResult类型的json字符串</returns>
        public static string PageQueryToJsonResult(string queryInfo)
        {
            try
            {
                QueryInfo info = JsonConvert.DeserializeObject<QueryInfo>(queryInfo);
                if (info == null)
                    throw new Exception("查询条件有误！");
                var res = PageQuery(info);
                if (!res.IsSuccess)
                    throw new Exception(res.ErrMsg);
                return Utility.JsonResult(true, null, res);
            }
            catch (Exception e)
            {
                return Utility.JsonResult(false, e.Message);
            }
        }

        /// <summary>
        /// 分页查询（SearchInfo类型参数）
        /// </summary>
        /// <param name="queryInfo"></param>
        /// <returns>SearchResult类型</returns>
        public static QueryResult PageQuery<T>(QueryInfo queryInfo)
        {
            try
            {
                QueryResult sr = new QueryResult { IsSuccess = true, CurPage = queryInfo.CurPage, PageSize = queryInfo.PageSize };//返回实体

                if (queryInfo.IsPageQuery)//分页
                {

                    //ComStopwatchLogger sl = new ComStopwatchLogger();

                    #region 查询记录总数
                    string noPageCountSql = string.Format(NoPageCountSqlFormat, queryInfo.TableName, queryInfo.Conditions);

                    //sl.Start("单位查询-V_BASE_UNITINFO-GetCount");
                    sr.RecordCount = ComDBHelper.GetCount(noPageCountSql);
                    //sl.Stop();

                    #endregion
                    sr.PageCount = sr.RecordCount / queryInfo.PageSize + 1;//总页数

                    #region 计算开始和结束记录号，并纠正无效参数
                    if (queryInfo.JumpPage > sr.PageCount)//跳转页码不能大于最多页码
                        queryInfo.JumpPage = sr.PageCount;
                    if (queryInfo.JumpPage < 1)//跳转页码不能小于1
                        queryInfo.JumpPage = 1;
                    int startRowNum = (queryInfo.JumpPage - 1) * queryInfo.PageSize + 1;//开始行号
                    int endRowNum = queryInfo.JumpPage * queryInfo.PageSize;//结束行号

                    #endregion

                    #region 查询当前页记录
                    string pageSql = string.Empty;
                    if (!string.IsNullOrWhiteSpace(queryInfo.Sort))
                        pageSql = string.Format(PageSqlFormat, queryInfo.TableName, queryInfo.Conditions, queryInfo.Sort, startRowNum, endRowNum);//排序
                    else
                        pageSql = string.Format(PageSqlFormat_NoOrder, queryInfo.TableName, queryInfo.Conditions, startRowNum, endRowNum);//不排序
                    //sl.ReStart("单位查询-V_BASE_UNITINFO-pageSql");
                    sr.Records = Utility.Database.QueryList<T>(pageSql);
                    //sl.Stop();
                    sr.CurPage = queryInfo.JumpPage;//获取数据成功后，设置当前页为跳转到的页码
                    #endregion
                }
                else//不分页
                {
                    sr.CurPage = 1;
                    //sr.PageSize = 0;
                    string pageSql = string.Empty;
                    if (!string.IsNullOrWhiteSpace(queryInfo.Sort))
                        pageSql = string.Format(NoPageSqlFormat, queryInfo.TableName, queryInfo.Conditions, queryInfo.Sort);//排序
                    else
                        pageSql = string.Format(NoPageSqlFormat_NoOrder, queryInfo.TableName, queryInfo.Conditions);//不排序
                    var recordObject = Utility.Database.QueryList<T>(pageSql);
                    sr.Records = recordObject;
                    sr.RecordCount = recordObject.Count();
                }

                return sr;
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
                QueryResult sr = new QueryResult();
                sr.IsSuccess = false;
                sr.ErrMsg = ex.Message;
                return sr;
            }
        }

        /// <summary>
        /// 分页查询（SearchInfo类型参数）
        /// </summary>
        /// <param name="queryInfo"></param>
        /// <returns>SearchResult类型</returns>
        public static QueryResult PageQuery(QueryInfo queryInfo)
        {
            try
            {
                QueryResult sr = new QueryResult { IsSuccess = true, CurPage = queryInfo.CurPage, PageSize = queryInfo.PageSize };//返回实体

                if (queryInfo.IsPageQuery)//分页
                {

                    //ComStopwatchLogger sl = new ComStopwatchLogger();

                    #region 查询记录总数
                    string noPageCountSql = string.Format(NoPageCountSqlFormat, queryInfo.TableName, queryInfo.Conditions);

                    //sl.Start("单位查询-V_BASE_UNITINFO-GetCount");
                    sr.RecordCount = ComDBHelper.GetCount(noPageCountSql);
                    //sl.Stop();

                    #endregion
                    sr.PageCount = sr.RecordCount / queryInfo.PageSize + 1;//总页数

                    #region 计算开始和结束记录号，并纠正无效参数
                    if (queryInfo.JumpPage > sr.PageCount)//跳转页码不能大于最多页码
                        queryInfo.JumpPage = sr.PageCount;
                    if (queryInfo.JumpPage < 1)//跳转页码不能小于1
                        queryInfo.JumpPage = 1;
                    int startRowNum = (queryInfo.JumpPage - 1) * queryInfo.PageSize + 1;//开始行号
                    int endRowNum = queryInfo.JumpPage * queryInfo.PageSize;//结束行号

                    #endregion

                    #region 查询当前页记录
                    string pageSql = string.Empty;
                    if (!string.IsNullOrWhiteSpace(queryInfo.Sort))
                        pageSql = string.Format(PageSqlFormat, queryInfo.TableName, queryInfo.Conditions, queryInfo.Sort, startRowNum, endRowNum);//排序
                    else
                        pageSql = string.Format(PageSqlFormat_NoOrder, queryInfo.TableName, queryInfo.Conditions, startRowNum, endRowNum);//不排序
                    //sl.ReStart("单位查询-V_BASE_UNITINFO-pageSql");
                    //sr.Records = Utility.Database.QueryList<T>(pageSql);
                    sr.Records = ComDBHelper.GetDictList(new Para_DictList { Sql = pageSql, Fields = queryInfo.Fields, IsExceptFields = queryInfo.IsExceptFields });

                    //sl.Stop();
                    sr.CurPage = queryInfo.JumpPage;//获取数据成功后，设置当前页为跳转到的页码
                    #endregion
                }
                else//不分页
                {
                    sr.CurPage = 1;
                    //sr.PageSize = 0;
                    string pageSql = string.Empty;
                    if (!string.IsNullOrWhiteSpace(queryInfo.Sort))
                        pageSql = string.Format(NoPageSqlFormat, queryInfo.TableName, queryInfo.Conditions, queryInfo.Sort);//排序
                    else
                        pageSql = string.Format(NoPageSqlFormat_NoOrder, queryInfo.TableName, queryInfo.Conditions);//不排序
                    // var recordObject = Utility.Database.QueryList<T>(pageSql);
                    var recordObject = ComDBHelper.GetDictList(new Para_DictList { Sql = pageSql, Fields = queryInfo.Fields, IsExceptFields = queryInfo.IsExceptFields });

                    sr.Records = recordObject;
                    sr.RecordCount = recordObject.Count();
                }

                return sr;
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
                QueryResult sr = new QueryResult();
                sr.IsSuccess = false;
                sr.ErrMsg = ex.Message;
                return sr;
            }
        }

        /// <summary>
        /// 根据查询信息字符串，转换为QueryInfo对象，转换失败返回null
        /// </summary>
        /// <param name="queryInfo">QueryInfo字符串</param>
        /// <returns></returns>
        public static QueryInfo GetQueryInfo(string queryInfo)
        {
            QueryInfo info = JsonConvert.DeserializeObject<QueryInfo>(queryInfo);
            return info;
        }

        #endregion

    }

    //查询信息
    public class QueryInfo
    {
        public bool IsPageQuery = true;//是否分页
        public int CurPage;//当前页码
        public int JumpPage;//要跳转到的页码
        public int PageSize;//每页行数
        public string Conditions;//查询条件
        public string Sort;//排序字段（格式：field1或field1 asc或field1 desc,field2 desc）
        public string TableName;//要查找的表
        public List<PageQueryKeyValue> OtherArgs;//传递的其他参数列表
        /// <summary>
        /// 指定的字段（区分大小写、默认全部返回，如果IsExceptFields为true，则为排除的字段，其他字段信息都返回）
        /// </summary>
        public string[] Fields;
        /// <summary>
        /// 是否排除指定的字段
        /// </summary>
        public bool IsExceptFields = false;
    }

    /// <summary>
    /// 查询结果
    /// </summary>
    public class QueryResult
    {
        public int CurPage;//当前页码
        public int PageSize;//每页行数
        public int PageCount;//总页数
        public int RecordCount;//总记录数
        //public List<object> Records;//当前页的记录
        public object Records;//当前页的记录

        public bool IsSuccess;//是否成功
        public string ErrMsg;//错误信息
    }

    /// <summary>
    /// 其他参数键值对
    /// </summary>
    public class PageQueryKeyValue
    {
        public string Key;//key名称
        public string Value;//key对应的值
    }
}
