const scenarios = {
  retail: {
    label: 'Illustrative baseline: Retail inventory exception',
    postureLabel: 'SHADOW + HUMAN APPROVAL',
    tone: 'watch',
    states: ['ready', 'ready', 'watch', 'ready', 'watch'],
    readout: 'The task can traverse the workflow, but inventory actions remain human-approved until exception policy and production ownership are proven in use.'
  },
  finance: {
    label: 'Illustrative scenario: Finance exception triage',
    postureLabel: 'HOLD FOR AUTHORITY DESIGN',
    tone: 'hold',
    states: ['ready', 'watch', 'hold', 'ready', 'watch'],
    readout: 'Context is available, but authority to invoke financial tools is not yet explicit. The system should stop before action, surface evidence, and route to an accountable human.'
  },
  health: {
    label: 'Illustrative scenario: Healthcare intake',
    postureLabel: 'HUMAN-FIRST WITH AUDIT TRACE',
    tone: 'watch',
    states: ['ready', 'watch', 'hold', 'ready', 'ready'],
    readout: 'The agent may organize and retrieve, but clinical interpretation and consequential action remain with qualified people. Every recommendation carries provenance and a review record.'
  }
};

const stateLabels = {
  ready: 'Load-bearing',
  watch: 'Proof required',
  hold: 'Human authority'
};

function runCrossing() {
  const crossing = document.querySelector('.hero-crossing');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!crossing || reduceMotion) return;
  crossing.classList.remove('is-running');
  void crossing.offsetWidth;
  crossing.classList.add('is-running');
}

function setScenario(key) {
  const s = scenarios[key];
  if (!s) return;

  document.querySelectorAll('.scenario-button').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.scenario === key));
  });

  document.querySelectorAll('.contract-state').forEach((row, i) => {
    const state = s.states[i];
    row.dataset.state = state;
    const label = row.querySelector('.state-label');
    if (label) label.textContent = stateLabels[state];
  });

  const baseline = document.querySelector('.baseline');
  if (baseline) baseline.textContent = s.label;

  const posture = document.querySelector('.posture-value');
  if (posture) {
    posture.textContent = s.postureLabel;
    posture.className = `posture-value ${s.tone}`;
  }

  const readout = document.querySelector('.contract-readout');
  if (readout) readout.textContent = s.readout;

  const model = document.querySelector('.studio-model');
  if (model) {
    model.classList.remove('is-updating');
    void model.offsetWidth;
    model.classList.add('is-updating');
  }

  localStorage.setItem('acnScenario', key);
}

document.querySelector('[data-crossing-replay]')?.addEventListener('click', runCrossing);
document.querySelectorAll('.scenario-button').forEach((button) => {
  button.addEventListener('click', () => setScenario(button.dataset.scenario));
});

setScenario(localStorage.getItem('acnScenario') || 'retail');

const menuButton = document.querySelector('.menu-button');
const navLinks = document.querySelector('.nav-links');
menuButton?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});

const artifactDownloads = [
  {
    label: 'Role-aligned resume',
    href: 'docs/Russell-Dudek-Accenture-Resume.pdf',
    filename: 'Russell-Dudek-Accenture-Resume.pdf'
  },
  {
    label: 'Cover letter',
    href: 'docs/Russell-Dudek-Accenture-Cover-Letter.pdf',
    filename: 'Russell-Dudek-Accenture-Cover-Letter.pdf'
  },
  {
    label: 'Interview thesis brief',
    href: 'docs/Russell-Dudek-Accenture-Interview-Brief.pdf',
    filename: 'Russell-Dudek-Accenture-Interview-Brief.pdf'
  },
  {
    label: '90-day entry plan',
    href: 'docs/Russell-Dudek-Accenture-90-Day-Plan.pdf',
    filename: 'Russell-Dudek-Accenture-90-Day-Plan.pdf'
  },
  {
    label: 'Agent Load Path Review',
    href: 'docs/Russell-Dudek-Agent-Load-Path-Review.pdf',
    filename: 'Russell-Dudek-Agent-Load-Path-Review.pdf'
  },
  {
    label: 'Immediate contribution case',
    href: 'docs/Russell-Dudek-Accenture-Contribution-Case.pdf',
    filename: 'Russell-Dudek-Accenture-Contribution-Case.pdf'
  }
];

function enableArtifactDownloads() {
  if (!document.querySelector('link[href="artifact-downloads.css"]')) {
    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = 'artifact-downloads.css';
    document.head.appendChild(stylesheet);
  }

  const rail = document.querySelector('.cta-links');
  if (!rail) return;
  rail.setAttribute('aria-label', 'Download campaign documents');

  const links = [...rail.querySelectorAll('a')];
  artifactDownloads.forEach((artifact, index) => {
    const link = links[index];
    if (!link) return;

    link.className = 'artifact-download';
    link.href = artifact.href;
    link.setAttribute('download', artifact.filename);
    link.setAttribute('aria-label', `Download ${artifact.label} PDF`);
    link.innerHTML = `
      <span class="artifact-number">${String(index + 1).padStart(2, '0')}</span>
      <span class="artifact-copy"><strong>${artifact.label}</strong><small>PDF · Direct download</small></span>
      <span class="artifact-arrow" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false"><path d="M12 4v11m0 0 4-4m-4 4-4-4M5 20h14"/></svg>
      </span>`;
  });
}

enableArtifactDownloads();
