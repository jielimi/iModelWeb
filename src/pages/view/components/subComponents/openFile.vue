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
            <el-button @click="dialogVisible = false">cancel</el-button>
            <el-button type="primary" @click="openFile">confirm</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
import { IModelApp,IModelConnection,ScreenViewport } from "@bentley/imodeljs-frontend";
//import * as frontend_1 from "@bentley/imodeljs-frontend/lib/frontend"
class SimpleViewState {
    constructor(){};
}
export default {
    name: 'openFile',
    data () {
        return {
            dialogVisible:false,
            inputFileUrl:'',
            standalone: false
        };
    },
    components: {
        
    },
    beforeCreate(){
      
    },
    created () {
        let that = this;
        window.onbeforeunload = () =>{
            this.clearViews();
            return 'tips';
        }
        window.eventHub.$on('open_standalone',this.openFileFromProject);
    },
    beforeDestroy(){
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
           
                IModelApp.viewManager.dropViewport(GLOBAL_DATA.theViewPort, false);
                
                await this.clearViews();
                 
                await this.openStandaloneIModel(GLOBAL_DATA.activeViewState, filename);
                
                await this.openView(GLOBAL_DATA.activeViewState);

                window.eventHub.$emit('categories_init');
                window.eventHub.$emit('render_mode_init');
                window.eventHub.$emit('render_model_init');
                this.standalone = true;
                this.dialogVisible = false;
        },
        async clearViews() {
            if (GLOBAL_DATA.activeViewState.iModelConnection !== undefined){
                
                if(this.standalone){
                    await GLOBAL_DATA.activeViewState.iModelConnection.closeSnapshot();
                }else {
                    await GLOBAL_DATA.activeViewState.iModelConnection.close();
                }

                GLOBAL_DATA.activeViewState = new SimpleViewState();
            }
        },
        async openStandaloneIModel(state, filename) {
            state.iModelConnection = await IModelConnection.openSnapshot(filename);
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

            window.eventHub.$emit('viewList_init', viewSpecs);
        },
        async  openView(state) {
            const parent = document.getElementById("imodelview");
            if (parent) {
                await this.buildViewList(state);
               
               
                if (!GLOBAL_DATA.theViewPort){
                    GLOBAL_DATA.theViewPort = ScreenViewport.create(parent, state.viewState);
                }
                IModelApp.viewManager.addViewport(GLOBAL_DATA.theViewPort);
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