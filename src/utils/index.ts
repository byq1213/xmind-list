/**
 * 时间戳格式化成时间字符串
 * @param timestamp 时间戳
 * @returns YYYY-MM-DD hh:mm:ss
 */
export const formatTimestamp = (timestamp: string) => {
  const date = new Date(+timestamp);
  let Y = date.getFullYear();
  let M = date.getMonth() + 1;
  let D = date.getDate();
  let h = date.getHours();
  let m = date.getMinutes();
  let s = date.getSeconds();
  return {
      date,
      format: `${Y}-${M}-${D} ${h < 10 ? "0" + h : h}:${m < 10 ? "0" + m : m}:${
        s < 10 ? "0" + s : s
      }`
  };
};

/**
 * 分转元,暂时没用到
 */
// export const formatRMB = (amount: number) => {
//     if(amount){
//         return String(amount).replace(/(\d{2})$/,'.$1')
//     }
//     return '0.00'
// };
