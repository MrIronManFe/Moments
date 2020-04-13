// TODO: 用户名称需修改为自己的名称
var userName = '许大铁';
// 朋友圈页面的数据
var data = [{
    user: {
        name: '阳和',
        avatar: './img/avatar2.png'
    },
    content: {
        type: 0, // 多图片消息
        text: '华仔真棒，新的一年继续努力！',
        pics: ['./img/reward1.png', './img/reward2.png', './img/reward3.png', './img/reward4.png'],
        share: {},
        timeString: '3分钟前'
    },
    reply: {
        hasLiked: false,
        likes: ['Guo封面', '源小神'],
        comments: [{
            author: 'Guo封面',
            text: '你也喜欢华仔哈！！！'
        }, {
            author: '喵仔zsy',
            text: '华仔实至名归哈'
        }]
    }
}, {
    user: {
        name: '伟科大人',
        avatar: './img/avatar3.png'
    },
    content: {
        type: 1, // 分享消息
        text: '全面读书日',
        pics: [],
        share: {
            pic: 'http://coding.imweb.io/img/p3/transition-hover.jpg',
            text: '飘洋过海来看你'
        },
        timeString: '50分钟前'
    },
    reply: {
        hasLiked: false,
        likes: ['阳和'],
        comments: []
    }
}, {
    user: {
        name: '深圳周润发',
        avatar: './img/avatar4.png'
    },
    content: {
        type: 2, // 单图片消息
        text: '很好的色彩',
        pics: ['http://coding.imweb.io/img/default/k-2.jpg'],
        share: {},
        timeString: '1小时前'
    },
    reply: {
        hasLiked: false,
        likes: [],
        comments: []
    }
}, {
    user: {
        name: '喵仔zsy',
        avatar: './img/avatar5.png'
    },
    content: {
        type: 3, // 无图片消息
        text: '以后咖啡豆不敢浪费了',
        pics: [],
        share: {},
        timeString: '2个小时前'
    },
    reply: {
        hasLiked: false,
        likes: [],
        comments: []
    }
}];

// 相关 DOM
var $page = $('.page-moments');
var $momentsList = $('.moments-list');

/**
 * 点赞内容 HTML 模板
 * @param {Array} likes 点赞人列表
 * @return {String} 返回html字符串
 */
function likesHtmlTpl(likes) {
    if (!likes.length) {
        return '';
    }
    var htmlText = ['<div class="reply-like"><i class="icon-like-blue"></i>'];
    // 点赞人的html列表
    var likesHtmlArr = [];
    // 遍历生成
    for (var i = 0, len = likes.length; i < len; i++) {
        likesHtmlArr.push('<a class="reply-who" href="#">' + likes[i] + '</a>');
    }
    // 每个点赞人以逗号加一个空格来相隔
    var likesHtmlText = likesHtmlArr.join(', ');
    htmlText.push(likesHtmlText);
    htmlText.push('</div>');
    return htmlText.join('');
}
/**
 * 评论内容 HTML 模板
 * @param {Array} likes 点赞人列表
 * @return {String} 返回html字符串
 */
function commentsHtmlTpl(comments) {
    if (!comments.length) {
        return '';
    }
    var htmlText = ['<div class="reply-comment">'];
    for (var i = 0, len = comments.length; i < len; i++) {
        var comment = comments[i];
        htmlText.push('<div class="comment-item"><a class="reply-who" href="#">' + comment.author + '</a>：' + comment.text + '</div>');
    }
    htmlText.push('</div>');
    return htmlText.join('');
}
/**
 * 评论点赞总体内容 HTML 模板
 * @param {Object} replyData 消息的评论点赞数据
 * @return {String} 返回html字符串
 */
function replyTpl(replyData) {
    var htmlText = [];
    htmlText.push('<div class="reply-zone">');
    htmlText.push(likesHtmlTpl(replyData.likes));
    htmlText.push(commentsHtmlTpl(replyData.comments));
    htmlText.push('</div>');
    return htmlText.join('');
}
/**
 * 多张图片消息模版 （可参考message.html）
 * @param {Object} pics 多图片消息的图片列表
 * @return {String} 返回html字符串
 */
