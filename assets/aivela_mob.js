// let height = window.innerHeight

// function lazyLoad() {
//   const imgs = document.querySelectorAll('[data-src]')

//   for (let i = 0; i < imgs.length; i++) {
//     let rect = imgs[i].getBoundingClientRect() // 获取元素的集合属性
//     // console.log(rect.bottom, rect.top);

//     if (rect.bottom > 0 && rect.top < height) {
//       imgs[i].src = imgs[i].getAttribute('data-src')

//       imgs[i].onload = function () {   // 图片被浏览器加载完毕
//         // 图片加载完毕后，刷新 ScrollTrigger
//         ScrollTrigger.refresh();
//         imgs[i].removeAttribute('data-src')
//       }
//     }
//   }
// }

// lazyLoad()

// window.addEventListener('scroll', lazyLoad)

/**
 * 通用swiper进度条初始化
 * @param {string} containerClass 传入如 '.container_two'
 */
function initSwiper(containerSelector, options = {}) {
  // 兼容老用法
  if (window.innerWidth >= 767) return; // 只在移动端

  // 解析参数
  const { mode = 'progress', autoplay = false, interval = 3000 } = options;

  // 支持多个容器
  const containers = document.querySelectorAll(containerSelector);

  containers.forEach(container => {
    if (!container) return;

    // 0. 给当前元素增加类名swiper-box
    container.classList.add('swiper-box');

    // 1. 处理swiper-wrapper
    let wrapper = container.querySelector('.swiper-wrapper');
    if (!wrapper) {
      // 取第一个子元素作为wrapper
      wrapper = container.children[0];
      if (!wrapper) return;
      wrapper.classList.add('swiper-wrapper');
    }

    // 2. 处理swiper-slide
    Array.from(wrapper.children).forEach(child => {
      child.classList.add('swiper-slide');
    });

    const slides = wrapper.querySelectorAll('.swiper-slide');
    if (!slides.length) return;
    const slideCount = slides.length;
    const slideWidth = slides[0].offsetWidth + 15; // 15为gap，可根据实际调整

    // 进度条模式
    if (mode === 'progress') {
      // 3. 插入进度条
      let progress = container.querySelector('.swiper-progress');
      if (!progress) {
        progress = document.createElement('div');
        progress.className = 'swiper-progress';
        const bar = document.createElement('div');
        bar.className = 'swiper-progress-bar';
        progress.appendChild(bar);
        container.appendChild(progress);
      }
      const progressBar = progress.querySelector('.swiper-progress-bar');

      // 5. 初始化当前progressBar的进度（分段型）
      function updateProgressBar() {
        // 当前卡片索引
        const currentIdx = Math.round(wrapper.scrollLeft / slideWidth);
        // 分段进度：当前卡片（从1开始）/ 总卡片数
        const percent = ((currentIdx + 1) / slideCount) * 100;
        progressBar.style.width = percent + '%';
      }
      if (slides.length) {
        updateProgressBar();
      }

      // 4. 监听滚动
      wrapper.addEventListener('scroll', updateProgressBar);

      // 6. 进度条拖动功能
      let isDragging = false;
      let startX = 0;
      let barStartWidth = 0;

      progressBar.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        barStartWidth = progressBar.offsetWidth;
        document.body.style.userSelect = 'none'; // 防止选中文字
      });

      progress.addEventListener('mousedown', (e) => {
        // 允许点击进度条任意位置直接跳转
        const progressRect = progress.getBoundingClientRect();
        let deltaX = e.clientX - progressRect.left;
        deltaX = Math.max(0, Math.min(deltaX, progressRect.width));
        const percent = deltaX / progressRect.width;
        const maxScrollLeft = wrapper.scrollWidth - wrapper.clientWidth;
        wrapper.scrollLeft = percent * maxScrollLeft;
      });

      document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const progressRect = progress.getBoundingClientRect();
        let deltaX = e.clientX - progressRect.left;
        deltaX = Math.max(0, Math.min(deltaX, progressRect.width));
        const percent = deltaX / progressRect.width;
        const maxScrollLeft = wrapper.scrollWidth - wrapper.clientWidth;
        progressBar.style.width = `${percent * 100}%`;
        wrapper.scrollLeft = percent * maxScrollLeft;
      });

      document.addEventListener('mouseup', () => {
        if (isDragging) {
          isDragging = false;
          document.body.style.userSelect = '';
        }
      });

      // 兼容移动端
      progressBar.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].clientX;
        barStartWidth = progressBar.offsetWidth;
        document.body.style.userSelect = 'none';
      }, { passive: false });

      progress.addEventListener('touchstart', (e) => {
        // 允许点击进度条任意位置直接跳转（移动端）
        const progressRect = progress.getBoundingClientRect();
        let deltaX = e.touches[0].clientX - progressRect.left;
        deltaX = Math.max(0, Math.min(deltaX, progressRect.width));
        const percent = deltaX / progressRect.width;
        const maxScrollLeft = wrapper.scrollWidth - wrapper.clientWidth;
        wrapper.scrollLeft = percent * maxScrollLeft;
      }, { passive: false });

      document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const progressRect = progress.getBoundingClientRect();
        let deltaX = e.touches[0].clientX - progressRect.left;
        deltaX = Math.max(0, Math.min(deltaX, progressRect.width));
        const percent = deltaX / progressRect.width;
        const maxScrollLeft = wrapper.scrollWidth - wrapper.clientWidth;
        progressBar.style.width = `${percent * 100}%`;
        wrapper.scrollLeft = percent * maxScrollLeft;
      }, { passive: false });

      document.addEventListener('touchend', () => {
        if (isDragging) {
          isDragging = false;
          document.body.style.userSelect = '';
        }
      });
    } else if (mode === 'dots') {
      // 点状导航模式
      let dots = container.querySelector('.swiper-dots');
      if (!dots) {
        dots = document.createElement('div');
        dots.className = 'swiper-dots';
        for (let i = 0; i < slideCount; i++) {
          const dot = document.createElement('span');
          dot.className = 'swiper-dot' + (i === 0 ? ' active' : '');
          dot.addEventListener('click', () => {
            wrapper.scrollTo({ left: i * slideWidth, behavior: 'smooth' });
            setActiveDot(i);
          });
          dots.appendChild(dot);
        }
        container.appendChild(dots);
      }
      function setActiveDot(idx) {
        const allDots = dots.querySelectorAll('span');
        allDots.forEach((dot, i) => {
          dot.classList.toggle('active', i === idx);
        });
      }
      // 滚动时高亮当前点
      wrapper.addEventListener('scroll', () => {
        const idx = Math.round(wrapper.scrollLeft / slideWidth);
        setActiveDot(idx);
      });
      // 初始化高亮
      setActiveDot(0);
    } else if (mode === 'paragraph') {
      // 计算每段显示几个slide
      let slidesPerView = Math.floor(wrapper.offsetWidth / slideWidth) || 1;
      let pageCount = Math.ceil(slideCount / slidesPerView);

      // 创建分页导航
      let pages = container.querySelector('.swiper-pages');
      function createPages() {
        // 移除旧的
        if (pages) pages.remove();
        pages = document.createElement('div');
        pages.className = 'swiper-pages';
        for (let i = 0; i < pageCount; i++) {
          const pageBtn = document.createElement('span');
          pageBtn.className = 'swiper-page' + (i === 0 ? ' active' : '');
          pageBtn.addEventListener('click', () => {
            wrapper.scrollTo({ left: i * slidesPerView * slideWidth, behavior: 'smooth' });
            setActivePage(i);
          });
          pages.appendChild(pageBtn);
        }
        container.appendChild(pages);
      }

      function setActivePage(idx) {
        const allPages = pages.querySelectorAll('span');
        allPages.forEach((page, i) => {
          page.classList.toggle('active', i === idx);
        });
      }

      // 滚动时高亮当前分页
      wrapper.addEventListener('scroll', () => {
        const idx = Math.round(wrapper.scrollLeft / (slidesPerView * slideWidth));
        setActivePage(idx);
      });

      // 监听窗口resize，自动适配
      function handleResize() {
        slidesPerView = Math.floor(wrapper.offsetWidth / slideWidth) || 1;
        pageCount = Math.ceil(slideCount / slidesPerView);
        createPages();
        setActivePage(Math.round(wrapper.scrollLeft / (slidesPerView * slideWidth)));
      }
      window.addEventListener('resize', handleResize);

      // 初始化
      createPages();
      setActivePage(0);
    }

    // 自动轮播
    if (autoplay && slideCount > 1) {
      let currentIdx = 0;
      let timer = null;
      let isPaused = false;
      function goTo(idx) {
        wrapper.scrollTo({ left: idx * slideWidth, behavior: 'smooth' });
        if (mode === 'dots') {
          const dots = container.querySelector('.swiper-dots');
          if (dots) {
            const allDots = dots.querySelectorAll('span');
            allDots.forEach((dot, i) => {
              dot.classList.toggle('active', i === idx);
            });
          }
        }
      }
      function next() {
        if (isPaused) return;
        currentIdx = (currentIdx + 1) % slideCount;
        goTo(currentIdx);
      }
      function startTimer() {
        if (timer) clearInterval(timer);
        timer = setInterval(next, interval);
      }
      function stopTimer() {
        if (timer) clearInterval(timer);
      }
      startTimer();
      // 鼠标悬停暂停
      container.addEventListener('mouseenter', () => { isPaused = true; stopTimer(); });
      container.addEventListener('mouseleave', () => { isPaused = false; startTimer(); });
      // 用户手动滚动时，重置currentIdx为当前slide，并重置timer（未暂停时）
      wrapper.addEventListener('scroll', () => {
        const idx = Math.round(wrapper.scrollLeft / slideWidth);
        currentIdx = idx;
        if (!isPaused) {
          startTimer();
        }
      });
    }
  });
}

