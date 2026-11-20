const PIN = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21.5s-6.5-5.9-6.5-11.2a6.5 6.5 0 0 1 13 0c0 5.3-6.5 11.2-6.5 11.2z"/><circle cx="12" cy="10.2" r="2.4"/></svg>'
const SEARCH = '<svg class="ms-ap__si" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21"/></svg>'
const CAL = '<svg class="ms-ap__ci" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>'
const CHEV = '<svg class="ms-ap__chev" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9.5 6 6 6-6"/></svg>'
const PENCIL = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 20 1-4.5L16.5 4a2.1 2.1 0 0 1 3 3L8 18.5 4 20zM14.5 6l3.5 3.5"/></svg>'

const label = (id: string, text: string, req: boolean) => '<label class="ms-ap__l" for="a-' + id + '">' + text + (req ? '<span class="ms-ap__rq">*</span>' : '') + '</label>'
const field = (name: string, text: string, req: boolean, attrs?: string, inner?: string) =>
  '<div class="ms-ap__f" data-f="' + name + '">' + label(name, text, req) + (inner || '<input class="ms-ap__in" id="a-' + name + '" name="' + name + '" ' + (attrs || '') + '>') + '<div class="ms-ap__err" role="alert"></div></div>'

const zone = (id: string) =>
  '<div class="ms-ap__dzw" data-zone="' + id + '"><label class="ms-ap__dz"><input type="file" class="ms-ap__file" accept=".pdf,.doc,.docx,.rtf,.odt,.txt"><span class="ms-ap__dzt"><span class="ms-ap__lk">Choose a file</span> or drop it here</span><span class="ms-ap__dzs">4MB maximum size</span></label><div class="ms-ap__err" role="alert"></div></div>'

const RQ = '<span class="ms-ap__rq">*</span>'
const PLUS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v16M4 12h16"/></svg>'
const opts = (list: string[], ph?: string) => '<option value=""' + (ph ? '>' + ph : ' hidden>') + '</option>' + list.map((o: string) => '<option value="' + o + '">' + o + '</option>').join('')
const sel = (name: string, text: string, list: string[]) =>
  '<div class="ms-ap__f ms-ap__f--c" data-f="' + name + '">' + label(name, text, true) + '<div class="ms-ap__sr"><select class="ms-ap__in ms-ap__in--s ms-ap__sel" id="a-' + name + '" name="' + name + '">' + opts(list) + '</select>' + SEARCH + '</div><div class="ms-ap__err" role="alert"></div></div>'
const radio = (name: string, text: string, req: boolean) =>
  '<div class="ms-ap__f" data-f="' + name + '"><div class="ms-ap__l">' + text + (req ? RQ : '') + '</div><div class="ms-ap__rg" role="radiogroup"><label class="ms-ap__rd"><input type="radio" name="' + name + '" value="yes"><i></i><span>Yes</span></label><label class="ms-ap__rd"><input type="radio" name="' + name + '" value="no"><i></i><span>No</span></label></div><div class="ms-ap__err" role="alert"></div></div>'

const LEVELS = ['Native or bilingual', 'Fluent', 'Advanced', 'Intermediate', 'Beginner']
const EXTRAZONE = '<div class="ms-ap__f ms-ap__f--x"><div class="ms-ap__l">Other attachments</div><div class="ms-ap__dzw" data-zone="extra"><label class="ms-ap__dz"><input type="file" class="ms-ap__xfile" multiple accept=".pdf,.doc,.docx,.rtf,.odt,.txt,.jpg,.jpeg,.png"><span class="ms-ap__dzt"><span class="ms-ap__lk">Choose a file</span> or drop it here</span><span class="ms-ap__dzs">Supported files: PDF, DOC, DOCX, RTF, ODT, TXT, JPG, JPEG, PNG (4MB maximum size in total)</span></label><div class="ms-ap__xl"></div><div class="ms-ap__err" role="alert"></div></div></div>'
const LANGS = '<div class="ms-ap__f ms-ap__f--lg" data-f="langs"><div class="ms-ap__l">Languages' + RQ + '</div><div class="ms-ap__lrs"><div class="ms-ap__lr"><input class="ms-ap__in" name="lang_n" type="text" placeholder="Please enter a language you speak" autocomplete="off" aria-label="Language"><div class="ms-ap__sr"><select class="ms-ap__in ms-ap__in--s ms-ap__sel" name="lang_l" aria-label="Level">' + opts(LEVELS, 'Choose your level.') + '</select>' + SEARCH + '</div></div></div><div class="ms-ap__err" role="alert"></div></div><div class="ms-ap__ad"><button type="button" class="ms-ap__b ms-ap__b--t ms-ap__addl">' + PLUS + 'Add</button></div>'

