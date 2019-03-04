<template>
    <div>
        <i class="iconfont icon-Open- relative" @click="dialogVisible=true;inputFileUrl='';" >
        </i>
        <el-dialog
        :visible.sync="dialogVisible"
        width="30%"
        >
        <el-input v-model.trim="inputFileUrl" placeholder=""></el-input>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">cancle</el-button>
            <el-button type="primary" @click="openFile">confirm</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
import { IModelApp,IModelConnection } from "@bentley/imodeljs-frontend";
import * as frontend_1 from "@bentley/imodeljs-frontend/lib/frontend"
class SimpleViewState {
    constructor(){};
}
export default {
    name: 'openFile',
    data () {
        return {
            dialogVisible:false,
            inputFileUrl:'',
            theViewPort:undefined,
            standalone: false
        };
    },
    components: {
        
    },
    created () {
        window.eventHub.$on('open_standalone',this.openFileFromProject);
    },
    beforeDestroy(){
        // if (this.GLOBAL_DATA.theViewPort){
        //     IModelApp.viewManager.dropViewport(this.GLOBAL_DATA.theViewPort);
        // }

        // if (this.GLOBAL_DATA.activeViewState.iModelConnection !== undefined){
        //     this.GLOBAL_DATA.activeViewState.iModelConnection.closeStandalone();
        // }
        
        this.clearViews()
    },
    methods: {
        openFileFromProject(inputFileUrl){
            this.resetStandaloneIModel(inputFileUrl)
        },
        openFile(){
            if(this.inputFileUrl){
                this.resetStandaloneIModel(this.inputFileUrl)
            }
            

        },
        async resetStandaloneIModel(filename) {
                IModelApp.viewManager.dropViewport(this.GLOBAL_DATA.theViewPort, false);
                await this.clearViews();
                await this.openStandaloneIModel(this.GLOBAL_DATA.activeViewState, filename);
                // await this.buildViewList(this.GLOBAL_DATA.activeViewState);
                await this.openView(this.GLOBAL_DATA.activeViewState);
                window.eventHub.$emit('categories_init');
                window.eventHub.$emit('render_mode_init');
                window.eventHub.$emit('render_model_init');
                this.standalone = true;
                this.dialogVisible = false;
        },
        async clearViews() {
            // await this.GLOBAL_DATA.activeViewState.iModelConnection.closeStandalone();
            if (this.GLOBAL_DATA.activeViewState.iModelConnection !== undefined){
                
                if(this.standalone){
                    await this.GLOBAL_DATA.activeViewState.iModelConnection.closeStandalone();
                }else {
                    await this.GLOBAL_DATA.activeViewState.iModelConnection.close(this.GLOBAL_DATA.activeViewState.accessToken);
                }
                
                this.GLOBAL_DATA.activeViewState = new SimpleViewState();
            }
                // viewMap.clear(); 通知清除下记得
        },
        async openStandaloneIModel(state, filename) {
            state.iModelConnection = await IModelConnection.openStandalone(filename);
        },
        async buildViewList(state, configurations) {
            const config = undefined !== configurations ? configurations : {};
            const viewQueryParams = { wantPrivate: false };
            const viewSpecs = await state.iModelConnection.views.getViewList(viewQueryParams);
            
            if (viewSpecs.length > 0){
                let viewSpec = viewSpecs[0];
                const viewState = await state.iModelConnection.views.load(viewSpec.id);
                state.viewState = viewState;
            }
            console.log(viewSpecs);
            window.eventHub.$emit('viewList_init', viewSpecs);
        },
        async  openView(state) {
        // find the canvas.
            const parent = document.getElementById("imodelview");
            if (parent) {
                //var htmlCanvas = parent.children[0];
                console.log("GET THE VIEWPORT 1")
                //console.log(htmlCanvas)
                //if (!htmlCanvas) return;
                await this.buildViewList(state);
                console.log(state.viewState);
                this.theViewPort = frontend_1.ScreenViewport.create(parent, state.viewState); 
                this.GLOBAL_DATA.theViewPort = this.theViewPort;
                //new frontend_1.ScreenViewport(parent);
                console.log("GET THE VIEWPORT 2")
                console.log(this.theViewPort)
                IModelApp.viewManager.addViewport(this.theViewPort);
                console.log('the end')
            }
        },

    }
    
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.relative{
    position: relative;
}
.address{
    top: 0;
    opacity: 0;
    position: absolute;
    width: 44px;
    height: 44px;
    left: 0;
}

</style>