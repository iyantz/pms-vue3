import request from "@/utils/request";

const PMSPROJECTPLAN_BASE_URL = "/api/v1/pmsProjectPlans";

const PmsProjectPlanAPI = {
  /** 获取项目计划分页数据 */
  getPage(queryParams?: PmsProjectPlanPageQuery) {
    return request<any, PageResult<PmsProjectPlanPageVO[]>>({
      url: `${PMSPROJECTPLAN_BASE_URL}/page`,
      method: "get",
      params: queryParams,
    });
  },
  /**
   * 获取项目计划表单数据
   *
   * @param id 项目计划ID
   * @returns 项目计划表单数据
   */
  getFormData(id: number) {
    return request<any, PmsProjectPlanForm>({
      url: `${PMSPROJECTPLAN_BASE_URL}/${id}/form`,
      method: "get",
    });
  },

  /** 添加项目计划*/
  add(data: PmsProjectPlanForm) {
    return request({
      url: `${PMSPROJECTPLAN_BASE_URL}`,
      method: "post",
      data: data,
    });
  },

  /**
   * 更新项目计划
   *
   * @param id 项目计划ID
   * @param data 项目计划表单数据
   */
  update(id: number, data: PmsProjectPlanForm) {
    return request({
      url: `${PMSPROJECTPLAN_BASE_URL}/${id}`,
      method: "put",
      data: data,
    });
  },

  /**
   * 批量删除项目计划，多个以英文逗号(,)分割
   *
   * @param ids 项目计划ID字符串，多个以英文逗号(,)分割
   */
  deleteByIds(ids: string) {
    return request({
      url: `${PMSPROJECTPLAN_BASE_URL}/${ids}`,
      method: "delete",
    });
  },
};

export default PmsProjectPlanAPI;

/** 项目计划分页查询参数 */
export interface PmsProjectPlanPageQuery extends PageQuery {}

/** 项目计划表单对象 */
export interface PmsProjectPlanForm {
  /** 计划ID */
  planId?: number;
  /** 项目ID */
  projectId?: number;
  /** 计划名称 */
  planName?: string;
  /** 计划完成时间 */
  planTime?: Date;
  /** 实际完成时间 */
  planActualTime?: Date;
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

/** 项目计划分页对象 */
export interface PmsProjectPlanPageVO {
  /** 计划ID */
  planId?: number;
  /** 项目ID */
  projectId?: number;
  /** 计划名称 */
  planName?: string;
  /** 计划完成时间 */
  planTime?: Date;
  /** 实际完成时间 */
  planActualTime?: Date;
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
