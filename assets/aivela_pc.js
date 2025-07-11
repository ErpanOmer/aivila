let height = window.innerHeight

function lazyLoad() {
  const imgs = document.querySelectorAll('[data-src]')

  for (let i = 0; i < imgs.length; i++) {
    let rect = imgs[i].getBoundingClientRect() // 获取元素的集合属性

    if (rect.bottom > 0 && rect.top < height) {
      imgs[i].src = imgs[i].getAttribute('data-src')

      imgs[i].onload = function () {   // 图片被浏览器加载完毕
        // 图片加载完毕后，刷新 ScrollTrigger
        ScrollTrigger.refresh();
        imgs[i].removeAttribute('data-src')
      }
    }
  }
}

lazyLoad()

window.addEventListener('scroll', lazyLoad)

// container_one 视频播放一次后显示logo。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。
// 获取视频和logo元素
let videoOne = null;
videoOne = document.getElementById('video_one');

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
		if (duration && duration - currentTime <= 2.7) {
			// 显示logo
			logoOne.style.opacity = '1';
		}
	});
}

// container_two 卡片进入视口时的动画。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。
// 获取所有卡片元素
const twoCards = document.querySelectorAll('.container_two .card');
// 创建交叉观察器
const twoObserver = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			// 当卡片进入视口
			if (entry.isIntersecting) {
				// 添加visible类
				entry.target.classList.add('visible');
			}
		});
	},
	{
		threshold: 0.2, // 当20%的卡片可见时触发
	}
);

// 观察每一个卡片
twoCards.forEach((card) => {
	twoObserver.observe(card);
});

// container_three 图片缩放和元素滑入效果。。。。。。。。。。。。。。。。。。。。。。。。。。。。。
let tags = '.container_three';
let $three_section = $(tags)
let $three_big_box = $(`${tags} .big_box img.PC`)
// 图片缩放动画
ScrollTrigger.create({
  trigger: $three_section,
  start: "-70% top",   // 百分比越大 动画提早开始
  end: "+=800", // 缩放动画结束
  scrub: true,
//   pin:true,
//   markers: true,
  animation: gsap.timeline()
    .fromTo($three_big_box,
      { borderRadius: 100, scale: 0.2,opacity: 0 },
      { borderRadius: 0, scale: 1,opacity: 1 }
    )
});

// 第三屏幕文字动画，缩放结束后pin住section1
ScrollTrigger.create({
  trigger: $three_section,
  start: "top top", // 与上一个end对齐
  end: "+=1200 ", // 文字动画持续距离，可根据实际调整
  scrub: true,
  pin:true,
  markers: false,
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
      { x: -120, opacity: 0 },
      { x: 0, opacity: 1 }
    )
    .fromTo(`${tags} .bottom .bottom_card.right`,
      { x: 120, opacity: 0 },
      { x: 0, opacity: 1 }
    )
	.fromTo(`${tags} .bottom .bottom_card.right`,
      { x: 0, opacity: 1},
      { x: 0, opacity: 1 }
    )
});


// container_five 卡片进入视口时的动画。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。
tags = '.container_five';
let $five_section = $(tags)
// 第五屏幕图片缩放动画
ScrollTrigger.create({
  trigger: $five_section,
  start: "-100% top",   // 百分比越大 动画提早开始
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

// container_five 左右滑动动画效果。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。
// 获取container_five和其中的元素
const containerFive = document.querySelector('.container_five');
const imgFive = document.querySelector('.container_five .text img');
const imgFive1 = document.querySelector('.container_five img');
const textFive = document.querySelector('.container_five .text');

// 创建Intersection Observer来检测container_five是否进入视口
const observerFive = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				// 当容器进入视口，添加visible类触发动画
				imgFive.classList.add('visible');
				textFive.classList.add('visible');
				if (imgFive1) imgFive1.classList.add('visible');
			} else {
				// 当容器离开视口，移除visible类，这样下次进入视口时动画会再次触发
				imgFive.classList.remove('visible');
				textFive.classList.remove('visible');

				if (imgFive1) imgFive1.classList.remove('visible');
			}
		});
	},
	{
		threshold: 0.2, // 当20%的容器进入视口时触发
	}
);

// 开始观察container_five
observerFive.observe(containerFive);

// container_six 轮播控制。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。
// 获取container_six和其中的元素
const containerSix = document.querySelector('.container_six');
const bannerRows = document.querySelector(
	'.container_six .right'
);
const bannerWrapper = document.querySelector(
	'.container_six .right .banner_wrapper'
);
const bannerRow = document.querySelectorAll(
	'.container_six .right .banner_row'
);
const texElements = document.querySelectorAll(
	'.container_six .left .tex'
);
const bannerColumn = document.querySelector('.container_six .left');
// 获取所有标题元素
const titleElements = document.querySelectorAll(
	'.container_six .left .tex .title'
);

// 设置相关变量
let currentRowIndex = 0; // 当前显示的banner_row索引
let currentTexIndex = 0; // 当前显示的tex索引

const rowCount = bannerRow.length; // banner_row的总数


// 初始化显示状态
function initContainerSix() {
	// 设置初始活动卡片
	updateBannerPosition(0);

	// 移除所有tex元素的visible类，只给当前索引对应的添加
	updateTexVisibility(currentTexIndex);

	// 为每个标题添加点击事件
	titleElements.forEach((title, index) => {
		title.style.cursor = 'pointer'; // 添加鼠标手型样式
		title.addEventListener('click', () => {
			// 点击标题后切换到对应的索引
			goToSlide(index);
		});
	});
}

// 动画状态锁定变量
let isAnimating = false;

// 切换到指定索引的幻灯片
function goToSlide(index, direction = null) {
	// 如果动画正在进行中，阻止新的切换
	if (isAnimating) {
		return;
	}

	// 确保索引在有效范围内
	if (index < 0) index = 0;
	if (index >= rowCount) index = rowCount - 1;

	// 如果没有指定方向，根据索引变化自动判断
	if (direction === null) {
		if (index > currentRowIndex) {
			direction = 'next'; // 向下切换
		} else if (index < currentRowIndex) {
			direction = 'prev'; // 向上切换
		} else {
			return; // 相同索引，不需要切换
		}
	}

	// 设置动画锁定
	isAnimating = true;

	// 更新当前索引
	const oldIndex = currentRowIndex;
	currentRowIndex = index;
	currentTexIndex = index;

	// 更新显示（带动画）
	updateContainerSixWithAnimation(oldIndex, index, direction);
}

// 更新banner显示
function updateBannerPosition(index) {
	// 移除所有banner_row的active类
	bannerRow.forEach((row, i) => {
		if (i === index) {
			row.classList.add('active');
		} else {
			row.classList.remove('active');
		}
	});
}

