const LOGO = '<a class="ms-tr__logo" href="/" aria-label="Maison Sanguine"><picture><source media="(min-width:768px)" srcset="https://images.squarespace-cdn.com/content/v1/690a2434f370707dc2fccae4/599412e7-b2c0-44bc-8eb7-5b9db97af55c/MS-WORDMARK.png?format=1500w"><img src="https://images.squarespace-cdn.com/content/v1/690a2434f370707dc2fccae4/bb8c302b-7144-4246-9a16-b2db546ec9de/MS-LOGO.png?format=1500w" alt="Maison Sanguine"></picture></a>'

export const TRACK_HTML = '<div class="ms-tr">' +
  '<header class="ms-tr__hdr"><div class="ms-tr__hin">' + LOGO + '<button type="button" class="ms-tr__out" hidden>Log out</button></div></header>' +
  '<main class="ms-tr__main">' +
  '<section class="ms-tr__card ms-tr__login" data-view="email" hidden>' +
  '<h1 class="ms-tr__h">Track your application</h1>' +
  '<p class="ms-tr__p">Enter the email address you used to apply. We will send you a one-time code.</p>' +
  '<label class="ms-tr__lb" for="tr-email">Email address</label>' +
  '<input class="ms-tr__in" id="tr-email" type="email" autocomplete="email" inputmode="email">' +
  '<div class="ms-tr__err" role="alert"></div>' +
  '<button type="button" class="ms-tr__b ms-tr__send">Send code</button>' +
  '</section>' +
  '<section class="ms-tr__card ms-tr__login" data-view="code" hidden>' +
  '<h1 class="ms-tr__h">Track your application</h1>' +
  '<p class="ms-tr__p ms-tr__sent"></p>' +
  '<label class="ms-tr__lb" for="tr-code">One-time code</label>' +
  '<input class="ms-tr__in ms-tr__code" id="tr-code" type="text" autocomplete="one-time-code" inputmode="numeric" maxlength="6">' +
  '<div class="ms-tr__err" role="alert"></div>' +
  '<button type="button" class="ms-tr__b ms-tr__verify">Verify</button>' +
  '<button type="button" class="ms-tr__lnk ms-tr__resend">Send a new code</button>' +
  '</section>' +
  '<div class="ms-tr__list" data-view="list" hidden></div>' +
  '<p class="ms-tr__none" data-view="none" hidden>No application found for this email address.</p>' +
  '</main></div>'

