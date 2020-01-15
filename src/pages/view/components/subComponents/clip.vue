<template>
    <div>
        <i class="iconfont icon-cut1 isolote" @click="clip" style="display: inline-block;">
             <div v-show="showPop" class="detail">
                <el-form>
                    <el-form-item label="Clip Type:">
                        <el-select v-model="style" size="mini" @change="handleClipStyleChange">
                            <el-option v-for="item in entries" :label="item.name" :key="item.value" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
				</el-form>
                <el-button-group>
					<el-button size="mini" @click="define">Define</el-button>
					<el-button size="mini" @click="edit">Edit</el-button>
					<el-button size="mini" @click="clear">Clear</el-button>
				</el-button-group>
            </div>
        </i>
    </div>
</template>

<script>
import { IModelApp, ViewClipDecorationProvider,Viewport, } from "@bentley/imodeljs-frontend";

export default {
    name: 'clip',
    data () {
        return {
            showPop:false,
            style:'ViewClip.ByPlane',
            entries: [
                { name: "Plane", value: "ViewClip.ByPlane" },
                { name: "Range", value: "ViewClip.ByRange" },
                { name: "Element", value: "ViewClip.ByElement" },
                { name: "Shape", value: "ViewClip.ByShape" },
            ],
        };
    },
    components: {
        
    },
    created () {},
    methods: {
        clip(){
            this.showPop = !this.showPop
        },
        handleClipStyleChange(){

        },
        setFocusToHome(){
            const element = document.activeElement;
            if (element && element !== document.body) {
                element.blur();
                document.body.focus();
            }
        },
        define(){
            IModelApp.tools.run(this.style, ViewClipDecorationProvider.create());
            this.setFocusToHome();

        },
        edit(){
            ViewClipDecorationProvider.create().toggleDecoration(IModelApp.viewManager.selectedView);
        },
        clear(){
            IModelApp.tools.run("ViewClip.Clear", ViewClipDecorationProvider.create())
        }
    }
    
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.isolote {
    position: relative;
    .detail {
        position: absolute;
        text-align: center;
        left: 38px;
        top: 0;
        z-index: 999;
        width: 300px;
        max-height: 350px;
        overflow-y: auto;
        padding-bottom: 10px;
        text-align: left;
        border: 1px solid #666;
        background-color: #E9F2F9;
        padding-top: 10px;
        .el-checkbox {
            display: block;
            margin-left: 15px;
            margin-top: 10px;
        }
    }
}
</style>