// 带动画的更新函数
function updateContainerSixWithAnimation(oldIndex, newIndex, direction) {
	const oldRow = bannerRow[oldIndex];
	const newRow = bannerRow[newIndex];

	if (!oldRow || !newRow) {
		// 如果元素不存在，释放锁定
		isAnimating = false;
		return;
	}

	// 立即更新按钮状态，显示禁用状态
	updateButtonStates();

	// 清除所有动画类
	bannerRow.forEach(row => {
		row.classList.remove('active', 'slide-up-out', 'slide-down-out', 'slide-up-in', 'slide-down-in');
	});

	// 设置新图片的初始位置
	if (direction === 'next') {
		// 向下切换：新图片从下方进入
		newRow.style.transform = 'translateY(100%)';
		newRow.style.opacity = '0';
	} else {
		// 向上切换：新图片从上方进入
		newRow.style.transform = 'translateY(-100%)';
		newRow.style.opacity = '0';
	}

	// 立即显示新图片（但在屏幕外）
	newRow.style.zIndex = '2';
	oldRow.style.zIndex = '1';

	// 使用requestAnimationFrame确保样式已应用
	requestAnimationFrame(() => {
		// 开始动画
		if (direction === 'next') {
			// 向下切换
			oldRow.style.transform = 'translateY(-100%)';
			oldRow.style.opacity = '0';
			newRow.style.transform = 'translateY(0)';
			newRow.style.opacity = '1';
		} else {
			// 向上切换
			oldRow.style.transform = 'translateY(100%)';
			oldRow.style.opacity = '0';
			newRow.style.transform = 'translateY(0)';
			newRow.style.opacity = '1';
		}

		// 动画完成后清理
		setTimeout(() => {
			// 重置所有样式，使用CSS类管理
			bannerRow.forEach((row, i) => {
				row.style.transform = '';
				row.style.opacity = '';
				row.style.zIndex = '';
				if (i === newIndex) {
					row.classList.add('active');
				}
			});
			
			// 释放动画锁定
			isAnimating = false;
			
			// 重新更新按钮状态，恢复正常状态
			updateButtonStates();
		}, 1200); // 与CSS动画时间一致
	});

	// 更新文本显示
	updateTexVisibility(newIndex);
}

// 更新tex元素的visible类
function updateTexVisibility(index) {
	texElements.forEach((tex, texIndex) => {
		if (texIndex === index) {
			tex.classList.add('visible');
		} else {
			tex.classList.remove('visible');
		}
	});
}

// 处理滚动事件 - 在容器在视口中时触发轮播控制


// 更新container_six的显示
function updateContainerSix() {
	// 更新轮播显示
	updateBannerPosition(currentRowIndex);

	// 更新文本显示
	updateTexVisibility(currentTexIndex);

	// 更新按钮状态
	updateButtonStates();
}



// 添加按钮控制事件
function initCarouselButtons() {
	const prevBtn = document.getElementById('prevBtn');
	const nextBtn = document.getElementById('nextBtn');

	if (prevBtn && nextBtn) {
		// 上一张按钮事件
		prevBtn.addEventListener('click', () => {
			if (currentRowIndex > 0) {
				goToSlide(currentRowIndex - 1, 'prev');
			}
		});

		// 下一张按钮事件
		nextBtn.addEventListener('click', () => {
			if (currentRowIndex < rowCount - 1) {
				goToSlide(currentRowIndex + 1, 'next');
			}
		});
	}
}

// 更新按钮状态
function updateButtonStates() {
	const prevBtn = document.getElementById('prevBtn');
	const nextBtn = document.getElementById('nextBtn');

	if (prevBtn && nextBtn) {
		// 如果动画正在进行中，禁用所有按钮
		if (isAnimating) {
			prevBtn.style.opacity = '0.3';
			prevBtn.style.cursor = 'not-allowed';
			prevBtn.style.pointerEvents = 'none';
			
			nextBtn.style.opacity = '0.3';
			nextBtn.style.cursor = 'not-allowed';
			nextBtn.style.pointerEvents = 'none';
		} else {
			// 恢复按钮的正常交互
			prevBtn.style.pointerEvents = 'auto';
			nextBtn.style.pointerEvents = 'auto';
			
			// 更新按钮的可用状态
			prevBtn.style.opacity = currentRowIndex > 0 ? '1' : '0.5';
			prevBtn.style.cursor = currentRowIndex > 0 ? 'pointer' : 'not-allowed';
			
			nextBtn.style.opacity = currentRowIndex < rowCount - 1 ? '1' : '0.5';
			nextBtn.style.cursor = currentRowIndex < rowCount - 1 ? 'pointer' : 'not-allowed';
		}
	}
}

// 创建Intersection Observer来检测container_six是否进入视口
const observerSix = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				// 强制初始化一次，确保正确状态
				initContainerSix();
				// 初始化按钮控制
				initCarouselButtons();
			}
		});
	},
	{
		threshold: 0.2,
	}
);



// 开始观察container_six
observerSix.observe(containerSix);

// 初始化container_six
initContainerSix();

// 在页面加载后设置初始活动卡片
window.addEventListener('DOMContentLoaded', () => {
	// 默认激活第一个卡片
	if (bannerRow.length > 0) {
		bannerRow[0].classList.add('active');
	}
});

// container_seven 视频随页面滚动控制播放进度
// ⚡️ 平滑插值用的全局变量
let targetTime = 0;
let currentTime = 0;

// ⚡️ 获取video元素
const summary = document.querySelector(".summary.PC");

// ⚡️ 启动平滑更新循环
function smoothVideoUpdate() {
    if (summary && summary.readyState >= 2) {
        // 用0.15的缓动因子平滑追赶
        currentTime += (targetTime - currentTime) * 0.15;
        summary.currentTime = currentTime;
    }
    requestAnimationFrame(smoothVideoUpdate);
}
smoothVideoUpdate();

// ⚡️ ScrollTrigger
ScrollTrigger.create({
    trigger: ".container_seven",
    start: "top top",
    end: "+=2000",
    scrub: true,
    pin: true,
    // markers: true,
    onUpdate(self) {
        // ✅ 只更新 targetTime，由 requestAnimationFrame 缓动播放
        if (summary && summary.duration) {
            targetTime = self.progress * summary.duration;
        }
    },
});

const video = document.querySelector('.container_seven .summary.PC');
let hasAnimated = false;

if (video) {
  video.addEventListener('timeupdate', function () {
    if (!hasAnimated && video.duration && video.currentTime / video.duration >= 0.2) {
      hasAnimated = true;
      gsap.fromTo('.container_seven .text .title',
        { y: -0, opacity: 0 },
        { y: 0, opacity: 1 }
      );
      gsap.fromTo('.container_seven .text .desc',
        { y: -0, opacity: 0 },
        { y: 0, opacity: 1, delay: 0.5 }
      );
    }
  });
}


// container_eight 图片缩放和文本渐显效果。。。。。。。。。。。。。。。。。。。。。。。。。。。。。
let tags_eight = '.container_eight';
let $three_section_eight = $(tags_eight)
let $three_big_box_eight = $(`${tags_eight} .big_box img.PC`)
// 图片缩放动画
ScrollTrigger.create({
  trigger: $three_section_eight,
  start: "-70% top",   // 百分比越大 动画提早开始
  end: "+=800", // 缩放动画结束
  scrub: true,
//   pin:true,
//   markers: true,2
  animation: gsap.timeline()
    .fromTo($three_big_box_eight,
      { borderRadius: 100, scale: 0.2,opacity: 0 },
      { borderRadius: 0, scale: 1,opacity: 1 }
    )
});

// 第三屏幕文字动画，缩放结束后pin住section1
ScrollTrigger.create({
  trigger: $three_section_eight,
  start: "top top", // 与上一个end对齐
  end: "+=1200 ", // 文字动画持续距离，可根据实际调整
  scrub: true,
  pin:true,
//   markers: false,
  animation: gsap.timeline()
    .fromTo(`${tags_eight} .text`,
      { x: 120, opacity: 0 },
      { x: 0, opacity: 1 }
    )
});

// container_nine 轮播进度。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。