export const TRACK_APP = `(function(){
var root=document.querySelector('.ms-tr');if(!root)return;
var $=function(s,r){return (r||root).querySelector(s)};
var views=root.querySelectorAll('[data-view]');
var qs=new URLSearchParams(location.search);var ref=qs.get('ref')||'';
var lang=(document.documentElement.lang||'en').slice(0,2)==='fr'?'fr':'en';
var email='';
function show(v){views.forEach(function(e){e.hidden=e.getAttribute('data-view')!==v});$('.ms-tr__out').hidden=v!=='list'&&v!=='none'}
function esc(s){var d=document.createElement('div');d.textContent=s==null?'':String(s);return d.innerHTML}
function api(url,body){return fetch(url,{method:body?'POST':'GET',headers:body?{'Content-Type':'application/json'}:undefined,body:body?JSON.stringify(body):undefined,credentials:'same-origin'}).then(function(r){return r.json().catch(function(){return {}}).then(function(j){return {ok:r.ok,s:r.status,j:j}})})}
function err(view,m){var e=$('[data-view="'+view+'"] .ms-tr__err');e.textContent=m||'';e.classList.toggle('is-on',!!m)}
var STEPS=['New','Under review','Interview','Offer submitted'];
var IDX={new:0,review:1,interview:2,offer:3};
function fdate(d){try{return new Date(d).toLocaleDateString(lang==='fr'?'fr-FR':'en-GB',{day:'numeric',month:'long',year:'numeric'})}catch(e){return ''}}
var ANS=[['civ','Citizenship or nationality'],['notice','Notice period'],['auth','Work authorization'],['years','Years of experience'],['rate','Expected rate'],['speaks','Do you speak English fluently?'],['noncompete','Are you bound by a non-compete clause?'],['license','Do you hold a driving licence?'],['car','Do you have a car?']];
function ansHtml(a){
 var h='';
 ANS.forEach(function(p){var v=a&&a[p[0]];if(v)h+='<div class="ms-tr__qa"><div class="ms-tr__q">'+esc(p[1])+'</div><div class="ms-tr__a">'+esc(v)+'</div></div>'});
 var l=a&&a.langs;if(l&&l.length){h+='<div class="ms-tr__qa"><div class="ms-tr__q">Languages</div><div class="ms-tr__a">'+l.map(function(x){return esc(x.name||x.lang||x.l||'')+(x.level||x.lv?' ('+esc(x.level||x.lv)+')':'')}).join(', ')+'</div></div>'}
 return h;
}
function card(a){
 var i=IDX[a.status],steps='';
 var dead=a.status==='declined'||a.status==='withdrawn';
 STEPS.forEach(function(s,k){var cls=dead?'':(k<i?' is-done':(k===i?' is-cur':''));steps+='<li class="ms-tr__st'+cls+'"><span class="ms-tr__dot"></span><span class="ms-tr__sl">'+esc(s)+'</span></li>'});
 var note=a.status==='declined'?'<p class="ms-tr__note">After careful consideration, we will not be moving forward with your application. Thank you for your interest in Maison Sanguine.</p>':a.status==='withdrawn'?'<p class="ms-tr__note">You have withdrawn this application.</p>':'';
 var name=((a.first_name||'')+' '+(a.last_name||'')).trim();
 var av=a.photo?'<img class="ms-tr__av" src="'+esc(a.photo)+'" alt="">':'<span class="ms-tr__av ms-tr__av--i">'+esc((a.first_name||'?').charAt(0).toUpperCase())+'</span>';
 var ans=ansHtml(a.answers);
 return '<article class="ms-tr__app" data-id="'+esc(a.id)+'">'+
 '<div class="ms-tr__card ms-tr__job"><h1 class="ms-tr__h">'+esc(a.job_title)+'</h1><div class="ms-tr__loc">Paris, France</div><div class="ms-tr__dt">Applied on '+esc(fdate(a.created_at))+'</div><ol class="ms-tr__steps">'+steps+'</ol>'+note+
 '<a class="ms-tr__lnk ms-tr__ji" href="/opportunities/'+esc(a.job_slug)+'">Job information</a></div>'+
 (ans?'<div class="ms-tr__card"><h2 class="ms-tr__h2">Preliminary questions</h2><div class="ms-tr__hr"></div><div class="ms-tr__body">'+ans+'</div></div>':'')+
 '<div class="ms-tr__card"><h2 class="ms-tr__h2">Candidate</h2><div class="ms-tr__hr"></div><div class="ms-tr__body ms-tr__cand">'+av+'<div><div class="ms-tr__nm">'+esc(name)+'</div><div class="ms-tr__ct">'+esc(a.email)+'</div>'+(a.phone?'<div class="ms-tr__ct">'+esc(a.phone)+'</div>':'')+(a.city?'<div class="ms-tr__ct">'+esc(a.city)+'</div>':'')+'</div></div></div>'+
 '<div class="ms-tr__card"><h2 class="ms-tr__h2">Manage my data</h2><div class="ms-tr__hr"></div><div class="ms-tr__body">'+
 '<label class="ms-tr__lb">I would like to...</label><select class="ms-tr__in ms-tr__sel"><option value="">Select</option><option value="download">Download my data</option>'+(a.status==='withdrawn'?'':'<option value="withdraw">Withdraw my application</option>')+'<option value="delete">Delete my data</option></select>'+
 '<div class="ms-tr__err" role="alert"></div><button type="button" class="ms-tr__b ms-tr__go" disabled>Confirm</button></div></div>'+
 '</article>';
}
function load(){
 return api('/api/careers/track/me').then(function(r){
  if(r.s===401){return false}
  email=r.j.email||'';var list=r.j.applications||[];
  if(!list.length){show('none');return true}
  var el=$('.ms-tr__list');el.innerHTML=list.map(card).join('');show('list');
  if(ref){var t=el.querySelector('[data-id="'+ref+'"]');if(t)el.insertBefore(t,el.firstChild)}
  return true;
 });
}
function sendCode(){
 var v=ref?'':$('#tr-email').value.trim();
 if(!ref&&!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/.test(v)){err('email','Please enter a valid email address.');return Promise.resolve()}
 err('email','');var b=$('.ms-tr__send'),b2=$('.ms-tr__resend');b.disabled=true;b2.disabled=true;
 return api('/api/careers/track/send',ref?{ref:ref}:{email:v}).then(function(r){
  b.disabled=false;b2.disabled=false;
  if(!r.ok){var m=r.s===429?'Too many attempts. Please try again later.':'Something went wrong. Please try again in a moment.';if(r.j&&r.j.error==='email')m='Please enter a valid email address.';err(ref?'code':'email',m);if(ref)show('code');return}
  email=v;$('.ms-tr__sent').textContent='We have sent a one-time code to '+(r.j.masked||'your email address')+'.'+' '+'It expires in 5 minutes.';
  $('#tr-code').value='';err('code','');show('code');$('#tr-code').focus();
 });
}
function verify(){
 var c=$('#tr-code').value.replace(/\\s+/g,'');
 if(!/^\\d{6}$/.test(c)){err('code','Please enter the 6-digit code.');return}
 err('code','');var b=$('.ms-tr__verify');b.disabled=true;
 api('/api/careers/track/verify',ref?{ref:ref,code:c}:{email:email,code:c}).then(function(r){
  b.disabled=false;
  if(!r.ok){err('code',r.j&&r.j.error==='expired'?'This code has expired. Please request a new one.':r.s===429?'Too many attempts. Please try again later.':'This code is not valid. Please try again.');return}
  load().then(function(ok){if(!ok)err('code','Something went wrong. Please try again in a moment.')});
 });
}
$('.ms-tr__send').addEventListener('click',sendCode);
$('#tr-email').addEventListener('keydown',function(e){if(e.key==='Enter')sendCode()});
$('.ms-tr__verify').addEventListener('click',verify);
$('#tr-code').addEventListener('keydown',function(e){if(e.key==='Enter')verify()});
$('.ms-tr__resend').addEventListener('click',sendCode);
$('.ms-tr__out').addEventListener('click',function(){api('/api/careers/track/logout',{}).then(function(){location.href=location.pathname})});
root.addEventListener('change',function(e){var s=e.target.closest&&e.target.closest('.ms-tr__sel');if(s){var app=s.closest('.ms-tr__app');app.querySelector('.ms-tr__go').disabled=!s.value}});
root.addEventListener('click',function(e){
 var g=e.target.closest&&e.target.closest('.ms-tr__go');if(!g)return;
 var app=g.closest('.ms-tr__app'),act=app.querySelector('.ms-tr__sel').value,id=app.getAttribute('data-id');
 if(!act)return;
 if(act==='delete'&&!window.confirm('This will permanently delete your application and your data. This cannot be undone.'))return;
 if(act==='withdraw'&&!window.confirm('Do you want to withdraw your application?'))return;
 g.disabled=true;var er=app.querySelector('.ms-tr__err');er.classList.remove('is-on');
 api('/api/careers/track/data',{id:id,action:act}).then(function(r){
  if(!r.ok){g.disabled=false;er.textContent='Something went wrong. Please try again in a moment.';er.classList.add('is-on');return}
  if(act==='download'){var b=new Blob([JSON.stringify(r.j.data,null,2)],{type:'application/json'});var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='application.json';document.body.appendChild(a);a.click();a.remove();g.disabled=false;return}
  load();
 });
});
load().then(function(ok){
 if(ok)return;
 if(ref){sendCode()}else show('email');
});
})();`