function multiplePicTpl(pics) {
    var htmlText = [];
    htmlText.push('<ul class="item-pic">');
    for (var i = 0, len = pics.length; i < len; i++) {
        htmlText.push('<img class="pic-item cover-img" src="' + pics[i] + '">')
    }
    htmlText.push('</ul>');
    return htmlText.join('');
}
/**
 * 分享消息模版 （可参考message.html）
 * @param {Object} shareInfo 分享消息的对象信息
 * @return {String} 返回html字符串
 */
function shareInfoTpl(shareInfo) {
    var htmlText = [];
    htmlText.push('<div class="shareInfo">')
    htmlText.push('<img src="' + shareInfo['pic'] + '">');
    htmlText.push('<p>' + shareInfo['text'] + '</p>');
    htmlText.push('</div>');
    return htmlText.join('');
}
/**
 * 单图消息模板
 * @param {Object} pics 单张图片消息的图片列表
 * @return {String} 返回html字符串
 */
function singlePicTpl(pics) {
    var htmlText = [];
    htmlText.push('<img class="singlePic cover-img" src="' + pics[0] + '">');
    return htmlText.join('');
}

/**
 * 循环：消息体 
 * @param {Object} messageData 对象
 */
function messageTpl(index, messageData) {
    var user = messageData.user;
    var content = messageData.content;
    var htmlText = [];
    htmlText.push('<div class="moments-item data-index=' + index + '">');
    // 消息用户头像
    htmlText.push('<a class="item-left" href="#">');
    htmlText.push('<img src="' + user.avatar + '" width="42" height="42" alt=""/>');
    htmlText.push('</a>');
    // 消息右边内容
    htmlText.push('<div class="item-right">');
    // 消息内容-用户名称
    htmlText.push('<a href="#" class="item-name">' + user.name + '</a>');
    // 消息内容-文本信息
    htmlText.push('<p class="item-msg">' + content.text + '</p>');
    // 消息内容-图片列表 
    var contentHtml = '';
    // 目前只支持多图片消息，需要补充完成其余三种消息展示
    switch (content.type) {
        // 多图片消息
        case 0:
            contentHtml = multiplePicTpl(content.pics);
            break;
        case 1:
            // TODO: 实现分享消息
            contentHtml = shareInfoTpl(content.share);
            break;
        case 2:
            contentHtml = singlePicTpl(content.pics);
            break;
            // TODO: 实现单张图片消息
        case 3:
            contentHtml = "";
            break;
            // TODO: 实现无图片消息
    }
    htmlText.push(contentHtml);
    // 消息时间和回复按钮
    htmlText.push('<div class="item-ft">');
    htmlText.push('<span class="item-time">' + content.timeString + '</span>');
    htmlText.push('<div class="item-reply-btn">');
    htmlText.push('<span class="item-reply"></span>');
    htmlText.push('</div></div>');
    // 消息回复模块（点赞和评论）
    htmlText.push(replyTpl(messageData.reply));
    htmlText.push('</div></div>');
    return htmlText.join('');
}

/**
 * 页面渲染函数：render
 */
function render() {
    // TODO: 目前只渲染了一个消息（多图片信息）,需要展示data数组中的所有消息数据。
    // var messageHtml = messageTpl(data[0]);
    var messageHtml = '';
    // 提取data数组中的所有消息数据
    for (var i = 0; i < data.length; i++) {
        messageHtml += messageTpl(i, data[i]);
    }
    // 渲染所有数据
    $momentsList.html(messageHtml);
}


/**
 * 页面绑定事件函数：bindEvent
 */
function bindEvent() {
    // TODO: 完成页面交互功能事件绑定
    // 
    // 3、实现回复按钮功能
    // 点击信息的回复按钮，弹出回复操作面板
    // 同时只能展现一个回复操作面板
    // 点击非回复操作面板的区域，隐藏回复操作面板
    $momentsList.on('click', '.item-reply-btn', function(event) {
        createReplyBtn($(this));
        // 取消冒泡否则无法触发生成函数
        event.stopPropagation();
    })
    // 4、实现点赞功能
    // 对于未点赞的信息，点击回复按钮，展现点赞的按钮
    // 对于已点赞的信息，点击回复按钮，展现取消点赞的按钮
    // 点击点赞按钮，完成点赞
    // 点击取消按钮，取消点赞
    $momentsList.on('click', '.hasLiked', function() {
        like($(this));

    })
    // 5、实现增加评论功能
    // 点击回复按钮，底部展现输入框和发送按钮
    // 当文本框为空，发送按钮为灰色不可点击状态
    // 当文本框不为空，发送按钮为绿色且点击发送，在信息栏中增加信息
    $momentsList.on('click', '.comment', function() {
        createCommentPanel($(this));
    })
    // 6、点击图片放大功能
    // 点击信息的图片，展示放大图片
    // 点击放大展示的图片区域，隐藏放大图片区域
    $momentsList.on('click', '.cover-img', function() {
        saclePic($(this));
    });
}


