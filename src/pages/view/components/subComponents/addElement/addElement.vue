<template>
    <div>
        <i class="iconfont icon-mark" @click="add">
        </i>
    </div>
    
</template>

<script>
import {IModelApp, SpatialModelState,PrimitiveTool, EventHandled} from "@bentley/imodeljs-frontend";

export default {
    name: 'imodelmark',
    data () {
        return {
            tips:'add',
            
        };
    },
    components: {
        
    },
    created () {
        
    },
    methods: {
        register(toolNamespace){
                let that = this;
                class AddTool extends PrimitiveTool {
                constructor() {
                    super(...arguments);
                    this.points = [];
                }
                isCompatibleViewport(vp, isSelectedViewChange) { return (super.isCompatibleViewport(vp, isSelectedViewChange) && undefined !== vp && vp.view.isSpatialView()); }
                requireWriteableTarget(){ return false; }
                onPostInstall() { super.onPostInstall(); this.setupAndPromptForNextAction(); }

                setupAndPromptForNextAction() {
                    IModelApp.accuSnap.enableSnap(true);
                }

                onDynamicFrame(ev, context) {
                    // const curSnapDetail = IModelApp.accuSnap.getCurrSnapDetail();
                    // if (curSnapDetail) {
                    //     const builder = context.createSceneGraphicBuilder();
                    //     builder.setSymbology(context.viewport.getContrastToBackgroundColor(), ColorDef.white, 1);
                    //     const polyface = drawTetrahedron(curSnapDetail.snapPoint.clone(), 2);
                    //     // const polyface = drawTriangleMesh(curSnapDetail.snapPoint.clone(), 2);
                    //     builder.addPolyface(polyface, true);
                    //     context.addGraphic(builder.finish());
                    // }
                }
            
                async onDataButtonDown(ev){
                  const curSnapDetail = IModelApp.accuSnap.getCurrSnapDetail();
                  console.log("curSnapDetail",curSnapDetail);
                  if (curSnapDetail){
                      let param = {
                        imodeltoken:JSON.stringify(that.GLOBAL_DATA.activeViewState.iModelConnection.iModelToken),
                        modelId:curSnapDetail.modelId,
                        subCategoryId:'0x20000000008',
                        hitPoint:curSnapDetail.snapPoint.clone(),
                        url: that.$route.query.url,
                        iModelId: that.$route.query.projectId,
                      }
                        
                      that.$post('api/view/mark',param).then(async res=>{
                            await that.refreshViews();
                    })
                 }
                  
                  return EventHandled.No;
     
                }
            }

            AddTool.toolId = 'iModelWeb.Add';
            AddTool.register(toolNamespace);
        },
        async refreshViews() {
            IModelApp.viewManager.forEachViewport(async vp => {
                const view = vp.view;
                const query = { from: SpatialModelState.classFullName, wantPrivate: false };
                const propList = await view.iModel.models.queryProps(query);
                const ids= [];
                propList.forEach(prop => {
                    if (undefined === prop.id || undefined === prop.name) {
                        return;
                    }
                    let model = view.iModel.models.getLoaded(prop.id);
                    if (undefined === model) {
                        return;
                    }
                    ids.push(prop.id);
                });
                await IModelApp.viewManager.refreshForModifiedModels(ids);
            });
        },
        add() {
            this.active = !this.active;
            if(this.active){
                IModelApp.tools.run("iModelWeb.Add");
            }else{
                
            }
            
        },
        
    }
    
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

</style>