// 获取相关DOM元素
const banner = document.querySelector('.container_nine .banner');
const btnLeft = document.querySelector('.container_nine .btn_left');
const btnRight = document.querySelector('.container_nine .btn_right');
const progressLeft = document.querySelector(
	'.container_nine .progress_len_left'
);
const progressRight = document.querySelector(
	'.container_nine .progress_len_right'
);
const bannerContainer = document.querySelector('.container_nine .bb');

// 轮播配置
const cardCount = 5; // 总卡片数
let bannerWidth = 0; // banner实际宽度
let containerWidth = 0; // 容器宽度
let maxScrollDistance = 0; // 最大滚动距离（像素）
let cardWidth = 0; // 单个卡片宽度（像素）

// 初始化尺寸
function initDimensions() {
	// 获取实际尺寸
	bannerWidth = banner.scrollWidth; // banner的实际内容宽度
	containerWidth = bannerContainer.offsetWidth; // 容器的可视宽度
	cardWidth = bannerWidth / cardCount; // 单个卡片的实际宽度
	
	// 计算最大滚动距离：banner宽度减去容器宽度
	maxScrollDistance = Math.max(0, bannerWidth - containerWidth);
}

// 更新进度条显示
function updateProgress() {
	// 获取当前滚动位置
	const style = window.getComputedStyle(banner);
	const matrix = new WebKitCSSMatrix(style.transform);
	const currentScrollLeft = Math.abs(matrix.m41);
	
	// 计算进度百分比
	let progress;
	if (maxScrollDistance === 0) {
		progress = 100; // 如果没有滚动距离，进度为100%
	} else {
		// 基于实际滚动距离计算进度
		const scrollRatio = currentScrollLeft / maxScrollDistance;
		progress = 80 + (scrollRatio * 20); // 从80%到100%
	}
	
	// 更新进度条宽度
	progressLeft.style.width = `${progress}%`;
	progressRight.style.width = `${100 - progress}%`;
}

// 滚动banner到指定位置
function scrollBanner(scrollDistance) {
	// 限制滚动距离
	if (scrollDistance < 0) scrollDistance = 0;
	if (scrollDistance > maxScrollDistance) scrollDistance = maxScrollDistance;
	
	// 应用滚动
	banner.style.transform = `translateX(-${scrollDistance}px)`;
	
	// 更新进度
	updateProgress();
	
	// 更新按钮状态
	btnLeft.style.opacity = scrollDistance > 0 ? '1' : '0.5';
	btnRight.style.opacity = scrollDistance < maxScrollDistance ? '1' : '0.5';
}

// 获取当前滚动距离
function getCurrentScrollDistance() {
	const style = window.getComputedStyle(banner);
	const matrix = new WebKitCSSMatrix(style.transform);
	return Math.abs(matrix.m41);
}

// 初始化
function initCarousel() {
	// 初始化尺寸
	initDimensions();
	
	// 移除banner过渡效果，确保拖动没有阻尼
	banner.style.transition = 'none';

	// 初始化按钮状态
	btnLeft.style.opacity = '0.5'; // 初始位置左按钮禁用
	btnRight.style.opacity = maxScrollDistance > 0 ? '1' : '0.5'; // 如果没有可滚动距离，右按钮也禁用

	// 添加按钮点击事件
	btnLeft.addEventListener('click', () => {
		const currentScroll = getCurrentScrollDistance();
		if (currentScroll > 0) {
			// 添加过渡效果，使点击滚动平滑
			banner.style.transition = 'transform 0.5s ease-in-out';
			const newScroll = currentScroll - cardWidth;
			scrollBanner(newScroll);
			// 滚动完成后移除过渡效果，确保拖动没有阻尼，并更新进度条
			setTimeout(() => {
				banner.style.transition = 'none';
				// 过渡完成后重新更新进度条，确保准确性
				updateProgress();
			}, 500);
		}
	});

	btnRight.addEventListener('click', () => {
		const currentScroll = getCurrentScrollDistance();
		if (currentScroll < maxScrollDistance) {
			// 添加过渡效果，使点击滚动平滑
			banner.style.transition = 'transform 0.5s ease-in-out';
			const newScroll = currentScroll + cardWidth;
			scrollBanner(newScroll);
			// 滚动完成后移除过渡效果，确保拖动没有阻尼，并更新进度条
			setTimeout(() => {
				banner.style.transition = 'none';
				// 过渡完成后重新更新进度条，确保准确性
				updateProgress();
			}, 500);
		}
	});

	// 添加按钮悬停效果
	btnLeft.addEventListener('mouseover', () => {
		const currentScroll = getCurrentScrollDistance();
		if (currentScroll > 0) {
			btnLeft.style.backgroundColor = '#e0e0e0';
		}
	});

	btnLeft.addEventListener('mouseout', () => {
		btnLeft.style.backgroundColor = '#f5f5f5';
	});

	btnRight.addEventListener('mouseover', () => {
		const currentScroll = getCurrentScrollDistance();
		if (currentScroll < maxScrollDistance) {
			btnRight.style.backgroundColor = '#e0e0e0';
		}
	});

	btnRight.addEventListener('mouseout', () => {
		btnRight.style.backgroundColor = '#f5f5f5';
	});

	// 添加鼠标拖动事件
	let isDragging = false;
	let startX = 0;
	let startScrollLeft = 0;
	let animationFrameId = null;

	// 鼠标按下事件
	bannerContainer.addEventListener('mousedown', (e) => {
		isDragging = true;
		startX = e.pageX;
		// 记录当前滚动位置（像素）
		startScrollLeft = getCurrentScrollDistance();
		// 阻止默认行为，如文本选择
		e.preventDefault();
	});

	// 鼠标移动事件
	window.addEventListener('mousemove', (e) => {
		if (!isDragging) return;

		// 计算鼠标移动距离（像素）
		const deltaX = e.pageX - startX;
		// 计算新的滚动位置（像素）
		let newScrollLeft = startScrollLeft - deltaX;

		// 限制滚动范围
		if (newScrollLeft < 0) newScrollLeft = 0;
		if (newScrollLeft > maxScrollDistance) newScrollLeft = maxScrollDistance;

		// 使用requestAnimationFrame优化性能
		if (animationFrameId) {
			cancelAnimationFrame(animationFrameId);
		}

		animationFrameId = requestAnimationFrame(() => {
			// 应用新的滚动位置
			banner.style.transform = `translateX(-${newScrollLeft}px)`;
		});
	});

	// 鼠标释放事件
	window.addEventListener('mouseup', () => {
		if (!isDragging) return;
		isDragging = false;

		// 获取当前滚动距离
		const currentScrollDistance = getCurrentScrollDistance();

		// 更新进度条
		updateProgress();
		
		// 更新按钮状态
		btnLeft.style.opacity = currentScrollDistance > 0 ? '1' : '0.5';
		btnRight.style.opacity = currentScrollDistance < maxScrollDistance ? '1' : '0.5';
	});

	// 鼠标离开容器事件
	bannerContainer.addEventListener('mouseleave', () => {
		if (isDragging) {
			isDragging = false;
			
			// 获取当前滚动距离
			const currentScrollDistance = getCurrentScrollDistance();

			// 更新进度条
			updateProgress();
			
			// 更新按钮状态
			btnLeft.style.opacity = currentScrollDistance > 0 ? '1' : '0.5';
			btnRight.style.opacity = currentScrollDistance < maxScrollDistance ? '1' : '0.5';
		}
	});

	// 添加触摸事件支持
	let touchStartX = 0;
	let touchEndX = 0;

	bannerContainer.addEventListener(
		'touchstart',
		(event) => {
			touchStartX = event.touches[0].clientX;
		},
		{ passive: true }
	);

	bannerContainer.addEventListener(
		'touchmove',
		(event) => {
			touchEndX = event.touches[0].clientX;
			const touchDiff = touchStartX - touchEndX;
			
			// 计算新的滚动位置（像素）
			const startScrollDistance = getCurrentScrollDistance();
			let newScrollLeft = startScrollDistance + touchDiff;

			// 限制滚动范围
			if (newScrollLeft < 0) newScrollLeft = 0;
			if (newScrollLeft > maxScrollDistance) newScrollLeft = maxScrollDistance;

			// 应用新的滚动位置
			banner.style.transform = `translateX(-${newScrollLeft}px)`;
		},
		{ passive: true }
	);

	bannerContainer.addEventListener(
		'touchend',
		() => {
			// 获取当前滚动距离
			const currentScrollDistance = getCurrentScrollDistance();

			// 更新进度条
			updateProgress();
			
			// 更新按钮状态
			btnLeft.style.opacity = currentScrollDistance > 0 ? '1' : '0.5';
			btnRight.style.opacity = currentScrollDistance < maxScrollDistance ? '1' : '0.5';
		},
		{ passive: true }
	);

	// 使用新的进度条逻辑初始化进度条状态
	updateProgress();
	
	// 添加窗口大小变化监听器，重新计算尺寸
	window.addEventListener('resize', () => {
		initDimensions();
		updateProgress();
	});
}

