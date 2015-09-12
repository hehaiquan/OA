using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace BizService.Common
{
    /// <summary>
    ///  转换类
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class ConvertHelper<T> where T : new()
    {
        /// <summary>  
        /// DataTable转化为List
        /// </summary>  
        /// <param name="dt"></param>  
        /// <returns></returns>  
        public static List<T> DataTableToList(DataTable dt)
        {
            // 定义集合  
            List<T> ts = new List<T>();

            // 获得此模型的类型  
            Type type = typeof(T);
            //定义一个临时变量  
            string tempName = string.Empty;
            //遍历DataTable中所有的数据行  
            foreach (DataRow dr in dt.Rows)
            {
                T t = new T();
                // 获得此模型的公共属性  
                PropertyInfo[] propertys = t.GetType().GetProperties();
                //遍历该对象的所有属性  
                foreach (PropertyInfo pi in propertys)
                {
                    tempName = pi.Name;//将属性名称赋值给临时变量  
                    //检查DataTable是否包含此列（列名==对象的属性名）    
                    if (dt.Columns.Contains(tempName))
                    {
                        // 判断此属性是否有Setter  
                        if (!pi.CanWrite) continue;//该属性不可写，直接跳出  
                        //取值  
                        object value = dr[tempName];
                        //如果非空，则赋给对象的属性  
                        if (value != DBNull.Value)
                            pi.SetValue(t, value, null);
                    }
                }
                //对象添加到泛型集合中  
                ts.Add(t);
            }

            return ts;
        }

        /// <summary>
        /// 反序列化XML字符串为指定类型
        /// </summary>
        public static T XmlDeserialize(string Xml)
        {
            Type type = typeof(T);
            T result = new T();
            XmlSerializer xmlSerializer = new XmlSerializer(type);
            try
            {
                using (StringReader stringReader = new StringReader(Xml))
                {
                    result = (T)xmlSerializer.Deserialize(stringReader);
                }
            }
            catch (Exception innerException)
            {
                throw new Exception(innerException.InnerException.Message);
            }
            return result;
        }

        /// <summary>
        /// 日期类型转换成中文日期格式
        /// </summary>
        /// <param name="dt">日期</param>
        /// <returns></returns>
        public static string ToCnDate(object objDt)
        {
            DateTime? dt = null;
            try
            {
                dt = Convert.ToDateTime(objDt);
            }
            catch (Exception)
            {
                return string.Empty;
            }

            StringBuilder result = new StringBuilder();
            if (dt == null)
                return string.Empty;

            char[] cnNum = new char[] { '〇', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十' };
            int year = dt.Value.Year;//年
            int month = dt.Value.Month;//月
            int day = dt.Value.Day;//日
            //年转换
            foreach (var item in year.ToString())
            {
                result.Append(cnNum[int.Parse(item.ToString())]);
            }
            result.Append("年");
            //月转换
            switch (month)
            {
                case 10:
                    result.Append("十");
                    break;
                case 11:
                    result.Append("十一");
                    break;
                case 12:
                    result.Append("十二");
                    break;
                default:
                    result.Append(cnNum[month]);
                    break;
            }
            result.Append("月");
            //日转换
            if (day < 10)
                result.Append(cnNum[day]);
            if (day == 10)
                result.Append("十");
            if (day > 10 && day < 20)//如：十一
                result.Append("十" + cnNum[day % 10]);
            if (day == 20)
                result.Append("二十");
            if (day > 20 && day < 30)//如：二十一
                result.Append("二十" + cnNum[day % 10]);
            if (day == 30)
                result.Append("三十");
            if (day == 31)
                result.Append("三十一");
            result.Append("日");
            return result.ToString();
        }

    }
}
