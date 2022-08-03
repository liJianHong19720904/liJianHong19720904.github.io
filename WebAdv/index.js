    var ajaxObj = {
     content: [] ,
     xhrReq : function(url){
         this.content = [] ;
         var theText = "" ;
         var xhr = new XMLHttpRequest();
          xhr.onreadystatechange = myCallback ;
          console.time('AjaxTime');
          xhr.open('GET',url,true);
          xhr.send('');
      function myCallback(){
 // myCallback函数将执行四次，因此本语句会被执行4次,对应xhr 的onreadystatechange的事件发生，xhr的属性readyState也会变化4次
       console.log("Ajax state changed : "+ xhr.readyState);
       if (xhr.readyState ===0 ){
           console.log("Ajax is uninitialized.");
           console.timeEnd("AjaxTime");
           return ;
       }
       if (xhr.readyState === 1 ){
           console.log("Ajax beign Loading...");
           console.timeEnd("AjaxTime");
           console.time('AjaxTime');
           return ;
       } 
       if (xhr.readyState === 2 ){
           console.log("Ajax has Loaded .");
           console.timeEnd("AjaxTime");
           console.time('AjaxTime');
           return ;
       } 
       if (xhr.readyState === 3 ){
           console.log("Ajax can be interactive .");
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
                theText = xhr.responseText ;
                let keyString = ['1.title','2.introduction','3.keyword','4.project','5.reading'] ;
                let arr = [];
                let i,begin,end ;
                for( i=0; i < keyString.length - 1 ; i++) {
                   begin = theText.search(keyString[i]) +keyString[i].length;
                   end = theText.search(keyString[i+1]) ;    
                   arr[i] = theText.substring(begin,end); 
                }
                arr[i] = theText.substring(keyString[i].length+end);
                ajaxObj.content = arr;//全局变量ajaxObj
             } // success of GET TXT
            }//readyState === 4
          }//end of myCallback	     
     }//end of xhrReq methoed
    };//end of ajaxObj definition
   /****
   上面ajax读取的文本与index.html内的article的结构匹配 
   title指标题区  introduction 指摘要或介绍   keyword指关键字   project指案例区   reading指拓展阅读区
   ***/
    var outputUI = {
     showTitle:function(){
        var titleTxt = ajaxObj.content[0];
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
       var parasTxt = ajaxObj.content[1].split('\n');
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
      var paraTxt = ajaxObj.content[2];
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
       var paras1 = ajaxObj.content[3].split("\n");
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
               b.textContent =  "案例实践:"+Model.lessonId +"."+ no ;
           my$("#project").appendChild(b);
 
           let bt = document.createElement("input");
           bt.type = "button" ; 
           bt.id = paras[i].substring(7,paras[i].search('>')) ;
           bt.value = "运行本例" ;
           bt.onclick = function(){
            var url ;
             if(this.id.substring(0,4)==='http'){
               url = this.id ;
             }else{
               url = Model.getUrlPath() + (this.id)  ;
             }
             window.open(url);
           };
           paras[i] = paras[i].substring(paras[i].search('>')+1) ;
           let txt = document.createTextNode("本例简介："+paras[i]);
            p.appendChild(bt);
            p.appendChild(txt); 
           my$("#project").appendChild(p);
             }//end for loop
 
     } ,
     showReading:function(){
       my$("#reading").textContent = "" ;
       let paras1 = ajaxObj.content[4].split("\n");
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
               setTimeout(that.showTitle,300) ;
               setTimeout(that.showIntroduction,300*2) ;
               setTimeout(that.showKeyword,300*3) ;
               setTimeout(that.showProject,300*4) ;
               setTimeout(that.showReading,300*5) ;
               
             }
    };//end of UI
 
    


   var Model = {
      maxId : 19 ,
      lessonId : 0 ,
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
      var txtFile = Model.getTextFile();
       ajaxObj.xhrReq(txtFile);
       my$("h1#title").textContent = "收到 ！正 在 读 入 信 息 ..." ;
 
       setTimeout(function(){
              if (ajaxObj.content.length > 1){
                outputUI.showAll();
              }else{
                setTimeout(function(){outputUI.showAll();},1000);
              }
        },600);
 
        showInfo();
               function showInfo(){
                 var tips = my$("#info") ;
                     setTimeout(function(){
                         tips.style.background = "black" ;
                     },1000*1.6)
                 
               }
      }//Model getLessonById method
   };//End Model Object
    window.onload = function(){
   //动态控制UI，包括：针对不同屏幕的字体大小设置，主区域的高度设置
     var fontSize =  Math.floor(window.innerWidth/100) ;
       //alert("window.innerWidth:"+window.innerWidth);
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
    setTimeout(function(){outputUI.showAll();},1000);
  
    my$("input#lessonId").onclick = function(){
      this.value = 1 ;
      Model.lessonId = 1;
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
 
    /*
    my$("input#homework").onclick = function(){
     var url = "cs2020/index.html" ;
     window.open(url);
    };
    */

   };//end of window.onload
   function my$(para){
       if(!para){
         throw para + "Wrong Selector para,you get nothing !" ;
       }
    var dom = document.querySelectorAll(para) ;
    if (dom.length > 1){
          console.log("you get Dom Array list reference.");
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
