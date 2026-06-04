'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const HEADER_HTML = `<script>
(function(){
  var p = location.pathname;
  var WS = ['/news','/stories','/stories-editions','/stories-artsandculture','/stories-lamaison','/stories-sustainability','/stories-podcasts','/privacy','/privacy-notice','/privacy-policy','/accessibility','/cookie','/cookie-policy','/terms','/terms-of-use','/contact'];
  for (var i = 0; i < WS.length; i++) {
    if (p === WS[i] || p.indexOf(WS[i]+'/') === 0 || p.indexOf(WS[i]+'?') === 0) {
      document.documentElement.classList.add('page-white-header'); break;
    }
  }
}());
<\/script>

<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --logo-150-w:80px;--logo-150-h:70px;--logo-150-mob-w:60px;--logo-150-mob-h:50px;--logo-150-sub-w:60px;--logo-150-sub-h:50px;
  --logo-main-h:50px;--logo-main-mob-h:50px;--logo-ar-h:60px;--logo-ar-mob-h:60px;--logo-ar-menu-h:60px;
  --logo-ims-desk-h:50px;--logo-ims-mob-h:50px;--logo-ims-menu-h:50px;
  --h:120px;--hm:80px;--px:90px;--pxm:24px;
  --serif:'Times Now',Georgia,serif;--sans:'Helvetica Neue Web',Helvetica,Arial,sans-serif;
  --ease:cubic-bezier(.22,.61,.36,1);--ease-out:cubic-bezier(.16,1,.3,1);--ease-prem:cubic-bezier(.4,0,.2,1);
  --bg-header:#000;--bg-menu-mob:#000;--k-dim:#fff;--k-subtle:#fff;--w:#fff;
  --menu-h:65vh;--card-gap:14px;--sb-w:210px;--ca-pad:52px;--visible-cards:4;
  --card-s-w:calc((100vw - var(--px)*2 - var(--sb-w) - var(--ca-pad) - var(--card-gap)*(var(--visible-cards) - 1) - 48px) / var(--visible-cards));
  --card-w-w:calc((100vw - var(--px)*2 - var(--sb-w) - var(--ca-pad) - var(--card-gap)*2 - 48px) / 3);
  --bg-dur:1.3s;--ct-delay:1.6s;--ct-dur:0.42s;
  --mob-list-top:36px;--mob-li-py:12px;--mob-init-mb:32px;--mob-utils-top:32px;--mob-utils-gap:24px;
  --mob-stories-top:120px;--mob-divider-mt:20px;--mob-sub-list-top:20px;--mob-sub-li-py:19px;--mob-sub-vis-top:60px;
}
header[data-section-theme],.site-header,#header,.header-inner,.header-announcement-bar-wrapper{display:none!important}
body:not(.sqs-edit-mode-active)>.sqs-layout,body:not(.sqs-edit-mode-active)>#page,body:not(.sqs-edit-mode-active)>main{padding-top:var(--h)!important}
@media(max-width:1024px){body:not(.sqs-edit-mode-active)>.sqs-layout,body:not(.sqs-edit-mode-active)>#page,body:not(.sqs-edit-mode-active)>main{padding-top:var(--hm)!important}}
#msh .msh-logo150 img,#msh-ims-desk .ims-logo150 img,#msh-ar-desk .ar-logo150 img{width:var(--logo-150-w)!important;height:var(--logo-150-h)!important;max-width:none!important;max-height:none!important;min-width:unset!important;min-height:unset!important;object-fit:contain!important;filter:brightness(0) invert(1)!important;display:block!important;flex-shrink:0!important}
#msm-mob .mob-150 img,#msh-ims-mob .imm-logo150 img{width:var(--logo-150-mob-w)!important;height:var(--logo-150-mob-h)!important;max-width:none!important;max-height:none!important;min-width:unset!important;min-height:unset!important;object-fit:contain!important;filter:brightness(0) invert(1)!important;display:block!important;flex-shrink:0!important}
.mob-sub-hdr1-logo img{width:var(--logo-150-sub-w)!important;height:var(--logo-150-sub-h)!important;max-width:none!important;max-height:none!important;object-fit:contain!important;filter:brightness(0) invert(1)!important;display:block!important}
#msh .msh-center img{height:var(--logo-main-h)!important;width:auto!important;max-width:none!important;max-height:none!important;min-width:unset!important;min-height:unset!important;object-fit:contain!important;filter:brightness(0) invert(1)!important;display:block!important}
#msm-mob .mob-center-logo img,#mob-menu .mob-mh-logo img,#mob-sub-season .mob-sub-hdr1-center img,#mob-sub-world .mob-sub-hdr1-center img{height:var(--logo-main-mob-h)!important;width:auto!important;max-width:none!important;max-height:none!important;object-fit:contain!important;filter:brightness(0) invert(1)!important;display:block!important}
#msh-ar-desk .ar-center img{height:var(--logo-ar-h)!important;width:auto!important;max-width:280px!important;max-height:none!important;object-fit:contain!important;filter:brightness(0) invert(1)!important;display:block!important}
#msh-ar-mob .arm-center img{height:var(--logo-ar-mob-h)!important;width:auto!important;max-width:160px!important;max-height:none!important;object-fit:contain!important;filter:brightness(0) invert(1)!important;display:block!important}
#menu-ar-mob .arm-mh-logo img{height:var(--logo-ar-menu-h)!important;width:auto!important;max-width:none!important;max-height:none!important;object-fit:contain!important;filter:brightness(0) invert(1)!important;display:block!important}
#msh-ims-desk .ims-center img{height:var(--logo-ims-desk-h)!important;width:auto!important;max-width:220px!important;max-height:none!important;object-fit:contain!important;filter:brightness(0) invert(1)!important;display:block!important}
#msh-ims-mob .imm-center img{height:var(--logo-ims-mob-h)!important;width:auto!important;max-width:160px!important;max-height:none!important;object-fit:contain!important;filter:brightness(0) invert(1)!important;display:block!important}
#menu-ims-mob .imm-mh-logo img{height:var(--logo-ims-menu-h)!important;width:auto!important;max-width:160px!important;max-height:none!important;object-fit:contain!important;filter:brightness(0) invert(1)!important;display:block!important}
#msh{position:fixed;top:0;left:0;width:100%;height:var(--h);z-index:9000;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:0 var(--px);background:#000;backdrop-filter:blur(0px);-webkit-backdrop-filter:blur(0px);transition:transform .36s var(--ease),background .4s var(--ease-prem),backdrop-filter .4s var(--ease-prem)}
#msh.scrolled{background:var(--bg-header);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px)}
#msh.hidden{transform:translateY(-110%)}
.msh-left{display:flex;align-items:center;gap:20px}
.msh-logo150{display:flex;align-items:center;text-decoration:none;flex-shrink:0;transition:opacity .25s var(--ease-prem)}
.msh-logo150:hover{opacity:.4}
.msh-sep{width:1px;height:24px;background:var(--k-subtle);flex-shrink:0}
.msh-nav{display:flex;align-items:center;gap:28px;height:var(--h)}
.msh-nav-item{position:relative;height:var(--h);display:flex;align-items:center;cursor:pointer}
.msh-nav-link{font-family:var(--sans);font-size:13px;font-weight:400;letter-spacing:.07em;color:var(--k-dim);text-decoration:none;transition:color .25s var(--ease-prem);user-select:none}
.msh-nav-item:hover .msh-nav-link{color:rgba(255,255,255,.65)}
.msh-nav-item.on .msh-nav-link{color:var(--w)}
.msh-nav-item.on::after{content:'';position:absolute;bottom:45px;left:0;right:0;height:2px;background:#fff}
.msh-center{display:flex;justify-content:center;text-decoration:none;transition:opacity .25s var(--ease-prem)}
.msh-center:hover{opacity:.4}
.msh-right{display:flex;align-items:center;justify-content:flex-end;gap:28px}
.msh-icon{display:flex;align-items:center;color:var(--k-dim);text-decoration:none;transition:opacity .25s var(--ease-prem)}
.msh-icon:hover{color:var(--w);opacity:1}
.msh-icon svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.35}
.msh-logout{background:none;border:none;cursor:pointer;color:var(--k-dim);font-family:var(--sans);font-size:13px;font-weight:400;letter-spacing:.07em;padding:0;transition:opacity .25s var(--ease-prem)}
.msh-logout:hover{opacity:.65}
#msm{position:fixed;top:0;left:0;width:100%;height:calc(var(--menu-h) + var(--h));z-index:8998;background:var(--bg-header);display:none;overflow:hidden;clip-path:inset(0 0 100% 0);transition:clip-path var(--bg-dur) var(--ease-out)}
#msm.opening{clip-path:inset(0 0 0% 0)}
#msm .msm-panel{padding-top:calc(44px + var(--h))}
.msm-panel{position:absolute;inset:0;display:grid;grid-template-columns:var(--sb-w) 1fr;grid-template-rows:auto 1fr;grid-template-areas:"sb ti" "sb ca";padding:44px var(--px) 48px;opacity:0;pointer-events:none;transition:opacity var(--ct-dur) var(--ease-prem),transform var(--ct-dur) var(--ease-prem)}
.msm-panel.visible{opacity:1;pointer-events:auto;transform:translateX(0)!important}
.msm-sb{grid-area:sb;padding-right:60px;padding-top:55px;display:flex;flex-direction:column}
.msm-sb a{display:block;padding:9px 0;font-family:var(--sans);font-size:12px;font-weight:400;letter-spacing:.05em;color:var(--k-dim);text-decoration:none;transition:color .2s var(--ease-prem)}
.msm-sb a:hover{color:var(--w)}
.msm-ti{grid-area:ti;padding-left:var(--ca-pad);padding-bottom:40px;display:flex;flex-direction:column;justify-content:flex-end}
.msm-ti-head{font-family:var(--sans);font-size:28px;font-weight:100;letter-spacing:-.025em;text-transform:uppercase;color:var(--w);line-height:.86;display:flex;align-items:baseline;gap:11px}
.msm-ti-head em{font-family:var(--serif);font-style:italic;font-weight:200;font-size:32px;color:var(--w)}
.msm-ca{grid-area:ca;padding-left:var(--ca-pad);position:relative;overflow:hidden;display:flex;flex-direction:column}
.msm-track-wrap{position:relative;flex:1;overflow:hidden}
.msm-btn{position:absolute;top:40%;transform:translateY(-50%);width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:5;transition:background .18s,opacity .3s var(--ease-prem),transform .2s}
.msm-btn:hover{background:rgba(255,255,255,.22);transform:translateY(-50%) scale(1.06)}
.msm-btn-next{right:8px}
.msm-btn-prev{left:0;opacity:0;pointer-events:none}
.msm-btn-prev.show{opacity:1;pointer-events:auto}
.msm-btn svg{width:13px;height:13px;fill:none;stroke:var(--w);stroke-width:1.9}
.msm-track{display:flex;gap:var(--card-gap);overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none;height:100%;align-items:flex-start;padding-right:48px}
.msm-track::-webkit-scrollbar{display:none}
.card-s{flex-shrink:0;width:var(--card-s-w);scroll-snap-align:start;cursor:pointer}
.card-s-img{width:100%;aspect-ratio:3/4;position:relative;overflow:hidden;background:#2a2a2a}
.card-s-img img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform .7s var(--ease)}
.card-s:hover .card-s-img img{transform:scale(1.05)}
.card-s-grad{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.5) 0%,transparent 54%)}
.card-s-cta{position:absolute;bottom:12px;left:12px;font-family:var(--sans);font-size:9px;letter-spacing:.15em;text-transform:uppercase;color:rgba(255,255,255,.62)}
.card-w-wrap{flex-shrink:0;width:var(--card-w-w);scroll-snap-align:start;cursor:pointer}
.card-w{width:100%;aspect-ratio:4/3;position:relative;overflow:hidden;background:#2a2a2a}
.card-w img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform .7s var(--ease)}
.card-w-wrap:hover .card-w img{transform:scale(1.05)}
.card-w-grad{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.38) 0%,transparent 52%)}
.card-w-title{margin-top:20px;font-family:var(--sans);font-size:14px;font-weight:400;color:var(--k-dim);letter-spacing:.03em;line-height:1.35}
.card-w-wrap:hover .card-w-title{color:var(--w)}
#msm-ov{position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:8997;opacity:0;pointer-events:none;transition:opacity .4s var(--ease-prem)}
#msm-ov.show{opacity:1;pointer-events:auto}
#msm-mob{display:none;position:fixed;top:0;left:0;width:100%;height:var(--hm);padding:0 var(--pxm);z-index:10010;background:#000;backdrop-filter:blur(0px);-webkit-backdrop-filter:blur(0px);align-items:center;transition:background .4s var(--ease-prem),backdrop-filter .4s var(--ease-prem)}
#msm-mob.scrolled{background:var(--bg-header);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px)}
#msm-mob.menu-open{background:var(--bg-header)!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important}
#msm-mob.sub-open{background:var(--bg-header)!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important}
.mob-left{position:relative;flex:1;display:flex;align-items:center;height:100%}
.mob-center-logo{position:absolute;left:50%;transform:translateX(-50%);display:flex;text-decoration:none;transition:opacity .25s}
.mob-center-logo:hover{opacity:.4}
.mob-right{flex:1;display:flex;align-items:center;justify-content:flex-end;gap:16px;transition:opacity .22s var(--ease-prem)}
.mob-icon-btn{display:flex;align-items:center;color:var(--k-dim);background:none;border:none;padding:0;cursor:pointer;text-decoration:none;transition:color .22s}
.mob-icon-btn:hover{color:var(--w)}
.mob-icon-btn svg{width:28px;height:28px;fill:none;stroke:currentColor;stroke-width:1}
.mob-st{display:flex;align-items:center;gap:14px;transition:opacity .22s var(--ease-prem)}
.mob-st-0{position:relative}
.mob-st-1,.mob-st-2{position:absolute;left:0;top:50%;transform:translateY(-50%);opacity:0;pointer-events:none}
.mob-150{display:flex;align-items:center;text-decoration:none;flex-shrink:0;transition:opacity .25s}
.mob-150:hover{opacity:.4}
.mob-sep{width:1px;height:24px;background:var(--k-subtle);flex-shrink:0}
.mob-burger{position:relative;width:22px;height:14px;background:none;border:none;padding:0;cursor:pointer;flex-shrink:0}
.mob-line{position:absolute;left:0;width:100%;height:1px;background:rgba(255,255,255,.9);transform-origin:center;transition:top .3s var(--ease-out),transform .3s var(--ease-out)}
.mob-line:nth-child(1){top:3px}
.mob-line:nth-child(2){top:9px}
.mob-x-btn{display:flex;align-items:center;justify-content:center;width:22px;height:22px;background:none;border:none;padding:0;cursor:pointer;color:var(--k-dim);flex-shrink:0;transition:opacity .22s}
.mob-x-btn:hover{opacity:.5}
#msm-mob.menu-open .mob-st-0{opacity:0;pointer-events:none}
#msm-mob.menu-open .mob-st-1{opacity:1;pointer-events:auto}
#msm-mob.menu-open .mob-right{opacity:0;pointer-events:none}
#msm-mob.sub-open .mob-st-0{opacity:0;pointer-events:none}
#msm-mob.sub-open .mob-st-2{opacity:1;pointer-events:auto}
#mob-menu{display:none;position:fixed;inset:0;z-index:10001;background:var(--bg-menu-mob);overflow-y:auto;clip-path:inset(0 0 100% 0);transition:clip-path var(--bg-dur) var(--ease-out)}
#mob-menu.open{clip-path:inset(0 0 0% 0)}
#mob-menu .mob-menu-content{opacity:0;transition:opacity var(--ct-dur) var(--ease-prem);padding-top:var(--hm)}
#mob-menu.content-vis .mob-menu-content{opacity:1}
#mob-menu:not(.content-vis) .mob-menu-content{opacity:0;transition:none}
.mob-list{padding:var(--mob-list-top) var(--pxm) 0;list-style:none}
.mob-li{display:flex;align-items:center;justify-content:space-between;padding:var(--mob-li-py) 0;cursor:pointer}
.mob-li-link{font-family:var(--sans);font-size:14px;font-weight:400;letter-spacing:.05em;color:var(--k-dim);text-decoration:none;transition:color .2s var(--ease-prem)}
.mob-li:hover .mob-li-link{color:var(--w)}
.mob-li-chev{display:flex}
.mob-li-chev svg{width:18px;height:18px;fill:none;stroke:#fff;stroke-width:1.35}
.mob-divider{margin:var(--mob-divider-mt) var(--pxm) 0}
.mob-utils{padding:var(--mob-utils-top) var(--pxm) 0;display:flex;flex-direction:column;gap:var(--mob-utils-gap)}
.mob-util{display:flex;align-items:center;gap:14px;text-decoration:none;color:var(--k-dim);transition:color .22s;background:none;border:none;cursor:pointer;font-family:var(--sans);padding:0}
.mob-util:hover{color:var(--w)}
.mob-util svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.35;opacity:.45}
.mob-util-label{font-family:var(--sans);font-size:13px;font-weight:400}
.mob-stories{padding:var(--mob-stories-top) var(--pxm) 52px}
.mob-stories-t{margin-bottom:32px;display:flex;flex-direction:column;line-height:.9}
.mob-stories-thin{font-family:var(--sans);font-size:36px;font-weight:100;color:var(--w);text-transform:uppercase;letter-spacing:-.01em;display:block}
.mob-stories-serif{font-family:var(--serif);font-size:36px;font-weight:250;font-style:italic;color:var(--w);display:block}
.mob-carousel{display:flex;gap:10px;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none}
.mob-carousel::-webkit-scrollbar{display:none}
.mob-card{width:78vw;height:300px;position:relative;flex-shrink:0;scroll-snap-align:start;overflow:hidden}
.mob-card img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.mob-card-ov{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.6) 0%,transparent 58%)}
.mob-card-body{position:absolute;bottom:20px;left:16px;right:16px}
.mob-card-cat{font-family:var(--sans);font-size:9px;letter-spacing:.17em;text-transform:uppercase;color:rgba(255,255,255,.45);margin-bottom:5px}
.mob-card-ttl{font-family:var(--serif);font-size:18px;font-weight:300;color:var(--w)}
.mob-stories .mob-card-ov{display:none}
.mob-stories .mob-card-body{display:none}
.mob-card-below{padding-top:14px}
.mob-card-below .mob-card-cat{font-family:var(--sans);font-size:9px;letter-spacing:.17em;text-transform:uppercase;color:#fff;margin-bottom:7px}
.mob-card-below .mob-card-ttl{font-family:var(--serif);font-size:16px;font-weight:300;color:var(--w);line-height:1.32}
.mob-sub{display:none;position:fixed;inset:0;z-index:10002;background:var(--bg-menu-mob);overflow-y:auto;transform:translateX(100%);opacity:0;transition:transform .42s var(--ease-out),opacity .3s var(--ease-prem)}
.mob-sub.open{transform:translateX(0);opacity:1}
.mob-sub-content{opacity:0;transition:opacity .3s var(--ease-prem)}
.mob-sub.open .mob-sub-content{opacity:1;transition-delay:.12s}
.mob-sub-hdr1{display:none!important}
.mob-sub-hdr2{display:flex;align-items:center;padding:20px var(--pxm);background:var(--bg-menu-mob);position:relative;margin-top:var(--hm)}
.mob-sub-back{display:flex;align-items:center;gap:6px;background:none;border:none;cursor:pointer;color:var(--k-dim);font-family:var(--sans);font-size:11px;letter-spacing:.04em;transition:color .22s}
.mob-sub-back:hover{color:var(--w)}
.mob-sub-back svg{width:40px;height:40px;fill:none;stroke:currentColor;stroke-width:1}
.mob-sub-heading{position:absolute;left:50%;transform:translateX(-50%);font-family:var(--sans);font-size:13px;font-weight:600;letter-spacing:.04em;color:var(--w);white-space:nowrap}
.mob-sub-list{padding:var(--mob-sub-list-top) var(--pxm) 0;list-style:none}
.mob-sub-list li{padding:var(--mob-sub-li-py) 0}
.mob-sub-list a{font-family:var(--sans);font-size:13px;font-weight:400;letter-spacing:.05em;color:var(--k-dim);text-decoration:none;display:block;transition:color .2s var(--ease-prem)}
.mob-sub-list a:hover{color:var(--w)}
.mob-sub-vis{padding:var(--mob-sub-vis-top) var(--pxm) 52px}
.mob-sub-vis-t{margin-bottom:24px;line-height:.84;display:flex;align-items:baseline;gap:10px}
.mob-sub-vis-thin{font-family:var(--sans);font-size:32px;font-weight:100;color:var(--w);text-transform:uppercase}
.mob-sub-vis-serif{font-family:var(--serif);font-size:32px;font-weight:250;font-style:italic;color:var(--w)}
@media(max-width:1024px){#msh{display:none}#msm,#msm-ov{display:none!important}#msm-mob{display:flex}#mob-menu{display:block}.mob-sub{display:block}}
@media(min-width:1025px){#msm-mob,#mob-menu,.mob-sub{display:none!important}}
html.page-archives #msh,html.page-archives #msm-mob,html.page-ims #msh,html.page-ims #msm-mob{display:none!important}
#msh.hero-light:not(.scrolled) .msh-nav-link,#msh.hero-light:not(.scrolled) .msh-icon{color:#000}
#msh.hero-light:not(.scrolled) .msh-icon:hover{color:rgba(0,0,0,.55)}
#msh.hero-light:not(.scrolled) .msh-sep{background:#000}
#msh.hero-light:not(.scrolled) .msh-logo150 img,#msh.hero-light:not(.scrolled) .msh-center img{filter:none}
#msm-mob.hero-light:not(.scrolled) .mob-line{background:rgba(0,0,0,.85)}
#msm-mob.hero-light:not(.scrolled) .mob-sep{background:#000}
#msm-mob.hero-light:not(.scrolled) .mob-icon-btn{color:#000}
#msm-mob.hero-light:not(.scrolled) .mob-150 img,#msm-mob.hero-light:not(.scrolled) .mob-center-logo img{filter:none}
html.page-white-header #msh{background:#fff!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;border-bottom:1px solid rgba(0,0,0,.08);transition:transform .36s var(--ease)}
html.page-white-header #msh.scrolled{background:#fff!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important}
html.page-white-header #msh .msh-nav-link{color:#000!important}
html.page-white-header #msh .msh-nav-item:hover .msh-nav-link{color:rgba(0,0,0,.5)!important}
html.page-white-header #msh .msh-nav-item.on .msh-nav-link{color:#000!important}
html.page-white-header #msh .msh-nav-item.on::after{background:#000!important}
html.page-white-header #msh .msh-icon{color:#000!important}
html.page-white-header #msh .msh-icon:hover{color:rgba(0,0,0,.5)!important}
html.page-white-header #msh .msh-sep{background:#000!important}
html.page-white-header #msh .msh-logo150 img{filter:none!important}
html.page-white-header #msh .msh-center img{filter:none!important}
html.page-white-header #msm-mob{background:#fff!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;border-bottom:1px solid rgba(0,0,0,.08)}
html.page-white-header #msm-mob.scrolled{background:#fff!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important}
html.page-white-header #msm-mob.menu-open,html.page-white-header #msm-mob.sub-open{background:#000!important;border-bottom:none!important}
html.page-white-header #msm-mob:not(.menu-open):not(.sub-open) .mob-line{background:rgba(0,0,0,.85)!important}
html.page-white-header #msm-mob:not(.menu-open):not(.sub-open) .mob-sep{background:#000!important}
html.page-white-header #msm-mob:not(.menu-open):not(.sub-open) .mob-icon-btn{color:#000!important}
html.page-white-header #msm-mob:not(.menu-open):not(.sub-open) .mob-x-btn{color:#000!important}
html.page-white-header #msm-mob:not(.menu-open):not(.sub-open) .mob-150 img{filter:none!important}
html.page-white-header #msm-mob:not(.menu-open):not(.sub-open) .mob-center-logo img{filter:none!important}
</style>

<header id="msh" role="banner">
  <div class="msh-left">
    <a href="https://maisonsanguine.com/initiative-maison-sanguine" class="msh-logo150" aria-label="Initiative Maison Sanguine">
      <img src="https://images.squarespace-cdn.com/content/v1/690a2434f370707dc2fccae4/2e0ae33b-5066-4687-be76-a473301f9389/INITIATIVE_MAISON_SANGUINE_LOGOTYPE_BLACK_RGB_RS.png" alt="Initiative Maison Sanguine" loading="eager">
    </a>
    <div class="msh-sep"></div>
    <nav class="msh-nav">
      <div class="msh-nav-item" data-panel="season"><a href="https://maisonsanguine.com/season" class="msh-nav-link">Season</a></div>
      <div class="msh-nav-item" data-panel="world"><a href="https://maisonsanguine.com/about" class="msh-nav-link">Our World</a></div>
      <div class="msh-nav-item"><a href="https://maisonsanguine.com/news" class="msh-nav-link">Stories</a></div>
    </nav>
  </div>
  <a href="https://maisonsanguine.com" class="msh-center" aria-label="Maison Sanguine">
    <img src="https://images.squarespace-cdn.com/content/v1/690a2434f370707dc2fccae4/6110f6e5-bd45-4584-9538-d9439551a869/Sans+titre-16.png?format=1500w" alt="Maison Sanguine" loading="eager">
  </a>
  <div class="msh-right">
    <a href="https://maisonsanguine.com/season" class="msh-icon" aria-label="Find an Experience"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg></a>
    <button class="msh-logout" id="ms-logout-desk" aria-label="Log out">Log out</button>
  </div>
</header>

<div id="msm" aria-hidden="true">
  <div class="msm-panel" id="p-season">
    <div class="msm-sb">
      <a href="https://maisonsanguine.com/season">Upcoming Events</a>
      <a href="https://maisonsanguine.com/event/los-angeles-spring-edition">Los Angeles</a>
      <a href="https://maisonsanguine.com/event/new-york-summer-edition">New York</a>
      <a href="https://maisonsanguine.com/event/dubai-fall-edition">Dubai</a>
      <a href="https://maisonsanguine.com/event/miami-winter-edition">Miami</a>
    </div>
    <div class="msm-ti"><div class="msm-ti-head">OUR <em>PRODUCTIONS</em></div></div>
    <div class="msm-ca"><div class="msm-track-wrap">
      <button class="msm-btn msm-btn-prev" aria-label="Previous"><svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg></button>
      <button class="msm-btn msm-btn-next" aria-label="Next"><svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg></button>
      <div class="msm-track"></div>
    </div></div>
  </div>
  <div class="msm-panel" id="p-world">
    <div class="msm-sb">
      <a href="https://maisonsanguine.com/about/maison-sanguine-contemporary">MS x Art</a>
      <a href="https://maisonsanguine.com/about/music">MS x Music</a>
      <a href="https://maisonsanguine.com/msarchives">MS Chronicles</a>
    </div>
    <div class="msm-ti"><div class="msm-ti-head">OUR <em>WORLD</em></div></div>
    <div class="msm-ca"><div class="msm-track-wrap">
      <button class="msm-btn msm-btn-prev" aria-label="Previous"><svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg></button>
      <button class="msm-btn msm-btn-next" aria-label="Next"><svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg></button>
      <div class="msm-track"></div>
    </div></div>
  </div>
</div>
<div id="msm-ov"></div>

<div id="msm-mob" role="banner">
  <div class="mob-left">
    <div class="mob-st mob-st-0">
      <a href="https://maisonsanguine.com/initiative-maison-sanguine" class="mob-150" aria-label="Initiative Maison Sanguine">
        <img src="https://images.squarespace-cdn.com/content/v1/690a2434f370707dc2fccae4/2e0ae33b-5066-4687-be76-a473301f9389/INITIATIVE_MAISON_SANGUINE_LOGOTYPE_BLACK_RGB_RS.png" alt="Initiative Maison Sanguine" loading="eager">
      </a>
      <div class="mob-sep"></div>
      <button class="mob-burger" id="mob-burger" aria-label="Ouvrir le menu"><span class="mob-line"></span><span class="mob-line"></span></button>
    </div>
    <div class="mob-st mob-st-1">
      <button class="mob-x-btn" id="mob-close" aria-label="Fermer le menu">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
    </div>
    <div class="mob-st mob-st-2">
      <a href="https://maisonsanguine.com/initiative-maison-sanguine" class="mob-150" aria-label="Initiative Maison Sanguine">
        <img src="https://images.squarespace-cdn.com/content/v1/690a2434f370707dc2fccae4/2e0ae33b-5066-4687-be76-a473301f9389/INITIATIVE_MAISON_SANGUINE_LOGOTYPE_BLACK_RGB_RS.png" alt="Initiative Maison Sanguine" loading="eager">
      </a>
      <div class="mob-sep"></div>
      <button class="mob-x-btn" id="mob-close-sub" aria-label="Fermer">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
    </div>
  </div>
  <a href="https://maisonsanguine.com" class="mob-center-logo" aria-label="Maison Sanguine">
    <img src="https://images.squarespace-cdn.com/content/v1/690a2434f370707dc2fccae4/798b7cdb-21d9-4ac6-8c20-eb97e0e193f6/logo+maison+sanguine+mobile_.png?format=1500w" alt="Maison Sanguine" loading="eager">
  </a>
  <div class="mob-right">
    <a href="https://maisonsanguine.com/season" class="mob-icon-btn" aria-label="Find an Experience"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg></a>
    <button class="mob-icon-btn" id="ms-logout-mob" aria-label="Log out"><svg viewBox="0 0 24 24"><circle cx="12" cy="7.5" r="4"/><path d="M3 21c0-4.97 4.03-9 9-9s9 4.03 9 9"/></svg></button>
  </div>
</div>

<nav id="mob-menu" aria-hidden="true" role="dialog" aria-modal="true" aria-label="Menu principal">
  <div class="mob-menu-content">
    <ul class="mob-list">
      <li class="mob-li" id="mob-ims-trig"><span class="mob-li-link">Initiative Maison Sanguine</span></li>
      <li class="mob-li" id="mob-season-trig"><span class="mob-li-link">Season</span><span class="mob-li-chev"><svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg></span></li>
      <li class="mob-li" id="mob-world-trig"><span class="mob-li-link">Our World</span><span class="mob-li-chev"><svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg></span></li>
      <li class="mob-li"><a href="https://maisonsanguine.com/news/" class="mob-li-link">Stories</a></li>
    </ul>
    <div class="mob-divider"></div>
    <div class="mob-utils">
      <a href="https://maisonsanguine.com/season" class="mob-util"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg><span class="mob-util-label">Find your Experience</span></a>
      <button class="mob-util" id="ms-logout-menu"><svg viewBox="0 0 24 24"><circle cx="12" cy="7.5" r="4"/><path d="M3 21c0-4.97 4.03-9 9-9s9 4.03 9 9"/></svg><span class="mob-util-label">Log out</span></button>
    </div>
    <div class="mob-stories">
      <div class="mob-stories-t"><span class="mob-stories-thin">LATEST</span><span class="mob-stories-serif">STORIES</span></div>
      <div class="mob-carousel">
        <article class="mob-card" style="width:78vw;min-width:78vw;height:auto;overflow:visible;display:flex;flex-direction:column;flex-shrink:0"><div style="width:100%;aspect-ratio:16/9;position:relative;overflow:hidden;flex-shrink:0"><img src="https://images.squarespace-cdn.com/content/v1/690a2434f370707dc2fccae4/65379eba-2cb8-4404-b87e-661c5e8db98d/THE_MAISON_SANGUINE_COLLABORATION.png?format=1500w" alt="" loading="lazy" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"></div><div class="mob-card-below"><p class="mob-card-cat">The Maison Sanguine collaboration</p><h3 class="mob-card-ttl"></h3></div></article>
        <article class="mob-card" style="width:78vw;min-width:78vw;height:auto;overflow:visible;display:flex;flex-direction:column;flex-shrink:0"><div style="width:100%;aspect-ratio:16/9;position:relative;overflow:hidden;flex-shrink:0"><img src="https://images.squarespace-cdn.com/content/v1/690a2434f370707dc2fccae4/527f88ef-cbfc-4116-b452-dfd391a3eca7/MAISON_SANGUINE_HQ.jpg?format=1500w" alt="" loading="lazy" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"></div><div class="mob-card-below"><p class="mob-card-cat">Inside the Dream</p><h3 class="mob-card-ttl"></h3></div></article>
        <article class="mob-card" style="width:78vw;min-width:78vw;height:auto;overflow:visible;display:flex;flex-direction:column;flex-shrink:0"><div style="width:100%;aspect-ratio:16/9;position:relative;overflow:hidden;flex-shrink:0"><img src="https://images.squarespace-cdn.com/content/v1/690a2434f370707dc2fccae4/12a31011-251a-4762-a49e-c2837546b872/MS+Talks+-+The+Architects.png?format=1500w" alt="" loading="lazy" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"></div><div class="mob-card-below"><p class="mob-card-cat">MS Talks</p><h3 class="mob-card-ttl"></h3></div></article>
      </div>
    </div>
  </div>
</nav>

<nav id="mob-sub-season" class="mob-sub" aria-hidden="true" role="dialog" aria-modal="true">
  <div class="mob-sub-hdr2"><button class="mob-sub-back" data-sub-back><svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg></button><span class="mob-sub-heading">Season</span></div>
  <div class="mob-sub-content">
    <ul class="mob-sub-list">
      <li><a href="https://maisonsanguine.com/season">Upcoming Events</a></li>
      <li><a href="https://maisonsanguine.com/event/los-angeles-spring-edition">Los Angeles</a></li>
      <li><a href="https://maisonsanguine.com/event/new-york-summer-edition">New York</a></li>
      <li><a href="https://maisonsanguine.com/event/dubai-fall-edition">Dubai</a></li>
      <li><a href="https://maisonsanguine.com/event/miami-winter-edition">Miami</a></li>
    </ul>
    <div class="mob-sub-vis">
      <div class="mob-sub-vis-t"><span class="mob-sub-vis-thin">OUR</span><span class="mob-sub-vis-serif">PRODUCTIONS</span></div>
    </div>
  </div>
</nav>

<nav id="mob-sub-world" class="mob-sub" aria-hidden="true" role="dialog" aria-modal="true">
  <div class="mob-sub-hdr2"><button class="mob-sub-back" data-sub-back><svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg></button><span class="mob-sub-heading">Our World</span></div>
  <div class="mob-sub-content">
    <ul class="mob-sub-list">
      <li><a href="https://maisonsanguine.com/about/maison-sanguine-contemporary">MS x Art</a></li>
      <li><a href="https://maisonsanguine.com/about/music">MS x Music</a></li>
      <li><a href="https://maisonsanguine.com/msarchives">MS Archives</a></li>
    </ul>
    <div class="mob-sub-vis">
      <div class="mob-sub-vis-t"><span class="mob-sub-vis-thin">WHO WE</span><span class="mob-sub-vis-serif">ARE</span></div>
    </div>
  </div>
</nav>`

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null)
  const [reservations, setReservations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'myms' | 'experiences' | 'wishlist'>('myms')
  const [popup, setPopup] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      const { data: reservations } = await supabase.from('reservations').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      setProfile(profile)
      setReservations(reservations || [])
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    const logout = async () => {
      await supabase.auth.signOut()
      router.push('/auth/login')
    }
    const ids = ['ms-logout-desk','ms-logout-mob','ms-logout-menu']
    ids.forEach(id => document.getElementById(id)?.addEventListener('click', logout))

    // Wire header JS
    const script = document.createElement('script')
    script.text = `(function () {
  'use strict';
  var ARCHIVES_SLUG='/msarchives',IMS_SLUG='/initiative-maison-sanguine';
  var WHITE_SLUGS=['/news','/stories','/stories-editions','/stories-artsandculture','/stories-lamaison','/stories-sustainability','/stories-podcasts','/privacy','/privacy-notice','/privacy-policy','/accessibility','/cookie','/cookie-policy','/terms','/terms-of-use','/contact'];
  var path=window.location.pathname;
  var isAR=path.indexOf(ARCHIVES_SLUG)!==-1,isIMS=path.indexOf(IMS_SLUG)!==-1,isWH=false;
  for(var wi=0;wi<WHITE_SLUGS.length;wi++){if(path===WHITE_SLUGS[wi]||path.indexOf(WHITE_SLUGS[wi]+'/')===0||path.indexOf(WHITE_SLUGS[wi]+'?')===0){isWH=true;break}}
  if(isAR)document.documentElement.classList.add('page-archives');
  if(isIMS)document.documentElement.classList.add('page-ims');
  if(isWH)document.documentElement.classList.add('page-white-header');
  function msFromVar(n){var v=getComputedStyle(document.documentElement).getPropertyValue(n).trim();return v.indexOf('ms')!==-1?parseFloat(v):parseFloat(v)*1000}
  var hdr=document.getElementById('msh'),menu=document.getElementById('msm'),ov=document.getElementById('msm-ov');
  var mobHdr=document.getElementById('msm-mob'),mobMenu=document.getElementById('mob-menu'),burger=document.getElementById('mob-burger');
  var navItems=document.querySelectorAll('.msh-nav-item[data-panel]');
  var panels={season:document.getElementById('p-season'),world:document.getElementById('p-world')};
  var ORDER=['season','world'];
  var active=null,mobOpen=false,lastY=0,ticking=false,ctTimer=null,closeT=null;
  function msFromVar2(n){var v=getComputedStyle(document.documentElement).getPropertyValue(n).trim();return v.indexOf('ms')!==-1?parseFloat(v):parseFloat(v)*1000}
  function updateBg(y){if(mobOpen||isWH)return;var solid=y>10||active;if(!isAR&&!isIMS){hdr&&hdr.classList.toggle('scrolled',solid);mobHdr&&mobHdr.classList.toggle('scrolled',solid)}}
  window.addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(function(){var y=window.scrollY,d=y-lastY;if(!isWH&&!active&&!mobOpen){if(d>4){hdr&&hdr.classList.add('hidden')}else if(d<-4||y<=10){hdr&&hdr.classList.remove('hidden')}}updateBg(y);lastY=y;ticking=false})}},{passive:true});
  function revealPanel(key,prev){var ri=ORDER.indexOf(key),oi=prev?ORDER.indexOf(prev):-1,r=ri>oi;if(prev&&panels[prev]){var out=panels[prev];out.classList.remove('visible');out.style.cssText='transition:opacity .16s ease,transform .16s ease;opacity:0;transform:'+(r?'translateX(-6px)':'translateX(6px)')+';pointer-events:none'}var inn=panels[key];if(!inn)return;inn.style.cssText='transition:none;opacity:0;transform:'+(r?'translateX(6px)':'translateX(-6px)')+';pointer-events:none';requestAnimationFrame(function(){requestAnimationFrame(function(){inn.style.cssText='transition:opacity .36s ease,transform .36s ease;opacity:1;transform:translateX(0);pointer-events:auto';inn.classList.add('visible')})})}
  function openMenu(key){clearTimeout(ctTimer);clearTimeout(closeT);var prev=active;active=key;hdr&&hdr.classList.remove('hidden');hdr&&hdr.classList.add('on','scrolled');mobHdr&&mobHdr.classList.add('scrolled');navItems.forEach(function(n){n.classList.toggle('on',n.dataset.panel===key)});if(prev){revealPanel(key,prev)}else{menu.style.display='block';menu.setAttribute('aria-hidden','false');ov.classList.add('show');requestAnimationFrame(function(){requestAnimationFrame(function(){menu.classList.add('opening')})});ctTimer=setTimeout(function(){if(active===key)revealPanel(key,null)},msFromVar('--ct-delay'))}}
  function closeMenu(){if(!active)return;clearTimeout(ctTimer);active=null;Object.keys(panels).forEach(function(k){var p=panels[k];if(!p)return;p.classList.remove('visible');p.style.cssText='transition:none;opacity:0;transform:none;pointer-events:none'});menu.classList.remove('opening');menu.setAttribute('aria-hidden','true');ov.classList.remove('show');hdr&&hdr.classList.remove('on');navItems.forEach(function(n){n.classList.remove('on')});closeT=setTimeout(function(){if(!active){menu.style.display='none';updateBg(window.scrollY)}},msFromVar('--bg-dur')+60)}
  navItems.forEach(function(item){item.addEventListener('click',function(e){if(!item.dataset.panel)return;e.preventDefault();active===item.dataset.panel?closeMenu():openMenu(item.dataset.panel)})});
  ov&&ov.addEventListener('click',closeMenu);
  var mobCtTimer=null,mobClose=document.getElementById('mob-close'),mobCloseSub=document.getElementById('mob-close-sub');
  function openMob(){mobOpen=true;mobMenu.style.display='block';mobMenu.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';mobHdr&&mobHdr.classList.remove('sub-open');mobHdr&&mobHdr.classList.add('menu-open');clearTimeout(mobCtTimer);requestAnimationFrame(function(){mobMenu.classList.add('open')});mobCtTimer=setTimeout(function(){mobMenu.classList.add('content-vis')},msFromVar('--ct-delay')||600)}
  function closeMob(){mobOpen=false;clearTimeout(mobCtTimer);mobHdr&&mobHdr.classList.remove('menu-open','sub-open');document.body.style.overflow='';document.querySelectorAll('.mob-sub.open').forEach(function(s){s.style.transition='none';s.classList.remove('open');s.setAttribute('aria-hidden','true')});mobMenu.classList.remove('open','content-vis');mobMenu.setAttribute('aria-hidden','true');setTimeout(function(){if(!mobOpen){document.querySelectorAll('.mob-sub').forEach(function(s){s.style.transition=''});mobMenu.style.display='none';updateBg(window.scrollY)}},msFromVar('--bg-dur')+60)}
  burger&&burger.addEventListener('click',function(){mobOpen?closeMob():openMob()});
  mobClose&&mobClose.addEventListener('click',closeMob);
  function openSub(id){var s=document.getElementById(id);if(!s)return;s.setAttribute('aria-hidden','false');s.classList.add('open');mobHdr&&mobHdr.classList.remove('menu-open');mobHdr&&mobHdr.classList.add('sub-open')}
  function closeSub(el){el.classList.remove('open');el.setAttribute('aria-hidden','true')}
  var seasT=document.getElementById('mob-season-trig'),worldT=document.getElementById('mob-world-trig');
  seasT&&seasT.addEventListener('click',function(){openSub('mob-sub-season')});
  worldT&&worldT.addEventListener('click',function(){openSub('mob-sub-world')});
  document.querySelectorAll('[data-sub-back]').forEach(function(b){b.addEventListener('click',function(){var s=b.closest('.mob-sub');if(s)closeSub(s);mobHdr&&mobHdr.classList.remove('sub-open');mobHdr&&mobHdr.classList.add('menu-open')})});
  document.querySelectorAll('[data-close-all]').forEach(function(b){b.addEventListener('click',closeMob)});
  mobCloseSub&&mobCloseSub.addEventListener('click',closeMob);
  var LOGO_IMS_DARK='https://images.squarespace-cdn.com/content/v1/690a2434f370707dc2fccae4/c3cea383-ede4-4e30-a9f3-9bd7d273973f/IMS-LOGOTYPE_DARK.png?format=1500w';
  var LOGO_MS_DESK_DARK='https://images.squarespace-cdn.com/content/v1/690a2434f370707dc2fccae4/d680077f-c82d-4753-9711-123fcb38ef39/MAISON_SANGUINE_LOGOTYPE_DARK.png?format=1500w';
  var LOGO_MS_MOB_DARK='https://images.squarespace-cdn.com/content/v1/690a2434f370707dc2fccae4/7f897d71-28bf-4618-b66d-19689f551029/MAISON_SANGUINE_LOGOTYPE_MOBILE_DARK.png?format=1500w';
  function swapWhiteHeaderLogos(){if(!isWH)return;var imgLD=document.querySelector('#msh .msh-logo150 img');if(imgLD)imgLD.src=LOGO_IMS_DARK;var imgCD=document.querySelector('#msh .msh-center img');if(imgCD)imgCD.src=LOGO_MS_DESK_DARK;document.querySelectorAll('#msm-mob .mob-150 img').forEach(function(img){img.src=LOGO_IMS_DARK});var imgCM=document.querySelector('#msm-mob .mob-center-logo img');if(imgCM)imgCM.src=LOGO_MS_MOB_DARK}
  var LS={'.msh-logo150 img':{w:'80px',h:'70px'},'.mob-150 img':{w:'60px',h:'50px'},'.mob-sub-hdr1-logo img':{w:'60px',h:'50px'},'.msh-center img':{w:'auto',h:'50px'},'.mob-center-logo img':{w:'auto',h:'50px'}};
  var _forcing=false;
  function forceSizes(){if(_forcing)return;_forcing=true;Object.keys(LS).forEach(function(sel){var c=LS[sel];document.querySelectorAll(sel).forEach(function(img){img.style.setProperty('width',c.w,'important');img.style.setProperty('height',c.h,'important');img.style.setProperty('max-width','none','important');img.style.setProperty('max-height','none','important');img.style.setProperty('min-width','unset','important');img.style.setProperty('min-height','unset','important');img.style.setProperty('object-fit','contain','important');img.style.setProperty('display','block','important');img.style.setProperty('flex-shrink','0','important')})});requestAnimationFrame(function(){_forcing=false});swapWhiteHeaderLogos()}
  forceSizes();window.addEventListener('load',forceSizes);
  new MutationObserver(function(mutations){if(_forcing)return;var need=false;mutations.forEach(function(r){if(r.type==='attributes'&&r.target.tagName==='IMG')need=true;if(r.type==='childList')need=true});if(need)forceSizes()}).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['style','width','height']});
  updateBg(window.scrollY);
}());`
    document.body.appendChild(script)
    return () => { ids.forEach(id => document.getElementById(id)?.removeEventListener('click', logout)) }
  }, [])

  if (loading) return (
    <main style={{ minHeight: '100vh', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
      <p style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: '#999' }}>Loading</p>
    </main>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', color: '#111' }}>

      <div dangerouslySetInnerHTML={{ __html: HEADER_HTML }} />

      {popup && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: 'rgba(0,0,0,0.5)' }}>
          <div style={{ background: '#f5f5f3', maxWidth: '560px', width: '100%', padding: '48px 40px', position: 'relative', boxSizing: 'border-box' }}>
            <button onClick={() => setPopup(false)} style={{ position: 'absolute', top: '20px', right: '24px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '22px', color: '#111', lineHeight: 1, padding: 0 }}>×</button>
            <p style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: '#111', margin: '0 0 20px', fontWeight: '600' }}>Security Notice</p>
            <p style={{ fontSize: '14px', color: '#444', lineHeight: '1.9', fontWeight: '300', margin: '0 0 32px' }}>Maison Sanguine will never request payments, passwords, or confidential information through unofficial channels. If you receive any suspicious communication claiming to represent Maison Sanguine, please contact our team directly through our official website.</p>
            <button onClick={() => setPopup(false)} style={{ width: '100%', background: '#111', color: '#fff', border: 'none', padding: '16px', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}>I Understand</button>
          </div>
        </div>
      )}

      <style>{`
        .ms-tabs-bar { position: sticky; top: 120px; z-index: 8000; background: #fff; border-bottom: 1px solid #e8e8e8; }
        @media (max-width: 1024px) { .ms-tabs-bar { top: 80px; } }
        .ms-tabs-inner { display: flex; align-items: center; padding: 0 90px; }
        @media (max-width: 1024px) { .ms-tabs-inner { padding: 0 24px; } }
        .ms-content-top { padding-top: 120px; }
        @media (max-width: 1024px) { .ms-content-top { padding-top: 80px; } }
        .ms-myms-grid { background: #f5f5f3; min-height: 55vh; padding: 80px 90px; display: grid; grid-template-columns: 1fr 1fr auto; gap: 60px; align-items: center; box-sizing: border-box; }
        @media (max-width: 1024px) { .ms-myms-grid { grid-template-columns: 1fr !important; padding: 48px 24px !important; gap: 32px !important; } }
        .ms-content-pad { padding: 64px 90px 80px; box-sizing: border-box; }
        @media (max-width: 1024px) { .ms-content-pad { padding: 48px 24px 60px !important; } }
      `}</style>

      <div className="ms-tabs-bar">
        <div className="ms-tabs-inner">
          {[['myms','My MS'],['experiences','My Experiences'],['wishlist','My Wishlist']].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key as any)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px', fontWeight: tab === key ? '500' : '400', color: tab === key ? '#111' : '#999', padding: '18px 0', marginRight: '40px', letterSpacing: '.04em', borderBottom: tab === key ? '2px solid #111' : '2px solid transparent', transition: 'all .2s' }}>{label}</button>
          ))}
        </div>
      </div>

      <div className="ms-content-top">

        {tab === 'myms' && (
          <div className="ms-myms-grid">
            <div>
              <h1 style={{ fontSize: '56px', fontWeight: '100', letterSpacing: '3px', textTransform: 'uppercase', color: '#111', margin: '0 0 16px', lineHeight: '1' }}>WELCOME</h1>
              <p style={{ fontSize: '15px', fontWeight: '300', color: '#777', margin: 0 }}>{profile?.first_name} {profile?.last_name}</p>
            </div>
            <div>
              <p style={{ fontSize: '14px', color: '#444', lineHeight: '1.9', fontWeight: '300', margin: '0 0 18px' }}>Access your invitations and reservations in your Portfolio and enjoy all Maison Sanguine services from a single point of access.</p>
              <p style={{ fontSize: '14px', color: '#444', lineHeight: '1.9', fontWeight: '300', margin: 0 }}>In just a few clicks, you can view your upcoming experiences, manage your reservations, confirm your attendance at our nocturnal productions, access practical information and experience details, or contact our team for any assistance request.</p>
            </div>
            <button onClick={() => setTab('experiences')} style={{ background: '#111', color: '#fff', border: 'none', padding: '16px 32px', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', alignSelf: 'center' }}>My Experiences</button>
          </div>
        )}

        {tab === 'experiences' && (
          <div className="ms-content-pad">
            <div style={{ marginBottom: '48px' }}>
              <h2 style={{ margin: '0 0 16px', lineHeight: '1' }}>
                <span style={{ display: 'block', fontSize: '52px', fontWeight: '100', letterSpacing: '2px', textTransform: 'uppercase', color: '#111', fontFamily: 'inherit' }}>MY</span>
                <span style={{ display: 'block', fontSize: '52px', fontWeight: '200', fontStyle: 'italic', color: '#111', fontFamily: 'Georgia, serif' }}>Experiences</span>
              </h2>
              <p style={{ fontSize: '13px', color: '#999', fontWeight: '300', margin: 0, lineHeight: '1.7' }}>Select an experience to explore its details and access all related services.</p>
            </div>
            {reservations.length === 0 ? (
              <div style={{ border: '1px solid #e8e8e8', padding: '100px 40px', textAlign: 'center' }}>
                <p style={{ fontSize: '13px', color: '#bbb', marginBottom: '28px', fontWeight: '300' }}>No experience reserved yet</p>
                <a href="https://maisonsanguine.com/season" style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#111', textDecoration: 'none', borderBottom: '1px solid #111', paddingBottom: '3px' }}>Browse Experiences +</a>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#e8e8e8' }}>
                {reservations.map(r => (
                  <div key={r.id} style={{ background: '#fff', padding: '32px 40px', display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: '24px' }}>
                    <div>
                      <p style={{ fontSize: '18px', fontWeight: '200', letterSpacing: '1px', margin: '0 0 8px', textTransform: 'uppercase' }}>{r.experience_name}</p>
                      <p style={{ color: '#999', fontSize: '12px', margin: 0, fontWeight: '300' }}>
                        {r.experience_date ? new Date(r.experience_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
                        {r.guests > 1 && ` · ${r.guests} guests`}
                      </p>
                    </div>
                    <span style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: r.status === 'confirmed' ? '#111' : '#bbb', border: '1px solid', borderColor: r.status === 'confirmed' ? '#111' : '#e8e8e8', padding: '6px 14px' }}>
                      {r.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'wishlist' && (
          <div className="ms-content-pad">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '48px', flexWrap: 'wrap', gap: '20px' }}>
              <div>
                <h2 style={{ margin: '0 0 16px', lineHeight: '1' }}>
                  <span style={{ display: 'block', fontSize: '52px', fontWeight: '100', letterSpacing: '2px', textTransform: 'uppercase', color: '#111', fontFamily: 'inherit' }}>MY</span>
                  <span style={{ display: 'block', fontSize: '52px', fontWeight: '200', fontStyle: 'italic', color: '#111', fontFamily: 'Georgia, serif' }}>Wishlist</span>
                </h2>
                <p style={{ fontSize: '13px', color: '#999', fontWeight: '300', margin: 0, lineHeight: '1.7' }}>Select your favourites to learn more and register your interest for upcoming experiences.</p>
              </div>
              <a href="https://maisonsanguine.com/season" style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#111', textDecoration: 'none', border: '1px solid #111', padding: '14px 28px', whiteSpace: 'nowrap', alignSelf: 'flex-start' }}>Register Interest</a>
            </div>
            <div style={{ border: '1px solid #e8e8e8', padding: '100px 40px', textAlign: 'center' }}>
              <p style={{ fontSize: '13px', color: '#bbb', marginBottom: '28px', fontWeight: '300' }}>No experiences saved yet</p>
              <a href="https://maisonsanguine.com/season" style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#111', textDecoration: 'none', borderBottom: '1px solid #111', paddingBottom: '3px' }}>Browse All Experiences +</a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
