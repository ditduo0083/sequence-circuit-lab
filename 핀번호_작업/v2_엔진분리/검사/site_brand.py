"""0111: 브랜드 설정을 생성 시 HTML에 넣는다. 서버에 설정/파이썬을 배포하지 않는다."""
from pathlib import Path
import json, re, os
from html import escape

V2=Path(__file__).resolve().parent.parent
ROOT=V2.parent.parent
CONFIG=V2/'공용/site-brand.json'

CSS='''
/* site-brand.json + site_brand.py에서 생성. 페이지별 복사본을 직접 고치지 않는다. */
body .site-bar.site-bar.site-bar{box-sizing:border-box;position:relative;z-index:40;display:flex;flex:none;align-items:center;flex-wrap:nowrap;gap:10px;width:100%;height:44px;min-height:44px;max-height:44px;margin:0;padding:0 12px;border:0;border-radius:0;background:var(--accent,var(--teal,#007f78));color:#fff;font:600 14px/1.4 'Malgun Gothic',system-ui,sans-serif;white-space:nowrap;overflow:visible}
.site-bar *{box-sizing:border-box}.site-bar .brand-home-link{display:flex;align-items:center;gap:8px;color:inherit;text-decoration:none;flex:none}
.site-bar .brand-logo,.sim-fit .site-bar .brand-logo{display:block;width:24px!important;height:24px!important;min-width:24px;object-fit:contain;border-radius:50%;background:white}
.site-bar .sb-brand-name{font-weight:700}.site-bar .sb-chip{display:none;border:1px solid #ffffffb3;border-radius:6px;padding:2px 7px;font-size:12px}
.site-bar .sb-page{flex:1 1 auto;min-width:0;border-left:2px solid #ffffff80;padding-left:10px}
.site-bar .sb-mid,.site-bar .sb-small{display:none}
.site-bar .header-actions{display:flex;flex:none;align-items:center;gap:8px;margin:0;order:initial}
body .site-bar .sb-home,body .site-bar summary{display:flex;align-items:center;justify-content:center;min-height:30px;height:30px;margin:0;padding:3px 8px;border:1px solid #ffffffb3;border-radius:6px;background:transparent;color:#fff;box-shadow:none;font:600 12px/1.4 'Malgun Gothic',system-ui,sans-serif;text-decoration:none;cursor:pointer;list-style:none}
.site-bar summary::-webkit-details-marker{display:none}.site-bar details{position:relative;flex:none}.site-bar details>summary::marker{content:''}
.site-bar .sb-menu{position:absolute;top:calc(100% + 6px);right:0;z-index:100;display:flex;flex-direction:column;gap:4px;width:230px;max-width:calc(100vw - 24px);padding:8px;border:1px solid var(--accent-line,#c2d6d2);border-radius:8px;background:white;color:var(--ink,#172e38);box-shadow:0 8px 24px #173d4833;white-space:normal}
body .site-bar .sb-menu a,body .site-bar .sb-menu button{display:flex;align-items:center;min-height:40px;width:100%;margin:0;padding:8px 10px;border:0;border-radius:5px;background:white;color:var(--ink,#172e38);text-decoration:none;text-align:left;font:600 13px/1.4 'Malgun Gothic',system-ui,sans-serif;box-shadow:none}
.site-bar .sb-menu a:hover,.site-bar .sb-menu button:hover{background:var(--accent-soft,#e3f4ef)}.site-bar .sb-menu [aria-current=page]{background:var(--accent-soft,#e3f4ef);color:var(--accent-ink,#087d76)}
.site-bar :focus-visible{outline:2px solid var(--focus,#eaa645);outline-offset:2px}.site-bar [hidden],.site-bar .brand-engine-title,.site-bar>.lead{display:none!important}
.hero-inner>.site-bar{width:calc(100% - 26px);margin:0 0 16px;background:transparent}.hero-subtitle{margin:6px 0 0;font-size:clamp(14px,2vw,20px);color:inherit}
@media(max-width:1100px){.site-bar .sb-wide,.site-bar .sb-brand-name{display:none}.site-bar .sb-mid,.site-bar .sb-chip{display:inline}.site-bar .sb-menu .sb-menu-home{display:flex}}
@media(max-width:600px){body .site-bar.site-bar.site-bar{gap:8px;padding:0 10px;font-size:13px}.site-bar .sb-mid,.site-bar .sb-home{display:none!important}.site-bar .sb-small{display:inline}.site-bar .sb-page{padding-left:8px}.site-bar .header-actions{gap:0}}
@media(max-width:340px){body .site-bar.site-bar.site-bar{gap:5px;padding:0 6px;font-size:12px}.site-bar .sb-chip{padding:2px 4px}.site-bar .brand-home-link{gap:5px}.site-bar .sb-page{padding-left:5px}}
@media print{body .site-bar.site-bar.site-bar{display:none!important}}
/* 0113: 1~2개는 직접 버튼, 3개 이상은 좁은 화면에서만 접는다. */
body .site-bar.site-bar.site-bar #fullscreen-button,body .site-bar.site-bar.site-bar #reference-button{display:flex}
.site-bar .sb-direct{display:flex;align-items:center;gap:6px}
body .site-bar.site-bar.site-bar .sb-direct>a,body .site-bar.site-bar.site-bar .sb-direct>button,body .site-bar.site-bar.site-bar .screen-menu .sb-menu>a,body .site-bar.site-bar.site-bar .screen-menu .sb-menu>button{display:flex;align-items:center;justify-content:center;flex:none;width:auto;min-height:30px;height:30px;margin:0;padding:3px 8px;border:1px solid #ffffffb3;border-radius:6px;background:transparent;color:#fff;box-shadow:none;font:600 12px/1.4 'Malgun Gothic',system-ui,sans-serif;text-decoration:none;white-space:nowrap;cursor:pointer}
@media(min-width:601px){.site-bar .screen-menu::details-content{content-visibility:visible;display:contents}.site-bar .screen-menu{display:contents}.site-bar .screen-menu>summary{display:none}.site-bar .screen-menu>.sb-menu{position:static;display:flex;flex-direction:row;align-items:center;gap:6px;width:auto;max-width:none;padding:0;border:0;background:transparent;box-shadow:none;white-space:nowrap}}
@media(max-width:600px){body .site-bar.site-bar.site-bar .sb-direct>.sb-home,body .site-bar.site-bar.site-bar .screen-menu .sb-menu>.sb-home{display:flex!important}.site-bar .sb-direct{gap:4px}body .site-bar.site-bar.site-bar .sb-direct>a,body .site-bar.site-bar.site-bar .sb-direct>button{padding:3px 5px}.site-bar .sb-direct .sb-small{display:inline}.site-bar .sb-direct .sb-wide,.site-bar .sb-direct .sb-mid{display:none}body .site-bar.site-bar.site-bar .screen-menu .sb-menu>a,body .site-bar.site-bar.site-bar .screen-menu .sb-menu>button{justify-content:flex-start;width:100%;min-height:40px;height:auto;padding:8px 10px;border:0;background:white;color:var(--ink,#172e38);font-size:13px}.site-bar .screen-menu .sb-menu .sb-small{display:inline}}
@media(max-width:340px){body .site-bar.site-bar.site-bar .sb-direct>a,body .site-bar.site-bar.site-bar .sb-direct>button{font-size:11px;padding:3px}body .site-bar.site-bar.site-bar #printAll .sb-print-full{display:none}body .site-bar.site-bar.site-bar #printAll .sb-print-short{display:inline}}

.site-bar .sb-print-short{display:none}

'''

