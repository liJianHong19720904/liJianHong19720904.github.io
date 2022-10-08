var myAertTime = 0 ;
function myAlert(s){
    var headerDom = document.querySelector('header') ;
    var outputDom = document.createElement("p") ;
        outputDom.style.color = 'rgb(0,200,200)' ;
        outputDom.style.letterSpacing = '0em' ;
        myAertTime ++ ;
        outputDom.textContent =   myAertTime + '、' +s ;
        headerDom.appendChild(outputDom) ;

 }