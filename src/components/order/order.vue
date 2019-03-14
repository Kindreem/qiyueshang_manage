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
            <th>预订单id</th>
            <th>用户id</th>
            <th>目的地</th>
            <th>出发地</th>
            <th>人数</th>
            <th>行程天数</th>
            <th>出发时间</th>
            <th>是否拼团</th>
            <th>生成时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in getdata" :key="index">
            <td>{{item.aoid}}</td>
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
            <td>{{item.destination+' '+item.touristspot}}</td>
            <td>{{item.departure}}</td>
            <td>{{item.number}}</td>
            <td>{{item.traveldays}}</td>
            <td>{{item.departuretime}}</td>
            <td>{{item.grouppermissions?'是':'否'}}</td>
            <td>{{item.ctime}}</td>
            <td>
              <a class="layui-btn layui-btn-primary layui-btn-xs" @click="cstep(item.aoid)">查看流程</a>
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

    <el-dialog
      :title="'预订单'+aoid"
      class="info"
      :visible.sync="imgmenu"
      :modal-append-to-body="false"
      :before-close="closeDialog"
    >
      <el-row :gutter="70">
        <el-col :span="12">
          <el-steps
            direction="vertical"
            align-center
            :active="stepdata.length"
            style="margin: 6% 0 5% 10%;"
          >
            <el-step
              icon="el-icon-delete"
              v-for="(item,index) in stepdata"
              :key="index"
              :title="'步骤'+item.step"
              :description="item.content"
              @click.native="dels(item)"
            ></el-step>
          </el-steps>
        </el-col>
        <el-col :span="12" style="position: relative;">
          <div style="margin-top: 6%;">
            <el-form :model="addForm" label-width="80px" :rules="rules" ref="addForm">
              <el-form-item label="步骤数" prop="step">
                <div class="block1">
                  <el-input-number v-model="addForm.step" :min="1" :max="1000"></el-input-number>
                </div>
              </el-form-item>
              <el-form-item label="内容" prop="content">
                <div class="block1">
                  <el-input
                    :autosize="{ minRows: 2, maxRows: 4}"
                    type="textarea"
                    v-model="addForm.content"
                  ></el-input>
                </div>
              </el-form-item>
              <el-form-item label="处理人" prop="person">
                <div class="block1">
                  <el-input v-model="addForm.person"></el-input>
                </div>
              </el-form-item>
              <el-button
                style="margin:2% 0 0 10%;"
                size="mini"
                type="danger"
                @click="adds('addForm')"
              >添加</el-button>
            </el-form>
          </div>

          <div style="margin-top: 15%;">
            <h1 style="margin-bottom: 5%;">线路规划已完成</h1>
            <el-form :model="addForm1" label-width="80px" :rules="rules1" ref="addForm1">
              <el-form-item label="步骤数" prop="step1">
                <div class="block1">
                  <el-input-number v-model="addForm1.step" :min="1" :max="1000"></el-input-number>
                </div>
              </el-form-item>
              <el-form-item label="线路id" prop="rid">
                <div class="block">
                  <el-input v-model.number="addForm1.rid"></el-input>
                </div>
              </el-form-item>
              <el-form-item label="处理人" prop="person1">
                <div class="block1">
                  <el-input v-model="addForm1.person1"></el-input>
                </div>
              </el-form-item>
              <el-button
                style="margin:2% 0 0 10%;"
                size="mini"
                type="danger"
                @click="adds1('addForm1')"
              >添加</el-button>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  getorder,
  getstep,
  addstep,
  delstep,
  bindid,
  getocount,
  queryuser
} from "../../api";