/**
 * 生成回复按钮
 * @param  {object} clickBtn [调用对象]
 */
function createReplyBtn(target) {
    // 保证页面只有一个回复页面
    if (document.querySelector('.replyBtn')) {
        $('.replyBtn').remove();
    }
    // 获取点击序列
    var momentsItem = target.parents(".moments-item");
    var str = momentsItem.attr('class');
    var index = str.charAt(str.length - 1);
    // 获取点赞取值
    var hasLiked = data[index]['reply']['hasLiked'];
    // 根据点赞取值创建按钮内容
    var htmlText = '<div class="replyBtn">' + '<span class="hasLiked">' + (hasLiked ? '取消' : '点赞') + '</span>' + '<span class="comment">评论</span>' + '</div>';
    // 获取添加回复按钮的父元素
    var replyBtnParentNode = target.parents(".item-ft");
    // 把回复按钮添加到父元素
    replyBtnParentNode.append(htmlText);
    // 设置往左侧滑动动画效果
    $('.replyBtn').animate({
        right: target.outerWidth(),
        opacity: 1,
    });
    // 点击非回复操作面板的区域，隐藏回复操作面板
    $page.on('click', function() {
        $('.replyBtn').remove();
    })
}

/**
 * 点赞功能
 * @param  {object} hasLike [调用对象]
 */
function like(target) {
    // 获取点击序列
    var momentsItem = target.parents(".moments-item");
    var str = momentsItem.attr('class');
    var index = str.charAt(str.length - 1);
    // 获取该用户该朋友点赞状态
    var hasLikedOrNot = data[index]['reply']['hasLiked'];
    // 根据点赞状态生成相对应内容
    if (hasLikedOrNot) {
        // 该用户该朋友圈已经点赞
        // 更新该朋友圈点赞人状态
        data[index]['reply']['likes'].pop();
        // 修改用户该朋友圈点赞状态
        hasLikedOrNot = false;
        data[index]['reply']['hasLiked'] = hasLikedOrNot;
    } else {
        // 该朋友圈尚未点赞
        // 获取该用户的名字
        var name = userName;
        // 更新该朋友圈点赞人状态
        data[index]['reply']['likes'].push(name);
        // 修改用户该朋友圈点赞状态
        hasLikedOrNot = true;
        data[index]['reply']['hasLiked'] = hasLikedOrNot;
    }
    // 修改回复按钮内容
    var htmlTxt = hasLikedOrNot ? '取消' : '点赞';
    // 更新回复按钮内容
    target.html(htmlTxt);
    // 获取点赞内容
    var replyLike = momentsItem.find('.reply-like');
    // 删除点赞内容
    replyLike.remove();
    // 获取点赞内容父元素
    var replyZone = momentsItem.find('.reply-zone');
    // 重新渲染点赞内容
    var htmlTxt = likesHtmlTpl(data[index]['reply']['likes']);
    replyZone.prepend(htmlTxt);
    // 动画删除回复按钮
    setTimeout(function() {
        $('.replyBtn').remove();
    }, 500);
}
/**
 * 评论功能
 * @param  {object} clickBtn [调用对象]
 */
