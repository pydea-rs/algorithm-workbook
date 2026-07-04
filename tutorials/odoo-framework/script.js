/* ============================================
   ODOO TUTORIAL — SCRIPTS v3
   Syntax highlight, settings, exams, animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ==================== Syntax Highlighting ====================
    const PY_KEYWORDS = new Set([
        'False','None','True','and','as','assert','async','await','break',
        'class','continue','def','del','elif','else','except','finally',
        'for','from','global','if','import','in','is','lambda','nonlocal',
        'not','or','pass','raise','return','try','while','with','yield'
    ]);
    const PY_BUILTINS = new Set([
        'print','len','range','str','int','float','bool','list','dict','set',
        'tuple','type','super','self','cls','isinstance','issubclass',
        'hasattr','getattr','setattr','enumerate','zip','map','filter',
        'sorted','reversed','abs','min','max','sum','any','all','open',
        'input','Exception','ValueError','TypeError','KeyError','IndexError',
        'NotImplementedError','RuntimeError','property','staticmethod',
        'classmethod','format','round','callable','id','hex','oct','bin',
        'chr','ord','repr','vars','dir','locals','globals','exec','eval',
        'compile','object','bytes','memoryview','frozenset','complex',
        '_logger','_','ensure_one','browse','search','search_read',
        'search_count','create','write','unlink','read','mapped','filtered',
        'sorted','grouped','with_context','sudo','env','cr','ids'
    ]);
    const XML_TAGS = new Set([
        'record','field','form','tree','kanban','search','act_window',
        'menuitem','template','data','odoo','div','span','p','table','tr',
        'td','th','thead','tbody','group','page','notebook','header',
        'sheet','button','separator','label','ul','li','h1','h2','h3',
        'h4','h5','h6','t','templates','xpath','inherit_id','html',
        'head','body','style','link','script','img','a','br','hr'
    ]);
    const PY_DECORATORS = new Set([
        'api.model','api.depends','api.constrains','api.onchange',
        'api.returns','api.model_create_multi','api.one','api.multi',
        'api.depends_context','api.ondelete','api.onchange',
        'staticmethod','classmethod','property','tagged','override',
        'tools.ormcache','tools.depends'
    ]);

    function esc(t) {
        return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }

    function highlightPython(code) {
        let out = '';
        let i = 0;
        const len = code.length;
        while (i < len) {
            // Triple-quoted strings
            if ((code[i]==='"' && code[i+1]==='"' && code[i+2]==='"') ||
                (code[i]==="'" && code[i+1]==="'" && code[i+2]==="'")) {
                const q = code.slice(i,i+3);
                let end = code.indexOf(q, i+3);
                if (end===-1) end=len-3;
                out += `<span class="hl-str">${esc(code.slice(i,end+3))}</span>`;
                i = end+3; continue;
            }
            // Strings
            if (code[i]==='"' || code[i]==="'") {
                const q = code[i];
                let j = i+1;
                while (j<len && code[j]!==q) { if(code[j]==='\\') j++; j++; }
                out += `<span class="hl-str">${esc(code.slice(i,j+1))}</span>`;
                i = j+1; continue;
            }
            // f-strings / r-strings
            if ((code[i]==='f'||code[i]==='r') && (code[i+1]==='"'||code[i+1]==="'")) {
                const q = code[i+1];
                let j = i+2;
                while (j<len && code[j]!==q) { if(code[j]==='\\') j++; j++; }
                out += `<span class="hl-str">${esc(code.slice(i,j+1))}</span>`;
                i = j+1; continue;
            }
            // Comments
            if (code[i]==='#') {
                let end = code.indexOf('\n',i);
                if (end===-1) end=len;
                out += `<span class="hl-cmt">${esc(code.slice(i,end))}</span>`;
                i = end; continue;
            }
            // Decorators
            if (code[i]==='@') {
                let j = i+1;
                while (j<len && /[\w.]/.test(code[j])) j++;
                out += `<span class="hl-dec">${esc(code.slice(i,j))}</span>`;
                i = j; continue;
            }
            // Numbers
            if (/\d/.test(code[i]) && (i===0 || !/[\w]/.test(code[i-1]))) {
                let j = i;
                while (j<len && /[\d._xXoObBeE]/.test(code[j])) j++;
                out += `<span class="hl-num">${esc(code.slice(i,j))}</span>`;
                i = j; continue;
            }
            // Words
            if (/[a-zA-Z_]/.test(code[i])) {
                let j = i;
                while (j<len && /[\w]/.test(code[j])) j++;
                const w = code.slice(i,j);
                if (PY_KEYWORDS.has(w)) out += `<span class="hl-kw">${esc(w)}</span>`;
                else if (PY_BUILTINS.has(w)) out += `<span class="hl-bi">${esc(w)}</span>`;
                else if (/^[A-Z]/.test(w) && w.length>1) out += `<span class="hl-cls">${esc(w)}</span>`;
                else if (j<len && code[j]==='(') out += `<span class="hl-fn">${esc(w)}</span>`;
                else {
                    // Check if it's a decorator-like word
                    let full = w;
                    let k = j;
                    while (k<len && code[k]==='.') {
                        let dotEnd = k+1;
                        while (dotEnd<len && /[\w]/.test(code[dotEnd])) dotEnd++;
                        full += code.slice(k,dotEnd);
                        k = dotEnd;
                    }
                    if (PY_DECORATORS.has(full) && code[k]==='(') {
                        out += `<span class="hl-dec">${esc(full)}</span>`;
                        i = k; continue;
                    }
                    out += esc(w);
                }
                i = j; continue;
            }
            // Operators
            if ('=+-*/<>!&|^~%'.includes(code[i])) {
                out += `<span class="hl-op">${esc(code[i])}</span>`;
                i++; continue;
            }
            out += esc(code[i]); i++;
        }
        return out;
    }

    function highlightXml(code) {
        let out = '';
        let i = 0;
        const len = code.length;
        while (i < len) {
            // Comments
            if (code.startsWith('<!--',i)) {
                const end = code.indexOf('-->',i+4);
                const close = end===-1?len:end+3;
                out += `<span class="hl-cmt">${esc(code.slice(i,close))}</span>`;
                i = close; continue;
            }
            // CDATA
            if (code.startsWith('<![CDATA[',i)) {
                const end = code.indexOf(']]>',i+9);
                const close = end===-1?len:end+3;
                out += `<span class="hl-str">${esc(code.slice(i,close))}</span>`;
                i = close; continue;
            }
            // Tags
            if (code[i]==='<') {
                let j = i+1;
                if (code[j]==='/') j++;
                const tagStart = j;
                while (j<len && /[\w:-]/.test(code[j])) j++;
                const tag = code.slice(tagStart,j);
                out += `<span class="hl-op">&lt;</span>`;
                if (code[i+1]==='/') out += `<span class="hl-op">/</span>`;
                out += XML_TAGS.has(tag) ? `<span class="hl-tag">${esc(tag)}</span>` : esc(tag);
                i = j;
                while (i<len && code[i]!=='>' && !(code[i]==='/'&&code[i+1]==='>')) {
                    if (/\s/.test(code[i])) { out+=code[i]; i++; continue; }
                    if (/[\w:-]/.test(code[i])) {
                        let k=i; while(k<len&&/[\w:-]/.test(code[k]))k++;
                        out+=`<span class="hl-attr">${esc(code.slice(i,k))}</span>`;
                        i=k; continue;
                    }
                    if (code[i]==='=') { out+=`<span class="hl-op">=</span>`; i++; continue; }
                    if (code[i]==='"'||code[i]==="'") {
                        const q=code[i]; let k=i+1;
                        while(k<len&&code[k]!==q)k++;
                        out+=`<span class="hl-str">${esc(code.slice(i,k+1))}</span>`;
                        i=k+1; continue;
                    }
                    out+=esc(code[i]); i++;
                }
                if (code.startsWith('/>',i)) { out+=`<span class="hl-op">/&gt;</span>`; i+=2; }
                else if (code[i]==='>') { out+=`<span class="hl-op">&gt;</span>`; i++; }
                continue;
            }
            out += esc(code[i]); i++;
        }
        return out;
    }

    function highlightShell(code) {
        let r = esc(code);
        r = r.replace(/(#[^\n]*)/g,'<span class="hl-cmt">$1</span>');
        r = r.replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g,'<span class="hl-str">$1</span>');
        r = r.replace(/(\s)(--?[\w-]+)/g,'$1<span class="hl-dec">$2</span>');
        ['sudo','apt','pip','pip3','git','cd','mkdir','cp','rm','ls','cat','echo',
         'source','createdb','dropdb','psql','python3','python','node','npm',
         'wget','curl','chmod','chown','grep','find','sed','awk','tar','docker',
         'make','npm','npx','yarn','pnpm','bun'].forEach(kw => {
            r = r.replace(new RegExp('\\b('+kw+')\\b','g'),'<span class="hl-bi">$1</span>');
        });
        r = r.replace(/(\$\w+|\$\{[^}]+\})/g,'<span class="hl-attr">$1</span>');
        r = r.replace(/\b(\d+)\b/g,'<span class="hl-num">$1</span>');
        return r;
    }

    function highlightJson(code) {
        let r = esc(code);
        r = r.replace(/(&quot;[^&]*?&quot;)\s*:/g,'<span class="hl-tag">$1</span>:');
        r = r.replace(/:\s*(&quot;[^&]*?&quot;)/g,': <span class="hl-str">$1</span>');
        r = r.replace(/\b(true|false|null)\b/g,'<span class="hl-kw">$1</span>');
        r = r.replace(/:\s*(-?\d+\.?\d*)/g,': <span class="hl-num">$1</span>');
        return r;
    }

    function highlightIni(code) {
        let r = esc(code);
        r = r.replace(/(\[[^\]]+\])/g,'<span class="hl-tag">$1</span>');
        r = r.replace(/^([a-z_]\w*)\s*=/gm,'<span class="hl-attr">$1</span>=');
        r = r.replace(/(#.*)$/gm,'<span class="hl-cmt">$1</span>');
        return r;
    }

    // IMPROVED language detection
    function detectLanguage(code) {
        const t = code.trim();
        // Must check Python BEFORE JSON
        if (t.includes('def ') || t.includes('class ') || t.includes('from odoo') ||
            t.includes('@api.') || t.includes('import ') && (t.includes('from ') || t.includes('odoo')) ||
            t.includes('self.') || t.includes('env[') || t.includes('fields.') ||
            t.includes('raise ') || t.includes('for ') && t.includes(' in ') ||
            t.includes('return ') || t.includes('_name') || t.includes('_inherit') ||
            t.includes('api.model') || t.includes('api.depends') ||
            t.includes('api.constrains') || t.includes('super().')) return 'python';
        if (t.startsWith('{') || t.startsWith('[')) {
            // Check if it's actually Python dict/list
            if (t.includes("'") && !t.includes(':')) return 'python';
            return 'json';
        }
        if (t.startsWith('<') || t.includes('&lt;record') || t.includes('t-name=') ||
            t.includes('t-esc=') || t.includes('t-foreach=')) return 'xml';
        if (t.startsWith('[options]') || t.includes('admin_passwd') || t.includes('addons_path')) return 'ini';
        if (t.startsWith('#!/') || t.includes('./odoo-bin') || t.includes('sudo ') ||
            t.includes('pip ') || t.includes('git ') || t.includes('apt ') ||
            t.includes('mkdir') || t.includes('createdb')) return 'shell';
        if (t.includes('listen ') || t.includes('server {') || t.includes('location ')) return 'nginx';
        if (t.includes('{') && t.includes(':') && t.includes('"')) return 'json';
        return 'text';
    }

    function highlightCode(code, lang) {
        switch(lang) {
            case 'python': return highlightPython(code);
            case 'xml': return highlightXml(code);
            case 'shell': return highlightShell(code);
            case 'json': return highlightJson(code);
            case 'nginx': return highlightShell(code);
            case 'ini': return highlightIni(code);
            default: return esc(code);
        }
    }

    const langLabels = {python:'Python',xml:'XML',shell:'Shell',json:'JSON',nginx:'Nginx',ini:'Config',text:''};

    document.querySelectorAll('pre').forEach(pre => {
        const codeEl = pre.querySelector('code');
        if (!codeEl || codeEl.dataset.highlighted) return;
        const raw = codeEl.textContent;
        const lang = detectLanguage(raw);
        codeEl.dataset.lang = lang;
        codeEl.dataset.highlighted = 'true';
        pre.dataset.lang = lang;
        if (langLabels[lang]) pre.setAttribute('data-lang', langLabels[lang]);
        codeEl.innerHTML = highlightCode(raw, lang);
    });

    // ==================== Progress Bar ====================
    const progressFill = document.getElementById('progressFill');
    const backToTop = document.getElementById('backToTop');
    function updateProgress() {
        const s = window.scrollY;
        const h = document.documentElement.scrollHeight - window.innerHeight;
        progressFill.style.width = (h>0?(s/h)*100:0)+'%';
        if (backToTop) backToTop.classList.toggle('show', s>500);
    }
    window.addEventListener('scroll', updateProgress, {passive:true});
    updateProgress();

    if (backToTop) backToTop.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));

    // ==================== Active Nav ====================
    const navLinks = document.querySelectorAll('nav a');
    const secObs = new IntersectionObserver(es => {
        es.forEach(e => {
            if (e.isIntersecting) {
                navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href')==='#'+e.target.id));
            }
        });
    }, {rootMargin:'-80px 0px -65% 0px', threshold:0});
    document.querySelectorAll('h2[id],h3[id],div[id]').forEach(s => {
        if (s.id && s.tagName!=='NAV') secObs.observe(s);
    });

    // ==================== Mobile Nav ====================
    const hamburger = document.querySelector('.hamburger');
    const sidebar = document.getElementById('sidebar');
    if (hamburger && sidebar) {
        hamburger.addEventListener('click', () => sidebar.classList.toggle('open'));
        navLinks.forEach(l => l.addEventListener('click', () => sidebar.classList.remove('open')));
        document.addEventListener('click', e => {
            if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && !hamburger.contains(e.target))
                sidebar.classList.remove('open');
        });
    }

    // ==================== Search ====================
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', e => {
            const q = e.target.value.toLowerCase().trim();
            const sects = document.querySelectorAll('.nav-section');
            navLinks.forEach(l => {
                const match = !q || l.textContent.toLowerCase().includes(q) || (l.getAttribute('href')||'').includes(q);
                l.style.display = match ? '' : 'none';
            });
            sects.forEach(s => {
                let vis = false, el = s.nextElementSibling;
                while (el && !el.classList.contains('nav-section')) {
                    if (el.tagName==='A' && el.style.display!=='none') vis=true;
                    el = el.nextElementSibling;
                }
                s.style.display = vis||!q ? '' : 'none';
            });
        });
    }

    // ==================== Copy Code ====================
    document.querySelectorAll('pre').forEach(pre => {
        if (pre.querySelector('.copy-btn')) return;
        const btn = document.createElement('button');
        btn.className = 'copy-btn'; btn.textContent = 'Copy';
        btn.addEventListener('click', async () => {
            const code = pre.querySelector('code');
            const text = code ? code.textContent : pre.textContent;
            try { await navigator.clipboard.writeText(text); }
            catch { const t=document.createElement('textarea'); t.value=text; t.style.cssText='position:fixed;opacity:0'; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t); }
            btn.textContent = 'Copied!'; btn.classList.add('copied');
            setTimeout(() => { btn.textContent='Copy'; btn.classList.remove('copied'); }, 2000);
        });
        pre.appendChild(btn);
    });

    // ==================== Scroll Reveal ====================
    const revObs = new IntersectionObserver(es => {
        es.forEach(e => { if(e.isIntersecting) { e.target.classList.add('visible'); revObs.unobserve(e.target); }});
    }, {rootMargin:'0px 0px -30px 0px', threshold:0.05});
    document.querySelectorAll('.concept-card,.comparison-table,.callout,.section-summary,.project-card,.framework-compare,.toc-item,.exam-block').forEach(el => {
        el.classList.add('reveal'); revObs.observe(el);
    });

    // ==================== Smooth Scroll ====================
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const h = a.getAttribute('href');
            if (h==='#') return;
            const t = document.querySelector(h);
            if (t) { e.preventDefault(); t.scrollIntoView({behavior:'smooth',block:'start'}); history.pushState(null,'',h); }
        });
    });

    // ==================== Keyboard ====================
    document.addEventListener('keydown', e => {
        if (e.key==='/' && document.activeElement.tagName!=='INPUT') { e.preventDefault(); if(searchInput) searchInput.focus(); }
        if (e.key==='Escape') {
            if (searchInput && document.activeElement===searchInput) { searchInput.blur(); return; }
            if (sidebar) sidebar.classList.remove('open');
            closeSettings();
        }
    });

    // ==================== Line Count ====================
    document.querySelectorAll('pre code').forEach(code => {
        const lines = code.textContent.split('\n');
        if (lines.length>2) {
            const pre = code.closest('pre');
            if (pre && !pre.querySelector('.line-count')) {
                const ind = document.createElement('span');
                ind.className = 'line-count';
                ind.textContent = lines.length+' lines';
                pre.appendChild(ind);
                pre.addEventListener('mouseenter', () => ind.style.opacity='1');
                pre.addEventListener('mouseleave', () => ind.style.opacity='0');
            }
        }
    });

    // ==================== Reading Time ====================
    const mc = document.querySelector('main');
    if (mc) {
        const w = mc.textContent.split(/\s+/).length;
        const m = Math.ceil(w/200);
        const rt = document.querySelector('.reading-time');
        if (rt) rt.textContent = `~${m} min read`;
    }

    // ==================== Settings Panel ====================
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsPanel = document.getElementById('settingsPanel');
    const settingsClose = document.getElementById('settingsClose');
    const settingsOverlay = document.getElementById('settingsOverlay');

    function openSettings() { settingsPanel?.classList.add('open'); settingsOverlay?.classList.add('open'); }
    function closeSettings() { settingsPanel?.classList.remove('open'); settingsOverlay?.classList.remove('open'); }

    settingsBtn?.addEventListener('click', e => { e.stopPropagation(); openSettings(); });
    settingsClose?.addEventListener('click', closeSettings);
    settingsOverlay?.addEventListener('click', closeSettings);

    // ==================== Themes ====================
    const themes = {
        default: { primary:'#714B67',primaryLight:'#8B5A7A',primaryDark:'#5A3A52',accent:'#F06050',accentLight:'#ff7961',bg:'#f8f7fc',bgCode:'#1e1e2e',bgCard:'#fff',text:'#2c2c2c',textMuted:'#6b6b7b',textLight:'#999',border:'#e4e0ec',borderLight:'#f0edf5',codeText:'#cdd6f4',codeKeyword:'#cba6f7',codeString:'#a6e3a1',codeComment:'#6c7086',codeNumber:'#fab387',codeDecorator:'#f9e2af',codeBuiltin:'#89b4fa',codeXmlTag:'#89dceb',codeXmlAttr:'#f9e2af' },
        midnight: { primary:'#7c3aed',primaryLight:'#a78bfa',primaryDark:'#5b21b6',accent:'#06b6d4',accentLight:'#22d3ee',bg:'#0f172a',bgCode:'#020617',bgCard:'#1e293b',text:'#e2e8f0',textMuted:'#94a3b8',textLight:'#64748b',border:'#334155',borderLight:'#1e293b',codeText:'#e2e8f0',codeKeyword:'#c084fc',codeString:'#86efac',codeComment:'#64748b',codeNumber:'#fdba74',codeDecorator:'#fde68a',codeBuiltin:'#7dd3fc',codeXmlTag:'#67e8f9',codeXmlAttr:'#fde68a' },
        ocean: { primary:'#0369a1',primaryLight:'#38bdf8',primaryDark:'#075985',accent:'#f59e0b',accentLight:'#fbbf24',bg:'#f0f9ff',bgCode:'#0c1929',bgCard:'#fff',text:'#0c4a6e',textMuted:'#64748b',textLight:'#94a3b8',border:'#bae6fd',borderLight:'#e0f2fe',codeText:'#e0f2fe',codeKeyword:'#7dd3fc',codeString:'#86efac',codeComment:'#475569',codeNumber:'#fdba74',codeDecorator:'#fde68a',codeBuiltin:'#a5b4fc',codeXmlTag:'#5eead4',codeXmlAttr:'#fde68a' },
        forest: { primary:'#166534',primaryLight:'#4ade80',primaryDark:'#14532d',accent:'#ea580c',accentLight:'#fb923c',bg:'#f0fdf4',bgCode:'#0a1a0f',bgCard:'#fff',text:'#1a2e1a',textMuted:'#4a7c5a',textLight:'#6a9a6a',border:'#bbf7d0',borderLight:'#dcfce7',codeText:'#d1fae5',codeKeyword:'#86efac',codeString:'#a5f3fc',codeComment:'#4a6a5a',codeNumber:'#fdba74',codeDecorator:'#fde68a',codeBuiltin:'#93c5fd',codeXmlTag:'#5eead4',codeXmlAttr:'#fde68a' },
        rose: { primary:'#be123c',primaryLight:'#fb7185',primaryDark:'#9f1239',accent:'#8b5cf6',accentLight:'#a78bfa',bg:'#fff1f2',bgCode:'#1c0a12',bgCard:'#fff',text:'#4a1020',textMuted:'#8a5060',textLight:'#b07080',border:'#fecdd3',borderLight:'#ffe4e6',codeText:'#ffe4e6',codeKeyword:'#fda4af',codeString:'#86efac',codeComment:'#6a4050',codeNumber:'#fdba74',codeDecorator:'#fde68a',codeBuiltin:'#93c5fd',codeXmlTag:'#5eead4',codeXmlAttr:'#fde68a' },
        dark: { primary:'#8b5cf6',primaryLight:'#a78bfa',primaryDark:'#6d28d9',accent:'#f43f5e',accentLight:'#fb7185',bg:'#18181b',bgCode:'#09090b',bgCard:'#27272a',text:'#fafafa',textMuted:'#a1a1aa',textLight:'#71717a',border:'#3f3f46',borderLight:'#27272a',codeText:'#fafafa',codeKeyword:'#c084fc',codeString:'#86efac',codeComment:'#71717a',codeNumber:'#fb923c',codeDecorator:'#fde68a',codeBuiltin:'#60a5fa',codeXmlTag:'#22d3ee',codeXmlAttr:'#fde68a' }
    };
    const fonts = {
        system:"-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif",
        inter:"'Inter',sans-serif", mono:"'JetBrains Mono','Fira Code',monospace",
        serif:"Georgia,'Times New Roman',serif", compact:"'Roboto Condensed','Arial Narrow',sans-serif"
    };
    const fontSizes = {small:'14px',default:'16px',large:'18px',xlarge:'20px'};

    function loadSettings() { try { return JSON.parse(localStorage.getItem('odoo-tutorial-settings'))||{}; } catch { return {}; } }
    function saveSettings(s) { localStorage.setItem('odoo-tutorial-settings', JSON.stringify(s)); }

    function applySettings(s) {
        const r = document.documentElement;
        const t = s.theme||'default';
        const th = themes[t]||themes.default;
        const props = {primary:'--primary','primary-light':'--primary-light','primary-dark':'--primary-dark',accent:'--accent','accent-light':'--accent-light',bg:'--bg','bg-code':'--bg-code','bg-card':'--bg-card',text:'--text','text-muted':'--text-muted','text-light':'--text-light',border:'--border','border-light':'--border-light','code-text':'--code-text','code-keyword':'--code-keyword','code-string':'--code-string','code-comment':'--code-comment','code-number':'--code-number','code-decorator':'--code-decorator','code-builtin':'--code-builtin','code-xml-tag':'--code-xml-tag','code-xml-attr':'--code-xml-attr'};
        Object.entries(props).forEach(([k,v]) => { if(th[k]) r.style.setProperty(v, th[k]); });
        r.style.setProperty('--primary-bg', th.primary+'0f');

        const font = fonts[s.font]||fonts.system;
        r.style.setProperty('--font-family', font);
        document.body.style.fontFamily = font;
        document.body.style.fontSize = fontSizes[s.fontSize]||fontSizes.default;

        const codeSize = s.codeSize||'13.5px';
        document.querySelectorAll('pre').forEach(p => p.style.fontSize = codeSize);

        const sw = s.sidebarCompact==='true' ? '220px' : '290px';
        r.style.setProperty('--sidebar-w', sw);

        const rm = {small:'6px',default:'12px',large:'16px',none:'0px'};
        r.style.setProperty('--radius', rm[s.borderRadius]||'12px');

        document.querySelectorAll('.theme-option').forEach(el => el.classList.toggle('active', el.dataset.theme===t));
        document.querySelectorAll('.font-option').forEach(el => el.classList.toggle('active', el.dataset.font===(s.font||'system')));
        document.querySelectorAll('.size-option').forEach(el => el.classList.toggle('active', el.dataset.size===(s.fontSize||'default')));
        document.querySelectorAll('.radius-option').forEach(el => el.classList.toggle('active', el.dataset.radius===(s.borderRadius||'default')));

        const st = document.getElementById('sidebarCompactToggle');
        if (st) st.checked = s.sidebarCompact==='true';
        const cs = document.getElementById('codeSizeSelect');
        if (cs) cs.value = codeSize;
    }

    let currentSettings = loadSettings();
    applySettings(currentSettings);

    // Event delegation for settings
    settingsPanel?.addEventListener('click', e => {
        const t = e.target.closest('.theme-option');
        if (t) { currentSettings.theme=t.dataset.theme; saveSettings(currentSettings); applySettings(currentSettings); return; }
        const f = e.target.closest('.font-option');
        if (f) { currentSettings.font=f.dataset.font; saveSettings(currentSettings); applySettings(currentSettings); return; }
        const sz = e.target.closest('.size-option');
        if (sz) { currentSettings.fontSize=sz.dataset.size; saveSettings(currentSettings); applySettings(currentSettings); return; }
        const rd = e.target.closest('.radius-option');
        if (rd) { currentSettings.borderRadius=rd.dataset.radius; saveSettings(currentSettings); applySettings(currentSettings); return; }
        if (e.target.closest('#settingsReset')) {
            currentSettings = {};
            saveSettings(currentSettings);
            applySettings(currentSettings);
            return;
        }
    });

    document.getElementById('sidebarCompactToggle')?.addEventListener('change', function() {
        currentSettings.sidebarCompact = this.checked ? 'true' : 'false';
        saveSettings(currentSettings);
        applySettings(currentSettings);
    });
    document.getElementById('codeSizeSelect')?.addEventListener('change', function() {
        currentSettings.codeSize = this.value;
        saveSettings(currentSettings);
        applySettings(currentSettings);
    });

    // ==================== Exam System ====================
    document.querySelectorAll('.exam-block').forEach(exam => {
        const answer = exam.dataset.answer?.toLowerCase().replace(/\s+/g,' ').trim();
        const hint = exam.dataset.hint || '';
        const textarea = exam.querySelector('textarea');
        const checkBtn = exam.querySelector('.exam-check');
        const resetBtn = exam.querySelector('.exam-reset');
        const feedback = exam.querySelector('.exam-feedback');
        const hintBtn = exam.querySelector('.exam-hint');
        const hintBox = exam.querySelector('.exam-hint-text');

        if (!textarea || !checkBtn || !feedback) return;

        function normalize(s) {
            return s.toLowerCase().replace(/[\s]+/g,' ').replace(/['"]/g,'\'').replace(/[;,]/g,'').trim();
        }

        function similarity(a, b) {
            const na = normalize(a), nb = normalize(b);
            if (!na || !nb) return 0;
            // Exact match
            if (na === nb) return 100;
            // Check if all key tokens are present
            const tokens = nb.split(' ').filter(t => t.length > 2);
            const present = tokens.filter(t => na.includes(t)).length;
            const score = (present / tokens.length) * 100;
            // Bonus for structural similarity
            const lines_a = na.split('\n').length;
            const lines_b = nb.split('\n').length;
            if (Math.abs(lines_a - lines_b) <= 1) return Math.min(score + 10, 100);
            return score;
        }

        checkBtn.addEventListener('click', () => {
            const userCode = textarea.value.trim();
            if (!userCode) {
                feedback.className = 'exam-feedback error';
                feedback.textContent = 'Please write some code first.';
                return;
            }
            const score = similarity(userCode, answer);
            if (score >= 60) {
                feedback.className = 'exam-feedback success';
                feedback.innerHTML = `<strong>Correct!</strong> Your answer matches well.`;
            } else if (score >= 30) {
                feedback.className = 'exam-feedback partial';
                feedback.innerHTML = `<strong>Almost!</strong> Your answer is close. Check the hint for guidance.`;
            } else {
                feedback.className = 'exam-feedback error';
                feedback.innerHTML = `<strong>Not quite.</strong> Try again or check the hint.`;
            }
        });

        resetBtn?.addEventListener('click', () => {
            textarea.value = '';
            feedback.className = 'exam-feedback';
            feedback.textContent = '';
            if (hintBox) hintBox.style.display = 'none';
        });

        hintBtn?.addEventListener('click', () => {
            if (hintBox) {
                hintBox.style.display = hintBox.style.display === 'none' ? 'block' : 'none';
            }
        });
    });

    // ==================== Easter egg ====================
    let seq = [];
    document.addEventListener('keydown', e => {
        seq.push(e.key);
        if (seq.length>4) seq.shift();
        if (JSON.stringify(seq)==='["ArrowUp","ArrowUp","ArrowDown","ArrowDown"]') {
            document.body.style.transition='filter 0.5s';
            document.body.style.filter='hue-rotate(180deg)';
            setTimeout(()=>document.body.style.filter='',1500);
        }
    });

    console.log('%c Odoo 19 Developer Tutorial', 'font-size:20px;font-weight:bold;color:#714B67;');
});
