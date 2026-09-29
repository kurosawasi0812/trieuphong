const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('#main-nav');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
}

document.querySelectorAll('.main-nav a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  });
}, {threshold: 0.12});
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.main-nav a')];
const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
  });
}, {rootMargin: '-42% 0px -52% 0px', threshold: 0});
sections.forEach(s => navObserver.observe(s));

const toTop = document.querySelector('#to-top');
window.addEventListener('scroll', () => toTop?.classList.toggle('show', window.scrollY > 500), {passive:true});
toTop?.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

const quizData = [
  {
    q: 'Triệu Phong chính thức thuộc bản đồ nước Đại Việt từ năm nào?',
    options: ['1306', '1469', '1604'], answer: 0,
    why: 'Bài nguồn lấy năm 1306 làm mốc khi hai châu Ô – Rý được sáp nhập vào Đại Việt.'
  },
  {
    q: 'Năm 1950, huyện Triệu Phong từ 14 xã được sáp nhập thành bao nhiêu xã lớn?',
    options: ['8 xã', '10 xã', '12 xã'], answer: 1,
    why: 'Theo bài nguồn, năm 1950 thực hiện chủ trương sáp nhập 14 xã thành 10 xã lớn.'
  },
  {
    q: 'Theo bài nguồn, phần lớn người Kinh ở Triệu Phong có nguồn gốc di cư từ đâu?',
    options: ['Thanh – Nghệ – Tĩnh', 'Đồng bằng sông Hồng', 'Nam Trung Bộ'], answer: 0,
    why: 'Bài viết cho biết phần lớn nguồn gốc được các gia phả ghi nhận là từ Thanh – Nghệ – Tĩnh.'
  },
  {
    q: 'Ai được bài nguồn giới thiệu là người làm lịch âm dương Hiệp kỷ?',
    options: ['Lương Văn Quán', 'Nguyễn Văn Tú', 'Nguyễn Hữu Thận'], answer: 2,
    why: 'Nguyễn Hữu Thận, người làng Đại Hào, được bài nguồn giới thiệu với đóng góp về thiên văn và lịch pháp.'
  },
  {
    q: 'Câu đối nào được bài nguồn dẫn lại ở Cổ Thành?',
    options: ['Triệu tạo nên xưa lưu nghiệp lớn, / Phong hanh vận mới mở hôm nay.', 'Nước non ngàn dặm một lòng son. / Quê hương bốn biển một mái nhà.', 'Sông núi Việt Nam / muôn đời bền vững.'], answer: 0,
    why: 'Đây là bản dịch nghĩa của câu đối “Triệu tạo sơ cơ lưu vĩnh tích, / Phong hanh vận hội đáo kim lai.”'
  }
];

let quizIndex = 0;
let quizScore = 0;
let selected = null;
const quizBox = document.querySelector('#quiz-box');
const progress = document.querySelector('#quiz-progress');
const nextBtn = document.querySelector('#quiz-next');
const restartBtn = document.querySelector('#quiz-restart');
const resultBox = document.querySelector('#quiz-result');

function renderQuestion() {
  selected = null;
  const item = quizData[quizIndex];
  progress.textContent = `${String(quizIndex + 1).padStart(2,'0')} / ${quizData.length}`;
  quizBox.innerHTML = `
    <div class="quiz-question">
      <h3>${item.q}</h3>
      <div class="quiz-options">
        ${item.options.map((opt, i) => `
          <button class="quiz-option" data-index="${i}">
            <span class="quiz-marker">${String.fromCharCode(65+i)}</span>
            <span>${opt}</span>
          </button>`).join('')}
      </div>
    </div>`;
  quizBox.querySelectorAll('.quiz-option').forEach(btn => {
    btn.addEventListener('click', () => {
      quizBox.querySelectorAll('.quiz-option').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selected = Number(btn.dataset.index);
    });
  });
  nextBtn.textContent = quizIndex === quizData.length - 1 ? 'Chấm điểm' : 'Câu tiếp theo →';
  nextBtn.disabled = false;
  resultBox.classList.add('hidden');
  restartBtn.classList.add('hidden');
}

nextBtn?.addEventListener('click', () => {
  if (selected === null) {
    nextBtn.animate([{transform:'translateX(0)'},{transform:'translateX(-5px)'},{transform:'translateX(5px)'},{transform:'translateX(0)'}],{duration:280});
    return;
  }
  if (selected === quizData[quizIndex].answer) quizScore++;
  if (quizIndex < quizData.length - 1) {
    quizIndex++;
    renderQuestion();
  } else {
    quizBox.querySelectorAll('.quiz-option').forEach((btn, i) => {
      btn.disabled = true;
      if (i === quizData[quizIndex].answer) btn.classList.add('correct');
      if (i === selected && selected !== quizData[quizIndex].answer) btn.classList.add('wrong');
    });
    const percent = Math.round((quizScore / quizData.length) * 100);
    progress.textContent = 'HOÀN TẤT';
    resultBox.classList.remove('hidden');
    resultBox.innerHTML = `<strong>Điểm: ${quizScore} / ${quizData.length} (${percent}%)</strong><br>${percent >= 80 ? 'Bạn đã nắm khá chắc các mốc chính của bài.' : 'Hãy xem lại dòng thời gian và phần con người để nhớ sâu hơn.'}`;
    nextBtn.classList.add('hidden');
    restartBtn.classList.remove('hidden');
  }
});

restartBtn?.addEventListener('click', () => {
  quizIndex = 0; quizScore = 0; selected = null;
  nextBtn.classList.remove('hidden');
  restartBtn.classList.add('hidden');
  renderQuestion();
});

renderQuestion();