function createCommentPanel(target) {
    // 获取点击序列
    var momentsItem = target.parents(".moments-item");
    var str = momentsItem.attr('class');
    var index = str.charAt(str.length - 1);
    // 保证页面只有一个评论页面
    if (document.querySelector('.commentPanel')) {
        $('.commentPanel').remove();
    }
    // 记录页面滚动距离
    var scrollY = window.scrollY;
    // 创造遮盖页面
    createCoverPage($page);
    // 遮盖页面事件绑定
    $('.coverPage').on('click', function() {
        $(this).remove();
    });
    // 评论面板内容
    var htmlTxt = '<div class="commentPanel">' + '<input type="text" class="inputArea" placeholder="评论">' + '<button class="commentBtn disabled" disabled="disabled">发送</button>' + '</div>';
    // 添加到页面
    $('.coverPage').append(htmlTxt);
    // 设置writeComment的样式
    $(".commentPanel").css({
        bottom: 0 - $(this).outerHeight(),
        width: $('.coverPage').outerWidth(),
    })
    // 评论操作面板动画效果
    $(".commentPanel").animate({
        bottom: 0,
        opacity: 1,
    }, 'eastOutQuint');
    // 关闭回复面板
    $('.replyBtn').remove();
    // 输入框自动获取焦点
    $('.inputArea').focus();
    // 输入框事件绑定
    $('.inputArea').on('keyup', function() {
        if ($(this).val().trim() != '') {
            // 输入内容不为空
            // 发送按钮可用
            $('.commentBtn').removeAttr('disabled');
            // 发送按钮删除不可用样式
            $('.commentBtn')[0].classList.remove('disabled');
        } else {
            // 若输入内容为空
            // 发送按钮不可用
            $('.commentBtn').attr('disabled', 'true');
            // 发送按钮添加不可用样式
            $('.commentBtn')[0].classList.add('disabled');
        }
    })
    // 发送按钮事件绑定
    $('.commentBtn').on('click', function(event) {
        // 阻止事件对象冒泡触发遮盖页面绑定事件
        event.stopPropagation();
        // 删除回复面板;
        // 获取输入内容
        var inputValue = $('.inputArea').val().trim();
        // 更新该条朋友圈评论内容
        data[index]['reply']['comments'].push({
            author: userName,
            text: inputValue,
        })
        // 删除原有评论区内容
        $('.reply-comment').remove();
        // 生成新评论区内容
        var htmlTxt = commentsHtmlTpl(data[index]['reply']['comments']);
        // 获取评论区父元素
        var replyZone = momentsItem.find('.reply-zone');
        // 重新渲染评论区内容
        replyZone.append(htmlTxt);
        // 评论完毕后删除遮盖层
        $('.coverPage').click();
    })
}

/**
 * 放大图片功能
 * @param  {object} clickBtn [调用对象]
 */
function saclePic(target) {
    // 记录页面滚动距离
    var scrollY = window.scrollY;
    // 创建遮盖页面
    createCoverPage($page);
    // 添加遮盖页面父元素相对应样式
    $page.addClass('saclePicFunctionCoverPageParentNode');
    // 添加遮盖页面的样式
    $('.coverPage').addClass('sacleFunctioncoverPage');
    // 添加相应图片到遮盖页面
    $('.coverPage').append('<img class="coverPagePic">');
    // 获取点击图片的src
    var picSrc = target.attr('src');
    // 设置图片的src
    $('.coverPagePic').attr('src', picSrc);
    // 添加取消放大图层事件,恢复
    $('.coverPage').on('click', { 'documentY': scrollY }, function(event) {
        // 删除遮盖页
        this.remove();
        // 父元素清空样式
        $page.removeClass();
        // 恢复父元素样式
        $page.addClass('page-moments');
        // 恢复页面滚动距离
        $(document).scrollTop(event.data['documentY'])
    })
    // console.log($page.scrollTop());
}

/**
 * 页面入口函数：init
 * 1、根据数据页面内容
 * 2、绑定事件
 */
function init() {
    // 渲染页面
    render();
    bindEvent();
}

init();

/**
 * 创建遮盖层
 * @param  {object} clickBtn [添加的父元素]
 */
function createCoverPage(parentElement) {
    // 获取遮盖层
    var coverPage = document.querySelector('.coverPage');
    // 若遮盖层为空，创建，并且添加的父元素
    if (!coverPage) {
        // 遮盖层html内容
        var htmlTxt = '<div class="coverPage"></div>';
        // 把遮盖层添加的父元素上
        parentElement.append(htmlTxt);
    }
    // 为复原添加对应的样式
    parentElement.addClass('coverPageParent');
    // 设置遮盖页面宽度跟父元素齐平
    $('.coverPage').css({
        width: $page.width(),
    })
}