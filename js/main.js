const REMOTE = "http://localhost:23524";
$('.dropdown-trigger').dropdown();

function selectFile(){
  let card = $('#result-card');
  if (!card.hasClass('scale-out')) {
    closeCard();
  }
  $("#imgFile").trigger("click");
}

function uploadFile() {
  let files = $('#imgFile').prop('files');
  if (files[0] === undefined) {
    return
  }
  $('#progress1').removeClass("hide");
  let data = new FormData();
  data.append('file', files[0]);
  document.getElementById("result-card-img").src = getObjectURL(files[0]);
  let card = $('#result-card');
  card.show();
  setTimeout(function(){
    card.toggleClass('scale-out');
  }, 100);
  $.ajax({
    type: 'POST',
    url: REMOTE + '/get',
    cache: false,
    processData: false,
    contentType: false,
    data: data,
    success: function (ret) {
      $('#progress1').addClass('hide');
      $('#card-action').removeClass('hide');
      classifyResult(ret['result'][0]);
      //console.log(ret);
      M.toast({html: '上传成功!'})
    },
    error: function () {
      $('#progress1').addClass('hide');
      $('#card-action').removeClass('hide');
      $('#result-card-classify').text("上传失败！");
      $('#result-card-classify-content').text("将文件上传至服务器失败，请尝试重新上传。");
      M.toast({html: '图片上传失败！'});
    },
    complete: function (xhr, ts) {
      $('#progress1').addClass('hide');
    }
  });
}

function selectFile2(){
  $("#imgFile2").trigger("click");
}

function uploadFile2(type) {
  let files = $('#imgFile2').prop('files');
  if (files[0] === undefined) {
    return
  }
  $('#progress2_1').removeClass("hide");
  $('#progress2_2').removeClass("hide");
  let data = new FormData();
  data.append('file', files[0]);
  data.append('type', type);
  $.ajax({
    type: 'POST',
    url: REMOTE + '/train',
    cache: false,
    processData: false,
    contentType: false,
    data: data,
    success: function (ret) {
      $('#progress2_1').addClass("hide");
      $('#progress2_2').addClass("hide");
      M.toast({html: '上传成功!'})
    },
    error: function () {
      $('#progress2_1').addClass("hide");
      $('#progress2_2').addClass("hide");
      M.toast({html: '图片上传失败!'});
    },
    complete: function (xhr, ts) {
      $('#progress2_1').addClass("hide");
      $('#progress2_2').addClass("hide");
    }
  });
}

function closeCard() {
  let card = $('#result-card');
  card.toggleClass('scale-out');
  setTimeout(function(){
    card.hide();
    $('#card-action').addClass('hide');
    $('#result-card-classify').text("正在识别...");
    $('#result-card-classify-content').text("图片已经提交到服务器进行处理了，请耐心等待。");
  }, 500);
}

function classifyResult(type) {
  switch(type) {
    case 0:
      $('#result-card-classify').text("硬纸板");
      $('#result-card-classify-content').text("硬纸板是一种常见用于打包的可回收垃圾。");
      break;
    case 1:
      $('#result-card-classify').text("塑料");
      $('#result-card-classify-content').text("塑料是一种常见的（半）透明可回收垃圾。");
      break;
    case 2:
      $('#result-card-classify').text("其他垃圾");
      $('#result-card-classify-content').text("这是生活中的一些常见垃圾，这些垃圾大部分可以进行回收。");
      break;
  }
}

function getObjectURL(file) {
  let url = null ;
  if (window.createObjectURL!==undefined) { // basic
    url = window.createObjectURL(file) ;
  } else if (window.URL!==undefined) { // mozilla(firefox)
    url = window.URL.createObjectURL(file) ;
  } else if (window.webkitURL!==undefined) { // webkit or chrome
    url = window.webkitURL.createObjectURL(file) ;
  }
  return url ;
}