let tags = '';

// container_one 视频播放一次后显示logo。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。
// 获取视频和logo元素
let videoOne = null

videoOne = document.getElementById('video_two');
const logoOne = document.querySelector('.c_one_logo');

// 初始化：确保logo不可见
if (logoOne) logoOne.style.opacity = '0';

if (videoOne) {
  // 使用timeupdate事件监听视频的播放进度
  videoOne.addEventListener('timeupdate', function () {
    // 获取视频总时长
    const duration = videoOne.duration;
    // 获取当前播放时间
    const currentTime = videoOne.currentTime;

    // 如果视频时长已知且当前播放时间在视频结束前1秒内
    if (duration && (duration - currentTime) <= 2.7) {
      // 显示logo
      logoOne.style.opacity = '1';
    }
  });
}


// container_two 卡片进入视口时的动画。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。
initSwiper('.container_two', { mode: 'paragraph' });



// container_three 卡片进入视口时的动画。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。
tags = '.container_three';
let $three_section = $(tags)
let $three_big_box = $(`${tags} .big_box img.MOB`)
// 图片缩放动画
ScrollTrigger.create({
  trigger: $three_section,
  start: "-80% top",   // 百分比越大 动画提早开始
  end: "+=500", // 缩放动画结束
  scrub: true,
  // markers: true,
  animation: gsap.timeline()
    .fromTo($three_big_box,
      { opacity: 0.3, scale: 0.2 },
      { opacity: 1, scale: 1 }
    )
});

