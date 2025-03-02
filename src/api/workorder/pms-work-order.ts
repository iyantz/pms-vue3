import request from "@/utils/request";

const PMSWORKORDER_BASE_URL = "/api/v1/pmsWorkOrders";

const PmsWorkOrderAPI = {
  /** 获取工单列表分页数据 */
  getPage(queryParams?: PmsWorkOrderPageQuery) {
    return request<any, PageResult<PmsWorkOrderPageVO[]>>({
      url: `${PMSWORKORDER_BASE_URL}/page`,
      method: "get",
      params: queryParams,
    });
  },
  /**
   * 获取工单列表表单数据
   *
   * @param id 工单列表ID
   * @returns 工单列表表单数据
   */
  getFormData(id: number) {
    return request<any, PmsWorkOrderForm>({
      url: `${PMSWORKORDER_BASE_URL}/${id}/form`,
      method: "get",
    });
  },

  /** 添加工单列表*/
  add(data: PmsWorkOrderForm) {
    return request({
      url: `${PMSWORKORDER_BASE_URL}`,
      method: "post",
      data: data,
    });
  },

  /**
   * 更新工单列表
   *
   * @param id 工单列表ID
   * @param data 工单列表表单数据
   */
  update(id: number, data: PmsWorkOrderForm) {
    return request({
      url: `${PMSWORKORDER_BASE_URL}/${id}`,
      method: "put",
      data: data,
    });
  },

  /**
   * 批量删除工单列表，多个以英文逗号(,)分割
   *
   * @param ids 工单列表ID字符串，多个以英文逗号(,)分割
   */
  deleteByIds(ids: string) {
    return request({
      url: `${PMSWORKORDER_BASE_URL}/${ids}`,
      method: "delete",
    });
  },
};

export default PmsWorkOrderAPI;

/** 工单列表分页查询参数 */
export interface PmsWorkOrderPageQuery extends PageQuery {}

/** 工单列表表单对象 */
export interface PmsWorkOrderForm {
  /** 工单ID */
  workOrderId?: number;
  /** 项目ID */
  projectId?: number;
  /** 需求ID */
  requirementId?: number;
  /** 工单标题 */
  title?: string;
  /** 工单描述 */
  description?: string;
  /** 指定处理人ID */
  handlerId?: number;
  /** 处理时间 */
  handlerTime?: Date;
  /** 优先级（1低 2中 3高） */
  priority?: string;
  /** 工单状态（0待处理 1处理中 2已处理） */
  status?: string;
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

/** 工单列表分页对象 */
export interface PmsWorkOrderPageVO {
  /** 工单ID */
  workOrderId?: number;
  /** 项目ID */
  projectId?: number;
  /** 需求ID */
  requirementId?: number;
  /** 工单标题 */
  title?: string;
  /** 工单描述 */
  description?: string;
  /** 指定处理人ID */
  handlerId?: number;
  /** 处理时间 */
  handlerTime?: Date;
  /** 优先级（1低 2中 3高） */
  priority?: string;
  /** 工单状态（0待处理 1处理中 2已处理） */
  status?: string;
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
