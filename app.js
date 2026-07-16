const scenarios = {
  retail: {
    label: 'Illustrative baseline: Retail inventory exception',
    posture: 'human', postureLabel: 'SHADOW + HUMAN APPROVAL', tone: 'watch',
    states: ['ready','ready','watch','ready','watch'],
    readout: 'The task can traverse the workflow, but inventory actions remain human-approved until exception policy and production ownership are proven in use.'
  },
  finance: {
    label: 'Illustrative scenario: Finance exception triage',
    posture: 'hold', postureLabel: 'HOLD FOR AUTHORITY DESIGN', tone: 'hold',
    states: ['ready','watch','hold','ready','watch'],
    readout: 'Context is available, but authority to invoke financial tools is not yet explicit. The system should stop before action, surface evidence, and route to an accountable human.'
  },
  health: {
    label: 'Illustrative scenario: Healthcare intake',
    posture: 'human', postureLabel: 'HUMAN-FIRST WITH AUDIT TRACE', tone: 'watch',
    states: ['ready','watch','hold','ready','ready'],
    readout: 'The agent may organize and retrieve, but clinical interpretation and consequential action remain with qualified people. Every recommendation carries provenance and a review record.'
  }
};
function setScenario(key){
  const s=scenarios[key]; if(!s) return;
  document.querySelectorAll('.scenario-button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.scenario===key)));
  const stage=document.querySelector('.bridge-stage'); if(stage) stage.dataset.posture=s.posture;
  document.querySelectorAll('.pier').forEach((p,i)=>p.dataset.state=s.states[i]);
  const base=document.querySelector('.baseline'); if(base) base.textContent=s.label;
  const val=document.querySelector('.posture-value'); if(val){val.textContent=s.postureLabel;val.className='posture-value '+s.tone;}
  const readout=document.querySelector('.contract-readout'); if(readout) readout.textContent=s.readout;
  localStorage.setItem('acnScenario',key);
}
document.querySelectorAll('.scenario-button').forEach(b=>b.addEventListener('click',()=>setScenario(b.dataset.scenario)));
document.querySelector('.reset')?.addEventListener('click',()=>setScenario('retail'));
setScenario(localStorage.getItem('acnScenario') || 'retail');
const mb=document.querySelector('.menu-button'); const links=document.querySelector('.nav-links');
mb?.addEventListener('click',()=>{const open=links.classList.toggle('open');mb.setAttribute('aria-expanded',String(open));});
