<template>
  <el-main>
    <el-tabs type="border-card" style="height: 600px;">
      <el-tab-pane>
        <span slot="label">
          <i class="el-icon-help"></i>基本信息
        </span>
        <el-row :gutter="20">
          <el-col :span="2">
            <el-tag type="success" class="tag-property">项目ID</el-tag>
          </el-col>
          <el-col :span="10">{{ basicInfo.projectId }}</el-col>
          <el-col :span="2">
            <el-tag class="tag-property">采用技术</el-tag>
          </el-col>
          <el-col :span="10">{{ basicInfo.technology }}</el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="2">
            <el-tag type="success" class="tag-property">项目名称</el-tag>
          </el-col>
          <el-col :span="10">{{ basicInfo.projectName }}</el-col>

          <el-col :span="2">
            <el-tag class="tag-property">主要功能</el-tag>
          </el-col>
          <el-col :span="10">{{ basicInfo.mainFunctions }}</el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="2">
            <el-tag type="warning" class="tag-property">项目上级</el-tag>
          </el-col>
          <el-col :span="10">{{ basicInfo.projectBossId }}</el-col>
          <el-col :span="2">
            <el-tag class="tag-property">业务领域</el-tag>
          </el-col>
          <el-col :span="10">{{ basicInfo.businessDomain }}</el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="2">
            <el-tag type="warning" class="tag-property">项目周期</el-tag>
          </el-col>
          <el-col :span="10">{{ basicInfo.expStartDate }} 至 {{ basicInfo.expEndDate }}</el-col>
          <el-col :span="2">
            <el-tag class="tag-property">主要里程碑</el-tag>
          </el-col>
          <el-col :span="10">{{ basicInfo.milestone }}</el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="2">
            <el-tag type="warning" class="tag-property">客户ID</el-tag>
          </el-col>
          <el-col :span="10">{{ basicInfo.clientId }}</el-col>
          <div class="grid-content">
            <el-button
              v-show="(projectBasicState == '驳回立项') && (roleInProject == '项目经理')"
              round
              plain
              type="danger"
              @click="deleteProject()"
            >
              <i class="el-icon-delete"></i>删除项目
            </el-button>
            <el-button
              v-show="((projectBasicState == '同意立项') || (projectBasicState == '进行中') || (projectBasicState == '已交付')) && (roleInProject == '项目经理')"
              round
              @click="preEditProject()"
            >
              <i class="el-icon-edit"></i>点击此处编辑
            </el-button>
          </div>

          <!-- 编辑项目信息对话框 -->
          <el-dialog
            title="编辑项目基本信息"
            :visible.sync="editProjectVisible"
            @close="editProjectDialogClosed"
          >
            <el-form
              :model="basicInfo"
              label-width="100px"
              label-position="left"
              :rules="editDialogFormRules"
              ref="editDialogFormRef"
            >
              <el-form-item label="项目ID" prop="projectId">
                <el-input
                  :placeholder="projectBasicId"
                  v-model="projectBasicId"
                  :disabled="true"
                  style="width: 217px;"
                ></el-input>
              </el-form-item>
              <el-form-item label="项目名称" prop="projectName">
                <el-input
                  :placeholder="basicInfo.projectName"
                  v-model="basicInfo.projectName"
                  :disabled="true"
                  style="width: 217px;"
                ></el-input>
              </el-form-item>
              <el-form-item label="客户ID" prop="clientId">
                <el-select
                  v-model="basicInfo.clientId"
                  clearable
                  placeholder="请选择客户ID"
                  style="width: 217px;"
                >
                  <el-option v-for="item in clientIds" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="项目周期">
                <el-col :span="11">
                  <el-form-item prop="expStartDate">
                    <el-date-picker
                      type="date"
                      :placeholder="basicInfo.expStartDate"
                      v-model="basicInfo.expStartDate"
                      style="width: 100%;"
                      value-format="yyyy-MM-dd"
                      :picker-options="startDatePicker"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col class="line" :span="1" style="text-align:center">-</el-col>
                <el-col :span="11">
                  <el-form-item prop="expEndDate">
                    <el-date-picker
                      type="date"
                      :placeholder="basicInfo.expEndDate"
                      v-model="basicInfo.expEndDate"
                      style="width: 100%;"
                      value-format="yyyy-MM-dd"
                      :picker-options="endDatePicker"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-form-item>
              <el-form-item label="采用技术">
                <el-input
                  type="textarea"
                  :placeholder="basicInfo.technology"
                  v-model="basicInfo.technology"
                  autocomplete="off"
                  style="width:400px;"
                ></el-input>
              </el-form-item>
              <el-form-item label="业务领域">
                <el-input
                  type="textarea"
                  :placeholder="basicInfo.businessDomain"
                  v-model="basicInfo.businessDomain"
                  autocomplete="off"
                  style="width:400px;"
                ></el-input>
              </el-form-item>
              <el-form-item label="主要功能">
                <el-input
                  type="textarea"
                  placeholder="basicInfo.mainFunctions"
                  v-model="basicInfo.mainFunctions"
                  autocomplete="off"
                  style="width:400px;"
                ></el-input>
              </el-form-item>
              <el-form-item label="主要里程碑">
                <el-input
                  type="textarea"
                  :placeholder="basicInfo.milestone"
                  v-model="basicInfo.milestone"
                  autocomplete="off"
                  style="width:400px;"
                ></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="submitEditProjectForm()">确认修改</el-button>
              <el-button @click="editProjectVisible = false">取消</el-button>
            </div>
          </el-dialog>
        </el-row>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label">
          <i class="el-icon-table-lamp"></i>项目状态
          <span>：{{ projectBasicState }}</span>
        </span>
        <el-tag v-if="basicInfo.state == '同意立项'">同意立项</el-tag>
        <el-tag v-if="basicInfo.state == '进行中'">进行中</el-tag>
        <el-tag type="success" v-else-if="basicInfo.state == '申请立项'">申请立项</el-tag>
        <el-tag type="info" v-else-if="basicInfo.state == '已结束'">已结束</el-tag>
        <el-tag type="warning" v-else-if="basicInfo.state == '已归档'">已归档</el-tag>
        <el-tag type="warning" v-else-if="basicInfo.state == '申请归档'">申请归档</el-tag>
        <el-tag type="warning" v-else-if="basicInfo.state == '已交付'">已交付</el-tag>
        <el-tag type="danger" v-else-if="basicInfo.state == '驳回立项'">驳回立项</el-tag>

        <el-button
          v-show="(roleInProject == '项目经理') && ((projectBasicState == '同意立项') || (projectBasicState == '进行中') || (projectBasicState == '已交付') || (projectBasicState == '已结束'))"
          size="small"
          icon="el-icon-magic-stick"
          @click="submitState()"
          plain
          round
          style="margin:0 10px;"
        >变更</el-button>
        <el-tag v-if="nextStateOpt == '进行中'">进行中</el-tag>
        <el-tag type="info" v-else-if="nextStateOpt == '已结束'">已结束</el-tag>
        <el-tag type="warning" v-else-if="nextStateOpt == '申请归档'">申请归档</el-tag>
        <el-tag type="warning" v-else-if="nextStateOpt == '已交付'">已交付</el-tag>

        <el-dialog title="请输入档案输出地址" :visible.sync="outLinkDialogVisible">
          <el-form>
            <el-form-item label="有效地址" label-width="80px" label-position="left">
              <el-input v-model="outputLink" autocomplete="off" label-position="left"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitOutputLink(outputLink)">确 定</el-button>
            <el-button @click="outLinkDialogVisible = false">取 消</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label">
          <i class="el-icon-coffee-cup"></i>功能列表
        </span>
        <el-row>
          <el-tree :data="funcsData" node-key="id" default-expand-all :expand-on-click-node="false">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
              <span style="margin-right: 15px;">
                <el-button
                  v-show="((projectBasicState == '同意立项') || (projectBasicState == '进行中') || (projectBasicState == '已交付')) && (roleInProject == '项目经理') && data.showAdd"
                  class="mini-btn-set"
                  type="success"
                  icon="el-icon-plus"
                  size="mini"
                  @click="appendSecFunc(data)"
                  circle
                  plain
                ></el-button>
                <el-button
                  v-show="((projectBasicState == '同意立项') || (projectBasicState == '进行中') || (projectBasicState == '已交付')) && (roleInProject == '项目经理')"
                  class="mini-btn-set"
                  type="info"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editFunc(data)"
                  circle
                  plain
                ></el-button>
                <el-button
                  v-show="((projectBasicState == '同意立项') || (projectBasicState == '进行中') || (projectBasicState == '已交付')) && (roleInProject == '项目经理')"
                  class="mini-btn-set"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeFunc(node, data)"
                  circle
                  plain
                ></el-button>
              </span>
              <el-dialog title="请输入添加的二级功能" :visible.sync="addSecFuncVisible">
                <el-input v-model="addSecFuncValue" class="input-set"></el-input>
                <div slot="footer" class="dialog-footer">
                  <el-button type="primary" @click="addTextFunc(addSecFuncValue)">确 定</el-button>
                  <el-button @click="addSecFuncVisible = false">取 消</el-button>
                </div>
              </el-dialog>
              <el-dialog title="请输入修改的功能" :visible.sync="editFuncVisible">
                <el-input v-model="editFuncValue" class="input-set" :placeholder="editFuncValue"></el-input>
                <div slot="footer" class="dialog-footer">
                  <el-button type="primary" @click="editTextFunc(editFuncValue)">确 定</el-button>
                  <el-button @click="editFuncVisible = false">取 消</el-button>
                </div>
              </el-dialog>
            </span>
          </el-tree>
          <el-dialog title="请输入添加的一级功能" :visible.sync="addPriFuncVisible">
            <el-input v-model="addPriFuncValue" class="input-set"></el-input>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="appendPriFunc(addPriFuncValue)">确 定</el-button>
              <el-button @click="addPriFuncVisible = false">取 消</el-button>
            </div>
          </el-dialog>
          <el-button
            v-show="((projectBasicState == '同意立项') || (projectBasicState == '进行中') || (projectBasicState == '已交付')) && (roleInProject == '项目经理')"
            class="mini-btn-set"
            type="success"
            icon="el-icon-circle-plus-outline"
            size="mini"
            @click="addPriFuncVisible=true"
            circle
            plain
          ></el-button>
        </el-row>

        <el-row class="btn-group-set">
          <el-upload
            ref="uploadExcel"
            action="/api/upload/function"
            accept=".xlsx, .xls"
            :headers="uploadHeaders"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :before-remove="beforeRemove"
            :limit="1"
            :on-exceed="handleExceed"
            :file-list="excelFileList"
            :show-file-list="isUpload"
          >
            <el-tooltip class="item" effect="dark" content="上传excel文件" placement="left">
              <el-button
                v-show="((projectBasicState == '同意立项') || (projectBasicState == '进行中') || (projectBasicState == '已交付')) && (roleInProject == '项目经理')"
                type="primary"
                size="medium"
                icon="el-icon-document-add"
                circle
                plain
              ></el-button>
            </el-tooltip>
          </el-upload>
          <el-tooltip class="item" effect="dark" content="下载为excel格式文件" placement="left">
            <el-button
              type="success"
              size="medium"
              icon="el-icon-download"
              @click="downloadExcel()"
              circle
              plain
            ></el-button>
          </el-tooltip>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </el-main>
