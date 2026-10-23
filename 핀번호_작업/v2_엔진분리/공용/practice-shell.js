/* 네 단계 공통 결과 저장·공유. 이름·학번은 모든 화면에서 바로 보인다. */
(function () {
  'use strict';
  function submission(row, elements) {
    var group = document.createElement('section'); group.className = 'ps-submit'; group.setAttribute('aria-label', '결과 이미지 저장 및 공유');
    group.title = '이름과 학번을 적고 결과 이미지를 저장하거나 공유해서 내세요';
    var fields = document.createElement('div'), buttons = document.createElement('div'); fields.className = 'ps-fields'; buttons.className = 'ps-buttons';
    var shareSupported = false;
    try { shareSupported = !!(navigator.canShare && navigator.canShare({ files: [new File([''], 'a.png', {type:'image/png'})] })); } catch (_) {}
    elements.forEach(function (e) {
      if (!e) return;
      var input = e.querySelector('input');
      if (input) {
        var label = /Name$/.test(input.id) ? '이름' : '학번';
        input.placeholder = label; input.setAttribute('aria-label', label); input.title = group.title;
        Array.from(e.childNodes).filter(function (n) { return n.nodeType === 3; }).forEach(function (n) { n.remove(); });
        fields.appendChild(e);
      } else {
        if (/Save$/.test(e.id)) { e.textContent = '이미지 저장'; e.classList.add('primary'); }
        if (/Share$/.test(e.id)) { e.textContent = '공유'; e.disabled = false; e.hidden = !shareSupported; e.removeAttribute('title'); }
        buttons.appendChild(e);
      }
    });
    group.append(fields, buttons); row.appendChild(group);
    return { group: group };
  }
  // 0111 작성자 추가 승인: 원래 저장 기능이 없던 단자대의 결과 이미지를 만든다.
  function terminalSubmission(row) {
    var form = document.createElement('div');
    form.innerHTML = '<label><input id="psName" type="text" autocomplete="off"></label><label><input id="psId" type="text" autocomplete="off"></label><button id="psSave" type="button">이미지 저장</button><button id="psShare" type="button">공유</button>';
    var name = form.querySelector('#psName'), sid = form.querySelector('#psId');
    function fileName() {
      var id = sid.value.replace(/[^0-9A-Za-z-]/g, ''), d = new Date();
      return 'tb-' + document.body.dataset.circuit + (id ? '-' + id : '') + '-' + d.getFullYear() + ('0' + (d.getMonth()+1)).slice(-2) + ('0' + d.getDate()).slice(-2) + '.png';
    }
    function buildPng(cb) {
      var p = window.tbPage, order = p.order(), common = p.common(), keys = Object.keys(order.results), answered = Object.keys(common.ans);
      var lines = [
        '관 순서: 정답 ' + keys.filter(function(k){return order.results[k];}).length + ' / 응답 ' + keys.length + ' / 전체 ' + Object.keys(p.expected).length,
        '공통단자: 정답 ' + answered.filter(function(k){return common.ans[k] === common.list[k].same;}).length + ' / 응답 ' + answered.length + ' / 전체 ' + common.list.length,
        '단자대 칸 번호는 권장 배치 예시이며, 하나의 정답으로 채점하지 않습니다.'
      ];
      var wiring = window.PIN_WIRING[document.body.dataset.circuit];
      var host = document.createElement('div'); host.innerHTML = window.PANEL_RENDER.drawPiping(wiring, {strips:false});
      var svg = host.querySelector('svg'), vb = svg.viewBox.baseVal, width = 1500, pictureHeight = Math.ceil(width * vb.height / vb.width);
      svg.setAttribute('width',width); svg.setAttribute('height',pictureHeight);
      var canvas = document.createElement('canvas'); canvas.width = width; canvas.height = 230 + pictureHeight;
      var ctx = canvas.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle = '#172e38'; ctx.font = 'bold 28px "Malgun Gothic",sans-serif';
      ctx.fillText('전기기능사 ' + document.body.dataset.circuit + ' · 단자대 학습 결과',30,44);
      ctx.font = '20px "Malgun Gothic",sans-serif';
      var d = new Date(); ctx.fillText('이름 ' + (name.value || '(이름 없음)') + '   학번 ' + (sid.value || '(학번 없음)') + '   ' + d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate(),30,80);
      lines.forEach(function(line,i){ctx.fillText(line,30,118+i*32);});
      var img = new Image(); img.onload = function(){ctx.drawImage(img,0,230,width,pictureHeight);canvas.toBlob(cb,'image/png');};
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(svg));
    }
    form.querySelector('#psSave').onclick = function(){buildPng(function(blob){var a=document.createElement('a'),url=URL.createObjectURL(blob);a.href=url;a.download=fileName();a.click();setTimeout(function(){URL.revokeObjectURL(url);},1000);});};
    form.querySelector('#psShare').onclick = function(){buildPng(function(blob){navigator.share({files:[new File([blob],fileName(),{type:'image/png'})],title:'단자대 학습 결과'}).catch(function(){});});};
    submission(row,Array.from(form.children));
    return {buildPng:buildPng,fileName:fileName};
  }
  window.PRACTICE_SHELL = { submission: submission, terminalSubmission: terminalSubmission };
  if (document.body.dataset.stage !== 'wire') return;
  function wireSubmit() {
    var p = window.wirePage && window.wirePage.practice, row = document.querySelector('.wire-modebar');
    if (!p || !row) return false;
    document.body.classList.add('practice-shell-wire');
    var form = document.createElement('div');
    form.innerHTML = '<label>이름 <input id="psName" type="text" autocomplete="off"></label><label>학번 <input id="psId" type="text" autocomplete="off"></label><button id="psSave" type="button">이미지 저장</button><button id="psShare" type="button">공유</button>';
    var name = form.querySelector('#psName'), sid = form.querySelector('#psId'), save = form.querySelector('#psSave'), share = form.querySelector('#psShare');
    name.value = p.state.name; sid.value = p.state.sid;
    [name,sid].forEach(function (e) { e.oninput = function () { p.setStudent(name.value,sid.value); }; });
    save.onclick = function () { p.buildPng(function (blob) { var a = document.createElement('a'), url = URL.createObjectURL(blob); a.href = url; a.download = p.fileName(); a.click(); setTimeout(function () { URL.revokeObjectURL(url); }, 1000); }); };
    share.onclick = function () { p.buildPng(function (blob) { navigator.share({ files: [new File([blob],p.fileName(),{type:'image/png'})], title:'결선 실습 결과' }).catch(function () {}); }); };
    submission(row,Array.from(form.children)); return true;
  }
  if (!wireSubmit()) { var observer = new MutationObserver(function () { if (wireSubmit()) observer.disconnect(); }); observer.observe(document.body,{childList:true,subtree:true}); }
})();
