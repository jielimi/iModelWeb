<template>
    <div>
        <i class="iconfont icon-mark" @click="add">
        </i>
    </div>
    
</template>

<script>
import {IModelApp, SpatialModelState,PrimitiveTool, EventHandled,LocateResponse} from "@bentley/imodeljs-frontend";
const { IndexedPolyface, Point3d, Vector3d } = require("@bentley/geometry-core");
import { ColorDef } from '@bentley/imodeljs-common';
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
        drawTriangleMesh(point, base) {
            const polyface = IndexedPolyface.create();
            const x = point.x;
            const y = point.y;
            const z = point.z;
            const point1 = Point3d.create(x + base, y, z);
            const point2 = Point3d.create(x, y + base, z);
            const point3 = Point3d.create(x, y, z);
            polyface.addPoint(point1);
            polyface.addPoint(point2);
            polyface.addPoint(point3);
            polyface.addPointIndex(0);
            polyface.addPointIndex(1);
            polyface.addPointIndex(2);
            polyface.terminateFacet();
            polyface.data.compress();
            return polyface;
        },
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
                    if (!this.isDynamicsStarted) {
                        IModelApp.viewManager.beginDynamicsMode();
                    }
                }

                onDynamicFrame(ev, context) {
                    const curSnapDetail = IModelApp.accuSnap.getCurrSnapDetail();
                    
                    // const secondPt = curSnapDetail ? curSnapDetail.snapPoint.clone() : ev.point;
                    // const builder = context.createSceneGraphicBuilder();
                    // const polyface = that.drawTriangleMesh(secondPt, 20);
                    // if (polyface) {
                    //     // builder.setSymbology(ColorDef.red, ColorDef.red, 1);
                    //     // builder.addLineString([this.firstPoint, secondPt]);
                    //     builder.setSymbology(ColorDef.green, ColorDef.green, 1);
                    //     builder.addPolyface(polyface, true);
                    //     context.addGraphic(builder.finish());
                    // }
                    
                }
            
                async onDataButtonDown(ev){
                  const curSnapDetail = IModelApp.accuSnap.getCurrSnapDetail();
                  const currHit = await IModelApp.locateManager.doLocate(new LocateResponse(), true, ev.point, ev.viewport, ev.inputSource);
                  console.log("currHit",currHit)
                  console.log("curSnapDetail",curSnapDetail);
                  if (curSnapDetail){
                      let param = {
                        imodeltoken:JSON.stringify(IModelApp.viewManager.selectedView.view.iModel._token),
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