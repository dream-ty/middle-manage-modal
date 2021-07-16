export default {

    name: 'Dashboard',
    components: {
        'pie-chart': () =>
            import ('@/components/pieChart/index.vue'),
        'bar-chart': () =>
            import ('@/components/barChart/index.vue')
    },
    mounted() {

    },
    methods: {

    },
}