def render_bar(key, old='', source=None):
    c=json.loads(CONFIG.read_text(encoding='utf-8'))
    names=c['pages'][key]
    title=f"{names[0]} · {c['name']} | {c['school']}"
    local=lambda path:os.path.relpath(ROOT/path,source.parent).replace('\\','/') if source else '/'+Path(path).name
    logo=local(c['logo']);home=local('00_전기기능사_시퀀스_시각화_001-018/index.html') if source else '/'
    # 같은 DOM 버튼을 메뉴로 옮겨 기존 핸들러·id를 유지한다.
    buttons=[]
    for bid in ['fullscreen-button','reference-button','printAll']:
        button=re.search(r'<button\b[^>]*\bid="'+bid+r'"[^>]*>.*?</button>',old,re.S)
        if button:
            html=button.group()
            if bid=='printAll':
                html=re.sub(r' aria-label="[^"]*"', '', html)
                html=re.sub(r'>.*?</button>', ' aria-label="인쇄 / PDF 저장"><span class="sb-print-full">인쇄 / PDF 저장</span><span class="sb-print-short">인쇄</span></button>', html, count=1, flags=re.S)
                html=html.replace(' aria-label="인쇄 / PDF 저장" aria-label="인쇄 / PDF 저장"',' aria-label="인쇄 / PDF 저장"')
            buttons.append(html)
    engine_title=re.search(r'<h1\b[^>]*>(.*?)</h1>',old,re.S)
    lead=re.search(r'<p class="lead">.*?</p>',old,re.S)
    hidden=(f'<h1 class="brand-engine-title" hidden>{engine_title.group(1)}</h1>' if engine_title else '')+(lead.group() if lead else '')
    labels=''.join(f'<span class="sb-{size}">{escape(name)}</span>' for size,name in zip(['wide','mid','small'],names))
    home_button=(f'<a class="home-btn home-link sb-home" href="{home}" aria-label="학습 목차">'
                 '<span class="sb-wide">← 전체 목차</span><span class="sb-mid">← 목차</span><span class="sb-small">목차</span></a>')
    actions=home_button+''.join(buttons)
    if 1+len(buttons)>=3:
        actions=('<details class="screen-menu" data-html2canvas-ignore="true"><summary aria-label="화면 메뉴">≡</summary>'
                 f'<nav class="sb-menu" aria-label="화면 메뉴">{actions}</nav></details>')
    else:
        actions=f'<nav class="sb-direct" aria-label="화면 버튼">{actions}</nav>'
    return (f'<header class="page-header site-bar" data-brand-page="{key}" data-title="{escape(title)}" data-html2canvas-ignore="true">'
            f'<a class="brand-home-link" href="{home}" title="학습 목차"><img class="brand-logo" src="{logo}" width="24" height="24" alt="{escape(c["school"])}">'
            f'<span class="sb-brand-name">{escape(c["name"])}</span><span class="sb-chip">{escape(c["chip"])}</span></a>'
            f'<span class="sb-page">{labels}</span><div class="header-actions">{actions}</div>{hidden}</header>'),title

