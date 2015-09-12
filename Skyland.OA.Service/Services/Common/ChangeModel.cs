using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BizService.Services
{
    class ChangeModel<T>
    {
        public string tableName;
        public List<T> data;
    }// class
}
