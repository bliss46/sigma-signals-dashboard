# 📋 Contexte — Projet Sigma Signals

**Dernière mise à jour** : 25 mai 2026 — session 2 (dashboard v3.2 : G1 filtre EXPIRED + colonne BP% + alertes Telegram intelligentes + E1 dual-source)
**Statut** : ✅ **Pipeline v3.2 en production** — Workflows 02 (2h) + C1 (15min) + D1 (5min) + B1 (solde USDT) + G1 (TP/SL tracker) + E1 (Early proxy 5min) actifs — Dashboard Vercel **v3.2** live (3 onglets : Signaux + G1 Tracker connecté + Early <30min) — Enrichissement Birdeye actif — Note Live recalculée en temps réel
**Sessions précédentes** :
- 14 mai 2026 : setup initial + pipeline v1.0 (paliers 1-5 complets)
- 15 mai 2026 : A1 Déduplication + A2 GoPlus Security → pipeline v1.2
- 16 mai 2026 (matin) : diagnostic panne + restauration credentials + fix SQL + N8N_ENCRYPTION_KEY → pipeline v1.3
- 16 mai 2026 (soir) : B1 Google Sheets logging + résolution définitive N8N_ENCRYPTION_KEY → pipeline v1.4
- 17 mai 2026 (nuit) : D1 node IF "skipped" + fix bug Google Sheets (Map Automatically) → pipeline v1.5
- 18 mai 2026 (après-midi) : C1 workflow pump 15min + fix regex Telegram + suppression bruit "no new pump" → pipeline v1.6
- 19 mai 2026 (matin) : diagnostic panne credentials (redémarrage Railway via ajout variables Binance) + restauration complète + N8N_ENCRYPTION_KEY fixée définitivement dans Railway → pipeline v1.7
- 19 mai 2026 (après-midi) : nettoyage workflows temporaires + fix B1 Binance (HMAC pur JS) + analyse Google Sheet + calibration prompt Claude → pipeline v1.8
- 19 mai 2026 (soir) : Dashboard Vercel déployé + Google Sheet "Publier sur le Web" + fix lien DexScreener D1 → pipeline v1.9
- 20 mai 2026 (matin) : scoring 4 axes actif (buy_ratio/vol_liq/age_minutes loggés dans 02+C1+D1) + C1 logging Google Sheets + fix B1 (endpoint /api/v3/account) + G1 Price Tracker documenté + connexion automatique G1 → pending_checks → pipeline v2.0
- 20 mai 2026 (après-midi/soir) : fix note Claude aberrante (clamp 0-10 dans 3 workflows) + suppression ligne UP corrompue (46301) + dashboard v2.1 (colonnes triables, colonne Détecté, âge actuel corrigé) → **dashboard v2.1**
- 20 mai 2026 (nuit) : fix tri Âge dashboard (null→Infinity, âge actuel calculé) + étoile ⭐ TOP PICK + règles prompt dump post-pump (change_24h>200% ET change_1h<-20% → note max 3) appliquées sur 02/C1/D1 → **dashboard v2.2 + prompts v2.2**
- 20 mai 2026 (nuit→matin) : dashboard v2.3 — colonnes Liq Live + ΔPrix (fetch DexScreener temps réel, IIFEs inline dans renderAll, 15 tokens max) → **dashboard v2.3**
- 20 mai 2026 (après-midi/soir, session suivante) : toggle dédup dashboard (1 ligne par token) + Liq Live étendu à 50 tokens (2 batch de 30) + fix price_usd depuis DexScreener dans 3 workflows + fix G1 (skipped→[] au lieu de [{skipped:true}]) + fix B1 (timestamp dupliqué) → **dashboard v2.4 + pipeline v2.4**
- 21 mai 2026 (matin) : premier trade réel BULL (0.22 SOL, SL -30%) + dashboard v2.5 (sliders visibles, tri Liq Live/ΔPrix) + dashboard v2.6 (100 signaux) + fix priceUsd fallback priceNative dans 02/C1/D1 + filtre C1 priceUsd guard supprimé + D1 alertes Telegram TOP PICK uniquement + B1 bot Telegram séparé (@binance_copy_trading_bliss46_bot) + B1 alertes seulement si variation solde → **pipeline v2.5 + dashboard v2.6**
- 22 mai 2026 (matin) : colonne source (02/C1/D1) dans Sheet + workflows patchés + section Suivi G1 dashboard + LunarCrush exploré (compte créé, 402 sur tous les endpoints utiles → abandonné) → **dashboard v2.7 + pipeline v2.7**
- 22 mai 2026 (après-midi/soir) : intégration Birdeye BDS (free tier 30k CU/mois) — enrichissement be_buy_pressure + be_unique_wallets dans 02/C1/D1 — circuit breaker `birdeye_quota` Postgres (500 appels/jour) — prompts Claude v2.8 (règles scoring Birdeye) — colonne buy_pressure_be dans Sheet — fix dashboard : DÉTECTÉ fallback l1, NaNj→— Suivi G1, labels complets graphique Sources, padding coche déduplication → **dashboard v2.8 + pipeline v2.8**
- 22 mai 2026 (soir) : fix bug critique Birdeye/prompt (candidates vides → $('Enrich Birdeye data').first().json.candidates dans 02+C1) + fix dashboard âge fallback l1 (v2.9) + **refonte dashboard v3.0 Live Scoring** (Note Live recalculée temps réel, dédup par défaut, Δ1h/Δ24h live, décisions actionnables) → **dashboard v3.0**
- 25 mai 2026 : onglet Early (<30min) via proxy n8n E1 (DexScreener token-profiles/latest, filtre Solana <30min liq≥5k$) + G1 Tracker connecté au webhook n8n (pending_checks + prix live DexScreener) + nettoyage pending_checks expirées + fix expiration automatique (parsing horizon "24h" → 24h) → **dashboard v3.1 + pipeline v3.1**
- 25 mai 2026 (session 2) : dashboard v3.2 — G1 filtre EXPIRED (toggle + stats corrigées) + colonne BP% (Birdeye, rouge/orange/vert, tri) + alertes Telegram intelligentes (préfixe ⚠️ si DUMP/MOMENTUM NEG dans 02/C1/D1) + E1 dual-source (token-profiles + search) + cache 25min → **dashboard v3.2 + pipeline v3.2**

---

## 🎯 Objectif global

Construire un **pipeline de signaux automatisé** autour de Sigma Bot (sigma.win) pour assister Cédric dans son apprentissage du trading crypto on-chain.

L'idée n'est PAS d'automatiser le trading lui-même (Sigma n'a pas d'API publique), mais d'**automatiser tout ce qui se passe AVANT** :
- Collecte de signaux (DexScreener trending, à terme Twitter)
- Filtrage par IA (Claude)
- Vérifications on-chain (sécurité, liquidité, métriques)
- Notification Telegram structurée
- Décision et exécution manuelle dans Sigma
- Tracking manuel des trades

---

## 🧠 Compréhension de Sigma Bot

### Ce qu'est Sigma
- **Bot Telegram de trading crypto multi-chain** (sigma.win)
- Supporte : Ethereum, Avalanche, BNB Chain, Base Chain, Blast, Solana
- Fonctionnalités : token sniping, copy trading, portfolio multi-wallets, stop-loss/take-profit automatiques, protection MEV/anti-rug
- Frais : **1% par transaction**
- Pas d'API publique → non-programmable directement