// 第三屏幕文字动画，缩放结束后pin住section1
ScrollTrigger.create({
  trigger: $three_section,
  start: "-260px top", // 与上一个end对齐
  end: "+=500", // 文字动画持续距离，可根据实际调整
  scrub: true,
  // markers: true,
  animation: gsap.timeline()
    .fromTo(`${tags} .top>.title`,
      { y: 120, opacity: 0 },
      { y: 0, opacity: 1 }
    )
    .fromTo(`${tags} .top>.text`,
      { y: 120, opacity: 0 },
      { y: 0, opacity: 1 }
    )
    .fromTo(`${tags} .bottom .bottom_card.left`,
      { x: 120, opacity: 0 },
      { x: 0, opacity: 1 }
    )
    .fromTo(`${tags} .bottom .bottom_card.right`,
      { x: -120, opacity: 0 },
      { x: 0, opacity: 1 }
    )
});


// container_five 卡片进入视口时的动画。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。
tags = '.container_five';
let $five_section = $(tags)
// 第五屏幕图片缩放动画
ScrollTrigger.create({
  trigger: $five_section,
  start: "-60% top",   // 百分比越大 动画提早开始
  end: "+=600", // 缩放动画结束
  scrub: true,
  // markers: true,
  animation: gsap.timeline()
    .fromTo(`${tags} .text .title`,
      { y: 120, opacity: 0 },
      { y: 0, opacity: 1 }
    )
    .fromTo(`${tags} .text .five_img`,
      { x: -100, opacity: 0 },
      { x: 0, opacity: 1 }
    )
    .fromTo(`${tags} .text p`,
      { y: 120, opacity: 0 },
      { y: 0, opacity: 1 }
    )

});


// container_six 卡片进入视口时的动画。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。
// tags = '.section_six .container_six';
// let $six_section = $(tags);
// let currentSlide = 0;
// const totalSlides = 4;

// const texList = Array.from(document.querySelectorAll('.section_six .container_six .banner_column .tex'));
// let currentIndex = texList.findIndex(tex => tex.classList.contains('visible'));
// if (currentIndex === -1) currentIndex = 0;

// // 初始化所有tex
// texList.forEach((tex, idx) => {
//   tex.style.height = '40px';
//   tex.style.opacity = '0.2';
//   const p = tex.querySelector('p');
//   const bannerRows = tex.querySelector('.banner_rows');
//   if (p) {
//     p.style.opacity = '0';
//     if (idx == 0) {
//       p.style.transform = 'translateY(-100px)';
//     } else {
//       p.style.transform = 'translateY(100px)';
//     }
//     p.style.transition = 'opacity 1s, transform 1s';
//     p.classList.remove('animate-top-to-bottom', 'animate-out-top');
//   }
//   if (bannerRows) {
//     bannerRows.style.opacity = '0';
//     bannerRows.classList.remove(
//       'animate-top-to-bottom', 'animate-left-to-right', 'animate-bottom-to-top',
//       'animate-out-top', 'animate-out-left', 'animate-out-bottom'
//     );
//   }
// });

// // 展开当前index的tex
// function showTex(idx) {
//   // 记录当前有visible的tex
//   const prevVisibleTex = texList.find(tex => tex.classList.contains('visible'));
//   texList.forEach((tex, i) => {
//     const p = tex.querySelector('p');
//     const bannerRows = tex.querySelector('.banner_rows');
//     if (i === idx) {
//       tex.classList.add('visible');
//       // 先让内容可见，移除动画类，保证scrollHeight准确
//       if (p) {
//         p.style.opacity = '1';
//         p.style.transform = 'translateY(0)';
//         p.classList.remove('animate-top-to-bottom', 'animate-out-top');
//       }
//       if (bannerRows) {
//         bannerRows.style.opacity = '1';
//         bannerRows.classList.remove(
//           'animate-top-to-bottom', 'animate-left-to-right', 'animate-bottom-to-top',
//           'animate-out-top', 'animate-out-left', 'animate-out-bottom'
//         );
//       }
//       // 现在再计算高度
//       const contentHeight = tex.scrollHeight < 555 ? 555 : tex.scrollHeight;

//       tex.style.height = contentHeight + 'px';
//       tex.style.opacity = '1';
//       // 再加动画
//       if (p) {
//         p.style.transitionDelay = '0.2s';

