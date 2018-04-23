<template>
    <div>
        <div class="page-boxtitle">
            <strong class="title">系统设置</strong>
        </div>

        <el-form :model="addForm" :rules="rules" ref="addForm" label-width="100px"  @submit.prevent="submit()">
          <el-form-item label="评论开关" prop="title">
            <el-input v-model="addForm.title"></el-input>
          </el-form-item>

          <el-form-item label="评论开关" prop="ishot">
            <el-switch
              v-model="addForm.ishot"
              active-color="#13ce66"
              inactive-color="#e0e0e0">
            </el-switch>
          </el-form-item>
          <el-form-item label="会员注册开关" prop="ishot">
            <el-switch
              v-model="addForm.ishot"
              active-color="#13ce66"
              inactive-color="#e0e0e0">
            </el-switch>
          </el-form-item>

          <el-form-item label="数据备份" prop="title">
            <el-input v-model="addForm.title"></el-input>
          </el-form-item>

          <el-form-item label="邮件设置" prop="title">
            <el-input v-model="addForm.title"></el-input>
          </el-form-item>
          

          <el-form-item style="margin-top:60px">
            <el-button type="primary" native-type="submit" @click="submit('addForm')">提交</el-button>
            <el-button @click="resetForm('addForm')">重置</el-button>
          </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
  data () {
    return {
      url: '/api/article',
      addForm: {
        id: '',
        title: '',
        cid: '',
        keywords: [],
        abstracts: '',
        pic: '',
        ishot: false,
        isorig: false,
      }
   }
  }
}
</script>