### Procédure achat + SL dans Sigma (documentée — validée en pratique le 21 mai)
1. Ouvrir le token dans Sigma (coller l'adresse ou chercher via Search)
2. Cliquer **"Buy X SOL"** → entrer le montant en SOL
3. Après confirmation de transaction → **"Positions"** dans le menu principal
4. Cliquer sur le token dans la liste → **"Limit Order"**
5. Cliquer **"Stop Loss 🔴"** pour activer → bouton devient vert avec valeur par défaut (-10%)
6. Cliquer sur le bouton **"-10% 🟢"** → entrer la valeur souhaitée (ex: 30 pour -30%)
7. ⚠️ **Limitation importante** : Sigma ne permet PAS de configurer SL et TP simultanément — choisir l'un ou l'autre
8. Pour vérifier la position : **"Positions"** → cliquer sur le lien du token (en bleu)

### Boutons de l'interface Sigma (monitor de position)
- **10% / 50% / 100%** : vente rapide d'un pourcentage de la position
- **Stop Loss** : ordre de vente automatique si le prix descend sous un seuil
- **Take Profit** : ordre de vente automatique si le prix monte au-dessus d'un seuil
- **Trailing Stop Loss** : SL dynamique qui suit le prix à la hausse (ex: -30% du plus haut atteint)
- **Limit Order** : accès au menu SL/TP complet
- **PnL Card** : génère une image de partage avec PnL (pour les réseaux sociaux)
- **"Pending Orders"** du menu principal : n'affiche PAS les SL/TP Sigma — ceux-ci sont gérés en interne

### Trouver le prix d'achat exact
- Dans le monitor de position : "Cost: X SOL" et "Avg MC: $Y" — pas le prix unitaire direct
- Via **DexScreener** : onglet "Trades" → filtrer par adresse wallet → transaction exacte avec prix unitaire
- Via **Solscan** (solscan.io) → adresse wallet → onglet "DeFi Activities"

### Chat ID Telegram — clarification importante
- Le Chat ID (`951378855`) est **l'ID personnel de Cédric**, pas un ID de bot
- Peu importe quel bot envoie un message en conversation privée, le Chat ID est toujours `951378855`
- Pour séparer les bots visuellement dans Telegram : utiliser **des bots différents** (chaque bot a sa propre conversation privée)
- `/start` doit être envoyé à chaque nouveau bot pour activer la conversation

### Décision de Cédric
- Profil : prudent, buy-and-hold habituellement (Swissquote)
- Capital de test : **100-200 CHF** (acceptation de perte totale)
- Objectif : **apprentissage et validation de concept**, pas génération de revenu immédiate
- Choix retenu : **trading manuel avec ordres automatisés + copy trading sur Solana**
- 100 CHF déjà engagés en Copy Trading Binance (test réel le 18 mai 2026)
- **Premier trade Sigma réel** : BULL, 0.22 SOL (~$30), SL -30%, le 21 mai 2026 à 23h00

---

## 📈 Stratégie de trading retenue (inchangée)

### Capital et chain
- 150 CHF max sur **Solana** (frais bas, viable avec petit capital)
- Wallet Sigma dédié, séparé du MetaMask principal

### Critères de sélection de wallets à copier (GMGN.ai)
- Winrate > 60% sur 30 jours
- PnL positif sur 90 jours
- 5-20 trades/jour
- Hold time moyen > 2h
- Taille position $500-$5000

### Stratégie de sortie (validée)
- 🛑 Stop Loss : **-30%** du prix d'entrée
- 🎯 TP1 : **+100%** → vendre 50% (récupération du capital)
- 🎯 TP2 : **+250%** → vendre 30%
- 🌙 Moonbag : **20% restants**, pas de TP

### 5 règles inviolables
1. Configurer TP/SL **AVANT** d'entrer en position
2. Ne JAMAIS déplacer un SL vers le bas
3. Le moonbag est sacré (xN ou zéro)
4. Pas de FOMO de sortie après TP atteint
5. Track chaque trade (Google Sheet)

### Critères de sélection d'un token avant achat
- Liquidité actuelle > 20k$ (vérifier Liq Live dashboard)
- MCap/Liq ratio sain (> 3x minimum)
- Pas de chart pump/dump visible (vérifier DexScreener manuellement)
- Token présent dans plusieurs scans consécutifs (signe de stabilité)
- ⚠️ v3.0 : Note Live recalculée intègre les règles dump/pump/momentum — toujours vérifier DexScreener avant d'acheter

---

## 🏗️ Infrastructure technique — en production

### Stack finale
| Composant | Service | Statut |
|---|---|---|
| Hébergement | **Railway** (compte bliss46's, plan Hobby) | ✅ |
| Orchestration | **n8n self-hosted** | ✅ |
| Base de données | **PostgreSQL** | ✅ |
| LLM | **Anthropic Claude API** (Haiku 4.5) | ✅ |
| Notifications | **Telegram bot** | ✅ |
| Logging signaux | **Google Sheets** | ✅ |
| Dashboard | **Vercel** (sigma-signals-dashboard) | ✅ v3.1 |

### Détails de déploiement

**Railway**
- Projet : `sigma-signals`
- Project ID : `3d7ea4a0-6ff2-4c47-80e1-fa833357622e`
- Service n8n ID : `ab87c0dd-fcb0-49b4-8685-c14e7b58925b`
- Environment ID : `c21b59a0-3d2c-4bf2-9ada-e6f646c785b3`
- Services : n8n + Postgres avec volumes persistants
- Coût estimé : 5-10 $/mois
- ✅ `N8N_ENCRYPTION_KEY` **fixée dans les variables Railway** (19 mai 2026) — valeur : `a7f3d2e8b4c6f1a9e5d3b7c2f8a4d6e1b3c5f7a9d2e4b6c8f1a3d5e7b9c4f6a2`
- ⚠️ Tout ajout/modification de variable Railway provoque un redémarrage de n8n — si N8N_ENCRYPTION_KEY est fixée, les credentials survivent ; sinon ils sont corrompus

**n8n**
- URL : `https://n8n-production-05f0.up.railway.app`
- Compte admin : `ced.baumgarten@gmail.com`
- Volume persistant `n8n-volume` monté sur `/home/node/.n8n`
- Version : **2.20.11**
- ⚠️ API REST n8n disponible sur `/api/v1/` — nécessite un API Key (créer dans Settings → n8n API)
- ⚠️ La clé JWT de l'API REST disparaît de la mémoire JS à chaque navigation de page

**Anthropic**
- Compte sur platform.claude.com (`c_baumgarten@bluewin.ch`)
- Clé API active : `sigma-signals-n8n` (commence par `sk-ant-api03-xw3vDB...`)
- Modèle utilisé : `claude-haiku-4-5-20251001`
- Coût observé : ~$0.002 par message
- ⚠️ Dans le node "Analyze with Claude", le modèle est configuré **By ID** (Fixed) = `claude-haiku-4-5-20251001`

**Telegram**
- Bot Sigma Signals : `@sigma_signals_bliss46_bot`
  - Token : `8660387421:AAH21rVkK1NVBJRGvQB9FRXZNUgCMyuVX1s`
  - Utilisé par : workflows 02, C1, D1, G1
- Bot Binance Copy Trading : `@binance_copy_trading_bliss46_bot`
  - Token : `8944151265:AAHeuedV7coBfDkSdx1qPF8IkmvMPKLBu6A`
  - Credential n8n : "Telegram Binance Bot" (ID : `xcWLpaoICYb3QHpy`)
  - Utilisé par : workflow B1 uniquement
- Chat ID personnel : `951378855`

**Postgres (credentials n8n)**
- Credential n8n : "Postgres account" (ID : `i2VcDfXS1p9Y6rtT`)
- Host : `postgres.railway.internal` (réseau interne Railway — IMPORTANT)
- Port : `5432` / Database : `railway` / User : `postgres`
- Password : `HsibLWPxBPHUdsNwpoLqoZyAfvWCgGwu`

**Tables Postgres en production**
- `seen_tokens` : déduplication 24h pour workflow 02
- `seen_tokens_c1` : déduplication 2h pour workflow C1
- `seen_tokens_d1` : déduplication 2h pour workflow D1
- `pending_checks` : suivi TP/SL des TOP PICK (alimentée automatiquement par 02/C1/D1)
- `binance_balance_logs` : historique soldes USDT Binance
- `birdeye_quota` : circuit breaker Birdeye (date DATE PRIMARY KEY, call_count INTEGER) — seuil 500/jour
- `prelaunch_cache` : cache des paires Early <30min alimenté par E1 toutes les 5min

**Google Sheets (logging signaux)**
- Sheet : "Sigma Signals — Trade Log"
- URL : `https://docs.google.com/spreadsheets/d/1LGMojKgGIEGsMDkkHx69GPFY_88UTHJKE6vB5XST3xk/edit`
- **14 colonnes** : `timestamp`(A), `symbol`(B), `name`(C), `address`(D), `note_claude`(E), `is_top_pick`(F), `price_usd`(G), `change_24h`(H), `dex_url`(I), `buy_ratio`(J), `vol_liq`(K), `age_minutes`(L), `source`(M), `buy_pressure_be`(N)
- Credential n8n : "Google Sheets account" (ID : `BLwXHsmEKLO6nD75`)
- ✅ **"Publier sur le Web"** activé (obligatoire pour API gviz depuis Vercel)

**Credentials n8n — IDs de référence**
- Telegram account (Sigma Signals) : `0HQU71exzHJcR8Nq`
- Telegram Binance Bot : `xcWLpaoICYb3QHpy`
- Anthropic account : `2VtrrzR74KNQY9oc`
- Google Sheets account : `BLwXHsmEKLO6nD75`
- Postgres account : `i2VcDfXS1p9Y6rtT`

**Binance (workflow B1)**
- Clé API active : `5kSvgrdNmyufyxhf0T0tGzmdVqHjgG91Z7SpZS9RMwmiND0s3WU1vs1NJekJOG0S`
- Clé secrète : `GyqXnUg7vd2vvFxFiN1lOSW6yfc4KoRrbmtfC3SEmX4A5h8UxuKy8jpkprfvBJVV`

**Dashboard Vercel — v3.1** 🆕
- URL live : `https://sigma-signals-dashboard.vercel.app`
- Repo GitHub : `github.com/bliss46/sigma-signals-dashboard` (public)
- Projet Vercel : `prj_D0z1kDLUj438HvVTi2LcTkzkZAK2`, team `team_5mp46qxS8H1vJoliKx6HciIN`
- Fichier principal : `index.html` (ES5 pur, pas de framework)
- Déploiement : automatique sur push `main` via intégration GitHub
- Token GitHub : `ghp_REDACTED_RENOUVELER_AVANT_18_JUIN_2026` (**expire le 18 juin 2026 ← URGENT**)
- **3 onglets** :
  - **📊 Signaux** : tableau principal, 100 tokens uniques, Note Live recalculée, filtres, décisions ⚡/👁/Passer, colonne BP% (Birdeye buy pressure, vert/orange/rouge)
  - **🎯 G1 Tracker** : connecté au webhook n8n `/webhook/g1-data` — toggle "Masquer expirés" (actif par défaut), stats excluent les EXPIRED, affichage "N entrées — M expirés cachés"
  - **🌱 Early (<30min)** : connecté au webhook n8n `/webhook/prelaunch-data` — paires Solana < 30min, liq ≥ 5k$, fraîcheur visuelle, buy ratio, vol 5min, DEX badge

### Logique Note Live — calcNoteLive() dans dashboard v3.0+
Base = note_claude originale (qualité au moment du scan), puis ajustements selon métriques live :
- `ch24h > 200% ET ch1h < -20%` → note max 3, badge **DUMP POST-PUMP**
- `ch1h < -30%` → -2 pts, badge **MOMENTUM NEG**
- `ch1h entre -20% et -30%` → -1 pt, badge **EN BAISSE**
- `ch24h > 500%` → -3 pts, note max 5, badge **PUMP AVANCÉ**
- `ch24h > 300%` → -2 pts, badge **PUMP**
- `ch1h > 50%` → note max 7, badge **PUMP 1H**
- `liq < 8000$` → -2 pts
- `be_buy_pressure < 40%` → -1 pt (si disponible dans signal)
- `be_buy_pressure > 65%` → +1 pt
- Clamp final : 0-10

---

## 🔄 Pipeline en production — Architecture

### Workflow 02 — DexScreener Trending Scanner (2h)
**ID** : `X5WGSoosu03wrbMx`

```
[Schedule Trigger 2h] / [Manual Trigger]
        ↓
Get trending boosts (DexScreener /token-boosts/top/v1 → 30 items)
        ↓
Prepare batch addresses (Code JS → batch CSV)
        ↓
Enrich token metrics (HTTP batch DexScreener /tokens/v1/solana/{csv})
        ↓
Filter top candidates (Code JS → filtre liq/vol/âge)
        ↓
Execute a SQL query (Postgres SELECT seen_tokens 24h → dédup)
        ↓
Code in JavaScript1 (filtre déjà vus)
        ↓
IF skipped (0 candidats ?)
   TRUE → Send skipped notif (Telegram)
   FALSE ↓
        ↓
HTTP Request GoPlus Security
        ↓
Code in JavaScript (enrich flags sécurité)
        ↓
Check Birdeye quota (Postgres SELECT birdeye_quota)
        ↓
IF Birdeye quota ok
   FALSE (quota dépassé) → merge direct vers Claude
   TRUE ↓
        ↓
Expand candidates (1 item par candidat)
HTTP Request Birdeye (batching 1 req/1.2s)
Enrich Birdeye data (merge be_buy_pressure + be_unique_wallets)
Increment Birdeye quota (Postgres UPDATE)
        ↓ (merge des deux branches)
Analyze with Claude (Haiku, prompt v2.8)
⚠️ prompt utilise : $('Enrich Birdeye data').first().json.candidates
        ↓
Send a text message (Telegram)    Code in JavaScript2 (parse <json> Claude)
Execute a SQL query1 (INSERT seen_tokens)    ↓
                              Append row in sheet (Google Sheets)
                              Insert pending checks (Postgres — TOP PICK seulement)
```

**⚠️ PIÈGE CRITIQUE** : Le prompt de `Analyze with Claude` doit utiliser `$('Enrich Birdeye data').first().json.candidates` et NON `$json.candidates`. Le node est connecté à `Increment Birdeye quota` (Postgres) qui ne retourne pas de candidates → $json.candidates serait vide → Claude répond "aucun token fourni" → pas de `<json>` → Code in JavaScript2 retourne ok(0) → Append row + Insert pending ne s'exécutent pas.

### Workflow C1 — Pump Alert 15min
**ID** : `teWXwlt33Iv0SI4d`

Même architecture que 02 avec différences :
- Seuil : variation **1h ≥ +20%** (pas 24h)
- Liquidité min : 15k$ / Volume min : 5k$ 1h / Âge : 0.5h–72h
- Déduplication : **2h** (`seen_tokens_c1`)
- Silence si rien détecté (pas de message Telegram)
- Pending checks horizon : **4h**
- Prompt ref : `$('Enrich Birdeye data').first().json.candidates`

### Workflow D1 — Early Pairs Scanner 5min
**ID** : `u5VGZgEuXP2kmnTX`

- Seuil : **âge < 3h** (pairs récentes DexScreener /latest/dex/search)
- Liquidité min : 8k$ / Critère tri : buyRatio
- Déduplication : **2h** (`seen_tokens_d1`)
- Alerte Telegram : **TOP PICK uniquement**
- Pending checks horizon : **2h**
- ⚠️ Prompt ref : `$('Enrich security D1').first().json.candidates` (pré-existant avant Birdeye)

### Workflow B1 — Binance Balance Tracker (30min)
**ID** : `REIu6NbBIOuBMzjN`
- Bot séparé `@binance_copy_trading_bliss46_bot`
- Alerte seulement si variation solde ≥ 0.01 USDT
- Endpoint : `GET /api/v3/account` + HMAC-SHA256
- Table : `binance_balance_logs`

### Workflow G1 — Price Tracker / TP-SL Monitor (1h)
**ID** : `rqw0acOpxTmYB7wE`
- Table `pending_checks` alimentée auto par 02/C1/D1 (TOP PICK uniquement)
- Seuils : SL ≤ -30% / TP1 ≥ +100% / TP2 ≥ +250%
- Horizon : 24h (02) / 4h (C1) / 2h (D1)
- **Branche webhook** (ajoutée 25 mai) : `Webhook GET g1` → `Read all pending checks` → `Enrich with live prices` → `Respond G1`
  - URL webhook : `https://n8n-production-05f0.up.railway.app/webhook/g1-data`
  - Retourne : `{ checks: [...], count: N, fetched_at: "..." }`
  - Champs par check : `id, symbol, address, signal_price, signal_at, horizon, checked, outcome, current_price, change_pct, liq_usd, ch1h, outcome_live`
  - Logique expiration : si `signal_at + horizon > now` → `outcome_live = 'EXPIRED'` (même sans prix actuel)

### Workflow E1 — Early Pairs Proxy DexScreener <30min (5min) 🆕
**ID** : `EJYdWQvX6F7R3uGc`

Architecture :
```
[Schedule Trigger 5min] / [Manual Trigger]
        ↓
Fetch DexScreener latest (GET /token-profiles/latest/v1)
        ↓
Process and filter (Code JS — $helpers.httpRequest batch /tokens/v1/solana/
  → filtre chainId=solana, âge <30min, liq ≥ 5k$
  → calcule buy_ratio depuis txns.m5/h1)
        ↓
Upsert to Postgres (prelaunch_cache — INSERT, DELETE vieux >10min)

[Webhook GET prelaunch] → [Read from Postgres] → [Respond to Webhook]
  URL : https://n8n-production-05f0.up.railway.app/webhook/prelaunch-data
  Retourne : { coins: [...], count: N, fetched_at: "..." }
  Champs par coin : address, symbol, name, age_minutes, liq_usd, buy_ratio,
    price_usd, change_1h, change_24h, mcap_usd, volume_5m, buys_5m, sells_5m, dex, dex_url
```

**Notes importantes E1** :
- `frontend-api.pump.fun` est mort (NXDOMAIN depuis mi-2025) — pump.fun a fermé toute API publique
- `advanced-api.pump.fun` bloqué CORS browser + inaccessible depuis Railway
- Solution retenue : DexScreener `/token-profiles/latest/v1` → batch `/tokens/v1/solana/` → filtre <30min
- L'endpoint `token-profiles/latest` ne retourne pas toujours des paires Solana <30min → count peut être 0

---

## 📝 Prompts Claude — référence v2.8

### Prompt système (commun 02/C1/D1)
```
Tu es un analyste expert en tokens Solana. Tu dois analyser des tokens candidats et retourner une note et une décision structurée.

RÈGLES DE SCORING (note de 0 à 10) :
- Buy Ratio > 65% : +2 pts
- Buy Ratio 50-65% : +1 pt
- Buy Ratio < 40% : -2 pts
- Vol/Liq > 3 : +2 pts
- Vol/Liq 1-3 : +1 pt
- Vol/Liq < 0.5 : -2 pts
- Âge 30-90min : +2 pts (fenêtre idéale)
- Âge < 30min : +1 pt (très early, risqué)
- Âge 90min-6h : 0 pt
- Âge > 6h : -1 pt

RÈGLES DE SÉCURITÉ (pénalités) :
- is_honeypot = 1 : note = 0 (REJETER)
- cannot_sell_all = 1 : note = 0 (REJETER)
- is_mintable = 1 : -2 pts
- freeze_authority = 1 : -1 pt

RÈGLES DUMP POST-PUMP (pénalités) :
- change_24h > 200% ET change_1h < -20% : note MAX 3 (dump post-pump détecté)
- change_24h > 300% : -2 pts (pump avancé)
- change_24h > 500% : -3 pts, note MAX 5 (pump très avancé)

RÈGLES BIRDEYE (si disponible) :
- be_buy_pressure > 65% : +1 pt (forte pression acheteuse en volume $)
- be_buy_pressure 40-65% : 0 pt
- be_buy_pressure < 40% : -1 pt (pression vendeuse dominante)
- be_unique_wallets > 200 : +1 pt (diversification wallets)
- be_unique_wallets < 50 : -1 pt (concentration)

TOP PICK : note ≥ 7 ET buy_ratio > 60% ET vol_liq > 1 ET liquidité > 20k$

IMPORTANT : Clamp la note finale entre 0 et 10. Ne jamais retourner une note > 10 ou < 0.
```

### Prompt utilisateur (message, partie tokens)
```
TOKENS À ANALYSER :
{{ JSON.stringify($('Enrich Birdeye data').first().json.candidates, null, 2) }}

---
INSTRUCTIONS :

**PARTIE 1 — JSON structuré (OBLIGATOIRE, en tout premier)**
Retourne d'abord un bloc JSON entre balises <json> et </json> exactement comme ceci :
<json>
[
  {
    "symbol": "TOKEN",
    "note": 7,
    "is_top_pick": "OUI",
    "raison_courte": "Buy ratio 68%, Vol/Liq 2.3x, âge 45min"
  }
]
</json>

**PARTIE 2 — Message Telegram formaté**
Ensuite, rédige le message Telegram (markdown) :
- Top 3 tokens maximum
- Format : [NOTE/10] **SYMBOL** — raison courte
- Si is_top_pick = OUI : ajouter ⭐ TOP PICK
- Si aucun token intéressant (note < 5) : message court "Rien d'intéressant ce scan"
```

### Regex de nettoyage (node Telegram — triple regex)
```javascript
{{ $json.content[0].text
   .replace(/```json[\s\S]*?```/g, '')
   .replace(/\n?<json>[\s\S]*?<\/json>\n?/g, '')
   .replace(/\n{3,}/g, '\n\n')
   .trim() }}
```
Cette regex supprime : les blocs ```json...``` (Haiku non-déterministe), les blocs `<json>...</json>`, les lignes vides en excès. À appliquer sur **tous les nodes Telegram send** des 3 workflows.

---

## 💰 Budget réel observé

| Poste | Coût mensuel |
|---|---|
| Railway (n8n + Postgres) | ~5-10 $ |
| Claude API — Workflow 02 | ~0.5-2 $ |
| Claude API — Workflow C1 | ~2-4 $ |
| Claude API — Workflow D1 | ~1-3 $ |
| DexScreener API | 0 $ (free) |
| GoPlus Security API | 0 $ (free) |
| Birdeye BDS free tier | 0 $ (30k CU/mois) |
| Telegram bot | 0 $ |
| Vercel (dashboard) | 0 $ (plan Hobby) |
| **Total estimé** | **~9-19 $/mois** ✅ |

---

## ✅ Workflows en production

| Workflow | URL | Statut | Version | Schedule |
|---|---|---|---|---|
| 01 - Hello World Test | `/workflow/sSrSt4Xw2ImFfPYd` | archivable | — | — |
| 02 - DexScreener Trending Scanner | `/workflow/X5WGSoosu03wrbMx` | ✅ Active | v2.8 | 2h |
| C1 - Pump Alert 15min | `/workflow/teWXwlt33Iv0SI4d` | ✅ Active | v2.8 | 15min |
| D1 - Early Pairs Scanner | `/workflow/u5VGZgEuXP2kmnTX` | ✅ Active | v2.8 | 5min |
| B1 - Binance Balance Tracker | `/workflow/REIu6NbBIOuBMzjN` | ✅ Active | v2.5 | 30min |
| G1 - Price Tracker / TP-SL Monitor | `/workflow/rqw0acOpxTmYB7wE` | ✅ Active | v3.1 | 1h |
| E1 - Early Pairs Proxy (DexScreener <30min) | `/workflow/EJYdWQvX6F7R3uGc` | ✅ Active | v1.1 | 5min |

---

## 🚧 Pièges techniques — référence complète

1. **n8n Anthropic node standalone** : utiliser `@n8n/n8n-nodes-langchain.anthropic` avec `typeVersion: 1`. `lmChatAnthropic` échoue hors chaîne LangChain.

2. **n8n workflow PUT** : le body ne doit contenir que `name`, `nodes`, `connections`, `settings: {executionOrder:'v1'}`. Tout champ supplémentaire cause une erreur de validation 400.

3. **IF branch true silencieux** : pour terminer la branche true d'un IF sans action, utiliser `connections['IF skipped'] = { main: [[], [{ node: 'NextFalseNode', type: 'main', index: 0 }]] }`. Un tableau vide `[]` en index 0 = branche true vide = terminaison silencieuse.

4. **CodeMirror expression fields n8n** : les champs d'expression n8n utilisent CodeMirror. Édition via Chrome MCP : `execCommand('selectAll')` puis `execCommand('insertText', false, newValue)`. Le copier-coller standard est peu fiable.

5. **JWT n8n dans Chrome MCP** : la clé API REST n8n disparaît de la mémoire JS à chaque navigation de page. Solution : tout faire dans un seul bloc `async function(){}` sans navigation intermédiaire. Stocker la clé dans `window._k` et lire les valeurs via `document.title = 'PREFIX:' + value` + zoom sur la barre de titre.

6. **n8n Publish vs Save** : après modification d'un workflow dans l'UI, `Cmd+S` sauvegarde mais ne déploie pas. Il faut aussi cliquer le bouton orange **"Publish"** pour que les changements soient actifs en production.

7. **Haiku non-déterministe** : Claude Haiku peut retourner le JSON dans des blocs ```json...``` (markdown) ou `<json>...</json>` (XML) de façon non-déterministe. Solution : triple-regex sur tous les nodes Telegram (voir section Prompts).

8. **Google Sheets Map Automatically** : dans le node Sheets "Append row", l'option "Map Automatically" mappe les champs par nom de colonne. Si un header est vide ou mal orthographié, la donnée atterrit dans la mauvaise colonne ou est ignorée. Toujours vérifier que les headers du Sheet correspondent exactement aux clés retournées.

9. **DexScreener priceUsd null** : sur les paires très récentes (< 30min), `priceUsd` peut être `null`. Fallback : `priceUsd || priceNative`. Après quelques minutes, priceUsd se remplit.

10. **Postgres railway.internal** : l'host interne `postgres.railway.internal` n'est accessible que depuis les services Railway du même projet. Depuis l'extérieur (Postman, psql local), utiliser le host public Railway.

11. **N8N_ENCRYPTION_KEY** : cette variable chiffre les credentials n8n. Si elle change (ou si un redémarrage Railway régénère un UUID aléatoire), tous les credentials deviennent illisibles (erreur "could not decrypt"). Solution définitive : fixer la valeur dans les variables Railway. Si elle change → recréer tous les credentials à la main.

12. **Railway redémarrage** : tout ajout ou modification de variable d'environnement Railway provoque un redémarrage du service n8n. Planifier les modifications de variables en dehors des heures de trading actif.

13. **Sigma wallet Solana vs EVM** : le wallet Solana Sigma produit des adresses **base58** (44 chars, lettres+chiffres sans 0/O/I/l). Une adresse `0x...` indique une configuration EVM (AVAX, ETH, etc.). Toujours vérifier le format avant d'envoyer des fonds.

14. **DexScreener batch limit** : l'endpoint `/tokens/v1/solana/{csv}` accepte max **30 adresses** par requête. Pour 50+ tokens : 2 appels séquentiels ou parallèles.

15. **GoPlus résultat null** : les tokens < 48h ne sont souvent pas indexés par GoPlus → `result: {}` ou `result: null`. Comportement normal, ne pas bloquer le pipeline.

16. **Telegram markdown** : n8n envoie en mode Markdown v1 par défaut. Les caractères spéciaux (`_`, `*`, `` ` ``, `[`) doivent être échappés ou évités dans les messages générés par Claude. Haiku génère parfois des étoiles `**bold**` non supportées → la regex de nettoyage aide mais ne suffit pas toujours.

17. **Google Sheet "Publier sur le Web"** : l'API gviz utilisée par le dashboard Vercel nécessite que le sheet soit publié (Fichier → Partager → Publier sur le Web → "Feuille entière" → CSV ou JSON). Sans ça, les requêtes gviz retournent 401.

18. **n8n Code node ES5** : les Code nodes n8n utilisent Node.js mais n8n < 1.x peut bloquer certains ES6+. Utiliser `var` au lieu de `const/let`, éviter les arrow functions dans les boucles critiques si comportement bizarre.

19. **Birdeye sandbox n8n bloqué** : dans n8n, le node Code/Function ne peut pas faire de `fetch()` vers des API externes (sandbox réseau). Il faut utiliser le node **HTTP Request** natif n8n. Les nodes Birdeye sont donc des HTTP Request avec header `X-API-KEY`.

20. **Birdeye rate limit 1 req/sec** : le plan Standard Birdeye (free) est limité à 1 requête/seconde. Pour plusieurs tokens, utiliser un node "Loop Over Items" avec un `wait(1200ms)` entre chaque appel, ou un batch avec délai.

21. **Vercel CORS** : le dashboard Vercel appelle DexScreener depuis le navigateur. DexScreener autorise les requêtes CORS depuis n'importe quelle origine → pas de proxy nécessaire.

22. **Postgres pending_checks structure réelle** (structure effective en production — différente du schéma initial) :
```sql
CREATE TABLE IF NOT EXISTS pending_checks (
  id SERIAL PRIMARY KEY,
  address TEXT NOT NULL,
  symbol TEXT,
  signal_price NUMERIC,
  signal_at TIMESTAMPTZ DEFAULT NOW(),
  check_at TIMESTAMPTZ,
  horizon TEXT,  -- ⚠️ stocké comme "24h", "4h", "2h" (string) pas integer
  checked BOOLEAN DEFAULT FALSE,
  price_at_check NUMERIC,
  pct_change NUMERIC,
  outcome TEXT,
  source TEXT,
  note_claude INTEGER,
  dex_url TEXT
);
```
⚠️ Le champ `horizon` est un **string** ("24h", "4h", "2h"), pas un integer. Parser avec `parseFloat(c.horizon)` pour obtenir le nombre d'heures.

23. **Regex triple Telegram** : la regex s'applique sur `$json.content[0].text` (output du node Anthropic). L'ordre des trois `.replace()` est important : d'abord les blocs markdown, puis les balises XML, puis les lignes vides.

24. **n8n Webhook vs Schedule** : pour les workflows récurrents, le Schedule Trigger est préférable au Webhook (pas besoin de garder une connexion ouverte). Le Webhook est utile pour les triggers externes (ex: signal entrant d'un autre service).

25. **Google Sheets gviz query** : l'URL `https://docs.google.com/spreadsheets/d/{ID}/gviz/tq?tqx=out:json` retourne un JSON enveloppé dans `google.visualization.Query.setResponse(...)`. Il faut extraire le JSON avec `slice(indexOf('(')+1, -2)`.

26. **DexScreener /latest/dex/search** : cet endpoint cherche des paires par symbole ou adresse. Pour D1 (early pairs), utiliser `?q=solana` pour obtenir les paires Solana les plus récentes. Le résultat inclut `pairCreatedAt` (timestamp unix ms).

27. **Clamp note Claude** : Haiku peut halluciner des valeurs numériques aberrantes (note = 15, note = -3). Toujours clamper avec `Math.min(10, Math.max(0, parseFloat(note)))` dans le Code node qui parse le JSON Claude.

28. **Déduplication window** : `seen_tokens` garde les tokens pendant 24h. `seen_tokens_c1` et `seen_tokens_d1` pendant 2h. La query de dédup est `SELECT address FROM seen_tokens WHERE address = ANY($1) AND inserted_at > NOW() - INTERVAL '24 hours'`.

29. **n8n Split In Batches** : pour batcher les requêtes HTTP, utiliser le node "Split In Batches" avec `batchSize: 1` + Loop. Alternativement, construire le batch en Code JS et faire un seul appel HTTP avec CSV d'adresses.

30. **Railway volume persistant** : le volume `n8n-volume` monte `/home/node/.n8n` persistant. Les workflows, credentials et executions sont stockés là. Sans ce volume, un redémarrage repart de zéro.

31. **Anthropic overloaded** : l'API Anthropic peut retourner `{"type":"error","error":{"type":"overloaded_error","message":"Overloaded"}}` en cas de surcharge. Le workflow 02 a eu des erreurs à 06h et 08h le 22 mai pour cette raison. Les workflows ont repris automatiquement au cycle suivant.

32. **n8n IF node branches** : le node IF a deux sorties : index 0 = TRUE, index 1 = FALSE. Dans les connexions JSON, `main[0]` = branche TRUE, `main[1]` = branche FALSE.

33. **Google Sheets append vs update** : le node "Append Row" ajoute toujours une nouvelle ligne. Pour mettre à jour une ligne existante, utiliser "Update Row" avec une query de recherche. Le dashboard lit toutes les lignes → les doublons sont filtrés par dédup JS côté dashboard.

34. **DexScreener boosts vs trending** : `/token-boosts/top/v1` retourne les tokens qui ont acheté des "boosts" (publicité payante sur DexScreener). Ce n'est pas forcément un signal de qualité — juste d'activité marketing. Utiliser comme signal de découverte, pas de confiance.

35. **Telegram bot token** : le token du bot (`8660387421:AAH21rVkK1NVBJRGvQB9FRXZNUgCMyuVX1s`) est différent du chat ID (`951378855`). Le token identifie le bot, le chat ID identifie le destinataire.

36. **n8n Manual Trigger** : le node "When clicking Execute workflow" permet d'exécuter un workflow manuellement depuis l'UI. Utile pour les tests. Il coexiste avec le Schedule Trigger — les deux peuvent déclencher le même workflow.

37. **GoPlus batch** : GoPlus accepte plusieurs adresses dans un seul appel via `contract_addresses=addr1,addr2,...`. Pas de limite documentée mais ~50 max recommandé.

38. **Birdeye CU (Compute Units)** : chaque appel à l'API Birdeye consomme des CU. Le plan gratuit donne 30 000 CU/mois. Un appel `/defi/token_overview` consomme ~10-50 CU selon la réponse. Avec 500 appels/jour limité → ~15 000 appels/mois → budget CU OK.

39. **n8n expressions dans les headers HTTP** : les headers d'un node HTTP Request peuvent utiliser des expressions n8n (`{{ $json.field }}`). Utile pour passer dynamiquement une adresse de token dans l'URL Birdeye.

40. **PostgreSQL INSERT ON CONFLICT** : pour éviter les doublons dans `seen_tokens`, utiliser `INSERT INTO seen_tokens (address, inserted_at) VALUES ($1, NOW()) ON CONFLICT (address) DO NOTHING` (si contrainte UNIQUE sur address).

41. **n8n Loop Over Items** : pour itérer sur chaque item d'un array et faire une requête par item, utiliser le node "Loop Over Items" (anciennement "SplitInBatches" avec batchSize=1). Le node retourne les items un par un dans une boucle.

42. **Dashboard gviz parsing** : les colonnes du Sheet sont mappées dans l'ordre des headers. Si un header est renommé dans le Sheet, le dashboard affiche les données dans la mauvaise colonne. L'ordre des colonnes dans gviz correspond à l'ordre physique des colonnes du Sheet.

43. **n8n Code node scope** : dans un Code node, `$input.all()` retourne tous les items de l'input. `$input.first()` retourne le premier. `$('NodeName').first()` accède aux outputs d'un node précédent par nom. Cette syntaxe fonctionne en mode "Run Once for All Items".

44. **Vercel deploy automatique** : tout push sur la branche `main` du repo GitHub déclenche automatiquement un nouveau déploiement Vercel. Le déploiement prend ~20-30 secondes. Vercel garde un historique des déploiements précédents (rollback possible).

45. **n8n Credentials dans les nodes** : les credentials n8n sont référencés par leur ID (ex: `0HQU71exzHJcR8Nq`). Si un credential est recréé, son ID change → tous les nodes qui l'utilisent doivent être mis à jour. Préférer mettre à jour un credential existant plutôt d'en créer un nouveau.

46. **DexScreener paire vs token** : l'endpoint `/tokens/v1/solana/{address}` retourne la paire principale du token sur Solana. Si le token a plusieurs paires (ex: Raydium + PumpSwap), l'API retourne celle avec la plus grande liquidité. Le champ `pairAddress` est l'adresse de la pool, pas du token.

47. **Sigma SL ≠ DexScreener SL** : le Stop Loss Sigma est basé sur le prix de marché actuel de la paire, pas sur le prix DexScreener. Pour les memecoins à faible liquidité, le prix Sigma peut différer légèrement du prix DexScreener à cause du slippage.

48. **n8n HTTP Request timeout** : par défaut, les nodes HTTP Request n8n ont un timeout de 300 secondes. Pour les APIs lentes, augmenter dans les options avancées. Pour Birdeye/DexScreener, le timeout par défaut est largement suffisant.

49. **Google Sheets quota** : l'API Google Sheets (via n8n) est limitée à ~100 requêtes par 100 secondes. Avec 3 workflows qui loggent, pas de problème. Si le workflow C1 (15min) devient très fréquent, surveiller les erreurs 429.

50. **Vercel environment variables** : le dashboard est un fichier HTML statique sans build — pas de variables d'environnement côté serveur. Les constantes (Sheet ID, etc.) sont directement dans le code HTML. Pour des secrets, utiliser un proxy n8n ou une Vercel Function.

51. **n8n Set node** : le node "Set" (Edit Fields) permet de définir, renommer ou supprimer des champs d'un item. Utile pour nettoyer les données avant de les passer au node suivant. En mode "Keep Only Set", les autres champs sont supprimés.

52. **Postgres railway.internal DNS** : le DNS `postgres.railway.internal` ne résout que depuis le réseau privé Railway. Si n8n et Postgres sont dans le même projet Railway, ça fonctionne. Si déplacés dans des projets différents, utiliser le host public TCP.

53. **n8n JSON parse erreurs** : si Claude retourne un JSON malformé (virgule en trop, guillemets manquants), `JSON.parse()` lève une exception qui fait échouer le workflow. Solution : wrapper dans `try/catch` et retourner un objet vide `[]` en cas d'erreur.

54. **Sigma slippage** : Sigma applique un slippage par défaut de 5-15% pour les memecoins à faible liquidité. Sur un achat de 0.22 SOL, le slippage peut faire varier le prix réel d'entrée de ±5%. Tenir compte dans le calcul du SL (-30% du prix réel, pas du prix affiché).

55. **n8n workflow activation** : un workflow doit être "Active" (toggle vert en haut à droite) pour que le Schedule Trigger s'exécute automatiquement. "Published" signifie que la version actuelle est la version de production (distincte de la version "Draft" en cours d'édition).

56. **DexScreener headers** : l'API DexScreener ne requiert pas d'authentification. Mais elle peut retourner des erreurs 429 en cas d'abus. Les appels sont limités à ~300 req/min. Avec 3 workflows qui appellent ~30 adresses toutes les 5-15min, on est largement dans les limites.

57. **n8n Code node items** : chaque item dans n8n a une propriété `json` (objet) et optionnellement `binary`. `$input.all()` retourne `[{json: {...}}, ...]`. Pour accéder aux données : `$input.all()[0].json.field` ou `items[0].json.field` dans un Code node.

58. **Birdeye be_buy_pressure interprétation** : `be_buy_pressure` est le ratio `vBuy24h$ / (vBuy24h$ + vSell24h$)` en volume dollar. Un ratio > 65% signifie que les acheteurs dominent en valeur. Attention : ça reflète le volume des dernières 24h, pas le momentum actuel de la dernière heure.

59. **n8n Postgres node params** : les paramètres dans une requête SQL Postgres n8n s'écrivent `$1`, `$2`, etc. et sont passés dans la section "Query Parameters" du node. Pas de template string, pas d'interpolation directe (risque SQL injection).

60. **GitHub PAT scopes** : pour pousser des fichiers sur un repo public depuis l'API GitHub, le token PAT nécessite le scope `repo` (pas juste `public_repo`). Le scope `public_repo` ne permet pas les PUT sur le contenu des fichiers.

61. **Base64 UTF-8 pour GitHub API** : l'API GitHub attend le contenu encodé en base64 de l'UTF-8 du fichier. En JS : `btoa(unescape(encodeURIComponent(htmlString)))`. Le simple `btoa(htmlString)` échoue si le contenu contient des caractères non-Latin1 (accents, emojis).

62. **n8n IF node connexions JSON** : quand on édite les connexions d'un workflow via l'API REST, l'index 0 de `main` est la branche TRUE, l'index 1 est FALSE. Pour terminer la branche TRUE silencieusement : `main[0] = []`. Pour la lier à un node : `main[0] = [{node: 'NodeName', type: 'main', index: 0}]`.

63. **DexScreener pairCreatedAt** : le champ `pairCreatedAt` dans la réponse DexScreener est un timestamp Unix en **millisecondes**. Pour calculer l'âge en minutes : `(Date.now() - pairCreatedAt) / 60000`.

64. **Vercel hobby plan limites** : le plan Hobby Vercel est gratuit mais limité à 100GB de bandwidth/mois et 100 déploiements/jour. Pour un dashboard statique consulté par 1-2 utilisateurs, ces limites ne sont jamais atteintes.

65. **n8n expression $now** : dans les expressions n8n, `$now` retourne le timestamp actuel en ISO 8601. `$today` retourne la date du jour. Utiles pour les logs et les comparaisons temporelles.

66. **Sigma wallet address vérification** : avant d'envoyer des SOL vers le wallet Sigma, toujours vérifier que l'adresse est en format base58 Solana (44 chars). Une adresse `0x...` indique que le bot est configuré sur un réseau EVM (Avalanche, etc.) → les SOL envoyés seraient perdus.

67. **n8n workflow ID vs execution ID** : le workflow ID (`X5WGSoosu03wrbMx`) identifie la définition du workflow. L'execution ID (ex: `1605`) identifie une exécution spécifique. Pour récupérer les logs d'une exécution : `GET /api/v1/executions/{executionId}?includeData=true`.

68. **Chrome MCP JWT protection** : la protection CORS/JWT de Chrome empêche de lire certaines réponses de fetch() depuis le contexte d8n8n. Contournement : stocker la valeur dans `document.title` puis faire un screenshot zoomé sur la barre de titre `[0, 0, 400, 20]`.

69. **Headers Google Sheet — corruption par saisie clavier** ⚠️ **SURVENU 22 mai**
    - Taper dans la Name Box puis Enter positionne le curseur sur la cellule, mais si une saisie Tab/Enter suit immédiatement, les valeurs peuvent atterrir dans les mauvaises colonnes.
    - Symptôme : colonne J entièrement vide (header présent, données absentes), données décalées vers K/L/M.
    - Fix : vérifier chaque header individuellement via Name Box + barre de formule avant de passer à la suite.
    - En cas de décalage : supprimer la colonne vide via clic droit → "Supprimer la colonne", puis corriger les headers.

70. **LunarCrush API v4 — 402 sur tous les endpoints utiles — ABANDONNÉ**
    - Retourne 401 `"Not authorized: Invalid token provided"` sans clé Bearer.
    - Pas de free tier anonyme — inscription obligatoire sur lunarcrush.com.
    - Base URL : `https://lunarcrush.com/api4/public/`
    - Endpoints utiles : `/topics/list/v1` (trending), `/topic/:topic/v1` (métriques d'un topic), `/coins/list/v1` (coins avec social score)
    - Métriques disponibles : `interactions_24h`, `num_contributors`, `sentiment` (% posts positifs), `topic_rank`, posts par réseau (X, YouTube, TikTok, Reddit)

71. **Bug critique Birdeye/prompt — $json.candidates vide après insertion nodes Birdeye** ⚠️ **RÉSOLU 22 mai soir**
    - **Cause** : l'ajout des nodes `Expand candidates → HTTP Request Birdeye → Enrich Birdeye data → Increment Birdeye quota` entre GoPlus et Claude change le node précédant `Analyze with Claude`. Ce node est désormais `Increment Birdeye quota` (UPDATE Postgres) qui ne retourne pas de candidates.
    - **Symptôme** : Claude reçoit `$json.candidates = undefined` → répond "aucun token fourni" → pas de `<json>` → `Code in JavaScript2: ok(0)` → `Append row in sheet` et `Insert pending checks` ne s'exécutent pas. Les Telegram partaient quand même (avant le Code JS2 dans la chaîne).
    - **Diagnostic** : via API REST `GET /api/v1/executions/{id}?includeData=true` → vérifier `Code in JavaScript2` ou `Parse JSON C1` → si `ok(0)` = bug. Aussi : lire le texte Claude via `claudeRun[0].data.main[0][0].json.content[0].text` → si pas de `<json>` = prompt vide.
    - **Fix** : dans le prompt `Analyze with Claude`, remplacer `$json.candidates` par `$('Enrich Birdeye data').first().json.candidates`.
    - **Règle générale** : quand on insère des nodes entre GoPlus et Claude, toujours utiliser une référence explicite `$('NomDuNodeSource').first().json.candidates` dans le prompt.
    - **Vérification post-fix** : `Code in JavaScript2: ok(N)` avec N > 0, et `Append row in sheet` dans les logs d'exécution.

72. **Dashboard v3.0 — architecture Live Scoring** ✅ **22 mai soir**
    - Principe : note_claude originale comme base, ajustements live selon métriques DexScreener temps réel.
    - Dédup par défaut : `dedup()` garde la ligne la plus récente par adresse (clé = `address.toLowerCase()`).
    - Fetch live : batch DexScreener sur tous les tokens, extraction `priceChange.h1/h24`, `liquidity.usd`, `txns.h1.buys/sells`, `priceUsd`.
    - BuyRatio live : `Math.round(buys1h / (buys1h + sells1h) * 100)` — priorité sur valeur du sheet.
    - Décision : `⚡ ACHETER` si note ≥ 8 ET liq > 20k ; `👁 SURVEILLER` si note ≥ 6 ET liq > 15k.
    - Refresh : 5 min live + 15 min sheet.

73. **Fix dashboard âge — fallback l1 quand timestamp null** ✅ **22 mai après-midi**
    - Tokens avec `timestamp:null` (anciens signaux pré-colonne source) affichaient l'âge brut du scan.
    - Fix dans `fa()` et dans le tri : utiliser `s.timestamp || s.l1` comme timestamp effectif.
    - `l1` = première colonne du sheet = timestamp réel de détection, toujours renseigné.
    - Appliqué dans dashboard v2.9 (patch) puis natif dans v3.0 (`ageStr` function).

74. **pump.fun API — MORTE depuis mi-2025** ⚠️ **CONFIRMÉ 25 mai**
    - `frontend-api.pump.fun` → NXDOMAIN (domaine supprimé)
    - `advanced-api.pump.fun` → bloqué CORS browser + inaccessible depuis Railway (Cloudflare DNS NXDOMAIN)
    - `pump.fun/api/*` → 404 HTML (route n'existe pas)
    - Aucune API pump.fun publique n'est accessible depuis browser ou serveur
    - **Solution** : utiliser DexScreener `/token-profiles/latest/v1` + `/tokens/v1/solana/` pour les paires très récentes

75. **n8n Respond to Webhook — respondWith: "json"** ✅ **25 mai**
    - `respondWith: "firstEntryJson"` → non supporté dans n8n 2.20.11 (erreur)
    - `respondWith: "allEntries"` → retourne corps vide si le Code node précédent retourne `[]`
    - **Solution fonctionnelle** : `respondWith: "json"` + `responseBody: "={{ JSON.stringify({...}) }}"` avec interpolation n8n
    - ⚠️ Le corps est vide si le node Postgres retourne 0 items (table vide) → le Code node ne s'exécute pas → le Respond non plus
    - Fix : s'assurer que la query SQL retourne toujours au moins 1 item (ou gérer le cas 0 items en amont)

76. **pending_checks — horizon string vs integer** ⚠️ **DÉCOUVERT 25 mai**
    - La colonne `horizon` est stockée comme `TEXT` ("24h", "4h", "2h"), pas comme `INTEGER`
    - Le Code node G1 doit parser avec `parseFloat(c.horizon)` pour obtenir le nombre d'heures
    - `(c.horizon || 24) * 3600000` → NaN si horizon = "24h" (string)
    - **Fix** : `var h = typeof c.horizon === 'string' ? parseFloat(c.horizon) : (c.horizon || 24); var horizonMs = h * 3600000;`

77. **G1 Tracker — nettoyage pending_checks expirées** ✅ **25 mai**
    - Entrées anciennes restaient "En cours" indéfiniment si DexScreener ne trouvait pas le prix (adresses mortes/corrompues)
    - **Nettoyage manuel** : `UPDATE pending_checks SET outcome = 'EXPIRED', checked = true WHERE signal_at < NOW() - INTERVAL '3 days'`
    - **Fix automatique** : le Code node G1 "Enrich with live prices" détecte l'expiration sur l'âge seul (sans dépendre du prix) — les tokens dont `signal_at + horizon > now` sont marqués EXPIRED même sans prix actuel
    - Dashboard : les entrées EXPIRED s'affichent toujours (outcome visible = ⏰ Expiré) mais ne comptent pas dans "En profit" ni "TP atteints"

78. **n8n $helpers.httpRequest dans Code node** ✅ **25 mai**
    - Dans un Code node n8n (pas un HTTP Request node), on peut faire des appels HTTP via `await $helpers.httpRequest({ method: 'GET', url: '...' })`
    - Cela contourne la restriction sandbox fetch() des Code nodes
    - Utilisé dans E1 "Process and filter" pour le batch DexScreener depuis le Code node
    - Retourne directement le JSON parsé (pas besoin de `.json()`)

79. **Expression Telegram avec détection dump — structure IIFE** ✅ **25 mai session 2**
    - L'expression n8n du node Telegram peut contenir une IIFE `(function(){ ... })()`  pour la logique conditionnelle
    - Syntaxe : `={{ (function(){ var raw = $json.content[0].text; ... return result; })() }}`
    - Permet de préfixer ⚠️ si le texte Claude contient DUMP POST-PUMP, MOMENTUM NEG ou EN BAISSE
    - Appliqué sur 02 (1 node Telegram), C1 (1 node), D1 (1 node) — chacun avait exactement 1 node Telegram avec `content[0].text`
    - **Note** : workflow 02 avait 3 nodes Telegram (skipped + normal + autre), le filtre `content[0].text` a correctement ciblé uniquement les nodes principaux

80. **E1 Early dual-source — /latest/dex/search vs /token-profiles/latest/v1** ⚠️ **25 mai session 2**
    - `/latest/dex/pairs/solana` → 404 HTML (n'existe pas)
    - `/latest/dex/search?q=solana` → 30 paires populaires, rarement < 30min
    - `/token-profiles/latest/v1` → profils récents, nécessite batch `/tokens/v1/solana/`
    - Aucun endpoint DexScreener public ne retourne fiablement des paires Solana < 30min en permanence
    - **Fix** : Code E1 dual-format (détecte tableau = token-profiles, objet avec pairs = search) + cache 25min au lieu de 10min
    - L'onglet Early affichera 0 résultats entre les pics d'activité Solana — c'est normal


---

## 🗺️ Roadmap

### ✅ Complétées
- **Pipeline v1.0** : 5 paliers DexScreener → Claude → Telegram ✅ (14 mai)
- **Déduplication A1** : table seen_tokens Postgres 24h ✅ (15 mai)
- **GoPlus Security A2** : filtrage honeypot/freeze ✅ (15 mai)
- **N8N_ENCRYPTION_KEY fixée** : credentials survivent aux redémarrages Railway ✅ (19 mai)
- **B1 Binance Balance Tracker** : HMAC-SHA256 pur JS, bot séparé ✅ (19 mai)
- **Dashboard Vercel v1.9** : déployé, gviz Sheet, DexScreener links ✅ (19 mai)
- **Scoring 4 axes v2.0** : buy_ratio, vol_liq, age_minutes loggés dans 02+C1+D1 ✅ (20 mai)
- **G1 connexion auto** : pending_checks alimentée par 02/C1/D1 (TOP PICK uniquement) ✅ (20 mai)
- **Fix note aberrante** : clamp 0-10 dans 3 workflows + suppression ligne corrompue ✅ (20 mai)
- **Dashboard v2.1** : colonnes triables + colonne Détecté + âge actuel corrigé ✅ (20 mai)
- **Dashboard v2.2** : tri Âge corrigé (null→Infinity, âge actuel) + étoile ⭐ TOP PICK ✅ (20 mai)
- **Prompts v2.2** : règles dump post-pump sur 02/C1/D1 ✅ (20 mai)
- **Dashboard v2.3** : colonnes Liq Live + ΔPrix (fetch DexScreener temps réel, 15 tokens) ✅ (20 mai)
- **Dashboard v2.4** : toggle dédup + Liq Live 50 tokens (2 batch) ✅ (20 mai)
- **Fix price_usd v2.4** : c.priceUsd en priorité dans 02/C1/D1 → ΔPrix renseigné ✅ (20 mai)
- **Fix G1** : Compute outcome retourne [] au lieu de [{skipped:true}] ✅ (20 mai)
- **Fix B1** : suppression timestamp dupliqué dans queryParameters ✅ (20 mai)
- **Premier trade BULL** : 0.22 SOL, SL -30% configuré ✅ (21 mai)
- **Dashboard v2.5** : sliders visibles + tri Liq Live/ΔPrix stable ✅ (21 mai)
- **Dashboard v2.6** : tableau 100 signaux ✅ (21 mai)
- **Fix priceUsd fallback priceNative** : 02/C1/D1 ✅ (21 mai)
- **Fix C1 guard priceUsd supprimé** ✅ (21 mai)
- **D1 Telegram TOP PICK uniquement** : node IF Top Pick D1 ✅ (21 mai)
- **B1 bot Telegram séparé** : @binance_copy_trading_bliss46_bot ✅ (21 mai)
- **B1 alertes conditionnelles** : seulement si variation solde ≥ 0.01 USDT ✅ (21 mai)
- **Colonne source** : loggée dans 02/C1/D1 + header Sheet M1 ✅ (22 mai)
- **Dashboard v2.7** : section Suivi G1 TOP PICK tracker ✅ (22 mai)
- **Birdeye BDS intégré** : be_buy_pressure + be_unique_wallets dans 02/C1/D1 ✅ (22 mai)
- **Circuit breaker Birdeye** : table birdeye_quota Postgres, 500 appels/jour ✅ (22 mai)
- **Prompts Claude v2.8** : règles scoring Birdeye ✅ (22 mai)
- **Colonne buy_pressure_be** : header N ajouté dans Google Sheet ✅ (22 mai)
- **Dashboard v2.8** : fix DÉTECTÉ (fallback l1), fix NaNj→— Suivi G1, labels Sources ✅ (22 mai)
- **Fix bug Birdeye/prompt** : références explicites candidates dans 02/C1 ✅ (22 mai soir)
- **Fix âge dashboard v2.9** : fallback l1 quand timestamp null ✅ (22 mai soir)
- **Dashboard v3.0** : Note Live recalculée + dédup par défaut + Δ1h/Δ24h live + décisions actionnables ✅ (22 mai soir)
- **E1 Early Proxy** : workflow n8n proxy DexScreener <30min → prelaunch_cache → webhook ✅ (25 mai)
- **G1 Tracker connecté** : webhook `/webhook/g1-data` → pending_checks + prix live + outcome_live ✅ (25 mai)
- **Dashboard v3.1** : onglet G1 Tracker live + onglet Early (<30min) fonctionnel ✅ (25 mai)
- **Dashboard v3.2** : G1 toggle EXPIRED (masqué par défaut, stats corrigées) + colonne BP% (vert/orange/rouge, NaN guard, triable) ✅ (25 mai session 2)
- **Alertes Telegram intelligentes** : préfixe ⚠️ si dump dans 02/C1/D1 ✅ (25 mai session 2)
- **E1 v1.1** : Code dual-source + cache 25min ✅ (25 mai session 2)
- **Fix pending_checks expirées** : nettoyage manuel + fix auto expiration par âge (parsing horizon string) ✅ (25 mai)

### 🔜 Prochaines étapes

**🚨 URGENT — Renouvellement token GitHub** (avant le **18 juin 2026** — dans ~24 jours)
- Token `ghp_REDACTED_RENOUVELER_AVANT_18_JUIN_2026` expire le 18 juin 2026
- GitHub → Settings → Developer settings → Personal access tokens (classic) → Generate new → scope `repo`
- Mettre à jour `contexte.md`

~~**Priorité haute — Masquer les entrées EXPIRED dans G1 Tracker**~~ ✅ FAIT (v3.2 — toggle + stats corrigées)

**Priorité haute — Calibration Note Live**
- Observer sur quelques jours si les décisions ⚡/👁/Passer sont cohérentes avec les charts réels
- Ajuster les seuils (note min ACHETER, liq min) selon les observations
- Possibilité d'ajouter un slider "Liq min ACHETER" dans les contrôles

~~**Priorité moyenne — Colonne buy_pressure_be dans le tableau dashboard**~~ ✅ FAIT (v3.2 — colonne BP% triable, NaN guard)

~~**Priorité moyenne — Alertes Telegram intelligentes**~~ ✅ FAIT (v3.2 — expression Telegram avec préfixe ⚠️ si DUMP/MOMENTUM NEG détecté dans le texte Claude)

**Priorité basse — Améliorer E1 Early (<30min)**
- L'endpoint `/token-profiles/latest/v1` ne retourne pas toujours des paires Solana <30min
- Explorer `/latest/dex/pairs/solana` ou filtrer plus agressivement
- Alternative : utiliser l'endpoint D1 existant avec filtre âge < 30min (au lieu de 3h)

---

## 🔍 Références API

### Birdeye BDS (free tier)
- Base URL : `https://public-api.birdeye.so`
- Auth : header `X-API-KEY: 981acbcc75da470cb6ab65e8fa6c052d` + `x-chain: solana`
- Plan Standard : gratuit, 30 000 CU/mois, 1 req/sec
- Endpoint : `GET /defi/token_overview?address={address}`
- Champs : `vBuy24hUSD`, `vSell24hUSD`, `uniqueWallet24h`
- `be_buy_pressure` = `round(vBuy / (vBuy + vSell) * 100)` — ratio VOLUME $ (pas transactions)
- ⚠️ Sandbox n8n bloque `fetch()` → utiliser node HTTP Request natif
- Circuit breaker : table `birdeye_quota`, 500 appels/jour, skip silencieux si dépassé

### DexScreener
- `/token-boosts/top/v1` : trending boosté (30 items)
- `/tokens/v1/solana/{csv}` : batch jusqu'à 30 adresses — retourne paires + métriques
- `/latest/dex/search?q=solana` : paires récentes (D1)
- `/token-profiles/latest/v1` : derniers token profiles créés (toutes chains) — utilisé par E1
- Champs live utiles : `priceChange.h1`, `priceChange.h24`, `liquidity.usd`, `txns.h1.buys`, `txns.h1.sells`, `priceUsd`, `priceNative`

### GoPlus Security
- `https://api.gopluslabs.io/api/v1/token_security/solana?contract_addresses={csv}`
- Champs : `is_honeypot`, `cannot_sell_all`, `is_mintable`, `freeze_authority`
- Tokens < 48h souvent non indexés → `result: null` normal

### n8n API REST
- Base : `https://n8n-production-05f0.up.railway.app/api/v1/`
- Auth : `X-N8N-API-KEY: {jwt}` (créer dans Settings → n8n API)
- Endpoints : GET/PUT `/workflows/{id}`, POST `/workflows/{id}/activate`, GET `/executions?workflowId={id}&limit=N`, GET `/executions/{id}?includeData=true`
- Body PUT : uniquement `name`, `nodes`, `connections`, `settings: {executionOrder:'v1'}`
- ⚠️ Clé JWT perdue à chaque navigation → tout faire dans un seul bloc async

### n8n Webhooks
- Production : `https://n8n-production-05f0.up.railway.app/webhook/{path}`
- Test (UI) : `https://n8n-production-05f0.up.railway.app/webhook-test/{path}` (actif uniquement si le workflow est en mode test dans l'UI)
- G1 data : `/webhook/g1-data` — pending_checks avec prix live
- Prelaunch : `/webhook/prelaunch-data` — paires <30min depuis cache Postgres

### GitHub API (dashboard)
- PUT `https://api.github.com/repos/bliss46/sigma-signals-dashboard/contents/index.html`
- Auth : `Authorization: token ghp_...`
- Body : `{message, content (base64 UTF-8), sha}`
- Encoder : `btoa(unescape(encodeURIComponent(html)))`
- ⚠️ **Token expire le 18 juin 2026**

### Binance
- Base : `https://api.binance.com`
- `GET /api/v3/account?timestamp=X&signature=Y` (HMAC-SHA256)
- `/sapi/v1/copyTrading/*` réservé aux Lead Traders (pas aux copiers)

---

## 💭 Cadrage psychologique (rappel)

- Cédric est **conscient** que c'est une expérience d'apprentissage
- Le budget (150 CHF) est acceptable comme "investissement éducatif"
- Le trading on-chain via Sigma est **statistiquement perdant pour 90-95% des utilisateurs**
- Le pipeline n'est PAS une garantie de profit, c'est un **outil d'aide à la décision** et un **terrain d'apprentissage technique**
- Mindset validé : objectif = comprendre, pas s'enrichir
- **Leçon WCSS** (18 mai) : pump +250% déjà fait = risque élevé. TP/SL automatique = seul filet réaliste.
- **Leçon PTROLL/Ebola** (19 mai) : variation extrême (+500%+) = biais du prompt. Corrigé en v1.8.
- **Leçon UP/46301** (20 mai) : Haiku peut halluciner des valeurs numériques → toujours clamper. Corrigé en v2.1.
- **Leçon BOOBCOIN** (20 mai) : BuyRatio élevé ≠ bon signal si chart montre dump -95%. Corrigé en v2.2.
- **Leçon REPOX** (20 mai) : liquidité au scan ≠ liquidité à l'achat. Dashboard Liq Live couvre ça depuis v2.4.
- **Leçon BULL** (21 mai) : Sigma SL+TP non simultanés. Pump +10% la nuit = manqué. Trailing SL à explorer.
- **Leçon APE** (22 mai) : Note Live v3.0 détecte les dumps EN COURS (Δ1h), pas les dumps futurs. Un D1 de 11min avec note 8/10 à 03h peut être en dump à 15h — toujours vérifier DexScreener avant d'acheter même avec une bonne Note Live. La Note Live est bonne pour détecter les tokens DÉJÀ en dump, pas pour prédire le dump futur.

---

## 🔗 Liens clés

- **n8n** : https://n8n-production-05f0.up.railway.app
- **Dashboard** : https://sigma-signals-dashboard.vercel.app
- **Repo GitHub** : https://github.com/bliss46/sigma-signals-dashboard
- **Google Sheet** : https://docs.google.com/spreadsheets/d/1LGMojKgGIEGsMDkkHx69GPFY_88UTHJKE6vB5XST3xk/edit
- **Railway** : https://railway.com/project/3d7ea4a0-6ff2-4c47-80e1-fa833357622e
- **Anthropic Console** : https://platform.claude.com
- **Workflow 02** : https://n8n-production-05f0.up.railway.app/workflow/X5WGSoosu03wrbMx
- **Workflow C1** : https://n8n-production-05f0.up.railway.app/workflow/teWXwlt33Iv0SI4d
- **Workflow D1** : https://n8n-production-05f0.up.railway.app/workflow/u5VGZgEuXP2kmnTX
- **Workflow B1** : https://n8n-production-05f0.up.railway.app/workflow/REIu6NbBIOuBMzjN
- **Workflow G1** : https://n8n-production-05f0.up.railway.app/workflow/rqw0acOpxTmYB7wE
- **Workflow E1** : https://n8n-production-05f0.up.railway.app/workflow/EJYdWQvX6F7R3uGc

---

*Document mis à jour le 25 mai 2026 — Pipeline Sigma Signals v3.1 — Dashboard v3.1 (G1 Tracker live + Early <30min) — E1 proxy DexScreener — Fix expiration G1 (pièges #74-78) — Token GitHub expire 18 juin 2026 ← URGENT*

---

## 📊 Code JS de référence — Nodes critiques

### Prepare batch addresses (02/C1 — Code JS)
```javascript
var items = $input.all();
var addresses = [];
var pairs = [];
items.forEach(function(item) {
  var pair = item.json;
  if (pair.baseToken && pair.baseToken.address) {
    addresses.push(pair.baseToken.address);
    pairs.push({
      address: pair.baseToken.address,
      symbol: pair.baseToken.symbol || '',
      name: pair.baseToken.name || '',
      priceUsd: pair.priceUsd || pair.priceNative || null,
      change24h: pair.priceChange && pair.priceChange.h24 ? pair.priceChange.h24 : null,
      change1h: pair.priceChange && pair.priceChange.h1 ? pair.priceChange.h1 : null,
      liquidityUsd: pair.liquidity && pair.liquidity.usd ? pair.liquidity.usd : null,
      volume24h: pair.volume && pair.volume.h24 ? pair.volume.h24 : null,
      volume1h: pair.volume && pair.volume.h1 ? pair.volume.h1 : null,
      txns24h: pair.txns && pair.txns.h24 ? (pair.txns.h24.buys || 0) + (pair.txns.h24.sells || 0) : null,
      buys24h: pair.txns && pair.txns.h24 ? pair.txns.h24.buys || 0 : null,
      sells24h: pair.txns && pair.txns.h24 ? pair.txns.h24.sells || 0 : null,
      pairCreatedAt: pair.pairCreatedAt || null,
      dexUrl: pair.url || ('https://dexscreener.com/solana/' + pair.baseToken.address)
    });
  }
});
return [{ json: { addresses: addresses, pairs: pairs, csv: addresses.join(',') } }];
```

### Enrich Birdeye data (Code JS — merge be_buy_pressure)
```javascript
var items = $input.all();
var birdeyeResults = {};

// Collect all Birdeye HTTP responses
items.forEach(function(item) {
  var data = item.json;
  if (data && data.data && data.data.address) {
    var addr = data.data.address.toLowerCase();
    var vBuy = data.data.vBuy24hUSD || 0;
    var vSell = data.data.vSell24hUSD || 0;
    var total = vBuy + vSell;
    birdeyeResults[addr] = {
      be_buy_pressure: total > 0 ? Math.round(vBuy / total * 100) : null,
      be_unique_wallets: data.data.uniqueWallet24h || null
    };
  }
});

// Get candidates from GoPlus node
var candidates = $('Enrich security flags').first().json.candidates || [];  // 02/C1
// Pour D1: var candidates = $('Enrich security D1').first().json.candidates || [];

var enriched = candidates.map(function(c) {
  var addr = (c.address || '').toLowerCase();
  var be = birdeyeResults[addr] || {};
  return Object.assign({}, c, {
    be_buy_pressure: be.be_buy_pressure || null,
    be_unique_wallets: be.be_unique_wallets || null
  });
});

return [{ json: { candidates: enriched, count: enriched.length, be_calls_made: Object.keys(birdeyeResults).length } }];
```

### Code in JavaScript2 — Parse JSON Claude (02)
```javascript
var text = $input.first().json.content[0].text;
// Extract <json>...</json>
var match = text.match(/<json>([\s\S]*?)<\/json>/);
if (!match) return [];
var raw = match[1].trim();
// Remove possible markdown fences
raw = raw.replace(/^```json\s*/,'').replace(/\s*```$/,'');
try {
  var parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) return [];
  return parsed.map(function(item) {
    return { json: {
      symbol: item.symbol || '',
      note_claude: Math.min(10, Math.max(0, parseInt(item.note) || 0)),
      is_top_pick: item.is_top_pick || 'NON',
      raison: item.raison_courte || ''
    }};
  });
} catch(e) {
  return [];
}
```

### Enrich with live prices — G1 webhook (Code JS v3.1)
```javascript
var items = $input.all();
var checks = items.map(function(i){ return i.json; }).filter(function(c){ return c.id != null; });

if (!checks.length) {
  return [{ json: { checks: [], count: 0, fetched_at: new Date().toISOString() } }];
}

var now = Date.now();
var active = [];
var expired = [];

checks.forEach(function(c) {
  var signalTime = c.signal_at ? new Date(c.signal_at).getTime() : null;
  // ⚠️ horizon est un string ("24h", "4h") — parser avec parseFloat
  var horizonH = typeof c.horizon === 'string' ? parseFloat(c.horizon) : (c.horizon || 24);
  var horizonMs = horizonH * 3600000;
  var isExpired = signalTime && (now - signalTime > horizonMs);
  if (isExpired) {
    expired.push(Object.assign({}, c, { outcome_live: 'EXPIRED', change_pct: null, current_price: null }));
  } else {
    active.push(c);
  }
});

var priceMap = {};
if (active.length) {
  var addresses = [];
  active.forEach(function(c){
    if (c.address && c.address.length > 10 && addresses.indexOf(c.address) === -1) addresses.push(c.address);
  });
  if (addresses.length) {
    var url = 'https://api.dexscreener.com/tokens/v1/solana/' + addresses.slice(0,30).join(',');
    try {
      var resp = await $helpers.httpRequest({ method: 'GET', url: url });
      var pairs = Array.isArray(resp) ? resp : [];
      pairs.forEach(function(p) {
        if (!p || !p.baseToken || priceMap[p.baseToken.address]) return;
        if (p.priceUsd) {
          priceMap[p.baseToken.address] = {
            price: parseFloat(p.priceUsd),
            liq: p.liquidity && p.liquidity.usd ? Math.round(p.liquidity.usd) : null,
            ch1h: p.priceChange && p.priceChange.h1 != null ? parseFloat(p.priceChange.h1) : null
          };
        }
      });
    } catch(e) {}
  }
}

var enrichedActive = active.map(function(c) {
  var live = priceMap[c.address] || null;
  var cur = live ? live.price : null;
  var entry = c.signal_price != null ? parseFloat(c.signal_price) : null;
  var chg = (cur && entry && entry > 0) ? Math.round((cur - entry) / entry * 10000) / 100 : null;
  var outcome = c.outcome || 'PENDING';
  if (!c.checked && chg !== null) {
    if (chg <= -30) outcome = 'SL_HIT';
    else if (chg >= 250) outcome = 'TP2_HIT';
    else if (chg >= 100) outcome = 'TP1_HIT';
    else if (chg > 0) outcome = 'POSITIF';
    else outcome = 'NEGATIF';
  }
  return Object.assign({}, c, {
    current_price: cur, change_pct: chg,
    liq_usd: live ? live.liq : null,
    ch1h: live ? live.ch1h : null,
    outcome_live: outcome, price_at_signal: entry
  });
});

var all = enrichedActive.concat(expired);
return [{ json: { checks: all, count: all.length, fetched_at: new Date().toISOString() } }];
```

### Compute outcome — G1 Price Tracker (Code JS)
```javascript
var items = $input.all();
var now = Date.now();
var results = [];

items.forEach(function(item) {
  var check = item.json;
  var currentPrice = check.current_price_usd; // from DexScreener fetch
  var signalPrice = parseFloat(check.price_at_signal);
  
  if (!signalPrice || !currentPrice) {
    results.push({ json: Object.assign({}, check, { outcome: 'NO_DATA' }) });
    return;
  }
  
  var change = (currentPrice - signalPrice) / signalPrice * 100;
  var outcome = 'PENDING';
  
  if (change <= -30) outcome = 'SL_HIT';
  else if (change >= 250) outcome = 'TP2_HIT';
  else if (change >= 100) outcome = 'TP1_HIT';
  else if (change > 0) outcome = 'POSITIF';
  else outcome = 'NEGATIF';
  
  // Check horizon expired
  var signalTime = new Date(check.signal_timestamp).getTime();
  var horizonMs = (check.horizon_hours || 24) * 3600000;
  if (now - signalTime > horizonMs && outcome === 'PENDING') outcome = 'EXPIRED';
  
  results.push({ json: Object.assign({}, check, { outcome: outcome, change_pct: Math.round(change * 10) / 10 }) });
});

return results.length > 0 ? results : [];
```

---

## 📋 Structures SQL complètes

### seen_tokens (dédup 02)
```sql
CREATE TABLE IF NOT EXISTS seen_tokens (
  id SERIAL PRIMARY KEY,
  address VARCHAR(50) NOT NULL,
  symbol VARCHAR(20),
  inserted_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(address)
);
CREATE INDEX IF NOT EXISTS idx_seen_tokens_address ON seen_tokens(address);
CREATE INDEX IF NOT EXISTS idx_seen_tokens_inserted ON seen_tokens(inserted_at);
```

### seen_tokens_c1 (dédup C1 — 2h)
```sql
CREATE TABLE IF NOT EXISTS seen_tokens_c1 (
  id SERIAL PRIMARY KEY,
  address VARCHAR(50) NOT NULL,
  inserted_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_stc1_address ON seen_tokens_c1(address);
```
Query dédup C1 : `SELECT address FROM seen_tokens_c1 WHERE address = ANY($1::text[]) AND inserted_at > NOW() - INTERVAL '2 hours'`

### seen_tokens_d1 (dédup D1 — 2h)
Même structure que seen_tokens_c1.

### pending_checks (G1) — structure réelle en production
```sql
-- Structure effective (peut différer du CREATE TABLE initial)
-- id, address TEXT, symbol TEXT, signal_price NUMERIC,
-- signal_at TIMESTAMPTZ, check_at TIMESTAMPTZ,
-- horizon TEXT ("24h"/"4h"/"2h"), checked BOOLEAN,
-- price_at_check NUMERIC, pct_change NUMERIC,
-- outcome TEXT, source TEXT, note_claude INTEGER, dex_url TEXT
```
Nettoyage des expirées : `UPDATE pending_checks SET outcome = 'EXPIRED', checked = true WHERE signal_at < NOW() - INTERVAL '3 days'`

### prelaunch_cache (E1) 🆕
```sql
CREATE TABLE IF NOT EXISTS prelaunch_cache (
  id SERIAL PRIMARY KEY,
  coins JSONB NOT NULL,
  count INTEGER DEFAULT 0,
  fetched_at TIMESTAMP DEFAULT NOW()
);
-- Nettoyage automatique dans E1 : DELETE WHERE fetched_at < NOW() - INTERVAL '10 minutes'
```

### binance_balance_logs (B1)
```sql
CREATE TABLE IF NOT EXISTS binance_balance_logs (
  id SERIAL PRIMARY KEY,
  balance_usdt DECIMAL(18,4),
  recorded_at TIMESTAMP DEFAULT NOW()
);
```

### birdeye_quota (circuit breaker)
```sql
CREATE TABLE IF NOT EXISTS birdeye_quota (
  date DATE PRIMARY KEY,
  call_count INTEGER DEFAULT 0
);
```
Check : `SELECT call_count FROM birdeye_quota WHERE date = CURRENT_DATE`
Update : `INSERT INTO birdeye_quota (date, call_count) VALUES (CURRENT_DATE, 1) ON CONFLICT (date) DO UPDATE SET call_count = birdeye_quota.call_count + 1`

---

## 📊 Observations post-déploiement

### Stats du Google Sheet (observé 20-25 mai 2026)
- Taux de détection 02 (2h) : 1-5 tokens par cycle / 10-50 tokens/jour
- Taux de détection C1 (15min) : 0-3 tokens par cycle / 0-10 tokens/heure active
- Taux de détection D1 (5min) : 1-8 tokens par cycle (très fréquent)
- Taux TOP PICK : ~20-30% des signaux
- Note moyenne Claude : 5.8/10
- Répartition source : D1 ~60%, C1 ~25%, 02 ~15%

### Observations qualité signaux (empiriques)
- **D1 early pairs** : détecte les tokens dans les premières minutes de vie. Risque élevé (dump dans les 2-4h fréquent) mais potentiel de gain x2-x5 si entry early. Note 8+ D1 = surveiller activement.
- **C1 pump 15min** : détecte les mouvements en cours. Signal plus "sûr" mais entry souvent tardive. Confirme des tendances en cours.
- **02 trending 2h** : signaux les plus "matures". Utile pour des tokens qui ont tenu plusieurs heures. Meilleur pour les positions swing.
- **GoPlus null** : ~40% des tokens D1 ont GoPlus null (trop récents). Normal, ne pas bloquer.
- **Birdeye be_buy_pressure** : souvent entre 45-70% pour les bons tokens. < 40% = signal de vente dominante même si le prix monte (distribution).
- **E1 Early <30min** : l'endpoint DexScreener `/token-profiles/latest` peut ne retourner 0 tokens Solana <30min selon les cycles. Normal. L'onglet se remplira lors des pics d'activité Solana.

### Leçons trading concrètes
- **Ne pas acheter un D1 de plus de 3h** : le "early" n'est plus early. La Note Live gère ça via l'âge calculé.
- **Liq > 30k$ = signe de confiance** : les memecoins qui tiennent > 30k$ de liquidité ont généralement passé le cap du premier dump.
- **Surveiller les TOP PICK D1 dans les 30min** : c'est la fenêtre d'opportunité. Après 30min, soit ça a pompé (trop tard) soit c'est stable (moins risqué).
- **BULL position** : acheté le 21 mai à 23h00, 0.22 SOL, SL -30%. Premier trade réel. Suivi en cours.

---

## 📝 Prompts Claude complets — textes exacts v2.8

### Prompt système — Workflow 02 (DexScreener Trending Scanner)

```
Tu es un analyste expert en tokens Solana spécialisé dans la détection de gems early-stage. Tu analyses des tokens candidats issus de DexScreener et tu retournes une évaluation structurée.

CONTEXTE : Ces tokens ont été pré-filtrés (liquidité, volume, âge) et vérifiés par GoPlus Security. Tu dois évaluer leur potentiel de pump à court terme (1-24h).

SYSTÈME DE SCORING (note de 0 à 10) :

BUY RATIO (pression acheteuse) :
- > 65% : +2 pts (forte pression acheteuse)
- 55-65% : +1 pt (légère pression acheteuse)
- 45-55% : 0 pt (neutre)
- 35-45% : -1 pt (légère pression vendeuse)
- < 35% : -2 pts (forte pression vendeuse)

VOL/LIQ RATIO (activité relative) :
- > 5 : +2 pts (activité très élevée)
- 2-5 : +1 pt (bonne activité)
- 1-2 : 0 pt (activité normale)
- 0.5-1 : -1 pt (faible activité)
- < 0.5 : -2 pts (très faible activité)

ÂGE DU TOKEN :
- 30-90 min : +2 pts (fenêtre idéale early)
- 90 min - 6h : +1 pt (encore early)
- 6h - 24h : 0 pt
- 24h - 7j : -1 pt (moins early)
- > 7j : -2 pts (plus early)

SÉCURITÉ (pénalités GoPlus) :
- is_honeypot = 1 → NOTE = 0, REJETER IMMÉDIATEMENT
- cannot_sell_all = 1 → NOTE = 0, REJETER IMMÉDIATEMENT
- is_mintable = 1 → -2 pts (risque de dilution)
- freeze_authority = 1 → -1 pt (risque de freeze)
- GoPlus null (token trop récent) → 0 pt (pas de pénalité)

MOMENTUM (variation de prix) :
- change_24h > 200% ET change_1h < -20% → NOTE MAX 3 (dump post-pump détecté)
- change_24h > 500% → -3 pts, NOTE MAX 5 (pump très avancé, FOMO dangereux)
- change_24h > 300% → -2 pts (pump avancé)
- change_24h > 100% → -1 pt (pump en cours)
- change_1h > 20% → +1 pt (momentum positif récent)

BIRDEYE (si disponible — be_buy_pressure = ratio volume $ acheteurs) :
- be_buy_pressure > 65% → +1 pt (acheteurs dominants en valeur)
- be_buy_pressure 40-65% → 0 pt
- be_buy_pressure < 40% → -1 pt (vendeurs dominants en valeur)
- be_unique_wallets > 200 → +1 pt (bonne diversification)
- be_unique_wallets < 50 → -1 pt (concentration risquée)

CLAMP OBLIGATOIRE : La note finale doit être entre 0 et 10 inclus. Jamais de note > 10 ou < 0.

TOP PICK : note ≥ 7 ET buy_ratio > 60% ET vol_liq > 1 ET liquidité > 20 000$
```

### Prompt utilisateur — Workflow 02

```
TOKENS À ANALYSER :
{{ JSON.stringify($('Enrich Birdeye data').first().json.candidates, null, 2) }}

---
INSTRUCTIONS DE RÉPONSE :

**PARTIE 1 — OBLIGATOIRE EN PREMIER : JSON structuré entre balises <json>**

Retourne EXACTEMENT ce format, sans aucun texte avant les balises <json> :

<json>
[
  {
    "symbol": "SYMBOL",
    "note": 7,
    "is_top_pick": "OUI",
    "raison_courte": "Buy ratio 68%, Vol/Liq 2.3x, âge 45min, Birdeye BP 71%"
  },
  {
    "symbol": "SYMBOL2",
    "note": 4,
    "is_top_pick": "NON",
    "raison_courte": "Buy ratio 48%, pump 24h +340% risqué"
  }
]
</json>

RÈGLES JSON :
- Un objet par token analysé
- "note" : entier entre 0 et 10 OBLIGATOIREMENT
- "is_top_pick" : exactement "OUI" ou "NON"
- "raison_courte" : 1 phrase max, chiffres clés uniquement

**PARTIE 2 — Message Telegram**

Après le bloc JSON, rédige le message Telegram en français :
- Titre : "🔍 Scan DexScreener — [N] candidats"
- Top 3 tokens maximum (les mieux notés)
- Format par token : [NOTE/10] ⭐ **SYMBOL** (si TOP PICK) ou [NOTE/10] **SYMBOL**
- 1 ligne de raison
- Si tous les tokens ont note < 5 : "Rien d'intéressant ce scan, prochaine analyse dans 2h"
- Terminer par : "_Prochain scan dans 2h_"
```

### Prompt système — Workflow C1 (Pump Alert 15min)

```
Tu es un analyste expert en tokens Solana spécialisé dans la détection de pumps en cours. Tu analyses des tokens qui montrent une variation de prix significative sur la dernière heure.

CONTEXTE : Ces tokens ont été détectés avec une variation 1h ≥ +20%. Tu dois évaluer si le pump est encore en phase d'accumulation (BUY) ou déjà en distribution (AVOID).

SYSTÈME DE SCORING (note de 0 à 10) :

BUY RATIO 1h (pression acheteuse RÉCENTE) :
- > 65% : +2 pts
- 55-65% : +1 pt
- 45-55% : 0 pt
- < 45% : -2 pts (distribution probable)

VARIATION 1h (force du mouvement) :
- 20-50% : +1 pt (pump sain)
- 50-100% : +2 pts (fort momentum)
- > 100% : -1 pt (pump potentiellement terminal)
- > 200% : -2 pts (FOMO dangereux, probablement top)

VOL/LIQ RATIO :
- > 3 : +2 pts
- 1-3 : +1 pt
- < 1 : -1 pt

SÉCURITÉ GoPlus : mêmes règles que workflow 02

MOMENTUM GLOBAL :
- change_24h > 300% ET change_1h < 0 : NOTE MAX 2 (dump post-pump)
- change_24h > 500% : NOTE MAX 3
- change_1h > 0 ET change_24h < 100% : +1 pt (pump encore early)

BIRDEYE (si disponible) : mêmes règles que workflow 02

CLAMP OBLIGATOIRE : 0-10.

TOP PICK : note ≥ 7 ET buy_ratio > 60% ET variation_1h entre 20% et 100%
```

### Prompt utilisateur — Workflow C1

```
TOKENS AVEC PUMP DÉTECTÉ (variation 1h ≥ +20%) :
{{ JSON.stringify($('Enrich Birdeye data').first().json.candidates, null, 2) }}

---
INSTRUCTIONS DE RÉPONSE :

**PARTIE 1 — OBLIGATOIRE EN PREMIER : JSON structuré entre balises <json>**

<json>
[
  {
    "symbol": "SYMBOL",
    "note": 8,
    "is_top_pick": "OUI",
    "raison_courte": "Pump +45% 1h, buy ratio 71%, liq 28k$, encore early"
  }
]
</json>

**PARTIE 2 — Alerte Telegram**

Format :
- Titre : "⚡ PUMP DÉTECTÉ — [N] token(s)"
- Par token (TOP 3 max) : [NOTE/10] ⭐ **SYMBOL** +XX% 1h (si TOP PICK)
- 1 ligne de contexte
- Si note < 5 pour tous : NE PAS envoyer (le workflow gère le silence)
```

### Prompt système — Workflow D1 (Early Pairs Scanner)

```
Tu es un analyste expert en tokens Solana spécialisé dans la détection de gems ultra-early (< 3h de vie). Tu analyses des paires créées très récemment sur PumpSwap/Raydium.

CONTEXTE : Ces tokens ont moins de 3h. Le risque est ÉLEVÉ (beaucoup échouent dans les premières heures) mais le potentiel est MAXIMUM si détecté avant le pump.

SYSTÈME DE SCORING (note de 0 à 10) :

BUY RATIO (signal crucial sur early pairs) :
- > 70% : +3 pts (accumulation forte)
- 60-70% : +2 pts (bonne accumulation)
- 50-60% : +1 pt
- < 50% : -2 pts (distribution dès le départ = mauvais signe)

LIQUIDITÉ INITIALE (indice de sérieux du projet) :
- > 30k$ : +2 pts
- 15-30k$ : +1 pt
- 8-15k$ : 0 pt
- < 8k$ : -2 pts (trop petit, rug facile)

ÂGE (plus c'est tôt, plus le potentiel est élevé mais le risque aussi) :
- < 30 min : +2 pts (ultra early)
- 30-60 min : +2 pts (très early)
- 1-2h : +1 pt (early)
- 2-3h : 0 pt
- > 3h : ne devrait pas être là (filtré en amont)

SÉCURITÉ GoPlus : mêmes règles (souvent null pour tokens < 48h → acceptable)

VARIATION 24h (activité initiale) :
- > 50% avec buy_ratio > 60% : +1 pt (momentum positif)
- < -30% : -2 pts (dump dès le lancement)

BIRDEYE (si disponible, souvent null sur early pairs) : mêmes règles

CLAMP OBLIGATOIRE : 0-10.

TOP PICK : note ≥ 7 ET buy_ratio > 65% ET liquidité > 12 000$

RAPPEL : Sur les early pairs, même un TOP PICK a un taux d'échec élevé. La note reflète le potentiel, pas une garantie.
```

### Prompt utilisateur — Workflow D1

```
EARLY PAIRS SOLANA (créées dans les 3 dernières heures) :
{{ JSON.stringify($('Enrich security D1').first().json.candidates, null, 2) }}

---
INSTRUCTIONS DE RÉPONSE :

**PARTIE 1 — OBLIGATOIRE EN PREMIER : JSON structuré entre balises <json>**

<json>
[
  {
    "symbol": "SYMBOL",
    "note": 8,
    "is_top_pick": "OUI",
    "raison_courte": "Ultra-early 18min, buy ratio 74%, liq 22k$, GoPlus clean"
  }
]
</json>

**PARTIE 2 — Alerte Telegram (TOP PICK UNIQUEMENT)**

⚠️ N'envoyer UN MESSAGE QUE SI au moins un token a is_top_pick = "OUI".
Si aucun TOP PICK → le JSON suffit, PAS de message Telegram (le workflow gère).

Format si TOP PICK détecté :
"🌱 EARLY GEM DÉTECTÉ

⭐ **SYMBOL** — [NOTE/10]
📊 [raison_courte]
⏰ Âge : [age]
💧 Liq : [liquidité]
🔗 [lien DexScreener]

⚠️ Token < 3h — Risque ÉLEVÉ. Vérifier le chart avant tout achat."
```

---

## 📨 Exemples de messages Telegram générés (vrais outputs Haiku)

### Exemple output 02 — format correct
```
🔍 Scan DexScreener — 5 candidats

8/10 ⭐ **MEMEWC** — Vol/Liq 3.2x, buy ratio 84%, âge 22h, momentum stable
7/10 ⭐ **BANK** — Buy ratio 61%, Liq 77k$, variation 24h +32%
6/10 **GARY** — Buy ratio 61%, Vol/Liq 2.6x mais pump 24h +247% avancé

_Prochain scan dans 2h_
```

### Exemple output 02 — format avec balises markdown (bug connu)
```
**🔍 Scan DexScreener — 3 candidats**

**8/10 ⭐ SPCX** — *Buy ratio 58%, Vol/Liq 34.7x, âge 5j*
**7/10 ⭐ GARY** — *Buy ratio 71%, Liq 7k$ (attention faible)*

_Prochain scan dans 2h_
```
→ Ce format causait des erreurs d'affichage Telegram (markdown nested). La triple regex corrige ça.

### Exemple output C1 — silence correct
Quand aucun token ne dépasse note 5, le workflow C1 n'envoie rien (branche IF skipped → silence). C'est le comportement voulu — pas de "rien détecté ce cycle".

### Exemple output D1 — TOP PICK alerte
```
🌱 EARLY GEM DÉTECTÉ

⭐ **APE** — 8/10
📊 Ultra-early 11min, buy ratio 63%, liq 15k$, GoPlus null (normal)
⏰ Âge : 11min
💧 Liq : 15k$
🔗 https://dexscreener.com/solana/8uporM4ok...

⚠️ Token < 3h — Risque ÉLEVÉ. Vérifier le chart avant tout achat.
```

---

## 🔧 Historique des bugs résolus — détails techniques

### Bug N8N_ENCRYPTION_KEY (16-19 mai)
**Symptôme** : après redémarrage Railway, tous les credentials n8n retournent "could not decrypt credentials". Les workflows s'arrêtent avec des erreurs d'authentification sur tous les nodes (Telegram, Postgres, Google Sheets, Anthropic).
**Cause** : n8n génère une N8N_ENCRYPTION_KEY aléatoire au démarrage si elle n'est pas fixée. Chaque redémarrage = nouvelle clé = credentials illisibles.
**Fix définitif** : variable `N8N_ENCRYPTION_KEY=a7f3d2e8b4c6f1a9e5d3b7c2f8a4d6e1b3c5f7a9d2e4b6c8f1a3d5e7b9c4f6a2` ajoutée dans les variables Railway. Cette valeur ne doit JAMAIS changer.
**Procédure de récupération si ça arrive quand même** : supprimer tous les credentials n8n → les recréer manuellement avec les valeurs documentées dans ce fichier.

### Bug ligne UP/46301 (20 mai)
**Symptôme** : token "UP" avec note_claude = 46301 dans le Google Sheet. Haiku avait retourné une valeur numérique absurde.
**Fix** : clamp `Math.min(10, Math.max(0, parseInt(note)))` ajouté dans le Code node qui parse le JSON Claude (tous les workflows). La ligne corrompue supprimée manuellement du Sheet.

### Bug IF skipped D1 (17 mai)
**Symptôme** : le workflow D1 s'arrêtait sans envoyer de notification ni continuer, même quand des tokens étaient présents.
**Cause** : le node IF "skipped" avait une branche TRUE connectée à rien → terminaison silencieuse non voulue.
**Fix** : connexion `main[0] = []` (tableau vide) pour la branche TRUE = terminaison silencieuse voulue. La branche FALSE continue vers le pipeline.

### Bug Google Sheets Map Automatically (17 mai)
**Symptôme** : les données loggées dans le Sheet apparaissaient dans les mauvaises colonnes.
**Cause** : l'option "Map Automatically" du node Append Row cherche les colonnes par nom exact. Des espaces supplémentaires dans les headers causaient le mismatch.
**Fix** : vérifier chaque header du Sheet (Name Box + barre de formule), supprimer les espaces, s'assurer que les noms de colonnes correspondent exactement aux clés JSON retournées par le Code node.

### Bug regex Telegram (18 mai)
**Symptôme** : les messages Telegram contenaient des blocs JSON bruts ou des balises `<json>` visibles.
**Cause** : Haiku est non-déterministe sur le format de sortie — parfois `<json>...</json>`, parfois ` ```json...``` `, parfois les deux, parfois aucun.
**Fix** : triple regex appliquée sur l'expression du node Telegram :
```
{{ $json.content[0].text
   .replace(/```json[\s\S]*?```/g, '')
   .replace(/\n?<json>[\s\S]*?<\/json>\n?/g, '')
   .replace(/\n{3,}/g, '\n\n')
   .trim() }}
```

### Bug B1 timestamp dupliqué (20 mai)
**Symptôme** : le workflow B1 retournait une erreur 400 sur l'endpoint Binance `/api/v3/account`.
**Cause** : le timestamp était passé à la fois dans `queryParameters` du node HTTP Request ET dans la signature HMAC → Binance recevait `timestamp=X&timestamp=X` dans la query string.
**Fix** : supprimer le timestamp des `queryParameters` du node HTTP Request. Il est déjà inclus dans la chaîne signée et ajouté manuellement dans l'URL via l'expression n8n.

### Bug G1 skipped true (20 mai)
**Symptôme** : le workflow G1 loggait des lignes `{skipped: true}` dans pending_checks au lieu de ne rien faire.
**Cause** : le Code node "Compute outcome" retournait `[{json: {skipped: true}}]` quand il n'y avait rien à traiter, et ce faux item passait dans l'INSERT Postgres.
**Fix** : retourner `[]` (tableau vide) au lieu de `[{json: {skipped: true}}]`. Un return de tableau vide = n8n stoppe la branche silencieusement.

### Bug priceUsd null (21 mai)
**Symptôme** : la colonne ΔPrix du dashboard affichait "—" pour tous les tokens malgré des prix visibles sur DexScreener.
**Cause** : le Code node des workflows loggait `priceUsd: null` car la propriété était lue depuis `pair.priceUsd` qui peut être null sur les paires récentes.
**Fix** : fallback `priceUsd: pair.priceUsd || pair.priceNative || null`. Sur les paires récentes (< 30min), `priceNative` est souvent disponible avant `priceUsd`.

### Bug C1 guard priceUsd (21 mai)
**Symptôme** : le workflow C1 filtrait des tokens valides et ne les transmettait pas à Claude.
**Cause** : un guard `if (!priceUsd) return false` dans le filtre de C1 excluait tous les tokens sans priceUsd, y compris des tokens légitimes très récents.
**Fix** : supprimer le guard priceUsd dans C1. La liquidité et le buy_ratio sont des critères suffisants pour filtrer.

### Bug dashboard NaNj (22 mai matin)
**Symptôme** : la section Suivi G1 du dashboard affichait "NaNj" dans la colonne Âge pour certains tokens.
**Cause** : la fonction `ageStr()` retournait `NaN + 'j'` quand `age_minutes` était une chaîne non-numérique (ex: `""` ou `null`).
**Fix** : ajouter un guard `if ((m == null || m === '') && !ts) return '—'` avant le calcul.

### Bug source labels dashboard (22 mai matin)
**Symptôme** : le graphique "Sources" du dashboard affichait "undefined" ou des étiquettes vides.
**Cause** : certains tokens anciens (avant l'ajout de la colonne source) avaient `source: ""` → non mappé dans les labels du graphique.
**Fix** : ajouter un fallback `source || '?'` dans le rendu du graphique. Les tokens sans source affichent `?` au lieu de crasher.

### Bug DÉTECTÉ fallback l1 (22 mai après-midi)
**Symptôme** : la colonne "Détecté" du dashboard affichait "—" pour certains tokens récents.
**Cause** : la fonction `relTime()` utilisait `s.timestamp` qui était `null` pour les tokens dont la colonne `source` (M) venait d'être ajoutée mais sans timestamp dans cette colonne.
**Fix** : utiliser `s.timestamp || s.l1` comme timestamp effectif. `l1` = première colonne du sheet = timestamp réel de la ligne, toujours renseigné.

### Bug Birdeye/prompt candidates vides (22 mai soir) ← CRITIQUE
Documenté en détail dans piège #71 ci-dessus.

### Bug G1 pending_checks "En cours" bloqué (25 mai) ← RÉSOLU
**Symptôme** : entrées G1 restaient "En cours" indéfiniment même après expiration de l'horizon, affichant `—` pour prix actuel et variation.
**Cause 1** : anciennes adresses corrompues (minuscules) ne matchaient pas DexScreener → prix null → outcome non recalculé.
**Cause 2** : le champ `horizon` est stocké comme string "24h" au lieu d'integer → `parseFloat()` nécessaire.
**Fix** : nettoyage manuel + Code node G1 mis à jour pour (a) détecter l'expiration sur l'âge seul sans dépendre du prix, (b) parser `horizon` avec `parseFloat()`.

---

## 🧪 Sessions de débogage — procédures validées

### Procédure de diagnostic workflow n8n via API REST
```javascript
// Dans la console Chrome (onglet dashboard Vercel)
// 1. Créer une clé API dans n8n Settings → n8n API
window._k = 'eyJ...'; // coller la clé

// 2. Lister les dernières exécutions d'un workflow
fetch('/api/v1/executions?workflowId=X5WGSoosu03wrbMx&limit=5', {
  headers: { 'X-N8N-API-KEY': window._k }
}).then(r => r.json()).then(d => {
  d.data.forEach(e => console.log(e.id, e.status, e.startedAt));
});

// 3. Inspecter une exécution en détail
fetch('/api/v1/executions/1605?includeData=true', {
  headers: { 'X-N8N-API-KEY': window._k }
}).then(r => r.json()).then(d => {
  var rd = d.data.resultData.runData;
  Object.keys(rd).forEach(node => {
    var run = rd[node][0];
    var itemCount = run.data && run.data.main && run.data.main[0] ? run.data.main[0].length : 0;
    console.log(node + ': ok(' + itemCount + ')' + (run.error ? ' ERROR:' + run.error.message : ''));
  });
});
```

### Procédure de mise à jour workflow via API REST
```javascript
// ⚠️ Tout faire dans un seul bloc async — la clé JWT disparaît à chaque navigation
(async function() {
  var k = window._k;
  
  // 1. Fetch le workflow
  var r = await fetch('/api/v1/workflows/X5WGSoosu03wrbMx', {
    headers: { 'X-N8N-API-KEY': k }
  });
  var wf = await r.json();
  
  // 2. Modifier un node
  var node = wf.nodes.find(n => n.name === 'Analyze with Claude');
  node.parameters.messages.values[0].content = node.parameters.messages.values[0].content
    .replace('$json.candidates', "$('Enrich Birdeye data').first().json.candidates");
  
  // 3. Sauvegarder — body UNIQUEMENT name/nodes/connections/settings
  var save = await fetch('/api/v1/workflows/X5WGSoosu03wrbMx', {
    method: 'PUT',
    headers: { 'X-N8N-API-KEY': k, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: wf.name,
      nodes: wf.nodes,
      connections: wf.connections,
      settings: { executionOrder: 'v1' }
    })
  });
  
  // 4. Réactiver
  await fetch('/api/v1/workflows/X5WGSoosu03wrbMx/activate', {
    method: 'POST',
    headers: { 'X-N8N-API-KEY': k }
  });
  
  console.log('Done');
})();
```

### Procédure de push dashboard GitHub
```javascript
// Encoder et pousser index.html modifié
(async function() {
  var token = 'ghp_REDACTED_RENOUVELER_AVANT_18_JUIN_2026';
  
  // 1. Récupérer SHA actuel
  var r = await fetch('https://api.github.com/repos/bliss46/sigma-signals-dashboard/contents/index.html', {
    headers: { 'Authorization': 'token ' + token }
  });
  var d = await r.json();
  var sha = d.sha;
  
  // 2. Encoder le nouveau contenu
  var newHtml = window._html; // le HTML modifié en mémoire
  var b64 = btoa(unescape(encodeURIComponent(newHtml)));
  
  // 3. Pousser
  var push = await fetch('https://api.github.com/repos/bliss46/sigma-signals-dashboard/contents/index.html', {
    method: 'PUT',
    headers: { 'Authorization': 'token ' + token, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'fix: description du changement',
      content: b64,
      sha: sha
    })
  });
  var result = await push.json();
  console.log('Pushed:', result.commit.sha.slice(0,8));
})();
```

### Procédure de lecture valeur via document.title (contournement JWT)
```javascript
// Pour lire une valeur longue depuis le contexte JS (ex: clé API, SHA)
document.title = 'PREFIX:' + valeur;
// Puis screenshot zoom sur [0, 0, 400, 20] dans Chrome MCP
// La barre de titre affiche le contenu
```

---

## 📱 Analyse Google Sheet — structure observée (20 mai 2026)

### Colonnes et mapping exact (ordre physique)
| Col | Lettre | Nom header | Clé JSON n8n | Type |
|---|---|---|---|---|
| 1 | A | timestamp | timestamp | ISO datetime |
| 2 | B | symbol | symbol | string (ex: "MEMEWC") |
| 3 | C | name | name | string (ex: "Meme World Cup") |
| 4 | D | address | address | base58 Solana |
| 5 | E | note_claude | note_claude | integer 0-10 |
| 6 | F | is_top_pick | is_top_pick | "OUI" ou "NON" |
| 7 | G | price_usd | price_usd | float ou null |
| 8 | H | change_24h | change_24h | float (ex: 14.5) |
| 9 | I | dex_url | dex_url | URL string |
| 10 | J | buy_ratio | buy_ratio | integer 0-100 |
| 11 | K | vol_liq | vol_liq | float |
| 12 | L | age_minutes | age_minutes | integer |
| 13 | M | source | source | "02", "C1" ou "D1" |
| 14 | N | buy_pressure_be | buy_pressure_be | integer 0-100 ou null |

### Query gviz utilisée par le dashboard
```
https://docs.google.com/spreadsheets/d/1LGMojKgGIEGsMDkkHx69GPFY_88UTHJKE6vB5XST3xk/gviz/tq?tqx=out:json
```
Retourne toutes les lignes sans filtre. Le parsing JS extrait le JSON avec :
```javascript
var json = JSON.parse(t.slice(t.indexOf('(')+1, -2));
var cols = json.table.cols.map(c => (c.label||'').toLowerCase().replace(/\s+/g,'_'));
```

### Problèmes de colonnes rencontrés
- **22 mai** : ajout colonne M "source" avec corruption → colonne J (buy_ratio) vidée, données décalées K→L→M. Fix : supprimer la colonne vide, recréer les headers dans l'ordre exact. (piège #69)
- **Colonne N buy_pressure_be** : ajoutée le 22 mai après-midi. Les signaux antérieurs ont `buy_pressure_be = null` → normal.

---

## 🔗 Comptes et accès — référence complète

### Railway
- URL : https://railway.com
- Compte : bliss46's (email lié à GitHub bliss46)
- Plan : Hobby ($5/mois de crédit inclus)
- Projet : sigma-signals
- Accès direct projet : https://railway.com/project/3d7ea4a0-6ff2-4c47-80e1-fa833357622e

### GitHub
- Compte : bliss46
- Repo dashboard : https://github.com/bliss46/sigma-signals-dashboard
- Token PAT : `ghp_REDACTED_RENOUVELER_AVANT_18_JUIN_2026` (**expire 18 juin 2026**)
- Scopes nécessaires : `repo` (read + write)

### Vercel
- Compte lié à GitHub bliss46
- Projet : sigma-signals-dashboard
- Dashboard Vercel : https://vercel.com/bliss46s-projects/sigma-signals-dashboard
- Projet ID : `prj_D0z1kDLUj438HvVTi2LcTkzkZAK2`
- Team ID : `team_5mp46qxS8H1vJoliKx6HciIN`

### Anthropic
- Compte : `c_baumgarten@bluewin.ch`
- Console : https://platform.claude.com
- Clé API : `sigma-signals-n8n` (sk-ant-api03-xw3vDB...)
- Modèle en production : `claude-haiku-4-5-20251001`

### Binance
- Compte : Cédric Baumgarten (Verified Regular)
- Clé API active (lecture solde) : `5kSvgrdNmyufyxhf0T0tGzmdVqHjgG91Z7SpZS9RMwmiND0s3WU1vs1NJekJOG0S`
- Secret : `GyqXnUg7vd2vvFxFiN1lOSW6yfc4KoRrbmtfC3SEmX4A5h8UxuKy8jpkprfvBJVV`
- Copy Trading actif : 100 CHF engagés (test depuis 18 mai 2026)

### Google
- Compte : ced.baumgarten@gmail.com
- Sheet ID : `1LGMojKgGIEGsMDkkHx69GPFY_88UTHJKE6vB5XST3xk`
- Service Account n8n : credential "Google Sheets account" (ID: `BLwXHsmEKLO6nD75`)

### Birdeye
- Compte créé sur birdeye.so
- Clé API : `981acbcc75da470cb6ab65e8fa6c052d`
- Plan : Standard (free tier, 30k CU/mois)

### Sigma Bot
- Telegram : @SigmaTrading_bot (ou sigma.win)
- Wallet Solana dédié : adresse base58 (consulter dans Sigma → Portfolio)
- Réseau configuré : **Solana** (vérifier toujours que l'adresse est base58, pas 0x)

---

## 🗓️ Journal des versions détaillé

### v1.0 — 14 mai 2026
Pipeline initial : Schedule Trigger → DexScreener trending → filtre JS → Claude Haiku → Telegram. Pas de déduplication, pas de GoPlus, pas de logging.

### v1.2 — 15 mai 2026
- A1 : déduplication Postgres 24h (`seen_tokens`)
- A2 : GoPlus Security check (honeypot, cannot_sell, mintable, freeze)
- Filtrage avant Claude : seuls les tokens "propres" GoPlus passent

### v1.3 — 16 mai 2026 (matin)
- Diagnostic panne : credentials corrompus après redémarrage Railway
- Restauration manuelle de tous les credentials (Telegram, Postgres, Google Sheets, Anthropic)
- Fix SQL : query `ANY($1::text[])` au lieu de `= ANY($1)`
- N8N_ENCRYPTION_KEY ajoutée dans Railway variables

### v1.4 — 16 mai 2026 (soir)
- B1 Google Sheets logging : node "Append Row" ajouté à 02
- Résolution définitive N8N_ENCRYPTION_KEY : valeur fixe documentée
- Test complet pipeline end-to-end ✅

### v1.5 — 17 mai 2026 (nuit)
- D1 Early Pairs Scanner : nouveau workflow, paires < 3h
- Fix IF node "skipped" : branche TRUE = tableau vide (terminaison silencieuse)
- Fix Google Sheets "Map Automatically" : headers vérifiés et corrigés

### v1.6 — 18 mai 2026 (après-midi)
- C1 Pump Alert 15min : nouveau workflow, variation 1h ≥ +20%
- Fix regex Telegram : triple regex pour gérer non-déterminisme Haiku
- Suppression message "rien détecté" C1 → silence si pas de signal

### v1.7 — 19 mai 2026 (matin)
- Diagnostic panne : tous les credentials corrompus après redémarrage Railway suite à l'ajout de variables Binance
- N8N_ENCRYPTION_KEY régénérée aléatoirement → fix définitif par ajout dans Railway variables
- Restauration complète de tous les credentials
- Pipeline entièrement restauré

### v1.8 — 19 mai 2026 (après-midi)
- Nettoyage : suppression workflows temporaires (01 conservé mais archivable)
- Fix B1 Binance : HMAC-SHA256 implémenté en pur JS dans un Code node (pas de librairie)
- Calibration prompt Claude : règles de scoring clarifiées, exemples ajoutés
- Analyse Google Sheet : structure colonnes documentée

### v1.9 — 19 mai 2026 (soir)
- Dashboard Vercel déployé (repo GitHub → Vercel auto-deploy)
- Google Sheet "Publier sur le Web" activé (nécessaire pour API gviz)
- Fix lien DexScreener D1 : URL correcte avec adresse base token

### v2.0 — 20 mai 2026 (matin)
- Scoring 4 axes : `buy_ratio`, `vol_liq`, `age_minutes` loggés dans 02+C1+D1
- C1 logging Google Sheets : node Append Row ajouté (manquait)
- Fix B1 endpoint : `/api/v3/account` au lieu de `/api/v3/balance`
- G1 Price Tracker : workflow créé, documentation structure, connexion auto depuis 02/C1/D1

### v2.1 — 20 mai 2026 (après-midi/soir)
- Fix note aberrante : clamp 0-10 dans les 3 workflows (piège #27)
- Suppression ligne corrompue UP/46301 du Sheet
- Dashboard : colonnes triables (Symbol, Source, Note, Détecté, Âge, BuyRatio, Vol/Liq, Score)
- Dashboard : colonne "Détecté" (timestamp relatif)
- Dashboard : âge actuel calculé (pas âge au scan)

### v2.2 — 20 mai 2026 (nuit)
- Fix tri Âge : null → Infinity, âge calculé depuis timestamp
- Étoile ⭐ TOP PICK dans le dashboard
- Prompts : règles dump post-pump (change_24h > 200% ET change_1h < -20% → note max 3) sur 02/C1/D1

### v2.3 — 20 mai 2026 (nuit→matin)
- Dashboard : colonnes Liq Live + ΔPrix
- Fetch DexScreener temps réel sur 15 tokens (top de la liste)
- IIFEs inline dans renderAll pour le batch fetch

### v2.4 — 20 mai 2026 (après-midi/soir)
- Dashboard : toggle déduplication (1 ligne par token)
- Liq Live étendu à 50 tokens (2 batches de 30 en parallèle)
- Fix price_usd : `c.priceUsd || priceNative` dans les 3 workflows
- Fix G1 : retourner `[]` au lieu de `[{skipped:true}]`
- Fix B1 : timestamp dupliqué supprimé de queryParameters

### v2.5 — 21 mai 2026 (matin)
- Premier trade réel BULL : 0.22 SOL, SL -30%, configuré dans Sigma
- Dashboard v2.5 : sliders visibles + tri Liq Live/ΔPrix stable
- Dashboard v2.6 : tableau 100 signaux (au lieu de 50)
- Fix priceUsd fallback priceNative dans 02/C1/D1 (tous les nodes)
- Fix C1 : suppression guard `if (!priceUsd)` qui filtrait des tokens légitimes
- D1 : Telegram uniquement si TOP PICK (node IF Top Pick ajouté)
- B1 : bot Telegram séparé (@binance_copy_trading_bliss46_bot)
- B1 : alertes conditionnelles (variation ≥ 0.01 USDT seulement)

### v2.7 — 22 mai 2026 (matin)
- Colonne source (M) ajoutée dans Google Sheet + headers patchés dans les 3 workflows
- Dashboard v2.7 : section Suivi G1 (TOP PICK tracker avec prix signal vs actuel)
- LunarCrush exploré : compte créé, 402 sur tous les endpoints utiles → abandonné

### v2.8 — 22 mai 2026 (après-midi)
- Birdeye BDS free tier intégré : be_buy_pressure + be_unique_wallets dans 02/C1/D1
- Circuit breaker Postgres : table birdeye_quota, seuil 500 appels/jour
- Prompts Claude v2.8 : règles Birdeye (+1/-1 selon be_buy_pressure/be_unique_wallets)
- Colonne N (buy_pressure_be) ajoutée dans Google Sheet
- Dashboard v2.8 : fix DÉTECTÉ fallback l1, fix NaNj, labels Sources complets

### v2.9 — 22 mai 2026 (soir, intermédiaire)
- Fix dashboard âge : `s.timestamp || s.l1` dans fa() et tri (piège #73)

### v3.0 — 22 mai 2026 (soir)
- Fix bug critique Birdeye/prompt : références explicites candidates dans 02+C1 (piège #71)
- Refonte complète dashboard : Note Live recalculée temps réel, dédup par défaut
- Colonnes Δ1h/Δ24h live depuis DexScreener
- BuyRatio live depuis txns.h1
- Décisions actionnables ⚡/👁/Passer
- Badges DUMP POST-PUMP / MOMENTUM NEG / PUMP / etc.
- Widget "Dumps détectés" (count Δ1h < -20%)
- Refresh 5 min live + 15 min sheet

### v3.1 — 25 mai 2026
- E1 Early Pairs Proxy : workflow n8n DexScreener <30min → prelaunch_cache → webhook `/webhook/prelaunch-data`
- Onglet "🌱 Early (<30min)" dans le dashboard : connecté webhook E1, fraîcheur visuelle, liq, buy ratio, vol 5min, DEX badge
- G1 Tracker connecté : webhook `/webhook/g1-data` → pending_checks + prix live DexScreener + outcome_live
- Fix expiration automatique G1 : détection EXPIRED par âge seul (sans prix), parsing `horizon` string→float
- Nettoyage pending_checks : entrées > 3 jours marquées EXPIRED+checked
- piège #74 : pump.fun API morte → DexScreener comme source alternative
- piège #75 : respondWith firstEntryJson non supporté dans n8n 2.20.11
- piège #76 : pending_checks.horizon = string "24h" → parseFloat() obligatoire
- piège #77 : G1 expiration automatique sans dépendance au prix
- piège #78 : $helpers.httpRequest dans Code node n8n pour contourner sandbox

