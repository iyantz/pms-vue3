import request from "@/utils/request";

const PMSRELEASECONTENT_BASE_URL = "/api/v1/pmsReleaseContents";

const PmsReleaseContentAPI = {
  /** 获取发布内容分页数据 */
  getPage(queryParams?: PmsReleaseContentPageQuery) {
    return request<any, PageResult<PmsReleaseContentPageVO[]>>({
      url: `${PMSRELEASECONTENT_BASE_URL}/page`,
      method: "get",
      params: queryParams,
    });
  },
  /**
   * 获取发布内容表单数据
   *
   * @param id 发布内容ID
   * @returns 发布内容表单数据
   */
  getFormData(id: number) {
    return request<any, PmsReleaseContentForm>({
      url: `${PMSRELEASECONTENT_BASE_URL}/${id}/form`,
      method: "get",
    });
  },

  /** 添加发布内容*/
  add(data: PmsReleaseContentForm) {
    return request({
      url: `${PMSRELEASECONTENT_BASE_URL}`,
      method: "post",
      data: data,
    });
  },

  /**
   * 更新发布内容
   *
   * @param id 发布内容ID
   * @param data 发布内容表单数据
   */
  update(id: number, data: PmsReleaseContentForm) {
    return request({
      url: `${PMSRELEASECONTENT_BASE_URL}/${id}`,
      method: "put",
      data: data,
    });
  },

  /**
   * 批量删除发布内容，多个以英文逗号(,)分割
   *
   * @param ids 发布内容ID字符串，多个以英文逗号(,)分割
   */
  deleteByIds(ids: string) {
    return request({
      url: `${PMSRELEASECONTENT_BASE_URL}/${ids}`,
      method: "delete",
    });
  },
};

export default PmsReleaseContentAPI;

/** 发布内容分页查询参数 */
export interface PmsReleaseContentPageQuery extends PageQuery {}

/** 发布内容表单对象 */
export interface PmsReleaseContentForm {
  /** 内容ID */
  contentId?: number;
  /** 发布ID */
  releaseId?: number;
  /** 内容 */
  content?: string;
  /** 文件路径 */
  filePath?: string;
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

/** 发布内容分页对象 */
export interface PmsReleaseContentPageVO {
  /** 内容ID */
  contentId?: number;
  /** 发布ID */
  releaseId?: number;
  /** 内容 */
  content?: string;
  /** 文件路径 */
  filePath?: string;
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