const STEP2 =
  '<div class="ms-ap__step" data-step="2" hidden>' +
  '<section class="ms-ap__q"><h2 class="ms-ap__h">Preliminary questions</h2>' +
  EXTRAZONE +
  sel('civ', 'Title', ['Mr', 'Mrs', 'Other']) +
  LANGS +
  radio('speaks', 'Do you speak the language of the job posting?', true) +
  sel('notice', 'What is the length of your notice period (months)?', ['None, available immediately', '1 month', '2 months', '3 months', 'More than 3 months']) +
  radio('noncompete', 'Do you have a non-compete clause in your current contract?', true) +
  radio('license', 'Do you hold a valid driver\'s license?', true) +
  radio('car', 'Do you have a car?', true) +
  sel('auth', 'Are you authorized to work in France?', ['Yes, EU, EEA or Swiss national', 'Yes, I hold a valid work permit', 'No, I would need sponsorship']) +
  sel('years', 'How many years of experience do you have in a similar role?', ['Less than 1 year', '1 to 2 years', '3 to 5 years', '6 to 10 years', 'More than 10 years']) +
  sel('rate', 'What is your ideal activity rate?', ['100%', '80%', '60%', '50%', 'Less than 50%']) +
  radio('docs', 'I confirm that I have attached all the requested documents (a CV and a cover letter).', false) +
  '</section>' +
  '<section class="ms-ap__pvs"><p class="ms-ap__pvt">You will find details about our <a href="https://maisonsanguine.com/legal/privacy-notice" target="_blank" rel="noopener">privacy notice</a>.</p><div class="ms-ap__hr"></div>' +
  '<div class="ms-ap__f ms-ap__consent" data-f="consent"><label class="ms-ap__ck"><input type="checkbox" name="consent"><span>You declare that you have read and accepted the Maison Sanguine Privacy Notice.' + RQ + '</span></label><div class="ms-ap__err" role="alert"></div></div></section>' +
  '<div class="ms-ap__act"><button type="button" class="ms-ap__b ms-ap__back">Back</button><button type="submit" class="ms-ap__b ms-ap__b--p ms-ap__submit">Submit application</button></div>' +
  '</div>'

