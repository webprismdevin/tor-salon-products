import{jsx as _jsx,jsxs as _jsxs}from"react/jsx-runtime";// Generated by Framer (3c7efdd)
import*as React from"react";import{motion,LayoutGroup}from"framer-motion";import{Image,addFonts,withCSS,addPropertyControls,ControlType,cx,useAddVariantProps,useVariantState,Text}from"framer";import{useRandomID}from"https://framer.com/m/framer/randomID.js@^2.0.0";const enabledGestures={"OKQZwDEzE":{"hover":true}};const cycleOrder=["OKQZwDEzE"];const variantClassNames={"OKQZwDEzE":"framer-v-1lxvv64"};const humanReadableVariantMap={};const transitions={"default":{"type":"spring","ease":[0.44,0,0.56,1],"duration":0.3,"delay":0,"stiffness":500,"damping":60,"mass":1}};const Component=/*#__PURE__*/ React.forwardRef(function({style:externalStyle={},className,width,height,layoutId,variant:outerVariant="OKQZwDEzE",title:uhFbABbzG="Medium/Thick",image:WbSBxg4Jb=new URL("assets/1024/WYWOEkQmRBKOhOPcWGNfOfgixs.jpg",import.meta.url).href,typeImage:w54mpus5k=new URL("assets/KDV5NDYhybpesoKr1plZDqFiY.png",import.meta.url).href,...restProps},ref){const outerVariantId=humanReadableVariantMap[outerVariant];const variant=outerVariantId||outerVariant;const{variants,baseVariant,gestureVariant,classNames,transition,setVariant,setGestureState}=useVariantState({defaultVariant:"OKQZwDEzE",variant,transitions,variantClassNames,enabledGestures,cycleOrder});const layoutDependency=variants.join("-")+restProps.layoutDependency;const variantProps=React.useMemo(()=>({}),[]);const addVariantProps=useAddVariantProps(baseVariant,gestureVariant,variantProps);const defaultLayoutId=useRandomID();const{pointerEvents,...style}=externalStyle;return(/*#__PURE__*/ _jsx(LayoutGroup,{id:layoutId!==null&&layoutId!==void 0?layoutId:defaultLayoutId,children:/*#__PURE__*/ _jsx(motion.div,{"data-framer-generated":true,initial:variant,animate:variants,onHoverStart:()=>setGestureState({isHovered:true}),onHoverEnd:()=>setGestureState({isHovered:false}),onTapStart:()=>setGestureState({isPressed:true}),onTap:()=>setGestureState({isPressed:false}),onTapCancel:()=>setGestureState({isPressed:false}),className:cx("framer-3koyO",classNames),style:{"display":"contents","pointerEvents":pointerEvents!==null&&pointerEvents!==void 0?pointerEvents:"auto"},children:/*#__PURE__*/ _jsxs(motion.div,{...restProps,layoutId:"OKQZwDEzE",className:cx("framer-1lxvv64",className),style:{...style},background:null,"data-framer-name":"Variant 1",transition:transition,layoutDependency:layoutDependency,ref:ref,...addVariantProps("OKQZwDEzE"),children:[/*#__PURE__*/ _jsx(Image,{layoutId:"H3hr9UE4D",className:"framer-ob2vxb",style:{"opacity":0},background:{"src":WbSBxg4Jb,"pixelWidth":5760,"pixelHeight":3840,"intrinsicWidth":5760,"intrinsicHeight":3840,"fit":"fill"},"data-framer-name":"HoverPhoto",alt:"",variants:{"OKQZwDEzE-hover":{"opacity":1}},transition:transition,layoutDependency:layoutDependency,...addVariantProps("H3hr9UE4D")}),/*#__PURE__*/ _jsx(Image,{layoutId:"Ve8xvjm3e",className:"framer-1i36amh",style:{"opacity":0.15,"rotate":35},background:{"src":w54mpus5k,"pixelWidth":5760,"pixelHeight":3840,"intrinsicWidth":5760,"intrinsicHeight":3840,"fit":"fill"},"data-framer-name":"HairType",alt:"",variants:{"OKQZwDEzE-hover":{"opacity":0}},transition:transition,layoutDependency:layoutDependency,...addVariantProps("Ve8xvjm3e")}),/*#__PURE__*/ _jsx(Text,{style:{"--framer-font-family":"\"Raleway\", serif","--framer-font-style":"normal","--framer-font-weight":400,"--framer-text-color":"rgb(0, 0, 0)","--framer-font-size":"56px","--framer-letter-spacing":"0px","--framer-text-transform":"none","--framer-text-decoration":"none","--framer-line-height":"1.2em","--framer-text-alignment":"start","--framer-link-text-color":"rgb(0, 153, 255)","--framer-link-text-decoration":"underline","opacity":1},withExternalLayout:true,verticalAlignment:"top",__fromCanvasComponent:true,fonts:["GF;Raleway-regular"],center:true,layoutId:"a4B8sGNGg",className:"framer-2dlb5e",rawHTML:"<span style='font-size: 0; line-height: 0; tab-size: 4; white-space: inherit; word-wrap: inherit'><span style='direction: ltr; font-size: 0'><span style=''>Medium/Thick</span><br></span></span>",text:uhFbABbzG,variants:{"OKQZwDEzE-hover":{"opacity":0}},transition:transition,layoutDependency:layoutDependency,...addVariantProps("a4B8sGNGg")})]})})}));});const css=[".framer-3koyO [data-border=\"true\"]::after { content: \"\"; border-width: var(--border-top-width, 0) var(--border-right-width, 0) var(--border-bottom-width, 0) var(--border-left-width, 0); border-color: var(--border-color, none); border-style: var(--border-style, none); width: 100%; height: 100%; position: absolute; box-sizing: border-box; left: 0; top: 0; border-radius: inherit; pointer-events: none;}","@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }",".framer-3koyO * { box-sizing: border-box; }",".framer-3koyO .framer-1lxvv64 { position: relative; overflow: visible; width: 480px; height: 425px; }",".framer-3koyO .framer-ob2vxb { position: absolute; overflow: hidden; width: 100%; height: 100%; left: 0px; top: 0px; flex: none; }",".framer-3koyO .framer-1i36amh { position: absolute; overflow: visible; width: 87%; height: 87%; left: 32px; top: 28px; flex: none; }",".framer-3koyO .framer-2dlb5e { position: absolute; width: auto; height: auto; left: 50%; top: 50%; flex: none; white-space: pre; }",".framer-3koyO.framer-v-1lxvv64 .framer-1lxvv64 { cursor: pointer; }"];/**
 * This is a generated Framer component.
 * @framerIntrinsicHeight 425
 * @framerIntrinsicWidth 480
 * @framerCanvasComponentVariantDetails {"propertyName": "variant", "data": {"default": {"layout": ["fixed", "fixed"]}, "K5ycB91qL": {"layout": ["fixed", "fixed"]}}}
 * @framerVariables {"uhFbABbzG": "title", "WbSBxg4Jb": "image", "w54mpus5k": "typeImage"}
 */ const Framerd4giQYcHW=withCSS(Component,css);export default Framerd4giQYcHW;Framerd4giQYcHW.displayName="Hair Type Large";Framerd4giQYcHW.defaultProps={"width":480,"height":425};addPropertyControls(Framerd4giQYcHW,{"uhFbABbzG":{"type":ControlType.String,"title":"Title","defaultValue":"Medium/Thick","displayTextArea":false},"WbSBxg4Jb":{"type":ControlType.Image,"title":"Image","__defaultAssetReference":"data:framer/asset-reference,WYWOEkQmRBKOhOPcWGNfOfgixs.jpg?originalFilename=woman+standing+next+to+pink+wall+while+scratching+her+head.jpg&preferredSize=medium"},"w54mpus5k":{"type":ControlType.Image,"title":"Type Image","__defaultAssetReference":"data:framer/asset-reference,KDV5NDYhybpesoKr1plZDqFiY.png?originalFilename=tor-thick_medium_hair.png&preferredSize=medium"}});addFonts(Framerd4giQYcHW,[{"url":"https://fonts.gstatic.com/s/raleway/v26/1Ptxg8zYS_SKggPN4iEgvnHyvveLxVvaooCPNLA3JC9c.ttf","family":"Raleway","style":"normal","weight":"400","moduleAsset":{"url":"https://fonts.gstatic.com/s/raleway/v26/1Ptxg8zYS_SKggPN4iEgvnHyvveLxVvaooCPNLA3JC9c.ttf","localModuleIdentifier":"local-module:canvasComponent/d4giQYcHW:default"}}]);
export const __FramerMetadata__ = {"exports":{"Props":{"type":"tsType","annotations":{"framerContractVersion":"1"}},"default":{"type":"reactComponent","name":"Framerd4giQYcHW","slots":[],"annotations":{"framerContractVersion":"1","framerCanvasComponentVariantDetails":"{\"propertyName\": \"variant\", \"data\": {\"default\": {\"layout\": [\"fixed\", \"fixed\"]}, \"K5ycB91qL\": {\"layout\": [\"fixed\", \"fixed\"]}}}","framerVariables":"{\"uhFbABbzG\": \"title\", \"WbSBxg4Jb\": \"image\", \"w54mpus5k\": \"typeImage\"}","framerIntrinsicWidth":"480","framerIntrinsicHeight":"425"}},"__FramerMetadata__":{"type":"variable"}}}
//# sourceMappingURL=./d4giQYcHW.map