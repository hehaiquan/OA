using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BizService.Services.GIS
{
    /// <summary>
    ///地理操作类，数据为经纬度
    /// </summary>
    public class GeometryUtil
    {
        public static bool IsInCircle(LatLng center, LatLng testPoint, double radius)
        {
            return IsInCircle(center.Lat, center.Lng, testPoint.Lat, testPoint.Lng, radius);
        }
        /// <summary>
        /// 测试点是否在指定点的指定半径范围内
        /// </summary>
        /// <param name="lat1">指定点纬度</param>
        /// <param name="lng1">指定点经度</param>
        /// <param name="lat2">测试点纬度</param>
        /// <param name="lng2">测试点经度</param>
        /// <param name="radius">半径</param>
        /// <returns></returns>
        public static bool IsInCircle(double lat1, double lng1, double lat2, double lng2, double radius)
        {
            double R = 6378137.0,
                   rad = Math.PI / 180,
                   dis = 0;
            lat1 = rad * lat1;
            lng1 = rad * lng1;
            lat2 = rad * lat2;
            lng2 = rad * lng2;
            dis = 0;
            double a = Math.Sin(lat1) * Math.Sin(lat2) + Math.Cos(lat1) * Math.Cos(lat2) * Math.Cos(lng2 - lng1);
            dis = R * Math.Acos(Math.Min(a, 1));
            return radius >= dis;
        }
        /// <summary>
        /// 判断点是否在多变形内
        /// </summary>
        /// <param name="point">测试点</param>
        /// <param name="polygon">面多边形</param>
        /// <returns></returns>
        public static bool IsInPolygon(LatLng point, List<LatLng> polygon)
        {
            LatLng p1, p2, p3, p4;
            p1 = point;
            p2 = new LatLng() { Lng = -180, Lat = point.Lat };
            Int32 count = 0;
            for (var i = 0; i < polygon.Count-1; i++)
            {
                p3 = polygon[i];
                p4 = polygon[i + 1];
                if (checkCross(p1, p2, p3, p4))
                {
                    count++;
                }
            }
            p3 = polygon[polygon.Count - 1];
            p4 = polygon[0];
            if (checkCross(p1, p2, p3, p4))
            {
                count++;
            }
            return (count % 2 == 0) ? false : true;
        }
        /// <summary>
        /// 向量叉乘
        /// </summary>
        /// <param name="v1"></param>
        /// <param name="v2"></param>
        /// <returns></returns>
        private static double crossMul(LatLng v1, LatLng v2)
        {
            return v1.Lng * v2.Lat - v2.Lng * v1.Lat;
        }
        private static bool checkCross(LatLng p1, LatLng p2, LatLng p3, LatLng p4)
        {
            LatLng v1 = new LatLng { Lng = p1.Lng - p3.Lng, Lat = p1.Lat - p3.Lat };
            LatLng v2 = new LatLng { Lng = p2.Lng - p3.Lng, Lat = p2.Lat - p3.Lat };
            LatLng v3 = new LatLng { Lng = p4.Lng - p3.Lng, Lat = p4.Lat - p3.Lat };
            double v = crossMul(v1, v3) * crossMul(v2, v3);
            v1 = new LatLng { Lng = p3.Lng - p1.Lng, Lat = p3.Lat - p1.Lat };
            v2 = new LatLng { Lng = p4.Lng - p1.Lng, Lat = p4.Lat - p1.Lat };
            v3 = new LatLng { Lng = p2.Lng - p1.Lng, Lat = p2.Lat - p1.Lat };
            return (v <= 0 && crossMul(v1, v3) * crossMul(v2, v3) <= 0) ? true : false;
        }

    }
    public class LatLng
    {
        /// <summary>
        /// 经度
        /// </summary>
        public double Lat;
        /// <summary>
        /// 纬度
        /// </summary>
        public double Lng;
    }
}
