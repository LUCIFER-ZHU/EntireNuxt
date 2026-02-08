/**
 * 产品相关 API
 * 统一管理所有产品接口调用
 */

import { useCustomUseFetch, useCustomFetch, type ApiResponse } from "./request";

/**
 * 产品信息对象（后端字段可能变化，使用灵活类型）
 */
export type ProductInfo = Record<string, any>;

/**
 * 产品类型（后端字段可能变化，使用灵活类型）
 */
export type ProductType = Record<string, any>;

/**
 * 国家信息
 */
export type DictCountry = {
    capital?: string;
    chineseName?: string;
    continent?: string;
    countryCode?: string;
    englishName?: string;
    icon?: string;
    id?: number;
    isoCode?: string;
    latitude?: number;
    longitude?: number;
    timezone?: string;
    [property: string]: any;
};

/**
 * 品牌信息（完整版）
 */
export type BrandInfoFull = {
    brandId?: string;
    brandName?: string;
    brandSlogan?: string;
    countryOfOrigin?: string;
    createBy?: string;
    createTime?: string;
    id?: number;
    isDeleted?: number;
    logoUrl?: string;
    pageNum?: number;
    pageSize?: number;
    updateBy?: string;
    updateTime?: string;
    website?: string;
    [property: string]: any;
};

/**
 * 获取产品信息列表（SSR）
 * @param pageNum 页码（响应式）
 * @param pageSize 每页数量（响应式）
 * @returns useFetch 返回值，包含 data, pending, error, refresh
 */
export const getProductInfoListSSR = (
    pageNum: Ref<number>,
    pageSize: Ref<number>
) => {
    return useCustomUseFetch<ApiResponse<ProductInfo[]>>("/web/homePage/productInfoList", {
        method: "GET",
        query: computed(() => ({
            pageNum: pageNum.value,
            pageSize: pageSize.value,
        })),
    });
};

/**
 * 获取新品上新列表（SSR）
 * @param pageNum 页码（响应式）
 * @param pageSize 每页数量（响应式）
 * @returns useFetch 返回值，包含 data, pending, error, refresh
 */
export const getNewProductInfoListSSR = (
    pageNum: Ref<number>,
    pageSize: Ref<number>
) => {
    return useCustomUseFetch<ApiResponse<ProductInfo[]>>("/web/homePage/newProductInfoList", {
        method: "GET",
        query: computed(() => ({
            pageNum: pageNum.value,
            pageSize: pageSize.value,
        })),
    });
};

/**
 * 获取商品列表（支持筛选）- Promise
 * @param brandIdList 品牌ID数组
 * @param countryList 国家ID数组
 * @param processingTime 工作小时数
 * @param searchIds 类型IDs
 * @param searchInfo 搜索信息
 * @param pageSize 每页数量
 * @param pageNum 页码
 */
export const fetchProductList = (params: {
    brandIdList?: string[];
    countryList?: string[];
    processingTime?: number;
    searchIds?: number[];
    searchInfo?: string;
    pageSize?: number;
    pageNum?: number;
}) => {
    return useCustomFetch("/web/productPage/productList", {
        method: "GET",
        query: params,
    });
};

/**
 * 获取品牌列表
 * @param searchIds 类型IDs
 */
export const getBrandList = (searchIds?: number[]) => {
    return useCustomUseFetch<ApiResponse<BrandInfoFull[]>>("/web/productPage/brandList", {
        method: "GET",
        query: searchIds ? { searchIds } : {},
    });
};

/**
 * 获取商品详情 (Promise)
 * @param productSlug 产品Slug (SEO Path)
 */
export const fetchProductInfo = (productSlug: string) => {
    return useCustomFetch(`/web/productInfo/${productSlug}`, {
        method: "GET",
    });
};

/**
 * 获取同类型其他商品 (Promise)
 * @param productSlug 产品Slug (SEO Path)
 */
export const fetchSimilarProducts = (productSlug: string) => {
    return useCustomFetch("/web/productInfo/findSimilarProducts", {
        method: "GET",
        query: { seoPath: productSlug },
    });
};

/**
 * 添加收藏
 * @param productSlug 产品Slug (SEO Path)
 */
export const addToCollection = (productSlug: string) => {
    return useCustomFetch("/web/productInfo/forCollection", {
        method: "GET",
        query: { seoPath: productSlug },
    });
};

/**
 * 获取收藏列表 (Promise)
 * @param productSlug 产品Slug (SEO Path)
 */
export const fetchCollectionList = (productSlug: string) => {
    return useCustomFetch("/web/productInfo/collectionList", {
        method: "GET",
        query: { seoPath: productSlug },
    });
};

/**
 * 获取面包屑列表 (Promise)
 * @param productSlug 产品Slug (SEO Path)
 */
export const fetchBreadcrumbsList = (productSlug: string) => {
    return useCustomFetch<ApiResponse<string[]>>("/web/productInfo/breadcrumbsList", {
        method: "GET",
        query: { seoPath: productSlug },
    });
};

/**
 * 搜索信息数据
 */
export type SearchInfoDto = {
    brandInfoList?: BrandInfoFull[];
    dictCountryList?: DictCountry[];
    [property: string]: any;
};

/**
 * 获取搜索信息列表（品牌+国家）- Promise
 * @param searchIds 类型IDs
 */
export const fetchSearchInfoList = (searchIds?: number[]) => {
    return useCustomFetch<ApiResponse<SearchInfoDto>>("/web/productPage/searchInfoList", {
        method: "GET",
        query: searchIds ? { searchIds } : {},
    });
};

