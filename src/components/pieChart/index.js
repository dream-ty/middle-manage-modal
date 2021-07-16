import * as echarts from 'echarts'
require('echarts/theme/macarons.js')

export default {
    props: {
        className: {
            type: String,
            default: 'pie'
        },

        height: {
            type: String,
            default: '500px'
        },
        width: {
            type: String,
            default: '700px'
        },

        seriesData: {
            type: Array,
            default: () => [{ value: 1048, name: '搜索引擎' },
                { value: 735, name: '直接访问' },
                { value: 580, name: '邮件营销' },
                { value: 484, name: '联盟广告' },
                { value: 300, name: '视频广告' }
            ]
        },
        text: {
            type: String,
            default: ''
        },
        subtext: {
            type: String,
            default: ''
        }
    },

    mounted() {
        this.showPie()
    },
    methods: {
        showPie() {
            var echart = echarts.init(this.$refs.main, 'macarons')

            let option = {
                title: {
                    text: this.text,
                    subtext: this.subtext,
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                },
                series: [{
                    name: '访问来源',
                    type: 'pie',
                    radius: '50%',
                    data: this.seriesData,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 100,
                            shadowOffsetX: 2,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }]
            };
            echart.setOption(option)
        }
    },
}