<template>
  <div class="official">
    <div class="layui-btn-group demoTable">
      <button class="layui-btn" data-type="getCheckData" @click="addopen">添加线路</button>

      <!-- <button class="layui-btn" data-type="getCheckLength">获取选中数目</button>
      <button class="layui-btn" data-type="isAll">验证是否全选</button>-->
    </div>
    <div style="text-align:center; margin:1% auto 0">
      <el-select v-model="typevalue" @change="typechange" style="width: 6.2%;">
        <el-option value="全部"></el-option>
        <el-option v-if="upvalue!=='不拼团'" value="官方"></el-option>
        <el-option value="定制"></el-option>
      </el-select>
      <el-select v-model="upvalue" @change="upchange" style="width: 6.2%;">
        <el-option value="全部"></el-option>
        <el-option value="上架"></el-option>
        <el-option value="禁止报名"></el-option>
        <el-option value="下架"></el-option>
        <el-option v-if="typevalue!=='官方'" value="不拼团"></el-option>
      </el-select>
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
            <th>id</th>
            <th>名称</th>
            <th>封面</th>
            <th>图片数</th>
            <th>热度</th>
            <th>价格</th>
            <th>来源</th>
            <th>状态</th>
            <th>上传时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in getdata" :key="index">
            <td>{{item.routeid}}</td>
            <td>{{item.title}}</td>
            <td>
              <img style="height: 60px;width: auto;" :src="item.positionimg" alt>
            </td>
            <td>{{item.imgnum}}</td>
            <!-- <td><el-rate v-model="item.cbscore" disabled></el-rate></td> -->
            <td>{{item.hots}}</td>
            <td>{{item.price}}</td>
            <td>{{item.publisher==1?'官方':'定制'}}</td>
            <td>{{item.delstate==0?'上架':(item.delstate==1?'禁止报名':(item.delstate==99?'下架':'不拼团'))}}</td>
            <td>{{item.ctime}}</td>
            <td>
              <a class="layui-btn layui-btn-xs" @click="cpedit(item)">编辑</a>
              <a class="layui-btn layui-btn-danger layui-btn-xs" @click="delr(item.routeid)">删除</a>
              <a class="layui-btn layui-btn-primary layui-btn-xs" @click="cpimg(item.routeid)">查看相册</a>
              <a
                class="layui-btn layui-btn-primary layui-btn-xs"
                @click="lookinfo(item.routeid)"
              >预览详情</a>
              <a class="layui-btn layui-btn-primary layui-btn-xs" @click="cpinfo(item.routeid)">修改详情</a>
              <a
                class="layui-btn layui-btn-normal layui-btn-xs"
                @click="ctime(item.routeid,item.title)"
              >线路时间</a>
              <a
                class="layui-btn layui-btn-warm layui-btn-xs"
                @click="statusC(item.routeid,item.delstate,item.title,item.publisher)"
              >状态操作</a>
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
      title="添加线路"
      id="el_add_box"
      :visible.sync="addDialogFormVisible"
      :before-close="closeDialog"
      :modal-append-to-body="false"
    >
      <el-form :model="addForm" label-width="80px" :rules="rules" ref="addForm">
        <el-form-item label="名称" prop="rtitle">
          <el-input v-model="addForm.rtitle" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="封面" prop="rimg">
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
        <el-form-item label="热度" prop="rhot">
          <div class="block">
            <el-input v-model.number="addForm.rhot"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="价格" prop="rprice">
          <div class="block">
            <el-input v-model.number="addForm.rprice"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="明细" prop="rexpensedetail">
          <div>
            <el-input
              type="textarea"
              :autosize="{ minRows: 6, maxRows: 4}"
              v-model="addForm.rexpensedetail"
            ></el-input>
          </div>
        </el-form-item>
        <el-form-item label="发布来源" prop="rpublisher">
          <div class="block">
            <el-input v-model.number="addForm.rpublisher"></el-input>
            <span>官方：1；定制：2</span>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer dialog-footer_add">
        <el-button @click="addcancel">取 消</el-button>
        <el-button type="primary" @click="addSubmit('addForm')">提 交</el-button>
      </div>
    </el-dialog>
    <!-- //相册 -->
    <el-dialog
      :title="infocook.cbname"
      class="info"
      :visible.sync="imgmenu"
      :modal-append-to-body="false"
    >
      <el-row>
        <el-col :span="24">
          <div class="grid-content bg-purple-dark">
            <div class="cbimg" v-for="(item,index) in imageUrl" :key="index">
              <img :src="item.img" alt>
              <el-button
                type="danger"
                class="el-icon-close2"
                size="mini"
                icon="el-icon-delete"
                circle
                @click="delimglist(item.routeimgid,index)"
              ></el-button>
            </div>
            <el-upload
              class="cbimg"
              action
              drag
              :before-upload="beforeup2"
              multiple
              :show-file-list="false"
              list-type="picture-card"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 修改状态 -->
    <el-dialog
      :title="statustitle"
      class="info infowid"
      :visible.sync="statusM"
      :modal-append-to-body="false"
    >
      <el-row style="margin-top: 6%;text-align:center;" type="flex" justify="center">
        <el-col :span="24">
          <el-radio v-model="radioS" :label="0">上架</el-radio>
          <el-radio v-model="radioS" :label="1">禁止报名</el-radio>
          <el-radio v-model="radioS" :label="99">下架</el-radio>
          <el-radio v-if="Spublisher==2" v-model="radioS" :label="100">不拼团</el-radio>

          <el-button
            style="margin: 10% auto 0;display:block;"
            size="mini"
            type="danger"
            @click="changeSta"
          >修改</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- //修改详情 -->
    <el-dialog
      :title="infocook.cbname"
      class="info12"
      :visible.sync="infomenu"
      :modal-append-to-body="false"
    >
      <el-row :gutter="70">
        <el-col :span="12">
          <div class="grid-content12 bg-purple-dark">
            <div
              class="cbimg12"
              v-for="(item,index) in info"
              :key="index"
              v-dragging="{ item: item, list: info, group: 'info' }"
            >
              <img v-show="item.type==1" :src="item.content" alt>
              <pre v-show="item.type==2">{{item.content}}</pre>
              <!-- <div class="el-icon-close3">{{index+1}}</div> -->
              <el-button type="danger" class="el-icon-close3" size="mini" circle>{{index+1}}</el-button>
              <el-button
                type="danger"
                class="el-icon-close1"
                size="mini"
                icon="el-icon-delete"
                circle
                @click="del(item.routeinfoid)"
              ></el-button>
              <!-- <i class="el-icon-close" ></i> -->
            </div>
          </div>
        </el-col>
        <el-col :span="12" style="position: relative;">
          <div class="upcontent">
            <el-button class="upcontent_but" type="danger" @click="delall">删除全部内容</el-button>
            <p>增加一个图片或者文字</p>
            <el-upload
              class="breviaryimg upcontentImg"
              action
              drag
              multiple
              :before-upload="beforeUpload"
              :show-file-list="false"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-input type="textarea" :autosize="{ minRows: 6, maxRows: 4}" v-model="infotext"></el-input>
            <el-button-group>
              <el-button type="primary" @click="uptext">插入文字</el-button>
              <el-button type="primary" icon="el-icon-refresh" @click="retext"></el-button>
            </el-button-group>
          </div>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer dialog-footer_add">
        <el-button @click="addcancel1">取消</el-button>
        <el-button type="primary" @click="addSubmit1">提交修改</el-button>
      </div>
    </el-dialog>
    <!-- //预览详情 -->
    <el-dialog
      :title="infocook.cbname"
      class="info12"
      :visible.sync="infomenu1"
      :modal-append-to-body="false"
    >
      <el-row type="flex" justify="center" style="background:#383a4c;">
        <el-col :span="12">
          <div class="grid-content12 bg-purple-dark">
            <div
              class="cbimg12"
              v-for="(item,index) in info"
              :key="index"
              style="text-align:center;color:#fff;"
            >
              <img v-show="item.type==1" :src="item.content" alt>
              <pre v-show="item.type==2">{{item.content}}</pre>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 修改线路 -->
    <el-dialog
      title="修改线路"
      id="el-box"
      :visible.sync="editrecipe"
      :before-close="cancel"
      :modal-append-to-body="false"
    >
      <el-form :model="infocook" label-width="80px">
        <el-form-item label="路线名称" prop="rtitle">
          <el-input v-model="infocook.title" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="封面" prop="rimg">
          <el-upload
            class="breviaryimg"
            action
            drag
            :before-upload="beforeUpload3"
            :show-file-list="false"
          >
            <img v-if="infocook" :src="infocook.positionimg">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="热度" prop="rhot">
          <div class="block">
            <el-input v-model="infocook.hots"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="价格" prop="rprice">
          <div class="block">
            <el-input v-model="infocook.price"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="明细" prop="rexpensedetail">
          <div>
            <el-input
              type="textarea"
              :autosize="{ minRows: 6, maxRows: 4}"
              v-model="infocook.expensedetail"
            ></el-input>
          </div>
        </el-form-item>
        <el-form-item label="发布来源" prop="rpublisher">
          <div class="block">
            <el-input v-model="infocook.publisher"></el-input>
            <span>官方：1；定制：2</span>
          </div>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer dialog-footer_edit">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="editSubmit">提交</el-button>
      </div>
    </el-dialog>

    <!-- //时间 -->
    <el-dialog
      :title="timertitle"
      class="info rtime"
      :visible.sync="timemenu"
      :modal-append-to-body="false"
      :before-close="closetime"
    >
      <el-form label-width="80px" class="demo-ruleForm">
        <el-form-item label="设置时间" prop="name">
          <div class="block" style="display:inline-block;">
            <span class="demonstration">出发时间</span>
            <el-date-picker v-model="time1" type="datetime" placeholder="选择日期时间"></el-date-picker>
          </div>
          <div class="block" style="display:inline-block;margin: 0 15%">
            <span class="demonstration">报名截止时间</span>
            <el-date-picker v-model="time2" type="datetime" placeholder="选择日期时间"></el-date-picker>
          </div>
          <!-- <el-button size="mini" type="danger" @click="addti">添加</el-button> -->
        </el-form-item>
        <el-form-item label="设置价格" prop="name">
          <div class="block" style="display:inline-block;">
            <span class="demonstration">成人价格</span>
            <el-input v-model="aprice"></el-input>
          </div>
          <div class="block" style="display:inline-block;margin: 0 0 0 5%">
            <span class="demonstration">儿童价格</span>
            <el-input v-model="cprice"></el-input>
          </div>
          <div class="block" style="display:inline-block;margin: 0 5%">
            <span class="demonstration">描述</span>
            <el-input v-model="pexplain"></el-input>
          </div>
          <el-button size="mini" type="danger" @click="addti">添加</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="时间id">
          <template slot-scope="scope">
            <!-- <i class="el-icon-time"></i> -->
            <span>{{ scope.row.routetimeid }}</span>
          </template>
        </el-table-column>
        <el-table-column label="出发时间">
          <template slot-scope="scope">
            <!-- <i class="el-icon-time"></i> -->
            <span>{{ scope.row.setouttime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="截止时间">
          <template slot-scope="scope">
            <!-- <i class="el-icon-time"></i> -->
            <span>{{scope.row.enrollendtime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="成人价格">
          <template slot-scope="scope">
            <!-- <i class="el-icon-time"></i> -->
            <span>{{scope.row.adultprice}}</span>
          </template>
        </el-table-column>
        <el-table-column label="儿童价格">
          <template slot-scope="scope">
            <!-- <i class="el-icon-time"></i> -->
            <span>{{scope.row.childrenprice}}</span>
          </template>
        </el-table-column>
        <el-table-column label="价格描述">
          <template slot-scope="scope">
            <!-- <i class="el-icon-time"></i> -->
            <span>{{scope.row.explain}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="Deletetime(scope.row.routetimeid)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import * as COS from "cos-js-sdk-v5";
import md5 from "js-md5";
import {
  upload,
  getall,
  add,
  getimglist,
  getinfo,
  update,
  getcount,
  delimglist,
  creimglist,
  del,
  delall,
  addinfo,
  upinfo,
  delrouter,
  gettime,
  addtime,
  deltime,
  chstate,
} from "@/api";

export default {
  inject: ["reload"],
  data() {
    return {
      typevalue: "全部", //类型选项
      Spublisher: "", //半段定制拼团
      upvalue: "上架", //上架选项
      radioS: "", //状态选项
      statusid: "", // 状态id
      statustitle: "", //状态名称
      a: 0,
      time1: "",
      time2: "",
      pexplain: "",
      aprice: "",
      cprice: "",
      domain: "", //详情列表
      clientHeight: "", //获取屏幕总高度
      scrolleditObj: "", //div元素滚动的区域
      scrolladdObj: "",
      scrollTop: "", //div到头部的距离
      scrollHeight: "", //滚动条的总高度
      addDialogFormVisible: false, //添加模态窗
      imgmenu: false, //查看模态窗
      infomenu: false,
      infomenu1: false,
      timemenu: false,
      statusM: false,
      editrecipe: false, //修改模态窗
      options: [], //流派
      upkey: "", //上传
      uploadToken: "", //图片名字
      cos: "", //实例
      url: "", //默认图
      breviaryUrl: "", //增加图
      rUrl: "", //编辑图
      imgList: "", //相册图
      // EditbreviaryUrl:'',
      imageUrl: [], //相册
      infoUrl: "", // 详情图
      infotext: "", //详情文字
      rid: "", //相册线路id
      rinfoid: "", //详情线路id
      timerid: "", //时间线路id
      timertitle: "", //时间线路名称
      info: "", //详情
      rinfoshu: "", //详情长度
      drlist: "", //详情顺序列表
      imgVisible: false,
      filelist: [], //上传列表
      suffix: "", //图片后缀
      tableData: [], //时间
      delstate: -1, //是否上架
      publisher: 0, //来源
      addForm: {
        rtitle: "",
        rimg: "",
        rhot: "",
        rprice: "",
        rexpensedetail: "",
        rpublisher: ""
      },
      strtag: "", //切割好的标签
      strimg: "", //切割好的路径
      isup: 1, //标记
      infocook: [], //存储单个获取线路
      rules: {
        rtitle: [
          {
            required: true,
            message: "线路名称不能为空",
            trigger: "blur"
          }
        ],
        rhot: [
          {
            required: true,
            message: "热度不能为空",
            trigger: "blur"
          },
          { type: "number", message: "请输入正确的热度" }
        ],
        rprice: [
          {
            required: true,
            message: "价格不能为空",
            trigger: "blur"
          },
          { type: "number", message: "请输入正确的价格" }
        ],
        rimg: [
          {
            required: true,
            message: "封面不能为空"
          }
        ],
        rexpensedetail: [
          {
            required: true,
            message: "明细不能为空"
          }
        ],
        rpublisher: [
          {
            required: true,
            message: "来源不能为空"
          },
          { type: "number", message: "请输入正确来源" }
        ]
      },
      getdata: [],
      total: this.present + 1, //总页数
      // currentPage2: 3,  //分页
      sizes: 10, //每页多少
      present: 1, //当前页
      type: ""
    };
  },
  mounted() {
    //添加屏幕滚动事件
    window.addEventListener("scroll", this.handleScroll, true);

    if (window.sessionStorage.length !== 0) {
      window.sessionStorage.present
        ? (this.present = parseInt(window.sessionStorage.present))
        : 1;
      window.sessionStorage.sizes
        ? (this.sizes = parseInt(window.sessionStorage.sizes))
        : 10;
    } else {
      this.present = 1;
      this.sizes = 10;
    }

    this.getnewdata();

    //页面加载 拉去token

    // upload().then(res => {console.log(res.data.credentials.tmpSecretId)});
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

    this.$dragging.$on("dragend", () => {
      // console.log(value.item);
      // console.log(value.list);
      // console.log(value.otherData);
    });
  },
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
    //改变来源
    typechange(val) {
        console.log(val);
      if (val == "官方") {
        this.publisher = 1;
        this.present = 1;
        this.getnewdata();
      } else if (val == "定制") {
        this.publisher = 2;
        this.present = 1;
        this.getnewdata();
      } else if (val == "全部") {
        this.publisher = 0;
        this.present = 1;
        this.getnewdata();
      }
    },
    //改变上下架
    upchange(val) {
      console.log(val);
      if (val == "上架") {
        this.delstate = 0;
        this.present = 1;
        this.getnewdata();
      } else if (val == "禁止报名") {
        this.delstate = 1;
        this.present = 1;
        this.getnewdata();
      } else if (val == "下架") {
        this.delstate = 99;
        this.present = 1;
        this.getnewdata();
      } else if (val == "不拼团") {
        this.delstate = 100;
        this.present = 1;
        this.getnewdata();
      }else if (val == "全部") {
        this.delstate = -1;
        this.present = 1;
        this.getnewdata();
      }
    },
    //获取列表
    getnewdata() {
      //  线路总数
      getcount(this.delstate,this.publisher).then(res => {
        if (res.code === 200) {
          this.total = res.data;
        }
      });
      //获取线路
      getall(this.present, this.sizes, this.delstate,this.publisher).then(res => {
        if (res.code === 200) {
          this.getdata = res.data;
          console.log(res);
        } else {
          this.getdata = "";
          console.log(0);
        }
      });

      //流派
      // faction(5).then(res=>{
      //     this.options = res.data
      // })
    },

    //  分页
    handleSizeChange(val) {
      this.sizes = val;
      getall(this.present, val, this.delstate).then(res => {
        if (res.code === 200) {
          this.getdata = res.data;
          window.sessionStorage.setItem("sizes", val);
        }
      });
    },
    handleCurrentChange(val) {
      this.present = val;
      getall(val, this.sizes, this.delstate).then(res => {
        if (res.code === 200) {
          this.getdata = res.data;
          window.sessionStorage.setItem("present", val);
        }
      });
    },

    closeDialog(done) {
      this.addDialogFormVisible = false;
      this.breviaryUrl = "";
      (this.addForm.rtitle = ""),
        (this.addForm.rimg = ""),
        // This.addForm.cbhumbimg,
        (this.addForm.rhot = ""),
        (this.addForm.rprice = ""),
        (this.addForm.rexpensedetail = ""),
        (this.addForm.rpublisher = "");
    },
    //手动上传
    submitUpload() {
      this.$refs.upload.submit();
    },
    addopen() {
      this.addDialogFormVisible = true;
      this.imageUrl = [];
    },
    //删除相册
    delimglist(routeimgid, index) {
      delimglist(routeimgid).then(res => {
        console.log(res.data);
      });
      this.imageUrl.splice(index, 1);
    },

    //添加文字详情
    uptext() {
      let that = this;
      let arr = [
        {
          content: this.infotext,
          routeid: this.rinfoid,
          sequence: this.rinfoshu,
          type: 2
        }
      ];
      console.log(this.infotext);
      let addinfolist = JSON.parse(JSON.stringify(arr));
      addinfo(addinfolist).then(res => {
        if (res.code == 200) {
          that.infotext = "";
          that.cpinfo(that.rinfoid);
        }
      });
    },
    //重置文字详情
    retext() {
      this.infotext = "";
    },

    //删除单个详情
    del(index) {
      let that = this;
      del(index).then(res => {
        console.log(res);
        if (res.code == 200) {
          getinfo(that.rinfoid).then(res => {
            if (res.code == 200) {
              that.info = res.data;
              that.rinfoshu = res.data.length + 1;
              let res1 = res.data;
              console.log(1);
              let arr = [];
              let i = 0;
              res1.forEach(v => {
                i = i + 1;
                arr.push({
                  content: v.content,
                  routeInfoid: v.routeinfoid,
                  sequence: i,
                  type: v.type
                });
              });
              let upinfolist = JSON.parse(JSON.stringify(arr));
              // console.log(upinfolist);
              upinfo(upinfolist).then(res => {
                console.log(2);
              });
            } else if (res.code == 500) {
              that.info = "";
            }
          });

          // that.cpinfo(that.rinfoid).then(res => {
          //       console.log(1)
          // });
        }
      });
    },
    //删除全部详情
    delall() {
      let that = this;
      delall(this.rinfoid).then(res => {
        console.log(res);
        if (res.code == 200) {
          that.cpinfo(that.rinfoid);
        }
      });
    },

    //添加详情顺序修改
    addSubmit1() {
      let drlist = this.info;
      console.log(drlist);
      let arr = [];
      let i = 0;
      drlist.forEach(v => {
        i = i + 1;
        arr.push({
          content: v.content,
          routeInfoid: v.routeinfoid,
          sequence: i,
          type: v.type
        });
      });
      let upinfolist = JSON.parse(JSON.stringify(arr));
      upinfo(upinfolist).then(res => {
        console.log(res);
        if (res.code == 200) {
          this.infomenu = false;
        }
      });
    },

    //添加线路
    addSubmit(formName) {
      //  this.isup =0
      var This = this;
      // let str = "";
      let str = {
        expensedetail: This.addForm.rexpensedetail,
        hots: This.addForm.rhot,
        positionimg: This.addForm.rimg,
        price: This.addForm.rprice,
        publisher: This.addForm.rpublisher,
        title: This.addForm.rtitle
      };

      let addRouteDTO = JSON.parse(JSON.stringify(str));

      if (this.addForm.rpublisher == 1 || this.addForm.rpublisher == 2) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            add(addRouteDTO).then(res => {
              console.log(res);
              if (res.code == 200) {
                This.addDialogFormVisible = false; // console.log(this.scrolleaddObj.scrollTop);
                This.reload();
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
                  message: "线路已存在或上传错误!",
                  type: "error",
                  duration: 1000,
                  center: true
                });
              }
            });
          } else {
            This.$message({
              message: "请补全线路信息",
              type: "warning",
              duration: 1000,
              center: true
            });
          }
        });
      } else {
        This.$message({
          message: "来源只能为1或2",
          type: "warning",
          duration: 1000,
          center: true
        });
      }
    },

    addcancel1() {
      //  console.log(this.info)
      this.infomenu = false;
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
    //查看相册
    cpimg(index) {
      this.imageUrl = "";
      this.imgmenu = true;
      this.rid = index;
      getimglist(index).then(res => {
        //  this.infocook = res.data
        // let strurl= res.data.cbimg.split("$")
        // strurl.forEach(v=>{
        //     this.imageUrl.push({url:v})
        // })
        this.imageUrl = res.data;
        console.log(res.data);
      });
    },
    //预览详情
    lookinfo(index) {
      this.info = "";
      this.infomenu1 = true;
      getinfo(index).then(res => {
        if (res.code == 200) {
          this.info = res.data;

          console.log(res);
        } else {
          this.info = "";
        }
      });
    },
    //查看详情
    cpinfo(index) {
      this.info = "";
      this.infomenu = true;
      this.rinfoid = index;
      getinfo(index).then(res => {
        if (res.code == 200) {
          this.info = res.data;
          this.rinfoshu = res.data.length + 1;
          console.log(res);
        } else {
          this.info = "";
          this.rinfoshu = "";
        }
      });
      // console.log(rinfoshu);
    },
    //删除路线
    delr(index) {
      let routerid = index;
      console.log(routerid);
      this.$confirm("此操作将删除该线路所有图片详情, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delrouter(routerid).then(res => {
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

    //编辑线路
    cpedit(index) {
      // document.body.scrollTop = 0;
      // // Firefox
      // document.documentElement.scrollTop = 0;
      // // Safari
      // window.pageYOffset = 0;
      this.editrecipe = true;

      this.infocook = index; //存储

      console.log(this.infocook);
      //    console.log(res.data.factionsid)
    },
    //编辑后提交
    editSubmit() {
      console.log(this.infocook.expensedetail);

      let str = {
        expensedetail: this.infocook.expensedetail,
        hots: this.infocook.hots,
        positionimg: this.infocook.positionimg,
        price: this.infocook.price,
        publisher: this.infocook.publisher,
        routeid: this.infocook.routeid,
        title: this.infocook.title
      };

      let updateRouteDTO = JSON.parse(JSON.stringify(str));

      update(updateRouteDTO).then(res => {
        if (res.code == 200) {
          this.getnewdata();
          this.editrecipe = false;
          this.scrolleditObj.scrollTop = 0;
        }
      });

      // location.reload
      // this.reload()
    },
    //取消编辑
    cancel() {
      this.getnewdata();
      this.editrecipe = false;
      this.scrolleditObj.scrollTop = 0;
    },

    beforeUpload(file) {
      if (this.a > 1000) {
        this.a = 0;
      }
      let that = this;
      let newdate = Date.parse(new Date());
      newdate = md5(newdate.toString());
      let suffix = file.name;
      let arr = suffix.split(".");
      this.suffix = arr[arr.length - 1];
      this.a++;
      let url = `route/img/${newdate}${this.a}.${this.suffix}`;

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
          that.infoUrl = urlImg;
          console.log(data.Location);

          setTimeout(() => {
            let str = [
              {
                content: urlImg,
                routeid: that.rinfoid,
                sequence: that.rinfoshu,
                type: 1
              }
            ];
            let addinfolist = JSON.parse(JSON.stringify(str));
            console.log(addinfolist);
            addinfo(addinfolist).then(res => {
              console.log(res);
              if (res.code == 200) {
                that.cpinfo(that.rinfoid);
                //  that.imageUrl.unshift({routeid: that.rid,img: that.imgList})
              }
            });
          }, 0);
        }
      );
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
          that.rimg = urlImg;
          that.infocook.positionimg = urlImg;
          that.infoUrl = urlImg;
          console.log(data.Location);
        }
      );
      // console.log(this.uploadToken)
      // return this.uploadToken;
    },

    beforeup2(file) {
      if (this.a > 1000) {
        this.a = 0;
      }
      let that = this;
      let newdate = Date.parse(new Date());
      newdate = md5(newdate.toString());
      let suffix = file.name;
      let arr = suffix.split(".");
      this.suffix = arr[arr.length - 1];
      this.a++;
      let url = `route/img/${newdate}${this.a}.${this.suffix}`;

      this.uploadToken = url;

      var Bucket = "onjuly-1257989321";
      var Region = "ap-guangzhou";

      if (!file) return;
      // var body = file;
      // console.log(file);

      // 分片上传文件
      this.cos.sliceUploadFile(
        {
          Bucket: Bucket,
          Region: Region,
          Key: url,
          Body: file
        },
        function(err, data) {
          console.log(data);
          let urlImg = `http://${data.Location}`;
          that.imgList = urlImg;
          console.log(urlImg);

          // setTimeout(() => {
          creimglist(that.rid, urlImg).then(res => {
            console.log(res);
            if (res.code == 200) {
              that.cpimg(that.rid);
              // that.a=0
              //  that.imageUrl.unshift({routeid: that.rid,img: that.imgList})
            }
          });
          // }, 100);
        }
      );

      // if(this.imageUrl== '') {
      //     this.imageUrl = []
      // }
    },

    ctime(index, title) {
      this.timerid = index;
      this.timertitle = title;
      this.timemenu = true;
      gettime(index).then(res => {
        if (res.code == 200) {
          this.tableData = res.data;
        }
      });
    },
    trtime(time) {
      var date = new Date(time);
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      var Minutes = date.getMinutes();
      var Hours = date.getHours();
      var Seconds = date.getSeconds();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      if (Minutes >= 0 && Minutes <= 9) {
        Minutes = "0" + Minutes;
      }
      if (Hours >= 0 && Hours <= 9) {
        Hours = "0" + Hours;
      }
      if (Seconds >= 0 && Seconds <= 9) {
        Seconds = "0" + Seconds;
      }
      var getdate =
        year +
        "-" +
        month +
        "-" +
        strDate +
        " " +
        Hours +
        ":" +
        Minutes +
        ":" +
        Seconds;
      return getdate;
    },
    addti() {
      if (this.time1 && this.time2) {
        if (this.aprice && this.cprice && this.pexplain) {
          addtime(
            this.timerid,
            this.trtime(this.time1),
            this.trtime(this.time2),
            this.aprice,
            this.cprice,
            this.pexplain
          ).then(res => {
            console.log(res);
            if (res.code == 200) {
              gettime(this.timerid).then(res => {
                if (res.code == 200) {
                  this.tableData = res.data;
                }
              });
            } else {
              this.$message({
                message: "请填写正确信息",
                type: "warning",
                duration: 1000,
                center: true
              });
            }
          });
        } else {
          this.$message({
            message: "请补全价格信息",
            type: "warning",
            duration: 1000,
            center: true
          });
        }
      } else {
        this.$message({
          message: "请补全时间",
          type: "warning",
          duration: 1000,
          center: true
        });
      }
    },
    Deletetime(index) {
      deltime(index).then(res => {
        if (res.code == 200) {
          gettime(this.timerid).then(res => {
            if (res.code == 200) {
              this.tableData = res.data;
            } else {
              this.tableData = [];
            }
          });
        }
      });
    },
    closetime() {
      this.timemenu = false;
      this.tableData = [];
      this.timerid = "";
      this.time1 = "";
      this.time2 = "";
      this.aprice = "";
      this.cprice = "";
      this.pexplain = "";
    },
    statusC(id, delstate, title, publisher) {
      this.Spublisher = publisher;
      this.statusM = true;
      console.log(delstate);
      this.radioS = delstate;
      this.statusid = id;
      this.statustitle = title;
    },
    changeSta() {
      chstate(this.statusid, this.radioS).then(res => {
        if (res.code == 200) {
          this.statusM = false;
          this.getnewdata();
        }
      });
    }
  },
  created() {
    // window.scrollTo(0,0);
  }
};
</script>