const build = (slug: string, title: string) =>
  '<div class="ms-ap" data-job="' + slug + '" data-title="' + title + '">' +
  '<header class="ms-ap__hdr"><div class="ms-ap__hin">' +
  '<a class="ms-ap__logo" href="/careers/opportunities/' + slug + '" aria-label="Maison Sanguine"><picture><source media="(min-width:768px)" srcset="https://images.squarespace-cdn.com/content/v1/690a2434f370707dc2fccae4/599412e7-b2c0-44bc-8eb7-5b9db97af55c/MS-WORDMARK.png?format=1500w"><img src="https://images.squarespace-cdn.com/content/v1/690a2434f370707dc2fccae4/bb8c302b-7144-4246-9a16-b2db546ec9de/MS-LOGO.png?format=1500w" alt="Maison Sanguine"></picture></a>' +
  '<div class="ms-ap__job"><div class="ms-ap__jt">' + title + '</div><div class="ms-ap__jl">' + PIN + '<span>Paris, France</span></div></div>' +
  '</div></header>' +
  '<form class="ms-ap__form" novalidate>' +
  '<div class="ms-ap__step" data-step="1">' +
  '<section class="ms-ap__s ms-ap__s--easy"><h2 class="ms-ap__h">Apply easily</h2><p class="ms-ap__p">Choose an option to automatically fill in your application details. You can also complete your application manually.</p><div class="ms-ap__easy">' + zone('easy') + '</div></section>' +

  '<section class="ms-ap__s ms-ap__s--f"><h2 class="ms-ap__h">Personal information</h2><p class="ms-ap__p">Fields marked with an asterisk * are required.</p>' +
  '<div class="ms-ap__av"><button type="button" class="ms-ap__pen" aria-label="Edit photo">' + PENCIL + '</button><input type="file" class="ms-ap__pfile" accept="image/*" hidden></div>' +
  '<div class="ms-ap__flds ms-ap__flds--av">' +
  '<div class="ms-ap__g2">' + field('first', 'First name', true, 'type="text" autocomplete="given-name"') + field('last', 'Last name', true, 'type="text" autocomplete="family-name"') + '</div>' +
  '<div class="ms-ap__g2">' + field('email', 'Email', true, 'type="email" autocomplete="email" inputmode="email"') + field('email2', 'Confirm your email', true, 'type="email" autocomplete="off" inputmode="email"') + '</div>' +
  '<div class="ms-ap__g2">' + field('city', 'City', true, 'type="text" autocomplete="address-level2"', '<div class="ms-ap__sr"><input class="ms-ap__in ms-ap__in--s" id="a-city" name="city" type="text" autocomplete="address-level2">' + SEARCH + '</div>') +
  field('phone', 'Phone number', true, '', '<div class="ms-ap__ph"><div class="ms-ap__cc"><span class="ms-ap__ccv"></span>' + CHEV + '<select name="dial" aria-label="Country code"></select></div><input class="ms-ap__in" id="a-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel-national"></div>') + '</div>' +
  '</div></section>' +

  '<section class="ms-ap__s ms-ap__s--e" data-kind="exp"><div class="ms-ap__row"><h2 class="ms-ap__h">Experience</h2><button type="button" class="ms-ap__b ms-ap__add"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v16M4 12h16"/></svg>Add</button></div><div class="ms-ap__list"></div><div class="ms-ap__slot"></div></section>' +
  '<section class="ms-ap__s ms-ap__s--e" data-kind="edu"><div class="ms-ap__row"><h2 class="ms-ap__h">Education</h2><button type="button" class="ms-ap__b ms-ap__add"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v16M4 12h16"/></svg>Add</button></div><div class="ms-ap__list"></div><div class="ms-ap__slot"></div></section>' +

  '<section class="ms-ap__s ms-ap__s--f"><h2 class="ms-ap__h">Your profiles</h2><p class="ms-ap__p">Fields marked with an asterisk * are required.</p>' +
  '<div class="ms-ap__flds"><div class="ms-ap__g2">' + field('linkedin', 'LinkedIn', false, 'type="url" inputmode="url" autocomplete="off"') + field('facebook', 'Facebook', false, 'type="url" inputmode="url" autocomplete="off"') + '</div>' +
  '<div class="ms-ap__g2">' + field('x', 'X (formerly Twitter)', false, 'type="url" inputmode="url" autocomplete="off"') + field('site', 'Website', false, 'type="url" inputmode="url" autocomplete="off"') + '</div></div></section>' +

  '<section class="ms-ap__s ms-ap__s--cv"><h2 class="ms-ap__h">CV<span class="ms-ap__rq ms-ap__rq--h">*</span></h2><div class="ms-ap__cvz">' + zone('cv') + '</div></section>' +

  '<section class="ms-ap__s ms-ap__s--m"><h2 class="ms-ap__h">Message to the recruitment team</h2><div class="ms-ap__flds ms-ap__flds--m"><div class="ms-ap__f" data-f="message"><label class="ms-ap__l" for="a-message">What brings you to apply to this company today?</label><textarea class="ms-ap__in ms-ap__ta ms-ap__ta--m" id="a-message" name="message" maxlength="4000"></textarea></div></div></section>' +

  '<div class="ms-ap__act"><button type="button" class="ms-ap__b ms-ap__b--p ms-ap__next">Next</button></div>' +
  '</div>' +
  STEP2 +
  '<div class="ms-ap__ferr" role="alert"></div>' +
  '<div class="ms-ap__hp" aria-hidden="true"><input type="text" name="website" tabindex="-1" autocomplete="off"></div>' +
  '</form>' +

  '<div class="ms-ap__ok" hidden><h2 class="ms-ap__h">Thank you</h2><p class="ms-ap__p">Your application for this position has been received. A confirmation has been sent to your email address, and our team will come back to you personally.</p><a class="ms-ap__b ms-ap__b--p" href="/careers/opportunities">Back to opportunities</a></div>' +

  '<footer class="ms-ap__foot"><div class="ms-ap__pv"><a href="https://maisonsanguine.com/legal/privacy-notice">Privacy Notice</a></div><div class="ms-ap__ft"><span>Maison Sanguine</span><a href="https://maisonsanguine.com/legal/cookie-policy">Cookie Policy</a></div></footer>' +
  '</div>'

export const FORM_PRODUCTION_HTML = build('head-of-production', 'Head of Production / Executive Producer')
export const FORM_COORDINATOR_HTML = build('production-coordinator', 'Production Coordinator')
export const FORM_GUEST_HTML = build('head-of-guest-experience', 'Head of Guest Experience &amp; Relations')
export const FORM_BRAND_HTML = build('brand-communications-manager', 'Brand &amp; Communications Manager')

