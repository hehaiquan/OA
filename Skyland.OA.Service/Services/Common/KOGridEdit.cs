using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BizService.Services
{
    /// <summary>
    /// KOGrid编辑类
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class KOGridEdit<T>
    {
        public List<T> data;
        public string deleteList;
    }
}
