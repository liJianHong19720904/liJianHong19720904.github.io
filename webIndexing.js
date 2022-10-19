//ajxObj 全局对象,用来读取外部文本文件（含源代码文件）
var ajaxObj = {
     content: [] ,
     xhrReq : (url) =>  {
         ajaxObj.content = [] ;  
         // 每次新的http请求前，将本对象上次访问的结果删除
         let xhr = new XMLHttpRequest();
          xhr.onreadystatechange = myCallback ;
          //console.time('AjaxTime');
          xhr.open('GET', url, true);
          xhr.send('');
        function myCallback(){ 
//myCallback函数是定义在ajaxObj.xhrReq内部的函数，本函数是为xhr对象的onreadystatechange事件属性，设计的回调事件处理函数。
//1.在每次htttp请求中，onreadystatechange事件一般会陆续发生4次，同时更改xhr.readyState值,我们的代码则可以根据readyState值得到当前异步访问的进展，同时提供响应代码。
//2.由于网络或其他可能的问题，Ajax请求也许会不成功，xhr的onreadystatechange事件会被触发1、2、3次（不成功）或4次（成功），成功的Ajax请求，本myCallback函数会被执行4次。
      // console.log("Ajax state changed : "+ xhr.readyState);
       if (xhr.readyState ===0 ){
          console.log("HTTP请求无法发送，断网了？");
          //console.timeEnd("AjaxTime");
          
          return ;
       }
       if (xhr.readyState === 1 ){

      //  console.log("Beign connecting...");

           return ;
       } 
       if (xhr.readyState === 2 ){
      //     console.log("Loading...");
      //     console.timeEnd("AjaxTime");
      //     console.time('AjaxTime');
           return ;
       } 
       if (xhr.readyState === 3 ){
       //    console.log("Interacting... ");
       //    console.timeEnd("AjaxTime");
       //    console.time('AjaxTime');
           return ;
       } 
       if (xhr.readyState === 4 ){
           console.log("Ajax is complete .");
           //console.timeEnd("AjaxTime");
           if (xhr.status !== 200){
               console.log("Get file from Server failed ! ");
               return ;
           }else{
                ajaxObj.content = xhr.responseText; //全局变量ajaxObj
             } // success of GET TXT
            }//readyState === 4
       }//end of myCallback	     
     }//end of xhrReq methoed   
    };//end of ajaxObj definition
   /****
   上面ajax对象由Mode操控，读取的文本,处理后，会存放在Model.contentArr数组中，
   与index.html内的article的结构匹配： 
   title指标题区  
   introduction 指摘要或介绍   
   keyword指关键字   
   project指案例区   
   reading指拓展阅读区
   ***/
   var outputUI = {
     showTitle:function(){
       let titleTxt = Model.contentArr[0]; 
       //title信息中，格式为：English（中文），下面用异步代码实现中英文与用户鼠标的互动
       //console.log(titleTxt) ;
       let pos1 =  titleTxt.indexOf('（') ;
       let pos2 = titleTxt.indexOf('）');
       let titleEn = titleTxt.substring(0,pos1) ;
       let titleCn = titleTxt.substring(pos1+1,pos2) ;
       my$("#title").textContent = titleEn ;
       my$("#title").onmousemove = function(){
         this.textContent = titleCn ;
       };
       my$("#title").onmouseout = function(){
        this.textContent = titleEn ;
      };
      //最后一句，修补一个bug。作为可输入文本的input元素，会记住用户上次在页面的输入，但这个输入可能（比如在用户重开网页时）与我们Model中不一致
       my$("input#lessonId").value = Model.lessonId ; 
     } ,
     showIntroduction : function(){
       my$("#introduction").textContent = "";
       let parasTxt = Model.contentArr[1].split('\n');
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
      let paraTxt = Model.contentArr[2];
      let p = document.createElement("p"); 
      let b = document.createElement("b");
      let t = document.createTextNode(paraTxt);
      b.textContent =  "本课关键字 : ";
      p.appendChild(t);
      my$("#keyword").appendChild(b);
      my$("#keyword").appendChild(p);
     },
     showProject:function(){

        my$("article#project").textContent = '';
        //document.querySelector('html').className = '' ;
       let projects = Model.projects ; // Model.projects = [ [url , title]...]
       // console.log(projects);

         
      for (let i=0; i< projects.length; i++ ){
           let b = document.createElement("b");
           let p = document.createElement("p");
           var no;
               no = i+1 ;
           
          b.textContent =  "实践案例:"+Model.lessonId +"."+ no + " 《 " + projects[i][1] +" 》";
          my$("#project").appendChild(b);

            //增加“运行本例”按钮
           let bt = document.createElement("input");
            bt.type = "button" ; 
            bt.value = "运行本例" ;
            bt.url = Model.projects[i][0] ;
                     
           bt.onclick = function(eObj){
          
           //window.open(url);
            outputUI.popWindow(eObj);//立刻弹出浮动窗口，为显示案例做准备
            var popWindowDom = document.querySelector('div#popWindow');
                popWindowDom.style.backgroundColor = 'rgb(200,200,200)' ;
            var iframeDom = document.createElement('iframe');
              iframeDom.style.width = '100%' ;
              iframeDom.style.height = window.innerHeight * 0.8 + 'px' ;
              iframeDom.src = this.url ;
              popWindowDom.appendChild(iframeDom);
            };
           //增加“显示源码”按钮
           let bt1 = document.createElement("input");
            bt1.type = "button" ; 
            bt1.value = "显示源码" ;
            bt1.url =  Model.projects[i][0] ; ;
           bt1.onclick = function(eObj){
             outputUI.popWindow(eObj);//立刻弹出浮动窗口，为代码显示做准备
             var url = this.url ; 
             var typeOfFile = (url.substring(url.length - 8)).trim();
             if(typeOfFile.length > 4){
              typeOfFile = typeOfFile.substring(typeOfFile.length-4)
             }
             //alert(typeOfFile) ;
             //showCode(s)函数在本方法内部，属于函数内的函数，供bt1按钮使用将对传入的s进行分析，按源代码格式实现对页面的输出
             if (url.substring(0,4)==='http'){
              showCode("本例不是编程案例，没有源码!") ;
              document.querySelector('div#popWindow').style.top = eObj.pageY + 'px' ;
             }
             if( typeOfFile === 'html' || typeOfFile === '.txt' ||  typeOfFile === '.css'  ||  typeOfFile.substring(1) === '.js'){
              //"Get Code ..."
              ajaxObj.xhrReq(this.url) ;
              setTimeout(()=>{
                //console.log(ajaxObj.content) ; 
                showCode( ajaxObj.content );} ,500)  ;
             }else{
              showCode(" 本例不是编程案例，没有源码! \n 本例不是编程案例，没有源码!") ;
              document.querySelector('div#popWindow').style.top = eObj.pageY + 'px' ;
             }
             
          };//“显示源码”的onclick事件函数
      

          
          //用户点击时不可能马上能获取网络上的项目文档，下面的3条代码提前把项目读取到浏览器缓存
          waitForProjects(i) ;
          function waitForProjects(){
           ajaxObj.xhrReq(Model.projects[i][0]) ;
           }

      
         
           let txt = document.createTextNode("本例简介："+ projects[i][2]);
            p.appendChild(bt);
            p.appendChild(bt1);
            p.appendChild(txt); 
           my$("#project").appendChild(p);
       }//end for loop for every Porject


        function  showCode(codeString) {
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

          //console.log(codeParas);
         
     const keyWords = ['{' ,'}','(',')','[',']'];
     //目前还未在JavaScript代码层面完成operators的分析
     const operators = ['+','-','*','/','=','%','>','<','|','&','.','\\',':','!'] ;
     let nextLineisComment  ;
     let thisLineisComment  ; 
         for (let para of codeParas){
           //console.log(para); //为降低分析代码的复杂性，我们对每一行代码的外观，动态生产Web页p元素DOM对象
           let pDom = document.createElement('p'); 
           let aLineWords = [];
           let isBlank = true ;
      
            for(let j =0 ;j<para.length;j++){
              let ch = para[j] ;
                //刚进入段落，是空白符模式，这是处理空白符模块
                 switch(ch){
                  case ' ' : aLineWords.push(" ") ;
                             isBlank = true ;
                             continue ;
                  case '\t' : for(let k=0;k<4;k++){
                               aLineWords.push(" ") ; 
                              } 
                              isBlank = true ;
                              continue ;
                  default :   if(isBlank){
                               aLineWords.push(ch) ;
                               isBlank = false ;
                              }else{
                                if(keyWords.indexOf(ch) !==-1 && para[j-1]!=' '){
                                 aLineWords.push(" ") ;
                                 isBlank = true ; 
                                 aLineWords.push(ch) ;
                                 if(para[j+1]!=' '){
                                  aLineWords.push(" ") ;
                                 }
                                }else{
                                  aLineWords[aLineWords.length-1] += ch ;
                                }
                              
                              }
                       } // switch 结束
           } // 把一段文本处理为单词数组aLineWords的循环


            if(nextLineisComment){
              thisLineisComment = true ;
            } 
          
            for(let word of aLineWords){
                //下面实现案例的注释统一颜色，技术实现上是通过合并CSS样式中的comment类
                // 本课程代码comment 表示情况，以 '//','/*', '<!--','<title>' 开头
                if(word.substring(0,2) === '//'|| word.substring(0,4) === '<!--'){
                       thisLineisComment = true ;
                  }else if(word.substring(0,2) === '/*' || word.substring(0,7) === '<title>'){
                       thisLineisComment = true ;  
                       nextLineisComment = true ;
                       } 
                if(word.substring(word.length-2) === '*/' || word.substring(word.length-8) === '</title>' ){
                       thisLineisComment = true ; 
                       nextLineisComment = false ;
                    }


                let wordDom = null ;
                 wordDom = document.createElement('span');
                 if(thisLineisComment){
                    wordDom.className = "comment" ;  
                  }else{
                    wordDom.className = "codeWord" ;
                     if(keyWords.indexOf(word) !== -1){
                      wordDom.className = " keyWord" ;
                      }
                  }
                   
                 
               wordDom.textContent = word ;
               pDom.appendChild(wordDom);  
             } //循环aLineWords数组结束  
              popWindowDom.appendChild(pDom) ; 
             if(!nextLineisComment){
                thisLineisComment = false ;
              } 
               // add the paragraph  dom to div#popWindow
            }  //源代码的每段落分别输出结束    
        }//End of showCode function

     } , //end of showProject
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
              let lessonUrl = Model.getUrlPath(Model.lessonId);
                 
              bt.id = lessonUrl + '/' + src ;
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
               setTimeout(outputUI.showTitle,200) ;
               setTimeout(outputUI.showIntroduction,200*3) ;
               setTimeout(outputUI.showKeyword,200*5) ;
               setTimeout(outputUI.showProject,200*7) ;
               setTimeout(outputUI.showReading,200*9) ;
               
             },
      popWindow: function(eObj) { //eObj参数由调用本函数的事件处理函数onclick的参数，通过lexical语法传至本popWindow函数
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
             } , // end of popWindow method
    };//end of UI
 
    


   var Model = {
      maxId : 20 ,
      lessonId : 0 ,
      contentArr : [] ,
      projects : [] , //存放本课项目文件的地址和标题，[ [url,title,content] , ... ]
      processAjaxTxt : (theText) => {
        let keyString = ['1.title','2.introduction','3.keyword','4.project','5.reading'] ;
        let arr = [];
        let i,begin,end ;
        for( i=0; i < keyString.length - 1 ; i++) {
          begin = theText.indexOf(keyString[i]) + keyString[i].length;
          end = theText.indexOf(keyString[i+1]) ;    
          arr[i] = theText.substring(begin,end); 
        }
          arr[i] = theText.substring(keyString[i].length + end);

          for(let a of arr){
            if (a.trim() !== ''){
              Model.contentArr.push(a.trim()) ;    
            }
          }
          
      },

     getLessonById: function(){
       var txtFile = getTextFile(Model.lessonId); 
       //本例每一课的文本文件放在与index.html同一文件夹
       ajaxObj.xhrReq(txtFile);
       my$("h1#title").textContent = "收到 ！正 在 读 入 信 息 ..." ;
       Model.contentArr = [] ; //读入新的课程前，清空Model中的旧课程内容
       Model.projects = [] ;  //读入新的课程前，清空Model中的旧项目内容
       setTimeout(function(){
            document.querySelector('html').className = '' ;
            if (ajaxObj.content.length > 100){
                Model.processAjaxTxt(ajaxObj.content) ;
                //生成Model.projects
                processProjects() ;
                
                outputUI.showAll() ;
                document.querySelector('html').className = 'loaded' ;
              }else{
                setTimeout(() => {waitForAjax();} ,2000);
    //ES6的箭头函数，让异步代码也能使用lexical语法，因此上面异步代码可以访问到下面的waitForAjax函数。
              }
        },500);



        function getTextFile(id){
          if (id < 10){
              return 'kc0' + Model.lessonId + ".txt" ;
          }else{
              return 'kc' + Model.lessonId + ".txt" ;
          }
        }

       function waitForAjax(s){
         if(!s){
          s = "请等待，课程还未成功加载。不过，等久了或需刷新页面。" ;
         } 
         my$("h1#title").textContent = s ;
         setTimeout(() => {
           Model.getLessonById();
         } ,1000) ;
       }


       
       function processProjects(){
        let projects = [] ;
        let ppp = Model.contentArr[3].split('\n');
           for(let p of ppp){
           if (p.trim() !== ''){
             projects.push(p.trim()) ; 
         //  p.trim()防止kc??.txt文本中描述的前后空白，避免下面代码无法准确获取文件名
           }
          }
       

        for(let proTxt of projects){
           //console.log(proTxt) ;
           let fileName = proTxt.substring(7,proTxt.indexOf(' title')) ;
           //console.log(fileName) ;
           let title = proTxt.substring(proTxt.indexOf('title=') + 6 , proTxt.indexOf('>')) ;
           //console.log(title) ;
           //console.log( _getUrlPath(Model.lessonId) ) ; //
           let content = proTxt.substring(proTxt.indexOf('>')+1) ;
           
           let pro = [ Model.getUrlPath(Model.lessonId) + fileName , title , content] ;
           //console.log(pro) ;
           Model.projects.push( pro ) ;
         }
        }
  

     },//Model getLessonById method
     getUrlPath : function(id){
      if (id < 10){
          return 'kc0' + Model.lessonId + "/" ;
      }else{
          return 'kc' + Model.lessonId + "/" ;
      }
    },
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
    //ajaxObj.xhrReq("kc00.txt");
    Model.getLessonById() ;
    //setTimeout(function(){outputUI.showAll();},1000);
  
    my$("input#lessonId").onclick = function(){
      var id = Model.lessonId ;
      this.value = 1 + id ;
      Model.lessonId =  1 + id ;
      Model.getLessonById();
      
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
          //console.log("you get a Dom reference.");
          return dom ;
        }else{
          throw para + " : wrong Selector para,you get nothing !" ;
        }
    }
   }//end of my$