//         if (i === 0) {
//           p.classList.add('animate-top-to-bottom');
//         } else {
//           p.classList.remove('animate-top-to-bottom');
//         }
//       }
//       if (bannerRows) {
//         if (tex.classList.contains('text_one')) {
//           bannerRows.classList.add('animate-top-to-bottom');
//         } else if (tex.classList.contains('text_two')) {
//           bannerRows.classList.add('animate-left-to-bottom');
//         } else if (tex.classList.contains('text_three') || tex.classList.contains('text_four')) {
//           bannerRows.classList.add('animate-bottom-to-top');
//         }
//       }
//     } else {
//       // 只有之前有visible的tex的p才加移出动画
//       if (p) {
//         p.style.transitionDelay = '0.2s';
//         p.style.opacity = '0';
//         if (i == 0) {
//           p.style.transform = 'translateY(-100px)';
//         } else {
//           p.style.transform = 'translateY(100px)';
//         }
//         p.classList.remove('animate-top-to-bottom');
//         if (tex === prevVisibleTex) {
//           p.classList.add('animate-out-top');
//           p.addEventListener('animationend', function handler(e) {
//             if (e.animationName === 'slideOutToTop') {
//               p.classList.remove('animate-out-top');
//               p.removeEventListener('animationend', handler);
//             }
//           });
//         } else {
//           p.classList.remove('animate-out-top');
//         }
//       }
//       // 先移除移入动画类
//       if (bannerRows) {
//         bannerRows.classList.remove(
//           'animate-top-to-bottom', 'animate-left-to-right', 'animate-bottom-to-top',
//           'animate-out-top', 'animate-out-left', 'animate-out-bottom'
//         );
//         // 添加移出动画
//         if (tex.classList.contains('text_one')) {
//           bannerRows.classList.add('animate-out-top');
//         } else if (tex.classList.contains('text_two')) {
//           bannerRows.classList.add('animate-out-top');
//         } else if (tex.classList.contains('text_three') || tex.classList.contains('text_four')) {
//           bannerRows.classList.add('animate-out-top');
//         }
//         bannerRows.addEventListener('animationend', function handler(e) {
//           if (
//             e.animationName === 'slideOutToTop' ||
//             e.animationName === 'slideOutToLeft' ||
//             e.animationName === 'slideOutToBottom'
//           ) {
//             bannerRows.style.opacity = '0';
//             bannerRows.classList.remove('animate-out-top', 'animate-out-left', 'animate-out-bottom');
//             bannerRows.removeEventListener('animationend', handler);
//           }
//         });
//       }
//       tex.classList.remove('visible');
//       tex.style.height = '40px';
//       tex.style.opacity = '0.2';
//     }
//   });
// }

// // 页面初始显示
// showTex(currentIndex);

// // section_six 给这个元素做监听
// // 监听内容为：当这个元素的顶部已经进入整个进入视口的时候，在拖动的时候，就进行移动端模拟拖动，可以用下方的移动端 touch 事件
// let $six_section1 = document.querySelector('.section_six');
// // 获取初始的位置
// let is_get_init_top = false;
// let init_top = 0;
// let is_jianting = true

// let startY = 0;
// let isActive = false;

// // 判断 section_six 顶部是否进入视口
// function isSectionSixInView() {
//   if (!$six_section1) return false;
//   const rect = $six_section1.getBoundingClientRect();

//   if (!is_get_init_top) {
//     init_top = rect.top
//     is_get_init_top = true
//   }
//   // 顶部进入视口且底部还未离开
//   return rect.top <= 0 && rect.bottom > 0;
// }



// // 监听滚动，判断 section_six 是否激活
// window.addEventListener('scroll', function () {
//   if (is_jianting) {
//     isActive = isSectionSixInView();
//   }

//   // 当$six_section1.getBoundingClientRect().top > 1000 后重置一下
//   if ($six_section1.getBoundingClientRect().top > 1000) {
//     $six_section1.style.height = '10000px';
//     $six_section1.style.position = 'sticky';
//     currentIndex = 0
//     showTex(currentIndex);
//     is_jianting = true
//   }

// });

// // 移动端 touch 事件
// function handleTouchStart(e) {
//   if (!isActive) return;
//   e.preventDefault(); // 阻止默认行为，兼容iOS
//   startY = e.touches[0].clientY;

// }

// function handleTouchEnd(e) {
//   if (!isActive) return;
//   e.preventDefault(); // 阻止默认行为，兼容iOS
//   // 简单模拟下滑切换
//   let endY = e.changedTouches[0].clientY;
//   if (endY - startY < -30) { // 向上滑动
//     console.log('向上滑动111');
//     currentIndex = (currentIndex + 1) % texList.length;
//     showTex(currentIndex);
//   } else if (endY - startY > 30) { // 向下滑动
//     console.log('向下滑动11');
//     currentIndex = (currentIndex - 1 + texList.length) % texList.length;
//   }

//   // 如果滑动到最后一个
//   if (currentIndex === texList.length - 1) {

//     isActive = false
//     is_jianting = false

//     setTimeout(() => {
//       $six_section1.style.height = 'auto';
//       $six_section1.style.position = 'relative';
//       // 刷新 ScrollTrigger
//       ScrollTrigger.refresh()

//       // 恢复到 section_six 进入视口时的黏顶位置
//       // 直接设置 scrollTop，避免一闪而过
//       document.documentElement.scrollTop = init_top;
//       document.body.scrollTop = init_top;

//     }, 1000);
//   }

// }


// $six_section1.addEventListener('touchstart', handleTouchStart, { passive: false });
// $six_section1.addEventListener('touchend', handleTouchEnd, { passive: false });

