import request from "@/utils/request";

const PMSTASK_BASE_URL = "/api/v1/pmsTasks";

const PmsTaskAPI = {
  /** 获取开发任务分页数据 */
  getPage(queryParams?: PmsTaskPageQuery) {
    return request<any, PageResult<PmsTaskPageVO[]>>({
      url: `${PMSTASK_BASE_URL}/page`,
      method: "get",
      params: queryParams,
    });
  },
  /**
   * 获取开发任务表单数据
   *
   * @param id 开发任务ID
   * @returns 开发任务表单数据
   */
  getFormData(id: number) {
    return request<any, PmsTaskForm>({
      url: `${PMSTASK_BASE_URL}/${id}/form`,
      method: "get",
    });
  },

  /** 添加开发任务*/
  add(data: PmsTaskForm) {
    return request({
      url: `${PMSTASK_BASE_URL}`,
      method: "post",
      data: data,
    });
  },

  /**
   * 更新开发任务
   *
   * @param id 开发任务ID
   * @param data 开发任务表单数据
   */
  update(id: number, data: PmsTaskForm) {
    return request({
      url: `${PMSTASK_BASE_URL}/${id}`,
      method: "put",
      data: data,
    });
  },

  /**
   * 批量删除开发任务，多个以英文逗号(,)分割
   *
   * @param ids 开发任务ID字符串，多个以英文逗号(,)分割
   */
  deleteByIds(ids: string) {
    return request({
      url: `${PMSTASK_BASE_URL}/${ids}`,
      method: "delete",
    });
  },
};

export default PmsTaskAPI;

/** 开发任务分页查询参数 */
export interface PmsTaskPageQuery extends PageQuery {}

/** 开发任务表单对象 */
export interface PmsTaskForm {
  /** 任务ID */
  taskId?: number;
  /** 需求ID */
  requirementId?: number;
  /** 任务名称 */
  taskName?: string;
  /** 优先级 */
  priority?: string;
  /** 预计开始时间 */
  expectStartTime?: Date;
  /** 预计完成时间 */
  expectFinishTime?: Date;
  /** 完成状态 */
  status?: number;
  /** 实际开始时间 */
  actualStartTime?: Date;
  /** 实际完成时间 */
  actualFinishTime?: Date;
  /** 描述 */
  description?: string;
  /** 创建人ID */
  createBy?: number;
  /** 创建时间 */
  createTime?: Date;
  /** 更新人ID */
  updateBy?: number;
  /** 更新时间 */
  updateTime?: Date;
  /** 是否删除（0: 未删除, 1: 已删除） */
  isDeleted?: number;
}

/** 开发任务分页对象 */
export interface PmsTaskPageVO {
  /** 任务ID */
  taskId?: number;
  /** 需求ID */
  requirementId?: number;
  /** 任务名称 */
  taskName?: string;
  /** 优先级 */
  priority?: string;
  /** 预计开始时间 */
  expectStartTime?: Date;
  /** 预计完成时间 */
  expectFinishTime?: Date;
  /** 完成状态 */
  status?: number;
  /** 实际开始时间 */
  actualStartTime?: Date;
  /** 实际完成时间 */
  actualFinishTime?: Date;
  /** 描述 */
  description?: string;
  /** 创建人ID */
  createBy?: number;
  /** 创建时间 */
  createTime?: Date;
  /** 更新人ID */
  updateBy?: number;
  /** 更新时间 */
  updateTime?: Date;
  /** 是否删除（0: 未删除, 1: 已删除） */
  isDeleted?: number;
}