// 初始化轮播
initCarousel();

// container_eleven 图片缩放和文本渐显效果。。。。。。。。。。。。。。。。。。。。。。。。。。。。。
 tags = '.container_eleven';
 $three_section = $(tags)
 $three_big_box = $(`${tags} .big_box img.PC`)
// 图片缩放动画
ScrollTrigger.create({
  trigger: $three_section,
  start: "-70% top",   // 百分比越大 动画提早开始
  end: "+=800", // 缩放动画结束
  scrub: true,
//   pin:true,
//   markers: true,
  animation: gsap.timeline()
    .fromTo($three_big_box,
      { borderRadius: 100, scale: 0.2,opacity: 0 },
      { borderRadius: 0, scale: 1,opacity: 1 }
    )
});

// 第三屏幕文字动画，缩放结束后pin住section1
ScrollTrigger.create({
  trigger: $three_section,
  start: "top top", // 与上一个end对齐
  end: "+=1200 ", // 文字动画持续距离，可根据实际调整
  scrub: true,
  pin:true,
  markers: false,
  animation: gsap.timeline()
    .fromTo(`${tags} .text`,
      { x: -120, opacity: 0 },
      { x: 0, opacity: 1 }
    )
});

// container_ten 轮播进度。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。

// 获取相关DOM元素
const banner_ten = document.querySelector('.container_ten .banner');
const btnLeft_ten = document.querySelector('.container_ten .btn_left');
const btnRight_ten = document.querySelector('.container_ten .btn_right');
const progressLeft_ten = document.querySelector(
	'.container_ten .progress_len_left'
);
const progressRight_ten = document.querySelector(
	'.container_ten .progress_len_right'
);
const bannerContainer_ten = document.querySelector('.container_ten .bb');

// 轮播配置
const cardCount_ten = 5; // 总卡片数
let bannerWidth_ten = 0; // banner实际宽度
let containerWidth_ten = 0; // 容器宽度
let maxScrollDistance_ten = 0; // 最大滚动距离（像素）
let cardWidth_ten = 0; // 单个卡片宽度（像素）

// 初始化尺寸
function initDimensions_ten() {
	// 获取实际尺寸
	bannerWidth_ten = banner_ten.scrollWidth; // banner的实际内容宽度
	containerWidth_ten = bannerContainer_ten.offsetWidth; // 容器的可视宽度
	cardWidth_ten = bannerWidth_ten / cardCount_ten; // 单个卡片的实际宽度
	
	// 计算最大滚动距离：banner宽度减去容器宽度
	maxScrollDistance_ten = Math.max(0, bannerWidth_ten - containerWidth_ten);
}

// 更新进度条显示
function updateProgress_ten() {
	// 获取当前滚动位置
	const style = window.getComputedStyle(banner_ten);
	const matrix = new WebKitCSSMatrix(style.transform);
	const currentScrollLeft = Math.abs(matrix.m41);
	
	// 计算进度百分比
	let progress;
	if (maxScrollDistance_ten === 0) {
		progress = 100; // 如果没有滚动距离，进度为100%
	} else {
		// 基于实际滚动距离计算进度
		const scrollRatio = currentScrollLeft / maxScrollDistance_ten;
		progress = 80 + (scrollRatio * 20); // 从80%到100%
	}
	
	// 更新进度条宽度
	progressLeft_ten.style.width = `${progress}%`;
	progressRight_ten.style.width = `${100 - progress}%`;
}

// 滚动banner到指定位置
function scrollBanner_ten(scrollDistance) {
	// 限制滚动距离
	if (scrollDistance < 0) scrollDistance = 0;
	if (scrollDistance > maxScrollDistance_ten) scrollDistance = maxScrollDistance_ten;
	
	// 应用滚动
	banner_ten.style.transform = `translateX(-${scrollDistance}px)`;
	
	// 更新进度
	updateProgress_ten();
	
	// 更新按钮状态
	btnLeft_ten.style.opacity = scrollDistance > 0 ? '1' : '0.5';
	btnRight_ten.style.opacity = scrollDistance < maxScrollDistance_ten ? '1' : '0.5';
	
	// 更新按钮背景色
	if (scrollDistance > 0) {
		btnLeft_ten.style.backgroundColor = '#f5f5f5';
	} else {
		btnLeft_ten.style.backgroundColor = '#f5f5f5';
		btnLeft_ten.style.opacity = '0.5';
	}

	if (scrollDistance < maxScrollDistance_ten) {
		btnRight_ten.style.backgroundColor = '#f5f5f5';
	} else {
		btnRight_ten.style.backgroundColor = '#f5f5f5';
		btnRight_ten.style.opacity = '0.5';
	}
}

// 获取当前滚动距离
function getCurrentScrollDistance_ten() {
	const style = window.getComputedStyle(banner_ten);
	const matrix = new WebKitCSSMatrix(style.transform);
	return Math.abs(matrix.m41);
}