// 分屏滚动逻辑
// let sexTrg = ScrollTrigger.create({
//   trigger: $six_section,
//   start: "top top",
//   end: "+=10000", // 先随便写，后面会动态解除
//   scrub: true,
//   // 固定屏幕
//   pin: true,
//   // markers: true,
// });



// 移动端 touch 事件
// let startY = 0;
// function handleTouchStart(e) {
//   startY = e.touches[0].clientY;
// }
// function handleTouchEnd(e) {
//   if (!sexTrg.isActive) return; // 只有pin住时才响应
//   currentIndex = (currentIndex + 1) % texList.length;
//   showTex(currentIndex);
//   // 当 currentIndex == texList.length 的时候，去除sexTrg 的pin 效果
//   if (currentIndex === texList.length - 1) {
//     sexTrg.disable(); // 刷新 ScrollTrigger 以应用更改
//     ScrollTrigger.refresh()
//     // 获取之前在的位置，并且无感滚动到这里
//     // 记录当前滚动位置
//     const prevScrollY = window.scrollY;
//     // 解除 pin 后，滚动到之前的位置，避免页面跳动
//     setTimeout(() => {
//       window.scrollTo({ top: prevScrollY, behavior: 'auto' });
//     }, 50);



//   }

// }
// window.addEventListener('touchstart', handleTouchStart, { passive: false });
// window.addEventListener('touchend', handleTouchEnd, { passive: false });



// container_seven 卡片进入视口时的动画。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。

// 当 .container_seven 元素距离视口顶部 50% 时，自动播放 .container_seven .summary.MOB 视频
function playSevenMobVideoOnScroll() {
  const container = document.querySelector('.container_seven');
  const video = document.querySelector('.container_seven .summary.MOB');
  if (!container || !video) return;

  let hasPlayed = false; // 标记是否已经播放过

  function checkAndPlay() {
    if (hasPlayed) return; // 已经播放过则不再执行
    const rect = container.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    // 判断 container 的顶部是否到达视口 50%
    if (rect.top <= viewportHeight * 0.5 && rect.bottom > viewportHeight * 0.5) {
      if (video.paused) {
        video.currentTime = 0;
        video.play();
        hasPlayed = true;
        window.removeEventListener('scroll', checkAndPlay, { passive: true }); // 移除监听，节省性能
      }
    }
  }

  window.addEventListener('scroll', checkAndPlay, { passive: true });
  // 初始检查
  checkAndPlay();
}

// DOMContentLoaded 后执行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', playSevenMobVideoOnScroll);
} else {
  playSevenMobVideoOnScroll();
}









// tags = '.container_seven';
// let $seven_section = $(tags)
// let sevenTextAnimated = false;

// // 新版
// ScrollTrigger.create({
//   trigger: $seven_section,
//   start: "top top",
//   end: "+=1000",
//   pin: true,
// });

// ScrollTrigger.create({
//   trigger: `.container_seven .summary-content`,
//   start: "200px top",
//   scrub: true,
//   // markers: true,
//   animation: gsap
//     .timeline()
//     .fromTo(
//       ".container_seven .summary.MOB",
//       { y: -20 },
//       {
//         y: 0,
//         onStart() {
//           // onStart: 在动画开始时调用
//           const video1 = document.querySelector(".container_seven .summary.MOB");
//           video1.currentTime = 0;
//           video1.play();
//         },
//         // duration: 3
//       },
//     )
//     .fromTo('.container_seven .text .title',
//       { y: -120, opacity: 0 },
//       { y: 0, opacity: 1 },
//       ">"
//     )
//     .fromTo('.container_seven .text .desc',
//       { y: -120, opacity: 0 },
//       { y: 0, opacity: 1, delay: 0.5 },
//     )
// });


// 旧版

// // ⚡️ 平滑插值用的全局变量
// let targetTime = 0;
// let currentTime = 0;

// // ⚡️ 获取video元素
// const summary = document.querySelector(".summary.MOB");

// // ⚡️ 启动平滑更新循环
// function smoothVideoUpdate() {
//   if (summary && summary.readyState >= 2) {
//     // 用0.15的缓动因子平滑追赶
//     currentTime += (targetTime - currentTime) * 0.15;
//     summary.currentTime = currentTime;
//   }
//   requestAnimationFrame(smoothVideoUpdate);
// }
// smoothVideoUpdate();

// ScrollTrigger.create({
//   trigger: $seven_section,
//   start: "top top",
//   end: "+=1000",
//   scrub: true,
//   // 固定屏幕
//   pin: true,
//   // markers: true,
//   onUpdate(self) {
//     // ✅ 只更新 targetTime，由 requestAnimationFrame 缓动播放
//     if (summary && summary.duration) {
//       targetTime = self.progress * summary.duration;
//     }
//   },
//   animation: gsap
//     .timeline()
//     .fromTo('.container_seven .text .title',
//       { y: 0, opacity: 0 },
//       { y: 0, opacity: 0, duration: 3 }
//     )
//     .fromTo('.container_seven .text .title',
//       { y: -120, opacity: 0 },
//       { y: 0, opacity: 1 }
//     )
//     .fromTo('.container_seven .text .desc',
//       { y: -120, opacity: 0 },
//       { y: 0, opacity: 1, delay: 0.5 }
//     )
// });

// const video = document.querySelector('.container_seven .summary.MOB');
// let hasAnimated = false;