def brand_page(text,key,source=None):
    """여러 번 생성하거나 원본에서 다시 빌드해도 같은 머리말을 만든다."""
    c=json.loads(CONFIG.read_text(encoding='utf-8'))
    text=re.sub(r'\s*<style id="site-brand-style">.*?</style>','',text,flags=re.S)
    if key=='catalog':
        text=re.sub(r'<header class="page-header site-bar".*?</header>','',text,flags=re.S)
        bar,title=render_bar(key,source=source)
        text=text.replace('<div class="hero-inner">','<div class="hero-inner">'+bar,1)
        text=re.sub(r'<h1>.*?</h1>',lambda _:f'<h1>{escape(c["name"])}</h1>',text,count=1,flags=re.S)
        text=re.sub(r'<p class="hero-subtitle">.*?</p>','',text,flags=re.S)
        text=re.sub(r'(<h1>.*?</h1>)',lambda m:m.group()+f'<p class="hero-subtitle">{escape(c["subtitle"])}</p>',text,count=1,flags=re.S)
        title=f'{c["name"]} · 전기기능사 &amp; 승강기기능사 | {c["school"]}'
    else:
        match=re.search(r'<header\b[^>]*>.*?</header>',text,re.S)
        if not match:raise ValueError(f'머리말 없음: {key}')
        old=match.group();bar,title=render_bar(key,old,source)
        if key.endswith('.guide'):
            # 안내 본문을 보존하고 화면 머리말만 공통 규격으로 바꾼다.
            if 'site-bar' not in old:bar+=old.replace('<header','<div',1).replace('</header>','</div>')
        text=text[:match.start()]+bar+text[match.end():]
    if key=='catalog':
        def footer_nav(match):
            nav=match.group()
            school=re.search(r'<a\b[^>]*href="https://school\.busanedu\.net/kse-h"[^>]*>.*?</a>',nav,re.S)
            links=[school.group()] if school else []
            for chip in ['AIE','CBT']:
                site=next(s for s in c['sites'] if s['url']==f'https://{chip.lower()}.ksetech.org')
                name=escape(site['name'])
                links.append(f'<a href="{site["url"]}" target="_blank" rel="noopener noreferrer" aria-label="{name}"><span class="lg">{name}</span><span class="sm">{chip}</span></a>')
            return '<nav class="footer-nav" aria-label="관련 사이트">\n          '+'\n          '.join(links)+'\n        </nav>'
        text=re.sub(r'<nav class="footer-nav"[^>]*>.*?</nav>',footer_nav,text,flags=re.S)
    text=re.sub(r'<title>.*?</title>',lambda _:f'<title>{title}</title>',text,count=1,flags=re.S)
    text=text.replace('</head>',f'<style id="site-brand-style">{CSS}</style>\n</head>',1)
    return text

def targets():
    cat=ROOT/'00_전기기능사_시퀀스_시각화_001-018'
    for n in ['index.html','00_통합목차.html']:yield cat/n,'catalog'
    yield V2/'print/index.html','print'
    yield V2/'회로/interpret.html','001.interpret'
    for i in range(1,19):
        cid=f'{i:03d}';folder=next((cat/'01_개별_수업자료').glob(cid+'_*'))
        yield folder/'index.html',cid+'.sim'
        for name in ['guide.html','교사용_사용안내.html']:
            if (folder/name).exists():yield folder/name,cid+'.guide'
        yield V2/cid/'index.html',cid+'.pin'
        for stage in ['tb','wire']:yield V2/cid/stage/'index.html',cid+'.'+stage
    for i in range(1,11):
        cid=f'e{i:02d}'
        yield V2/cid/'index.html',cid+'.interpret'
        for stage in ['sim','pin','wire']:yield V2/cid/stage/'index.html',cid+'.'+stage

def main():
    for p,key in targets():
        old=p.read_text(encoding='utf-8-sig');new=brand_page(old,key,p)
        if new!=old:p.write_text(new,encoding='utf-8',newline='\n')
    print('공통 머리말 152개 생성')

if __name__=='__main__':main()
