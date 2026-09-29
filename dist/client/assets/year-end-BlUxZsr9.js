import{B as e,C as t,F as n,M as r,O as i,P as a,S as o,c as s,h as c,l,o as u,pt as d,r as f,s as p,v as m,w as h}from"./web-CMLhSh0a.js";import{r as g}from"./families-CHTVi49i.js";import{i as _,n as v,t as y}from"./reports-Dd8FUBOO.js";import{n as b,t as x}from"./PageContent-C-m9Y8ww.js";import{i as S}from"./datetime-BmoZ_SHX.js";import{n as C}from"./money-display-BdSv_jQN.js";var w=i(`<wa-button href=/reports appearance=plain size=small>← Back to Reports`,1),T=i(`<div style=flex:2;min-width:250px><label style=display:block;margin-bottom:0.5rem;font-weight:600;color:var(--color-text)>Family</label><select style="width:100%;padding:0.75rem;border:1px solid var(--color-border-strong);border-radius:4px;font-size:1rem"><option value>Select a family...</option><!$><!/>`),E=i(`<div style="background-color:var(--color-surface);padding:1.5rem;border-radius:8px;border:1px solid var(--color-border);box-shadow:0 1px 3px rgba(0,0,0,0.1);margin-bottom:2rem"><div style=display:flex;gap:1rem;flex-wrap:wrap;align-items:end><div style=flex:1;min-width:200px><label style=display:block;margin-bottom:0.5rem;font-weight:600;color:var(--color-text)>Year</label><select style="width:100%;padding:0.75rem;border:1px solid var(--color-border-strong);border-radius:4px;font-size:1rem"></select></div><div style=flex:1;min-width:200px><label style=display:block;margin-bottom:0.5rem;font-weight:600;color:var(--color-text)>View Mode</label><select style="width:100%;padding:0.75rem;border:1px solid var(--color-border-strong);border-radius:4px;font-size:1rem"><option value=all>All Families</option><option value=single>Single Family</option></select></div><!$><!/>`),D=i(`<div style="background-color:var(--color-surface);padding:3rem;border-radius:8px;border:1px solid var(--color-border);text-align:center"><div style=font-size:1.25rem;font-weight:600;color:var(--color-text);margin-bottom:0.5rem>Select a family to view their year-end report</div><div style=color:var(--color-text-muted)>Choose a family from the dropdown above to generate their report for <!$><!/>.`),O=i(`<option>`),k=i(`<option><!$><!/> (<!$><!/>)`),ee=i(`<div style=margin-bottom:2rem><h3 style=font-size:1.25rem;font-weight:600;color:var(--color-text);margin-bottom:1rem>Standalone Expenses (<!$><!/>)</h3><div style="background-color:var(--color-surface);border-radius:8px;border:1px solid var(--color-border);overflow:hidden"><table style=width:100%;border-collapse:collapse><thead><tr style="background-color:var(--color-surface-muted);border-bottom:2px solid var(--color-border)"><th style=padding:0.75rem;text-align:left;font-weight:600;color:var(--color-text)>Date</th><th style=padding:0.75rem;text-align:left;font-weight:600;color:var(--color-text)>Description</th><th style=padding:0.75rem;text-align:left;font-weight:600;color:var(--color-text)>Category</th><th style=padding:0.75rem;text-align:right;font-weight:600;color:var(--color-text)>Amount</th></tr></thead><tbody><!$><!/><tr style=background-color:var(--color-surface-muted);font-weight:700><td colSpan=3 style=padding:0.75rem;text-align:right>Total Standalone Expenses:</td><td style=padding:0.75rem;text-align:right>`),A=i(`<div style="background-color:var(--color-surface);padding:2rem;border-radius:8px;border:1px solid var(--color-border);box-shadow:0 1px 3px rgba(0,0,0,0.1)"><div style=display:flex;justify-content:space-between;align-items:center;margin-bottom:2rem;flex-wrap:wrap;gap:1rem><h2 style=font-size:1.5rem;font-weight:700;color:var(--color-text)><!$><!/> - <!$><!/> Report</h2><div style=display:flex;gap:0.5rem;flex-wrap:wrap><button style="padding:0.75rem 1.5rem;background-color:var(--color-text);color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;transition:background-color 0.2s">📄 Print/PDF</button><button style="padding:0.75rem 1.5rem;background-color:#38a169;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;transition:background-color 0.2s">📊 Export CSV</button></div></div><div style=margin-bottom:2rem><h3 style=font-size:1.25rem;font-weight:600;color:var(--color-text);margin-bottom:1rem>Family Information</h3><div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(250px, 1fr));gap:1rem"><div><div style=font-size:0.875rem;color:var(--color-text-muted);margin-bottom:0.25rem>Family Name</div><div style=font-weight:600;color:var(--color-text)></div></div><div><div style=font-size:0.875rem;color:var(--color-text-muted);margin-bottom:0.25rem>Parent/Guardian</div><div style=font-weight:600;color:var(--color-text)></div></div><!$><!/><!$><!/></div></div><div style=margin-bottom:2rem><h3 style=font-size:1.25rem;font-weight:600;color:var(--color-text);margin-bottom:1rem>Children</h3><div style=display:flex;flex-wrap:wrap;gap:1rem></div></div><div style=margin-bottom:2rem><h3 style=font-size:1.25rem;font-weight:600;color:var(--color-text);margin-bottom:1rem>Sessions (<!$><!/>)</h3><div style=overflow:auto><table style=width:100%;border-collapse:collapse><thead><tr style=background-color:var(--color-surface-muted)><th style="padding:0.75rem;text-align:left;font-weight:600;color:var(--color-text);border:1px solid var(--color-border)">Date</th><th style="padding:0.75rem;text-align:left;font-weight:600;color:var(--color-text);border:1px solid var(--color-border)">Service</th><th style="padding:0.75rem;text-align:left;font-weight:600;color:var(--color-text);border:1px solid var(--color-border)">Children</th><th style="padding:0.75rem;text-align:left;font-weight:600;color:var(--color-text);border:1px solid var(--color-border)">Time</th><th style="padding:0.75rem;text-align:right;font-weight:600;color:var(--color-text);border:1px solid var(--color-border)">Hours</th><th style="padding:0.75rem;text-align:right;font-weight:600;color:var(--color-text);border:1px solid var(--color-border)">Rate</th><th style="padding:0.75rem;text-align:right;font-weight:600;color:var(--color-text);border:1px solid var(--color-border)">Amount</th><th style="padding:0.75rem;text-align:right;font-weight:600;color:var(--color-text);border:1px solid var(--color-border)">Total</th></tr></thead><tbody></tbody></table></div></div><div style="padding:1.5rem;background-color:var(--color-surface-muted);border-radius:8px;border:1px solid var(--color-border)"><h3 style=font-size:1.25rem;font-weight:600;color:var(--color-text);margin-bottom:1rem>Summary</h3><div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:1rem"><div><div style=font-size:0.875rem;color:var(--color-text-muted);margin-bottom:0.25rem>Total Sessions</div><div style=font-size:1.5rem;font-weight:700;color:var(--color-text)></div></div><div><div style=font-size:0.875rem;color:var(--color-text-muted);margin-bottom:0.25rem>Total Hours</div><div style=font-size:1.5rem;font-weight:700;color:var(--color-text)><!$><!/> hrs</div></div><div><div style=font-size:0.875rem;color:var(--color-text-muted);margin-bottom:0.25rem>Total Amount</div><div style=font-size:1.5rem;font-weight:700;color:var(--color-text)></div></div><div><div style=font-size:0.875rem;color:var(--color-text-muted);margin-bottom:0.25rem>Total Paid</div><div style=font-size:1.5rem;font-weight:700;color:#38a169></div></div><!$><!/></div></div><!$><!/>`),te=i(`<div><div style=font-size:0.875rem;color:var(--color-text-muted);margin-bottom:0.25rem>Email</div><div style=font-weight:600;color:var(--color-text)>`),ne=i(`<div><div style=font-size:0.875rem;color:var(--color-text-muted);margin-bottom:0.25rem>Phone</div><div style=font-weight:600;color:var(--color-text)>`),re=i(`<div style="padding:1rem;background-color:var(--color-surface-muted);border-radius:4px;border:1px solid var(--color-border)"><div style=font-weight:600;color:var(--color-text)><!$><!/> <!$><!/></div><div style=font-size:0.875rem;color:var(--color-text-muted)>Age <!$><!/> as of <!$><!/>`),ie=i(`<tr><td style="padding:0.75rem;border:1px solid var(--color-border)"></td><td style="padding:0.75rem;border:1px solid var(--color-border)"></td><td style="padding:0.75rem;border:1px solid var(--color-border)"></td><td style="padding:0.75rem;border:1px solid var(--color-border)"><!$><!/> - <!$><!/></td><td style="padding:0.75rem;border:1px solid var(--color-border);text-align:right"></td><td style="padding:0.75rem;border:1px solid var(--color-border);text-align:right"></td><td style="padding:0.75rem;border:1px solid var(--color-border);text-align:right"></td><td style="padding:0.75rem;border:1px solid var(--color-border);text-align:right;font-weight:600">`),ae=i(`<div><div style=font-size:0.875rem;color:var(--color-text-muted);margin-bottom:0.25rem>Outstanding</div><div style=font-size:1.5rem;font-weight:700;color:#e53e3e>`),oe=i(`<tr style="border-bottom:1px solid var(--color-border)"><td style=padding:0.75rem></td><td style=padding:0.75rem></td><td style=padding:0.75rem><span style="display:inline-block;padding:0.25rem 0.75rem;border-radius:12px;font-size:0.875rem;font-weight:600;background-color:#e6fffa;color:#234e52"></span></td><td style=padding:0.75rem;text-align:right;font-weight:600>`),j=i(`<div style=display:flex;flex-direction:column;gap:1.5rem><h2 style=font-size:1.5rem;font-weight:700;color:var(--color-text)>All Families - <!$><!/> Reports</h2><!$><!/>`),M=i(`<div style="background-color:var(--color-surface);padding:1.5rem;border-radius:8px;border:1px solid var(--color-border);box-shadow:0 1px 3px rgba(0,0,0,0.1)"><div style=display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;flex-wrap:wrap;gap:1rem><div><h3 style=font-size:1.25rem;font-weight:600;color:var(--color-text);margin-bottom:0.25rem></h3><div style=font-size:0.875rem;color:var(--color-text-muted)></div></div><a style="padding:0.5rem 1rem;background-color:var(--color-text);color:#fff;text-decoration:none;border-radius:4px;font-weight:600;transition:background-color 0.2s">View Full Report</a></div><div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(150px, 1fr));gap:1rem"><div><div style=font-size:0.875rem;color:var(--color-text-muted)>Sessions</div><div style=font-weight:600;color:var(--color-text)></div></div><div><div style=font-size:0.875rem;color:var(--color-text-muted)>Hours</div><div style=font-weight:600;color:var(--color-text)></div></div><div><div style=font-size:0.875rem;color:var(--color-text-muted)>Total Amount</div><div style=font-weight:600;color:var(--color-text)></div></div><div><div style=font-size:0.875rem;color:var(--color-text-muted)>Paid</div><div style=font-weight:600;color:#38a169></div></div><!$><!/>`),N=i(`<div><div style=font-size:0.875rem;color:var(--color-text-muted)>Outstanding</div><div style=font-weight:600;color:#e53e3e>`);function P(){let i=new Date().getFullYear(),[u,P]=e(i),[F,I]=e(``),[L,R]=e(`all`),z=createMemo(()=>y()),B=createMemo(()=>{let e=F(),t=u();return e&&t?_(e,t):null}),V=createMemo(()=>{let e=u();return L()===`all`&&e?v(e):null}),H=e=>new Intl.NumberFormat(`en-US`,{style:`currency`,currency:`USD`}).format(Number(String(e??0).replace(/[$,\s]/g,``))||0),U=e=>new Date(e).toLocaleDateString(`en-US`,{year:`numeric`,month:`short`,day:`numeric`}),W=e=>S(e),se=e=>{let t=[];t.push(`Year-End Report ${u()} - ${e.familyName}`),t.push(``),t.push(`Family Information`),t.push(`Family Name,${e.familyName}`),t.push(`Parent/Guardian,${e.parentName}`),e.email&&t.push(`Email,${e.email}`),e.phone&&t.push(`Phone,${e.phone}`),t.push(``),t.push(`Children`),t.push(`First Name,Last Name,Date of Birth`),e.children.forEach(e=>{t.push(`${e.firstName},${e.lastName},${new Date(e.dateOfBirth).toLocaleDateString()}`)}),t.push(``),t.push(`Sessions`),t.push(`Date,Service,Children,Start Time,End Time,Hours,Rate,Amount,Total`),e.sessions.forEach(e=>{let n=e.children.map(e=>`${e.firstName} ${e.lastName}`).join(`; `);t.push([U(e.date),e.serviceName,`"${n}"`,W(e.startTime),W(e.endTime),C(e.hours,2),e.hourlyRate?H(e.hourlyRate):`N/A`,H(e.sessionAmount),H(e.totalAmount)].join(`,`))}),t.push(``),t.push(`Summary`),t.push(`Total Sessions,${e.totalSessions}`),t.push(`Total Hours,${C(e.totalHours,2)}`),t.push(`Total Amount,${H(e.totalAmount)}`),t.push(`Total Paid,${H(e.totalPaid)}`),e.totalOutstanding>0&&t.push(`Outstanding Balance,${H(e.totalOutstanding)}`),e.standaloneExpenses&&e.standaloneExpenses.length>0&&(t.push(``),t.push(`Standalone Expenses`),t.push(`Date,Description,Category,Amount`),e.standaloneExpenses.forEach(e=>{t.push([U(e.expenseDate),e.description,e.category||`Uncategorized`,H(e.amount)].join(`,`))}),t.push(`Total Standalone Expenses,${H(e.totalStandaloneExpenses)}`));let n=t.join(`
`),r=new Blob([n],{type:`text/csv;charset=utf-8;`}),i=document.createElement(`a`),a=URL.createObjectURL(r);i.setAttribute(`href`,a),i.setAttribute(`download`,`${e.familyName}_YearEnd_${u()}.csv`),i.style.visibility=`hidden`,document.body.appendChild(i),i.click(),document.body.removeChild(i)},ce=e=>{let t=window.open(``,`_blank`);if(!t)return;let n=`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Year-End Report - ${e.familyName} - ${u()}</title>
          <style>
            @media print {
              @page {
                margin: 1in;
              }
            }
            body {
              font-family: Arial, sans-serif;
              padding: 2rem;
              max-width: 800px;
              margin: 0 auto;
              color: #2d3748;
            }
            h1 {
              color: #2d3748;
              border-bottom: 3px solid #2d3748;
              padding-bottom: 0.5rem;
              margin-bottom: 1.5rem;
            }
            h2 {
              color: #2d3748;
              margin-top: 2rem;
              margin-bottom: 1rem;
              font-size: 1.25rem;
            }
            .info-section {
              margin: 1.5rem 0;
            }
            .info-row {
              margin: 0.5rem 0;
            }
            .info-label {
              font-weight: 600;
              display: inline-block;
              width: 150px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 1rem 0;
              font-size: 0.875rem;
            }
            th {
              background-color: #2d3748;
              color: white;
              padding: 0.75rem;
              text-align: left;
              font-weight: 600;
            }
            td {
              padding: 0.75rem;
              border-bottom: 1px solid #e2e8f0;
            }
            tr:nth-child(even) {
              background-color: #f7fafc;
            }
            .totals {
              margin-top: 2rem;
              padding: 1rem;
              background-color: #f7fafc;
              border-radius: 4px;
              border: 1px solid #e2e8f0;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              margin: 0.5rem 0;
              font-size: 1.1rem;
            }
            .total-label {
              font-weight: 600;
            }
            .total-amount {
              font-weight: 700;
              color: #2d3748;
            }
            .footer {
              margin-top: 3rem;
              font-size: 0.875rem;
              color: #718096;
              text-align: center;
              border-top: 1px solid #e2e8f0;
              padding-top: 1rem;
            }
            @media print {
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <h1>Year-End Report ${u()}</h1>
          
          <div class="info-section">
            <h2>Family Information</h2>
            <div class="info-row">
              <span class="info-label">Family Name:</span>
              <span>${e.familyName}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Parent/Guardian:</span>
              <span>${e.parentName}</span>
            </div>
            ${e.email?`<div class="info-row"><span class="info-label">Email:</span><span>${e.email}</span></div>`:``}
            ${e.phone?`<div class="info-row"><span class="info-label">Phone:</span><span>${e.phone}</span></div>`:``}
            ${e.address?`<div class="info-row"><span class="info-label">Address:</span><span>${e.address}${e.city?`, ${e.city}`:``}${e.state?`, ${e.state}`:``} ${e.zipCode||``}</span></div>`:``}
          </div>

          <div class="info-section">
            <h2>Children</h2>
            <ul>
              ${e.children.map(e=>{let t=new Date(e.dateOfBirth),n=u()-t.getFullYear();return`<li>${e.firstName} ${e.lastName} (Age ${n} as of ${u()})</li>`}).join(``)}
            </ul>
          </div>

          <div class="info-section">
            <h2>Session Details</h2>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Service</th>
                  <th>Children</th>
                  <th>Time</th>
                  <th>Hours</th>
                  <th>Rate</th>
                  <th>Amount</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${e.sessions.map(e=>`
                  <tr>
                    <td>${U(e.date)}</td>
                    <td>${e.serviceName}</td>
                    <td>${e.children.map(e=>`${e.firstName} ${e.lastName}`).join(`, `)||`N/A`}</td>
                    <td>${W(e.startTime)} - ${W(e.endTime)}</td>
                    <td>${C(e.hours,2)}</td>
                    <td>${e.hourlyRate?H(e.hourlyRate):`N/A`}</td>
                    <td>${H(e.sessionAmount)}</td>
                    <td>${H(e.totalAmount)}</td>
                  </tr>
                `).join(``)}
              </tbody>
            </table>
          </div>

          <div class="totals">
            <h2>Summary</h2>
            <div class="total-row">
              <span class="total-label">Total Sessions:</span>
              <span class="total-amount">${e.totalSessions}</span>
            </div>
            <div class="total-row">
              <span class="total-label">Total Hours:</span>
              <span class="total-amount">${C(e.totalHours,2)} hours</span>
            </div>
            <div class="total-row">
              <span class="total-label">Total Amount:</span>
              <span class="total-amount">${H(e.totalAmount)}</span>
            </div>
            <div class="total-row">
              <span class="total-label">Total Paid:</span>
              <span class="total-amount">${H(e.totalPaid)}</span>
            </div>
            ${e.totalOutstanding>0?`
              <div class="total-row">
                <span class="total-label">Outstanding Balance:</span>
                <span class="total-amount" style="color: #e53e3e;">${H(e.totalOutstanding)}</span>
              </div>
            `:``}
          </div>

          <div class="footer">
            Generated on ${new Date().toLocaleDateString(`en-US`,{year:`numeric`,month:`long`,day:`numeric`})}
          </div>
        </body>
      </html>
    `;t.document.write(n),t.document.close(),t.focus(),setTimeout(()=>{t.print()},250)};return n(x,{get children(){return[(()=>{var e=s(w);return e._$owner=d(),e})(),n(b,{title:`Year-End Receipt Report`,description:`Generate detailed year-end reports for families with session details, hours, and payment information.`}),(()=>{var e=s(E),o=e.firstChild,d=o.firstChild,f=d.firstChild.nextSibling,m=d.nextSibling,h=m.firstChild.nextSibling,_=m.nextSibling,[v,y]=l(_.nextSibling);return f.addEventListener(`change`,e=>P(parseInt(e.currentTarget.value))),c(f,t(()=>Array.from({length:5},(e,t)=>i-t).map(e=>(()=>{var t=s(O);return t.value=e,c(t,e),t})()))),h.addEventListener(`change`,e=>{R(e.currentTarget.value),e.currentTarget.value===`all`&&I(``)}),c(o,n(a,{get when(){return L()===`single`},get children(){var e=s(T),i=e.firstChild.nextSibling,a=i.firstChild.nextSibling,[o,u]=l(a.nextSibling);return i.addEventListener(`change`,e=>I(e.currentTarget.value)),c(i,n(r,{get each(){return z()},children:e=>(()=>{var n=s(k),r=n.firstChild,[i,a]=l(r.nextSibling),o=i.nextSibling.nextSibling,[u,d]=l(o.nextSibling);return u.nextSibling,c(n,()=>e.familyName,i,a),c(n,t(()=>g(e.parentFirstName,e.parentLastName,e.familyMembers)),u,d),p(()=>e.id,e=>{n.value=e}),n})()}),o,u),p(()=>F(),e=>{queueMicrotask(()=>i.value=e)||(i.value=e)}),e}}),v,y),p(()=>({e:u(),t:L()}),({e,t},n)=>{queueMicrotask(()=>f.value=e)||(f.value=e),queueMicrotask(()=>h.value=t)||(h.value=t)}),e})(),n(a,{get when(){return m(()=>L()===`single`)()&&B()},children:e=>(()=>{var i=s(A),d=i.firstChild,f=d.firstChild,p=f.firstChild,[h,g]=l(p.nextSibling),_=h.nextSibling.nextSibling,[v,y]=l(_.nextSibling);v.nextSibling;var b=f.nextSibling.firstChild,x=b.nextSibling,S=d.nextSibling,w=S.firstChild.nextSibling,T=w.firstChild,E=T.firstChild.nextSibling,D=T.nextSibling,O=D.firstChild.nextSibling,k=D.nextSibling,[j,M]=l(k.nextSibling),N=j.nextSibling,[P,F]=l(N.nextSibling),I=S.nextSibling,L=I.firstChild.nextSibling,R=I.nextSibling,z=R.firstChild,B=z.firstChild.nextSibling,[V,le]=l(B.nextSibling);V.nextSibling;var ue=z.nextSibling.firstChild.firstChild.nextSibling,G=R.nextSibling,K=G.firstChild.nextSibling,q=K.firstChild,de=q.firstChild.nextSibling,J=q.nextSibling,Y=J.firstChild.nextSibling,fe=Y.firstChild,[X,pe]=l(fe.nextSibling);X.nextSibling;var Z=J.nextSibling,me=Z.firstChild.nextSibling,Q=Z.nextSibling,he=Q.firstChild.nextSibling,$=Q.nextSibling,[ge,_e]=l($.nextSibling),ve=G.nextSibling,[ye,be]=l(ve.nextSibling);return c(f,()=>e().familyName,h,g),c(f,t(()=>u()),v,y),b.addEventListener(`mouseleave`,e=>{e.currentTarget.style.backgroundColor=`var(--color-text)`}),b.addEventListener(`mouseenter`,e=>{e.currentTarget.style.backgroundColor=`#1a202c`}),b.$$click=()=>ce(e()),x.addEventListener(`mouseleave`,e=>{e.currentTarget.style.backgroundColor=`#38a169`}),x.addEventListener(`mouseenter`,e=>{e.currentTarget.style.backgroundColor=`#2f855a`}),x.$$click=()=>se(e()),c(E,()=>e().familyName),c(O,()=>e().parentName),c(w,t((()=>{var t=m(()=>!!e().email);return()=>t()?(()=>{var t=s(te),n=t.firstChild.nextSibling;return c(n,()=>e().email),t})():e().email})()),j,M),c(w,t((()=>{var t=m(()=>!!e().phone);return()=>t()?(()=>{var t=s(ne),n=t.firstChild.nextSibling;return c(n,()=>e().phone),t})():e().phone})()),P,F),c(L,n(r,{get each(){return e().children},children:e=>{let n=new Date(e.dateOfBirth),r=u()-n.getFullYear();var i=s(re),a=i.firstChild,o=a.firstChild,[d,f]=l(o.nextSibling),p=d.nextSibling.nextSibling,[m,h]=l(p.nextSibling),g=a.nextSibling,_=g.firstChild.nextSibling,[v,y]=l(_.nextSibling),b=v.nextSibling.nextSibling,[x,S]=l(b.nextSibling);return c(a,()=>e.firstName,d,f),c(a,()=>e.lastName,m,h),c(g,r,v,y),c(g,t(()=>u()),x,S),i}})),c(z,()=>e().totalSessions,V,le),c(ue,n(r,{get each(){return e().sessions},children:e=>(()=>{var n=s(ie),r=n.firstChild,i=r.nextSibling,a=i.nextSibling,o=a.nextSibling,u=o.firstChild,[d,f]=l(u.nextSibling),p=d.nextSibling.nextSibling,[h,g]=l(p.nextSibling),_=o.nextSibling,v=_.nextSibling,y=v.nextSibling,b=y.nextSibling;return c(r,t(()=>U(e.date))),c(i,()=>e.serviceName),c(a,()=>e.children.map(e=>`${e.firstName} ${e.lastName}`).join(`, `)||`N/A`),c(o,t(()=>W(e.startTime)),d,f),c(o,t(()=>W(e.endTime)),h,g),c(_,t(()=>C(e.hours,2))),c(v,t((()=>{var t=m(()=>!!e.hourlyRate);return()=>t()?H(e.hourlyRate):`N/A`})())),c(y,t(()=>H(e.sessionAmount))),c(b,t(()=>H(e.totalAmount))),n})()})),c(de,()=>e().totalSessions),c(Y,t(()=>C(e().totalHours,2)),X,pe),c(me,t(()=>H(e().totalAmount))),c(he,t(()=>H(e().totalPaid))),c(K,t((()=>{var n=m(()=>e().totalOutstanding>0);return()=>n()&&(()=>{var n=s(ae),r=n.firstChild.nextSibling;return c(r,t(()=>H(e().totalOutstanding))),n})()})()),ge,_e),c(i,n(a,{get when(){return m(()=>!!e().standaloneExpenses)()?e().standaloneExpenses.length>0:e().standaloneExpenses},get children(){var i=s(ee),a=i.firstChild,o=a.firstChild.nextSibling,[u,d]=l(o.nextSibling);u.nextSibling;var f=a.nextSibling.firstChild.firstChild.nextSibling,p=f.firstChild,[m,h]=l(p.nextSibling),g=m.nextSibling.firstChild.nextSibling;return c(a,()=>e().standaloneExpenses.length,u,d),c(f,n(r,{get each(){return e().standaloneExpenses},children:e=>(()=>{var n=s(oe),r=n.firstChild,i=r.nextSibling,a=i.nextSibling,o=a.firstChild,l=a.nextSibling;return c(r,t(()=>U(e.expenseDate))),c(i,()=>e.description),c(o,()=>e.category||`Uncategorized`),c(l,t(()=>H(e.amount))),n})()}),m,h),c(g,t(()=>H(e().totalStandaloneExpenses))),i}}),ye,be),o(),i})()}),n(a,{get when(){return m(()=>L()===`all`)()&&V()},children:e=>(()=>{var i=s(j),a=i.firstChild,o=a.firstChild.nextSibling,[d,g]=l(o.nextSibling);d.nextSibling;var _=a.nextSibling,[v,y]=l(_.nextSibling);return c(a,t(()=>u()),d,g),c(i,n(r,{get each(){return e()},children:e=>(()=>{var n=s(M),r=n.firstChild,i=r.firstChild,a=i.firstChild,o=a.nextSibling,d=i.nextSibling,g=r.nextSibling,_=g.firstChild,v=_.firstChild.nextSibling,y=_.nextSibling,b=y.firstChild.nextSibling,x=y.nextSibling,S=x.firstChild.nextSibling,w=x.nextSibling,T=w.firstChild.nextSibling,E=w.nextSibling,[D,O]=l(E.nextSibling);return c(a,()=>e.familyName),c(o,()=>e.parentName),d.addEventListener(`mouseleave`,e=>{e.currentTarget.style.backgroundColor=`var(--color-text)`}),d.addEventListener(`mouseenter`,e=>{e.currentTarget.style.backgroundColor=`#1a202c`}),f(d),c(v,()=>e.totalSessions),c(b,t(()=>C(e.totalHours,2))),c(S,t(()=>H(e.totalAmount))),c(T,t(()=>H(e.totalPaid))),c(g,t((()=>{var n=m(()=>e.totalOutstanding>0);return()=>n()&&(()=>{var n=s(N),r=n.firstChild.nextSibling;return c(r,t(()=>H(e.totalOutstanding))),n})()})()),D,O),p(()=>`/reports/year-end?family=${e.familyId}&year=${u()}`,e=>{h(d,`href`,e)}),n})()}),v,y),i})()}),n(a,{get when(){return m(()=>L()===`single`)()&&!F()},get children(){var e=s(D),n=e.firstChild.nextSibling,r=n.firstChild.nextSibling,[i,a]=l(r.nextSibling);return i.nextSibling,c(n,t(()=>u()),i,a),e}})]}})}u([`click`]);export{P as default};