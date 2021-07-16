import request from '@/utils/request'


export default {
    // 条件查询列表

    search(query, current, size) {

        return request({
            url: '/article/article/search',
            method: 'post',
            data: {
                ...query,
                current,
                size
            }
        })
    },
    getArticleById(id) {
        return request({
            url: `/article/article/${id}`,
            method: 'get'
        })
    },
    checkIsPassed(id) {
        return request({
            url: `/article/check/success/${id}`,
            method: 'get'
        })
    },
    checkIsNoPassed(id) {
        return request({
            url: `/article/check/fail/${id}`,
            method: 'get'
        })
    },
    delete(id) {
        return request({
            url: `/article/article/${id}`,
            method: 'get'

        })
    }
}