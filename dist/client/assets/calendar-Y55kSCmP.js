import{B as e,C as t,F as n,M as r,O as i,P as a,R as o,S as s,T as c,c as l,h as u,l as d,o as f,pt as p,s as m,v as h}from"./web-CMLhSh0a.js";import{i as g}from"./schedule-Dhyei76O.js";import{n as _,t as v}from"./PageContent-C-m9Y8ww.js";import{a as y,i as b,t as x}from"./datetime-BmoZ_SHX.js";var S=i(`<div class="no-print wa-stack wa-gap-m"><wa-button href=/reports appearance=plain size=small>← Back to Reports</wa-button><!$><!/><div class="wa-cluster wa-gap-m"style=flex-wrap:wrap><div><label style=display:block;margin-bottom:0.25rem;font-size:0.875rem;color:var(--color-text);font-weight:500>Month</label><select style="padding:0.5rem;border:1px solid var(--color-border-strong);border-radius:4px;font-size:0.875rem"></select></div><div><label style=display:block;margin-bottom:0.25rem;font-size:0.875rem;color:var(--color-text);font-weight:500>Year</label><select style="padding:0.5rem;border:1px solid var(--color-border-strong);border-radius:4px;font-size:0.875rem">`,1),C=i(`<div class=print-header style=margin-bottom:1rem;text-align:center><h1 class="print-title no-print"style="font-size:1.75rem;font-weight:700;color:var(--color-text);margin:0 0 0.5rem 0">Care Sessions Calendar</h1><div class=print-month style=font-size:1.125rem;color:var(--color-text);margin-bottom:0.5rem></div><div class=print-summary style=font-size:0.875rem;color:var(--color-text-muted)>Total Sessions: <!$><!/> | Total Hours: <!$><!/>h`),w=i(`<div class=calendar-grid style="display:grid;grid-template-columns:repeat(7, 1fr)">`),T=i(`<div class=calendar-container style="background-color:var(--color-surface);border-radius:8px;border:1px solid var(--color-border);overflow:hidden"><div class=calendar-day-headers style="display:grid;grid-template-columns:repeat(7, 1fr);background-color:var(--color-surface-muted);borderBottom:2px solid var(--color-border)"></div><!$><!/>`),E=i(`<style>
          @media print {
            .no-print {
              display: none !important;
            }

            /* Optimize for landscape orientation - single page */
            @page {
              size: landscape;
              margin: 0.05in 0.2in;
            }

            * {
              box-sizing: border-box;
            }

            html, body {
              margin: 0 !important;
              padding: 0 !important;
              height: 100% !important;
            }

            /* Container optimization */
            div[style*="max-width"] {
              max-width: 100% !important;
              padding: 0 !important;
              margin: 0 !important;
              height: 100% !important;
            }

            /* Ultra-compact header for single page - override all inline styles */
            .print-header {
              page-break-after: avoid;
              margin-bottom: 0.05rem !important;
              padding: 0 !important;
              line-height: 1 !important;
              height: auto !important;
              text-align: center !important;
            }

            /* Hide title in print */
            .print-header h1.print-title,
            .print-title {
              display: none !important;
            }

            /* Month name - bigger for print */
            .print-header .print-month,
            .print-month {
              font-size: 0.85rem !important;
              margin: 0 0 0.02rem 0 !important;
              padding: 0 !important;
              line-height: 1 !important;
              display: block !important;
              font-weight: 600 !important;
            }

            /* Summary - show in print with appropriate size */
            .print-header .print-summary,
            .print-summary {
              font-size: 0.65rem !important;
              margin: 0 !important;
              padding: 0 !important;
              line-height: 1 !important;
              display: block !important;
            }

            /* Calendar container - maximize space */
            .calendar-container {
              page-break-inside: avoid;
              border-radius: 0 !important;
              border: 1px solid #2d3748 !important;
              margin-top: 0.02rem !important;
              height: calc(100% - 0.2in) !important;
              display: flex !important;
              flex-direction: column !important;
            }

            /* Day headers - ultra compact */
            .calendar-day-headers {
              padding: 0.08rem 0.06rem !important;
              border-bottom: 1px solid #2d3748 !important;
              flex-shrink: 0 !important;
            }

            .calendar-day-header {
              padding: 0.08rem 0.06rem !important;
              font-size: 0.6rem !important;
              font-weight: 700 !important;
              line-height: 1 !important;
            }

            /* Calendar grid - ensure proper layout */
            .calendar-grid {
              display: grid !important;
              grid-template-columns: repeat(7, 1fr) !important;
              flex: 1 !important;
              min-height: 0 !important;
            }

            /* Calendar day cells - fit on single page with header */
            /* Landscape: 11in - 0.1in margins = 10.9in usable */
            /* Header ~0.12in + Day headers ~0.12in = 0.24in */
            /* Remaining ~10.66in / 6 rows = ~1.78in per row, use 1.15in to be safe */
            .calendar-day-cell {
              min-height: 0 !important;
              height: 1.15in !important;
              max-height: 1.15in !important;
              padding: 0.08rem 0.08rem !important;
              border: 1px solid #cbd5e0 !important;
              overflow: hidden !important;
              display: flex !important;
              flex-direction: column !important;
            }

            /* Date numbers - compact */
            .calendar-day-number {
              font-size: 0.7rem !important;
              margin-bottom: 0.08rem !important;
              line-height: 1 !important;
              flex-shrink: 0 !important;
            }

            /* Sessions container */
            .calendar-sessions {
              gap: 0.08rem !important;
              flex: 1 !important;
              overflow: hidden !important;
              min-height: 0 !important;
            }

            /* Hide "No sessions" text in print */
            .no-sessions-text {
              display: none !important;
            }

            /* Session blocks - ultra compact for print */
            .session-block {
              padding: 0.1rem 0.15rem !important;
              margin-bottom: 0.06rem !important;
              font-size: 0.55rem !important;
              line-height: 1.1 !important;
              border-left-width: 1.5px !important;
            }

            .session-family {
              font-size: 0.6rem !important;
              font-weight: 700 !important;
              margin-bottom: 0.03rem !important;
              line-height: 1.1 !important;
            }

            .session-children {
              font-size: 0.5rem !important;
              margin-bottom: 0.03rem !important;
              line-height: 1.1 !important;
            }

            .session-time {
              font-size: 0.5rem !important;
              line-height: 1.1 !important;
            }
          }
        `),D=i(`<wa-button variant=brand appearance=filled>Print Calendar`,1),O=i(`<option>`),k=i(`<div class=calendar-day-header style=padding:0.75rem;text-align:center;font-weight:600;color:var(--color-text);font-size:0.875rem>`),A=i(`<div style=padding:2rem;text-align:center;color:var(--color-text-muted)>Loading sessions...`),j=i(`<div class=calendar-day-cell style="minHeight:120px;border:1px solid var(--color-border);padding:0.5rem;position:relative"><div class=calendar-day-number style=margin-bottom:0.25rem></div><div class=calendar-sessions style=display:flex;flex-direction:column;gap:0.25rem>`),M=i(`<div class=no-sessions-text style=font-size:0.75rem;color:var(--color-text-subtle);font-style:italic>No sessions`),N=i(`<div class=session-children style=font-size:0.65rem;color:var(--color-text);margin-bottom:0.125rem>`),P=i(`<div class=session-block style="padding:0.25rem 0.375rem;background-color:var(--wa-color-brand-fill-normal);color:#2c5282;border-radius:4px;font-size:0.7rem;line-height:1.3;border-left:2px solid #2c5282;margin-bottom:0.2rem"><div class=session-family style=font-weight:600;font-size:0.7rem;margin-bottom:0.125rem></div><!$><!/><div class=session-time style=font-size:0.65rem;color:#1a365d;font-weight:500><!$><!/> - <!$><!/> (<!$><!/>)`);function F(){let i=new Date,f=i.getMonth()===0?11:i.getMonth()-1,F=i.getMonth()===0?i.getFullYear()-1:i.getFullYear(),[I,L]=e(F),[R,z]=e(f),B=o(()=>{let e=I(),t=R();return{start:new Date(e,t,1),end:new Date(e,t+1,0,23,59,59)}}),V=o(()=>{let e=B();return g(e.start,e.end)}),H=e=>{let t=e instanceof Date?e:new Date(e);return isNaN(t.getTime())?(console.error(`Invalid date:`,e),`Invalid`):b(t)},U=(e,t)=>`${((t.getTime()-e.getTime())/36e5).toFixed(1)}h`,W=o(()=>{let e=I(),t=R(),n=new Date(e,t,1);new Date(e,t+1,0);let r=new Date(n);r.setDate(r.getDate()-r.getDay());let i=[],a=new Date(r);for(let e=0;e<42;e++)i.push(new Date(a)),a.setDate(a.getDate()+1);return i}),G=e=>e.getMonth()===R()&&e.getFullYear()===I(),K=e=>{let t=V();if(!t||t.length===0)return[];let n=e.getFullYear(),r=e.getMonth(),i=e.getDate();return t.filter(e=>{let t=x(e.scheduledStart);return!isNaN(t.getTime())&&y(t,new Date(n,r,i))}).sort((e,t)=>x(e.scheduledStart).getTime()-x(t.scheduledStart).getTime())},q=()=>{window.print()},J=o(()=>new Date(I(),R(),1).toLocaleDateString(`en-US`,{month:`long`,year:`numeric`})),Y=o(()=>{let e=V()||[],t=0;for(let n of e){let e=x(n.scheduledStart).getTime(),r=x(n.scheduledEnd).getTime();t+=(r-e)/36e5}return t.toFixed(1)}),X=o(()=>V()?.length||0);return n(v,{get children(){return[(()=>{var e=l(S),r=e.firstChild.nextSibling,[a,o]=d(r.nextSibling),c=a.nextSibling.firstChild,f=c.firstChild.nextSibling,h=c.nextSibling.firstChild.nextSibling;return u(e,n(_,{title:`Care Sessions Calendar`,get description(){return J()},get actions(){var e=l(D);return e.$$click=q,e._$owner=p(),s(),e}}),a,o),f.addEventListener(`change`,e=>z(parseInt(e.currentTarget.value))),u(f,t(()=>Array.from({length:12},(e,n)=>(()=>{var e=l(O);return e.value=n,u(e,t(()=>new Date(I(),n,1).toLocaleDateString(`en-US`,{month:`long`}))),e})()))),h.addEventListener(`change`,e=>L(parseInt(e.currentTarget.value))),u(h,t(()=>Array.from({length:5},(e,t)=>{let n=i.getFullYear()-t;var r=l(O);return r.value=n,u(r,n),r}))),m(()=>({e:R(),t:I()}),({e,t},n)=>{queueMicrotask(()=>f.value=e)||(f.value=e),queueMicrotask(()=>h.value=t)||(h.value=t)}),e})(),(()=>{var e=l(C),n=e.firstChild.nextSibling,r=n.nextSibling,i=r.firstChild.nextSibling,[a,o]=d(i.nextSibling),s=a.nextSibling.nextSibling,[c,f]=d(s.nextSibling);return c.nextSibling,u(n,t(()=>J())),u(r,t(()=>X()),a,o),u(r,t(()=>Y()),c,f),e})(),(()=>{var e=l(T),s=e.firstChild,f=s.nextSibling,[p,m]=d(f.nextSibling);return u(s,n(r,{each:[`Sun`,`Mon`,`Tue`,`Wed`,`Thu`,`Fri`,`Sat`],children:e=>(()=>{var t=l(k);return u(t,e),t})()})),u(e,n(a,{get when(){return V()!==void 0},get fallback(){return l(A)},get children(){var e=l(w);return u(e,n(r,{get each(){return W()},children:e=>{let s=o(()=>V()?K(e):[]),f=G(e),p=e.getDate()===i.getDate()&&e.getMonth()===i.getMonth()&&e.getFullYear()===i.getFullYear();var m=l(j),g=m.firstChild,_=g.nextSibling;return c(m,`background-color`,f?`var(--color-surface)`:`var(--color-surface-muted)`),c(g,`font-weight`,p?`700`:`400`),c(g,`color`,f?`var(--color-text)`:`var(--color-text-subtle)`),c(g,`font-size`,p?`1rem`:`0.875rem`),u(g,t(()=>e.getDate())),u(_,n(a,{get when(){return s().length>0},get fallback(){return l(M)},get children(){return n(r,{get each(){return K(e)},children:e=>{let r=x(e.scheduledStart),i=x(e.scheduledEnd),o=U(r,i);var s=l(P),c=s.firstChild,f=c.nextSibling,[p,m]=d(f.nextSibling),g=p.nextSibling,_=g.firstChild,[v,y]=d(_.nextSibling),b=v.nextSibling.nextSibling,[S,C]=d(b.nextSibling),w=S.nextSibling.nextSibling,[T,E]=d(w.nextSibling);return T.nextSibling,u(c,()=>e.family.familyName),u(s,n(a,{get when(){return h(()=>!!e.children)()?e.children.length>0:e.children},get children(){var n=l(N);return u(n,t(()=>e.children.map(e=>`${e.firstName} ${e.lastName}`).join(`, `))),n}}),p,m),u(g,t(()=>H(r)),v,y),u(g,t(()=>H(i)),S,C),u(g,o,T,E),s}})}})),m}})),e}}),p,m),e})(),l(E)]}})}f([`click`]);export{F as default};