// 初始化
function initCarousel_ten() {
	// 初始化尺寸
	initDimensions_ten();
	
	// 移除banner过渡效果，确保拖动没有阻尼
	banner_ten.style.transition = 'none';

	// 初始化按钮状态
	btnLeft_ten.style.opacity = '0.5'; // 初始位置左按钮禁用
	btnRight_ten.style.opacity = maxScrollDistance_ten > 0 ? '1' : '0.5'; // 如果没有可滚动距离，右按钮也禁用

	// 添加按钮点击事件
	btnLeft_ten.addEventListener('click', () => {
		const currentScroll = getCurrentScrollDistance_ten();
		if (currentScroll > 0) {
			// 添加过渡效果，使点击滚动平滑
			banner_ten.style.transition = 'transform 0.5s ease-in-out';
			const newScroll = currentScroll - cardWidth_ten;
			scrollBanner_ten(newScroll);
			// 滚动完成后移除过渡效果，确保拖动没有阻尼，并更新进度条
			setTimeout(() => {
				banner_ten.style.transition = 'none';
				// 过渡完成后重新更新进度条，确保准确性
				updateProgress_ten();
			}, 500);
		}
	});

	btnRight_ten.addEventListener('click', () => {
		const currentScroll = getCurrentScrollDistance_ten();
		if (currentScroll < maxScrollDistance_ten) {
			// 添加过渡效果，使点击滚动平滑
			banner_ten.style.transition = 'transform 0.5s ease-in-out';
			const newScroll = currentScroll + cardWidth_ten;
			scrollBanner_ten(newScroll);
			// 滚动完成后移除过渡效果，确保拖动没有阻尼，并更新进度条
			setTimeout(() => {
				banner_ten.style.transition = 'none';
				// 过渡完成后重新更新进度条，确保准确性
				updateProgress_ten();
			}, 500);
		}
	});

	// 添加按钮悬停效果
	btnLeft_ten.addEventListener('mouseover', () => {
		const currentScroll = getCurrentScrollDistance_ten();
		if (currentScroll > 0) {
			btnLeft_ten.style.backgroundColor = '#e0e0e0';
		}
	});

	btnLeft_ten.addEventListener('mouseout', () => {
		btnLeft_ten.style.backgroundColor = '#f5f5f5';
	});

	btnRight_ten.addEventListener('mouseover', () => {
		const currentScroll = getCurrentScrollDistance_ten();
		if (currentScroll < maxScrollDistance_ten) {
			btnRight_ten.style.backgroundColor = '#e0e0e0';
		}
	});

	btnRight_ten.addEventListener('mouseout', () => {
		btnRight_ten.style.backgroundColor = '#f5f5f5';
	});

	// 添加鼠标拖动事件
	let isDragging_ten = false;
	let startX_ten = 0;
	let startScrollLeft_ten = 0;
	let animationFrameId_ten = null;

	// 鼠标按下事件
	bannerContainer_ten.addEventListener('mousedown', (e) => {
		isDragging_ten = true;
		startX_ten = e.pageX;
		// 记录当前滚动位置（像素）
		startScrollLeft_ten = getCurrentScrollDistance_ten();
		// 阻止默认行为，如文本选择
		e.preventDefault();
	});

	// 鼠标移动事件
	window.addEventListener('mousemove', (e) => {
		if (!isDragging_ten) return;

		// 计算鼠标移动距离（像素）
		const deltaX_ten = e.pageX - startX_ten;
		// 计算新的滚动位置（像素）
		let newScrollLeft_ten = startScrollLeft_ten - deltaX_ten;

		// 限制滚动范围
		if (newScrollLeft_ten < 0) newScrollLeft_ten = 0;
		if (newScrollLeft_ten > maxScrollDistance_ten) newScrollLeft_ten = maxScrollDistance_ten;

		// 使用requestAnimationFrame优化性能
		if (animationFrameId_ten) {
			cancelAnimationFrame(animationFrameId_ten);
		}

		animationFrameId_ten = requestAnimationFrame(() => {
			// 应用新的滚动位置
			banner_ten.style.transform = `translateX(-${newScrollLeft_ten}px)`;
		});
	});

	// 鼠标释放事件
	window.addEventListener('mouseup', () => {
		if (!isDragging_ten) return;
		isDragging_ten = false;

		// 获取当前滚动距离
		const currentScrollDistance = getCurrentScrollDistance_ten();

		// 更新进度条
		updateProgress_ten();
		
		// 更新按钮状态
		btnLeft_ten.style.opacity = currentScrollDistance > 0 ? '1' : '0.5';
		btnRight_ten.style.opacity = currentScrollDistance < maxScrollDistance_ten ? '1' : '0.5';
	});

	// 鼠标离开容器事件
	bannerContainer_ten.addEventListener('mouseleave', () => {
		if (isDragging_ten) {
			isDragging_ten = false;
			
			// 获取当前滚动距离
			const currentScrollDistance = getCurrentScrollDistance_ten();

			// 更新进度条
			updateProgress_ten();
			
			// 更新按钮状态
			btnLeft_ten.style.opacity = currentScrollDistance > 0 ? '1' : '0.5';
			btnRight_ten.style.opacity = currentScrollDistance < maxScrollDistance_ten ? '1' : '0.5';
		}
	});

	// 添加触摸事件支持
	let touchStartX_ten = 0;
	let touchEndX_ten = 0;

	bannerContainer_ten.addEventListener(
		'touchstart',
		(event) => {
			touchStartX_ten = event.touches[0].clientX;
		},
		{ passive: true }
	);

	bannerContainer_ten.addEventListener(
		'touchmove',
		(event) => {
			touchEndX_ten = event.touches[0].clientX;
			const touchDiff_ten = touchStartX_ten - touchEndX_ten;
			
			// 获取当前滚动距离并计算新的滚动位置（像素）
			const startScrollDistance = getCurrentScrollDistance_ten();
			let newScrollLeft_ten = startScrollDistance + touchDiff_ten;

			// 限制滚动范围
			if (newScrollLeft_ten < 0) newScrollLeft_ten = 0;
			if (newScrollLeft_ten > maxScrollDistance_ten) newScrollLeft_ten = maxScrollDistance_ten;

			// 应用新的滚动位置
			banner_ten.style.transform = `translateX(-${newScrollLeft_ten}px)`;
		},
		{ passive: true }
	);

	bannerContainer_ten.addEventListener(
		'touchend',
		() => {
			// 获取当前滚动距离
			const currentScrollDistance = getCurrentScrollDistance_ten();

			// 更新进度条
			updateProgress_ten();
			
			// 更新按钮状态
			btnLeft_ten.style.opacity = currentScrollDistance > 0 ? '1' : '0.5';
			btnRight_ten.style.opacity = currentScrollDistance < maxScrollDistance_ten ? '1' : '0.5';
		},
		{ passive: true }
	);

	// 初始化进度条
	updateProgress_ten();
	
	// 添加窗口大小变化监听器
	window.addEventListener('resize', () => {
		// 重新计算尺寸
		initDimensions_ten();
		// 更新进度条
		updateProgress_ten();
	});
}

// 初始化轮播
initCarousel_ten();

// container_twelve 图片缩放和文本渐显效果。。。。。。。。。。。。。。。。。。。。。。。。。。。。。
tags = '.container_twelve';
$three_section = $(tags)
$three_big_box = $(`${tags} .big_box img.PC`)
// 图片缩放动画
ScrollTrigger.create({
  trigger: $three_section,
  start: "-70% top",   // 百分比越大 动画提早开始
  end: "+=800", // 缩放动画结束
  scrub: true,
//   pin:true,
//   markers: true,
  animation: gsap.timeline()
    .fromTo($three_big_box,
         { borderRadius: 100, scale: 0.2,opacity: 0 },
      { borderRadius: 0, scale: 1,opacity: 1 }
    )
});

// 第三屏幕文字动画，缩放结束后pin住section1
ScrollTrigger.create({
  trigger: $three_section,
  start: "top top", // 与上一个end对齐
  end: "+=1200 ", // 文字动画持续距离，可根据实际调整
  scrub: true,
  pin:true,
  markers: false,
  animation: gsap.timeline()
    .fromTo(`${tags} .text`,
      { x: 120, opacity: 0 },
      { x: 0, opacity: 1 }
    )
});


