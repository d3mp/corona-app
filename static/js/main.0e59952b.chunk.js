(this["webpackJsonpcorona-app"]=this["webpackJsonpcorona-app"]||[]).push([[0],{121:function(e,t,a){e.exports={tooltip:"Tooltip_tooltip__32Y0_"}},122:function(e,t,a){e.exports={mapContainer:"Map_mapContainer__2g7jF"}},125:function(e,t,a){e.exports=a(198)},194:function(e,t,a){},196:function(e,t,a){},197:function(e,t,a){},198:function(e,t,a){"use strict";a.r(t);var n,r=a(0),o=a.n(r),c=a(27),i=a.n(c),l=a(13),u=a(23);function s(e,t){var a=Object(r.useState)((function(){try{var a=localStorage.getItem(e);return a?JSON.parse(a):t}catch(n){return console.warn(n),t}})),n=Object(u.a)(a,2),o=n[0],c=n[1];return[o,Object(r.useCallback)((function(t){try{c(t),localStorage.setItem(e,JSON.stringify(t))}catch(a){console.warn(a)}}),[e,c])]}!function(e){e.Light="light",e.Dark="dark"}(n||(n={}));var d=o.a.createContext({theme:null,switchTheme:function(e){}});function m(e){var t=e.children,a=s("theme",window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?n.Dark:n.Light),c=Object(u.a)(a,2),i=c[0],l=c[1];return Object(r.useLayoutEffect)((function(){var e=i===n.Dark?n.Light:n.Dark,t=document.getElementsByTagName("html")[0];t.className=t.className.includes(i)?t.className:t.className.includes(e)?t.className.replace(e,i):t.className.split(" ").concat(i).join(" ")}),[i]),o.a.createElement(d.Provider,{value:{theme:i,switchTheme:l}},t)}var f,b,v=a(15),h=a(89),p=a.n(h),y=a(115),O=a(28),j=a(25),C=a(63),g=a.n(C),w=a(18),_=a.n(w),D=a(19),E=a(54),k=a.n(E),B=a(90),S=a(9);!function(e){e.Active="active",e.Confirmed="confirmed",e.Deaths="deaths",e.Recovered="recovered"}(f||(f={}));var N=(b={},Object(S.a)(b,f.Active,{}),Object(S.a)(b,f.Confirmed,{}),Object(S.a)(b,f.Deaths,{}),Object(S.a)(b,f.Recovered,{}),b);function R(e){var t=function(e){return e.reduce((function(e,t){var a,n,r=_.a.utc(t.updated).format("M/D/YY"),o={country:t.country,province:null,coordinates:{latitude:t.countryInfo.lat,longitude:t.countryInfo.long},timeline:(a={},Object(S.a)(a,f.Active,Object(S.a)({},r,t.cases-t.deaths-t.recovered)),Object(S.a)(a,f.Confirmed,Object(S.a)({},r,t.cases)),Object(S.a)(a,f.Deaths,Object(S.a)({},r,t.deaths)),Object(S.a)(a,f.Recovered,Object(S.a)({},r,t.recovered)),a),updated:t.updated};return Object(v.a)({},e,Object(S.a)({},(T[n=o.country]||n).toLowerCase(),o))}),{})}(e[0]),a=function(e,t){return e.reduce((function(e,a){var n,r,o,c,i,l={country:(null===(n=t[a.country])||void 0===n?void 0:n.country)||A(a.country),province:(null===(r=t[a.province])||void 0===r?void 0:r.country)||A(a.province),coordinates:{latitude:0,longitude:0},timeline:(o={},Object(S.a)(o,f.Active,Object.keys(a.timeline.cases).reduce((function(e,t){var n=a.timeline.cases[t]-a.timeline.deaths[t]-a.timeline.recovered[t];return e[t]=n,e}),{})),Object(S.a)(o,f.Confirmed,a.timeline.cases),Object(S.a)(o,f.Deaths,a.timeline.deaths),Object(S.a)(o,f.Recovered,a.timeline.recovered),o)},u=["Australia","China","Canada"].includes(l.country);return e[l.country]||l.province&&!u||(e[l.country]=Object(v.a)({},l,{province:null,timeline:l.province?N:l.timeline})),l.province&&(e[l.province]=l),e[l.country]&&l.province&&u&&(e[l.country].timeline=(c=e[l.country].timeline,i=l.timeline,Object.keys(c).reduce((function(e,t){var a=Object.keys(c[t]),n=Object.keys(i[t]),r=a.length?a:n;return Object(v.a)({},e,Object(S.a)({},t,r.reduce((function(e,a){return Object(v.a)({},e,Object(S.a)({},a,(c[t][a]||0)+(i[t][a]||0)))}),{})))}),N))),e}),{})}(e[1],t);return Object.values(t).reduce((function(e,t){var n,r=a[t.country],o=r?r.timeline:N;return Object.keys(o[f.Confirmed]).length||console.warn("countries without timeline",t),Object(v.a)({},e,Object(S.a)({},t.country,Object(v.a)({},t,{timeline:x((n={},Object(S.a)(n,f.Active,Object(v.a)({},o[f.Active],{},t.timeline[f.Active])),Object(S.a)(n,f.Confirmed,Object(v.a)({},o[f.Confirmed],{},t.timeline[f.Confirmed])),Object(S.a)(n,f.Deaths,Object(v.a)({},o[f.Deaths],{},t.timeline[f.Deaths])),Object(S.a)(n,f.Recovered,Object(v.a)({},o[f.Recovered],{},t.timeline[f.Recovered])),n))})))}),{})}function x(e){return Object.keys(e).reduce((function(t,a){return Object(v.a)({},t,Object(S.a)({},a,Object.keys(e[a]).reduce((function(t,n){return e[a][n]&&(t[n]=e[a][n]),t}),{})))}),N)}var T={"C\xf4te d'Ivoire":"Cote d'Ivoire",Palestine:"West Bank and Gaza","Lao People's Democratic Republic":'Lao People"s Democratic Republic',Myanmar:"Burma","Holy See (Vatican City State)":"Holy See","R\xe9union":"Reunion",Macao:"macau","Saint Martin":"st martin","St. Barth":"saint barthelemy","Saint Pierre Miquelon":"saint pierre and miquelon","Cura\xe7ao":"curacao","Caribbean Netherlands":"bonaire, sint eustatius and saba"};function A(e){return Object.keys(T).reduce((function(e,t){return Object(v.a)({},e,Object(S.a)({},T[t],t))}),{})[e]||e}var Y="https://corona.lmao.ninja",M="".concat(Y,"/v2/countries"),V="".concat(Y,"/v2/historical?lastdays=all");function I(){return L.apply(this,arguments)}function L(){return(L=Object(B.a)(k.a.mark((function e(){var t,a;return k.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=[M,V],e.next=3,Promise.all(t.map(function(){var e=Object(B.a)(k.a.mark((function e(t){var a;return k.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch(t);case 2:return a=e.sent,e.abrupt("return",a.json());case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()));case 3:return a=e.sent,e.abrupt("return",R(a));case 5:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var F={filterBy:{status:f.Confirmed,favorite:!1},searchValue:"",sortBy:f.Confirmed,sortDirection:D.c.DESC,timelineDate:_()().format(),isTableVisibleOnMobile:!1},P=Object(O.c)({name:"sideBar",initialState:F,reducers:{setFilterBy:function(e,t){e.filterBy=t.payload},setTimelineDate:function(e,t){e.timelineDate=t.payload},setSearchValue:function(e,t){e.searchValue=t.payload},sort:function(e,t){e.sortBy=t.payload.sortBy,e.sortDirection=t.payload.sortDirection},toggleTableVisibility:function(e){e.isTableVisibleOnMobile=!e.isTableVisibleOnMobile}}}),q=function(e){return e.sideBar.sortBy},z=function(e){return e.sideBar.sortDirection},G=function(e){return e.sideBar.filterBy},X=function(e){return e.sideBar.isTableVisibleOnMobile},H=Object(j.a)([function(e){return e.sideBar.timelineDate}],(function(e){return _()(e)})),J=P.actions,K=J.setFilterBy,W=J.setTimelineDate,Z=J.setSearchValue,Q=J.sort,U=J.toggleTableVisibility,$=P.reducer,ee=Object(O.b)("countries/fetchCountries",Object(y.a)(p.a.mark((function e(){return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,I();case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})))),te=Object(O.c)({name:"countries",initialState:{loading:"idle",countriesByName:{},favoriteCountries:{},error:null},reducers:{toggleFavorite:function(e,t){e.favoriteCountries[t.payload]?delete e.favoriteCountries[t.payload]:e.favoriteCountries[t.payload]=!0},updateFavoriteCountries:function(e,t){e.favoriteCountries=t.payload}},extraReducers:function(e){e.addCase(ee.pending,(function(e){"idle"===e.loading&&(e.loading="pending")})).addCase(ee.fulfilled,(function(e,t){"pending"===e.loading&&(e.loading="idle"),e.countriesByName=t.payload})).addCase(ee.rejected,(function(e,t){e.error=t.error}))}}),ae=function(e){return e.countries.countriesByName},ne=function(e){return e.countries.favoriteCountries},re=Object(j.a)([ae],(function(e){return Object.values(e)})),oe=Object(j.a)([re,function(e){return e.sideBar.searchValue},G,ne],(function(e,t,a,n){var r=t.toLowerCase();return e.filter((function(e){return!(t&&!e.country.toLowerCase().includes(r))&&!(a.favorite&&!n[e.country])}))})),ce=Object(j.a)([oe,H],(function(e,t){var a=t.format("M/D/YY");return e.filter((function(e){return e.timeline.active[a]||e.timeline.confirmed[a]||e.timeline.deaths[a]||e.timeline.recovered[a]}))})),ie=Object(j.a)([ce,H,q,z],(function(e,t,a,n){var r=t.format("M/D/YY"),o=Object.values(f).includes(a);return g.a.orderBy(e,(function(e){return o?e.timeline[a][r]||0:e[a]}),n===D.c.ASC?"asc":"desc").map((function(e,t){return Object(v.a)({},e,{index:t+1})}))})),le=Object(j.a)([ce,H],(function(e,t){var a=t.format("M/D/YY");return e.reduce((function(e,t){return{active:e.active+(t.timeline.active[a]||0),confirmed:e.confirmed+(t.timeline.confirmed[a]||0),deaths:e.deaths+(t.timeline.deaths[a]||0),recovered:e.recovered+(t.timeline.recovered[a]||0)}}),{active:0,confirmed:0,deaths:0,recovered:0})})),ue=Object(j.a)([ce,G],(function(e,t){return{type:"FeatureCollection",features:e.map((function(e){return{type:"Feature",geometry:{type:"Point",coordinates:[e.coordinates.longitude,e.coordinates.latitude]},properties:Object(v.a)({country:e.country},e.timeline[t.status])}}))}})),se=Object(j.a)([oe],(function(e){return e.reduce((function(e,t){var a=Object.keys(t.timeline[f.Confirmed]);if(a.length){var n=_()(a[0],"M/D/YY");if(e.isAfter(n))return n}return e}),_()())})),de=te.actions,me=de.toggleFavorite,fe=de.updateFavoriteCountries,be=te.reducer,ve=a(66),he=(a(192),a(45)),pe=a(12),ye=a(68),Oe=a.n(ye);function je(){var e=Object(r.useContext)(d),t=e.theme,a=e.switchTheme;return o.a.createElement("label",{className:Oe.a.themeSwitch},o.a.createElement("input",{type:"checkbox",checked:t===n.Dark,onChange:function(){return a(t===n.Dark?n.Light:n.Dark)}}),o.a.createElement("span",{className:Object(pe.a)(Oe.a.icon,t===n.Dark&&Oe.a.iconDark),"aria-label":"Switch theme",role:"img"},"\ud83d\udca1"))}var Ce,ge=a(121),we=a.n(ge),_e=(Ce={},Object(S.a)(Ce,f.Confirmed,"#FF5733"),Object(S.a)(Ce,f.Recovered,"#6EB277"),Object(S.a)(Ce,f.Deaths,"#BD33FF"),Object(S.a)(Ce,f.Active,"#FF8A33"),Ce);function De(){for(var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:5e7,t=[0,1,5,10,50,100,500,1e3,2e3],a=5e3;a<=e;)t.push(a),a+=a<1e5?5e3:a<5e5?2e4:5e4;return t.reduce((function(e,t,a){return[].concat(Object(ve.a)(e),[t,a+4])}),[])}function Ee(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"get",t=arguments.length>1?arguments[1]:void 0;return[e,t]}function ke(e){var t=e.label,a=e.value,n=e.perDay,r=e.status;return o.a.createElement("div",null,o.a.createElement("span",{"data-testid":"tooltip-label"},t,":"),o.a.createElement("span",{"data-testid":"tooltip-value",style:{color:_e[r]}},(null===a||void 0===a?void 0:a.toLocaleString())||0,o.a.createElement("sup",{"data-testid":"difference"},"(".concat(n>0?"+":"").concat(!isNaN(n)&&(null===n||void 0===n?void 0:n.toLocaleString())||0,")"))))}function Be(e){var t=e.date,a=e.hoveredCountry;if(a){var n=t.format("M/D/YY"),r=t.clone().subtract(1,"day").format("M/D/YY"),c=a.country.timeline,i=[{label:"Confirmed",status:f.Confirmed},{label:"Recovered",status:f.Recovered},{label:"Deaths",status:f.Deaths},{label:"Active",status:f.Active}];return o.a.createElement("div",{className:we.a.tooltip,style:{top:a.offsetY,left:a.offsetX}},o.a.createElement("b",{"data-testid":"tooltip-country"},a.country.country),i.map((function(e){var t=e.label,a=e.status;return o.a.createElement(ke,{key:a,label:t,value:c[a][n],perDay:c[a][n]-c[a][r],status:a})})))}return null}var Se=a(122),Ne=a.n(Se),Re=Object(O.c)({name:"map",initialState:{viewport:{longitude:0,latitude:15,zoom:1.5}},reducers:{setViewport:function(e,t){e.viewport=t.payload}}}),xe=function(e){return e.map.viewport},Te=Re.actions.setViewport,Ae=Re.reducer;var Ye=Object(r.memo)((function(){var e=Object(r.useRef)(null),t=Object(r.useContext)(d).theme,a=Object(l.c)(xe),c=Object(r.useState)(a),i=Object(u.a)(c,2),s=i[0],m=i[1],f=Object(r.useState)(null),b=Object(u.a)(f,2),h=b[0],p=b[1],y=Object(l.c)(ae),O=Object(l.c)(ue),j=Object(l.c)(G),C=Object(l.c)(H),g=C.format("M/D/YY"),w=Ee("has",g),_=Ee("get",g),D=Object(r.useCallback)((function(e){var t=e.features,a=void 0===t?[]:t,n=e.srcEvent,r=n.offsetX,o=n.offsetY,c=a.find((function(e){return["label","point"].includes(e.layer.id)}));if(c&&c.properties&&c.properties.country){if((null===h||void 0===h?void 0:h.country)!==c.properties.country)return p({offsetX:r,offsetY:o,country:y[c.properties.country]})}else if(null===h||void 0===h?void 0:h.country)return p(null)}),[y,h]);return Object(r.useEffect)((function(){m(Object(v.a)({},a,{transitionInterpolator:new he.a({speed:1.2}),transitionDuration:"auto"}))}),[a]),o.a.createElement("div",{className:Ne.a.mapContainer},o.a.createElement(he.d,Object.assign({ref:e},s,{width:"100%",height:"100%",mapStyle:"mapbox://styles/mapbox/".concat(t,"-v10"),mapboxApiAccessToken:"pk.eyJ1IjoiZGVtcGtoIiwiYSI6ImNrOGZwanFuazAxdnozbG4yNm1tOHVuYzkifQ.fRJrCsndLJ4yM-jlPaAG9Q",onViewportChange:function(e){return m(e)},onHover:D}),o.a.createElement(he.c,{id:"data",type:"geojson",data:O},o.a.createElement(he.b,{id:"point",type:"circle",filter:["all",w,[">",_,0]],paint:{"circle-radius":["interpolate",["linear"],_].concat(Object(ve.a)(De())),"circle-color":_e[j.status],"circle-opacity":.4,"circle-stroke-width":1,"circle-stroke-color":_e[j.status]}}),o.a.createElement(he.b,{id:"label",type:"symbol",filter:["all",w,[">",_,0]],paint:{"text-color":t===n.Light?"#3B3B3B":"#EBEBEB"},layout:{"text-field":_,"text-font":["DIN Offc Pro Medium","Arial Unicode MS Bold"],"text-size":12}})),o.a.createElement(Be,{date:C,hoveredCountry:h})),o.a.createElement(je,null))})),Me=a(210),Ve=a(91),Ie=a.n(Ve);function Le(e){var t=e.onChange,a=Object(r.useState)(""),n=Object(u.a)(a,2),c=n[0],i=n[1],l=Object(r.useCallback)((function(e){i(e.target.value),t(e.target.value)}),[t]);return o.a.createElement("div",{className:Ie.a.searchBar},o.a.createElement("input",{value:c,onChange:l,placeholder:"Search..."}),o.a.createElement(Me.a,{className:Ie.a.searchIcon}))}a(194);var Fe=Object(r.memo)((function(e){var t=e.date,a=void 0===t?_()():t,n=e.onChange,c=e.minDate,i=e.maxDate,l=Object(r.useCallback)((function(e){var t=a.clone().dayOfYear(+e.currentTarget.value);return n(t)}),[a,n]);return o.a.createElement("div",{className:"timeline-panel","data-testid":"timeline-panel"},o.a.createElement("label",{htmlFor:"timeline"},a.format("LL")),o.a.createElement("input",{id:"timeline",className:"range",type:"range",value:a.dayOfYear(),step:1,min:null===c||void 0===c?void 0:c.dayOfYear(),max:null===i||void 0===i?void 0:i.dayOfYear(),onChange:l}))})),Pe=a(56),qe=a.n(Pe);function ze(e){var t=e.label,a=e.quantity,n=e.activeColor,r=e.isActive,c=e.onClick;return o.a.createElement("div",{className:Object(pe.a)(qe.a.totalCount,r&&qe.a.active),style:r?{color:n}:{},onClick:c},o.a.createElement("div",{className:qe.a.label,"data-testid":"total-count-label"},t),o.a.createElement("div",{className:qe.a.quantity,"data-testid":"total-count-value"},a.toLocaleString()))}var Ge=a(211),Xe=a(212),He=(a(195),a(21)),Je=a.n(He);function Ke(e){var t=e.dataKey,a=e.label,n=e.sortBy,r=e.sortDirection;return o.a.createElement("div",{key:t,className:Je.a.headerCol},o.a.createElement("span",null,a),o.a.createElement("span",null,n===t&&o.a.createElement(D.d,{sortDirection:r})))}function We(){var e=Object(l.b)(),t=Object(r.useRef)(!1),a=Object(l.c)(ie),n=Object(l.c)(G),c=Object(l.c)(ne),i=s("favoriteCountries",c),d=Object(u.a)(i,2),m=d[0],b=d[1],h=Object(l.c)(H).format("M/D/YY"),p=Object(l.c)(q),y=Object(l.c)(z),O=Object(l.c)(X);return Object(r.useEffect)((function(){t.current?g.a.isEqual(c,m)||b(c):(t.current=!0,e(fe(m)))}),[c]),o.a.createElement("div",{style:{height:"100%"}},o.a.createElement("div",{className:Object(pe.a)(Je.a.container,!O&&Je.a.hiddenContainer)},o.a.createElement(D.a,null,(function(t){var r=t.width,i=t.height,l=(r-80)/100,u=20*l,s=20*l;return o.a.createElement(D.e,{width:r,height:i,headerHeight:40,rowHeight:50,rowCount:a.length,rowClassName:Ze,rowGetter:function(e){var t=e.index;return a[t]},onRowClick:function(t){var a=t.rowData;O&&e(U()),e(Te({longitude:a.coordinates.longitude,latitude:a.coordinates.latitude,zoom:6}))},sort:function(t){var a=t.sortBy,n=t.sortDirection;return e(Q({sortBy:a,sortDirection:n}))},sortBy:p,sortDirection:y},o.a.createElement(D.b,{label:"#",dataKey:"index",disableSort:!0,width:30,headerRenderer:Ke}),o.a.createElement(D.b,{width:s,className:Je.a.countryCol,label:"Country",dataKey:"country",defaultSortDirection:"ASC",headerRenderer:Ke}),[{label:"Confirmed",status:f.Confirmed},{label:"Recovered",status:f.Recovered},{label:"Deaths",status:f.Deaths},{label:"Active",status:f.Active}].map((function(e){return o.a.createElement(D.b,{key:e.status,label:e.label,dataKey:e.status,defaultSortDirection:"DESC",width:u,headerRenderer:Ke,cellDataGetter:function(e){var t,a=e.dataKey;return(null===(t=e.rowData.timeline[a][h])||void 0===t?void 0:t.toLocaleString())||0}})})),o.a.createElement(D.b,{label:"",dataKey:"favorite",disableSort:!0,width:50,headerRenderer:function(){var t=n.favorite?Ge.a:Xe.a;return o.a.createElement(t,{className:Je.a.favoriteIcon,"data-testid":"filter-by-favorite",onClick:function(t){t.stopPropagation(),e(K(Object(v.a)({},n,{favorite:!n.favorite})))}})},cellRenderer:function(t){var a=t.rowData,n=c[a.country]?Ge.a:Xe.a;return o.a.createElement(n,{className:Je.a.favoriteIcon,"data-testid":"toggle-favorite",onClick:function(t){t.stopPropagation(),e(me(a.country))}})}}))}))),o.a.createElement("button",{className:Je.a.toggleTable,onClick:function(){return e(U())}},"".concat(O?"Hide":"Show"," table")))}function Ze(e){var t=e.index;return t>=0?t%2?Je.a.evenRow:Je.a.oddRow:Je.a.headerRow}var Qe=a(69),Ue=a.n(Qe);function $e(){var e=Object(l.b)(),t=Object(l.c)(H),a=Object(l.c)(se),n=Object(l.c)(G),r=Object(l.c)(le),c=Object(l.c)(X),i=[{label:"Confirmed",status:f.Confirmed},{label:"Recovered",status:f.Recovered},{label:"Deaths",status:f.Deaths},{label:"Active",status:f.Active}];return o.a.createElement("div",{className:Object(pe.a)(Ue.a.sideBar,c&&Ue.a.open)},o.a.createElement("div",{className:Ue.a.header},i.map((function(t){var a=t.label,c=t.status;return o.a.createElement(ze,{key:c,label:a,quantity:r[c],activeColor:_e[n.status],isActive:n.status===c,onClick:function(){return e(K({status:c,favorite:n.favorite}))}})}))),o.a.createElement(Fe,{date:_()(t),onChange:function(t){return e(W(t.format()))},minDate:a,maxDate:_()()}),o.a.createElement(Le,{onChange:function(t){return e(Z(t))}}),o.a.createElement(We,null))}a(196);var et=function(){var e=Object(l.b)();return Object(r.useEffect)((function(){e(ee())}),[e]),o.a.createElement(m,null,o.a.createElement("div",{className:"App"},o.a.createElement($e,null),o.a.createElement(Ye,null)))},tt={reducer:{countries:be,map:Ae,sideBar:$},middleware:Object(O.d)({immutableCheck:!1,serializableCheck:!1})},at=Object(O.a)(tt);a(197),Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(o.a.createElement(l.a,{store:at},o.a.createElement(et,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))},21:function(e,t,a){e.exports={container:"CountriesTable_container__1oVjo",hiddenContainer:"CountriesTable_hiddenContainer__3NqiL",headerRow:"CountriesTable_headerRow__2Vc_X",evenRow:"CountriesTable_evenRow__2A5TA",oddRow:"CountriesTable_oddRow__2S4nV",headerCol:"CountriesTable_headerCol__1v3XC",countryCol:"CountriesTable_countryCol__3D66T",favoriteIcon:"CountriesTable_favoriteIcon__2h8jb",toggleTable:"CountriesTable_toggleTable__3_2VX"}},56:function(e,t,a){e.exports={totalCount:"TotalCount_totalCount__39M22",label:"TotalCount_label__208vn",quantity:"TotalCount_quantity__3P3_f"}},68:function(e,t,a){e.exports={themeSwitch:"ThemeSwitch_themeSwitch__3wxEA",icon:"ThemeSwitch_icon__pXD-X",iconDark:"ThemeSwitch_iconDark__4m2UZ"}},69:function(e,t,a){e.exports={sideBar:"SideBar_sideBar__2uMjA",open:"SideBar_open__3OZCs",header:"SideBar_header__2Rcqr"}},91:function(e,t,a){e.exports={searchBar:"SearchBar_searchBar__3WxVo",searchIcon:"SearchBar_searchIcon__1voj6"}}},[[125,1,2]]]);
//# sourceMappingURL=main.0e59952b.chunk.js.map