"use strict";const data=JSON.parse(document.querySelector("#changelog-data").textContent),copy=data,list=document.querySelector("#release-list"),cacheKey="clipclop-release-history";let locale,releases,failed=!1;const esc=e=>String(e).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;"),languageBody=(e,t)=>{const n=String(e||"").split(/^> 安装提示 \/ Installation note\s*$/m)[0].split(/^## (中文|English)\s*$/m),a=t==="zh"?"\u4E2D\u6587":"English",o=n.indexOf(a);return o<0?"":n[o+1].trim()},inline=e=>esc(e).replace(/`([^`]+)`/g,"<code>$1</code>").replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>").replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,'<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'),markdown=e=>{const t=[];let n="",a=[];const o=()=>{a.length&&t.push(`<${n}>${a.map(l=>`<li>${inline(l)}</li>`).join("")}</${n}>`),a=[],n=""};for(const l of e.split(`
`)){const s=l.match(/^\s*(-|\d+\.)\s+(.+)/);if(s){const r=s[1]==="-"?"ul":"ol";n&&n!==r&&o(),n=r,a.push(s[2]);continue}o(),/^###\s+/.test(l)?t.push(`<h3>${inline(l.slice(4))}</h3>`):l.trim()&&!/^---+$/.test(l.trim())&&t.push(`<p>${inline(l)}</p>`)}return o(),t.join("")},render=()=>{const e=copy;releases?list.innerHTML=releases.map((t,n)=>`<article class="release"><aside class="version"><strong>${esc(t.tag_name)}</strong><time datetime="${esc(t.published_at)}">${new Intl.DateTimeFormat(locale==="zh"?"zh-CN":"en",{dateStyle:"medium"}).format(new Date(t.published_at))}</time>${n?"":`<span class="latest">${e.latest}</span>`}</aside><div><h2><a href="${esc(t.html_url)}" target="_blank" rel="noopener noreferrer">${esc(t.name||t.tag_name)}</a></h2><div class="notes">${markdown(languageBody(t.body,locale))||`<p>${e.noNotes}</p>`}</div></div></article>`).join("")||`<p class="status">${e.none}</p>`:failed&&(list.innerHTML=`<p class="status">${e.error}</p>`)};console.assert(languageBody(`## \u4E2D\u6587

### \u65B0\u589E
- \u4E2D\u6587

## English

### Added
- English

> \u5B89\u88C5\u63D0\u793A / Installation note
> hidden`,"en")===`### Added
- English`&&markdown("### Added\n- `safe`")==="<h3>Added</h3><ul><li><code>safe</code></li></ul>","Changelog locale/Markdown rendering failed");try{releases=JSON.parse(localStorage.getItem(cacheKey)),Array.isArray(releases)||(releases=null)}catch{}locale=data.locale,render(),fetch("https://api.github.com/repos/hiQianFan/ClipClop/releases?per_page=10").then(e=>{if(!e.ok)throw new Error;return e.json()}).then(e=>{releases=e.filter(t=>!t.draft);try{localStorage.setItem(cacheKey,JSON.stringify(releases))}catch{}render()}).catch(()=>{failed=!0,render()});
