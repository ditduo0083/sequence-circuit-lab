#!/usr/bin/env python3
"""Copy a working circuit example to a new directory; never overwrite a project."""

import argparse
import json
import shutil
from pathlib import Path


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--variant', required=True, choices=('sequential', 'alternating'))
    parser.add_argument('--output', required=True, type=Path)
    args = parser.parse_args()
    skill_root = Path(__file__).resolve().parent.parent
    source = skill_root / 'assets' / 'templates' / args.variant
    destination = args.output.expanduser().resolve()
    if not (source / 'index.html').is_file():
        parser.error('The bundled example is missing index.html.')
    if destination.exists():
        parser.error('Output already exists. Choose a new directory; no files were changed.')
    if destination == skill_root or skill_root in destination.parents:
        parser.error('Choose an output directory outside the installed skill.')
    # 공단 도면 이미지·PDF는 복사하지 않는다 (2026-09-20 저작권 규칙)
    shutil.copytree(source, destination,
                    ignore=shutil.ignore_patterns('참고자료', '*.png', '*.jpg', '*.jpeg', '*.pdf'))
    origin = {
        'skill': 'sequence-circuit-visualizer',
        'example': args.variant,
        'adaptation_required': True,
        'note': 'This is a reference circuit, not an interpretation of a new diagram. Adapt the model, wiring, lessons, reference notice (Q-Net link, no source images) and tests together.'
    }
    (destination / '_template-origin.json').write_text(
        json.dumps(origin, ensure_ascii=False, indent=2) + '\n', encoding='utf-8'
    )
    print(json.dumps({'output': str(destination), 'example': args.variant,
                      'adaptation_required': True}, ensure_ascii=False))


if __name__ == '__main__':
    main()
