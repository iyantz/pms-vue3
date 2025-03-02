import request from "@/utils/request";

const PMSRELEASEPLAN_BASE_URL = "/api/v1/pmsReleasePlans";

const PmsReleasePlanAPI = {
  /** 获取发布计划分页数据 */
  getPage(queryParams?: PmsReleasePlanPageQuery) {
    return request<any, PageResult<PmsReleasePlanPageVO[]>>({
      url: `${PMSRELEASEPLAN_BASE_URL}/page`,
      method: "get",
      params: queryParams,
    });
  },
  /**
   * 获取发布计划表单数据
   *
   * @param id 发布计划ID
   * @returns 发布计划表单数据
   */
  getFormData(id: number) {
    return request<any, PmsReleasePlanForm>({
      url: `${PMSRELEASEPLAN_BASE_URL}/${id}/form`,
      method: "get",
    });
  },

  /** 添加发布计划*/
  add(data: PmsReleasePlanForm) {
    return request({
      url: `${PMSRELEASEPLAN_BASE_URL}`,
      method: "post",
      data: data,
    });
  },

  /**
   * 更新发布计划
   *
   * @param id 发布计划ID
   * @param data 发布计划表单数据
   */
  update(id: number, data: PmsReleasePlanForm) {
    return request({
      url: `${PMSRELEASEPLAN_BASE_URL}/${id}`,
      method: "put",
      data: data,
    });
  },

  /**
   * 批量删除发布计划，多个以英文逗号(,)分割
   *
   * @param ids 发布计划ID字符串，多个以英文逗号(,)分割
   */
  deleteByIds(ids: string) {
    return request({
      url: `${PMSRELEASEPLAN_BASE_URL}/${ids}`,
      method: "delete",
    });
  },
};

export default PmsReleasePlanAPI;

/** 发布计划分页查询参数 */
export interface PmsReleasePlanPageQuery extends PageQuery {}

/** 发布计划表单对象 */
export interface PmsReleasePlanForm {
  /** 计划ID */
  planId?: number;
  /** 项目ID */
  projectId?: number;
  /** 计划名称 */
  planName?: string;
  /** 计划版本 */
  planVersion?: string;
  /** 计划时间 */
  planTime?: Date;
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

/** 发布计划分页对象 */
export interface PmsReleasePlanPageVO {
  /** 计划ID */
  planId?: number;
  /** 项目ID */
  projectId?: number;
  /** 计划名称 */
  planName?: string;
  /** 计划版本 */
  planVersion?: string;
  /** 计划时间 */
  planTime?: Date;
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