export default {
  name: "foods",
  data() {
    return {
      userinfo: "",
      stepcontent: 0,
      total: this.present + 1, //总页数
      // currentPage2: 3,  //分页
      sizes: 10, //每页多少
      present: 1, //当前页
      getdata: "", //预订单列表
      imgmenu: false,
      aoid: "",
      stepdata: "",
      addForm: {
        step: 2,
        content: "",
        person: ""
      },
      addForm1: {
        step: 2,
        rid: "",
        person: ""
      },
      rules: {
        content: [
          {
            required: true,
            message: "内容不能为空",
            trigger: "blur"
          }
        ],
        person: [
          {
            required: true,
            message: "处理人不能为空",
            trigger: "blur"
          }
        ]
      },
      rules1: {
        rid: [
          {
            required: true,
            message: "线路id不能为空",
            trigger: "blur"
          },
          { type: "number", message: "请输入正确id" }
        ],
        person1: [
          {
            required: true,
            message: "处理人不能为空",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    //添加屏幕滚动事件
    window.addEventListener("scroll", this.handleScroll, true);

    if (window.sessionStorage.length !== 0) {
      window.sessionStorage.present2
        ? (this.present = parseInt(window.sessionStorage.present2))
        : 1;
      window.sessionStorage.sizes2
        ? (this.sizes = parseInt(window.sessionStorage.sizes2))
        : 10;
    } else {
      this.present = 1;
      this.sizes = 10;
    }

    this.getnewdata();
  },
  computed: {},
  methods: {
    //屏幕滚动
    handleScroll() {
      // this.scroll =  window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      // console.log(this.scroll)

      // 设备可见屏幕高度
      this.clientHeight =
        document.documentElement.clientHeight || document.body.clientHeight;
      // console.log(clientHeight);

      // 滚动区域
      this.scrolleditObj = document.getElementById("el-box");

      this.scrolleaddObj = document.getElementById("el_add_box");
      // console.log(this.scrolleditObj.scrollTop);
      // console.log(this.scrolleaddObj.scrollTop);

      // div 到头部的距离
      // this.scrollTop = this.scrolleditObj.scrollTop||0;
      // console.log(this.scrollTop);

      // 滚动条的总高度
      // this.scrollHeight = this.scrolleditObj.scrollHeight;
      // console.log(this.scrollHeight);
    },
    //  分页
    handleSizeChange(val) {
      this.sizes = val;
      getorder(this.present, val).then(res => {
        if (res.code === 200) {
          this.getdata = res.data;
          window.sessionStorage.setItem("sizes2", val);
        }
      });
    },
    handleCurrentChange(val) {
      this.present = val;
      getorder(this.present, this.sizes).then(res => {
        if (res.code === 200) {
          this.getdata = res.data;
          window.sessionStorage.setItem("present2", val);
        }
      });
    },

    //获取预订单列表
    getnewdata() {
      getocount().then(res => {
        if (res.code === 200) {
          this.total = res.data;
          console.log(res);
        }
      });

      getorder(this.present, this.sizes).then(res => {
        if (res.code === 200) {
          this.getdata = res.data;
          console.log(res);
        }
      });
    },

    cstep(aoid) {
      this.stepdata = "";
      this.aoid = aoid;
      this.imgmenu = true;
      getstep(aoid).then(res => {
        if (res.code == 200) {
          console.log(res.data);
          this.stepdata = res.data;
        }
      });
    },

    adds(formName) {
      let This = this;
      console.log(this.addForm);
      this.$refs[formName].validate(valid => {
        if (valid) {
          addstep(
            This.aoid,
            This.addForm.step,
            This.addForm.content,
            This.addForm.person
          ).then(res => {
            console.log(res);
            if (res.code == 200) {
              // getall(this.present,this.sizes).then(res=>{
              console.log(res.data);
              // })
              This.addForm.step = This.addForm.step + 1;
              This.addForm.content = "";
              //刷新获取官方菜谱及 总条数 流派
              // This.getnewdata();
              getstep(This.aoid).then(res => {
                if (res.code == 200) {
                  console.log(res.data);
                  This.stepdata = res.data;
                }
              });
              // This.scrolleaddObj.scrollTop = 0;
            } else if (res.code == 500) {
              This.$message({
                message: "流程已存在或上传错误!",
                type: "error",
                duration: 1000,
                center: true
              });
            }
          });
        } else {
          This.$message({
            message: "请补全添加信息",
            type: "warning",
            duration: 1000,
            center: true
          });
        }
      });
    },
    adds1(formName) {
      let This = this;
      console.log(this.addForm);
      this.stepcontent = 0;
      getstep(This.aoid).then(res => {
        if (res.code == 200) {
          console.log(res.data);
          res.data.forEach(val => {
            if (val.content == "线路规划已完成！请查看") {
              This.stepcontent = 1;
            }
          });
          this.$refs[formName].validate(valid => {
            if (valid) {
              if (This.stepcontent == 0) {
                bindid(This.aoid, This.addForm1.rid).then(res => {
                  console.log(res);
                  if (res.code == 200) {
                    addstep(
                      This.aoid,
                      This.addForm1.step,
                      "线路规划已完成！请查看",
                      This.addForm1.person1
                    ).then(res => {
                      console.log(res);
                      if (res.code == 200) {
                        // getall(this.present,this.sizes).then(res=>{
                        console.log(res.data);
                        // })
                        This.addForm1.rid = "";
                        This.stepcontent = 1;
                        // This.getnewdata();
                        getstep(This.aoid).then(res => {
                          if (res.code == 200) {
                            console.log(res.data);
                            This.stepdata = res.data;
                          }
                        });
                        // This.scrolleaddObj.scrollTop = 0;
                      } else if (res.code == 500) {
                        This.$message({
                          message: "流程已存在或上传错误!",
                          type: "error",
                          duration: 1000,
                          center: true
                        });
                      }
                    });
                  }
                });
              } else {
                This.$message({
                  message: "请先删除绑定订单步骤，再添加",
                  type: "warning",
                  duration: 1000,
                  center: true
                });
              }
            } else {
              This.$message({
                message: "请补全添加信息",
                type: "warning",
                duration: 1000,
                center: true
              });
            }
          });
        }
      });
    },

    closeDialog() {
      this.imgmenu = false;
      this.addForm.step = 2;
      this.addForm.content = "";
      this.addForm.person = "";
      this.addForm1.step = 2;
      this.addForm1.rid = "";
      this.addForm1.person1 = "";
    },

    dels(item) {
      let that = this;
      let processid = item.processid;
      let aoid = item.aoid;
      delstep(processid).then(res => {
        if (res.code == 200) {
          getstep(aoid).then(res => {
            if (res.code == 200) {
              console.log(res.data);
              that.stepdata = res.data;
            } else {
              that.stepdata = "";
            }
          });
        }
      });
    },
    showinfo(id) {
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
.block1 {
  width: 90%;
}

.userinfo {
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  > div {
    width: 100%;
    text-align: center;
    img {
      width: 40%;
      border-radius: 10%;
    }
  }
}
</style>