// container_thirteen 文本淡入和卡片从下向上弹出效果。。。。。。。。。。。。。。。。。。。。。。。。。。。。
// 获取container_thirteen和其中的元素
const containerThirteen = document.querySelector('.container_thirteen');
const textThirteen = document.querySelector('.container_thirteen .text');
const cardsThirteen = document.querySelectorAll(
	'.container_thirteen .cards > div'
);

// 创建Intersection Observer来检测container_thirteen是否进入视口
const observerThirteen = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				// 当容器进入视口，添加visible类触发动画
				textThirteen.classList.add('visible');

				// 为每个卡片依次添加可见类，实现依次弹出效果
				cardsThirteen.forEach((card) => {
					card.classList.add('visible');
				});
			} else {
				// 当容器离开视口，移除visible类，这样下次进入视口时动画会再次触发
				textThirteen.classList.remove('visible');

				cardsThirteen.forEach((card) => {
					card.classList.remove('visible');
				});
			}
		});
	},
	{
		threshold: 0.2, // 当20%的容器进入视口时触发
	}
);

// 开始观察container_thirteen
observerThirteen.observe(containerThirteen);

if (isMobile) {
	// 获取相关DOM元素
	const banner_thirteen = document.querySelector(
		'.container_thirteen .cards'
	);
	const btnLeft_thirteen = document.querySelector(
		'.container_thirteen .btn_left'
	);
	const btnRight_thirteen = document.querySelector(
		'.container_thirteen .btn_right'
	);
	const progressLeft_thirteen = document.querySelector(
		'.container_thirteen .progress_len_left'
	);
	const progressRight_thirteen = document.querySelector(
		'.container_thirteen .progress_len_right'
	);
	const bannerContainer_thirteen = document.querySelector(
		'.container_thirteen .bb'
	);

	// 轮播配置
	const cardCount_thirteen = 3; // 总卡片数
	let currentIndex_thirteen = 0; // 当前显示的卡片索引
	const cardWidth_thirteen = isMobile ? 78 : 21; // 单个卡片宽度（包含margin）vw
	const cardTotal_thirteen = isMobile ? 100 : 84;

	// 计算最大滚动距离 - 只需要显示最后一张卡片
	// 容器宽度是84vw(参考CSS)，卡片宽度是21vw，总共5张卡片，所以最大滚动距离是最后一张卡片刚好完全显示的位置
	const maxScrollIndex_thirteen =
		cardCount_thirteen -
		Math.floor(cardTotal_thirteen / cardWidth_thirteen); // 最大滚动索引

	// 更新进度条显示
	function updateProgress_thirteen() {
		// 计算当前进度百分比 - 基于最大可滚动距离而不是卡片总数
		const progress_thirteen =
			maxScrollIndex_thirteen > 0
				? (currentIndex_thirteen / maxScrollIndex_thirteen) * 100
				: 100;

		// 更新进度条宽度
		progressLeft_thirteen.style.width = `${progress_thirteen}%`;
		progressRight_thirteen.style.width = `${100 - progress_thirteen}%`;
	}

	// 滚动banner到指定位置
	function scrollBanner_thirteen(index) {
		// 限制索引范围
		if (index < 0) index = 0;
		if (index > maxScrollIndex_thirteen) index = maxScrollIndex_thirteen;

		// 计算滚动距离
		const scrollAmount_thirteen = index * cardWidth_thirteen;
		banner_thirteen.style.transform = `translateX(-${scrollAmount_thirteen}vw)`;

		// 更新进度
		currentIndex_thirteen = index;
		updateProgress_thirteen();

		// 根据当前位置控制按钮状态
		btnLeft_thirteen.style.opacity =
			currentIndex_thirteen > 0 ? '1' : '0.5';
		btnRight_thirteen.style.opacity =
			currentIndex_thirteen < maxScrollIndex_thirteen ? '1' : '0.5';
	}

	// 初始化
	function initCarousel_thirteen() {
		// 设置banner过渡效果
		banner_thirteen.style.transition = 'transform 0.5s ease-in-out';

		// 初始化按钮状态
		btnLeft_thirteen.style.opacity = '0.5'; // 初始位置左按钮禁用
		btnRight_thirteen.style.opacity =
			maxScrollIndex_thirteen > 0 ? '1' : '0.5'; // 如果没有可滚动距离，右按钮也禁用

		// 添加按钮点击事件
		btnLeft_thirteen.addEventListener('click', () => {
			if (currentIndex_thirteen > 0) {
				scrollBanner_thirteen(currentIndex_thirteen - 1);
			}
		});

		btnRight_thirteen.addEventListener('click', () => {
			if (currentIndex_thirteen < maxScrollIndex_thirteen) {
				scrollBanner_thirteen(currentIndex_thirteen + 1);
			}
		});

		// 添加鼠标滚轮事件监听
		bannerContainer_thirteen.addEventListener(
			'wheel',
			(event) => {
				// 获取滚动方向，deltaY > 0 表示向下滚动，deltaY < 0 表示向上滚动
				const direction_thirteen = Math.sign(event.deltaY);

				if (
					direction_thirteen > 0 &&
					currentIndex_thirteen < maxScrollIndex_thirteen
				) {
					// 向下滚动，且轮播未到最右边，可以向右滑动
					event.preventDefault(); // 只有这种情况才阻止默认行为
					scrollBanner_thirteen(currentIndex_thirteen + 1);
				} else if (
					direction_thirteen < 0 &&
					currentIndex_thirteen > 0
				) {
					// 向上滚动，且轮播未到最左边，可以向左滑动
					event.preventDefault(); // 只有这种情况才阻止默认行为
					scrollBanner_thirteen(currentIndex_thirteen - 1);
				}
				// 其他情况（已经到达边界）不执行preventDefault，允许页面正常滚动
			},
			{ passive: false }
		); // passive: false 允许我们阻止默认事件

		// 初始化进度条
		updateProgress_thirteen();
	}

	// 初始化轮播
	initCarousel_thirteen();
}

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
	navItems.forEach((item) => {
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
		card.style.transition =
			'transform 0.5s ease-in-out, opacity 0.5s ease-in-out';
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

// container_fifteen 。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。
 tags = '.container_fifteen';
 $three_section = $(tags)
 $three_big_box = $(`${tags} img.PC`)
// 图片缩放动画
ScrollTrigger.create({
  trigger: $three_section,
  start: "-70% top",   // 百分比越大 动画提早开始
  end: "+=800", // 缩放动画结束
  scrub: true,
  animation: gsap.timeline()
    .fromTo($three_big_box,
      { borderRadius: 100, scale: 0.2,opacity: 0 },
      { borderRadius: 0, scale: 1,opacity: 1 }
    )
});

// 第三屏幕文字动画，缩放结束后pin住section1
ScrollTrigger.create({
  trigger: $three_section,
  start: "top top", // 与上一个end对齐
  end: "+=1200 ", // 文字动画持续距离，可根据实际调整
  scrub: true,
  pin:true,
  markers: false,
  animation: gsap.timeline()
    .fromTo(`${tags} .text`,
      { y: 120, opacity: 0 },
      { y: 0, opacity: 1 }
    )
});


// container_sixteen 左右滑动动画效果。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。
// 获取container_sixteen .container_top和其中的元素
const containerSixteenTop = document.querySelector(
	'.container_sixteen .container_top'
);
const textSixteenTop = document.querySelector(
	'.container_sixteen .container_top .text'
);
const bgSixteenTop = document.querySelector(
	'.container_sixteen .container_top .bg'
);

// 创建Intersection Observer来检测container_sixteen .container_top是否进入视口
const observerSixteenTop = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				// 当容器进入视口，添加visible类触发动画
				textSixteenTop.classList.add('visible');
				bgSixteenTop.classList.add('visible');
			} else {
				// 当容器离开视口，移除visible类，这样下次进入视口时动画会再次触发
				textSixteenTop.classList.remove('visible');
				bgSixteenTop.classList.remove('visible');
			}
		});
	},
	{
		threshold: 0.2, // 当20%的容器进入视口时触发
	}
);