<style lang="scss">
.official {
  .breviaryimg {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 100px;
    height: 100px;
    text-align: center;
    &:hover {
      border-color: #409eff;
    }
    .el-icon-plus {
      font-size: 25px;
      width: 100px;
      display: block;
      line-height: 100px;
      color: #8c939d;
    }
    img {
      margin-right: 300px;
      width: 100px;
      height: 100px;
    }
  }

  .subimg {
    .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .el-upload:hover {
      border-color: #409eff;
    }
    .el-icon-plus {
      font-size: 28px;
      color: #8c939d;
      width: 400px;
      height: 250px;
      line-height: 80px;
      text-align: center;
      display: table-cell;
      vertical-align: middle;
      background: white;
    }
    img {
      width: 150px;
      height: 80px;
      display: block;
    }
  }
  .Editbreviaryimg {
    width: 100px;
    height: 100px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .defaultImg {
    /*width: 400px;*/
    /*height: 250px;*/
    /*display: flex;*/
    margin-bottom: 5px;
    flex-direction: row-reverse;

    /*overflow: hidden;*/
    img {
      width: 100%;
      height: 100%;
      display: inline-block;

      position: relative;
    }
  }
  .Editdefaultimg {
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
    }
  }

  // add样式
  .el-form {
    .el-form-item__label {
      text-align: left;
    }
    .block {
      width: 150px;
    }
  }

  .infoimg {
    //    height: 800px;
    width: 400px;
    .imgs {
      display: flex;
      margin-bottom: 5px;
      flex-direction: row-reverse;
      img {
        width: 100%;
        height: 100%;
        position: relative;
      }
      .el-icon-close {
        position: absolute;
        top: 0;
        right: 0;
        font-size: 35px;
      }
    }
    .el-upload {
      position: relative;
      width: 400px;
      height: 250px;
      .el-icon-plus {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
  .subup {
    position: absolute;
    top: 0;
    left: 150px;
  }

  .text {
    width: 380px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .el-dialog__footer {
    margin-top: -50px;
  }
  .cbtag.el-input {
    width: 150px;
  }
  .el-icon-circle-plus {
    cursor: pointer;
    transform: translateY(5px);
    font-size: 30px;
  }

  .rtime {
    /deep/.el-dialog {
      width: 60%;
    }
  }
  .info {
    .el-dialog__title {
      left: 50%;
      position: absolute;
      transform: translateX(-52%);
    }

    .grid-content {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      // padding: 0 5%;
      /deep/.el-upload--picture-card {
        width: 100%;
        height: 100%;
      }
      /deep/.el-upload-dragger {
        // cursor: pointer;
        // border: 1px dashed #d9d9d9;

        width: 100%;
        height: 100%;
      }
      .cbimg {
        width: 17% !important;
        margin: 2% 20px 0;
        position: relative;
        overflow: hidden;
        .el-icon-close2 {
          // width: 2%;
          // height: 2%;
          // font-size: 12px;
          position: absolute;
          top: 0;
          right: 0%;
        }
        img {
          width: 100%;
        }
      }
    }
  }
}
.upcontent {
  position: fixed !important;
  top: 25%;
  right: 27%;
  .upcontent_but {
    margin-bottom: 25%;
  }
  p {
    font-size: 28px;
    margin-bottom: 10%;
  }
  .upcontentImg {
    margin-bottom: 10%;
  }
}
.info12 {
  /deep/.el-dialog__body {
    min-height: 100vh;
    padding-bottom: 15%;
  }
}
.grid-content12 {
  .cbimg12 {
    position: relative;
    margin-top: 8%;
  }
  .el-icon-close1 {
    position: absolute;
    top: 0%;
    right: -10%;
  }
  .el-icon-close3 {
    width: 30px;
    height: 30px;
    // border-radius: 50%;
    // background-color: red;
    // text-align: center;
    position: absolute;
    top: 0;
    left: -10%;
  }
}

.cbimg12 {
  img {
    width: 100%;
  }
}
//   提示 框
.el-message {
  top: 50% !important;
}
.dialog-footer {
  display: block;
}
.dialog-footer_edit,
.dialog-footer_add {
  display: block;
  position: fixed;
  height: 70px;
  bottom: 20px;
  right: 16.5%;
}
.infowid {
  /deep/.el-dialog {
    width: 30%;
  }
}
</style>
