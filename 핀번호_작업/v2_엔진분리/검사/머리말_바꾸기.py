#!/usr/bin/env python3
"""0111 공통 머리말 생성. 인자 없이 전체, 인자로 v2 상대 HTML 경로 지정."""
import sys
from site_brand import V2, brand_page, targets, main
if __name__ == '__main__':
    if not sys.argv[1:]:main()
    else:
        keys={p.resolve():key for p,key in targets()}
        for rel in sys.argv[1:]:
            p=(V2/rel).resolve()
            if p not in keys:raise ValueError(f'브랜드 데이터에 없는 페이지: {rel}')
            p.write_text(brand_page(p.read_text(encoding='utf-8'),keys[p],p),encoding='utf-8',newline='\n')
