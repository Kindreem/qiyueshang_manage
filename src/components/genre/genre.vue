<template>
  <div class="official">
    <div class="layui-btn-group demoTable">
      <button class="layui-btn" data-type="getCheckData" @click="addopen">添加地点</button>
      <!-- <button class="layui-btn" data-type="getCheckLength">获取选中数目</button>
      <button class="layui-btn" data-type="isAll">验证是否全选</button>-->
    </div>

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
            <th>地点id</th>
            <th>地点名称</th>
            <th>图片</th>
            <th>境内外</th>
            <th>国家</th>
            <th>类型</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in getdata" :key="index">
            <td>{{item.placeid}}</td>
            <td>{{item.place}}</td>
            <td>
              <img style="height: 60px;width: auto;" :src="item.img" alt>
            </td>
            <td>{{item.domestic?'国内':'国外'}}</td>
            <td>{{item.country}}</td>
            <!-- <td><el-rate v-model="item.cbscore" disabled></el-rate></td> -->
            <td>{{item.type==1?'选座岛':(item.type==2?'寻座城':(item.type==3?'走条路':'学门艺'))}}</td>

            <td>
              <!-- <a class="layui-btn layui-btn-xs" @click="cpedit(item)">编辑</a> -->
              <a class="layui-btn layui-btn-danger layui-btn-xs" @click="delr(item.placeid)">删除</a>
              <a class="layui-btn layui-btn-primary layui-btn-xs" @click="cpimg(item.placeid)">查看景点</a>
              <!-- <a class="layui-btn layui-btn-primary layui-btn-xs" @click="cpinfo(item.routeid)">修改详情</a> -->
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

    <!-- 添加地点 -->
    <el-dialog
      title="添加地点"
      id="el_add_box"
      :visible.sync="addDialogFormVisible"
      :before-close="closeDialog"
      :modal-append-to-body="false"
    >
      <el-form :model="addForm" label-width="80px" :rules="rules" ref="addForm">
        <el-form-item label="地点名称" prop="rtitle">
          <el-input v-model="addForm.rtitle" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="图片" prop="rimg">
          <el-upload
            class="breviaryimg"
            action
            drag
            :before-upload="beforeUpload3"
            :show-file-list="false"
          >
            <img v-if="breviaryUrl" :src="breviaryUrl">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="境内外" prop="rhot">
          <div class="block">
            <el-input v-model.number="addForm.rhot"></el-input>
            <span>国外:0 国内：1</span>
          </div>
        </el-form-item>
        <el-form-item label="国家" prop="rprice">
          <div class="block">
            <el-input v-model="addForm.rprice"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="类型" prop="rpublisher">
          <div class="block">
            <el-input v-model.number="addForm.rpublisher"></el-input>
            <span>选座岛:1 寻座城：2 走条路:3 学门艺:4</span>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer dialog-footer_add">
        <el-button @click="addcancel">取 消</el-button>
        <el-button type="primary" @click="addSubmit('addForm')">提 交</el-button>
      </div>
    </el-dialog>

    <!-- //景点 -->
    <el-dialog :title="'地点'+rid" class="info" :visible.sync="imgmenu" :modal-append-to-body="false">
      <el-form label-width="80px" class="demo-ruleForm">
        <el-form-item label="景点名称" prop="name">
          <el-input v-model="scename" style="width: 50%;"></el-input>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<el-button size="mini" type="danger" @click="adds(rid)">添加</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData3" style="width: 100%">
        <el-table-column label="景点id" width="180">
          <template slot-scope="scope">
            <!-- <i class="el-icon-time"></i> -->
            <span>{{ scope.row.scenicid }}</span>
          </template>
        </el-table-column>
        <el-table-column label="景点名称">
          <template slot-scope="scope">
            <!-- <i class="el-icon-time"></i> -->
            <span>{{ scope.row.scenic }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="Delete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import {
  getplace,
  addplace,
  upload,
  delplace,
  getscen,
  addscen,
  delscen,
  getpcount
} from "../../api";
import * as COS from "cos-js-sdk-v5";
import md5 from "js-md5";
export default {
  name: "genre",
  data() {
    return {
      total: this.present + 1, //总页数
      // currentPage2: 3,  //分页
      sizes: 10, //每页多少
      present: 1, //当前页
      getdata: "",
      addDialogFormVisible: false, //添加模态窗
      imgmenu: false, //景点模态窗
      breviaryUrl: "", //增加图
      cos: "", //实例
      tableData3: [],
      rid: "", //地点id
      scename: "", //景点名称
      addForm: {
        rtitle: "",
        rimg: "",
        rhot: "",
        rprice: "",
        rpublisher: ""
      },
      rules: {
        rtitle: [
          {
            required: true,
            message: "地点名称不能为空",
            trigger: "blur"
          }
        ],
        rhot: [
          {
            required: true,
            message: "境内外不能为空",
            trigger: "blur"
          },
          { type: "number", message: "请输入正确的境内外" }
        ],
        rprice: [
          {
            required: true,
            message: "国家不能为空",
            trigger: "blur"
          }
        ],
        rimg: [
          {
            required: true,
            message: "封面不能为空"
          }
        ],
        rpublisher: [
          {
            required: true,
            message: "类型不能为空",
            trigger: "blur"
          },
          { type: "number", message: "请输入正确类型" }
        ]
      }
    };
  },
  created() {
    //添加屏幕滚动事件
    window.addEventListener("scroll", this.handleScroll, true);

    if (window.sessionStorage.length !== 0) {
      window.sessionStorage.present1
        ? (this.present = parseInt(window.sessionStorage.present1))
        : 1;
      window.sessionStorage.sizes1
        ? (this.sizes = parseInt(window.sessionStorage.sizes1))
        : 10;
    } else {
      this.present = 1;
      this.sizes = 10;
    }

    this.getnewdata();

    // 初始化实例
    this.cos = new COS({
      getAuthorization: function(options, callback) {
        console.log(options);
        // 异步获取临时密钥
        upload().then(res => {
          callback({
            TmpSecretId: res.data.credentials.tmpSecretId,
            TmpSecretKey: res.data.credentials.tmpSecretKey,
            XCosSecurityToken: res.data.credentials.sessionToken,
            ExpiredTime: res.data.expiredTime
          });
        });
      }
    });
    setInterval(() => {
      this.cos;
    }, 1200000);
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
    //获取地点列表
    getnewdata() {
      getpcount().then(res => {
        if (res.code === 200) {
          this.total = res.data;
          console.log(res);
        }
      });

      getplace(this.present, this.sizes).then(res => {
        if (res.code === 200) {
          this.getdata = res.data;
          console.log(res);
        }else {
         this.getdata =''
        }
      });
    },

    beforeUpload3(file) {
      let that = this;
      let newdate = Date.parse(new Date());
      newdate = md5(newdate.toString());
      let suffix = file.name;
      let arr = suffix.split(".");
      this.suffix = arr[arr.length - 1];

      let url = `route/img/${newdate}.${this.suffix}`;

      this.uploadToken = url;

      var Bucket = "onjuly-1257989321";
      var Region = "ap-guangzhou";
      // console.log(err, data)

      if (!file) return;
      var body = file;
      console.log(file);
      // 分片上传文件
      this.cos.sliceUploadFile(
        {
          Bucket: Bucket,
          Region: Region,
          Key: url,
          Body: body
        },
        function(err, data) {
          let urlImg = `http://${data.Location}`;
          that.breviaryUrl = urlImg;
          that.addForm.rimg = urlImg;
          that.infocook.positionimg = urlImg;
          that.infoUrl = urlImg;
          console.log(data.Location);
        }
      );
      // console.log(this.uploadToken)
      // return this.uploadToken;
    },

    //  分页
    handleSizeChange(val) {
      this.sizes = val;
      getplace(this.present, val).then(res => {
        if (res.code === 200) {
          this.getdata = res.data;
          window.sessionStorage.setItem("sizes1", val);
        }
      });
    },
    handleCurrentChange(val) {
      this.present = val;
      getplace(this.present, this.sizes).then(res => {
        if (res.code === 200) {
          this.getdata = res.data;
          window.sessionStorage.setItem("present1", val);
        }
      });
    },

    addopen() {
      this.addDialogFormVisible = true;
    },

    //添加地点
    addSubmit(formName) {
      var This = this;

      if (
        this.addForm.rpublisher == 1 ||
        this.addForm.rpublisher == 2 ||
        this.addForm.rpublisher == 3 ||
        this.addForm.rpublisher == 4
      ) {
        if (this.addForm.rhot == 0 || this.addForm.rhot == 1) {
          this.$refs[formName].validate(valid => {
            if (valid) {
              addplace(
                This.addForm.rhot,
                This.addForm.rprice,
                This.addForm.rtitle,
                This.addForm.rimg,
                This.addForm.rpublisher
              ).then(res => {
                console.log(res);
                if (res.code == 200) {
                  This.addDialogFormVisible = false; // console.log(this.scrolleaddObj.scrollTop);
                  // This.reload();
                  // getall(this.present,this.sizes).then(res=>{
                  console.log(res.data);
                  // })
                  This.addForm.rtitle = "";
                  This.addForm.rimg = "";
                  This.addForm.rhot = "";
                  This.addForm.rprice = "";
                  This.addForm.rpublisher = "";
                  This.breviaryUrl = "";
                  //刷新获取官方菜谱及 总条数 流派
                  This.getnewdata();
                  This.scrolleaddObj.scrollTop = 0;
                } else if (res.code == 500) {
                  This.$message({
                    message: "地点已存在或上传错误!",
                    type: "error",
                    duration: 1000,
                    center: true
                  });
                }
              });
            } else {
              This.$message({
                message: "请补全地点信息",
                type: "warning",
                duration: 1000,
                center: true
              });
            }
          });
        } else {
          This.$message({
            message: "国内外只能为0或1",
            type: "warning",
            duration: 1000,
            center: true
          });
        }
      } else {
        This.$message({
          message: "类型只能为1、2、3或4",
          type: "warning",
          duration: 1000,
          center: true
        });
      }
    },

    //添加线路取消按钮
    addcancel() {
      this.addDialogFormVisible = false;
      this.addForm.rtitle = "";
      this.addForm.rimg = "";
      this.addForm.rhot = "";
      this.addForm.rprice = "";
      this.addForm.rpublisher = "";
      this.breviaryUrl = "";

      console.log(this.scrolleaddObj.scrollTop);
      this.scrolleaddObj.scrollTop = 0;
    },
    closeDialog() {
      this.addDialogFormVisible = false;
      this.addForm.rtitle = "";
      this.addForm.rimg = "";
      this.addForm.rhot = "";
      this.addForm.rprice = "";
      this.addForm.rpublisher = "";
      this.breviaryUrl = "";

      console.log(this.scrolleaddObj.scrollTop);
      this.scrolleaddObj.scrollTop = 0;
    },

    //删除地点
    delr(index) {
      let placeid = index;
      console.log(placeid);
      this.$confirm("此操作将删除该地点所有景点详情, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delplace(placeid).then(res => {
            if (res.code == 200) {
              console.log(res);
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getnewdata();
            } else {
              this.$message({
                type: "fail",
                message: "删除失败"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    //查看景点
    cpimg(index) {
      let that = this;
      this.tableData3 = [];
      this.imgmenu = true;
      this.rid = index;
      getscen(index).then(res => {
        if (res.code == 200) {
          that.tableData3 = res.data;
          // console.log(that.tableData3);
          console.log(that.tableData3);
        }
      });
    },

    //刪除景點
    Delete(index) {
      let list = index;
      let that = this;
      delscen(list.scenicid).then(res => {
        if (res.code == 200) {
          console.log(res.data);
          getscen(list.placeid).then(res => {
            if (res.code == 200) {
              that.tableData3 = res.data;

              console.log(that.tableData3);
            }else {
              that.tableData3=''
            }
          });
        }
      });
    },

    //添加景点
    adds(index) {
      let that = this;
      let placeid = index;
      let scename = this.scename;
      addscen(index, scename).then(res => {
        if (res.code == 200) {
          if (that.scename !== "") {
            getscen(placeid).then(res => {
              if (res.code == 200) {
                that.tableData3 = res.data;

                console.log(that.tableData3);
              }
            });
          } else {
            that.$message({
              message: "景点名称不能为空",
              type: "warning",
              duration: 1000,
              center: true
            });
          }
        }
      });
    }
  }
};
</script>

<style >
.lbe {
  display: block;
  text-align-last: left;
  line-height: 100%;
}
</style>