export const FORM_APP = `(function(){
  var root=document.querySelector('.ms-ap');if(!root)return;
  var form=root.querySelector('.ms-ap__form');
  var MAX=4*1024*1024;
  var state={cv:null,photo:null,exp:[],edu:[],extra:[]};
  var XOK=['pdf','doc','docx','rtf','odt','txt','jpg','jpeg','png'];
  var DIAL='dial:FR33,BE32,CH41,LU352,MC377,DE49,IT39,ES34,PT351,GB44,IE353,NL31,AT43,DK45,SE46,NO47,FI358,PL48,CZ420,GR30,TR90,RU7,UA380,AE971,SA966,QA974,KW965,BH973,OM968,IL972,LB961,EG20,MA212,DZ213,TN216,SN221,CI225,CM237,NG234,ZA27,KE254,US1,CA1,MX52,BR55,AR54,CL56,CO57,PE51,JP81,KR82,CN86,HK852,TW886,SG65,MY60,TH66,VN84,ID62,PH63,IN91,AU61,NZ64'.slice(5).split(',');
  function q(s,c){return (c||root).querySelector(s)}
  function qa(s,c){return [].slice.call((c||root).querySelectorAll(s))}
  function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return c==='&'?'&amp;':c==='<'?'&lt;':c==='>'?'&gt;':'&quot;'})}
  function flag(iso){return String.fromCodePoint(127397+iso.charCodeAt(0),127397+iso.charCodeAt(1))}
  function setErr(name,msg){var w=q('[data-f="'+name+'"],[data-zone="'+name+'"]');if(!w)return;w.classList.add('is-err');var e=q('.ms-ap__err',w);if(e)e.textContent=msg}
  function clrErr(name){var w=q('[data-f="'+name+'"],[data-zone="'+name+'"]');if(!w)return;w.classList.remove('is-err');var e=q('.ms-ap__err',w);if(e)e.textContent=''}
  function size(n){return n>1048576?(n/1048576).toFixed(1)+'MB':Math.max(1,Math.ceil(n/1024))+'KB'}

  var sel=q('select[name="dial"]'),ccv=q('.ms-ap__ccv'),names=null;
  try{names=new Intl.DisplayNames([document.documentElement.lang||'en'],{type:'region'})}catch(e){}
  sel.innerHTML=DIAL.map(function(d){var m=d.match(/^([A-Z]{2})(\\d+)$/);var n=names?names.of(m[1]):m[1];return '<option value="'+m[1]+'" data-d="'+m[2]+'">'+flag(m[1])+' '+esc(n)+' (+'+m[2]+')</option>'}).join('');
  sel.value='FR';
  function showCc(){var o=sel.options[sel.selectedIndex];ccv.innerHTML='<span class="ms-ap__fl">'+flag(sel.value)+'</span>+'+o.getAttribute('data-d')}
  sel.addEventListener('change',showCc);showCc();

  function renderZones(){
    qa('.ms-ap__dzw[data-zone="easy"],.ms-ap__dzw[data-zone="cv"]').forEach(function(z){
      var t=q('.ms-ap__dzt',z),s=q('.ms-ap__dzs',z),dz=q('.ms-ap__dz',z);
      if(state.cv){dz.classList.add('has-file');t.innerHTML='<span class="ms-ap__fn">'+esc(state.cv.name)+'</span>';s.innerHTML=size(state.cv.size)+' · <button type="button" class="ms-ap__rm">Remove</button>'}
      else{dz.classList.remove('has-file');t.innerHTML='<span class="ms-ap__lk">Choose a file</span> or drop it here';s.textContent='4MB maximum size'}
    });
  }
  function xsum(){return state.extra.reduce(function(a,f){return a+f.size},0)}
  function setCv(f){
    if(!f)return;
    var ext=(f.name.split('.').pop()||'').toLowerCase();
    if(['pdf','doc','docx','rtf','odt','txt'].indexOf(ext)<0){setErr('cv','This file type is not supported.');setErr('easy','This file type is not supported.');return}
    if(f.size>MAX){setErr('cv','This file is too large. The maximum size is 4MB.');setErr('easy','This file is too large. The maximum size is 4MB.');return}
    if(f.size+xsum()>MAX){setErr('cv','The total size of your files cannot exceed 4MB.');setErr('easy','The total size of your files cannot exceed 4MB.');return}
    state.cv=f;clrErr('cv');clrErr('easy');renderZones();
  }
  qa('.ms-ap__dzw[data-zone="easy"],.ms-ap__dzw[data-zone="cv"]').forEach(function(z){
    var inp=q('.ms-ap__file',z),dz=q('.ms-ap__dz',z);
    inp.addEventListener('change',function(){setCv(inp.files[0]);inp.value=''});
    z.addEventListener('click',function(e){if(e.target.closest('.ms-ap__rm')){e.preventDefault();state.cv=null;renderZones()}});
    ['dragenter','dragover'].forEach(function(n){dz.addEventListener(n,function(e){e.preventDefault();dz.classList.add('is-drag')})});
    ['dragleave','drop'].forEach(function(n){dz.addEventListener(n,function(e){e.preventDefault();dz.classList.remove('is-drag')})});
    dz.addEventListener('drop',function(e){if(e.dataTransfer&&e.dataTransfer.files[0])setCv(e.dataTransfer.files[0])});
  });

  var av=q('.ms-ap__av'),pf=q('.ms-ap__pfile');
  q('.ms-ap__pen').addEventListener('click',function(){pf.click()});
  pf.addEventListener('change',function(){
    var f=pf.files[0];if(!f)return;
    var url=URL.createObjectURL(f),img=new Image();
    img.onload=function(){
      var s=480,c=document.createElement('canvas');c.width=s;c.height=s;var x=c.getContext('2d');
      var m=Math.min(img.width,img.height);x.drawImage(img,(img.width-m)/2,(img.height-m)/2,m,m,0,0,s,s);
      c.toBlob(function(b){if(!b)return;state.photo=b;av.style.backgroundImage='url('+c.toDataURL('image/jpeg',.8)+')'},'image/jpeg',.82);
      URL.revokeObjectURL(url);
    };
    img.src=url;pf.value='';
  });

  var ICON={exp:'<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M14 40V10h14v30M28 18h8v22M6 40h36M18 15h2M22 15h2M18 21h2M22 21h2M18 27h2M22 27h2M31 24h2M31 30h2"/></svg>',edu:'<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 6v8M24 8h6M6 40h36M10 40V22l14-8 14 8v18M18 40V30h12v10M24 20v3"/></svg>'};
  var CFG={
    exp:{l:'Office location',rq:['title','from','to'],k:['title','company','loc','desc','from','to','cur'],cur:'I currently work here'},
    edu:{t:'School',a:'Specialization',b:'Level of study',l:'School location',rq:['school'],k:['school','spec','level','loc','desc','from','to','cur'],cur:'Current school'}
  };
  function f(kind,name,text,req,type,extra){
    return '<div class="ms-ap__f" data-e="'+name+'"><label class="ms-ap__l">'+text+(req?'<span class="ms-ap__rq">*</span>':'')+'</label>'+(type==='ta'?'<textarea class="ms-ap__in ms-ap__ta" name="e_'+name+'" maxlength="1500"></textarea>':type==='date'?'<div class="ms-ap__sr"><input class="ms-ap__in ms-ap__in--d ms-ap__date" type="text" name="e_'+name+'" placeholder="Choose a date" autocomplete="off" readonly>'+CALI+'</div>':type==='s'?'<div class="ms-ap__sr"><input class="ms-ap__in ms-ap__in--s" type="text" name="e_'+name+'" autocomplete="off">'+SEARCHI+'</div>':'<input class="ms-ap__in" type="text" name="e_'+name+'" autocomplete="off">')+'<div class="ms-ap__err" role="alert"></div></div>';
  }
  var SEARCHI='${SEARCH.replace(/'/g, "\\'")}',CALI='${CAL.replace(/'/g, "\\'")}';
  function formHtml(kind){
    var c=CFG[kind],h='<div class="ms-ap__cw"><div class="ms-ap__ic">'+ICON[kind]+'</div><div class="ms-ap__cd"><p class="ms-ap__nt">Fields marked with an asterisk * are required.</p><div class="ms-ap__flds ms-ap__flds--c">';
    if(kind==='exp'){
      h+='<div class="ms-ap__g2">'+f(kind,'title','Job title',true,'s')+f(kind,'company','Company name',false,'s')+'</div>'+f(kind,'loc','Office location',false,'s')+f(kind,'desc','Description',false,'ta')+'<div class="ms-ap__g2">'+f(kind,'from','From',true,'date')+f(kind,'to','To',true,'date')+'</div>';
    }else{
      h+=f(kind,'school','School',true,'s')+'<div class="ms-ap__g2">'+f(kind,'spec','Specialization',false)+f(kind,'level','Level of study',false)+'</div>'+f(kind,'loc','School location',false,'s')+f(kind,'desc','Description',false,'ta')+'<div class="ms-ap__g2">'+f(kind,'from','From',false,'date')+f(kind,'to','To',false,'date')+'</div>';
    }
    h+='</div><label class="ms-ap__ck ms-ap__ck--c"><input type="checkbox" name="e_cur"><span>'+c.cur+'</span></label><div class="ms-ap__ca"><button type="button" class="ms-ap__b ms-ap__cancel">Cancel</button><button type="button" class="ms-ap__b ms-ap__b--p ms-ap__save">Save</button></div></div></div>';
    return h;
  }
  function fmtDate(v){if(!v)return '';var d=new Date(v+'T00:00:00');if(isNaN(d))return v;try{return d.toLocaleDateString(document.documentElement.lang||undefined,{month:'short',year:'numeric'})}catch(e){return v}}
  function renderList(kind){
    var sec=q('.ms-ap__s--e[data-kind="'+kind+'"]'),box=q('.ms-ap__list',sec);
    box.innerHTML=state[kind].map(function(e,i){
      var a=kind==='exp'?e.title:e.school,b=kind==='exp'?e.company:[e.spec,e.level].filter(Boolean).join(', ');
      var d=[fmtDate(e.from),e.cur?'Present':fmtDate(e.to)].filter(Boolean).join(' – ');
      return '<div class="ms-ap__cw" data-i="'+i+'"><div class="ms-ap__ic">'+ICON[kind]+'</div><div class="ms-ap__cd ms-ap__cd--s"><div class="ms-ap__et">'+esc(a)+'</div>'+(b?'<div class="ms-ap__em">'+esc(b)+'</div>':'')+(d?'<div class="ms-ap__em">'+esc(d)+'</div>':'')+'<div class="ms-ap__ea"><button type="button" class="ms-ap__tl ms-ap__edit">Edit</button><button type="button" class="ms-ap__tl ms-ap__del">Delete</button></div></div></div>';
    }).join('');
  }
  function openForm(kind,idx){
    var sec=q('.ms-ap__s--e[data-kind="'+kind+'"]'),slot=q('.ms-ap__slot',sec);
    slot.innerHTML=formHtml(kind);slot.setAttribute('data-i',idx==null?'':idx);
    if(idx!=null){var e=state[kind][idx];qa('[name^="e_"]',slot).forEach(function(el){var k=el.name.slice(2);if(el.type==='checkbox')el.checked=!!e.cur;else el.value=e[k]||''});syncCur(slot)}
    var first=q('input,textarea',slot);if(first&&!first.readOnly)first.focus();
  }
  function syncCur(slot){var cb=q('[name="e_cur"]',slot),to=q('[name="e_to"]',slot);if(!cb||!to)return;to.disabled=cb.checked;if(cb.checked){to.value='';clrFld(to)}}
  function clrFld(el){var w=el.closest('.ms-ap__f');if(w){w.classList.remove('is-err');var e=q('.ms-ap__err',w);if(e)e.textContent=''}}
  function saveForm(kind){
    var sec=q('.ms-ap__s--e[data-kind="'+kind+'"]'),slot=q('.ms-ap__slot',sec),c=CFG[kind],data={},ok=true;
    qa('[name^="e_"]',slot).forEach(function(el){var k=el.name.slice(2);data[k]=el.type==='checkbox'?el.checked:el.value.trim()});
    qa('.ms-ap__f[data-e]',slot).forEach(function(w){w.classList.remove('is-err')});
    c.rq.forEach(function(k){
      if(k==='to'&&data.cur)return;
      if(!data[k]){var w=q('[data-e="'+k+'"]',slot);w.classList.add('is-err');q('.ms-ap__err',w).textContent='This field is required.';ok=false}
    });
    if(!ok)return;
    var idx=slot.getAttribute('data-i');
    if(idx!==''&&idx!=null)state[kind][+idx]=data;else state[kind].push(data);
    slot.innerHTML='';slot.removeAttribute('data-i');renderList(kind);
  }
  qa('.ms-ap__s--e').forEach(function(sec){
    var kind=sec.getAttribute('data-kind');
    sec.addEventListener('click',function(e){
      var t=e.target;
      if(t.closest('.ms-ap__add')){if(!q('.ms-ap__slot',sec).firstChild)openForm(kind,null);return}
      if(t.closest('.ms-ap__cancel')){q('.ms-ap__slot',sec).innerHTML='';return}
      if(t.closest('.ms-ap__save')){saveForm(kind);return}
      var cw=t.closest('.ms-ap__list .ms-ap__cw');
      if(cw&&t.closest('.ms-ap__edit')){openForm(kind,+cw.getAttribute('data-i'));return}
      if(cw&&t.closest('.ms-ap__del')){state[kind].splice(+cw.getAttribute('data-i'),1);renderList(kind)}
    });
    sec.addEventListener('change',function(e){if(e.target.name==='e_cur')syncCur(q('.ms-ap__slot',sec))});
    sec.addEventListener('input',function(e){clrFld(e.target)});
  });
  root.addEventListener('focusin',function(e){
    var el=e.target;if(!el.classList||!el.classList.contains('ms-ap__date'))return;
    el.readOnly=false;el.type='date';try{if(el.showPicker)el.showPicker()}catch(x){}
  });
  root.addEventListener('focusout',function(e){
    var el=e.target;if(!el.classList||!el.classList.contains('ms-ap__date'))return;
    if(!el.value){el.type='text';el.readOnly=true}
  });


  function renderX(){
    var box=q('.ms-ap__xl');
    box.innerHTML=state.extra.map(function(f,i){return '<div class="ms-ap__xr" data-i="'+i+'"><span class="ms-ap__xn">'+esc(f.name)+'</span><span class="ms-ap__xs">'+size(f.size)+'</span><button type="button" class="ms-ap__rm">Remove</button></div>'}).join('');
  }
  function addX(list){
    var z=q('.ms-ap__dzw[data-zone="extra"]');clrErr('extra');
    [].slice.call(list||[]).forEach(function(f){
      var ext=(f.name.split('.').pop()||'').toLowerCase();
      if(XOK.indexOf(ext)<0){setErr('extra','This file type is not supported.');return}
      if(state.extra.length>=3){setErr('extra','You can add up to 3 files.');return}
      if((state.cv?state.cv.size:0)+xsum()+f.size>MAX){setErr('extra','The total size of your files cannot exceed 4MB.');return}
      state.extra.push(f);
    });
    renderX();
  }
  (function(){
    var z=q('.ms-ap__dzw[data-zone="extra"]'),inp=q('.ms-ap__xfile',z),dz=q('.ms-ap__dz',z);
    inp.addEventListener('change',function(){addX(inp.files);inp.value=''});
    z.addEventListener('click',function(e){var b=e.target.closest('.ms-ap__rm');if(!b)return;e.preventDefault();var r=b.closest('.ms-ap__xr');state.extra.splice(+r.getAttribute('data-i'),1);clrErr('extra');renderX()});
    ['dragenter','dragover'].forEach(function(n){dz.addEventListener(n,function(e){e.preventDefault();dz.classList.add('is-drag')})});
    ['dragleave','drop'].forEach(function(n){dz.addEventListener(n,function(e){e.preventDefault();dz.classList.remove('is-drag')})});
    dz.addEventListener('drop',function(e){if(e.dataTransfer&&e.dataTransfer.files.length)addX(e.dataTransfer.files)});
  })();

  var lrs=q('.ms-ap__lrs'),lrTpl=lrs.firstElementChild.cloneNode(true);
  q('.ms-ap__addl').addEventListener('click',function(){
    if(lrs.children.length>=6)return;
    var r=lrTpl.cloneNode(true);
    [].slice.call(r.querySelectorAll('input,select')).forEach(function(el){el.value=''});
    var b=document.createElement('button');b.type='button';b.className='ms-ap__lx';b.setAttribute('aria-label','Remove');
    b.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';
    r.appendChild(b);lrs.appendChild(r);
  });
  lrs.addEventListener('click',function(e){var b=e.target.closest('.ms-ap__lx');if(b){b.parentNode.parentNode.removeChild(b.parentNode);clrErr('langs')}});

  var step=1;
  function go(n){
    step=n;
    qa('.ms-ap__step').forEach(function(el){el.hidden=el.getAttribute('data-step')!==String(n)});
    var fe=q('.ms-ap__ferr');fe.classList.remove('is-on');fe.textContent='';
    window.scrollTo(0,0);
  }

  form.addEventListener('input',function(e){var w=e.target.closest&&e.target.closest('[data-f]');if(w)clrErr(w.getAttribute('data-f'))});
  form.addEventListener('change',function(e){var w=e.target.closest&&e.target.closest('[data-f]');if(w)clrErr(w.getAttribute('data-f'))});

  function val(n){var el=form.elements[n];return el?el.value.trim():''}
  function jump(bad,open){
    var t=bad==='slot'?open:q('[data-f="'+bad+'"],[data-zone="'+bad+'"]');
    if(t){var y=t.getBoundingClientRect().top+window.scrollY-110;window.scrollTo({top:y,behavior:'smooth'})}
  }
  function validate1(){
    var bad=null,REQ='This field is required.';
    function fail(n,m){setErr(n,m);if(!bad)bad=n}
    ['first','last','email','email2','city','phone'].forEach(function(n){clrErr(n);if(!val(n))fail(n,REQ)});
    if(val('email')&&!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/.test(val('email')))fail('email','Please enter a valid email address.');
    if(val('email2')&&val('email')&&val('email2').toLowerCase()!==val('email').toLowerCase())fail('email2','The email addresses do not match.');
    clrErr('cv');if(!state.cv){fail('cv','Please add your CV.')}
    var open=qa('.ms-ap__slot').filter(function(s){return s.firstChild})[0];
    if(open&&!bad){bad='slot';var fe=q('.ms-ap__ferr');fe.textContent='Please save or cancel the entry you are editing.';fe.classList.add('is-on')}
    if(bad){jump(bad,open);return false}
    return true;
  }
  function langs(){
    return qa('.ms-ap__lr',lrs).map(function(r){return {lang:q('[name="lang_n"]',r).value.trim(),level:q('[name="lang_l"]',r).value}}).filter(function(l){return l.lang||l.level});
  }
  function validate2(){
    var bad=null,REQ='This field is required.';
    function fail(n,m){setErr(n,m);if(!bad)bad=n}
    ['civ','notice','auth','years','rate'].forEach(function(n){clrErr(n);if(!val(n))fail(n,REQ)});
    ['speaks','noncompete','license','car'].forEach(function(n){clrErr(n);if(!form.elements[n].value)fail(n,REQ)});
    clrErr('langs');var L=langs();if(!L.length||L.some(function(l){return !l.lang||!l.level}))fail('langs',REQ);
    clrErr('consent');if(!form.elements.consent.checked)fail('consent','Please accept to continue.');
    if(bad){var o=['civ','langs','speaks','notice','noncompete','license','car','auth','years','rate','consent'].filter(function(n){return q('[data-f="'+n+'"].is-err')})[0];jump(o||bad);return false}
    return true;
  }
  q('.ms-ap__next').addEventListener('click',function(){if(validate1())go(2)});
  q('.ms-ap__back').addEventListener('click',function(){go(1)});
  var busy=false;
  form.addEventListener('submit',function(e){
    e.preventDefault();if(busy)return;
    if(step===1){if(validate1())go(2);return}
    var fe=q('.ms-ap__ferr');fe.classList.remove('is-on');fe.textContent='';
    if(!validate1()){go(1);validate1();return}
    if(!validate2())return;
    var fd=new FormData();
    fd.append('job',root.getAttribute('data-job'));
    ['first','last','email','email2','city','phone','linkedin','facebook','x','site','message','website'].forEach(function(n){fd.append(n,val(n))});
    fd.append('dial','+'+sel.options[sel.selectedIndex].getAttribute('data-d'));
    fd.append('consent','true');fd.append('lang',document.documentElement.lang||'');
    fd.append('exp',JSON.stringify(state.exp));fd.append('edu',JSON.stringify(state.edu));
    fd.append('cv',state.cv,state.cv.name);
    ['civ','speaks','noncompete','license','car','auth','notice','years','rate','docs'].forEach(function(n){fd.append(n,val(n)||(form.elements[n]&&form.elements[n].value)||'')});
    fd.append('langs',JSON.stringify(langs()));
    state.extra.forEach(function(f){fd.append('extra',f,f.name)});
    if(state.photo)fd.append('photo',state.photo,'photo.jpg');
    var btn=q('.ms-ap__submit');busy=true;btn.disabled=true;btn.classList.add('is-busy');
    fetch('/api/careers/apply',{method:'POST',body:fd}).then(function(r){
      return r.json().catch(function(){return {}}).then(function(j){return {ok:r.ok,s:r.status,j:j}});
    }).then(function(r){
      if(r.ok&&r.j.ok){
        form.hidden=true;q('.ms-ap__ok').hidden=false;window.scrollTo({top:0,behavior:'smooth'});return;
      }
      var m='Something went wrong. Please try again in a moment.';
      if(r.s===429)m='Too many attempts. Please try again later.';
      else if(r.s===413)m='Your files are too large. The maximum size is 4MB.';
      else if(r.j&&r.j.error==='fields')m='Please check the highlighted fields and try again.';
      fe.textContent=m;fe.classList.add('is-on');
    }).catch(function(){
      fe.textContent='Connection error. Please check your connection and try again.';fe.classList.add('is-on');
    }).then(function(){busy=false;btn.disabled=false;btn.classList.remove('is-busy')});
  });
})();`
