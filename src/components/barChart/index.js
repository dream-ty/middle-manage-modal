import * as echarts from 'echarts'

require('echarts/theme/macarons.js')


export default {
    props: {

        height: {
            type: String,
            default: '500px'
        },
        width: {
            type: String,
            default: '700px'
        },
        xData: {
            type: Array,
            default: () => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        seriesData: {
            type: Array,
            default: () => [10, 52, 200, 334, 390, 330, 220]
        }
    },


    mounted() {
        this.showBar()
    },

    methods: {
        showBar() {
            let bare = echarts.init(this.$refs.main, 'macarons')

            let option = {

                title: {
                    text: '近六个月发布文章数',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [{
                    type: 'category',
                    data: this.xData,
                    axisTick: {
                        alignWithLabel: true
                    }
                }],
                yAxis: [{
                    type: 'value'
                }],
                series: [{
                    name: '直接访问',
                    type: 'bar',
                    barWidth: '60%',
                    data: this.seriesData
                }]
            };

            bare.setOption(option)
        }
    },
}