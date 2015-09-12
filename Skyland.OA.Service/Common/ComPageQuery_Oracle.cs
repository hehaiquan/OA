using IWorkFlow.Host;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BizService.Common
{
    public class ComPageQuery_Oracle
    {
        /// <summary>
        /// 查询总记录数SQL格式
        /// </summary>
        //public static string NoPageCountSqlFormat = @"select count(1) from(select * from  {0} a where 1=1 {1} ) T";
        public static string NoPageCountSqlFormat = @"select count(1) from {0} where 1=1 {1}";

        /// <summary>
        /// 查询SQL格式（不分页）
        /// </summary>
        //public static string NoPageSqlFormat = @"select rownum as RN,T.* from(select * from  {2}  a where 1=1  {3}  order by {0} {1}  ) T";
        public static string NoPageSqlFormat = @"select rownum as RN,a.* from {2} a where 1=1 {3} order by {0} {1}";
        /// <summary>
        /// 查询SQL格式（不分页、不排序）
        /// </summary>
        public static string NoPageSqlFormat_NoOrder = @"select rownum as RN,a.* from {0} a where 1=1 {1}";

        /// <summary>
        /// 分页查询SQL格式
        /// </summary>
        //public static string PageSqlFormat = @"select * from (select rownum as RN,T.* from(select * from  {2}  a where 1=1  {3}  order by {0} {1}  ) T )where RN between {4}  and {5}";
        public static string PageSqlFormat = @"select * from (select rownum as RN,T.* from(select * from {2} a where 1=1 {3} order by {0} {1}) T )where RN between {4} and {5}";
        /// <summary>
        /// 分页查询SQL格式(不排序)
        /// </summary>
        public static string PageSqlFormat_NoOrder = @"select * from (select rownum as RN,a.* from {0} a where 1=1 {1}) where RN between {2}  and {3}";


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
                        pageSql = string.Format(PageSqlFormat, queryInfo.Sort,queryInfo.TableName, queryInfo.Conditions, startRowNum, endRowNum);//排序
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
                        pageSql = string.Format(NoPageSqlFormat, queryInfo.Sort, queryInfo.TableName, queryInfo.Conditions);//排序
                    else
                        pageSql = string.Format(NoPageSqlFormat_NoOrder, queryInfo.TableName, queryInfo.Conditions);//不排序
                    var recordObject = Utility.Database.QueryList<T>(pageSql);
                    sr.Records = recordObject;
                    sr.RecordCount = recordObject.Count();
                }

                return sr;
            }
            catch (Exception e)
            {
                QueryResult sr = new QueryResult();
                sr.IsSuccess = false;
                sr.ErrMsg = e.Message;
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
}
