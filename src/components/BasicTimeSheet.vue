<template>
  <!-- 内容主体区域 -->
  <el-main>
    <el-card shadow="always">
      <el-row type="flex" justify="space-between" align="middle">
        <el-col :span="8">
          <div style="font-size:18px">我的工时列表</div>
        </el-col>
        <!--
        <el-col :span="3">
          <el-button type="primary" @click="addTimeSheet" plain round>
            <i class="el-icon-plus"></i>新增
          </el-button>
        </el-col>
        -->
      </el-row>
      <!-- 工时列表区域 -->
      <el-table
        :data="timesheetListCopy.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        @filter-change="filterTimesheetList"
        @sort-change="sortTimesheetList"
        stripe
      >
        <el-table-column prop="projectId" label="项目ID" sortable="custom"></el-table-column>
        <el-table-column label="功能模块">
          <template
            slot-scope="scope"
          >{{scope.row.primaryFunction}} / {{scope.row.secondaryFunction}}</template>
        </el-table-column>
        <el-table-column label="活动范围">
          <template
            slot-scope="scope"
          >{{scope.row.primaryActivity}} / {{scope.row.secondaryActivity}}</template>
        </el-table-column>
        <el-table-column prop="date" label="日期" sortable="custom"></el-table-column>
        <el-table-column label="时间">
          <template
            slot-scope="scope"
          >{{scope.row.startTime.slice(0,5)}} 至 {{scope.row.endTime.slice(0,5)}}</template>
        </el-table-column>
        <el-table-column
          prop="state"
          label="状态"
          :filters="[{ text: '草稿', value: '草稿' }, { text: '已提交', value: '已提交' },{ text: '已确认', value: '已确认' },{ text: '打回', value: '打回' }]"
          :column-key="'state'"
          filter-placement="bottom-end"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.state == '草稿'" type="warning">{{scope.row.state}}</el-tag>
            <el-tag v-if="scope.row.state == '已提交'">{{scope.row.state}}</el-tag>
            <el-tag v-if="scope.row.state == '已确认'" type="success">{{scope.row.state}}</el-tag>
            <el-tag v-if="scope.row.state == '打回'" type="danger">{{scope.row.state}}</el-tag>
          </template>
        </el-table-column>
        <!--
        <el-table-column label="操作" width="135">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="修改"
              placement="top"
              v-if="scope.row.state == '草稿' || scope.row.state == '打回'"
            >
              <el-button
                type="success"
                icon="el-icon-edit"
                size="mini"
                circle
                plain
                @click="editTimeSheet(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="提交"
              placement="top"
              v-if="scope.row.state == '草稿' || scope.row.state == '打回'"
            >
              <el-button
                type="danger"
                icon="el-icon-check"
                size="mini"
                circle
                plain
                @click="submitTimeSheet(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="提交"
              placement="top"
              v-if="scope.row.state == '草稿'"
            >
              <el-button
                class="el-icon-delete"
                type="danger"
                size="mini"
                circle
                plain
                @click="deleteTimeSheet(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        -->
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[6, 10, 15, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 新建工时对话框 -->
    <el-dialog :title="addFormTitle" :visible.sync="addDialogFormVisible" @close="addDialogClosed">
      <el-form
        :model="timesheetInfo"
        label-width="100px"
        label-position="left"
        :rules="addDialogFormRules"
        ref="addDialogFormRef"
      >
        <el-form-item label="项目ID" prop="projectId">
          <el-select
            v-model="timesheetInfo.projectId"
            clearable
            placeholder="请选择项目ID"
            @change="getPrimaryFunctions"
            @clear="clearProjectsIds"
          >
            <el-option v-for="item in projectsIds" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="一级功能" prop="primaryFunction">
          <el-select
            v-model="timesheetInfo.primaryFunction"
            clearable
            placeholder="请选择一级功能"
            @change="getSecondaryFunctions"
            @clear="clearPrimaryFunctions"
          >
            <el-option v-for="item in primaryFunctions" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级功能" prop="secondaryFunction">
          <el-select v-model="timesheetInfo.secondaryFunction" clearable placeholder="请选择二级功能">
            <el-option v-for="item in secondaryFunctions" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="一级活动" prop="primaryActivity">
          <el-select
            v-model="timesheetInfo.primaryActivity"
            clearable
            placeholder="请选择一级活动"
            @change="getSecondaryActivities"
            @clear="clearPrimaryActivities"
          >
            <el-option v-for="item in primaryActivities" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级活动" prop="secondaryActivity">
          <el-select v-model="timesheetInfo.secondaryActivity" clearable placeholder="请选择二级活动">
            <el-option v-for="item in secondaryActivities" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工作日期" prop="date">
          <el-date-picker
            v-model="timesheetInfo.date"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="时间范围" prop="time">
          <el-time-picker
            v-model="timesheetInfo.startTime"
            placeholder="开始时间"
            value-format="HH:mm:ss"
          ></el-time-picker>
          <el-time-picker
            v-model="timesheetInfo.endTime"
            placeholder="结束时间"
            value-format="HH:mm:ss"
          ></el-time-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="warning" @click="submitToBoss()">确认提交</el-button>
        <el-button type="primary" @click="saveAsDraft()">存为草稿</el-button>
        <el-button @click="addDialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </el-main>
</template>

<script>
import axios from "axios";
import qs from "qs";
import { mapState } from "vuex";

export default {
  data() {
    return {
      timesheetList: [],
      timesheetListCopy: [],
      currentPage: 1,
      pageSize: 6,
      total: 0,
      col: {},

      // 新增工时的数据
      addFormTitle: "新增工时信息",
      projectsIds: [],
      primaryFunctions: [],
      secondaryFunctions: [],
      primaryActivities: [],
      secondaryActivities: [],
      flag: false,
      addDialogFormVisible: false,
      addDialogFormRules: {
        projectId: [
          { required: true, message: "请选择项目ID", trigger: "change" }
        ],
        primaryFunction: [
          { required: true, message: "请选择一级功能", trigger: "change" }
        ],
        secondaryFunction: [
          { required: true, message: "请选择二级功能", trigger: "change" }
        ],
        primaryActivity: [
          { required: true, message: "请选择一级活动", trigger: "change" }
        ],
        secondaryActivity: [
          { required: true, message: "请选择二级活动", trigger: "change" }
        ],
        date: [
          {
            type: "string",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ]
      },
      timesheetInfo: {
        projectId: "",
        primaryFunction: "",
        secondaryFunction: "",
        primaryActivity: "",
        secondaryActivity: "",
        date: "",
        startTime: "",
        endTime: "",
        state: ""
      },
      myFilters: []
    };
  },
  created() {
    this.getTimeSheetList();
  },
  computed: {
    ...mapState(["personId"]),
    checkTimeSheetTotal: {
      //需要监听的数据
      get() {
        return this.$store.state.checkTimeSheetTotal;
      },
      set(val) {}
    }
  },
  watch: {
    checkTimeSheetTotal(newVal, oldVal) {}
  },
  methods: {
    getTimeSheetList() {
      axios.get("/api/timesheet/user").then(response => {
        console.log(response.data);
        if (response.data.code === 0) {
          this.timesheetList = response.data.data;
          this.timesheetListCopy = this.timesheetList;
          this.total = this.timesheetListCopy.length;
          this.filterTimesheetList(this.myFilters);
        } else {
          this.$message.error("获取工时列表失败！");
        }
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },

    // 新增工时的方法
    clearProjectsIds() {
      this.timesheetInfo.primaryFunction = "";
      this.timesheetInfo.secondaryFunction = "";
      this.primaryFunctions = [];
      this.secondaryFunctions = [];
    },
    getProjectIds() {
      axios.get("/api/timesheet/projectid").then(response => {
        if (response.data.code === 0) {
          this.projectsIds = response.data.data;
        } else {
          this.$message.error("获取可选项目ID失败！");
        }
      });
    },
    clearPrimaryFunctions() {
      this.timesheetInfo.secondaryFunction = "";
      this.secondaryFunctions = [];
    },
    getPrimaryFunctions() {
      if (!this.flag) {
        this.timesheetInfo.primaryFunction = "";
        this.secondaryFunctions = [];
        this.timesheetInfo.secondaryFunction = "";
      }
      axios
        .get("/api/timesheet/primaryfunction", {
          params: {
            projectId: this.timesheetInfo.projectId
          }
        })
        .then(response => {
          console.log(response);
          if (response.data.code === 0) {
            this.primaryFunctions = response.data.data;
          } else {
            this.$message.error("获取可选一级功能失败！");
          }
        });
    },
    getSecondaryFunctions() {
      if (!this.flag) this.timesheetInfo.secondaryFunction = "";
      axios
        .get("/api/timesheet/secondaryfunction", {
          params: {
            projectId: this.timesheetInfo.projectId,
            primaryFunction: this.timesheetInfo.primaryFunction
          }
        })
        .then(response => {
          console.log(response);
          if (response.data.code === 0) {
            this.secondaryFunctions = response.data.data;
          } else {
            this.$message.error("获取可选二级功能失败！");
          }
        });
    },
    getPrimaryActivities() {
      axios.get("/api/timesheet/primaryactivity").then(response => {
        console.log(response);
        if (response.data.code === 0) {
          this.primaryActivities = response.data.data;
        } else {
          this.$message.error("获取可选一级活动失败！");
        }
      });
    },
    clearPrimaryActivities() {
      this.timesheetInfo.secondaryActivity = "";
      this.secondaryActivities = [];
    },
    getSecondaryActivities() {
      if (!this.flag) this.timesheetInfo.secondaryActivity = "";
      axios
        .get("/api/timesheet/secondaryactivity", {
          params: {
            primaryActivity: this.timesheetInfo.primaryActivity
          }
        })
        .then(response => {
          console.log(response);
          if (response.data.code === 0) {
            this.secondaryActivities = response.data.data;
          } else {
            this.$message.error("获取可选二级活动失败！");
          }
        });
    },
    addTimeSheet() {
      this.clearProjectsIds();
      this.clearPrimaryActivities();
      this.getProjectIds();
      this.getPrimaryActivities();
      this.addFormTitle = "新增工时信息";
      this.addDialogFormVisible = true;
    },
    addDialogClosed() {
      this.$refs.addDialogFormRef.resetFields();
      for (var item in this.timesheetInfo) {
        this.timesheetInfo[item] = "";
      }
    },
    submitToBoss() {
      this.$refs.addDialogFormRef.validate(async valid => {
        if (!valid) return;
        this.timesheetInfo.state = "已提交";
        this.submitForm(true);
      });
    },
    saveAsDraft() {
      this.$refs.addDialogFormRef.validate(async valid => {
        if (!valid) return;
        this.timesheetInfo.state = "草稿";
        this.submitForm(false);
      });
    },
    submitForm(state) {
      console.log(this.timesheetInfo);
      axios
        .post("/api/timesheet", qs.stringify(this.timesheetInfo))
        .then(response => {
          console.log(response);
          if (response.data.code === 0) {
            this.getTimeSheetList();
            console.log(this.timesheetInfo);
            if (state)
              this.$store.commit(
                "setCheckTimeSheetTotal",
                this.checkTimeSheetTotal + 1
              );
            this.$message.success("成功！");
          } else {
            this.$message.error(response.data.data);
          }
        });
      this.addDialogFormVisible = false;
    },

    // 表格每列按钮修改工时
    editTimeSheet(temp) {
      this.addFormTitle = "修改工时信息";
      this.flag = true;
      Object.assign(this.timesheetInfo, temp);
      this.getProjectIds();
      this.getPrimaryFunctions();
      this.getSecondaryFunctions();
      this.getPrimaryActivities();
      this.getSecondaryActivities();
      this.addDialogFormVisible = true;
      this.flag = false;
    },
    // 表格每列按钮提交工时
    async submitTimeSheet(temp) {
      const confirmResult = await this.$confirm(
        "此操作将提交该工时记录，是否继续？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);

      if (confirmResult !== "confirm") {
        return this.$message.info("已取消提交！");
      }

      temp.state = "已提交";
      axios.post("/api/timesheet", qs.stringify(temp)).then(response => {
        console.log(response);
        if (response.data.code === 0) {
          this.getTimeSheetList();
          this.$store.commit(
            "setCheckTimeSheetTotal",
            this.checkTimeSheetTotal + 1
          );
          this.$message.success("提交成功！");
        } else {
          this.getTimeSheetList();
          this.$message.error(response.data.data);
        }
      });
    },

    // 表格筛选功能
    filterTimesheetList(filters) {
      this.myFilters = filters;
      if (this.myFilters.state) {
        if (this.myFilters.state.length == 0) {
          this.timesheetListCopy = this.timesheetList;
        } else {
          this.timesheetListCopy = this.timesheetList.filter(
            item => this.myFilters.state.indexOf(item.state) != -1
          );
        }
        this.total = this.timesheetListCopy.length;
        this.pageSize = 6;
        this.currentPage = 1;
      }
      this.sortTimesheetList(this.col);
    },

    // 表格排序功能
    sortTimesheetList(column) {
      this.col = column;
      this.timesheetListCopy.sort(this.$compare(this.col["prop"]));
      if (this.col["order"] == "descending") {
        this.timesheetListCopy.reverse();
      }
    },

    // 删除工时的操作
    async deleteTimeSheet(row) {
      const confirmResult = await this.$confirm(
        "此操作将删除该工时记录，是否继续？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);

      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除！");
      }

      axios
        .delete("/api/timesheet?timesheetId=" + row.timesheetId)
        .then(response => {
          console.log(response);
          if (response.data.code === 0) {
            this.getTimeSheetList();
            this.$message.success("删除成功！");
          } else {
            this.$message.error("删除失败！");
          }
        });
    }
  }
};
</script>

<style scoped>
.ml-set {
  margin-left: 20px;
}

.el-dialog__body {
  padding: 0 10px !important;
}

.el-form-item__content {
  margin-left: 30px !important;
}

.el-form-item__label {
  padding: 0;
}

.el-table {
  margin-bottom: 15px;
}

.el-table-column {
  position: relative;
}

p {
  font-size: 13px;
  line-height: 1.7;
}
</style>