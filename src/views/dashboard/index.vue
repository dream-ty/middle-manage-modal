<template>
  <div class="dashboard">
    <el-row :gutter="40">
      <el-col :span="12">
        <pie-chart>
        </pie-chart>
      </el-col>

      <el-col :span="12">
        <bar-chart>
        </bar-chart>
      </el-col>
    </el-row>
    
  </div>
</template>

<script src="./index.js">
 
</script>

<style lang="scss" scope>

 @import "./index.scss";


</style>