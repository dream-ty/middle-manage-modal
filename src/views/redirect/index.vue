<script>
export default {
  created() {
    // 上个路由、
    const { params, query } = this.$route
    const { path } = params
    console.log(this.$route, 'redirect')
    this.$router.replace({ path: '/' + path, query })
  },
  render: function(h) {
    return h() // avoid warning message
  }
}
</script>