// if (video) {
//   video.addEventListener('timeupdate', function () {
//     if (!hasAnimated && video.duration && video.currentTime / video.duration >= 0.8) {
//       hasAnimated = true;
//       gsap.fromTo('.container_seven .text .title',
//         { y: -120, opacity: 0 },
//         { y: 0, opacity: 1 }
//       );
//       gsap.fromTo('.container_seven .text .desc',
//         { y: -120, opacity: 0 },
//         { y: 0, opacity: 1, delay: 0.5 }
//       );
//     }
//     // 如果你想回退时可以再次触发动画，可以加下面这段
//     if (hasAnimated && video.currentTime / video.duration < 0.75) {
//       hasAnimated = false;
//       gsap.fromTo('.container_seven .text .desc',
//         { y: 0, opacity: 1 },
//         { y: -120, opacity: 0 }
//       );
//       gsap.fromTo('.container_seven .text .title',
//         { y: 0, opacity: 1 },
//         { y: -120, opacity: 0, delay: 0.5 }
//       );

//     }
//   });
// }


// container_eight 卡片进入视口时的动画。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。
tags = '.container_eight';
let $eight_section = $(tags)
let $eight_big_box = $(`${tags} .big_box>img.MOB`)
// 图片缩放动画
ScrollTrigger.create({
  trigger: $eight_section,
  start: "-80% top",   // 百分比越大 动画提早开始
  end: "+=500", // 缩放动画结束
  scrub: true,
  // markers: true,
  animation: gsap.timeline()
    .fromTo($eight_big_box,
      { opacity: 0.3, scale: 0.2 },
      { opacity: 1, scale: 1 }
    )
});

// 文字缩放动画，缩放结束后pin住section1
ScrollTrigger.create({
  trigger: $eight_section,
  start: "top top",   // 百分比越大 动画提早开始
  end: "+=200", // 缩放动画结束
  scrub: true,
  pin: true,
  // markers: true,
  animation: gsap.timeline()
    .fromTo(`${tags} .text .title`,
      { y: 120, opacity: 0 },
      { y: 0, opacity: 1 }
    )
    .fromTo(`${tags} .text p`,
      { y: 120, opacity: 0 },
      { y: 0, opacity: 1 }
    )
    .fromTo(`${tags} .text img`,
      { x: 120, opacity: 0 },
      { x: 0, opacity: 1 }
    )


});

// container_nine 轮播进度。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。
initSwiper('.container_nine_swp');

// container_eight 卡片进入视口时的动画。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。
tags = '.container_eleven';
let $eleven_section = $(tags)
let $eleven_big_box = $(`${tags} .big_box>img.MOB`)
// 图片缩放动画
ScrollTrigger.create({
  trigger: $eleven_section,
  start: "-80% top",   // 百分比越大 动画提早开始
  end: "+=500", // 缩放动画结束
  scrub: true,
  // markers: true,
  animation: gsap.timeline()
    .fromTo($eleven_big_box,
      { opacity: 0.3, scale: 0.2 },
      { opacity: 1, scale: 1 }
    )
});

// 文字缩放动画，缩放结束后pin住section1
ScrollTrigger.create({
  trigger: $eleven_section,
  start: "top top",   // 百分比越大 动画提早开始
  end: "+=200", // 缩放动画结束
  scrub: true,
  pin: true,
  // markers: true,
  animation: gsap.timeline()
    .fromTo(`${tags} .text .title`,
      { y: 120, opacity: 0 },
      { y: 0, opacity: 1 }
    )
    .fromTo(`${tags} .text p`,
      { y: 120, opacity: 0 },
      { y: 0, opacity: 1 }
    )
    .fromTo(`${tags} .text img`,
      { x: 120, opacity: 0 },
      { x: 0, opacity: 1 }
    )
});

// container_ten 轮播进度。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。
initSwiper('.container_ten_swp');

// container_twelve 卡片进入视口时的动画。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。
tags = '.container_twelve';
let $twelve_section = $(tags)
let $twelve_big_box = $(`${tags} .big_box>img.MOB`)
// 图片缩放动画
ScrollTrigger.create({
  trigger: $twelve_section,
  start: "-80% top",   // 百分比越大 动画提早开始
  end: "+=500", // 缩放动画结束
  scrub: true,
  // markers: true,
  animation: gsap.timeline()
    .fromTo($twelve_big_box,
      { opacity: 0.3, scale: 0.2 },
      { opacity: 1, scale: 1 }
    )
});

// 文字缩放动画，缩放结束后pin住section1
ScrollTrigger.create({
  trigger: $twelve_section,
  start: "top top",   // 百分比越大 动画提早开始
  end: "+=200", // 缩放动画结束
  scrub: true,
  pin: true,
  // markers: true,
  animation: gsap.timeline()
    .fromTo(`${tags} .text .title`,
      { y: 120, opacity: 0 },
      { y: 0, opacity: 1 }
    )
    .fromTo(`${tags} .text p`,
      { y: 120, opacity: 0 },
      { y: 0, opacity: 1 }
    )
    .fromTo(`${tags} .text img`,
      { x: 120, opacity: 0 },
      { x: 0, opacity: 1 }
    )


});


// container_nine 轮播进度。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。
initSwiper('.container_nine_swp');



// container_thirteen 轮播进度。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。