// 开始观察container_sixteen .container_top
observerSixteenTop.observe(containerSixteenTop);

// container_sixteen .container_center 滑动动画效果。。。。。。。。。。。。。。。。。。。。。。。。
// 获取container_sixteen .container_center元素
const containerSixteenCenter = document.querySelector(
	'.container_sixteen .container_center'
);

// 创建Intersection Observer来检测container_sixteen .container_center是否进入视口
const observerSixteenCenter = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				// 当容器进入视口，添加visible类触发动画
				containerSixteenCenter.classList.add('visible');
			} else {
				// 当容器离开视口，移除visible类，这样下次进入视口时动画会再次触发
				containerSixteenCenter.classList.remove('visible');
			}
		});
	},
	{
		threshold: 0.2, // 当20%的容器进入视口时触发
	}
);

// 开始观察container_sixteen .container_center
observerSixteenCenter.observe(containerSixteenCenter);

// container_sixteen .container_bottom 滑动动画效果。。。。。。。。。。。。。。。。。。。。。。。。
// 获取container_sixteen .container_bottom和其中的元素
const containerSixteenBottom = document.querySelector(
	'.container_sixteen .container_bottom'
);
const imgSixteenBottom = document.querySelector(
	'.container_sixteen .container_bottom .bg'
);
const textSixteenBottom = document.querySelector(
	'.container_sixteen .container_bottom .text'
);

// 创建Intersection Observer来检测container_sixteen .container_bottom是否进入视口
const observerSixteenBottom = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				// 当容器进入视口，添加visible类触发动画
				imgSixteenBottom.classList.add('visible');
				textSixteenBottom.classList.add('visible');
			} else {
				// 当容器离开视口，移除visible类，这样下次进入视口时动画会再次触发
				imgSixteenBottom.classList.remove('visible');
				textSixteenBottom.classList.remove('visible');
			}
		});
	},
	{
		threshold: 0.2, // 当20%的容器进入视口时触发
	}
);

// 开始观察container_sixteen .container_bottom
observerSixteenBottom.observe(containerSixteenBottom);

if (isMobile) {
	// 获取相关DOM元素
	const banner_sixteen = document.querySelector('.container_sixteen .cards');
	const btnLeft_sixteen = document.querySelector(
		'.container_sixteen .btn_left'
	);
	const btnRight_sixteen = document.querySelector(
		'.container_sixteen .btn_right'
	);
	const progressLeft_sixteen = document.querySelector(
		'.container_sixteen .progress_len_left'
	);
	const progressRight_sixteen = document.querySelector(
		'.container_sixteen .progress_len_right'
	);
	const bannerContainer_sixteen = document.querySelector(
		'.container_sixteen .bb'
	);

	// 轮播配置
	const cardCount_sixteen = 3; // 总卡片数
	let currentIndex_sixteen = 0; // 当前显示的卡片索引
	const cardWidth_sixteen = isMobile ? 78 : 21; // 单个卡片宽度（包含margin）vw
	const cardTotal_sixteen = isMobile ? 100 : 84;

	// 计算最大滚动距离 - 只需要显示最后一张卡片
	// 容器宽度是84vw(参考CSS)，卡片宽度是21vw，总共5张卡片，所以最大滚动距离是最后一张卡片刚好完全显示的位置
	const maxScrollIndex_sixteen =
		cardCount_sixteen - Math.floor(cardTotal_sixteen / cardWidth_sixteen); // 最大滚动索引

	// 更新进度条显示
	function updateProgress_sixteen() {
		// 计算当前进度百分比 - 基于最大可滚动距离而不是卡片总数
		const progress_sixteen =
			maxScrollIndex_sixteen > 0
				? (currentIndex_sixteen / maxScrollIndex_sixteen) * 100
				: 100;

		// 更新进度条宽度
		progressLeft_sixteen.style.width = `${progress_sixteen}%`;
		progressRight_sixteen.style.width = `${100 - progress_sixteen}%`;
	}

	// 滚动banner到指定位置
	function scrollBanner_sixteen(index) {
		// 限制索引范围
		if (index < 0) index = 0;
		if (index > maxScrollIndex_sixteen) index = maxScrollIndex_sixteen;

		// 计算滚动距离
		const scrollAmount_sixteen = index * cardWidth_sixteen;
		banner_sixteen.style.transform = `translateX(-${scrollAmount_sixteen}vw)`;

		// 更新进度
		currentIndex_sixteen = index;
		updateProgress_sixteen();

		// 根据当前位置控制按钮状态
		btnLeft_sixteen.style.opacity = currentIndex_sixteen > 0 ? '1' : '0.5';
		btnRight_sixteen.style.opacity =
			currentIndex_sixteen < maxScrollIndex_sixteen ? '1' : '0.5';
	}

	// 初始化
	function initCarousel_sixteen() {
		// 设置banner过渡效果
		banner_sixteen.style.transition = 'transform 0.5s ease-in-out';

		// 初始化按钮状态
		btnLeft_sixteen.style.opacity = '0.5'; // 初始位置左按钮禁用
		btnRight_sixteen.style.opacity =
			maxScrollIndex_sixteen > 0 ? '1' : '0.5'; // 如果没有可滚动距离，右按钮也禁用

		// 添加按钮点击事件
		btnLeft_sixteen.addEventListener('click', () => {
			if (currentIndex_sixteen > 0) {
				scrollBanner_sixteen(currentIndex_sixteen - 1);
			}
		});

		btnRight_sixteen.addEventListener('click', () => {
			if (currentIndex_sixteen < maxScrollIndex_sixteen) {
				scrollBanner_sixteen(currentIndex_sixteen + 1);
			}
		});

		// 添加鼠标滚轮事件监听
		bannerContainer_sixteen.addEventListener(
			'wheel',
			(event) => {
				// 获取滚动方向，deltaY > 0 表示向下滚动，deltaY < 0 表示向上滚动
				const direction_sixteen = Math.sign(event.deltaY);

				if (
					direction_sixteen > 0 &&
					currentIndex_sixteen < maxScrollIndex_sixteen
				) {
					// 向下滚动，且轮播未到最右边，可以向右滑动
					event.preventDefault(); // 只有这种情况才阻止默认行为
					scrollBanner_sixteen(currentIndex_sixteen + 1);
				} else if (direction_sixteen < 0 && currentIndex_sixteen > 0) {
					// 向上滚动，且轮播未到最左边，可以向左滑动
					event.preventDefault(); // 只有这种情况才阻止默认行为
					scrollBanner_sixteen(currentIndex_sixteen - 1);
				}
				// 其他情况（已经到达边界）不执行preventDefault，允许页面正常滚动
			},
			{ passive: false }
		); // passive: false 允许我们阻止默认事件

		// 初始化进度条
		updateProgress_sixteen();
	}

	// 初始化轮播
	initCarousel_sixteen();
}

