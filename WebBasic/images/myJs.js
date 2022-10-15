var writeTimes = 0 ; //记录代码生成动态p元素的总次数
var waitForEaseIn = 0 ; //记录自动切入入p元素的编号
var showIt = true ; //保障异步代码不提前执行的开关

function $(s){
    createPDoms(s);
    if( waitForEaseIn > 0 && showIt){
      setTimeout(easeInDoms,200) ; 
    }
    //createPDoms(s)函数在Web页的header区域中添加一个p元素，p元素内包含序号、文字、数字、符号三种信息，分别以不同颜色显示在Web页上。函数传入的参数s，s是p元素内部创建文字、数字、符号的信息（字符串类型）来源。
 
}//Function $(s) End

function createPDoms(s){
    s = '' + s ;
    var headerDom = document.querySelector('header') ;
    var outputDom = document.createElement("p") ;
        writeTimes ++ ;
        waitForEaseIn += 1 ;
        outputDom.id = 'outputP' + writeTimes ;
    var snDom = document.createElement("span") ;
        snDom.className = 'sn' ;
        snDom.textContent = writeTimes  + '.' + '$' ;
       
        outputDom.appendChild(snDom) ;
        
        //下面分析s，为运算符添加op的CSS类名，为关键字添加key的CSS类名 。
    var codeObjArr = parseCode(s) ;
       function parseCode(s){
           var op = ['+','-','*','/','(',')','（','）','[',']','{','}','\'','\"','=','%','&','|',',','，','.','。','!','！',':','：','?','？'] ;
            
           var codeArr = [] ;
           var i = 0 ;
           var word = {text: '' , type: ''} ;
           while(s[i]){
             if(op.indexOf(s[i]) !== -1 || parseInt(s[i]) || parseInt(s[i])===0 ){
                codeArr.push(word) ;
                word = {text: s[i] , type: ''} ;
                if(parseInt(s[i]) || parseInt(s[i])===0 ){
                    word.type = 'num' ;
                }else{
                    word.type = 'op' ;
                }
                 codeArr.push(word) ;
                 word = {text: '' , type: ''} ;
             }else{
                word.text += s[i] ;
             }
             i++ ; 
            }
            if(word.text !==''){
             codeArr.push(word) ;
             }
          return codeArr ;
       }
         

       for(var i =0 ; i < codeObjArr.length ; i++ ){
           codeWord = codeObjArr[i] ;
            var stringDom = document.createElement("span") ;
            stringDom.textContent =  codeWord.text ;
            if(codeWord.type){
                stringDom.className = codeWord.type ;
            }
            outputDom.appendChild(stringDom) ;
        }
              
       headerDom.appendChild(outputDom) ;
}//Function creatPDoms(s) End

     //easeInDoms()函数以全局变量writeTimes 和showIt为判断条件，以异步方式动画方式，把Web页header区域的p元素一一显示在header区域。
     //背景：在与本文件myJs.js配合的myCss.css文件中，默认设定了header p段落距离正常显示位置较远，而通过本函数对p的className = 'easeIn'设定，动态把header p段落设定到到正常位置 。
     function easeInDoms(){
        if( waitForEaseIn > 0 && showIt){
           //console.log(writeTimes);
            //var pDoms = document.querySelectorAll('header p') ;
            //var thisPnum = pDoms.length - writeTimes + 1 ;
            //thisPnum 控制按writeTimes记录的创建次序，从小到大设置p元素的入场（easeIn）次序 header p#outputP + thisPnum
            var outp = document.querySelector('header p#outputP' + ( writeTimes - waitForEaseIn + 1) );
                outp.className = 'easeIn' ; 
                waitForEaseIn -- ;
                showIt = false ;
                setTimeout( function(){
                    showIt = true ;
                    easeInDoms();
                 },200) ;
          }
     }// End of easeIn  

     function my$(text){
      var ele = document.querySelector('header') ;
      if(waitForEaseIn === 0) { 
        //发生这个条件，说明所有该入场的句子已出现，异步执行的easeInDoms函数已经结束了。         否则，用户点击按钮快于异步入场动画反馈，会导致控制页面上的easeInDoms函数出现严重错误，后面的动态p元素的入场都会失效和出错。
        ele.textContent = text ;
      }
     }