<template>
  <div class="app-container">
    <div class="search-bar">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item>
          <el-button type="primary" @click="handleQuery">
            <template #icon><Search /></template>
            搜索
          </el-button>
          <el-button @click="handleResetQuery">
            <template #icon><Refresh /></template>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="never">
      <div class="mb-10px">
        <el-button v-hasPerm="['task:pmsTask:add']" type="success" @click="handleOpenDialog()">
          <template #icon><Plus /></template>
          新增
        </el-button>
        <el-button
          v-hasPerm="['task:pmsTask:delete']"
          type="danger"
          :disabled="removeIds.length === 0"
          @click="handleDelete()"
        >
          <template #icon><Delete /></template>
          删除
        </el-button>
      </div>

      <el-table
        ref="dataTableRef"
        v-loading="loading"
        :data="pageData"
        highlight-current-row
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column key="taskId" label="任务ID" prop="taskId" min-width="150" align="center" />
        <el-table-column label="需求ID" width="150" align="center">
          <template #default="scope">
            <DictLabel v-model="scope.row.requirementId" code="DICT_COMP_STATUS" />
          </template>
        </el-table-column>
        <el-table-column
          key="taskName"
          label="任务名称"
          prop="taskName"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="priority"
          label="优先级"
          prop="priority"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="expectStartTime"
          label="预计开始时间"
          prop="expectStartTime"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="expectFinishTime"
          label="预计完成时间"
          prop="expectFinishTime"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="status"
          label="完成状态"
          prop="status"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="actualStartTime"
          label="实际开始时间"
          prop="actualStartTime"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="actualFinishTime"
          label="实际完成时间"
          prop="actualFinishTime"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="description"
          label="描述"
          prop="description"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="createBy"
          label="创建人ID"
          prop="createBy"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="createTime"
          label="创建时间"
          prop="createTime"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="updateBy"
          label="更新人ID"
          prop="updateBy"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="updateTime"
          label="更新时间"
          prop="updateTime"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="isDeleted"
          label="是否删除（0: 未删除, 1: 已删除）"
          prop="isDeleted"
          min-width="150"
          align="center"
        />
        <el-table-column fixed="right" label="操作" width="220">
          <template #default="scope">
            <el-button
              v-hasPerm="['task:pmsTask:edit']"
              type="primary"
              size="small"
              link
              @click="handleOpenDialog(scope.row.id)"
            >
              <template #icon><Edit /></template>
              编辑
            </el-button>
            <el-button
              v-hasPerm="['task:pmsTask:delete']"
              type="danger"
              size="small"
              link
              @click="handleDelete(scope.row.id)"
            >
              <template #icon><Delete /></template>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-if="total > 0"
        v-model:total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="handleQuery()"
      />
    </el-card>

    <!-- 开发任务表单弹窗 -->
    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      width="500px"
      @close="handleCloseDialog"
    >
      <el-form ref="dataFormRef" :model="formData" :rules="rules" label-width="100px">
        <el-input v-model="formData.taskId" type="hidden" />
        <el-form-item label="需求ID" prop="requirementId">
          <dict v-model="formData.requirementId" code="DICT_COMP_STATUS" />
        </el-form-item>

        <el-form-item label="任务名称" prop="taskName">
          <el-input v-model="formData.taskName" placeholder="任务名称" />
        </el-form-item>

        <el-form-item label="优先级" prop="priority">
          <el-input v-model="formData.priority" placeholder="优先级" />
        </el-form-item>

        <el-form-item label="预计开始时间" prop="expectStartTime">
          <el-date-picker
            v-model="formData.expectStartTime"
            type="datetime"
            placeholder="预计开始时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>

        <el-form-item label="预计完成时间" prop="expectFinishTime">
          <el-date-picker
            v-model="formData.expectFinishTime"
            type="datetime"
            placeholder="预计完成时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>

        <el-form-item label="完成状态" prop="status">
          <el-input v-model="formData.status" placeholder="完成状态" />
        </el-form-item>

        <el-form-item label="实际开始时间" prop="actualStartTime">
          <el-date-picker
            v-model="formData.actualStartTime"
            type="datetime"
            placeholder="实际开始时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>

        <el-form-item label="实际完成时间" prop="actualFinishTime">
          <el-date-picker
            v-model="formData.actualFinishTime"
            type="datetime"
            placeholder="实际完成时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>

        <el-form-item label="描述" prop="description">
          <el-input v-model="formData.description" placeholder="描述" />
        </el-form-item>

        <el-input v-model="formData.createBy" type="hidden" />
        <el-input v-model="formData.createTime" type="hidden" />
        <el-input v-model="formData.updateBy" type="hidden" />
        <el-input v-model="formData.updateTime" type="hidden" />
        <el-input v-model="formData.isDeleted" type="hidden" />
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit()">确定</el-button>
          <el-button @click="handleCloseDialog()">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "PmsTask",
  inheritAttrs: false,
});

