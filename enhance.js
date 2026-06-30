/* enhance.js - Sigma Signals dashboard (s60)
   Additif, charge en <script defer> apres le script principal. Zero modif du code existant.

   A) Retire l'heritage "note Haiku" (#328), non predictif et fige a ~5 depuis le retrait Haiku (s52) :
      - colonne "Note Live" (col 3 de l'onglet Signaux)
      - filtre "Note min" (slider #sl-note, inerte a 0)
      - widget "Top Picks actifs" (#w-top, sous-titre "note live >= 7")
      La colonne "Decision" est conservee : elle montre deja le VRAI verdict bot (botVerdictHtml,
      /api/autobuy-data, rebasee en s44) -- ce n'etait pas une note.

   B) Onglet "Pilote" : sante du micro-listener (early_micro, fermetures appariees vers H1, budget).
   C) Onglet "Pilote" : P&L realise recent (7j / 14j / 30 derniers trades).

   Mobile (iPhone) : barre d'onglets en pilules qui passent a la ligne (plus de scroll horizontal
   pour atteindre Positions / Auto-achat), widgets 2 colonnes, tables scrollables.
*/
(function () {
  'use strict';

  /* ---------- styles ---------- */
  var css = [
    /* A : masquer la colonne "Note Live" (3e colonne) de la table Signaux */
    '#tab-signals table thead th:nth-child(3),',
    '#tab-signals table tbody td:nth-child(3){display:none !important;}',

    /* Panneau pilote */
    '.pilot-title{font-size:13px;font-weight:700;color:var(--text);padding:16px 20px 4px;letter-spacing:.3px;}',
    '.pilot-title .muted{color:var(--muted);font-weight:400;font-size:11px;}',
    '.pbar{height:8px;background:var(--bg3);border-radius:999px;overflow:hidden;margin-top:8px;}',
    '.pbar > span{display:block;height:100%;width:0;background:var(--accent);border-radius:999px;transition:width .4s;}',
    '.pnl-table{width:calc(100% - 40px);margin:4px 20px 16px;border-collapse:collapse;font-size:12px;}',
    '.pnl-table th,.pnl-table td{padding:8px 10px;text-align:right;border-bottom:1px solid var(--border);}',
    '.pnl-table th:first-child,.pnl-table td:first-child{text-align:left;}',
    '.pnl-table thead th{color:var(--muted);font-weight:600;font-size:11px;}',
    '.pnl-table .neuf{color:var(--muted);}',
    '.pilot-note{padding:0 20px 24px;color:var(--muted);font-size:11px;line-height:1.55;}',
    '.pos{color:var(--green);} .neg{color:var(--red);}',

    /* Responsive mobile */
    '@media (max-width:640px){',
    '  .tabs{flex-wrap:wrap;gap:6px;padding:8px 10px;}',
    '  .tab-btn{border:1px solid var(--border);border-radius:999px;padding:7px 12px;}',
    '  .tab-btn.active{background:var(--accent);color:#fff;border-color:var(--accent);border-bottom-color:var(--accent);}',
    '  .widgets{grid-template-columns:repeat(2,1fr);gap:8px;padding:10px;}',
    '  .widget-value{font-size:20px;}',
    '  .tab-content{overflow-x:auto;-webkit-overflow-scrolling:touch;}',
    '  table{font-size:11px;}',
    '  body{overflow-x:hidden;}',
    '  .pnl-table{width:calc(100% - 20px);margin:4px 10px 14px;}',
    '  .pilot-title{padding:12px 10px 4px;}',
    '  .pilot-note{padding:0 10px 20px;}',
    '}'
  ].join('\n');

  var st = document.createElement('style');
  st.id = 'sigma-enhance-style';
  st.textContent = css;
  document.head.appendChild(st);

  /* ---------- A : masquer filtre "Note min" + widget "Top Picks" ---------- */
  function hideNoteLegacy() {
    try {
      var sl = document.getElementById('sl-note');
      if (sl && sl.closest('.control-group')) sl.closest('.control-group').style.display = 'none';
      var wt = document.getElementById('w-top');
      if (wt && wt.closest('.widget')) wt.closest('.widget').style.display = 'none';
    } catch (e) {}
  }

  /* ---------- helpers P&L ---------- */
  function pctTxt(v) { return v == null ? '—' : (v > 0 ? '+' : '') + v + '%'; }
  function pctCls(v) { return v == null ? '' : (v >= 0 ? 'pos' : 'neg'); }
  function netTxt(v) { return v == null ? '—' : (v > 0 ? '+' : '') + v; }
  function pnlRow(label, o) {
    if (!o || o.n == null || o.n === 0) {
      return '<tr><td>' + label + '</td><td colspan="4" class="neuf" style="text-align:center">—</td></tr>';
    }
    return '<tr><td>' + label + '</td>' +
      '<td>' + o.n + '</td>' +
      '<td>' + (o.win == null ? '—' : o.win + '%') + '</td>' +
      '<td class="' + pctCls(o.avg) + '">' + pctTxt(o.avg) + '</td>' +
      '<td class="' + pctCls(o.net) + '">' + netTxt(o.net) + '</td></tr>';
  }

  /* ---------- B + C : onglet Pilote ---------- */
  function injectPiloteTab() {
    if (document.getElementById('tab-pilote')) return;
    var tabs = document.querySelector('.tabs');
    var anchor = document.getElementById('tab-signals');
    if (!tabs || !anchor) return;

    var btn = document.createElement('button');
    btn.className = 'tab-btn';
    btn.id = 'tab-pilote-btn';
    btn.textContent = '🔬 Pilote';
    btn.onclick = function () {
      if (typeof switchTab === 'function') switchTab('pilote', btn);
      loadPilote();
    };
    tabs.appendChild(btn);

    var div = document.createElement('div');
    div.id = 'tab-pilote';
    div.className = 'tab-content';
    div.innerHTML =
      '<div class="pilot-title">🔬 Pilote micro-listener <span class="muted">— collecte microstructure, non-trading</span></div>' +
      '<div class="widgets">' +
        '<div class="widget"><div class="widget-label">Tokens écoutés</div>' +
          '<div class="widget-value" id="pl-total">—</div>' +
          '<div class="widget-sub" id="pl-sr">— avec sell-ratio</div></div>' +
        '<div class="widget"><div class="widget-label">Fermetures appariées</div>' +
          '<div class="widget-value" id="pl-paired">—</div>' +
          '<div class="widget-sub">vers H1 · objectif 80</div>' +
          '<div class="pbar"><span id="pl-bar"></span></div></div>' +
        '<div class="widget"><div class="widget-label">Dépense pilote</div>' +
          '<div class="widget-value" id="pl-spent">—</div>' +
          '<div class="widget-sub" id="pl-spent-sub">— msgs · plafond 100k</div>' +
          '<div class="pbar"><span id="pl-budbar"></span></div></div>' +
        '<div class="widget"><div class="widget-label">Dernier token</div>' +
          '<div class="widget-value" id="pl-fresh" style="font-size:18px">—</div>' +
          '<div class="widget-sub">activité du listener</div></div>' +
      '</div>' +
      '<div class="pilot-title">📈 P&L réalisé récent <span class="muted">— le bot tourne, isolé du pilote</span></div>' +
      '<table class="pnl-table"><thead><tr>' +
        '<th>Fenêtre</th><th>Trades</th><th>Gagnants</th><th>P&L moyen</th><th>Net SOL</th>' +
      '</tr></thead><tbody id="pl-pnl-body">' +
        '<tr><td colspan="5" class="neuf" style="text-align:center">chargement…</td></tr>' +
      '</tbody></table>' +
      '<div class="pilot-note">H1 (pré-enregistrée) : split au sell-ratio médian, validée si ' +
        'EV(moitié peu-vendeuse) − EV(moitié vendeuse) ≥ +8 pp, n ≥ 80 fermetures appariées. ' +
        'Pas jugeable avant ~quelques semaines — ici on suit l\'accumulation, on ne conclut pas.</div>';

    anchor.parentNode.appendChild(div);
  }

  /* ---------- chargement des donnees pilote ---------- */
  var loading = false;
  function setTxt(id, txt) { var el = document.getElementById(id); if (el) el.textContent = txt; }
  function setW(id, pct) { var el = document.getElementById(id); if (el) el.style.width = pct + '%'; }

  function loadPilote() {
    if (loading) return;
    loading = true;
    fetch('/api/pilot-health', { headers: { Accept: 'application/json' }, cache: 'no-store' })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        loading = false;
        if (!d || !d.pilot) return;
        var p = d.pilot;
        setTxt('pl-total', p.em_total != null ? p.em_total : '—');
        setTxt('pl-sr', (p.em_sr != null ? p.em_sr : '—') + ' avec sell-ratio');
        setTxt('pl-paired', (p.paired != null ? p.paired : '—') + ' / ' + (p.h1_target || 80));
        setW('pl-bar', Math.min(100, Math.round(100 * (p.paired || 0) / (p.h1_target || 80))));

        var spent = (p.sol_spent != null) ? p.sol_spent.toFixed(4) + ' SOL' : '—';
        setTxt('pl-spent', spent);
        var msgs = (p.paid_total != null) ? p.paid_total.toLocaleString('fr-FR') : '—';
        setTxt('pl-spent-sub', msgs + ' msgs · plafond ' + ((p.cap_total || 100000) / 1000) + 'k');
        setW('pl-budbar', Math.min(100, Math.round(100 * (p.paid_total || 0) / (p.cap_total || 100000))));

        setTxt('pl-fresh', p.last_min == null ? '—'
          : (p.last_min <= 0 ? "à l'instant" : 'il y a ' + p.last_min + ' min'));

        var body = document.getElementById('pl-pnl-body');
        if (body && d.pnl) {
          body.innerHTML =
            pnlRow('7 jours', d.pnl.d7) +
            pnlRow('14 jours', d.pnl.d14) +
            pnlRow('30 derniers', d.pnl.last30);
        }
      })
      .catch(function () { loading = false; });
  }
  window.loadPilote = loadPilote;

  /* ---------- init ---------- */
  function init() {
    hideNoteLegacy();
    injectPiloteTab();
    loadPilote(); // pre-remplit en fond
    setInterval(function () {
      var t = document.getElementById('tab-pilote');
      if (t && t.classList.contains('active')) loadPilote();
    }, 60000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