tags = '.container_thirteen';
let $thirteen_section = $(tags)
// ScrollTrigger.create({
//   trigger: $thirteen_section,
//   start: "-60% top",   // 百分比越大 动画提早开始
//   end: "+=500", // 缩放动画结束
//   scrub: true,
//   animation: gsap.timeline()
//     .fromTo(`${tags}>.text .title`,
//       { y: 120, opacity: 0 },
//       { y: 0, opacity: 1 }
//     )
//     .fromTo(`${tags}>.text p`,
//       { y: 120, opacity: 0 },
//       { y: 0, opacity: 1 }
//     )
// });
initSwiper('.container_thirteen_swp');


// container_fourteen 轮播。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。
// 获取相关DOM元素
const banner_fourteen = document.querySelector('.container_fourteen .banner');
const navItems = document.querySelectorAll('.container_fourteen .nav ul li');
const cards = document.querySelectorAll('.container_fourteen .banner .card');

// 轮播配置
const cardCount_fourteen = cards.length; // 总卡片数
let currentIndex_fourteen = 0; // 当前显示的卡片索引

// 滚动banner到指定位置
function scrollBanner_fourteen(index) {
  // 限制索引范围
  if (index < 0) index = 0;
  if (index >= cardCount_fourteen) index = cardCount_fourteen - 1;

  // 设置所有卡片的位置
  cards.forEach((card, cardIndex) => {
    const offset = (cardIndex - index) * 100;
    card.style.display = 'block';
    card.style.transform = `translateX(${offset}%)`;
    card.style.opacity = cardIndex === index ? '1' : '0';
    card.style.zIndex = cardIndex === index ? '1' : '0';
  });

  // 更新当前索引
  currentIndex_fourteen = index;

  // 更新导航菜单状态
  updateNavStatus();
}

// 更新导航菜单状态
function updateNavStatus() {
  // 移除所有导航项的active类
  navItems.forEach(item => {
    item.classList.remove('active');
  });

  // 为当前索引对应的导航项添加active类
  navItems[currentIndex_fourteen].classList.add('active');
}

// 箭头按钮功能已被移除
function addArrowControls() {
  // 不添加箭头控制按钮
  // 原来的箭头控制功能已被禁用
}

// 初始化轮播
function initCarousel_fourteen() {
  // 设置卡片初始样式
  cards.forEach((card, index) => {
    card.style.position = 'absolute';
    card.style.top = '0';
    card.style.left = '0';
    card.style.width = '100%';
    card.style.transition = 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out';
  });

  // 默认显示第一个卡片
  scrollBanner_fourteen(0);

  // 为导航项添加点击事件
  navItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      scrollBanner_fourteen(index);
    });
  });

  // 箭头控制已移除
}

// 初始化轮播
initCarousel_fourteen();

// container_fourteen 增加 cards 左右拖动切换 navItems 效果，并支持首尾循环切换
(function () {
  let startX = 0;
  let isDragging = false;
  let deltaX = 0;
  let threshold = 50; // 拖动超过50px才切换

  cards.forEach(card => {
    card.addEventListener('touchstart', function (e) {
      if (e.touches.length !== 1) return;
      isDragging = true;
      startX = e.touches[0].clientX;
      deltaX = 0;
    }, { passive: true });

    card.addEventListener('touchmove', function (e) {
      if (!isDragging) return;
      deltaX = e.touches[0].clientX - startX;
    }, { passive: true });

    card.addEventListener('touchend', function (e) {
      if (!isDragging) return;
      isDragging = false;
      if (Math.abs(deltaX) > threshold) {
        if (deltaX < 0) {
          // 向左滑动
          if (currentIndex_fourteen < cards.length - 1) {
            scrollBanner_fourteen(currentIndex_fourteen + 1);
          } else {
            // 如果是最后一个，跳到第一个
            scrollBanner_fourteen(0);
          }
        } else if (deltaX > 0) {
          // 向右滑动
          if (currentIndex_fourteen > 0) {
            scrollBanner_fourteen(currentIndex_fourteen - 1);
          } else {
            // 如果是第一个，跳到最后一个
            scrollBanner_fourteen(cards.length - 1);
          }
        }
      }
      deltaX = 0;
    }, { passive: true });
  });
})();


tags = '.container_fourteen';
let $fourteen_section = $(tags)
// ScrollTrigger.create({
//   trigger: $fourteen_section,
//   start: "-60% top",   // 百分比越大 动画提早开始
//   end: "+=500", // 缩放动画结束
//   scrub: true,
//   animation: gsap.timeline()
//     .fromTo(`${tags}>.text .title`,
//       { y: 120, opacity: 0 },
//       { y: 0, opacity: 1 }
//     )
//     .fromTo(`${tags}>.text p`,
//       { y: 120, opacity: 0 },
//       { y: 0, opacity: 1 }
//     )
// });




// container_fifteen 卡片进入视口时的动画。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。
tags = '.container_fifteen';
let $fifteen_section = $(tags)
let $fifteen_big_box = $(`${tags}>img.MOB`)
// 图片缩放动画
ScrollTrigger.create({
  trigger: $fifteen_section,
  start: "-80% top",   // 百分比越大 动画提早开始
  end: "+=500", // 缩放动画结束
  scrub: true,
  // markers: true,
  animation: gsap.timeline()
    .fromTo($fifteen_big_box,
      { opacity: 0.3, scale: 0.2 },
      { opacity: 1, scale: 1 }
    )
});

