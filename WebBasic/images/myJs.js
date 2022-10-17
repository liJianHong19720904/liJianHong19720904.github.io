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
    var textObjArr = parseText(s) ;
       function parseText(s){
        /* 本函数 按照样式表如下的类名，对动态生成的span元素展开类设定，形成不同含义的文字有不同的颜色
       header p span.sn{
	   }
	   header p span.num{
	   }
	   header p span.op{
	   }
	   header p span.letter{
	   }
        */
           var op = ['+','-','*','/','(',')','（','）','[',']','［','］','{','}','\'','\"','=','%','&','|',',','，','.','。','!','！',':','：','?','？'] ;
           
           // 在唐诗三百首中，把中文标点符号一律当作op类处理，这样在该项目Web页面渲染中，文字结构显得更加清晰。
           var TextArr = [] ;
           var i = 0 ;
           
           while(s[i]){
            var word = {text: '' , type: ''} ;
             if(op.indexOf(s[i]) !== -1 ){
                word.type = 'op';
             } else if(parseInt(s[i]) || parseInt(s[i])===0 ){
                word.type = 'num' ;
             } else if(s[i]>='a'&&s[i]<='z' || s[i]>='A'&&s[i]<='Z'){
                word.type = 'letter';
             }
                word.text = s[i] ;
                TextArr.push(word) ;
                 i++ ; 
            }
           return TextArr ;
         } //End of parseText function
         

       for(var i =0 ; i < textObjArr.length ; i++ ){
            Word = textObjArr[i] ;
            var stringDom = document.createElement("span") ;
            stringDom.textContent =  Word.text ;
            if(Word.type){
                stringDom.className = Word.type ;
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
        writeTimes = 0 ; //header标题发生变化，内容序号也要全部清零
      }
     }