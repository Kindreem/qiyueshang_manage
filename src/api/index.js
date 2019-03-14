import axios from 'axios'

//设置请求的跟路径
const baseURL = "https://api.qyshang.com"
axios.defaults.baseURL = baseURL

// 请求拦截器,给所有的请求加上token
 axios.interceptors.request.use(function(config) {
      // 取出localStorage中存储的token值
    //  let token = localStorage.getItem('mytoken')
     // 设置到请求头中 Access-Token这个名字是后台规定的
        // config.headers['Access-Token'] = token
        config.headers['Content-type'] = 'application/json;charset=UTF-8'
        return config
 })


//获取上传凭证
export const upload = ()=>{
    return axios.post('/syscommon/getTCredential').then(res=>res.data)
}

//获取线路列表
export const getall = (pagenum,pagesize,delstate,publisher)=>{
    return axios.post(`/sysroute/getlist?pagenum=${pagenum}&pagesize=${pagesize}&delstate=${delstate}&publisher=${publisher}`).then(res=>res.data)
}

//添加线路
export const add = (addRouteDTO)=>{
    return axios.post('/sysroute/add',addRouteDTO).then(res=>res.data)
}
//获取线路总数
export const getcount = (delstate,publisher)=>{
    return axios.post(`/sysroute/getcount?delstate=${delstate}&publisher=${publisher}`).then(res=>res.data)
}
//修改线路状态
export const chstate = (routeid,delstate)=>{
  return axios.post(`/sysroute/state?routeid=${routeid}&delstate=${delstate}`).then(res=>res.data)
}

//相册
export const getimglist = (routeid)=>{
    return axios.post(`sysrouteimg/getimglist?routeid=${routeid}`).then(res=>res.data)
}
//删除相册
export const delimglist = (routeimgid)=>{
  return axios.post(`/sysrouteimg/delimg?routeimgid=${routeimgid}`).then(res=>res.data)
}

//增加相册
export const creimglist = (routeid,img)=>{
  return axios.post(`/sysrouteimg/addimg?routeid=${routeid}&img=${img}`).then(res=>res.data)
}

//获得详情
export const getinfo = (routeid)=>{
  return axios.post(`/sysrouteinfo/getinfo?routeid=${routeid}`).then(res=>res.data)
}

//增加详情
export const addinfo = (addinfolist)=>{
  return axios.post('/sysrouteinfo/add',addinfolist).then(res=>res.data)
}
//修改详情
export const upinfo = (upinfolist)=>{
  return axios.post('/sysrouteinfo/update',upinfolist).then(res=>res.data)
}

//删除单个详情
export const del = (routeinfoid)=>{
  return axios.post(`/sysrouteinfo/del?routeinfoid=${routeinfoid}`).then(res=>res.data)
}

//删除所有详情
export const delall = (routeid)=>{
  return axios.post(`/sysrouteinfo/delall?routeid=${routeid}`).then(res=>res.data)
}

//修改线路
export const update = (updateRouteDTO)=>{
    return axios.post('/sysroute/update',updateRouteDTO).then(res=>res.data)
}

//删除线路
export const delrouter = (routeid)=>{
  return axios.post(`/sysroute/delall?routeid=${routeid}`).then(res=>res.data)
}



//获取地点列表
export const getplace = (pagenum,pagesize)=>{
  return axios.post(`/sysplace/getlist?pagenum=${pagenum}&pagesize=${pagesize}`).then(res=>res.data)
}
//获取地点总数
export const getpcount = ()=>{
  return axios.post('/sysplace/getcount').then(res=>res.data)
}

//添加地点
export const addplace = (domestic,country,place,img,type)=>{
  return axios.post(`/sysplace/add?domestic=${domestic}&country=${country}&place=${place}&img=${img}&type=${type}`).then(res=>res.data)
}

//删除地点
export const delplace = (placeid)=>{
  return axios.post(`/sysplace/del?placeid=${placeid}`).then(res=>res.data)
}

//景点列表
export const getscen = (placeid)=>{
  return axios.post(`sysscenic/getlist?placeid=${placeid}`).then(res=>res.data)
}

//添加景点
export const addscen = (placeid,scenic)=>{
  return axios.post(`/sysscenic/add?placeid=${placeid}&scenic=${scenic}`).then(res=>res.data)
}

//删除景点
export const delscen = (scenicid)=>{
  return axios.post(`/sysscenic/del?scenicid=${scenicid}`).then(res=>res.data)
}

//获得预订单列表
export const getorder = (pagenum,pagesize)=>{
  return axios.post(`/sysadvanceorder/getlist?pagenum=${pagenum}&pagesize=${pagesize}`).then(res=>res.data)
}
//预订单总数
export const getocount = ()=>{
  return axios.post('/sysadvanceorder/getcount').then(res=>res.data)
}

//获取流程列表
export const getstep = (aoid)=>{
  return axios.post(`/sysprocess/getlist?aoid=${aoid}`).then(res=>res.data)
}

//增加流程
export const addstep = (aoid,step,content,person)=>{
  return axios.post(`/sysprocess/add?aoid=${aoid}&step=${step}&content=${content}&person=${person}`).then(res=>res.data)
}

//删除流程
export const delstep = (processid)=>{
  return axios.post(`/sysprocess/del?processid=${processid}`).then(res=>res.data)
}

//定制完成 绑定id
export const bindid = (aoid,routeid)=>{
  return axios.post(`/sysprocess/bindingroute?aoid=${aoid}&routeid=${routeid}`).then(res=>res.data)
}

//获取时间
export const gettime = (routeid)=>{
  return axios.post(`/sysroutetime/gettimelist?routeid=${routeid}`).then(res=>res.data)
}

//增加时间
export const addtime = (routeid,setouttime,enrollendtime,adultprice,childrenprice,explain)=>{
  return axios.post(`/sysroutetime/addtime?routeid=${routeid}&setouttime=${setouttime}&enrollendtime=${enrollendtime}&adultprice=${adultprice}&childrenprice=${childrenprice}&explain=${explain}`).then(res=>res.data)
}

//删除时间
export const deltime = (routetimeid)=>{
  return axios.post(`/sysroutetime/deltime?routetimeid=${routetimeid}`).then(res=>res.data)
}

//获取订单
export const getforder = (pagenum,pagesize)=>{
  return axios.post(`/sysorder/getlist?pagenum=${pagenum}&pagesize=${pagesize}`).then(res=>res.data)
}
//订单总数
export const getfocount = ()=>{
  return axios.post('/sysorder/getcount').then(res=>res.data)
}


// 订单人信息
export const getpeople = (orderid)=>{
  return axios.post(`/sysorder/getpeople?orderid=${orderid}`).then(res=>res.data)
}
//用户信息

export const queryuser = (userid)=>{
  return axios.post(`/sysuser/queryuser?userid=${userid}`).then(res=>res.data)
}