// 文字缩放动画，缩放结束后pin住section1
ScrollTrigger.create({
  trigger: $fifteen_section,
  start: "top top",   // 百分比越大 动画提早开始
  end: "+=200", // 缩放动画结束
  scrub: true,
  pin: true,
  // markers: true,
  animation: gsap.timeline()
    .fromTo(`${tags} .text .title`,
      { y: 120, opacity: 0 },
      { y: 0, opacity: 1 }
    )
    .fromTo(`${tags} .text p`,
      { y: 120, opacity: 0 },
      { y: 0, opacity: 1 }
    )


});


// container_sixteen 轮播进度。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。
initSwiper('.container_sixteen_swp');

tags = '.container_sixteen';
let $sixteen_section = $(tags)
// ScrollTrigger.create({
//   trigger: $sixteen_section,
//   start: "-30% top",   // 百分比越大 动画提早开始
//   end: "+=1200", // 缩放动画结束
//   scrub: true,
//   // markers: true,
//   animation: gsap.timeline()
//     .fromTo(`${tags} .container_top .bg`,
//       { y: 120, opacity: 0 },
//       { y: 0, opacity: 1 }
//     )
//     .fromTo(`${tags} .container_top .text .title`,
//       { y: 120, opacity: 0 },
//       { y: 0, opacity: 1 }
//     )
//     .fromTo(`${tags} .container_top .text p`,
//       { y: 120, opacity: 0 },
//       { y: 0, opacity: 1 }
//     )
//     .fromTo(`${tags} .container_center .title`,
//       { x: -120, opacity: 0 },
//       { x: 0, opacity: 1 }
//     )
//     .fromTo(`${tags} .container_bottom img`,
//       { y: 120, opacity: 0 },
//       { y: 0, opacity: 1 }
//     )
//     .fromTo(`${tags} .container_bottom .text .title`,
//       { y: 120, opacity: 0 },
//       { y: 0, opacity: 1 }
//     )
//     .fromTo(`${tags} .container_bottom .text p`,
//       { y: 120, opacity: 0 },
//       { y: 0, opacity: 1 }
//     )

// });

// container_eighteen 进度。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。

tags = '.container_eighteen';
let $eighteen_section = $(tags)
ScrollTrigger.create({
  trigger: $eighteen_section,
  start: "-40% top",   // 百分比越大 动画提早开始
  end: "+=1000", // 缩放动画结束
  scrub: true,
  // markers: true,
  animation: gsap.timeline()
    .fromTo(`${tags} .w-astrict>.titel`,
      { y: -120, opacity: 0 },
      { y: 0, opacity: 1 }
    )
    .fromTo(`${tags} .w-astrict .cards_one .card:nth-child(1)`,
      { x: -120, opacity: 0 },
      { x: 0, opacity: 1 }
    )
    .fromTo(`${tags} .w-astrict .cards_one .card:nth-child(2)`,
      { x: -120, opacity: 0 },
      { x: 0, opacity: 1 }
    )
    .fromTo(`${tags} .w-astrict .cards_one .card:nth-child(3)`,
      { x: -120, opacity: 0 },
      { x: 0, opacity: 1 }
    )
    .fromTo(`${tags} .w-astrict .cards_two .card:nth-child(1)`,
      { x: 120, opacity: 0 },
      { x: 0, opacity: 1 }
    )
    .fromTo(`${tags} .w-astrict .cards_two .card:nth-child(2)`,
      { x: 120, opacity: 0 },
      { x: 0, opacity: 1 }
    )
    .fromTo(`${tags} .w-astrict .cards_two .card:nth-child(3)`,
      { x: 120, opacity: 0 },
      { x: 0, opacity: 1 }
    )

});


// container_twenty 轮播进度。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。
initSwiper('.container_twenty_swp', { mode: 'dots', autoplay: false, interval: 4000 })



// container_twentytwo


tags = '.container_twentytwo';
let $twentytwo_section = $(tags)
ScrollTrigger.create({
  trigger: $twentytwo_section,
  start: "-40% top",   // 百分比越大 动画提早开始
  end: "+=1400", // 缩放动画结束
  scrub: true,
  // markers: true,
  animation: gsap.timeline()
    .fromTo(`${tags} .w-astrict.title`,
      { y: 120, opacity: 0 },
      { y: 0, opacity: 1 }
    )
    .fromTo(`${tags} .w-astrict .card:nth-child(1)`,
      { y: 120, opacity: 0 },
      { y: 0, opacity: 1 }
    )
    .fromTo(`${tags} .w-astrict .card:nth-child(2)`,
      { y: 120, opacity: 0 },
      { y: 0, opacity: 1 }
    )
    .fromTo(`${tags} .w-astrict .card:nth-child(3)`,
      { y: 120, opacity: 0 },
      { y: 0, opacity: 1 }
    )
});











// 回到顶部按钮功能
const backToTopButton = document.getElementById('back-to-top');

// 监听滚动事件，控制按钮的显示和隐藏
window.addEventListener('scroll', () => {
  // 当页面滚动超过300px时显示按钮
  if (window.scrollY > 300) {
    backToTopButton.classList.add('visible');
  } else {
    backToTopButton.classList.remove('visible');
  }
});

// 点击按钮时平滑滚动到顶部
backToTopButton.addEventListener('click', () => {
  // 使用平滑滚动效果
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});