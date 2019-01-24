<template>
    <div>
        <i class="iconfont icon-Gear-4 setting" @click.self="detail">
            <div v-show="isShowDetail" class="detail">
                <el-checkbox-group v-model="checkList">
                    <el-checkbox label="复选框 A"></el-checkbox>
                    <el-checkbox label="复选框 B"></el-checkbox>
                    <el-checkbox label="复选框 C"></el-checkbox>
                    <el-checkbox label="复选框 D"></el-checkbox>
                    <el-checkbox label="复选框 E"></el-checkbox>
                </el-checkbox-group>
            </div>
        </i>
    </div>
</template>

<script>
export default {
    name: 'setting',
    data () {
        return {
            isShowDetail: false,
            checkList: []
        };
    },
    components: {
        
    },
    created () {},
    methods: {
        detail() {
            this.isShowDetail = !this.isShowDetail;
        }
    }
    
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
    .el-checkbox+.el-checkbox {
        margin-left: 0;
    }
    .setting {
        position: relative;
        .detail {
            position: absolute;
            left: 0;
            top: 45px;
            z-index: 999;
            width: 200px;
            height: 350px;
            text-align: left;
            border: 1px solid #666;
            background-color: #E9F2F9;
            .el-checkbox {
                display: block;
                margin-left: 15px;
                margin-top: 5px;
            }
        }
    }
</style>