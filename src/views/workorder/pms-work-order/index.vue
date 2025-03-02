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
        <el-button
          v-hasPerm="['workorder:pmsWorkOrder:add']"
          type="success"
          @click="handleOpenDialog()"
        >
          <template #icon><Plus /></template>
          新增
        </el-button>
        <el-button
          v-hasPerm="['workorder:pmsWorkOrder:delete']"
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
        <el-table-column
          key="workOrderId"
          label="工单ID"
          prop="workOrderId"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="projectId"
          label="项目ID"
          prop="projectId"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="requirementId"
          label="需求ID"
          prop="requirementId"
          min-width="150"
          align="center"
        />
        <el-table-column key="title" label="工单标题" prop="title" min-width="150" align="center" />
        <el-table-column
          key="description"
          label="工单描述"
          prop="description"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="handlerId"
          label="指定处理人ID"
          prop="handlerId"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="handlerTime"
          label="处理时间"
          prop="handlerTime"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="priority"
          label="优先级（1低 2中 3高）"
          prop="priority"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="status"
          label="工单状态（0待处理 1处理中 2已处理）"
          prop="status"
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
              v-hasPerm="['workorder:pmsWorkOrder:edit']"
              type="primary"
              size="small"
              link
              @click="handleOpenDialog(scope.row.id)"
            >
              <template #icon><Edit /></template>
              编辑
            </el-button>
            <el-button
              v-hasPerm="['workorder:pmsWorkOrder:delete']"
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

    <!-- 工单列表表单弹窗 -->
    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      width="500px"
      @close="handleCloseDialog"
    >
      <el-form ref="dataFormRef" :model="formData" :rules="rules" label-width="100px">
        <el-input v-model="formData.workOrderId" type="hidden" />
        <el-input v-model="formData.projectId" type="hidden" />
        <el-form-item label="需求ID" prop="requirementId">
          <el-input v-model="formData.requirementId" placeholder="需求ID" />
        </el-form-item>

        <el-form-item label="工单标题" prop="title">
          <el-input v-model="formData.title" placeholder="工单标题" />
        </el-form-item>

        <el-form-item label="工单描述" prop="description">
          <el-input v-model="formData.description" placeholder="工单描述" />
        </el-form-item>

        <el-form-item label="指定处理人ID" prop="handlerId">
          <el-input v-model="formData.handlerId" placeholder="指定处理人ID" />
        </el-form-item>

        <el-form-item label="处理时间" prop="handlerTime">
          <el-date-picker
            v-model="formData.handlerTime"
            type="datetime"
            placeholder="处理时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>

        <el-form-item label="优先级（1低 2中 3高）" prop="priority">
          <el-input v-model="formData.priority" placeholder="优先级（1低 2中 3高）" />
        </el-form-item>

        <el-form-item label="工单状态（0待处理 1处理中 2已处理）" prop="status">
          <el-input v-model="formData.status" placeholder="工单状态（0待处理 1处理中 2已处理）" />
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
  name: "PmsWorkOrder",
  inheritAttrs: false,
});

import PmsWorkOrderAPI, {
  PmsWorkOrderPageVO,
  PmsWorkOrderForm,
  PmsWorkOrderPageQuery,
} from "@/api/workorder/pms-work-order";

const queryFormRef = ref(ElForm);
const dataFormRef = ref(ElForm);

const loading = ref(false);
const removeIds = ref<number[]>([]);
const total = ref(0);

const queryParams = reactive<PmsWorkOrderPageQuery>({
  pageNum: 1,
  pageSize: 10,
});

// 工单列表表格数据
const pageData = ref<PmsWorkOrderPageVO[]>([]);

// 弹窗
const dialog = reactive({
  title: "",
  visible: false,
});

// 工单列表表单数据
const formData = reactive<PmsWorkOrderForm>({});

// 工单列表表单校验规则
const rules = reactive({
  workOrderId: [{ required: true, message: "请输入工单ID", trigger: "blur" }],
  title: [{ required: true, message: "请输入工单标题", trigger: "blur" }],
  createBy: [{ required: true, message: "请输入创建人ID", trigger: "blur" }],
  createTime: [{ required: true, message: "请输入创建时间", trigger: "blur" }],
});

/** 查询工单列表 */
function handleQuery() {
  loading.value = true;
  PmsWorkOrderAPI.getPage(queryParams)
    .then((data) => {
      pageData.value = data.list;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

/** 重置工单列表查询 */
function handleResetQuery() {
  queryFormRef.value!.resetFields();
  queryParams.pageNum = 1;
  handleQuery();
}

/** 行复选框选中记录选中ID集合 */
function handleSelectionChange(selection: any) {
  removeIds.value = selection.map((item: any) => item.id);
}

/** 打开工单列表弹窗 */
function handleOpenDialog(id?: number) {
  dialog.visible = true;
  if (id) {
    dialog.title = "修改工单列表";
    PmsWorkOrderAPI.getFormData(id).then((data) => {
      Object.assign(formData, data);
    });
  } else {
    dialog.title = "新增工单列表";
  }
}

/** 提交工单列表表单 */
function handleSubmit() {
  dataFormRef.value.validate((valid: any) => {
    if (valid) {
      loading.value = true;
      const id = formData.id;
      if (id) {
        PmsWorkOrderAPI.update(id, formData)
          .then(() => {
            ElMessage.success("修改成功");
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        PmsWorkOrderAPI.add(formData)
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

/** 关闭工单列表弹窗 */
function handleCloseDialog() {
  dialog.visible = false;
  dataFormRef.value.resetFields();
  dataFormRef.value.clearValidate();
  formData.id = undefined;
}

/** 删除工单列表 */
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
      PmsWorkOrderAPI.deleteByIds(ids)
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
