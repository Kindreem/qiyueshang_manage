<template>
  <div class="official">
    <div class="layui-form">
      <table class="layui-table">
        <!-- <colgroup>
            <col width="120">
            <col width="100">
            <col width="150">
            <col width="380">
            <col>
        </colgroup>-->
        <thead>
          <tr>
            <th>订单id</th>
            <th>用户id</th>
            <th>订单号</th>
            <th>微信单号</th>
            <th>线路id</th>
            <th>标题</th>
            <th>封面</th>
            <th>人数</th>
            <th>总价</th>
            <th>出发时间</th>
            <th>状态</th>
            <th>生成时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in getdata" :key="index">
            <td>{{item.orderid}}</td>
            <td>
              <el-popover
                placement="top-start"
                width="200"
                trigger="click"
                @show="showinfo(item.userid)"
              >
                <div class="userinfo">
                  <div>
                    <img :src="userinfo.avatarurl" alt>
                  </div>
                  <div>
                    <h2>{{userinfo.nickname}}</h2>
                  </div>
                  <div>
                    <p>({{userinfo.gender==0?'未知':(userinfo.gender==1?'男':'女')}})</p>
                  </div>
                  <div>
                    <p>{{userinfo.telnum}}</p>
                  </div>
                </div>
                <p slot="reference">{{item.userid}}</p>
              </el-popover>
            </td>
            <td>{{item.outtradeno}}</td>
            <td>{{item.transactionid}}</td>
            <td>{{item.routeid}}</td>
            <td>{{item.title}}</td>
            <td>
              <img style="height: 60px;width: auto;" :src="item.routeimg">
            </td>
            <td>{{item.peoplenum}}</td>
            <td>{{item.totalfee}}</td>
            <td>{{item.setouttime}}</td>
            <td>{{item.status?'已支付':'未支付'}}</td>
            <td>{{item.ctime}}</td>
            <td>
              <a class="layui-btn layui-btn-danger layui-btn-xs" @click="lookinfo(item)">查看详情</a>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="present"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="sizes"
          layout="total,sizes, prev, pager, next"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <!-- //详情 -->
    <el-dialog title class="info" :visible.sync="infomenu" :modal-append-to-body="false">
      <el-row>
        <el-col :span="24">
          <el-container>
            <el-header style="background: #eee;color:#000;text-align:center;display: flex;justify-content: center; align-items: center">订单详情</el-header>
            <el-main>
              <div class='main'>
                <p>订单号：{{info.outtradeno}}</p>
                <p>微信单号：{{info.transactionid}}</p>
                <p>线路id：{{info.routeid}}</p>
                <p>名称：{{info.title}}</p>
                <p>报名人id：{{info.userid}}</p>
                <p>人数：{{info.peoplenum}}</p>
                <p style="color:red;">总价：{{info.totalfee}}</p>
                <p>出发时间：{{info.setouttime}}</p>
                <p style="color:red;">状态：{{info.status?'已支付':'未支付'}}</p>
                <p>下单时间：{{info.ctime}}</p>
              </div>
              <div></div>
            </el-main>
            <el-header style="background: #eee;color:#000;text-align:center;display: flex;justify-content: center; align-items: center">报名人信息</el-header>
            <el-main>
              <div class='main1' v-for="(item,index) in people" :key="index">
                <p>姓名：{{item.name}}</p>
                <p>电话号码：{{item.phonenumber}}</p>
                <p>身份证：{{item.idcard}}</p>
              </div>
              <div></div>
            </el-main>
          </el-container>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getforder, getfocount,getpeople,queryuser } from "../../api";
export default {
  data() {
    return {
      total: this.present + 1, //总页数
      // currentPage2: 3,  //分页
      sizes: 10, //每页多少
      present: 1, //当前页
      getdata: "", //预订单列表
      infomenu: false,
      info: '',
      people: '',
      userinfo: "",
    };
  },
  created() {
    //添加屏幕滚动事件
    window.addEventListener("scroll", this.handleScroll, true);

    if (window.sessionStorage.length !== 0) {
      window.sessionStorage.present3
        ? (this.present = parseInt(window.sessionStorage.present3))
        : 1;
      window.sessionStorage.sizes3
        ? (this.sizes = parseInt(window.sessionStorage.sizes3))
        : 10;
    } else {
      this.present = 1;
      this.sizes = 10;
    }

    this.getnewdata();
  },
  methods: {
    //获取订单列表
    getnewdata() {
      getfocount().then(res => {
        if (res.code === 200) {
          this.total = res.data;
          console.log(res);
        }
      });

      getforder(this.present, this.sizes).then(res => {
        if (res.code === 200) {
          this.getdata = res.data;
          console.log(res);
        }
      });
    },
    lookinfo(item) {
      this.infomenu = true;
      this.info = item
      getpeople(item.orderid).then(res=>{
           if(res.code==200) {
              this.people=res.data
           }
    })

    },
    showinfo(id) {
       this.userinfo = ''
      console.log(id);
      queryuser(id).then(res => {
        if (res.code == 200) {
          this.userinfo = res.data;
        }
      });
    }
  }
};
</script>
<style lang="scss">
.main {
 display: flex;
 justify-content: space-between;
 flex-wrap: wrap;
 width: 100%;
 p {
   width: 40%;
   margin-bottom: 2%;
 }
}
.main1 {
 display: flex;
 justify-content: space-between;
 align-items: center;
 flex-wrap: wrap;
 width: 90%;
 margin: 0 auto;
 p {
   width: 33%;
   margin-bottom: 2%;
  //  border-bottom: 1px solid #666;
   margin-bottom: 3%;
 }
}
</style>


