/**
 * 订阅函数 - 处理表单提交
 * @param {Event} event - 点击事件对象
 */
function subscribe(event) {
    // 获取被点击的按钮
    const clickedButton = event.target;
    
    // 查找与按钮同父级的.subscribe容器
    const subscribeContainer = clickedButton.closest('.subscribe');
    
    if (!subscribeContainer) {
        console.error('未找到订阅容器');
        return;
    }
    
    // 在当前订阅容器内查找input元素
    const emailInput = subscribeContainer.querySelector('input');
    
    if (!emailInput) {
        console.error('未找到邮箱输入框');
        return;
    }
    
    const emailValue = emailInput.value.trim();

    // 验证输入框是否有值
    if (!emailValue) {
        alert('请输入您的邮箱地址！');
        return;
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
        alert('请输入有效的邮箱地址！');
        return;
    }

    // 查找当前容器内的错误提示元素
    const errorTips = subscribeContainer.querySelector('.email_error_tips');
    if (errorTips) {
        errorTips.style.display = 'none';
    }

    fetch('https://aivela-subscribe-email.erpanomer.workers.dev/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: emailValue,
        }),
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log('成功:', data);
            window.open('/pages/buy', '_blank');
        })
        .catch((error) => {
            console.error('请求失败:', error);
        });
}

// 获取所有订阅按钮并添加点击事件
document.querySelectorAll('.subscribe button').forEach(button => {
    button.addEventListener('click', subscribe);
});