import PmsTaskAPI, { PmsTaskPageVO, PmsTaskForm, PmsTaskPageQuery } from "@/api/task/pms-task";

const queryFormRef = ref(ElForm);
const dataFormRef = ref(ElForm);

const loading = ref(false);
const removeIds = ref<number[]>([]);
const total = ref(0);

const queryParams = reactive<PmsTaskPageQuery>({
  pageNum: 1,
  pageSize: 10,
});

// 开发任务表格数据
const pageData = ref<PmsTaskPageVO[]>([]);

// 弹窗
const dialog = reactive({
  title: "",
  visible: false,
});

// 开发任务表单数据
const formData = reactive<PmsTaskForm>({});

// 开发任务表单校验规则
const rules = reactive({
  taskId: [{ required: true, message: "请输入任务ID", trigger: "blur" }],
  createBy: [{ required: true, message: "请输入创建人ID", trigger: "blur" }],
  createTime: [{ required: true, message: "请输入创建时间", trigger: "blur" }],
});

/** 查询开发任务 */
function handleQuery() {
  loading.value = true;
  PmsTaskAPI.getPage(queryParams)
    .then((data) => {
      pageData.value = data.list;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

/** 重置开发任务查询 */
function handleResetQuery() {
  queryFormRef.value!.resetFields();
  queryParams.pageNum = 1;
  handleQuery();
}

/** 行复选框选中记录选中ID集合 */
function handleSelectionChange(selection: any) {
  removeIds.value = selection.map((item: any) => item.id);
}

/** 打开开发任务弹窗 */
function handleOpenDialog(id?: number) {
  dialog.visible = true;
  if (id) {
    dialog.title = "修改开发任务";
    PmsTaskAPI.getFormData(id).then((data) => {
      Object.assign(formData, data);
    });
  } else {
    dialog.title = "新增开发任务";
  }
}

/** 提交开发任务表单 */
function handleSubmit() {
  dataFormRef.value.validate((valid: any) => {
    if (valid) {
      loading.value = true;
      const id = formData.id;
      if (id) {
        PmsTaskAPI.update(id, formData)
          .then(() => {
            ElMessage.success("修改成功");
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        PmsTaskAPI.add(formData)
          .then(() => {
            ElMessage.success("新增成功");
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      }
    }
  });
}

/** 关闭开发任务弹窗 */
function handleCloseDialog() {
  dialog.visible = false;
  dataFormRef.value.resetFields();
  dataFormRef.value.clearValidate();
  formData.id = undefined;
}

/** 删除开发任务 */
function handleDelete(id?: number) {
  const ids = [id || removeIds.value].join(",");
  if (!ids) {
    ElMessage.warning("请勾选删除项");
    return;
  }

  ElMessageBox.confirm("确认删除已选中的数据项?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(
    () => {
      loading.value = true;
      PmsTaskAPI.deleteByIds(ids)
        .then(() => {
          ElMessage.success("删除成功");
          handleResetQuery();
        })
        .finally(() => (loading.value = false));
    },
    () => {
      ElMessage.info("已取消删除");
    }
  );
}

onMounted(() => {
  handleQuery();
});
</script>
