(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{150:function(e,t,r){"use strict";(function(e){var n=r(157),l={jpg:"image/jpeg",jpeg:"image/jpeg",png:"image/png",webp:"image/webp"};t.a={props:{loading:{type:String,required:!1,default:()=>"auto"},sourceClientOnly:{type:Boolean,required:!1,default:()=>!0},placeholder:{type:String,required:!1,default:()=>"data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="},sources:{type:[Array,Object],default:()=>[{media:"default",srcset:"img/sample-a-16-9/412x232.jpg"},{media:"xs",srcset:"img/sample-a-16-9/768x432.jpg"},{media:"sm",srcset:"img/sample-a-16-9/992x558.jpg"},{media:"md",srcset:"img/sample-a-16-9/1200x675.jpg"},{media:"lg",srcset:"img/sample-a-16-9/1600x900.jpg"},{media:"xl",srcset:"img/sample-a-16-9/1920x1080.jpg"}]},width:{type:Number,required:!1,default:()=>null},height:{type:Number,required:!1,default:()=>null},title:{type:String,required:!1,default:()=>"image title"},alt:{type:String,required:!1,default:()=>"image description"}},computed:{sorted(){return function(e,pattern){return e.sort((function(a,b){return pattern.indexOf(a.media)===pattern.indexOf(b.media)?0:pattern.indexOf(a.media)>pattern.indexOf(b.media)?1:-1}))}([].concat(this.sources),Array.from(n.a.keys())).reverse()},items(){return this.sorted.map(source=>{var e;return(source=Object.assign({},source)).type="",this.sourceClientOnly,source.type=l[(e=source.srcset.replace(/.*\.(\w{3,4}).*$/,"$1"),/\w+$/.exec(e)[0])],source.media=n.a.get(source.media),source})}},methods:{onLoad(){"objectFitImages"in e&&e.objectFitImages(this.$el.querySelector("img"))}}}}).call(this,r(12))},151:function(e,t,r){var content=r(160);"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,r(23).default)("baea8822",content,!0,{sourceMap:!1})},157:function(e,t,r){"use strict";var n,l=r(158),m=new Map(Object.entries(l));t.a=(n=new Map,m.forEach((e,t)=>{n.set(t.replace("--",""),e)}),n)},158:function(e){e.exports=JSON.parse('{"--default":"all","--default-max":"(max-width: 575px)","--xs":"(min-width: 576px)","--xs-max":"(max-width: 767px)","--sm":"(min-width: 768px)","--sm-max":"(max-width: 991px)","--md":"(min-width: 992px)","--md-max":"(max-width: 1199px)","--lg":"(min-width: 1200px)","--lg-max":"(max-width: 1599px)","--xl":"(min-width: 1600px)","--xl-max":"(max-width: 1919px)","--xxl":"(min-width: 1920px)"}')},159:function(e,t,r){"use strict";var n=r(151);r.n(n).a},160:function(e,t,r){(t=r(22)(!1)).push([e.i,"picture,picture img{display:block}picture img{width:100%;max-width:100%}",""]),e.exports=t},161:function(e,t){},162:function(e,t,r){"use strict";var n=r(150).a,l=(r(159),r(7)),m=r(161),o=r.n(m),component=Object(l.a)(n,(function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("picture",{staticClass:"atom-responsive-image"},[e._l(e.items,(function(source,t){return r("source",e._b({key:t},"source",source,!1))})),e._v(" "),r("img",{attrs:{src:e.placeholder,alt:e.alt,title:e.title,loading:e.loading,width:e.width,height:e.height},on:{load:e.onLoad}})],2)}),[],!1,null,null,null);"function"==typeof o.a&&o()(component);t.a=component.exports},193:function(e,t){},91:function(e,t,r){"use strict";r.r(t);var n=r(64),l=r(162),m={components:{LayoutDefaultContainer:n.a,AtomResponsiveImage:l.a},props:{options:{type:Object,default:()=>({})},picture:{type:Object,required:!1,default:()=>({sources:[{media:"default",srcset:"img/sample-a-16-9/412x232.jpg"},{media:"xs",srcset:"img/sample-a-16-9/768x432.jpg"},{media:"sm",srcset:"img/sample-a-16-9/992x558.jpg"},{media:"md",srcset:"img/sample-a-16-9/1200x675.jpg"},{media:"lg",srcset:"img/sample-a-16-9/1600x900.jpg"},{media:"xl",srcset:"img/sample-a-16-9/1920x1080.jpg"}]})}}},o=r(7),c=r(193),d=r.n(c),component=Object(o.a)(m,(function(){var e=this.$createElement,t=this._self._c||e;return t("layout-default-container",this._b({staticClass:"organism-stage-picture"},"layout-default-container",this.options,!1),[t("template",{slot:"background"},[this.picture?t("atom-responsive-image",this._b({},"atom-responsive-image",this.picture,!1)):this._e()],1)],2)}),[],!1,null,null,null);"function"==typeof d.a&&d()(component);t.default=component.exports}}]);