// container_eighteen 动画效果
// 获取container_eighteen和其中的元素
const containerEighteen = document.querySelector('.container_eighteen');
const titelEighteen = document.querySelector('.container_eighteen .titel');
const cardsOne = document.querySelector('.container_eighteen .cards_one');
const cardsTwo = document.querySelector('.container_eighteen .cards_two');

// 创建Intersection Observer来检测container_eighteen的元素是否进入视口
const observerEighteen = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				// 当元素进入视口，添加visible类触发动画
				entry.target.classList.add('visible');
			}
		});
	},
	{
		threshold: 0.2, // 当20%的元素进入视口时触发
	}
);

// 开始观察container_eighteen的各个元素
if (titelEighteen) observerEighteen.observe(titelEighteen);
if (cardsOne) observerEighteen.observe(cardsOne);
if (cardsTwo) observerEighteen.observe(cardsTwo);

// container_nineteen 动画效果
// 获取container_nineteen的title元素
const titleNineteen = document.querySelector('.container_nineteen .title');

// 创建Intersection Observer来检测container_nineteen的title是否进入视口
const observerNineteen = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				// 当元素进入视口，添加visible类触发动画
				entry.target.classList.add('visible');
			}
		});
	},
	{
		threshold: 0.2, // 当20%的元素进入视口时触发
	}
);

// 开始观察container_nineteen的title元素
if (titleNineteen) observerNineteen.observe(titleNineteen);

// container_twenty 媒体评价轮播（移动端）
// container_twenty 动画效果
// 获取container_twenty的元素
const containerTwenty = document.querySelector('.container_twenty');
const titlesTwenty = document.querySelectorAll('.container_twenty .title');
const imagesTwenty = document.querySelectorAll('.container_twenty img');
const videoPreviewThumbs = document.querySelectorAll(
	'.container_twenty .video-preview-box .video-preview-thumb'
);

// 创建Intersection Observer来检测container_twenty的元素是否进入视口
const observerTwenty = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				// 当元素进入视口，添加visible类触发动画
				entry.target.classList.add('visible');
			}
		});
	},
	{
		threshold: 0.2, // 当20%的元素进入视口时触发
	}
);

// 开始观察container_twenty的元素
if (titlesTwenty) {
	titlesTwenty.forEach((title) => {
		observerTwenty.observe(title);
	});
}

if (imagesTwenty) {
	imagesTwenty.forEach((img) => {
		observerTwenty.observe(img);
	});
}

if (videoPreviewThumbs) {
	videoPreviewThumbs.forEach((thumb) => {
		observerTwenty.observe(thumb);
	});
}

function initMediaCarousel() {
	if (
		window.innerWidth > 767 ||
		window.matchMedia('(orientation: landscape)').matches
	)
		return;
	const grid = document.querySelector('.container_twenty .media-grid');
	if (!grid) return;
	const items = Array.from(grid.querySelectorAll('.media-item'));
	if (items.length === 0) return;
	if (grid.classList.contains('carousel-inited')) return;
	grid.classList.add('carousel-inited');
	let current = 0;
	let timer = null;

	// 进度点容器
	let dots = document.createElement('div');
	dots.className = 'media-dots';
	items.forEach((_, i) => {
		let dot = document.createElement('div');
		dot.className = 'media-dot';
		dot.addEventListener('click', (e) => {
			e.stopPropagation();
			current = i;
			show(current);
			resetTimer();
		});
		dots.appendChild(dot);
	});
	grid.parentElement.appendChild(dots);

	function updateDots(idx) {
		const allDots = dots.querySelectorAll('.media-dot');
		allDots.forEach((d, i) => {
			d.classList.toggle('active', i === idx);
		});
	}

	function show(index) {
		items.forEach((item, i) => {
			if (i === index) {
				item.classList.add('active');
			} else {
				item.classList.remove('active');
			}
		});
		updateDots(index);
	}

	function createBtn(dir) {
		const btn = document.createElement('button');
		btn.className = 'media-carousel-btn ' + dir;
		btn.innerHTML = dir === 'left' ? '‹' : '›';
		btn.addEventListener('click', (e) => {
			e.stopPropagation();
			if (dir === 'left') {
				current = (current - 1 + items.length) % items.length;
			} else {
				current = (current + 1) % items.length;
			}
			show(current);
			resetTimer();
		});
		return btn;
	}

	grid.parentElement.style.position = 'relative';
	grid.appendChild(createBtn('left'));
	grid.appendChild(createBtn('right'));

	// 触摸滑动
	let startX = 0;
	grid.addEventListener('touchstart', (e) => {
		startX = e.touches[0].clientX;
	});
	grid.addEventListener('touchend', (e) => {
		let endX = e.changedTouches[0].clientX;
		if (endX - startX > 40) {
			current = (current - 1 + items.length) % items.length;
			show(current);
			resetTimer();
		} else if (startX - endX > 40) {
			current = (current + 1) % items.length;
			show(current);
			resetTimer();
		}
	});

	function autoNext() {
		current = (current + 1) % items.length;
		show(current);
	}

	function resetTimer() {
		if (timer) clearInterval(timer);
		timer = setInterval(autoNext, 4000);
	}

	show(current);
	resetTimer();
}
window.addEventListener('DOMContentLoaded', initMediaCarousel);
window.addEventListener('resize', () => {
	const grid = document.querySelector('.container_twenty .media-grid');
	if (grid) grid.classList.remove('carousel-inited');
	const dots = document.querySelector('.container_twenty .media-dots');
	if (dots) dots.remove();
	initMediaCarousel();
});

// container_twentyone 动画效果 - 模仿container_fifteen的效果
tags = '.container_twentyone';
$three_section = $(tags)
$three_big_box = $(`${tags} img.PC`)
// 图片缩放动画
ScrollTrigger.create({
  trigger: $three_section,
  start: "-70% top",   // 百分比越大 动画提早开始
  end: "+=800", // 缩放动画结束
  scrub: true,
  animation: gsap.timeline()
    .fromTo($three_big_box,
      { borderRadius: 100, scale: 0.2,opacity: 0 },
      { borderRadius: 0, scale: 1,opacity: 1 }
    )
});

// 第三屏幕文字动画，缩放结束后pin住section1
ScrollTrigger.create({
  trigger: $three_section,
  start: "top top", // 与上一个end对齐
  end: "+=1200 ", // 文字动画持续距离，可根据实际调整
  scrub: true,
  pin:true,
  markers: false,
  animation: gsap.timeline()
    .fromTo(`${tags} .text`,
      { y: 120, opacity: 0 },
      { y: 0, opacity: 1 }
    )
});


// container_twentytwo 动画效果
// 获取container_twentytwo的元素
const containerTwentytwo = document.querySelector('.container_twentytwo');
const titleTwentytwo = document.querySelector('.container_twentytwo > .title');
const cardsTwentytwo = document.querySelectorAll(
	'.container_twentytwo .cards .card'
);

// 创建Intersection Observer来检测container_twentytwo的元素是否进入视口
const observerTwentytwo = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				// 当元素进入视口，添加visible类触发动画
				entry.target.classList.add('visible');
			} 
			// else {
			// 	// 当元素离开视口，移除visible类，这样下次进入视口时动画会再次触发
			// 	entry.target.classList.remove('visible');
			// }
		});
	},
	{
		threshold: 0.2, // 当20%的元素进入视口时触发
	}
);

// 开始观察container_twentytwo的元素
if (titleTwentytwo) observerTwentytwo.observe(titleTwentytwo);
cardsTwentytwo.forEach((card) => {
	observerTwentytwo.observe(card);
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
