(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{195:function(e,t,n){"use strict";n.r(t);var r={components:{LayoutDefaultContainer:n(141).a},props:{options:{type:Object,default:function(){return{mirror:!1}}}},computed:{styleClasses:function(){return{"column-align--left":!this.options.mirror,"column-align--right":this.options.mirror}}}},l=(n(358),n(13)),o=Object(l.a)(r,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("layout-default-container",{staticClass:"layout-two-column-container",class:e.styleClasses,attrs:{visible:e.options.visible},scopedSlots:e._u([{key:"background",fn:function(){return[e._t("background")]},proxy:!0},{key:"container",fn:function(){return[n("div",{staticClass:"lost-flex-container"},[n("div",[e._t("left")],2),e._v(" "),n("div",[e._t("right")],2)])]},proxy:!0}],null,!0)})}),[],!1,null,null,null).exports,c=n(330),m=n(301),d={components:{LayoutTwoColumnContainer:o,MoleculeContentArticle:c.a,AtomResponsiveImage:m.a},props:{options:{type:Object,default:function(){return null}},article:{type:Object,default:function(){return{headline:{overline:"Text Image Overline",headline:"Text Image Headline",subline:"Text Image Subline"},content:"<p>Scelerisque morbi blandit voluptate possimus vitae illum tristique, atque perspiciatis maecenas laudantium! Morbi, venenatis purus amet, rem eius ligula! Penatibus eleifend curabitur temporibus asperiores tempora cum accumsan egestas viverra laborum.</p><p>Arcu primis enim, parturient! Excepturi adipisci! Incidunt quibusdam ex. Non, impedit est. Ullam eiusmod semper pretium necessitatibus nostrum voluptatem ullamcorper, hac condimentum! Vestibulum rhoncus? Impedit culpa, error tempus. Ligula diam.</p>"}}},picture:{type:Object,required:!1,default:function(){return{sources:[{media:"default",srcset:"img/sample-b-16-9/412x232.jpg 1x, img/sample-b-16-9/retina/824x464.jpg 2x"},{media:"xs",srcset:"img/sample-b-16-9/768x432.jpg 1x, img/sample-b-16-9/retina/1536x864.jpg 2x"},{media:"sm",srcset:"img/sample-b-16-9/992x558.jpg 1x, img/sample-b-16-9/retina/1984x1116.jpg 2x"},{media:"md",srcset:"img/sample-b-16-9/1200x675.jpg 1x, img/sample-b-16-9/retina/2400x1350.jpg 2x"},{media:"lg",srcset:"img/sample-b-16-9/1600x900.jpg 1x, img/sample-b-16-9/retina/3200x1800.jpg 2x"},{media:"xl",srcset:"img/sample-b-16-9/1920x1080.jpg 1x, img/sample-b-16-9/retina/3840x2160.jpg 2x"}]}}}}},f=n(360),h=n.n(f),x=Object(l.a)(d,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("layout-two-column-container",{staticClass:"organism-text-image",attrs:{options:e.options},scopedSlots:e._u([{key:"left",fn:function(){return[n("atom-responsive-image",e._b({},"atom-responsive-image",e.picture,!1))]},proxy:!0},{key:"right",fn:function(){return[n("molecule-content-article",e._b({},"molecule-content-article",e.article,!1))]},proxy:!0}])})}),[],!1,null,null,null);"function"==typeof h.a&&h()(x);t.default=x.exports},286:function(e,t,n){"use strict";(function(e){n(81),n(19),n(8),n(24),n(32),n(293);var r=n(296),l={jpg:"image/jpeg",jpeg:"image/jpeg",png:"image/png",webp:"image/webp"};t.a={props:{loading:{type:String,required:!1,default:function(){return"auto"}},sourceClientOnly:{type:Boolean,required:!1,default:function(){return!0}},placeholder:{type:String,required:!1,default:function(){return"data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="}},sources:{type:[Array,Object],default:function(){return[{media:"default",srcset:"img/sample-a-16-9/412x232.jpg"},{media:"xs",srcset:"img/sample-a-16-9/768x432.jpg"},{media:"sm",srcset:"img/sample-a-16-9/992x558.jpg"},{media:"md",srcset:"img/sample-a-16-9/1200x675.jpg"},{media:"lg",srcset:"img/sample-a-16-9/1600x900.jpg"},{media:"xl",srcset:"img/sample-a-16-9/1920x1080.jpg"}]}},width:{type:Number,required:!1,default:function(){return null}},height:{type:Number,required:!1,default:function(){return null}},title:{type:String,required:!1,default:function(){return"image title"}},alt:{type:String,required:!1,default:function(){return"image description"}}},computed:{sorted:function(){return function(e,pattern){return e.sort((function(a,b){return pattern.indexOf(a.media)===pattern.indexOf(b.media)?0:pattern.indexOf(a.media)>pattern.indexOf(b.media)?1:-1}))}([].concat(this.sources),Array.from(r.a.keys())).reverse()},items:function(){var e=this;return this.sorted.map((function(source){var t;return(source=Object.assign({},source)).type="",e.sourceClientOnly,source.type=l[(t=source.srcset.replace(/.*\.(\w{3,4}).*$/,"$1"),/\w+$/.exec(t)[0])],source.media=r.a.get(source.media),source}))}},methods:{onLoad:function(){"objectFitImages"in e&&e.objectFitImages(this.$el.querySelector("img"))}}}}).call(this,n(31))},287:function(e,t,n){var content=n(299);"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,n(56).default)("baea8822",content,!0,{sourceMap:!1})},288:function(e,t,n){var content=n(304);"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,n(56).default)("9249fa74",content,!0,{sourceMap:!1})},289:function(e,t,n){var content=n(307);"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,n(56).default)("6eccebc0",content,!0,{sourceMap:!1})},290:function(e,t,n){var content=n(310);"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,n(56).default)("e31edbf0",content,!0,{sourceMap:!1})},293:function(e,t,n){"use strict";var r=n(10),l=n(47),o=n(57),c=n(142),m=n(111),d=n(18),f=n(82).f,h=n(113).f,x=n(20).f,v=n(294).trim,y=r.Number,w=y,_=y.prototype,A="Number"==o(n(112)(_)),j="trim"in String.prototype,I=function(e){var t=m(e,!1);if("string"==typeof t&&t.length>2){var n,r,l,o=(t=j?t.trim():v(t,3)).charCodeAt(0);if(43===o||45===o){if(88===(n=t.charCodeAt(2))||120===n)return NaN}else if(48===o){switch(t.charCodeAt(1)){case 66:case 98:r=2,l=49;break;case 79:case 111:r=8,l=55;break;default:return+t}for(var code,c=t.slice(2),i=0,d=c.length;i<d;i++)if((code=c.charCodeAt(i))<48||code>l)return NaN;return parseInt(c,r)}}return+t};if(!y(" 0o1")||!y("0b1")||y("+0x1")){y=function(e){var t=arguments.length<1?0:e,n=this;return n instanceof y&&(A?d((function(){_.valueOf.call(n)})):"Number"!=o(n))?c(new w(I(t)),n,y):I(t)};for(var O,C=n(14)?f(w):"MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger".split(","),E=0;C.length>E;E++)l(w,O=C[E])&&!l(y,O)&&x(y,O,h(w,O));y.prototype=_,_.constructor=y,n(25)(r,"Number",y)}},294:function(e,t,n){var r=n(11),l=n(48),o=n(18),c=n(295),m="["+c+"]",d=RegExp("^"+m+m+"*"),f=RegExp(m+m+"*$"),h=function(e,t,n){var l={},m=o((function(){return!!c[e]()||"​"!="​"[e]()})),d=l[e]=m?t(x):c[e];n&&(l[n]=d),r(r.P+r.F*m,"String",l)},x=h.trim=function(e,t){return e=String(l(e)),1&t&&(e=e.replace(d,"")),2&t&&(e=e.replace(f,"")),e};e.exports=h},295:function(e,t){e.exports="\t\n\v\f\r   ᠎             　\u2028\u2029\ufeff"},296:function(e,t,n){"use strict";n(81),n(192),n(19),n(8),n(24),n(144);var r,l=n(297),o=new Map(Object.entries(l));t.a=(r=new Map,o.forEach((function(e,t){r.set(t.replace("--",""),e)})),r)},297:function(e){e.exports=JSON.parse('{"--default":"all","--default-max":"(max-width: 575px)","--xs":"(min-width: 576px)","--xs-max":"(max-width: 767px)","--sm":"(min-width: 768px)","--sm-max":"(max-width: 991px)","--md":"(min-width: 992px)","--md-max":"(max-width: 1199px)","--lg":"(min-width: 1200px)","--lg-max":"(max-width: 1599px)","--xl":"(min-width: 1600px)","--xl-max":"(max-width: 1919px)","--xxl":"(min-width: 1920px)"}')},298:function(e,t,n){"use strict";var r=n(287);n.n(r).a},299:function(e,t,n){(t=n(55)(!1)).push([e.i,"picture,picture img{display:block}picture img{width:100%;max-width:100%}",""]),e.exports=t},300:function(e,t){},301:function(e,t,n){"use strict";var r=n(286).a,l=(n(298),n(13)),o=n(300),c=n.n(o),component=Object(l.a)(r,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("picture",{staticClass:"atom-responsive-image"},[e._l(e.items,(function(source,t){return n("source",e._b({key:t},"source",source,!1))})),e._v(" "),n("img",{attrs:{src:e.placeholder,alt:e.alt,title:e.title,loading:e.loading,width:e.width,height:e.height},on:{load:e.onLoad}})],2)}),[],!1,null,null,null);"function"==typeof c.a&&c()(component);t.a=component.exports},302:function(e,t,n){"use strict";var r={props:{content:{type:String,required:!1,default:"<p>Example Text</p>"}}},l=(n(306),n(13)),o=n(308),c=n.n(o),component=Object(l.a)(r,(function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"atom-rich-text"},[this.$slots.default?this._e():t("div",{domProps:{innerHTML:this._s(this.content)}}),this._v(" "),this._t("default")],2)}),[],!1,null,"2abd1e12",null);"function"==typeof c.a&&c()(component);t.a=component.exports},303:function(e,t,n){"use strict";var r=n(288);n.n(r).a},304:function(e,t,n){(t=n(55)(!1)).push([e.i,".atom-headline[data-v-017497a1]{font-style:normal;font-weight:400;line-height:1.5}.atom-headline>*[data-v-017497a1]{display:block}.atom-headline.headline--h2 .overline[data-v-017497a1],.atom-headline.headline--h2 .subline[data-v-017497a1]{font-size:3.2vw;font-weight:400}@media (min-width:576px){.atom-headline.headline--h2 .overline[data-v-017497a1],.atom-headline.headline--h2 .subline[data-v-017497a1]{font-size:12px}}.font_raleway .js--visible .atom-headline.headline--h2 .overline[data-v-017497a1],.font_raleway .js--visible .atom-headline.headline--h2 .subline[data-v-017497a1]{font-family:Raleway,sans-serif}.font_raleway_500_normal .js--visible .atom-headline.headline--h2 .subline[data-v-017497a1]{font-weight:500}.atom-headline.headline--h2 .headline[data-v-017497a1]{font-size:9.6vw}@media (min-width:576px){.atom-headline.headline--h2 .headline[data-v-017497a1]{font-size:36px}}.font_amatic_sc .js--visible .atom-headline.headline--h2 .headline[data-v-017497a1]{font-family:Amatic SC,serif}.font_amatic_sc_700_normal .js--visible .atom-headline.headline--h2 .headline[data-v-017497a1]{font-weight:700}",""]),e.exports=t},305:function(e,t){},306:function(e,t,n){"use strict";var r=n(289);n.n(r).a},307:function(e,t,n){(t=n(55)(!1)).push([e.i,".atom-rich-text b[data-v-2abd1e12],.atom-rich-text em[data-v-2abd1e12],.atom-rich-text i[data-v-2abd1e12],.atom-rich-text strong[data-v-2abd1e12]{font-style:normal;font-weight:400}.atom-rich-text[data-v-2abd1e12]{font-family:sans-serif;font-size:4.26667vw;font-weight:400}@media (min-width:576px){.atom-rich-text[data-v-2abd1e12]{font-size:16px}}.font_raleway .js--visible .atom-rich-text[data-v-2abd1e12]{font-family:Raleway,sans-serif}",""]),e.exports=t},308:function(e,t){},309:function(e,t,n){"use strict";var r=n(290);n.n(r).a},310:function(e,t,n){(t=n(55)(!1)).push([e.i,"",""]),e.exports=t},330:function(e,t,n){"use strict";var r={props:{tag:{type:String,required:!1,default:function(){return"h1"}},overline:{type:String,required:!1,default:function(){return"Lorem Overline"}},headline:{type:String,required:!1,default:function(){return"Lorem Headline"}},subline:{type:String,required:!1,default:function(){return"Lorem Subline"}}},computed:{styleClasses:function(){var e={};return e["headline--".concat(this.tag)]=!0,e}}},l=(n(303),n(13)),o=n(305),c=n.n(o),component=Object(l.a)(r,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n(e.tag,{tag:"component",staticClass:"atom-headline",class:e.styleClasses},[e._t("default",[e.$slots.overline||e.overline?n("span",{staticClass:"overline"},[e._t("overline",[e._v("\n        "+e._s(e.overline)+"\n      ")])],2):e._e(),e._v(" "),e.$slots.headline||e.headline?n("span",{staticClass:"headline"},[e._t("headline",[e._v("\n        "+e._s(e.headline)+"\n      ")])],2):e._e(),e._v(" "),e.$slots.subline||e.subline?n("span",{staticClass:"subline"},[e._t("subline",[e._v("\n        "+e._s(e.subline)+"\n      ")])],2):e._e()])],2)}),[],!1,null,"017497a1",null);"function"==typeof c.a&&c()(component);var m={components:{AtomHeadline:component.exports,AtomRichText:n(302).a},props:{headline:{type:Object,default:function(){return{overline:"Article Overline",headline:"Article Headline",subline:"Article Subline"}}},content:{type:String,default:function(){return"<p>Example Text</p>"}}}},d=(n(309),Object(l.a)(m,(function(){var e=this.$createElement,t=this._self._c||e;return t("article",{staticClass:"molecule-article"},[this.headline?t("header",[t("atom-headline",this._b({attrs:{tag:"h2"}},"atom-headline",this.headline,!1))],1):this._e(),this._v(" "),this._t("default",[t("atom-rich-text",{attrs:{content:this.content}})])],2)}),[],!1,null,null,null));t.a=d.exports},341:function(e,t,n){var content=n(359);"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,n(56).default)("f9b612a8",content,!0,{sourceMap:!1})},358:function(e,t,n){"use strict";var r=n(341);n.n(r).a},359:function(e,t,n){(t=n(55)(!1)).push([e.i,".layout-two-column-container .lost-flex-container{align-items:center}@media (max-width:767px){.layout-two-column-container .lost-flex-container{flex-direction:column}}.layout-two-column-container .lost-flex-container>div{flex-grow:0;flex-shrink:0;flex-basis:99.9%;max-width:99.9%;width:99.9%}.layout-two-column-container .lost-flex-container>div:nth-child(1n){margin-right:15px;margin-left:0}.layout-two-column-container .lost-flex-container>div:last-child{margin-right:0}.layout-two-column-container .lost-flex-container>div:nth-child(12n){margin-right:0;margin-left:auto}@media (min-width:768px){.layout-two-column-container .lost-flex-container>div{flex-grow:0;flex-shrink:0;flex-basis:calc(49.95% - 7.5px);max-width:calc(49.95% - 7.5px);width:calc(49.95% - 7.5px)}.layout-two-column-container .lost-flex-container>div:nth-child(1n){margin-right:15px;margin-left:0}.layout-two-column-container .lost-flex-container>div:last-child{margin-right:0}.layout-two-column-container .lost-flex-container>div:nth-child(12n){margin-right:0;margin-left:auto}}.layout-two-column-container.column-align--left .lost-flex-container>div:first-child{order:0}.layout-two-column-container.column-align--left .lost-flex-container>div:last-child{order:1}.layout-two-column-container.column-align--right .lost-flex-container>div:first-child{order:1}.layout-two-column-container.column-align--right .lost-flex-container>div:last-child{order:0}",""]),e.exports=t},360:function(e,t){}}]);