</template>

<script>
import axios from "axios";
import qs from "qs";
import Cookie from "js-cookie";
import { mapState } from "vuex";

var id = 1;
export default {
  data() {
    const funcsData = [];
    return {
      funcsData: JSON.parse(JSON.stringify(funcsData)),
      basicInfo: {
        projectId: "",
        projectName: "",
        state: "",
        expStartDate: "",
        expEndDate: "",
        projectBossId: "",
        milestone: "",
        technology: "",
        businessDomain: "",
        mainFunctions: "",
        outputLink: "",
        gitAddress: "",
        fileSystemAddress: ""
      },
      uploadHeaders: {
        Authorization: "Bearer " + Cookie.get("token")
      },
      editDialogFormRules: {
        expStartDate: [
          {
            type: "string",
            message: "请选择开始时间",
            trigger: "change"
          }
        ],
        expEndDate: [
          {
            type: "string",
            message: "请选择结束时间",
            trigger: "change"
          }
        ]
      },
      startDatePicker: {
        disabledDate: time => {
          var endDateVal = this.basicInfo.expEndDate;
          if(endDateVal) {
            return time.getTime() > new Date(endDateVal).getTime();
          }
        }
      }, 
      endDatePicker: {
        disabledDate: time => {
          var startDateVal = this.basicInfo.expStartDate;
          if(startDateVal) {
            return (time.getTime() < new Date(startDateVal).getTime()-1*24*60*60*1000);
          }
        }
      },
      excelFileList: [],
      clientIds: [],
      editFuncValue: "",
      addPriFuncValue: "",
      addSecFuncValue: "",
      addSecFindPriId: 0,
      editFindId: 0,
      //editStateValue: "",
      nextStateOpt: "",
      outputLink: "",
      isUpload: true,
      editFuncVisible: false,
      addPriFuncVisible: false,
      addSecFuncVisible: false,
      editState: false,
      outLinkDialogVisible: false,
      editProjectVisible: false
    };
  },

  created() {
    this.getDetailInfo();
    this.getFuncList();
    this.getNextState();
  },

  computed: {
    ...mapState(["projectBasicId"]),
    ...mapState(["roleInProject"]),
    ...mapState(["projectBasicState"])
  },

  methods: {
    preEditProject() {
      this.editProjectVisible = true;
      axios.get("/api/client/ids").then(response => {
        if (response.data.code === 0) {
          console.log(response.data.data);
          this.clientIds = response.data.data.clientIds;
        } else {
          this.$message.error("获取可选客户ID失败！");
        }
      });
    },
    // 驳回立项状态下，删除项目信息
    deleteProject() {
      this.$confirm("确认删除项目信息？", "确认信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "danger",
        center: false
      }).then(() => {
        axios
          .delete("/api/deleteprojectinfo/" + this.projectBasicId)
          .then(response => {
            if (response.data.code === 0) {
              this.$message.success("删除成功！此项目已被清理！");
              this.$router.push("/home/projectlist");
            } else {
              this.$message.error("出错了！请稍后再试！");
            }
          });
      });
    },
    submitEditProjectForm() {
      console.log(this.basicInfo);
      this.basicInfo.expStartDate = this.dateFormat(
        this.basicInfo.expStartDate
      );
      this.basicInfo.expEndDate = this.dateFormat(this.basicInfo.expEndDate);
      this.$refs.editDialogFormRef.validate(async valid => {
        if (!valid) return;
        axios
          .post("/api/updateprojectinfo", qs.stringify(this.basicInfo))
          .then(response => {
            if (response.data.code === 0) {
              this.$message.success("修改项目信息成功！");
            } else {
              this.$message.error("修改项目信息失败！");
            }
            this.editProjectVisible = false;
            this.getDetailInfo();
          });
      });
    },
    dateFormat: function(originVal) {
      const dt = new Date(originVal);
      const y = dt.getFullYear();
      const m = (dt.getMonth() + 1 + "").padStart(2, "0");
      const d = (dt.getDate() + "").padStart(2, "0");
      return `${y}-${m}-${d}`;
    },
    appendPriFunc(addPriFuncValue) {
      var newPriFunc = {
        id: id++,
        label: addPriFuncValue,
        children: [],
        showAdd: true
      };
      this.funcsData.push(newPriFunc);
      this.addPriFuncValue = "";
      this.addPriFuncVisible = false;
      console.log(this.funcsData);
      this.packFunctionData();
      //this.getFuncList();
    },
    appendSecFunc(data) {
      this.addSecFuncVisible = true;
      this.addSecFindPriId = data.id;
      console.log(data.id);
    },
    editFunc(data) {
      this.editFuncVisible = true;
      this.editFindId = data.id;
      this.editFuncValue = data.label;
      console.log(data.id + " " + data.label);
    },
    addTextFunc(addSecFuncValue) {
      var newSecFunc = {
        id: id++,
        label: addSecFuncValue,
        children: [],
        showAdd: false
      };
      this.funcsData.forEach(traverseFunc => {
        if (traverseFunc.id === this.addSecFindPriId) {
          traverseFunc.children.push(newSecFunc);
        }
      });
      this.addSecFuncValue = "";
      this.addSecFindPriId = 0;
      this.addSecFuncVisible = false;
      console.log(this.funcsData);
      this.packFunctionData();
      //this.getFuncList();
    },
    // 向后台传数据
    // 数据封装
    packFunctionData() {
      var packedData = {
        projectId: this.projectBasicId,
        functions: []
      };
      this.funcsData.forEach(eachPriFunc => {
        var funcObj = {
          primaryFunction: eachPriFunc.label,
          secondaryFunction: []
        };
        eachPriFunc.children.forEach(eachSecFunc => {
          funcObj.secondaryFunction.push(eachSecFunc.label);
        });
        packedData.functions.push(funcObj);
      });
      console.log(packedData);
      axios
        .put("/api/function", JSON.stringify(packedData), {
          headers: {
            "Content-Type": "application/json;charset=UTF-8"
          }
        })
        .then(response => {
          console.log("success?");
        });
    },

    editTextFunc(editFuncValue) {
      for (var i = 0; i < this.funcsData.length; i++) {
        if (this.funcsData[i].id === this.editFindId) {
          this.funcsData[i].label = editFuncValue;
          break;
        } else {
          for (var j = 0; j < this.funcsData[i].children.length; j++) {
            if (this.funcsData[i].children[j].id === this.editFindId) {
              this.funcsData[i].children[j].label = editFuncValue;
              break;
            }
          }
        }
      }
      this.editFuncValue = "";
      this.editFindId = 0;
      this.editFuncVisible = false;
      console.log(this.funcsData);
      this.packFunctionData();
      //this.getFuncList();
    },
    removeFunc(node, data) {
      this.$confirm("确认删除" + data.label + "功能?", "确认信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "danger",
        center: false
      }).then(() => {
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        children.splice(index, 1);
        console.log(this.funcsData);
        this.packFunctionData();
        this.$message({
          type: "success",
          message: "删除成功!"
        });
      });
    },
    editProjectDialogClosed: function() {
      this.$refs.editDialogFormRef.resetFields();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`只可选择1个文件，请先移除已有文件`);
    },
    handleSuccess(response, file, fileList) {
      this.$message.success("上传文件成功！");
      this.isUpload = false;
      this.excelFileList = [];
      console.log(response.data);
      var updateObj = response.data;
      updateObj.projectId = this.projectBasicId;
      axios
        .put("/api/function", JSON.stringify(updateObj), {
          headers: {
            "Content-Type": "application/json;charset=UTF-8"
          }
        })
        .then(response => {
          if (response.code === 0) {
            console.log("success update");
          }
        });
      this.getFuncList();
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定放弃上传 ${file.name}？`);
    },
    getDetailInfo() {
      axios.get("/api/project_info/" + this.projectBasicId).then(response => {
        if (response.data.code === 0) {
          console.log(response.data.data);
          this.basicInfo = response.data.data;
          this.basicInfo.expStartDate = this.dateFormat(
            this.basicInfo.expStartDate
          );
          this.basicInfo.expEndDate = this.dateFormat(
            this.basicInfo.expEndDate
          );
          this.editStateValue = this.basicInfo.state;
        }
        console.log(this.roleInProject);
      });
    },
    // 获取下一个可变更状态
    getNextState() {
      axios.get("/api/getstate/" + this.projectBasicId).then(response => {
        if (response.data.code === 0) {
          this.nextStateOpt = response.data.data;
        } else {
          if (this.roleInProject == "项目经理") {
            console.log("无法获取该项目下一个可变更状态！");
          }
        }
      });
    },
    getFuncList() {
      axios.get("/api/function/" + this.projectBasicId).then(response => {
        if (response.data.code === 0) {
          console.log(response.data.data.functions);
          this.funcsData = [];
          var tempFuncs = response.data.data.functions;
          tempFuncs.forEach(eachPriFunc => {
            var newPrimaryItem = {
              id: id++,
              label: eachPriFunc.primaryFunction,
              children: [],
              showAdd: true
            };
            eachPriFunc.secondaryFunction.forEach(eachSecFunc => {
              var newSecondItem = {
                id: id++,
                label: eachSecFunc,
                children: [],
                showAdd: false
              };
              newPrimaryItem.children.push(newSecondItem);
            });
            this.funcsData.push(newPrimaryItem);
            //console.log(newPrimaryItem.showOpts)
          });
        }
      });
    },
    submitTextFunc() {
      this.$confirm("确认提交修改的主要功能？", "确认信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: false
      })
        .then(() => {
          this.basicInfo.mainFunctions = this.editFuncValue;
          console.log(this.basicInfo.mainFunctions);
          this.editFunc = false;
          this.$message({
            type: "success",
            message: "修改成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消提交"
          });
        });
    },

    submitOutputLink(outputLink) {
      axios
        .put(
          "/api/projectinfo/outputlink?projectId=" +
            this.projectBasicId +
            "&outputLink=" +
            outputLink
        )
        .then(response => {
          console.log(response);
          if (response.data.code === 0) {
            this.$message.success("添加归档链接成功！");
            axios
              .put(
                "/api/state",
                qs.stringify({
                  projectId: this.projectBasicId,
                  state: "申请归档"
                })
              )
              .then(response => {
                if (response.data.code === 0) {
                  this.basicInfo.state = "申请归档";
                  console.log(this.basicInfo.state);
                  this.projectBasicState = "申请归档";
                  this.$store.commit("setProjectBasicState", "申请归档");
                  this.nextStateOpt = "";
                  this.$message.success("已修改状态为" + this.basicInfo.state);
                  this.getNextState();
                } else {
                  this.$message.error("设置状态失败！");
                }
              });
          } else {
            this.$message.error("添加归档链接失败！");
          }
        });
      this.outLinkDialogVisible = false;
    },

    submitState() {
      if (this.nextStateOpt == "申请归档") {
        this.outLinkDialogVisible = true;
      } else {
        this.$confirm(
          "确认将状态修改为" + this.nextStateOpt + "?",
          "确认信息",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
            center: false
          }
        )
          .then(() => {
            this.basicInfo.state = this.nextStateOpt;
            this.projectBasicState = this.nextStateOpt;
            this.$store.commit("setProjectBasicState", this.projectBasicState);
            console.log(this.basicInfo.state);
            axios
              .put(
                "/api/state",
                qs.stringify({
                  projectId: this.projectBasicId,
                  state: this.nextStateOpt
                })
              )
              .then(response => {
                if (response.data.code === 0) {
                  this.$message.success("已修改状态为" + this.basicInfo.state);
                }
                this.getNextState();
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "取消修改"
            });
          });
      }
    },
    downloadExcel() {
      axios
        .get("/api/download/function/" + this.projectBasicId, {
          responseType: "blob" //告诉服务器我们需要的响应格式
        })
        .then(response => {
          var blob = new Blob([response.data], {
            type: "application/vnd.ms-excel" //将会被放入到blob中的数组内容的MIME类型
          });
          var objectUrl = URL.createObjectURL(blob); //生成一个装有blob的url
          window.location.href = objectUrl; //浏览器打开这个url
          window.URL.revokeObjectURL(objectUrl); // 释放url
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
}
.el-col {
  border-radius: 4px;
}

.tag-property {
  margin-right: 10px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
  padding-left: 85%;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.el-select {
  width: 20%;
}

.btn-group-set {
  text-align: right;
  margin-right: 3%;
  display: block;
}

.item {
  margin: 4px;
}

.input-set {
  width: 50%;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.el-col-11 {
  padding-left: 0 !important;
}

.el-col-1 {
  margin-right: 15px;
}

.el-col-10 {
  padding-top: 3px;
}

.mini-btn-set {
  background-color: transparent;
  border-color: transparent;
  margin: 0;
}
.el-form-item__content {
  margin-left: 30px !important;
}

.el-form-item__label {
  padding: 0;
}
</style>
