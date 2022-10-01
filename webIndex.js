//ajxObj 全局对象
var ajaxObj = {
     content: [] ,
     xhrReq : (url) =>  {
         ajaxObj.content = [] ;
         let xhr = new XMLHttpRequest();
          xhr.onreadystatechange = myCallback ;
          console.time('AjaxTime');
          xhr.open('GET',url,true);
          xhr.send('');
        function myCallback(){ //myCallback函数是定义在ajaxObj.xhrReq内的函数，为xhr对象陆续4次发生的异步事件提供响应代码。
 // 一般正常的情况，根据ajax请求情况和结果的不同，xhr的onreadystatechange事件会被触发1次（不成功）或4次（成功），也即是myCallback函数会被执行4次。
          console.log("Ajax state changed : "+ xhr.readyState);
       if (xhr.readyState ===0 ){
          console.log("Ajax 连接不成功，断网了？");
          console.timeEnd("AjaxTime");
          return ;
       }
       if (xhr.readyState === 1 ){
           console.log("Beign connecting...");
           console.timeEnd("AjaxTime");
           console.time('AjaxTime');
           return ;
       } 
       if (xhr.readyState === 2 ){
           console.log("Loading...");
           console.timeEnd("AjaxTime");
           console.time('AjaxTime');
           return ;
       } 
       if (xhr.readyState === 3 ){
           console.log("Interacting... ");
           console.timeEnd("AjaxTime");
           console.time('AjaxTime');
           return ;
       } 
       if (xhr.readyState === 4 ){
           console.log("Ajax is complete .");
           console.timeEnd("AjaxTime");
           if (xhr.status !== 200){
               console.log("Get text file from Server failed ! ");
               return ;
           }else{
                ajaxObj.content = xhr.responseText; //全局变量ajaxObj
             } // success of GET TXT
            }//readyState === 4
          }//end of myCallback	     
     },//end of xhrReq methoed   
    };//end of ajaxObj definition
   /****
   上面ajax读取的文本与index.html内的article的结构匹配 
   title指标题区  introduction 指摘要或介绍   keyword指关键字   project指案例区   reading指拓展阅读区
   ***/
   var outputUI = {
     showTitle:function(){
        var titleTxt = Model.contentArr[0];
       //title信息中，格式为：English（中文），下面用异步代码实现中英文轮播
       var pos1 =  titleTxt.search('（') ;
       var pos2 = titleTxt.search('）');
       var titleEn = titleTxt.substring(0,pos1) ;
       var titleCn = titleTxt.substring(pos1+1,pos2) ;
       my$("#title").textContent = titleEn ;
       my$("#title").onmousemove = function(){
         this.textContent = titleCn ;
       };
       my$("#title").onmouseout = function(){
        this.textContent = titleEn ;
      };
     } ,
     showIntroduction : function(){
       my$("#introduction").textContent = "";
       var parasTxt = Model.contentArr[1].split('\n');
       let b = document.createElement("b"); 
       b.textContent =  "内容简介 : ";
       my$("#introduction").appendChild(b);
      
      for (let pTxt of parasTxt){
        let p = document.createElement("p"); 
        let t = document.createTextNode(pTxt);
        p.appendChild(t);
        my$("#introduction").appendChild(p);
       }
     } ,
     showKeyword : function(){
      my$("#keyword").textContent = "";
      var paraTxt = Model.contentArr[2];
      let p = document.createElement("p"); 
      let b = document.createElement("b");
      let t = document.createTextNode(paraTxt);
      b.textContent =  "本课关键字 : ";
      p.appendChild(t);
      my$("#keyword").appendChild(b);
      my$("#keyword").appendChild(p);
     },
     showProject:function(){
       my$("#project").textContent = "";
       var paras1 = Model.contentArr[3].split("\n");
       //用户描述project的文本文件，由于可能使用不同的编辑器，造成情况非常不同，比如换行会同时出现\r和\n
       //下面这段循环程序过滤了，用户创建文本文件时，随意创建的换行和空格。
       let paras = [] ;
       let j = 0 ;
       for(let i=0 ; i < paras1.length ; i++){
         paras1[i]= paras1[i].trim();
         if(paras1[i] =="" || paras1[i] == "\r"){
             
         }else{
            paras[j] = paras1[i];
            j++ ;
         }
       }
       
       for (var i=0; i< paras.length; i++ ){
           let b = document.createElement("b");
           let p = document.createElement("p");
           var no;
               no = i+1 ;
              
            //增加“运行本例”按钮
           let bt = document.createElement("input");
           bt.type = "button" ; 
           bt.value = "运行本例" ;
           let aProperty = paras[i].substring(7,paras[i].search('>')) ;
           let titlePos =  aProperty.search("title=") ;
            if(titlePos!==-1){
               bt.id = aProperty.substring(0,titlePos);
               bt.title = aProperty.substring(titlePos+6);
                }else{
               bt.id = aProperty ;
               }
           if(!bt.title){
             bt.title = "本例尚未命名" ;

           }
           b.textContent =  "案例实践:"+Model.lessonId +"."+ no + " 《 " + bt.title +" 》";
           my$("#project").appendChild(b);
            
           bt.onclick = function(eObj){
            var url ;
             if(this.id.substring(0,4)==='http'){
               url = this.id ;
             }else{
               url = Model.getUrlPath() + (this.id)  ;
             }
            
             //window.open(url);
              popWindow(eObj);//立刻弹出浮动窗口，为显示案例做准备
              var popWindowDom = document.querySelector('div#popWindow');
                  popWindowDom.style.backgroundColor = 'rgb(200,200,200)' ;
              var iframeDom = document.createElement('iframe');
              iframeDom.style.width = '100%' ;
              iframeDom.style.height = window.innerHeight * 0.8 + 'px' ;
              iframeDom.src = url ;
              
              popWindowDom.appendChild(iframeDom);
           };

           //增加“显示源码”按钮
           let bt1 = document.createElement("input");
           bt1.type = "button" ; 
           bt1.value = "显示源码" ;
           bt1.url = bt.id ;
           bt1.onclick = function(eObj){
             popWindow(eObj);//立刻弹出浮动窗口，为代码显示做准备
             var url = this.url ;
             var typeOfFile = (url.substring(url.length - 8)).trim();
             if(typeOfFile.length > 4){
              typeOfFile = typeOfFile.substring(typeOfFile.length-4)
             }
             //alert(typeOfFile) ;
             //outputUI.popWindow(s)方法将对传入的s进行分析，按源代码格式实现对页面的输出
             if (url.substring(0,4)==='http' || typeOfFile !== 'html'){
              outputUI.popWindow("本例不是编程案例，没有源码!") ;
              document.querySelector('div#popWindow').style.top = eObj.pageY + 'px' ;
             }
             if( typeOfFile === 'html' ||  typeOfFile === '.css'  ||  typeOfFile.substring(1) === '.js'){
              //"Get Code ..."
              ajaxObj.xhrReq(Model.getUrlPath()+url) ;
              //alert(ajaxObj.content);不可能马上能获取网络上的html文档

              setTimeout(()=>{
                if(ajaxObj.content){
                  //alert(ajaxObj.content);
                  outputUI.popWindow(ajaxObj.content) ;
                }else{
                  setTimeout(()=>{
                     outputUI.popWindow(ajaxObj.content) ;
                    } ,500) ;
                }
              },500);
             };
          };//“显示源码”的onclick事件函数
      //“显示源码”按钮结束

           paras[i] = paras[i].substring(paras[i].search('>')+1) ;
           let txt = document.createTextNode("本例简介："+paras[i]);
            p.appendChild(bt);
            p.appendChild(bt1);
            p.appendChild(txt); 
           my$("#project").appendChild(p);
             }//end for loop


        function popWindow(eObj){ //eObj参数由调用本函数的事件处理函数onclick的参数，通过lexical语法传至本popWindow函数
         //创建前，检测是否有div#popWindow 未关闭
             if(document.querySelector('div#popWindow')){
               document.body.removeChild(document.querySelector("div#popWindow"));
             }
         //create  div#popWindow 和 二个 input 
              var absDiv = document.createElement('div') ;
                  absDiv.id = "popWindow" ; 
                  absDiv.style.top = eObj.pageY + 'px' ; //eObj外层作用域的onclick函数传来的事件对象
              var closeUp = document.createElement('input') ;
              var closeDn = document.createElement('input') ;
              closeUp.id = 'closeUp' ;
              closeDn.id = 'closeDn' ;
              closeDn.value = closeUp.value = "关闭本窗" ;
              closeDn.type = closeUp.type = "button" ;
              closeDn.onclick = closeUp.onclick = function(){
                document.body.removeChild(document.querySelector("div#popWindow"));
              } ;
              absDiv.appendChild(closeUp);
              absDiv.appendChild(closeDn);
 
              document.body.appendChild(absDiv) ; 
        }  // end of popWindow function

     } ,
     showReading:function(){
       my$("#reading").textContent = "" ;
       let paras1 = Model.contentArr[4].split("\n");
       let paras = [] ;
       let j = 0 ;
       for(let i=0 ; i < paras1.length ; i++){
         paras1[i]= paras1[i].trim();
         if(paras1[i] =="" || paras1[i] == "\r"){
             
         }else{
            paras[j] = paras1[i];
            j++ ;
         }
       }
            
          for (let i=0; i< paras.length; i++ ){
           let p = document.createElement("p");
           let b = document.createElement("b");
           var no;
               no = (i+1) ;
           b.textContent =  "理论阅读: "+Model.lessonId +"."+ no ;
           my$("#reading").appendChild(b);
            var bt = undefined ;
           //下面实现分析paras[i]，若有配图tag:<img src=...>，则动态创建一个按钮，用户点击按钮才能插入该配图。
           if(paras[i].substring(0,4)=='<img'){
             let src = paras[i].substring(paras[i].search('=')+1,paras[i].search('>'));
              bt = document.createElement("input");
              bt.type = "button" ; 
              bt.id = Model.getUrlPath() + src ;
              bt.value = "嵌入插图" ;
              
              bt.onclick = function(){
                let img = document.createElement("img");
                img.src = this.id ;
                //document.body.appendChild(img);
                //window.open(img.src);
                img.onload = function(){
                 if (this.width >= window.innerWidth -20 ||this.width > 800-20){
                    if(window.innerWidth <= 800){
                        this.width = window.innerWidth - 20 ;
                    } else{
                        this.width = 800 - 20 ;
                    }
                  }
                };
                this.parentNode.appendChild(document.createElement("br"));
                this.parentNode.appendChild(img);
                this.parentNode.removeChild(this);
                };
           }
          if(bt){
            p.appendChild(bt);
            paras[i] = paras[i].substring(paras[i].search('>')+1);
          }
           let txt = document.createTextNode(paras[i]);
           p.appendChild(txt); 
           my$("#reading").appendChild(p);
             }//end for loop
     } ,
     showAll: function(){
               var that = this ;
               setTimeout(that.showTitle,500) ;
               setTimeout(that.showIntroduction,500*2) ;
               setTimeout(that.showKeyword,500*3) ;
               setTimeout(that.showProject,500*4) ;
               setTimeout(that.showReading,500*5) ;
               
             },
     popWindow: function(codeString){
         var popWindowDom = document.querySelector('div#popWindow');
         
         var codeParas = codeString.split('\n') ;
             //console.log(codeParas);
             
         for(let i=0 ;i<codeParas.length;i++){
           let para = codeParas[i] ;
           //去掉每段多余的\r符号
           if(para[para.length-1] === '\r'){
            codeParas[i] = para.substring(0,para.length-1)  ;
           }
         }
         /***下面是一个很好的程序改错题，意图实现去掉每段多余的\r符号，但代码没有达到目标
         for (let para of codeParas){
          if(para[para.length-1] === '\r'){
            para = para.substring(0,para.length-1) ;
           }
         }
         ***/
          //console.log(codeParas);
        let nextLineisComment = false ;
        for (let para of codeParas){
          //console.log(para); //为降低分析代码的复杂性，我们对每一行代码的外观，进行Web页DOM对象的动态生产，
          let pDom = document.createElement('p'); 
          let aLineWords = [];
          let isWord = false ;
           for(let j=0; j<para.length; j++) {
             let ch = para[j] ;
             if(!isWord){//不是真单词，是空白符，这是处理空白符模块
                if(ch === ' '){
                  aLineWords.push(" ") ;
                  continue ;
                }
               if(ch ==="\t"){
                 for(let k=0;k<4;k++){
                   aLineWords.push(" ") ; 
                 } 
                  continue ;
                }
               //上面二个if逻辑不成立，说明一定是非空白符，是真单词的开始

                isWord = true ;
                aLineWords.push(ch) ;
             }else{ //else代码模块，处理真单词情况
                if(ch.trim()!== ''){
                   aLineWords[aLineWords.length -1] += ch ;
                  } else {//else逻辑表明碰上空白符，
                  isWord = false ;
                  if(ch==="\t"){
                    for(let k=0;k<4;k++){
                      aLineWords.push(" ")  ;
                    } 
                   }else{
                      aLineWords.push(" ") ; 
                   }
                }
              }
             }//把一段文本处理为单词数组aLineWords的循环结束


            const keyWords = ['var' , 'let','const','if' ,'else' ,'{' ,'}','(',')','[',']','for','let','while','function', '\'', '\"' ,'switch','break' ,'new'];
            const operator = ['+','-','*','/','=','==','===','%','+=','-=' ,'>','<','>=','<=','||','&&',':'] ;
            let thisLineisComment = false ;  
            for(let word of aLineWords){
              let wordDom = null ;
               if(word === ' '){
                wordDom = document.createElement('span');
               }else {
                wordDom = document.createElement('div');
                 if(thisLineisComment || nextLineisComment){
                  wordDom.className = "comment" ;  
                 }
                  wordDom.className += " codeWord" ;
                }   
                 /*
                  for(let key of keyWords){
                    if (word === key){
                      wordDom.className += " keyWord" ;
                      break ;
                    }
                  }
                  for(let op of operator){
                    if (word === op){
                      wordDom.className += " operator" ;
                      break ;
                    }
                  }
                  还没有能力做到正确且全面地分析关键字和运算符的颜色*/
                  //下面实现案例的注释为绿色，技术实现上是通过合并CSS样式中的comment类
                  // 本课程代码comment 表示情况，以 '//','/*', '<!--','<title>' 开头
                 
                  if(word.substring(0,2) === '//'|| word.substring(0,4) === '<!--'){
                    wordDom.className = "comment" ;  
                    thisLineisComment = true ;
                  }else if(word.substring(0,2) === '/*' || word.substring(0,7).trim() === '<title>'){
                            wordDom.className = "comment" ;
                            thisLineisComment = true ;  
                            nextLineisComment = true ;
                   }
                  if(word.substring(word.length-2) === '*/' || word.substring(word.length-8) === '</title>' ){
                    nextLineisComment = false ;
                  }
                  wordDom.textContent = word ;
              pDom.appendChild(wordDom);  
            } //循环aLineWords数组结束  
             popWindowDom.appendChild(pDom) ; 
              // add the paragraph  dom to div#popWindow
           }  //源代码的每段落分别输出结束    
         },//End of popWindow
    };//end of UI
 
    


   var Model = {
      maxId : 20 ,
      lessonId : 0 ,
      contentArr : [] ,
      processAjaxTxt : (theText) => {
        let keyString = ['1.title','2.introduction','3.keyword','4.project','5.reading'] ;
        let arr = [];
        let i,begin,end ;
        for( i=0; i < keyString.length - 1 ; i++) {
          begin = theText.search(keyString[i]) +keyString[i].length;
          end = theText.search(keyString[i+1]) ;    
          arr[i] = theText.substring(begin,end); 
        }
          arr[i] = theText.substring(keyString[i].length+end);
          Model.contentArr = arr ;
      },
      getTextFile : function(){
        if (this.lessonId < 10){
            return 'kc0' + this.lessonId + ".txt" ;
        }else{
            return 'kc' + this.lessonId + ".txt" ;
        }
      },
      getUrlPath : function(){
        if (this.lessonId < 10){
            return 'kc0' + this.lessonId + "/" ;
        }else{
            return 'kc' + this.lessonId + "/" ;
        }
      },
      getLessonById: function(){
      var txtFile = Model.getTextFile(); //本例每一课的文本文件放在与本程序同一文件夹
       ajaxObj.xhrReq(txtFile);
       my$("h1#title").textContent = "收到 ！正 在 读 入 信 息 ..." ;
 
       setTimeout(function(){
            if (ajaxObj.content.length > 100){
                Model.processAjaxTxt(ajaxObj.content) ;
                outputUI.showAll() ;
              }else{
                setTimeout(() => {waitForAjax();} ,1000);
                //ES6的箭头函数，让异步代码也能使用lexical语法，因此上面异步代码可以访问到下面的waitForAjax函数。
              }
        },1000);
 
       function waitForAjax(){
         my$("h1#title").textContent = "网络访问卡、有延迟 ..." ;
         setTimeout(() => {Model.getLessonById();} ,1000) ;
            }
      }//Model getLessonById method
   };//End Model Object
    window.onload = function(){
   //动态控制UI，包括：针对不同屏幕的字体大小设置，主区域的高度设置
     var fontSize =  Math.floor(window.innerWidth/100) ;
      
       switch (fontSize){
      case 17 :	 case 16 :	 case 15 : 
        fontSize =  fontSize*1.2; break;
        case 14 :	 case 13 : 	 case 12 :
        case 11 : fontSize =  fontSize*1.5; break;
      case 10 : fontSize =  fontSize*2.0 ; break;
      case 9 :  fontSize =  fontSize*2.2; break;
      case 8 :  fontSize =  fontSize*2.5; break;
      case 7 :  fontSize =  fontSize*2.8 ; break;
      case 6 :  fontSize =  fontSize*3.1 ; break;
      case 5 :  fontSize =  fontSize*3.5 ; break;
      case 4 :  fontSize =  fontSize*3.8 ; break;
      default : fontSize =  fontSize*3.9 ; break;
       }
       document.body.style.fontSize = fontSize + "px" ;
    
  
   //下面使用ajaxObj.xhrReq("kc01.txt")让第一课的内容页面准备好后，当用户点击输入框后，大概率访问第一课，则无需再作ajax访问
    ajaxObj.xhrReq("kc00.txt");
    Model.getLessonById() ;
    setTimeout(function(){outputUI.showAll();},1000);
  
    my$("input#lessonId").onclick = function(){
      var id = Model.lessonId ;
      this.value = 1 + id ;
      Model.lessonId =  1 + id ;
      Model.getLessonById();
      outputUI.showAll();
      };

    my$("input#lessonId").addEventListener("change",function(){
        //console.log(this.value);
        var lessonId =  parseInt(this.value) ;
        if ( lessonId < 0 || lessonId > Model.maxId || !lessonId ){
          this.value = 0 ;
          Model.lessonId = 0 ;
        }else{//end of 输入错误
            Model.lessonId = lessonId ;
             }
         Model.getLessonById();
       },true);
    
    
    my$("input#next").addEventListener("click",function(){
        //console.log(lessonId.value);
     my$("input#lessonId").onclick = function(){
     };
      var lessonIdDom = my$("input#lessonId") ;
      if (!parseInt(lessonIdDom.value)){
       lessonIdDom.value = 0 ;
      }
      Model.lessonId =  parseInt(lessonIdDom.value) +1;
      if (Model.lessonId > Model.maxId){
        Model.lessonId = 0 ;
      }
      lessonIdDom.value = Model.lessonId ;
      Model.getLessonById();
     }
      ,true);
 
    my$("input#prev").addEventListener("click",function(){
      my$("input#lessonId").onclick = function(){};
      var lessonIdDom = my$("input#lessonId") ;
      if (!parseInt(lessonIdDom.value)){
       lessonIdDom.value = 0 ;
      }
      Model.lessonId =  parseInt(lessonIdDom.value) -1 ;
      if (Model.lessonId < 0){
        Model.lessonId = Model.maxId ;
      }
      lessonIdDom.value = Model.lessonId ;
     
      Model.getLessonById();
    },true);
 
   };//end of window.onload
  function my$(para){
       if(!para){
         throw para + "Wrong Selector para,you get nothing !" ;
       }
    var dom = document.querySelectorAll(para) ;
    if (dom.length > 1){
          console.log("you got Dom Array list reference.");
          return dom ;
    }else{
       dom = document.querySelector(para) ;
        if (dom){
          console.log("you get a Dom reference.");
          return dom ;
        }else{
          throw para + " : wrong Selector para,you get nothing !" ;
        }
    }
   }//end of my$
